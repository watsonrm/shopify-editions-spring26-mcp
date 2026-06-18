# Install — works on any agent surface

Tested in triplicate: **stdio** (official MCP SDK) and **HTTP/JSON-RPC**, plus a surface-independent logic harness (`node test.js`). Pick your surface.

## Hosted (no install) — ChatGPT, web, any HTTP agent
Point your agent's MCP/connector config at the hosted endpoint:
```
https://editions.rmwcommerce.com        (clean domain; falls back to the Vercel URL)
```
- **Health check:** `GET /` returns `{ ok, items, tools }`.
- **Call a tool:** `POST /` JSON-RPC, e.g.
  ```bash
  curl -s https://editions.rmwcommerce.com -X POST \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"unreleased"}}'
  ```
- **ChatGPT:** Settings → Connectors / Developer mode → add an MCP server → paste the URL.

## Claude Desktop / Cursor / Cline / Windsurf (stdio)
Add to the host's MCP config (`claude_desktop_config.json`, Cursor `mcp.json`, etc.):
```json
{
  "mcpServers": {
    "shopify-editions-spring26": {
      "command": "npx",
      "args": ["-y", "shopify-editions-spring26-mcp"]
    }
  }
}
```
Or run from a local clone: `"command": "node", "args": ["/path/to/shopify-editions-spring26-mcp/server.js"]`.

## Claude Code (one line)
```bash
claude mcp add shopify-editions-spring26 -- npx -y shopify-editions-spring26-mcp
# or hosted:  claude mcp add --transport http shopify-editions-spring26 https://editions.rmwcommerce.com
```

## The tools
| tool | for | example |
|---|---|---|
| `query{domain,topic,level,availability,confidence,verdict,text}` | everyone | `query{topic:"supply_chain"}` |
| `get{id}` | full record + sources | `get{id:"ucp_protocol"}` |
| `unreleased` | the vaporware cut (not live/GA) | — |
| `deprecations` | system integrators (deadlines, migrations) | — |
| `customers{merchant?}` | merchant proof + the conspicuous absences | — |
| `methodology` | how it was built + corrections log | — |
| `easter{name,id?}` | will_it_ship · time_capsule · receipts · steelman · hype_translator · goliath_paradox · whoami | `easter{name:"will_it_ship",id:"campaign_autopilot"}` |

## Verify it yourself
```bash
npm install && node test.js            # logic, no transport
node http.js & curl localhost:8787      # HTTP transport
node test-stdio.js                      # stdio handshake (needs the SDK)
```
