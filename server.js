#!/usr/bin/env node
/** stdio MCP transport — for Claude Desktop, Claude Code, Cursor, Cline, Windsurf (any stdio MCP host). */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TOOLS, dispatch } from "./lib.js";

const D = JSON.parse(readFileSync(fileURLToPath(new URL("./dataset.json", import.meta.url)), "utf8"));
const data = { ITEMS: D.items, META: D.meta };
const server = new Server({ name: "shopify-editions-spring26", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) =>
  ({ content: [{ type: "text", text: JSON.stringify(dispatch(req.params.name, req.params.arguments || {}, data), null, 2) }] }));
await server.connect(new StdioServerTransport());
console.error("shopify-editions-spring26 MCP (stdio) ready —", D.items.length, "items");
