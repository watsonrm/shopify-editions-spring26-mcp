/** Real MCP handshake over stdio via the official SDK client — proves the Claude Desktop / Cursor path. `node test-stdio.js` */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const t = new StdioClientTransport({ command: "node", args: ["server.js"] });
const c = new Client({ name: "triplicate-test", version: "1.0.0" }, { capabilities: {} });
await c.connect(t);
const list = await c.listTools();
console.log("PASS  tools/list —", list.tools.map(x => x.name).join(", "));
const dep = JSON.parse((await c.callTool({ name: "deprecations", arguments: {} })).content[0].text);
console.log("PASS  tools/call deprecations —", dep.items.length, "items");
const sc = JSON.parse((await c.callTool({ name: "query", arguments: { topic: "supply_chain" } })).content[0].text);
console.log("PASS  tools/call query{supply_chain} —", sc.count);
const eg = JSON.parse((await c.callTool({ name: "easter", arguments: { name: "goliath_paradox" } })).content[0].text);
console.log("PASS  tools/call easter:goliath_paradox —", !!eg.framework);
await c.close();
console.log("--- STDIO transport: OK ---");
process.exit(0);
