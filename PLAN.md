# Build, Ship, Shape — Amazon Developer Hackathon: Entry Plan

**Track:** Alexa+ (primary) — significant upgrade of an existing project
**Project:** Best Finds Daily → Alexa+ (MCP-powered)
**Deadline:** Friday, October 23, 2026, 2:00pm CDT (Devpost)
**Prizes in track:** 1st $25,000 cash + $15,000 AWS credits + Amazon team meeting; 2nd $15,000 + $5,000 credits; 3rd $4,000 + $1,000 credits
**Budget:** $0 (Cloudflare free tier; existing assets only)

## The story (what judges read)
Best Finds Daily already exists: a live Alexa Flash Briefing skill (submitted for certification Oct 11, 2026) fed by a Cloudflare KV worker that refreshes every morning from a real, operating deals business (daily Temu Top 5 drops, Amazon Finds, hubs, newsletter).
The upgrade: a self-hosted **MCP server (Streamable HTTP, MCP spec 2025-11-25+)** that exposes the live operation as tools Alexa+ can call conversationally — today's briefing, today's Temu Top 5 with prices, deal search by budget/category, and the hub directory. Flash Briefing is one-way broadcast; the MCP layer makes it a two-way shopping companion backed by data that actually changes every day.

## MCP tools (v1)
1. `get_daily_briefing` — today's Best Finds Daily briefing (live feed fetch).
2. `get_temu_top5` — today's Temu Top 5 (name, price, sold count, link, promo code aln767451).
3. `get_deal_hubs` — curated hub directory (Master, Amazon Finds, Deals, Temu, Business Growth, blog, Telegram) with what each is for.
4. `search_deals` — keyword/budget search over the verified deals set (Deals Hub 40-product verified mapping; prices as mapped).

## Data sources (all real, all Gee's)
- Briefing feed: https://nameless-dust-a1fc.themagiccitymeltingpot.workers.dev (live, verified Oct 13)
- Temu Top 5: daily drop manifest (~/workspace/temu-finds-promo/<date>/MANIFEST.md) — server reads a JSON snapshot updated by the daily flow.
- Deals: ~/workspace/amazon-finds-day2/deals-hub-verified-mapping.md (verified prices, never guessed).
- Hubs: canonical links from MEMORY.md.

## Build order
1. MCP server v1 (single-file Cloudflare Worker, JSON-RPC: initialize / tools/list / tools/call / ping; Mcp-Session-Id handling per spec) + local protocol test.
2. Deploy to Cloudflare (free) alongside the feed worker; live endpoint smoke test.
3. Alexa+ Agent Skill wiring (developer console — account-owner steps may need Gee's taps; agent-side prep first).
4. What-changed writeup (existing project disclosure — required), project description, product feedback on Alexa+/MCP tooling, friction log (built during the build, up to 10% judging bonus).
5. Demo video <3 min, faceless, studio voice (his standard stack), public YouTube upload via his API.
6. GitHub repo (private) + add Amazon reviewer collaborators at submission (chris-trag, knmeiss, giolaq, anishamalde, mosesroth, emersonsklar) + Devpost submission.

## Gee's jobs (only his)
- Join the hackathon on Devpost under his name (~2 min).
- Any Amazon Developer Console account-owner confirmations if the Agent Skill step requires them (Muse guides tap-by-tap).
- GitHub repo collaborator adds at submission time (or Muse via his logged-in browser if accessible).

## Risks / notes
- Alexa skill certification (Flash Briefing) still pending — the upgrade entry does not depend on it.
- 54,873 participants: winning is a long shot; the MCP asset + Amazon-team feedback channel have value regardless.
- Zero out of pocket: no AWS services required for the build; AWS Builder mini-challenge only if a genuine AWS piece fits without cost — do not force it.
