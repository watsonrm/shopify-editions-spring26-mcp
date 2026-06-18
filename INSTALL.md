# Install — every surface

Two ways in. **Local (stdio)** for desktop/IDE agents, **Hosted (HTTP)** for web agents. Pick your host below.

---

## The two configs you'll reuse

**Local (stdio)** — one npx command, no clone, no build:
```json
{ "command": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] }
```

**Hosted (HTTP)** — one URL:
```
https://editions.rmwcommerce.com
direct (live now): https://shopify-editions-spring26-mcp-1649969634.us-central1.run.app
```

---

## Per surface

### Claude Code
```bash
claude mcp add shopify-editions -- npx -y shopify-editions-spring26-mcp
# hosted instead:
claude mcp add --transport http shopify-editions https://editions.rmwcommerce.com
```

### Claude Desktop
Edit `claude_desktop_config.json` (Settings → Developer → Edit Config):
```json
{ "mcpServers": { "shopify-editions": { "command": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] } } }
```
Restart Claude Desktop.

### Cursor
`~/.cursor/mcp.json` (or Settings → MCP):
```json
{ "mcpServers": { "shopify-editions": { "command": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] } } }
```

### Cline / Roo (VS Code)
MCP Servers panel → Configure → add the same `mcpServers` block.

### Windsurf
`~/.codeium/windsurf/mcp_config.json` → same `mcpServers` block.

### Zed
`settings.json` → `"context_servers": { "shopify-editions": { "command": { "path": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] } } }`

### Goose (Block)
`goose configure` → Add Extension → Command-line (stdio) → `npx -y shopify-editions-spring26-mcp`.

### VS Code (native MCP, 1.99+)
`.vscode/mcp.json` → `{ "servers": { "shopify-editions": { "command": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] } } }`

### Continue.dev
`config.yaml` → `mcpServers: [{ name: shopify-editions, command: npx, args: [-y, shopify-editions-spring26-mcp] }]`

### ChatGPT (Developer mode / connectors)
Settings → Connectors → add an MCP server → paste `https://editions.rmwcommerce.com`. (Hosted/HTTP only — ChatGPT doesn't run local stdio.)

### Gemini CLI / other HTTP agents · n8n · Make · LibreChat
Add an MCP/HTTP-tool pointing at `https://editions.rmwcommerce.com` (JSON-RPC `POST /`).

### Raw HTTP (any language, no MCP client)
```bash
# list tools
curl -s https://editions.rmwcommerce.com -X POST -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
# call one
curl -s https://editions.rmwcommerce.com -X POST \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"unreleased"}}'
# health
curl -s https://editions.rmwcommerce.com
```

### From a local clone (no npm)
```bash
git clone https://github.com/watsonrm/shopify-editions-spring26-mcp && cd shopify-editions-spring26-mcp
# stdio: point the host's "command":"node","args":["/abs/path/server.js"]
# http:  node http.js   (serves on :8787)
```

---

## Tools
`query{domain,topic,level,availability,confidence,verdict,text}` · `get{id}` · `unreleased` · `deprecations` · `customers{merchant?}` · `methodology` · `easter{name,id?}`

## Verify your install works
```bash
npm install && npm test
```
