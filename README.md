# Best Finds Daily — MCP Server

A self-hosted [Model Context Protocol](https://modelcontextprotocol.io) (MCP)
server over **Streamable HTTP**, built for the Amazon Developer Hackathon
("Build, Ship, Shape", Alexa+ track) as the conversational upgrade to the
existing **Best Finds Daily** Alexa Flash Briefing skill.

The Flash Briefing is one-way: Alexa reads a feed aloud. This server is the
two-way layer — it exposes a real, operating deals business (Best Finds with
Greg) as tools an Alexa+ agent can call mid-conversation, backed by data that
changes every day:

| Tool | What it does |
| --- | --- |
| `get_daily_briefing` | Today's Best Finds Daily briefing, fetched **live** from the production feed (with a labelled cached fallback if the feed is unreachable). |
| `get_temu_top5` | Today's Temu Top 5 finds — prices, sold counts, links, and the promo code (`aln767451`, extra 30% off). |
| `get_deal_hubs` | The hub directory: Master hub, Amazon Finds, Deals Hub, Temu Finds, Business Growth Hub, blog, Telegram channel, newsletter. |
| `search_deals` | Keyword and/or budget search over the **verified** Deals Hub set. Accepts optional `query` (string) and `max_price` (number, USD). |

Ask Alexa+ *"What are today's top finds?"*, *"Find me headphones under $200"*,
or *"Where can I see all the deals?"* — each maps to one of these tools.

## Try it live

- **MCP endpoint:** https://best-finds-daily-mcp.themagiccitymeltingpot.workers.dev/
  — POST JSON-RPC 2.0 messages to it; a plain GET returns endpoint info, and
  `GET /prices` on the same host returns the live verified price map.
- **Demo video:** https://youtube.com/watch?v=0hDS7fu8ohE
- **Live Alexa skills:** the Flash Briefing skill *Best Finds Daily*
  (`amzn1.ask.skill.2247ca95-5832-45a4-b666-dd1a73386fd1`, status: Live) and
  the custom skill *Best Finds Daily for Alexa+*
  (`amzn1.ask.skill.18480163-685a-4b01-8c1b-5951b6fda33b`), whose HTTPS
  endpoint is this worker.

## Also: a voice skill (Alexa Skills Kit)

The same worker is also the endpoint for the **Best Finds Daily for Alexa+**
custom skill: requests that arrive as Alexa Skills Kit envelopes are answered
directly, in speech, by the same code and data as the MCP tools. The skill
carries five custom intents — today's briefing, today's top find, the Temu
Top 5, deal search with a budget, and the deal-hub directory — and it
remembers the conversation: ask for deals under a budget, then ask
*"anything cheaper?"* and the search ceiling drops on every follow-up. On
launch it announces the biggest verified saving in the current set. It
speaks only refresh-verified prices (currently 13 priced deals); when nothing
verified matches, it says so honestly instead of inventing a price.

## Protocol

- MCP spec **2025-11-25**, Streamable HTTP transport, JSON-RPC 2.0.
- `initialize` returns `protocolVersion: "2025-11-25"`,
  `serverInfo: { name: "best-finds-daily", version: "1.0.0" }`,
  `capabilities: { tools: {} }`, and issues an `Mcp-Session-Id` header that
  is honoured on subsequent requests. Session ids are advisory: requests
  are served with or without one, and unknown ids are ignored rather than
  rejected — Workers are stateless across isolates, so an id issued by one
  isolate is unknown to the next, and rejecting unknown ids broke the
  standard handshake whenever it crossed isolates (fixed Oct 22, 2026).
- Notifications are accepted with HTTP 202 and no body; `ping`, `tools/list`
  and `tools/call` are fully implemented; single-message responses are plain
  `application/json` (this server sends no server-initiated messages, so GET
  returns a small JSON info object instead of an SSE stream — see the header
  comment in `worker.js` for the reasoning).
- No external dependencies: Worker APIs + `fetch` only.

## Data sources

All data is real and belongs to the operating business — nothing is mocked:

- **Briefing** — the production Flash Briefing feed worker
  (`nameless-dust-a1fc.themagiccitymeltingpot.workers.dev`), refreshed every
  morning by the Best Finds Daily pipeline.
- **Temu Top 5** — the daily Temu drop: the tool serves the freshest of the
  KV copy (key `temu-top5` in the shared namespace, written by the daily
  drop flow alongside the briefing) and the embedded `data.js` snapshot,
  with affiliate links and promo code.
- **Deals** — the full Deals Hub catalog. Only entries whose prices
  are verified by the refresh pipeline carry a price (currently 13); the rest
  are stored price-free and are never returned by `search_deals`. Served
  prices are the price pipe's verified prices, applied from KV by ASIN at
  request time over the pipe-synced embedded set. Unverified
  snapshot prices were removed on Oct 19, 2026 rather than served — prices
  are as mapped from the live hub, never estimated.
- **Hubs** — Greg's canonical link hubs.

## Files

```
worker.js     the MCP server (single-file Cloudflare Worker)
data.js       embedded data snapshots (Temu Top 5, hubs, verified deals, fallback briefing)
test.mjs      local protocol test — drives the real fetch handler through the full MCP handshake
package.json  ESM marker + npm scripts
```

## Run the test

Requires Node 18+ (uses the built-in `Request`/`Response`/`fetch` globals —
no install step):

```sh
node test.mjs
# or
npm test
```

The test exercises `initialize`, `notifications/initialized`, `ping`,
`tools/list`, `tools/call` for all four tools (including keyword and budget
searches), an unknown method, and an unknown session id (served, per the
session-tolerance note above) — 67 checks, PASS/FAIL
per check, non-zero exit on any failure.

## Develop & deploy (Cloudflare Workers, free tier)

```sh
npm install -g wrangler   # once

wrangler dev              # local dev server
wrangler deploy           # ship it
```

Minimal `wrangler.toml`:

```toml
name = "best-finds-daily-mcp"
main = "worker.js"
compatibility_date = "2025-10-01"
```

After deploy, point your MCP client (or the Alexa+ Agent Skill configuration)
at the worker's HTTPS URL — the production deployment is
https://best-finds-daily-mcp.themagiccitymeltingpot.workers.dev/ — and POST
JSON-RPC messages to it.

## Notes & honest limitations

- Sessions live in module memory, which on Cloudflare is per-isolate.
  Session ids are therefore advisory: a request is served whether it
  carries a known id, an unknown id, or no id at all, so a conversation
  never breaks when consecutive requests land on different isolates. (An
  earlier build rejected unknown ids with 404; that broke the standard MCP
  handshake across isolates and was removed on Oct 22, 2026.) This is
  documented in the `worker.js` header.
- The deals array is embedded by design (v1 simplicity, zero storage
  cost) and pipe-synced; at request time the worker also applies the live
  verified price pipe from KV by ASIN. The Temu Top 5 is served from KV
  when the daily copy is fresher, with the embedded snapshot as fallback.
