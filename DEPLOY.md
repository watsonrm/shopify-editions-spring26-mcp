# Deploy the hosted MCP

The HTTP transport (`http.js`) is dependency-free Node and honors `$PORT` — it runs anywhere. Two supported paths; pick one.

## Google Cloud Run (recommended if you already run gcloud)
Uses the `Dockerfile`.
```bash
gcloud run deploy shopify-editions-spring26-mcp \
  --source . --region us-central1 --allow-unauthenticated --port 8080
```
Gives an HTTPS URL like `https://shopify-editions-spring26-mcp-xxxx.run.app`. Verify: `curl <url>` → `{ ok, items, tools }`.

## Vercel
Uses `vercel.json` + `api/mcp.js`.
```bash
vercel --prod
```

## Clean domain (no raw run.app / vercel URL)
Point **`editions.rmwcommerce.com`** at the host:
- **Namecheap:** add a CNAME `editions` → the Cloud Run domain-mapping target (or the Vercel CNAME), then map it in the host (Cloud Run "Manage custom domains" / Vercel "Domains").
- **redirect.pizza:** add a redirect/proxy from the clean URL to the host URL.

## Self-host anywhere
```bash
node http.js                # or: docker build -t editions-mcp . && docker run -p 8080:8080 editions-mcp
```
