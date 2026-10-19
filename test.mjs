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
  check("search_deals 'headphones': finds Bose at mapped price", text.includes("Bose QuietComfort headphones") && text.includes("$169.00") && text.includes("$190 off"));
}

// --- search_deals: budget ------------------------------------------------------------------
{
  const result = await callTool(8, "search_deals", { max_price: 50 });
  const text = toolText(result);
  check("search_deals max_price 50: includes Stanley tumbler $40.00", text.includes("Stanley Quencher tumbler") && text.includes("$40.00"));
  check("search_deals max_price 50: excludes Bose ($169.00)", !text.includes("Bose"));
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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
