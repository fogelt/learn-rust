/* Tiny static server for previewing the course locally: node tools/serve.js */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const url = decodeURIComponent((request.url || "/").split("?")[0]);
  const relative = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  const file = path.resolve(ROOT, relative);

  if (!file.startsWith(ROOT)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Rust from Zero preview: http://localhost:${PORT}`);
});
