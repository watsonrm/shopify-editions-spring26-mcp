/** Vercel serverless MCP (HTTP/JSON-RPC). vercel.json rewrites all routes here, so the MCP serves at the domain root. */
import { TOOLS, dispatch } from "../lib.js";
import D from "../dataset.json" with { type: "json" };

const data = { ITEMS: D.items, META: D.meta };

export default function handler(req, res) {
  if (req.method === "GET")
    return res.status(200).json({ name: "shopify-editions-spring26 MCP", ok: true, edition: D.meta.edition, items: D.items.length, tools: TOOLS.map(t => t.name) });
  const m = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const send = (result) => res.status(200).json({ jsonrpc: "2.0", id: m.id, result });
  switch (m.method) {
    case "initialize": return send({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "shopify-editions-spring26", version: "1.0.0" } });
    case "notifications/initialized": return res.status(202).end();
    case "tools/list": return send({ tools: TOOLS });
    case "tools/call": return send({ content: [{ type: "text", text: JSON.stringify(dispatch(m.params?.name, m.params?.arguments || {}, data), null, 2) }] });
    default: return res.status(200).json({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "unknown method: " + m.method } });
  }
}
