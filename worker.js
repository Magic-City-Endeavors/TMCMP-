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

function toolSearchDeals(args) {
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const maxPrice =
    typeof args.max_price === "number" && Number.isFinite(args.max_price)
      ? args.max_price
      : null;

  // Every query word must match somewhere in the deal's name, category or
  // keyword list — simple, predictable AND-matching for a small verified set.
  const words = query.split(/\s+/).filter(Boolean);
  const matches = DEALS.filter((deal) => {
    if (maxPrice !== null && deal.price > maxPrice) return false;
    if (!words.length) return true;
    const haystack = [deal.name, deal.category, ...deal.keywords].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });

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

    // GET: endpoint info (see transport notes in the header comment).
    if (request.method === "GET") {
      return jsonResponse({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        protocolVersion: PROTOCOL_VERSION,
        transport: "streamable-http",
        tools: TOOLS.map((t) => t.name),
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
