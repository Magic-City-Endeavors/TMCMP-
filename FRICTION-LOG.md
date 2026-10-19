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

## Entry 5 — Console conversation test cannot be completed from a phone (2026-10-19)
- **Task:** Run the standard Alexa Developer Console conversation test (Test tab, Alexa Simulator, Development stage) after pasting the new interaction model and rebuilding the skill (model build succeeded — Build History "Latest (2), 10/19/2026 @ 8:39 AM"; Build tab checklist all green).
- **Steps:** In the console on the account owner's only device (a Galaxy S24 phone): opened the simulator in both the mobile layout and the desktop-site layout; typed the invocation utterance ("open best finds daily") into the simulator input; attempted submission by keyboard and by the console's hold-to-talk mic.
- **Expected vs. actual:** Expected typed utterances to submit on Enter and the hold-to-talk mic to capture voice. Actual: (1) the phone's keyboard exposes only a "next field" action key — no Enter/return key exists on its layout — so typed utterances sit in the input and never fire; (2) the console's hold-to-talk mic never captured voice in either the mobile or the desktop layout; (3) one attempt surfaced the console's own error toast: "Error completing Alexa request — Cannot read properties of undefined (reading 'tokens')". The desktop-site layout does render the full simulator, including the Skill I/O and Device Display panels, but input submission from the phone remained blocked, so no conversation could be run.
- **Severity:** High for phone-only developers — the canonical pre-submission test is unreachable from the only device the developer owns, even though the skill itself is built and its endpoint is verified.
- **Workaround:** Verified the skill's behavior out-of-band: synthetic Alexa Skills Kit requests sent directly to the skill's HTTPS endpoint return correct spoken responses for the launch request and every custom intent (see Entry note in the build record, ask-adapter-build-20261019.md). The endpoint + model are proven; the console conversation test itself remains blocked-with-evidence, not passed.
- **Suggestion:** Give the simulator an explicit on-screen Send button for typed utterances (Enter-key submission assumes a desktop keyboard), and make the simulator's hold-to-talk path work on mobile browsers — or ship a lightweight mobile test client. A growing share of independent developers are phone-only.

## Entry 6 — Alexa+ Preview app has no skills management surface (2026-10-19)
- **Task:** Find where, in the Alexa+ Preview app, the account owner can view or enable an in-development skill.
- **Steps:** Inspected both pages of the app's More grid tile by tile. Page 1: Music & More, Communicate, Lists & Notes, Reminders & Tasks, Routines, Alarms & Timers, Alexa+ Store, Calendar. Page 2: Automotive, Emergency Assist, Find My, Cooking Library, Files. Also opened the Alexa+ Store.
- **Expected vs. actual:** Expected a Skills & Games section with a Your Skills / DEV list, as in the classic Alexa app. Actual: no Skills & Games, no Your Skills, and no surface of any kind for viewing or enabling a developer skill. The Alexa+ Store is a curated add-on storefront for partner services, not a skill manager.
- **Severity:** Medium — a developer testing their own in-development skill on their own account has no in-app path to it.
- **Workaround:** None in-app; fell back to the developer console (see Entry 5) and the alexa.amazon.com web page (see Entry 8).
- **Suggestion:** Restore a Your Skills / developer-skills view in the Alexa+ app, or deep-link from the developer console to the skill's enable page in the app.

## Entry 7 — Alexa+ chat answers the invocation natively instead of routing to the skill (2026-10-19)
- **Task:** Invoke the in-development custom skill by name in the Alexa+ app ("Open Best Finds Daily").
- **Steps:** Opened the Alexa+ app chat and asked: "Open Best Finds Daily."
- **Expected vs. actual:** Expected the request to route to the custom skill whose invocation name is "best finds daily" (model built successfully the same morning). Actual: Alexa+'s native "Daily Trending Finds" feature answered instead — "Those trending finds are already pulled up! Anything catch your eye?" — inside a conversation headed "Daily Trending Finds — Alexa+ Preview". The utterance never reached the skill's endpoint.
- **Severity:** Medium — invocation-name collisions with native Alexa+ features silently shadow the developer's skill in the app experience, with no indication to the user that a skill was bypassed.
- **Workaround:** None available in the app; endpoint-level verification (Entry 5 workaround) stands in for live invocation.
- **Suggestion:** When an utterance matches a developer skill's invocation name on the developer's own account, route to the skill (or disclose that a native feature answered instead), so developers can tell routing failures apart from skill failures.

## Entry 8 — alexa.amazon.com Your Skills does not list the in-development skill (2026-10-19)
- **Task:** View/enable the in-development skill from the alexa.amazon.com Your Skills web page while signed in as the account owner.
- **Steps:** Opened the Your Skills page (alexa.amazon.com, skills/your-skills) in the phone browser, signed in on the same Amazon account that owns the skill, and inspected the list.
- **Expected vs. actual:** Expected the in-development skill ("Best Finds Daily for Alexa+") to appear, as developer skills historically appear in Your Skills with a DEV marker. Actual: the skill is not on the list.
- **Severity:** Medium — combined with Entry 6, there is no consumer-side surface anywhere (app or web) where the account owner can view or enable their own in-development skill.
- **Workaround:** None; the skill's Development-stage testing state is set in the developer console, and endpoint-level verification (Entry 5) is the only working validation path from the owner's devices.
- **Suggestion:** List in-development skills on the Your Skills web page for the owning account, with their testing/enable state shown.
