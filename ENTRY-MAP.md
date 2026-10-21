# ENTRY MAP — Build, Ship, Shape: Amazon Developer Hackathon
## Best Finds Daily → Alexa+ (Alexa+ Track, significant-upgrade entry)

**Deadline: Friday, October 23, 2026, 2:00pm CDT — Devpost, online, free to enter.**
Track prizes (Alexa+): 1st $25,000 cash + $15,000 AWS credits + meeting with the Amazon Developer team + featured on Amazon Developer channels · 2nd $15,000 + $5,000 credits · 3rd $4,000 + $1,000 credits.

---

## 1. What you enter (the selections on Devpost)
- **Primary track: Alexa+**
- **Mini challenge: Open Source** (stretch — we additionally ship a small open-source companion repo with a license; only if the main entry is done first. Skip AWS Builder: no AWS services are used, and we don't claim what we didn't use.)
- **Project type: significant update of an existing project** (the rules allow this; Devpost asks for the what-changed explanation — text in §5).

## 2. Project name + tagline (copy-paste)
**Name:** Best Finds Daily for Alexa+
**Tagline:** A live deals companion for Alexa+ — ask for today's top finds, budget picks, and deal hubs, all served from a working creator's daily deals operation through a self-hosted MCP server: the briefing fetched live, the deals drawn from the refresh-verified set (one-second refresh of the verified price pipe).
**Built with (Devpost field):** JavaScript (ES modules) · Cloudflare Workers · Model Context Protocol (MCP, spec 2025-11-25, Streamable HTTP) · JSON-RPC 2.0 · Alexa+ (Agent Skills) · Alexa Flash Briefing (existing skill + feed) · Node.js (local protocol test harness) · Devpost

## 3. Project description (copy-paste for Devpost)
Best Finds Daily started as an Alexa Flash Briefing skill: every morning, a Cloudflare worker refreshes a feed with the day's top finds from a real, operating deals business (daily Temu Top 5 drops, Amazon finds, curated deal hubs, and a newsletter). It works — but a Flash Briefing is a one-way broadcast. Listeners can't ask questions.

This upgrade gives the skill a brain it can be asked questions through. We built a self-hosted MCP server (Streamable HTTP, MCP spec 2025-11-25) that exposes the live operation as four tools Alexa+ can call in conversation:

- `get_daily_briefing` — today's briefing, fetched live from the production feed.
- `get_temu_top5` — today's five Temu finds with prices, sold counts, links, and the storefront promo code.
- `search_deals` — keyword and budget search over the Deals Hub catalog, returning only deals whose prices are verified by the refresh pipeline (currently 13 priced deals — the rest of the catalog carries no price and is never served with one).
- `get_deal_hubs` — the curated directory of deal hubs, blog, Telegram channel, and newsletter.

A listener can now ask Alexa+ "what's today's top find?", "show me kitchen deals under twenty dollars," or "where do I get the promo code?" and get answers drawn from data that genuinely changes every day — because behind the demo is not a mock database but a working daily content operation with real links, real prices, and a real audience funnel.

**How it's built:** the MCP server is a single-file Cloudflare Worker (zero dependencies) implementing MCP over Streamable HTTP with JSON-RPC: initialize/session handling, tools/list, tools/call, and ping. It reads the same production briefing feed the Flash Briefing skill uses, plus the Deals Hub catalog restricted to refresh-verified prices (unverified snapshot prices were removed from the dataset on Oct 19, 2026 rather than served). The whole stack runs on free tiers — the point is to show what a solo creator can ship for Alexa+ with an MCP server and data they already own.

**Why it matters:** thousands of creators publish daily deals content that voice assistants can read aloud but cannot converse about. This project is a reusable pattern: any creator with a daily feed can expose it as MCP tools and become askable. Best Finds Daily is the working proof, running live data today.

## 4. How the entry meets the Alexa+ requirement
The submission repo's core IS the track technology: the MCP server source (spec 2025-11-25+, Streamable HTTP) with its entry point, tool definitions, and handlers — not a README mention. The demo video shows Alexa+ tools being called and answered from live data.

## 5. What changed during the hackathon window (copy-paste — required for existing projects)
Best Finds Daily (the Flash Briefing skill and its Cloudflare feed worker) existed before this hackathon; it was submitted for Alexa skill certification on October 11, 2026. Everything conversational is new in this window: (1) the self-hosted MCP server was designed and built from scratch; (2) the four tools and their data contracts (live briefing, Temu Top 5, verified deals search, hub directory) were created; (3) the deals dataset was extracted from the production Deals Hub catalog, with prices restricted to the refresh-verified set (Oct 19, 2026 hardening — 8 priced deals at that pass, since grown to 13 by Oct 21, 2026 as further prices were verified, most recently La Roche-Posay Cicaplast Balm B5; unverified snapshot prices removed, never served); (4) the Alexa+ agent wiring and conversation flows were authored; (5) this documentation, the friction log, and the demo were produced. The Flash Briefing feed itself is unchanged and remains the live data source the MCP server reads.

## 6. Product feedback (copy-paste FINAL — mirrors PRODUCT-FEEDBACK.md; the one marked clause was completed on 2026-10-19 from the live wiring session)
- **MCP (Model Context Protocol, spec 2025-11-25, Streamable HTTP):** Used as the integration layer between Alexa+ and a live creator data operation — four tools serving a daily briefing, a daily Top 5, a verified deals catalog, and a hub directory. What worked: the tools/list + tools/call contract maps cleanly onto real content operations; a single HTTP endpoint is hostable anywhere, including free serverless tiers; JSON-RPC error shapes are predictable and testable with a small local harness (ours runs 67 checks, all passing). What needs work: session semantics (Mcp-Session-Id) assume a stateful server; on serverless isolates, strict validation breaks valid conversations because consecutive requests land on different isolates — a documented stateless/serverless session profile (e.g., signed self-contained session tokens) would remove the most common correctness trap. The requirement states only a version string ("2025-11-25 or later"); header, session, and error-shape expectations must be assembled from the spec itself — a hosted conformance echo endpoint and a one-page conformance checklist would cut that guesswork. Onboarding: spec-first reading is heavy for non-infrastructure developers; a minimal "your first MCP server for Alexa+" path with a deployable reference worker would shorten time-to-first-tool-call from days to an afternoon. Would build again: yes — MCP is the right shape for creator data: write the server once, and any agent client can ask it questions.
- **Alexa+ / Agent Skills:** Used to upgrade an existing Flash Briefing property (Best Finds Daily, submitted for Alexa skill certification on October 11, 2026) into a conversational experience backed by live data. What worked: the upgrade path is natural when the underlying content is already structured daily data — the existing briefing feed became a tool with no content rework, and the four tools mirror the questions listeners actually ask (today's finds, budget search, where the promo code lives). What needs work: guidance for the thousands of existing Flash Briefing skills on presenting MCP-backed upgrades (metadata, invocation expectations, review criteria) is thin; a short migration note aimed at feed-based skills would help that entire population. Wiring session notes (2026-10-19, live console session with the account owner): the interaction model was pasted into the console's JSON Editor, saved, and built by the account owner — Build History shows the successful build ("Latest (2), 10/19/2026 @ 8:39 AM") with the Build tab checklist all green (Invocation Name, Intents/Samples/Slots, Build Model, Endpoint) and the endpoint confirmed pointing at the MCP worker. The conversation test could not be completed from the owner's phone, his only device: the console simulator would not submit typed utterances (his keyboard has no Enter/return key — only a "next field" action key), its hold-to-talk mic never captured voice in either the mobile or desktop-site layout, and one attempt returned the console's own error "Cannot read properties of undefined (reading 'tokens')"; the Alexa+ app answered the skill's invocation name with its own native "Daily Trending Finds" feature and offers no skills-management surface at all, and the alexa.amazon.com Your Skills page does not list the in-development skill. The skill's spoken behaviour was verified instead with synthetic Alexa Skills Kit requests sent directly to the endpoint, which returned the correct spoken responses for the launch request and every custom intent (full detail: FRICTION-LOG.md, Entries 5–8). Would build again: yes — this is the obvious next step for every daily-feed skill on the platform.
- **Hosting (Cloudflare Workers, existing stack — context, not an Amazon product):** the MCP server runs beside the production feed worker on the free tier as a single zero-dependency file; no cold-start impact observed in local protocol testing; total running cost $0. One deployment friction: with no pre-provisioned API credential on the build workstation, deployment falls back to the dashboard editor — a scoped-token quickstart in the deploy guidance would remove that stall.

## 7. Friction log format (entries logged live during the build; up to +10% bonus)
Each entry: task attempted · steps taken · expected vs. actual · severity · workaround · suggestion. Entries are written as friction actually occurs during the MCP build and Alexa+ wiring — never backfilled fiction.

## 8. Judging criteria → how this entry answers
- **Tech Implementation:** a real MCP server, spec-current, session-correct, zero-dependency, tested with a protocol harness; live production data, not fixtures.
- **Design:** four tools that mirror how people actually ask about deals (today's finds, budget search, where's the code); answers carry prices and links in speakable form.
- **Potential Impact:** serves a real daily audience funnel today; the pattern generalizes to any creator with a daily feed.
- **Quality of Idea:** turns a one-way briefing into a two-way shopping companion — the natural next step for every Flash Briefing on the platform.

## 9. Demo video shot list (<3:00, faceless, studio voice)
1. 0:00–0:20 — Hook: the problem (briefings you can't ask questions).
2. 0:20–1:20 — Live tool calls: today's briefing, today's Temu Top 5, a budget search — real responses on screen.
3. 1:20–2:00 — The data is real: show the morning drop, the feed updating, the same answers the tools return.
4. 2:00–2:45 — Architecture in one breath + the creator-pattern pitch.
5. 2:45–3:00 — Close: name, track, call to action. (No third-party music or trademarks.)

## 10. Submission checklist (in order)
1. [Gee] Join the hackathon on Devpost (free; his name/account).
2. [Muse] MCP server built + protocol-tested + deployed on Cloudflare free tier.
3. [Muse] Alexa+ wiring — DONE + build-verified 2026-10-19: interaction model (5 custom intents + HelloWorld + built-ins) pasted into the console, saved, and built (Build History "Latest (2) — 10/19/2026 @ 8:39 AM" successful; Build tab checklist all green: Invocation Name, Intents/Samples/Slots, Build Model, Endpoint; endpoint = the MCP worker in all regions). Endpoint verified live answering synthetic Alexa (ASK) requests with correct spoken content. Conversation test from the owner's phone: BLOCKED-WITH-EVIDENCE, not passed — the console simulator cannot be driven from his phone (keyboard has no Enter key, console mic never captures voice, one console "tokens" error), the Alexa+ app has no skills surface and its chat intercepted the invocation natively, and alexa.amazon.com Your Skills does not list the dev skill. All four platform issues are friction-logged (FRICTION-LOG.md Entries 5–8).
4. [Muse] GitHub repo (public) with source, README run instructions, license decision per Open Source stretch.
5. [Gee, at submission time] Repo → Settings → Collaborators → add: chris-trag, knmeiss, giolaq, anishamalde, mosesroth, emersonsklar (invites expire in 7 days — add at submission, not before). Also share with testing@devpost.com per Devpost instructions.
6. [Muse] Demo video produced → uploaded public to his YouTube (via his API) → link into Devpost.
7. [Muse drafts, Gee submits] Devpost form: description (§3), what-changed (§5), product feedback (§6 final), friction log (§7), track = Alexa+, repo URL, video URL.
8. [Both] Final check against this map before the Oct 23, 2:00pm CDT deadline — target: submit by Oct 22.

## Alexa Skill ID (captured Oct 15, 2026, from Gee\u2019s console \u2014 Copy Skill ID on the Live Flash Briefing row)
- Live Flash Briefing skill ID: amzn1.ask.skill.2247ca95-5832-45a4-b666-dd1a73386fd1

## Alexa+ Custom Skill ID (created Oct 15, 2026)
- Best Finds Daily for Alexa+ (Custom, Provision your own): amzn1.ask.skill.18480163-685a-4b01-8c1b-5951b6fda33b
