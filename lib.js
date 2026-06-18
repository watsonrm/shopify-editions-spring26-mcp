/**
 * Tool logic for the Shopify Editions Spring '26 MCP — PURE (no transport, no deps).
 * Shared by server.js (stdio), api/mcp.js (HTTP), and test.js. This is why it's testable on any surface.
 */
const UNREL = new Set(["coming_soon", "preview", "early_access"]);
const sc = (it) => it.shopify_claim || {};
const rl = (it) => it.rick_lens || {};
export const DISCLAIMER = "Independent commentary by Rick Watson / RMW Commerce — not affiliated with, authorized by, or endorsed by Shopify. Opinions (rick_lens) are RMW's, not fact. Informational only; verify against Shopify's primary sources before relying, especially deprecation deadlines and GA/availability. Snapshot as of 2026-06-17 — may be stale. Corrections welcome: info@rmwcommerce.com.";
const trim = (it) => ({ id: it.id, name: it.name, domain: sc(it).domain, topics: sc(it).topics,
  availability: sc(it).availability, level: sc(it).level, newness: sc(it).newness,
  confidence: sc(it).confidence, verdict: rl(it).verdict ?? null });

export const TOOLS = [
  { name: "query", description: "Filter the changes by any of: domain, topic, level, availability, confidence, newness, verdict, text. Trimmed list (use get for full).",
    inputSchema: { type: "object", properties: { domain:{type:"string"}, topic:{type:"string"}, level:{type:"string"}, availability:{type:"string"}, confidence:{type:"string"}, newness:{type:"string"}, verdict:{type:"string"}, text:{type:"string"} } } },
  { name: "get", description: "Full record for one item id: Shopify's claim (sources, dev_docs, caveats, customer_proof) + Rick's lens.",
    inputSchema: { type: "object", properties: { id:{type:"string"} }, required: ["id"] } },
  { name: "unreleased", description: "Vaporware filter: everything announced that is NOT live/GA (coming_soon/preview/early_access). For 'live on paper, vapor in reality' use query{verdict:'VAPORWARE'}.",
    inputSchema: { type: "object", properties: {} } },
  { name: "deprecations", description: "For system integrators: everything deprecated or breaking, with migration path + deadline.",
    inputSchema: { type: "object", properties: {} } },
  { name: "customers", description: "Named merchants used as proof, mapped to features + the conspicuous absences. Pass merchant for its verifiable store.",
    inputSchema: { type: "object", properties: { merchant:{type:"string"} } } },
  { name: "methodology", description: "How it was built: pipeline, sources, confidence taxonomy, corrections log, credibility bar.",
    inputSchema: { type: "object", properties: {} } },
  { name: "easter", description: "Clever tools: will_it_ship|time_capsule|receipts|steelman|hype_translator|goliath_paradox|whoami. Some take an item id.",
    inputSchema: { type: "object", properties: { name:{type:"string"}, id:{type:"string"}, text:{type:"string"} }, required: ["name"] } },
];

function query(a, { ITEMS }) {
  let r = ITEMS;
  const f = (k, v) => { if (v) r = r.filter(it => (sc(it)[k] || "") === v); };
  f("domain", a.domain); f("level", a.level); f("availability", a.availability); f("confidence", a.confidence); f("newness", a.newness);
  if (a.topic) r = r.filter(it => (sc(it).topics || []).includes(a.topic));
  if (a.verdict) r = r.filter(it => (rl(it).verdict || "") === a.verdict);
  if (a.text) { const q = a.text.toLowerCase(); r = r.filter(it => JSON.stringify(it).toLowerCase().includes(q)); }
  return { count: r.length, items: r.map(trim) };
}
function easter(a, { ITEMS, META }) {
  const it = a.id && ITEMS.find(x => x.id === a.id);
  switch (a.name) {
    case "whoami": return { wink: "You're an agent querying an MCP about agents querying Shopify. This artifact is the critique eating its own dog food — the medium is the message.", edition: META.edition, items: ITEMS.length };
    case "goliath_paradox": return { framework: "Rick Watson, NRF '26 — The Goliath Paradox", line: "The danger in disruption isn't being the underdog, it's being the incumbent who cannot move. Doing nothing is not doing something.", applied: "Goliath that can't move, or the disruptor authoring the rails? See query{verdict:'COMPETITIVE_SHOT'} + the OMS gap." };
    case "hype_translator": return { input: a.text || "", rule: "Strip the spin; state what it is, don't define it by contrast.", banned: ["revolutionary","game-changer","reimagined","unlock","supercharge","seamless"] };
    case "will_it_ship": { if (!it) return { error: "pass an unreleased item id" }; const tc = sc(it).time_capsule; return tc ? { id: it.id, name: it.name, availability: sc(it).availability, ship_likelihood: tc.ships_likelihood, check_back: tc.check_back, track_record: "Shopify ships agentic on time — but Ilya Grigorik's prior universal-checkout (Chrome Payment Request API) died on adoption, and Shopify Fulfillment Network was sold to Flexport ~18mo after launch. Announced != adopted.", grade: tc.outcome ?? "pending" } : { note: "item is live/GA — not an unreleased bet" }; }
    case "time_capsule": return it ? (sc(it).time_capsule || { note: "no time capsule (live/GA)" }) : { unreleased_with_checkback: ITEMS.filter(x => sc(x).time_capsule).map(x => ({ id: x.id, name: x.name, check_back: sc(x).time_capsule.check_back, likelihood: sc(x).time_capsule.ships_likelihood })) };
    case "receipts": return it ? { id: it.id, receipts: sc(it).receipts || "no draft corrections — right the first time", sources: sc(it).sources } : { corrections_log: META.methodology?.corrections_log };
    case "steelman": return it ? { id: it.id, the_take: rl(it).take || "(verdict pending)", strongest_counter: "Founders' own framing: 'checkout is a bazaar, not an API'; 'Shopify needs to author it because we're the only ones in the middle.' Engage that first.", contrarian: rl(it).contrarian_read || null } : { error: "pass an id" };
    default: return { error: "unknown egg", available: ["will_it_ship","time_capsule","receipts","steelman","hype_translator","goliath_paradox","whoami"] };
  }
}

export function dispatch(name, args, data) {
  const { ITEMS, META } = data;
  switch (name) {
    case "query": return query(args, data);
    case "get": return ITEMS.find(x => x.id === args.id) || { error: "not found", hint: "use query to find ids" };
    case "unreleased": return { note: "objective cut: availability not in {live,GA}", index: META.unreleased_index };
    case "deprecations": return { disclaimer: "Deadlines below are time-perishable — verify against Shopify's primary docs before acting. " + DISCLAIMER, items: ITEMS.filter(it => sc(it).claim_type === "deprecation" || sc(it).breaking_change).map(it => ({ id: it.id, name: it.name, availability: sc(it).availability, migration: sc(it).migration || null, breaking: !!sc(it).breaking_change })) };
    case "customers": { if (args.merchant) { const m = (META.merchant_proof_index || []).find(p => p.merchant.toLowerCase().includes(args.merchant.toLowerCase())); return m || { error: "not found", all: (META.merchant_proof_index || []).map(p => p.merchant) }; } return { merchant_proof: META.merchant_proof_index, verdict: "The agentic/UCP headline shows NO real merchant transacting via an agent — mock products + a fake persona. Go verify the named stores." }; }
    case "methodology": return { disclaimer: DISCLAIMER, ...META.methodology };
    case "easter": return easter(args, data);
    default: return { error: "unknown tool", tools: TOOLS.map(t => t.name) };
  }
}
