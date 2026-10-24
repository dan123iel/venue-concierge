import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Serve static assets from dist/client
const clientDist = join(process.cwd(), "dist/client");

// Dynamically import the SSR server entry
let handler;
async function getHandler() {
  if (!handler) {
    const { default: h } = await import("../dist/server/server.js");
    handler = h;
  }
  return handler;
}

export default async function (req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Serve static assets
  if (url.pathname.startsWith("/assets/")) {
    try {
      const filePath = join(clientDist, url.pathname);
      const content = readFileSync(filePath);
      const ext = url.pathname.split(".").pop();
      const mime = {
        js: "application/javascript",
        css: "text/css",
        svg: "image/svg+xml",
        png: "image/png",
        woff2: "font/woff2",
      }[ext] ?? "application/octet-stream";
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.end(content);
      return;
    } catch {
      // fall through to SSR
    }
  }

  // SSR
  const h = await getHandler();
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers,
  });

  const response = await h.fetch(request, {}, {});

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const body = await response.arrayBuffer();
  res.end(Buffer.from(body));
}
