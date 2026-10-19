# Friction Log — Best Finds Daily for Alexa+ (hackathon build, Oct 13–23, 2026)
Format per Devpost: task attempted · steps · expected vs. actual · severity · workaround · suggestion.
Entries are recorded as friction actually occurs during the build.

## Entry 1 — MCP session semantics on serverless isolates
- **Task:** Implement MCP Streamable HTTP session handling (Mcp-Session-Id) for a Cloudflare Worker.
- **Steps:** Wrote initialize → issue session id; designed tools/call to validate the id.
- **Expected vs. actual:** Expected a session id issued by one request to be validatable on the next. On Workers, consecutive requests routinely land on different isolates with no shared memory, so strict server-side session validation would randomly 404 valid conversations.
- **Severity:** Medium — protocol-correctness risk for any serverless MCP host.
- **Workaround:** Honour known ids, tolerate a missing id (stateless-friendly), 404 only forged/stale ids; documented the deviation in code + README.
- **Suggestion:** The MCP spec / Alexa+ guidance should publish a blessed stateless-serverless session profile (e.g., signed self-contained session tokens) so implementers don't each invent one.

## Entry 2 — No programmatic deploy path without pre-provisioned credentials
- **Task:** Deploy the MCP worker beside the existing production feed worker.
- **Steps:** Tried wrangler CLI first (fastest path for an agent-driven build).
- **Expected vs. actual:** Expected the workstation that builds the daily feed to hold a deploy credential. Actual: wrangler reports "not authenticated"; deployment falls back to the Cloudflare dashboard in a browser session.
- **Severity:** Low — a one-time setup cost, but it breaks fully-automated agent build pipelines.
- **Workaround:** Prepared a single-file build of the worker (worker-singlefile.js, verified locally) for a one-paste deploy through the Cloudflare dashboard editor; the deploy itself is the one step gated on the account owner's Cloudflare sign-in, and is executed on submit day.
- **Suggestion:** For Alexa+ hackathon participants, a documented "deploy your MCP server" quickstart with a scoped API-token walkthrough would remove the most common stall.
- **Resolution (Oct 15, 2026):** A scoped Cloudflare API token ("Muse Deploy", Edit Workers template) was provisioned by the account owner into secure storage; deploys have run agent-side since, most recently Oct 19, 2026. The dashboard-paste fallback is retired.

## Entry 4 — Embedded data snapshots go stale silently
- **Task:** Keep the MCP server's embedded Temu Top 5 snapshot current with the daily Temu drop.
- **Steps:** The daily drop flow refreshes the snapshot in the server's data module; a pre-submission audit (Oct 19, 2026) called the live `get_temu_top5` tool and compared its output against the drop records.
- **Expected vs. actual:** Expected the served snapshot to match the latest completed drop (Oct 18). Actual: the server still served the Oct 16 snapshot — an earlier refresh step had reported complete without the served data changing. Nothing in the tool output flags its own age beyond a date label most clients will not check.
- **Severity:** Medium — stale prices/items would be served to Alexa+ users and hackathon judges as "today's" finds.
- **Workaround:** Refreshed the snapshot to the Oct 18 verified drop, rebuilt the single-file bundle, updated the protocol harness assertions to the new snapshot (21/21 pass), redeployed, and re-verified against the live endpoint in the same session.
- **Suggestion:** MCP tool responses that embed snapshot data should carry a machine-readable freshness contract (snapshot date + max-age), so clients and auditors can detect staleness without out-of-band knowledge.

## Entry 3 — Spec version pinning is discoverable only from the fine print
- **Task:** Confirm which MCP spec revision Alexa+ requires.
- **Steps:** Read the hackathon requirements: "MCP server (spec 2025-11-25 or later, Streamable HTTP)".
- **Expected vs. actual:** Expected the requirement to link a conformance checklist. Actual: only the version string is given; session, header, and error-shape expectations had to be assembled from the MCP spec itself.
- **Severity:** Low.
- **Workaround:** Implemented to the spec text and built a local protocol harness (21 checks) to self-verify.
- **Suggestion:** Publish a one-page Alexa+ MCP conformance checklist + a public echo/test endpoint participants can point their server at.
