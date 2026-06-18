# Shopify Editions Spring '26 — MCP

Ask any AI agent what Shopify *actually* shipped in the Spring '26 Edition. **237 distinct changes (Shopify announced "150+"), each graded by source tier — 104 confirmed against primary docs, the rest tracked to Shopify's own marketing and flagged as such. Queryable in one call.**

It doesn't claim every line is gospel — it tells you, per claim, exactly how much to trust it and why. That transparency is the point.

By [Rick Watson](https://rmwcommerce.com) / RMW Commerce.

---

## Use it in 30 seconds

**Hosted — anything that speaks MCP over HTTP (ChatGPT, web agents, curl):**
```
https://editions.rmwcommerce.com
direct: https://shopify-editions-spring26-mcp-1649969634.us-central1.run.app
```

**Local — Claude Desktop, Claude Code, Cursor, Cline, Windsurf, Zed, Goose, VS Code:**
```json
{
  "mcpServers": {
    "shopify-editions": { "command": "npx", "args": ["-y", "shopify-editions-spring26-mcp"] }
  }
}
```

That's it. Per-surface steps for **every** host → **[INSTALL.md](INSTALL.md)**.

---

## Ask it things

| You want | Tool |
|---|---|
| What got deprecated, and the deadline | `deprecations` |
| What's announced but **not live yet** | `unreleased` |
| What's new for B2B / supply chain / payments / … | `query {topic:"b2b"}` |
| Everything in one domain | `query {domain:"agentic"}` |
| The full record for one feature | `get {id:"ucp_protocol"}` |
| Who's verified to support UCP | `get {id:"ucp_endorsers"}` |
| Which merchants Shopify showcased (and the gaps) | `customers` |
| How this was built + every correction we made | `methodology` |

Seven tools: `query` · `get` · `unreleased` · `deprecations` · `customers` · `methodology` · `easter`.

---

## Why trust it

Built by a multi-agent pipeline; every claim checked against Shopify's own docs (help center, dev docs, changelog, videos), adversarially red-teamed, with a **public corrections log** of what we got wrong and fixed. Full method → **[METHODOLOGY.md](METHODOLOGY.md)**.

## Found an error?
Corrections welcome — **info@rmwcommerce.com**. Every fix lands in the public corrections log (`methodology` → `corrections_log`); getting it right beats being right the first time.

## Verify it yourself
```bash
npm install && npm test     # logic + HTTP + stdio, all asserted
```

## License
MIT (code & data). Opinions (`rick_lens`) © Rick Watson / RMW Commerce, reuse with attribution. Independent commentary — not affiliated with or endorsed by Shopify.
