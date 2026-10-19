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

## Also: a voice skill (Alexa Skills Kit)

The same worker is also the endpoint for the **Best Finds Daily for Alexa+**
custom skill: requests that arrive as Alexa Skills Kit envelopes are answered
directly, in speech, by the same code and data as the MCP tools. The skill
carries five custom intents — today's briefing, today's top find, the Temu
Top 5, deal search with a budget, and the deal-hub directory — and it
remembers the conversation: ask for deals under a budget, then ask
*"anything cheaper?"* and the search ceiling drops on every follow-up. On
launch it announces the biggest verified saving in the current set. It
speaks only refresh-verified prices (currently 8 priced deals); when nothing
verified matches, it says so honestly instead of inventing a price.

## Protocol

- MCP spec **2025-11-25**, Streamable HTTP transport, JSON-RPC 2.0.
- `initialize` returns `protocolVersion: "2025-11-25"`,
  `serverInfo: { name: "best-finds-daily", version: "1.0.0" }`,
  `capabilities: { tools: {} }`, and issues an `Mcp-Session-Id` header that
  is honoured on subsequent requests (unknown ids → HTTP 404, per spec).
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
- **Temu Top 5** — snapshot of the daily Temu drop (`data.js`, refreshed by
  the daily drop flow), with affiliate links and promo code.
- **Deals** — the full 40-entry Deals Hub catalog. Only entries whose prices
  are verified by the refresh pipeline carry a price (currently 8); the rest
  are stored price-free and are never returned by `search_deals`. Unverified
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
searches), an unknown method, and an unknown session id — 67 checks, PASS/FAIL
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
at the worker's HTTPS URL and POST JSON-RPC messages to it.

## Notes & honest limitations

- Sessions live in module memory, which on Cloudflare is per-isolate; a
  request carrying a *known-issued* id is honoured, a *missing* id is
  tolerated so a fresh isolate never breaks a conversation, and a *forged or
  stale* id is rejected with 404. This trade-off is documented in the
  `worker.js` header.
- The Temu snapshot and deals array are embedded by design (v1 simplicity,
  zero storage cost); the daily pipeline refreshes them.
