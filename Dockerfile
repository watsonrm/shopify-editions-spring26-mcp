# Container image for the HTTP MCP — deploys to Google Cloud Run, Fly, Render, any container host.
# Cloud Run injects $PORT; http.js already honors it. Dependency-free runtime (the SDK is only for stdio).
FROM node:22-slim
WORKDIR /app
COPY package.json lib.js http.js dataset.json ./
ENV PORT=8080
EXPOSE 8080
CMD ["node", "http.js"]
