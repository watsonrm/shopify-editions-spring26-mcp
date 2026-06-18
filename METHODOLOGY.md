# Methodology — what's trusted, and why

This dataset separates **what Shopify claims** (objective, sourced) from **Rick Watson's read** (`rick_lens`, opinion). Every claim is deep-linked to its sources, and every confidence call is explained and traceable.

## Source trust tiers

Not all sources are equal. Each claim is graded by the *best* source backing it:

| Tier | Sources | Trust | What it proves |
|---|---|---|---|
| **1 — Operational / primary** | help.shopify.com, shopify.dev/docs, changelog.shopify.com, shopify.engineering | **Highest** | The feature is actually live/GA and works as described — operational docs only exist for shipped things. |
| **2 — First-party marketing** | shopify.com/editions, /news briefs | Medium | Shopify *claims* it. True-as-described, but marketing ships before docs and before GA. |
| **3 — Video** | the Editions keynote / feature reels (cited by id + timestamp) | Medium | Confirms the mechanic + supplies quotes; on-screen, not operational. |
| **Background** | anything dated *before* the 2026-06-17 drop (e.g. the founders' UCP talk) | Context only | Framing, never release evidence. Flagged `relevance: background`. |
| **Per-entity primary** | a third party's *own* newsroom (e.g. Salesforce, PayPal for UCP support) | High for that entity | The authoritative source for *that company's* claim — not Shopify's to confirm. |

## Confidence ← trust

- **`confirmed`** — backed by a **Tier-1** source, OR a verbatim, non-contestable Tier-2 quote.
- **`inferred`** — Tier-2 only (Shopify marketing), paraphrased. True-as-described, not independently verified.
- **`unverified`** — no source, or **contradicted** by a primary doc (e.g. marketing says "50 pinned metafields"; the live help center still says 20).

## Every claim is traceable — the `trust` block

Each item carries `shopify_claim.trust`:
```json
"trust": {
  "confidence": "confirmed",
  "why": "Live help-center doc documents this as GA (Tier-1, operational).",
  "deciding_sources": ["https://help.shopify.com/…", "https://changelog.shopify.com/…"],
  "history": [
    { "from": "inferred", "to": "confirmed", "reason": "validation found a Tier-1 source the earlier pass missed", "source": "https://changelog.shopify.com/…" }
  ]
}
```
`history` is present only when a claim was **upgraded or downgraded** — so you can see exactly what moved a confidence call and on what evidence. No silent reclassification.

## How it was built (pipeline)
Diff vs. the prior Edition → 6-domain inventory → help.shopify.com hardening → shopify.dev/docs validation → video-transcript mining → adversarial fact-check → merchant-proof scan → generate → **red-team gate** → **full re-validation** (every claim re-checked against primary, both directions). Re-runnable: `pipeline.workflow.js`.

## Corrections log — including the one that got caught

The rigor is the credential. We log what we got **wrong** and fixed:

- **The UCP-endorser deletion (the worst one).** An over-cautious red-team *deleted* Amazon/Meta/Microsoft/Salesforce as "fabricated — not in Shopify's posts." They were real — each announced via its **own** newsroom and the April 24 UCP Tech Council release, not Shopify's January posts. **Root cause:** "couldn't find it in source X" was escalated to "fabricated → delete," instead of capping at "unverified — flag and widen the search." Fix: the coalition was rebuilt from 21 per-entity primary sources across three tiers, and the rule is now hard — *couldn't-find never deletes a claim.*
- WhatsApp campaigns are "coming soon," not live (only consent is live).
- POS pickup/transfers/cash are **POS Pro**, not Plus-exclusive.
- "50 pinned metafields" is announced but the live docs still say 20 → `unverified`.
- Managed Markets UK/Canada is **early access** ("certain stores"), not GA.
- Hydrogen deploys *to* Vercel/Cloudflare — it is not "Next.js"; Oxygen is **not** deprecated.
- (Full machine-readable log: `methodology()` → `corrections_log`.)

## What this is not
A 2026-06-17 snapshot. `coming_soon`/`preview`/`early_access` items will change — re-run the pipeline to refresh. Opinions are Rick Watson's, clearly walled off from fact.
