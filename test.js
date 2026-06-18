/**
 * Surface-independent test harness — runs the tool logic against the real dataset with plain node (no deps).
 * Proves the tools work before any transport. `node test.js`
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dispatch, TOOLS } from "./lib.js";

const PATH = process.env.DATASET || fileURLToPath(new URL("./dataset.json", import.meta.url));
const D = JSON.parse(readFileSync(PATH, "utf8"));
const data = { ITEMS: D.items, META: D.meta };
let pass = 0, fail = 0;
const ok = (name, cond, detail) => { (cond ? pass++ : fail++); console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };

console.log(`\nDataset: ${D.items.length} items · edition ${D.meta.edition}\n--- tool checks ---`);
ok("tools listed", TOOLS.length >= 7, `${TOOLS.length} tools`);
const dep = dispatch("deprecations", {}, data); ok("deprecations returns items", dep.items.length > 0, `${dep.items.length}`);
const un = dispatch("unreleased", {}, data); ok("unreleased index present", (un.index || []).length > 0, `${(un.index||[]).length} unreleased`);
const q1 = dispatch("query", { domain: "agentic" }, data); ok("query domain=agentic", q1.count > 0, `${q1.count}`);
const q2 = dispatch("query", { topic: "supply_chain" }, data); ok("query topic=supply_chain", q2.count > 0, `${q2.count}`);
const q3 = dispatch("query", { availability: "coming_soon" }, data); ok("query availability=coming_soon", q3.count > 0, `${q3.count}`);
const q4 = dispatch("query", { confidence: "confirmed" }, data); ok("query confidence=confirmed", q4.count > 0, `${q4.count}`);
const g = dispatch("get", { id: q1.items[0].id }, data); ok("get returns full item", !!g.shopify_claim, q1.items[0].id);
const cust = dispatch("customers", {}, data); ok("customers proof present", (cust.merchant_proof || []).length > 0, `${(cust.merchant_proof||[]).length} merchants`);
const meth = dispatch("methodology", {}, data); ok("methodology present", !!meth && !!meth.pipeline, `${(meth.pipeline||[]).length} phases`);
ok("easter:whoami", !!dispatch("easter", { name: "whoami" }, data).wink);
ok("easter:goliath_paradox", !!dispatch("easter", { name: "goliath_paradox" }, data).framework);
const tc = dispatch("easter", { name: "time_capsule" }, data); ok("easter:time_capsule list", (tc.unreleased_with_checkback||[]).length > 0);
const firstUnrel = (un.index || [])[0];
if (firstUnrel) { const w = dispatch("easter", { name: "will_it_ship", id: firstUnrel.id }, data); ok("easter:will_it_ship", !!w.ship_likelihood || !!w.note, firstUnrel.id); }
const rcp = dispatch("easter", { name: "receipts", id: "ucp_endorsers" }, data); ok("easter:receipts(ucp_endorsers)", !!rcp.receipts);
ok("unknown tool guarded", !!dispatch("bogus", {}, data).error);

console.log(`\n--- ${pass} passed, ${fail} failed ---`);
process.exit(fail ? 1 : 0);
