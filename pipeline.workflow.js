/**
 * Shopify Editions -> MCP dataset — the pipeline that built this, as a re-runnable Workflow.
 *
 * Ships in the repo on purpose: "here's not just the data, here's the machine that made it."
 * Run to REFRESH (coming_soon items ship and flip to live) or to build the NEXT Edition.
 *   Workflow({ scriptPath: "pipeline.workflow.js", args: { edition: "Winter '26", prior: "Spring '26",
 *              editions_url: "https://www.shopify.com/editions/winter2026" } })
 *
 * Determinism + the verify/red-team gates are baked in, so a refresh is reproducible, not vibes.
 */
export const meta = {
  name: 'editions-dataset',
  description: 'Build the verified, opinion-ready Shopify Editions dataset (diff -> inventory -> harden -> cross-check -> generate -> red-team -> assemble)',
  phases: [
    { title: 'Diff',        detail: 'renames / deprecations / repositionings vs. the prior Edition' },
    { title: 'Inventory',   detail: '6 domains in parallel — every distinct change' },
    { title: 'Harden',      detail: 'help.shopify.com + shopify.dev/docs + video transcripts' },
    { title: 'Cross-check', detail: 'adversarial fact-check + named-merchant proof scan' },
    { title: 'Generate',    detail: '6 domains -> schema-conformant JSON' },
    { title: 'Red-team',    detail: 'confidence + source audit; corrections applied' },
    { title: 'Assemble',    detail: 'merge, dedup, attach proof + methodology' },
  ],
}

const ED = args?.edition ?? "Spring '26"
const PRIOR = args?.prior ?? "Winter '26"
const URL = args?.editions_url ?? 'https://www.shopify.com/editions/spring2026'
const DOMAINS = ['agentic','storefront','pos_retail','marketing','payments','developer']
const FINDINGS = { type:'object', properties:{ items:{type:'array'}, notes:{type:'string'} }, required:['items'] }
const VERDICT  = { type:'object', properties:{ corrections:{type:'array'}, summary:{type:'string'} }, required:['corrections'] }

// 1) DIFF vs prior edition — the renames/deprecations a flat list hides
phase('Diff')
const diff = await agent(`Diff Shopify ${ED} vs ${PRIOR}: every rename, deprecation, repositioning, net-new-vs-build-out. Primary sources only.`, { label:'diff', schema:FINDINGS })

// 2) INVENTORY — 6 domains in parallel (barrier: we want the full map before generating)
phase('Inventory')
const inventory = await parallel(DOMAINS.map(d => () =>
  agent(`Exhaustively inventory the ${d} domain of Shopify ${ED} from ${URL} + the merchant/dev briefs. Every distinct feature.`,
        { label:`inv:${d}`, phase:'Inventory', schema:FINDINGS })))

// 3) HARDEN + 4) CROSS-CHECK — independent verification surfaces, all in parallel
phase('Harden')
const [helpCenter, devDocs, video] = await parallel([
  () => agent(`Verify ${ED} merchant claims against help.shopify.com (operational = actually-GA vs marketing). Flag absences.`, { label:'help-center', phase:'Harden', schema:VERDICT }),
  () => agent(`Validate ${ED} dev claims against shopify.dev/docs. Per item: documented / partial / not_found, with the doc URL.`, { label:'dev-docs', phase:'Harden', schema:VERDICT }),
  () => agent(`Find + parse the ${ED} release video transcripts (yt-dlp captions from youtube.com/@shopify). Cite quotes with timestamps; flag any without captions.`, { label:'video', phase:'Harden', schema:FINDINGS }),
])
phase('Cross-check')
const [factCheck, merchants] = await parallel([
  () => agent(`Adversarially REFUTE the ${ED} headline claims against primary/press sources. Verdict + source per claim.`, { label:'fact-check', phase:'Cross-check', schema:VERDICT }),
  () => agent(`Scan all ${ED} sources for NAMED-merchant testimonials/case studies AND their conspicuous absence (esp. agentic: is any real merchant shown transacting via an agent?).`, { label:'merchant-proof', phase:'Cross-check', schema:FINDINGS }),
])

// 5) GENERATE the objective layer per domain (carry the verified facts + confidence tags)
phase('Generate')
const generated = await parallel(DOMAINS.map(d => () =>
  agent(`Emit schema-conformant dataset JSON for the ${d} slice of ${ED}: shopify_claim{} fully populated (level/price/availability/newness/topics/sources w/ date+relevance/caveats/dev_docs), rick_lens{} BLANK. Honest confidence tags.`,
        { label:`gen:${d}`, phase:'Generate', schema:FINDINGS })))

// 6) RED-TEAM gate — downgrade marketing-only 'confirmed' -> 'inferred', strip phantom citations, spot-verify
phase('Red-team')
const audit = await agent(`Red-team the generated dataset: confidence honesty (confirmed requires a primary/operational source), strip phantom dev_docs/help_center citations, spot-verify the dozen headline claims live. Return mechanical corrections.`,
  { label:'red-team', schema:VERDICT, effort:'high' })

// 7) ASSEMBLE — deterministic merge/dedup/attach happens in code after the run (see assemble.py).
phase('Assemble')
log(`${ED}: inventoried ${inventory.filter(Boolean).length}/6 domains, generated ${generated.filter(Boolean).length}/6, red-team corrections ready. Run assemble.py to merge + attach merchant_proof + methodology.`)
return { edition: ED, diff, inventory, harden:{helpCenter,devDocs,video}, crosscheck:{factCheck,merchants}, generated, audit }
