/**
 * worker.js — Best Finds Daily MCP server (Cloudflare Worker)
 *
 * A self-hosted Model Context Protocol (MCP) server over Streamable HTTP,
 * implementing MCP spec 2025-11-25 with plain JSON-RPC 2.0. It exposes the
 * live Best Finds Daily deals operation as tools that an Alexa+ agent (or
 * any MCP client) can call conversationally:
 *
 *   get_daily_briefing  today's spoken briefing, fetched live from the feed
 *   get_temu_top5       today's Temu Top 5 with prices and Greg's promo code
 *   get_deal_hubs       the curated hub directory
 *   search_deals        keyword / budget search over verified Amazon deals
 *
 * No external dependencies — Worker APIs + fetch only.
 *
 * Transport notes (Streamable HTTP, spec 2025-11-25):
 *   - POST carries JSON-RPC messages; single-message responses are returned
 *     as plain application/json bodies.
 *   - `initialize` issues an `Mcp-Session-Id` response header; the id is
 *     honoured on later requests (unknown ids get a 404, per spec).
 *   - Notifications (no `id`) are accepted with HTTP 202 and no body.
 *   - GET returns a small human/machine-readable info object for this
 *     endpoint instead of an SSE stream (this server never sends
 *     server-initiated messages, so it has nothing to stream).
 *   - Workers are stateless across isolates, so a request that arrives
 *     without a session id is still served (a documented, deliberate
 *     tolerance); a request carrying an *unknown* id is rejected, because
 *     that signals a stale or forged session rather than a fresh client.
 *   - The daily briefing is read through bindings when they exist —
 *     BRIEFING_KV (the same KV namespace the feed Worker writes) first,
 *     then the FEED_SERVICE service binding — because a plain fetch from
 *     one workers.dev Worker to another does not route. Plain fetch and
 *     then the labelled embedded snapshot remain as fallbacks.
 *   - CORS is wide open (Access-Control-Allow-Origin: *) because every
 *     datum this server serves is already public marketing copy, and
 *     browser-based MCP clients and test pages need it to call the tools.
 *   - GET /prices serves the public Amazon price map from BRIEFING_KV
 *     (key "prices:amazon", written out-of-band by
 *     scripts/update-prices.py) so hub pages can refresh the prices they
 *     display at page-open instead of relying on baked-in figures. See
 *     PRICE-PIPE.md for the whole pipe.
 *   - The same endpoint doubles as the HTTPS endpoint for the "Best Finds
 *     Daily for Alexa+" custom skill: POST bodies carrying an Alexa
 *     Skills Kit envelope (`request.type`) are answered by the ASK
 *     adapter below, reusing the same tool logic and verified data.
 */

import { TEMU_TOP5, DEAL_HUBS, DEALS, FALLBACK_BRIEFING } from "./data.js";

const PROTOCOL_VERSION = "2025-11-25";
const SERVER_INFO = { name: "best-finds-daily", version: "1.0.0" };
const FEED_URL = "https://nameless-dust-a1fc.themagiccitymeltingpot.workers.dev";

// CORS — see the transport notes in the header comment.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

// Session registry. Module-scope state is per-isolate on Cloudflare; see the
// transport notes above for why enforcement is strict only for unknown ids.
const sessions = new Set();

// ---------------------------------------------------------------------------
// Tool catalogue
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "get_daily_briefing",
    title: "Get today's Best Finds Daily briefing",
    description:
      "Returns today's Best Finds Daily briefing text (the same content the " +
      "Alexa Flash Briefing reads each morning), fetched live from the feed.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_temu_top5",
    title: "Get today's Temu Top 5",
    description:
      "Returns today's Temu Top 5 finds with prices, sold counts, links, and " +
      "Greg's promo code for an extra 30% off.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_deal_hubs",
    title: "Get the Best Finds deal hub directory",
    description:
      "Returns the directory of Best Finds with Greg link hubs (Master hub, " +
      "Amazon Finds, Deals Hub, Temu Finds, Business Growth Hub, blog, " +
      "Telegram channel, newsletter) and what each one is for.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "search_deals",
    title: "Search verified Amazon deals",
    description:
      "Searches the verified Deals Hub set by keyword and/or a maximum price. " +
      "Returns matching deals with their verified price and savings.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Keyword to match against deal names and categories, e.g. 'headphones', 'kitchen', 'under $50 gifts'. Optional.",
        },
        max_price: {
          type: "number",
          description: "Maximum price in USD; only deals at or under this price are returned. Optional.",
        },
      },
      additionalProperties: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations — each returns MCP content: [{ type: "text", text }]
// ---------------------------------------------------------------------------

function textResult(text, isError = false) {
  const result = { content: [{ type: "text", text }] };
  if (isError) result.isError = true;
  return result;
}

/** Normalise a Flash Briefing feed payload (object or JSON text) into the
 *  spoken result text. Throws when the payload holds no usable briefing. */
function briefingTextFromFeed(feed) {
  const parsed = typeof feed === "string" ? JSON.parse(feed) : feed;
  // The feed is the Alexa Flash Briefing JSON: either a bare array of
  // briefing items or an object holding one. Normalise defensively and
  // pick the most recently updated item.
  const items = Array.isArray(parsed) ? parsed : parsed.items || parsed.briefings || [parsed];
  if (!items.length) throw new Error("feed contained no briefings");
  const latest = items.reduce((a, b) =>
    String(b.updateDate || "") > String(a.updateDate || "") ? b : a
  );
  if (!latest.mainText) throw new Error("latest briefing had no mainText");

  const date = String(latest.updateDate || "").slice(0, 10);
  return `${latest.titleText || "Best Finds Daily"} — ${date}\n\n${latest.mainText}`;
}

async function toolGetDailyBriefing(args, env) {
  // Route 1 — the shared KV namespace the feed Worker writes each morning.
  // Reading KV directly is the reliable path: no Worker-to-Worker HTTP.
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("briefing", "text");
      if (stored) return textResult(briefingTextFromFeed(stored));
    }
  } catch (err) {
    // Fall through to the next route; the snapshot still protects the call.
  }

  // Route 2 — the FEED_SERVICE service binding to the feed Worker.
  try {
    if (env && env.FEED_SERVICE && typeof env.FEED_SERVICE.fetch === "function") {
      const res = await env.FEED_SERVICE.fetch(FEED_URL, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`feed responded ${res.status}`);
      return textResult(briefingTextFromFeed(await res.text()));
    }
  } catch (err) {
    // Fall through to plain fetch.
  }

  // Route 3 — plain fetch of the public feed URL. Works from outside
  // Cloudflare; from a workers.dev Worker it does not route, which is
  // exactly why routes 1–2 exist. Kept because it costs nothing to try.
  try {
    const res = await fetch(FEED_URL, {
      headers: { Accept: "application/json" },
      // The feed is refreshed every morning; a short edge cache is fine.
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    return textResult(briefingTextFromFeed(await res.text()));
  } catch (err) {
    // Never fail the conversation because the feed hiccuped: serve the
    // embedded snapshot and say plainly that it is cached.
    return textResult(
      `${FALLBACK_BRIEFING.titleText} — ${FALLBACK_BRIEFING.date} (cached copy — the live feed could not be reached just now)\n\n${FALLBACK_BRIEFING.mainText}`
    );
  }
}

function toolGetTemuTop5() {
  const lines = [
    `Today's Temu Top 5 — ${TEMU_TOP5.dateLabel}`,
    `Storefront: ${TEMU_TOP5.storefront} (code ${TEMU_TOP5.promoCode})`,
    "",
  ];
  TEMU_TOP5.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} — ${item.priceLabel} (${item.sold})`);
    lines.push(`   ${item.url}`);
  });
  lines.push("", TEMU_TOP5.disclosure);
  return textResult(lines.join("\n"));
}

function toolGetDealHubs() {
  const lines = ["Best Finds with Greg — hub directory", ""];
  for (const hub of DEAL_HUBS) {
    lines.push(`${hub.name} — ${hub.url} (${hub.description})`);
  }
  return textResult(lines.join("\n"));
}

/** Shared verified-deal matcher — the single source of truth for both the
 *  search_deals MCP tool and the Alexa (ASK) adapter below. Returns the
 *  matching entries from DEALS (held entries with `price: null` never
 *  match: no verified price, never served as a deal). */
function findDeals(rawQuery, maxPrice) {
  const query = typeof rawQuery === "string" ? rawQuery.trim().toLowerCase() : "";
  // Every query word must match somewhere in the deal's name, category or
  // keyword list — simple, predictable AND-matching for a small verified set.
  const words = query.split(/\s+/).filter(Boolean);
  return DEALS.filter((deal) => {
    // Held entries (price: null) have no verified price and are never served
    // as deals, regardless of any descriptive fields retained in the data.
    if (typeof deal.price !== "number") return false;
    if (maxPrice !== null && deal.price > maxPrice) return false;
    if (!words.length) return true;
    const haystack = [deal.name, deal.category, ...deal.keywords].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

function toolSearchDeals(args) {
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const maxPrice =
    typeof args.max_price === "number" && Number.isFinite(args.max_price)
      ? args.max_price
      : null;

  const matches = findDeals(args.query, maxPrice);

  if (!matches.length) {
    const scope = [
      query && `matching "${args.query}"`,
      maxPrice !== null && `under $${maxPrice.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join(" ");
    return textResult(
      `No verified deals ${scope} right now. Try a broader keyword (e.g. "kitchen", "smart home", "headphones") or a higher budget — or ask for get_deal_hubs to browse everything.`
    );
  }

  const lines = [`${matches.length} verified deal${matches.length === 1 ? "" : "s"} found:`, ""];
  for (const deal of matches) {
    lines.push(`- ${deal.name} — ${deal.priceLabel} (${deal.savingsLabel}, ${deal.referenceLabel})`);
  }
  lines.push("", "Prices as verified in the Deals Hub mapping. #ad — I may earn a commission.");
  return textResult(lines.join("\n"));
}

const TOOL_HANDLERS = {
  get_daily_briefing: toolGetDailyBriefing,
  get_temu_top5: toolGetTemuTop5,
  get_deal_hubs: toolGetDealHubs,
  search_deals: toolSearchDeals,
};

// ---------------------------------------------------------------------------
// Alexa Skills Kit (ASK) adapter
// ---------------------------------------------------------------------------
// The "Best Finds Daily for Alexa+" custom skill points its HTTPS endpoint
// at this same Worker URL. Alexa posts ASK envelopes (LaunchRequest /
// IntentRequest), not JSON-RPC — without this adapter the skill answered
// every request with "No Content" (found in the live console test,
// Oct 19, 2026). On POST, any body carrying `request.type` is handled here
// instead of by the JSON-RPC dispatcher; everything else is untouched.
// Speech quotes only the same verified data the tools serve (verified-only
// deals via findDeals, the embedded Temu Top 5 snapshot); URLs are never
// spoken — they ride in the Simple card.

const ASK_REPROMPT =
  "Ask me for today's finds, today's top find, the Temu Top 5, deals under a budget, or Greg's deal hubs.";
const ASK_QUESTIONS =
  "You can ask: what are today's finds? What's today's top find? What are today's Temu finds? Or find me smart home deals under fifty dollars. You can also ask where to shop all of Greg's hubs, or what's the promo code.";

function askResponse({ text, cardTitle, cardContent, reprompt, endSession = false }) {
  const response = {
    outputSpeech: { type: "PlainText", text },
    shouldEndSession: endSession,
  };
  if (cardTitle) {
    response.card = { type: "Simple", title: cardTitle, content: cardContent || text };
  }
  if (!endSession) {
    response.reprompt = {
      outputSpeech: { type: "PlainText", text: reprompt || ASK_REPROMPT },
    };
  }
  return { version: "1.0", sessionAttributes: {}, response };
}

/** Strip URLs and collapse whitespace for speech, then trim to a speakable
 *  length at a sentence boundary where possible. */
function toSpeakable(text, max = 750) {
  const clean = String(text)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return (stop > 200 ? cut.slice(0, stop + 1) : cut).trim();
}

function topFindSpeech() {
  const item = TEMU_TOP5.items[0];
  return (
    `Today's top find is the ${item.name} at ${item.priceLabel} — ${item.sold}. ` +
    `Use Greg's code ${TEMU_TOP5.promoCode} at the Temu storefront for an extra thirty percent off.`
  );
}

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};

/** Parse a spoken number phrase ("twenty five", "one hundred", "a hundred",
 *  "fifty") into a value; returns null when any token is not a number word. */
function numberWordsToValue(tokens) {
  let current = 0;
  let seen = false;
  for (const token of tokens) {
    if (token === "a" || token === "an") {
      if (!seen) { current = 1; seen = true; }
      continue;
    }
    if (!(token in NUMBER_WORDS)) return null;
    seen = true;
    const value = NUMBER_WORDS[token];
    if (value === 100) current = (current || 1) * 100;
    else current += value;
  }
  return seen && current > 0 ? current : null;
}

/** Split a spoken search slot value into { query, maxPrice }, extracting a
 *  budget tail such as "under $50", "under 24.99 dollars" or "under
 *  twenty-five dollars" when present. Non-number tails ("under the stairs")
 *  are left in the query untouched. */
function parseSpokenSearch(rawQuery) {
  let query = String(rawQuery || "").trim();
  let maxPrice = null;

  const digitMatch = query.match(
    /\b(?:under|below|less than)\s+\$?(\d+(?:\.\d{1,2})?)\s*(?:dollars?|bucks)?\b/i
  );
  if (digitMatch) {
    maxPrice = parseFloat(digitMatch[1]);
    query = (query.slice(0, digitMatch.index) + query.slice(digitMatch.index + digitMatch[0].length)).trim();
  } else {
    const wordMatch =
      query.match(/\b(?:under|below|less than)\s+([a-z][a-z\s-]*?)\s*(?:dollars?|bucks)\b/i) ||
      query.match(/\b(?:under|below|less than)\s+([a-z][a-z\s-]*)$/i);
    if (wordMatch) {
      const tokens = wordMatch[1].toLowerCase().split(/[\s-]+/).filter(Boolean);
      const value = numberWordsToValue(tokens);
      if (value !== null) {
        maxPrice = value;
        query = (query.slice(0, wordMatch.index) + query.slice(wordMatch.index + wordMatch[0].length)).trim();
      }
    }
  }

  query = query
    .replace(/\s+/g, " ")
    .replace(/^(deals?|finds?)\s+/i, "")
    .replace(/\s+(deals?|finds?)$/i, "")
    .trim();
  return { query, maxPrice };
}

async function handleAskRequest(body, env) {
  const request = body.request || {};

  if (request.type === "SessionEndedRequest") {
    return { version: "1.0", sessionAttributes: {}, response: {} };
  }

  if (request.type === "LaunchRequest") {
    const item = TEMU_TOP5.items[0];
    return askResponse({
      text:
        `Welcome to Best Finds Daily! ${topFindSpeech()} ` +
        "Ask me for today's finds, the Temu Top 5, deals under a budget, or where to shop all of Greg's hubs.",
      cardTitle: "Today's top find",
      cardContent: `${item.name} — ${item.priceLabel} (${item.sold})\n${item.url}\n\nCode ${TEMU_TOP5.promoCode} for an extra 30% off. #ad — I may earn a commission.`,
    });
  }

  if (request.type === "IntentRequest") {
    const intentName = request.intent && request.intent.name;

    switch (intentName) {
      case "TodaysBriefingIntent": {
        const result = await toolGetDailyBriefing({}, env);
        const fullText = (result.content || []).map((c) => c.text).join("\n");
        return askResponse({
          text: toSpeakable(fullText),
          cardTitle: "Best Finds Daily — today's briefing",
          cardContent: toSpeakable(fullText, 6000),
        });
      }

      case "TopFindIntent": {
        const item = TEMU_TOP5.items[0];
        return askResponse({
          text: topFindSpeech(),
          cardTitle: "Today's top find",
          cardContent: `${item.name} — ${item.priceLabel} (${item.sold})\n${item.url}\n\nCode ${TEMU_TOP5.promoCode} for an extra 30% off. #ad — I may earn a commission.`,
        });
      }

      case "TemuTopFiveIntent": {
        const ordinals = ["Number one", "Number two", "Number three", "Number four", "Number five"];
        const spoken = TEMU_TOP5.items
          .map((item, i) => `${ordinals[i]}: ${item.name}, ${item.priceLabel}.`)
          .join(" ");
        const cardText = (toolGetTemuTop5().content || []).map((c) => c.text).join("\n");
        return askResponse({
          text:
            `Today's Temu Top 5 for ${TEMU_TOP5.dateLabel}. ${spoken} ` +
            `Use Greg's code ${TEMU_TOP5.promoCode} at checkout for an extra thirty percent off.`,
          cardTitle: "Today's Temu Top 5",
          cardContent: cardText,
        });
      }

      case "SearchDealsIntent": {
        const slots = (request.intent && request.intent.slots) || {};
        const rawQuery = (slots.query && slots.query.value) || "";
        const { query, maxPrice } = parseSpokenSearch(rawQuery);
        const matches = findDeals(query, maxPrice);
        const dealsHubUrl = DEAL_HUBS.find((h) => h.name === "Deals Hub")?.url || "";
        if (!matches.length) {
          const scope = [
            query && `matching "${query}"`,
            maxPrice !== null && `under $${maxPrice}`,
          ]
            .filter(Boolean)
            .join(" ");
          return askResponse({
            text:
              `I couldn't find any verified deals ${scope} right now. ` +
              "Try a broader keyword or a higher budget — or ask me for today's Temu Top 5.",
            cardTitle: "No verified deals found",
            cardContent: `No verified deals ${scope} in the current Deals Hub set.\nBrowse everything: ${dealsHubUrl}`,
          });
        }
        const spoken = matches
          .map((deal) => `${deal.name}, ${deal.priceLabel}`)
          .join("; ");
        const cardLines = matches.map(
          (deal) => `- ${deal.name} — ${deal.priceLabel} (${deal.savingsLabel}, ${deal.referenceLabel})`
        );
        return askResponse({
          text:
            `I found ${matches.length} verified deal${matches.length === 1 ? "" : "s"}: ${spoken}. ` +
            "I've put the details on a card for you.",
          cardTitle: "Verified deals",
          cardContent: `${cardLines.join("\n")}\n\nDeals Hub: ${dealsHubUrl}\nPrices as verified in the Deals Hub mapping. #ad — I may earn a commission.`,
        });
      }

      case "DealHubsIntent": {
        const cardText = (toolGetDealHubs().content || []).map((c) => c.text).join("\n");
        return askResponse({
          text:
            "You can shop all of Greg's hubs from the Master hub: Amazon Finds, the Deals Hub, " +
            "Temu Finds, the Business Growth Hub, his blog, the Telegram deals channel, and the " +
            `Best Finds Daily newsletter. And the Temu promo code is ${TEMU_TOP5.promoCode}, ` +
            "for an extra thirty percent off.",
          cardTitle: "Best Finds with Greg — hub directory",
          cardContent: cardText,
        });
      }

      case "HelloWorldIntent":
        return askResponse({ text: `Hello! ${topFindSpeech()}` });

      case "AMAZON.NavigateHomeIntent":
        return askResponse({ text: topFindSpeech() });

      case "AMAZON.HelpIntent":
        return askResponse({ text: ASK_QUESTIONS });

      case "AMAZON.StopIntent":
      case "AMAZON.CancelIntent":
        return askResponse({ text: "Goodbye.", endSession: true });

      default:
        return askResponse({
          text: `Sorry, I didn't catch that. ${ASK_QUESTIONS}`,
        });
    }
  }

  // Unknown ASK request type: answer with the fallback rather than an error.
  return askResponse({ text: `Sorry, I didn't catch that. ${ASK_QUESTIONS}` });
}

// ---------------------------------------------------------------------------
// Live price pipe — GET /prices (see PRICE-PIPE.md)
// ---------------------------------------------------------------------------

/** Serve the Amazon price map stored in BRIEFING_KV under "prices:amazon".
 *  The map is { ASIN: { price, title, verified_at, source, verified, was } }
 *  and is written by scripts/update-prices.py; this Worker only reads it.
 *  An absent or unreadable map serves as {} with HTTP 200 on purpose: hub
 *  pages read "no live data" as "keep the baked-in prices", so this
 *  endpoint can never blank or zero out a page's prices. */
async function handlePrices(env) {
  let map = {};
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("prices:amazon", "json");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) map = stored;
    }
  } catch (err) {
    // Fall through with the empty map — see the note above.
  }
  return jsonResponse(map, 200, { "Cache-Control": "public, max-age=300" });
}

// ---------------------------------------------------------------------------
// JSON-RPC plumbing
// ---------------------------------------------------------------------------

function rpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

/** Dispatch one JSON-RPC message. Returns { status, payload, headers } or
 *  { status: 202 } for notifications, which take no response body. */
async function handleMessage(msg, sessionId, env) {
  const isNotification = msg.id === undefined || msg.id === null;

  // Notifications: accept and stay silent (HTTP 202), known or not — a
  // notification must never produce a JSON-RPC error response.
  if (isNotification) return { status: 202 };

  if (typeof msg.method !== "string") {
    return { status: 200, payload: rpcError(msg.id, -32600, "Invalid Request: method must be a string") };
  }

  switch (msg.method) {
    case "initialize": {
      const newSessionId = crypto.randomUUID();
      sessions.add(newSessionId);
      return {
        status: 200,
        headers: { "Mcp-Session-Id": newSessionId },
        payload: rpcResult(msg.id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
          instructions:
            "Best Finds Daily deals tools. Call get_daily_briefing for today's briefing, get_temu_top5 for today's Temu finds, search_deals for Amazon deals by keyword or budget, get_deal_hubs for all of Greg's links.",
        }),
      };
    }

    case "ping":
      return { status: 200, payload: rpcResult(msg.id, {}) };

    case "tools/list":
      return { status: 200, payload: rpcResult(msg.id, { tools: TOOLS }) };

    case "tools/call": {
      const params = msg.params || {};
      const handler = TOOL_HANDLERS[params.name];
      if (!handler) {
        // A bad tool name is a tool-level failure, so it rides back in the
        // result with isError rather than as a protocol error.
        return {
          status: 200,
          payload: rpcResult(
            msg.id,
            textResult(`Unknown tool: ${String(params.name)}. Available tools: ${Object.keys(TOOL_HANDLERS).join(", ")}.`, true)
          ),
        };
      }
      try {
        const result = await handler(params.arguments || {}, env);
        return { status: 200, payload: rpcResult(msg.id, result) };
      } catch (err) {
        return {
          status: 200,
          payload: rpcResult(msg.id, textResult(`Tool ${params.name} failed: ${err.message}`, true)),
        };
      }
    }

    default:
      return { status: 200, payload: rpcError(msg.id, -32601, `Method not found: ${msg.method}`) };
  }
}

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    // CORS preflight for browser-based clients.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // GET /prices: the live price map for hub pages (see PRICE-PIPE.md).
    if (request.method === "GET" && new URL(request.url).pathname.replace(/\/+$/, "") === "/prices") {
      return handlePrices(env);
    }

    // GET: endpoint info (see transport notes in the header comment).
    if (request.method === "GET") {
      return jsonResponse({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        protocolVersion: PROTOCOL_VERSION,
        transport: "streamable-http",
        tools: TOOLS.map((t) => t.name),
        prices: "/prices",
        description:
          "Best Finds Daily MCP server — live deals tools for Alexa+ and any MCP client. POST JSON-RPC 2.0 messages to this URL.",
      });
    }

    // DELETE: explicit session termination.
    if (request.method === "DELETE") {
      const sid = request.headers.get("Mcp-Session-Id");
      if (sid) sessions.delete(sid);
      return new Response(null, { status: 200, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse(rpcError(null, -32600, `Unsupported method: ${request.method}`), 405);
    }

    // Session enforcement: an id we never issued (or already terminated)
    // is rejected with 404 per spec; a missing id is tolerated (see notes).
    const sessionId = request.headers.get("Mcp-Session-Id");
    if (sessionId && !sessions.has(sessionId)) {
      return jsonResponse(rpcError(null, -32001, "Session not found"), 404);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(rpcError(null, -32700, "Parse error: request body is not valid JSON"), 400);
    }

    // Alexa Skills Kit (ASK) adapter: an ASK envelope (a non-array body
    // carrying `request.type`) is answered by the adapter instead of the
    // JSON-RPC dispatcher. Non-ASK bodies flow on unchanged.
    if (
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      body.request &&
      typeof body.request.type === "string"
    ) {
      return jsonResponse(await handleAskRequest(body, env));
    }

    // Batch requests: process each message, return the non-notification
    // responses as an array; a batch of pure notifications gets a bare 202.
    if (Array.isArray(body)) {
      const responses = [];
      let headers = {};
      for (const msg of body) {
        const out = await handleMessage(msg || {}, sessionId, env);
        if (out.payload) responses.push(out.payload);
        if (out.headers) headers = { ...headers, ...out.headers };
      }
      if (!responses.length) return new Response(null, { status: 202, headers: CORS_HEADERS });
      return jsonResponse(responses, 200, headers);
    }

    if (!body || typeof body !== "object" || body.jsonrpc !== "2.0") {
      return jsonResponse(rpcError(body?.id, -32600, "Invalid Request: expected a JSON-RPC 2.0 message"), 400);
    }

    const out = await handleMessage(body, sessionId, env);
    if (out.status === 202) return new Response(null, { status: 202, headers: CORS_HEADERS });
    return jsonResponse(out.payload, out.status, out.headers || {});
  },
};
