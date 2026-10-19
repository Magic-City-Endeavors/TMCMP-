/**
 * test.mjs — local protocol test for the Best Finds Daily MCP server.
 *
 * Imports the Worker's fetch handler directly and drives it with the same
 * Request/Response objects the Worker runtime would use (Node 18+ ships
 * compatible globals via undici), then exercises the full MCP handshake:
 *
 *   initialize -> notifications/initialized -> ping -> tools/list
 *   -> tools/call for each of the four tools (incl. two search_deals runs)
 *   -> an unknown method, which must come back as a JSON-RPC error
 *
 * Run:  node test.mjs        (or: npm test)
 * Exit code is 0 only if every check passes.
 */

import worker from "./worker.js";
import { TEMU_TOP5 } from "./data.js";

const ENDPOINT = "https://mcp.bestfindsdaily.example/mcp";

let passed = 0;
let failed = 0;
function check(label, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`PASS  ${label}`);
  } else {
    failed++;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/** POST one JSON-RPC message through the handler; return {res, body}. */
async function rpc(message, sessionId) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  const res = await worker.fetch(
    new Request(ENDPOINT, { method: "POST", headers, body: JSON.stringify(message) })
  );
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* leave body null; the checks below will fail loudly */
  }
  return { res, body };
}

// --- GET info -------------------------------------------------------------
{
  const res = await worker.fetch(new Request(ENDPOINT, { method: "GET" }));
  const info = await res.json();
  check("GET returns endpoint info", res.status === 200 && info.name === "best-finds-daily" && Array.isArray(info.tools));
}

// --- initialize -------------------------------------------------------------
const init = await rpc({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-11-25",
    capabilities: {},
    clientInfo: { name: "mcp-server-test", version: "0.1.0" },
  },
});
const sessionId = init.res.headers.get("Mcp-Session-Id");
check("initialize: HTTP 200", init.res.status === 200, `got ${init.res.status}`);
check(
  "initialize: protocolVersion 2025-11-25",
  init.body?.result?.protocolVersion === "2025-11-25",
  JSON.stringify(init.body?.result || init.body)
);
check("initialize: serverInfo name/version", init.body?.result?.serverInfo?.name === "best-finds-daily" && init.body?.result?.serverInfo?.version === "1.0.0");
check("initialize: tools capability", typeof init.body?.result?.capabilities?.tools === "object");
check("initialize: Mcp-Session-Id issued", typeof sessionId === "string" && sessionId.length > 0);

// --- notifications/initialized ----------------------------------------------
{
  const { res } = await rpc({ jsonrpc: "2.0", method: "notifications/initialized" }, sessionId);
  check("notifications/initialized: HTTP 202, no body", res.status === 202);
}

// --- ping ---------------------------------------------------------------------
{
  const { body } = await rpc({ jsonrpc: "2.0", id: 2, method: "ping" }, sessionId);
  check("ping: empty result", body?.result && Object.keys(body.result).length === 0 && !body.error);
}

// --- tools/list -----------------------------------------------------------------
let toolNames = [];
{
  const { body } = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/list", params: {} }, sessionId);
  toolNames = (body?.result?.tools || []).map((t) => t.name);
  check(
    "tools/list: exactly the 4 expected tools",
    JSON.stringify([...toolNames].sort()) ===
      JSON.stringify(["get_daily_briefing", "get_deal_hubs", "get_temu_top5", "search_deals"]),
    toolNames.join(",")
  );
  check(
    "tools/list: every tool has a valid inputSchema",
    (body?.result?.tools || []).every((t) => t.inputSchema?.type === "object")
  );
}

// --- tools/call helpers -----------------------------------------------------------
async function callTool(id, name, args = {}) {
  const { body } = await rpc(
    { jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } },
    sessionId
  );
  return body?.result;
}
function toolText(result) {
  return (result?.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
}

// --- get_daily_briefing (live fetch, or the labelled cached fallback) --------------
{
  const result = await callTool(4, "get_daily_briefing");
  const text = toolText(result);
  check("get_daily_briefing: text content returned", !result?.isError && text.length > 50, text.slice(0, 80));
  check("get_daily_briefing: mentions Best Finds Daily", text.includes("Best Finds Daily"));
}

// --- get_temu_top5 -------------------------------------------------------------------
{
  const result = await callTool(5, "get_temu_top5");
  const text = toolText(result);
  check("get_temu_top5: all 5 items present", ["USB-C Flash Drive 128GB", "Men's Sweatpants 2-Pack", "1080P Portable Security Camera", "Genuine Leather Wallet Gift Box Set", "1500W Tower Space Heater"].every((s) => text.includes(s)));
  check("get_temu_top5: promo code + disclosure line", text.includes("Prices as of Oct 18, 2026; extra 30% off with code aln767451. #ad — I may earn a commission."));
  check("get_temu_top5: storefront link", text.includes("https://temu.to/k/p3e7nhnlelp"));
}

// --- get_deal_hubs ----------------------------------------------------------------------
{
  const result = await callTool(6, "get_deal_hubs");
  const text = toolText(result);
  check(
    "get_deal_hubs: all 8 hubs present",
    [
      "all-hubs-ot69dg4tutxe",
      "amazon-finds-hub-wz69dtxohxr82",
      "deals-hub-x0xz6fpjxuxxxvixt",
      "temu-finds-hub-xqp6fsx03xcgxlxq",
      "business-growth-hub-rp69xe4658jxl",
      "bestfindswithgreg.blogspot.com",
      "t.me/Bestfindswithgreg",
      "best-finds-daily.kit.com/profile",
    ].every((s) => text.includes(s))
  );
}

// --- search_deals: keyword ---------------------------------------------------------------
{
  const result = await callTool(7, "search_deals", { query: "headphones" });
  const text = toolText(result);
  check("search_deals 'headphones': verified-only — no Bose or stale price", text.includes("No verified deals") && !text.includes("Bose") && !text.includes("$169.00") && !text.includes("$190 off"));
}

// --- search_deals: budget ------------------------------------------------------------------
{
  const result = await callTool(8, "search_deals", { max_price: 50 });
  const text = toolText(result);
  check("search_deals max_price 50: includes Stanley tumbler $40.00", text.includes("Stanley Quencher tumbler") && text.includes("$40.00"));
  check("search_deals max_price 50: excludes unverified Bose entry", !text.includes("Bose"));
}

// --- unknown method ---------------------------------------------------------------------------
{
  const { body } = await rpc({ jsonrpc: "2.0", id: 9, method: "no/such-method" }, sessionId);
  check("unknown method: JSON-RPC error -32601", body?.error?.code === -32601, JSON.stringify(body?.error || {}));
}

// --- unknown session id -------------------------------------------------------------------------
{
  const { res } = await rpc({ jsonrpc: "2.0", id: 10, method: "ping" }, "not-a-real-session");
  check("unknown session id: HTTP 404", res.status === 404, `got ${res.status}`);
}

// ===========================================================================
// Alexa Skills Kit (ASK) adapter — the custom skill posts ASK envelopes to
// the same endpoint. Each case asserts non-empty speech and data grounding.
// ===========================================================================

async function ask(payload) {
  const res = await worker.fetch(
    new Request(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* leave null; checks fail loudly */
  }
  return { res, body };
}
function askEnvelope(request) {
  return {
    version: "1.0",
    session: {
      new: false,
      sessionId: "amzn1.echo-api.session.test",
      application: { applicationId: "amzn1.ask.skill.18480163-685a-4b01-8c1b-5951b6fda33b" },
      user: { userId: "amzn1.ask.account.test" },
    },
    context: {},
    request,
  };
}
function intentEnvelope(name, slots) {
  const intent = { name, confirmationStatus: "NONE" };
  if (slots) intent.slots = slots;
  return askEnvelope({
    type: "IntentRequest",
    requestId: "amzn1.echo-api.request.test",
    timestamp: "2026-10-19T13:00:00Z",
    locale: "en-US",
    intent,
  });
}
function speechOf(body) {
  return body?.response?.outputSpeech?.text || "";
}

const topItem = TEMU_TOP5.items[0];

// --- LaunchRequest ----------------------------------------------------------------
{
  const { res, body } = await ask(
    askEnvelope({ type: "LaunchRequest", requestId: "r-launch", timestamp: "2026-10-19T13:00:00Z", locale: "en-US" })
  );
  const speech = speechOf(body);
  check("ASK launch: HTTP 200 + version 1.0", res.status === 200 && body?.version === "1.0");
  check("ASK launch: speech names today's top find + verified price", speech.includes(topItem.name) && speech.includes(topItem.priceLabel), speech.slice(0, 120));
  check("ASK launch: session open with reprompt", body?.response?.shouldEndSession === false && (body?.response?.reprompt?.outputSpeech?.text || "").length > 0);
  check("ASK launch: card carries the storefront URL, speech does not speak it", (body?.response?.card?.content || "").includes(topItem.url) && !speech.includes("http"));
}

// --- TodaysBriefingIntent ------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("TodaysBriefingIntent"));
  const speech = speechOf(body);
  check("ASK briefing: speakable length + names Best Finds Daily", speech.length > 50 && speech.includes("Best Finds Daily"), speech.slice(0, 120));
  check("ASK briefing: no URLs spoken", !speech.includes("http"));
}

// --- TopFindIntent ----------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("TopFindIntent"));
  const speech = speechOf(body);
  check("ASK top find: item #1 name + price verbatim", speech.includes(topItem.name) && speech.includes(topItem.priceLabel), speech.slice(0, 120));
  check("ASK top find: promo code spoken", speech.includes(TEMU_TOP5.promoCode));
}

// --- TemuTopFiveIntent ---------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("TemuTopFiveIntent"));
  const speech = speechOf(body);
  check(
    "ASK temu top 5: all five names + prices spoken",
    TEMU_TOP5.items.every((item) => speech.includes(item.name) && speech.includes(item.priceLabel)),
    speech.slice(0, 200)
  );
}

// --- SearchDealsIntent: keyword ----------------------------------------------------------------
{
  const { body } = await ask(
    intentEnvelope("SearchDealsIntent", { query: { name: "query", value: "smart home", confirmationStatus: "NONE" } })
  );
  const speech = speechOf(body);
  check("ASK search 'smart home': verified Blink Mini + $69.99", speech.includes("Blink Mini 2K+") && speech.includes("$69.99"), speech.slice(0, 160));
  check("ASK search: URLs only in the card", !speech.includes("http") && (body?.response?.card?.content || "").includes("muse.ai/s/deals-hub"));
}

// --- SearchDealsIntent: budget words parsed ("under fifty") --------------------------------------
{
  const { body } = await ask(
    intentEnvelope("SearchDealsIntent", { query: { name: "query", value: "smart home under fifty dollars", confirmationStatus: "NONE" } })
  );
  const speech = speechOf(body);
  check(
    "ASK search 'smart home under fifty': honest no-match (only smart-home deal is $69.99)",
    speech.includes("couldn't find any verified deals") && speech.includes("under $50"),
    speech.slice(0, 160)
  );
}

// --- SearchDealsIntent: budget + match ("stanley under fifty") --------------------------------------
{
  const { body } = await ask(
    intentEnvelope("SearchDealsIntent", { query: { name: "query", value: "stanley under fifty dollars", confirmationStatus: "NONE" } })
  );
  const speech = speechOf(body);
  check("ASK search 'stanley under fifty dollars': Stanley $40.00 found", speech.includes("Stanley Quencher tumbler") && speech.includes("$40.00"), speech.slice(0, 160));
}

// --- SearchDealsIntent: digit budget ("under 10 dollars") --------------------------------------------
{
  const { body } = await ask(
    intentEnvelope("SearchDealsIntent", { query: { name: "query", value: "earrings under 10 dollars", confirmationStatus: "NONE" } })
  );
  const speech = speechOf(body);
  check("ASK search 'earrings under 10 dollars': Ediseng pair at $8.99", speech.includes("Ediseng Pumpkin Dangle Earrings") && speech.includes("$8.99"), speech.slice(0, 160));
}

// --- SearchDealsIntent: no match ---------------------------------------------------------------------------
{
  const { body } = await ask(
    intentEnvelope("SearchDealsIntent", { query: { name: "query", value: "zzqqx nonsense", confirmationStatus: "NONE" } })
  );
  const speech = speechOf(body);
  check("ASK search no-match: honest-empty speech", speech.includes("couldn't find any verified deals"), speech.slice(0, 120));
}

// --- DealHubsIntent ------------------------------------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("DealHubsIntent"));
  const speech = speechOf(body);
  const card = body?.response?.card?.content || "";
  check("ASK hubs: hub names + promo code spoken", speech.includes("Master hub") && speech.includes("Deals Hub") && speech.includes(TEMU_TOP5.promoCode), speech.slice(0, 160));
  check("ASK hubs: card carries all hub URLs", ["all-hubs-ot69dg4tutxe", "temu-finds-hub-xqp6fsx03xcgxlxq", "best-finds-daily.kit.com/profile"].every((s) => card.includes(s)));
}

// --- HelloWorldIntent ---------------------------------------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("HelloWorldIntent"));
  const speech = speechOf(body);
  check("ASK hello: greeting + today's top find", speech.startsWith("Hello!") && speech.includes(topItem.name), speech.slice(0, 120));
}

// --- AMAZON.HelpIntent ------------------------------------------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("AMAZON.HelpIntent"));
  const speech = speechOf(body);
  check("ASK help: lists the questions it answers", speech.includes("today's finds") && speech.includes("promo code") && speech.length > 50, speech.slice(0, 160));
}

// --- AMAZON.FallbackIntent / unknown intent --------------------------------------------------------------------------------------
{
  const { body } = await ask(intentEnvelope("AMAZON.FallbackIntent"));
  const speech = speechOf(body);
  check("ASK fallback: didn't-understand + reprompt, session open", speech.includes("didn't catch that") && body?.response?.shouldEndSession === false && (body?.response?.reprompt?.outputSpeech?.text || "").length > 0, speech.slice(0, 120));
  const unknown = await ask(intentEnvelope("SomeUnknownIntent"));
  check("ASK unknown intent: same fallback path", speechOf(unknown.body).includes("didn't catch that"));
}

// --- AMAZON.StopIntent / CancelIntent -------------------------------------------------------------------------------------------------
{
  const stop = await ask(intentEnvelope("AMAZON.StopIntent"));
  check("ASK stop: Goodbye + session ended", speechOf(stop.body) === "Goodbye." && stop.body?.response?.shouldEndSession === true);
  const cancel = await ask(intentEnvelope("AMAZON.CancelIntent"));
  check("ASK cancel: Goodbye + session ended", speechOf(cancel.body) === "Goodbye." && cancel.body?.response?.shouldEndSession === true);
}

// --- SessionEndedRequest ------------------------------------------------------------------------------------------------------------
{
  const { res, body } = await ask(
    askEnvelope({ type: "SessionEndedRequest", requestId: "r-end", timestamp: "2026-10-19T13:00:00Z", locale: "en-US", reason: "USER_INITIATED" })
  );
  check("ASK session ended: HTTP 200 + empty response object", res.status === 200 && body?.response && Object.keys(body.response).length === 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
