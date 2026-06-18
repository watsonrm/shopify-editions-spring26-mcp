# Shopify Editions Spring '26 — MCP

**The most thorough, primary-source-verified, opinion-decorated map of everything Shopify shipped in the Spring '26 Edition (released 2026-06-17) — queryable by any AI agent over MCP.**

By [Rick Watson](https://rmwcommerce.com) / RMW Commerce. ~238 changes, each sourced, confidence-tagged, and cross-indexed by who's asking.

> **Status: v1.0.** Objective layer complete, red-teamed, and dev-docs-validated (237 items, ~100 with multi-source deep links). MCP server **tested in triplicate** — logic · HTTP/JSON-RPC · stdio (official SDK). The opinion layer (`rick_lens`) lands next, by Rick. See the credibility bar below.

---

## Why this exists

Shopify's Spring '26 Edition is a bet on agentic commerce: products discoverable by AI agents, transacting over the open Universal Commerce Protocol. So the honest way to analyze it is *through the same paradigm* — an MCP server an agent can query. The medium is the argument.

Anyone can scrape the 150+ feature list. The value here is two things scraping can't give you: **verification** (every claim checked against primary docs, with the errors we caught logged) and **a point of view** (which of these actually matter, what's theater, who wins and loses).

## Two layers — never blurred

| Layer | What it is | Who fills it |
|---|---|---|
| `shopify_claim` | What Shopify claims, sourced to primary docs/videos, confidence-tagged | Machine-extracted + verified |
| `rick_lens` | The verdict, the take, winners/losers, the contrarian read, the falsifiable watch-signal | Rick Watson — clearly attributed, never presented as fact |

## How it was built (and why you can trust it)

A multi-agent primary-source pipeline: **diff** vs. the prior Edition → 6-domain **inventory** → **help.shopify.com** hardening → **video-transcript** mining → adversarial **fact-check** → **merchant-proof** scan → **shopify.dev/docs** validation → **red-team gate**. Full detail in `dataset.json → meta.methodology`.

**Confidence taxonomy:**
- `confirmed` — backed by an operational/primary source (help center, dev docs, changelog, engineering) or a verbatim non-contestable quote.
- `inferred` — stated only on Shopify marketing (true-as-described, not independently confirmed).
- `unverified` — couldn't confirm, or contradicted by the docs. **Do not publish as fact.**

Honest split: **~47 confirmed / ~181 inferred / ~10 unverified.** ~79% of items rest only on Shopify's own marketing — the only source that exists for a product announcement. We *label* that rather than dress it up. (The dev-docs pass upgrades dev-facing items where real documentation exists.)

**Corrections the verification caught and fixed** (the rigor is the credential):
- Removed Amazon/Meta/Microsoft/Salesforce from the UCP endorser list — they appear in web summaries but *no primary source*.
- WhatsApp campaigns are "coming soon," not live (only consent is live).
- POS pickup/transfers/cash are **POS Pro**, not Plus-exclusive.
- Shopify Payments UAE is not Plus-gated.
- Campaign Autopilot has no help-center doc — early access, not GA.
- Hydrogen is a framework that deploys *to* Vercel/Cloudflare — not "runs on Next.js"; Oxygen is **not** deprecated.
- "Shop" *is* an agentic channel (help-center silence was doc-lag, not absence).

## The credibility bar this is built to clear

Expert reviewers (e.g. Shopify's own UCP architects) will disagree with the opinions — they judge the *artifact*: clean MCP citizenship, zero factual howlers, a hard wall between fact and opinion, steelman-before-critique, falsifiable verdicts (every take names the signal that would change Rick's mind), empirical over armchair (the merchant-proof scan: no real merchant is shown transacting via an agent — mock products and a fake persona), honesty about what's not GA, and above all: be genuinely *useful*.

## Query it (persona lenses)

- **System integrator:** `deprecations_with_deadlines()` · `breaking_changes()` · `whats_GA_for_devs()`
- **Vendor / competitor:** `threatens_category(x)` · `native_absorptions()` · `partner_opportunities()`
- **Merchant:** `whats_live_for(plan, segment)` · `signups_open()` · `by_topic("supply_chain")` · `cost_of(feature)`
- **Press / analyst:** `by_verdict("THEATER")` · `winners_losers()` · `contrarian_reads()` · `watch_signals()` · `founder_quotes(topic)` · `customers_featured()` · `verify_case_study(merchant)`
- **Provenance:** `methodology()` · `sources(id)`

## Snapshot & freshness

A **2026-06-17 snapshot.** `coming_soon`/`preview`/`early_access` items will ship and change; re-run the pipeline to refresh.

## License & attribution

Code and data structure: MIT (see `LICENSE`). Facts about Shopify aren't copyrightable; short Shopify quotes are fair-use excerpts. **All `rick_lens` opinions © Rick Watson / RMW Commerce** — reuse with attribution. Not affiliated with or endorsed by Shopify.
