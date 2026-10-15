# Product Feedback — Best Finds Daily for Alexa+ (Devpost submission field)
**Status: FINAL.** One marked clause in the Alexa+ section is completed from live console notes on submit day (after wiring); everything else is final and reflects the actual build.

## MCP (Model Context Protocol, spec 2025-11-25, Streamable HTTP)
- **Used for:** the integration layer between Alexa+ and a live creator data operation — four tools serving a daily briefing, a daily Top 5, a verified deals catalog, and a hub directory.
- **What worked well:** the tools/list + tools/call contract maps cleanly onto real content operations; a single HTTP endpoint is hostable anywhere, including free serverless tiers; JSON-RPC error shapes are predictable and testable with a small local harness (ours runs 21 protocol checks, all passing).
- **What needs work:** session semantics (Mcp-Session-Id) assume a stateful server; on serverless isolates, strict server-side validation breaks valid conversations because consecutive requests land on different isolates. A documented stateless/serverless session profile (e.g., signed self-contained session tokens) would remove the most common correctness trap for this class of host. Separately, the submission requirement states only a version string ("2025-11-25 or later"); header, session, and error-shape expectations have to be assembled from the spec itself. A hosted conformance echo endpoint would cut that guesswork.
- **Onboarding:** spec-first reading is heavy for non-infrastructure developers. A minimal "your first MCP server for Alexa+" path — a deployable reference worker plus a one-page conformance checklist — would shorten time-to-first-tool-call from days to an afternoon.
- **Would build again?** Yes — MCP is the right shape for creator data: write the server once, and any agent client can ask it questions.

## Alexa+ / Agent Skills
- **Used for:** upgrading an existing Flash Briefing property (Best Finds Daily, submitted for Alexa skill certification on October 11, 2026) into a conversational experience backed by live data.
- **What worked well:** the upgrade path is natural when the underlying content is already structured daily data — the existing briefing feed became a tool with no content rework, and the four tools mirror the questions listeners actually ask (today's finds, budget search, where the promo code lives).
- **What needs work:** guidance for the thousands of existing Flash Briefing skills on how to present MCP-backed upgrades — metadata, invocation expectations, and review criteria — is thin. A short migration note aimed at feed-based skills would help that entire population.
- **[Completed on submit day from the live wiring session: console flow notes, any account-owner confirmation steps encountered, and conversation-test behaviour — appended here before submission.]**
- **Would build again?** Yes — this is the obvious next step for every daily-feed skill on the platform.

## Hosting note (not an Amazon product; context for the feedback above)
The MCP server runs on Cloudflare Workers' free tier beside the production feed worker: a single zero-dependency file. No cold-start impact was observed in local protocol testing; total running cost is $0. The one deployment friction worth recording: with no pre-provisioned API credential on the build workstation, deployment falls back to the Cloudflare dashboard editor — a scoped-token quickstart in the hackathon's deploy guidance would remove that stall for agent-driven builds.
