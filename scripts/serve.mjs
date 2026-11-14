// Serves the built app from ./dist on http://localhost:5173 (run `npm run build` first).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const port = +process.env.PORT || 5173;
http.createServer((req, rsp) => {
  const url = req.url.split('?')[0];
  const p = path.join(dist, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(p)) { rsp.writeHead(404); return rsp.end('Not found'); }
  rsp.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(rsp);
}).listen(port, () => console.log(`Kidsy is running: http://localhost:${port}`));
