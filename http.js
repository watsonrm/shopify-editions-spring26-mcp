/** HTTP (JSON-RPC) MCP transport — dependency-free. For ChatGPT connectors, web hosts, curl. `node http.js` (PORT env). */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TOOLS, dispatch } from "./lib.js";

const D = JSON.parse(readFileSync(fileURLToPath(new URL("./dataset.json", import.meta.url)), "utf8"));
const data = { ITEMS: D.items, META: D.meta };
const PORT = process.env.PORT || 8787;

createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.method === "GET") return res.end(JSON.stringify({ name: "shopify-editions-spring26 MCP", ok: true, edition: D.meta.edition, items: D.items.length, tools: TOOLS.map(t => t.name) }));
  let buf = "";
  req.on("data", c => (buf += c));
  req.on("end", () => {
    let m; try { m = JSON.parse(buf || "{}"); } catch { res.statusCode = 400; return res.end('{"error":"bad json"}'); }
    const send = (result) => res.end(JSON.stringify({ jsonrpc: "2.0", id: m.id, result }));
    switch (m.method) {
      case "initialize": return send({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "shopify-editions-spring26", version: "1.0.0" } });
      case "notifications/initialized": res.statusCode = 202; return res.end();
      case "tools/list": return send({ tools: TOOLS });
      case "tools/call": return send({ content: [{ type: "text", text: JSON.stringify(dispatch(m.params?.name, m.params?.arguments || {}, data), null, 2) }] });
      default: return res.end(JSON.stringify({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "unknown method: " + m.method } }));
    }
  });
}).listen(PORT, () => console.error("shopify-editions-spring26 HTTP MCP on :" + PORT + " — " + D.items.length + " items"));
