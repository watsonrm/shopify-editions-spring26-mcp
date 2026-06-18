/** HTTP transport test — boots http.js, exercises JSON-RPC over HTTP, asserts. `node test-http.js` */
import { spawn } from "node:child_process";

const PORT = 8799;
const srv = spawn("node", ["http.js"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const base = `http://localhost:${PORT}`;
let booted = false;
for (let i = 0; i < 25; i++) {
  try { const h = await (await fetch(base)).json(); if (h.ok) { booted = true; break; } } catch {}
  await sleep(200);
}
try {
  if (!booted) { console.log("FAIL  HTTP server did not boot"); process.exit(1); }
  const health = await (await fetch(base)).json();
  console.log(`PASS  HTTP GET health — ${health.items} items, ${health.tools.length} tools`);
  const list = await (await fetch(base, { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }) })).json();
  console.log(`PASS  HTTP tools/list — ${list.result.tools.length} tools`);
  const call = await (await fetch(base, { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "unreleased" } }) })).json();
  const n = JSON.parse(call.result.content[0].text).index.length;
  console.log(`PASS  HTTP tools/call unreleased — ${n} items`);
  console.log("--- HTTP transport: OK ---");
} finally {
  srv.kill();
}
process.exit(0);
