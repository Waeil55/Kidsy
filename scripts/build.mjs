// Builds Kidsy with esbuild (no Vite/webpack needed).
//   npm run build      -> dist/index.html + assets, and dist/kidsy-standalone.html (double-click, works offline)
//   npm run dev        -> rebuilds on every change and serves on http://localhost:5173
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const watch = process.argv.includes('--watch');
fs.mkdirSync(dist, { recursive: true });

// pdf.js worker is embedded as text so PDF reading works offline and from file://
function workerText() {
  const candidates = [
    path.join(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return fs.readFileSync(c, 'utf8');
  return '';
}

async function buildAll() {
  const t0 = Date.now();
  const res = await esbuild.build({
    entryPoints: [path.join(root, 'src/main.jsx')],
    bundle: true, minify: !watch, sourcemap: watch ? 'inline' : false,
    format: 'iife', target: ['es2022'],
    jsx: 'automatic', platform: 'browser', outfile: path.join(dist, 'app.js'),
    define: { 'process.env.NODE_ENV': watch ? '"development"' : '"production"', global: 'globalThis' },
    loader: { '.js': 'jsx' }, logLevel: 'warning', legalComments: 'none',
    external: ['module', 'fs', 'path', 'canvas', 'node:*'],
  });
  const css = await esbuild.transform(fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8'), { loader: 'css', minify: !watch });
  fs.writeFileSync(path.join(dist, 'app.css'), css.code);
  const wt = workerText();
  fs.writeFileSync(path.join(dist, 'pdf-worker.js'), `window.__KIDSY_PDF_WORKER__=${JSON.stringify(wt)};`);
  const tpl = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
  fs.writeFileSync(path.join(dist, 'index.html'), tpl.replace('<!--CSS-->', () => '<link rel="stylesheet" href="app.css">').replace('<!--JS-->', () => '<script src="pdf-worker.js"></script><script src="app.js"></script>'));
  const js = fs.readFileSync(path.join(dist, 'app.js'), 'utf8').replace(/<\/script/g, '<\\/script');
  fs.writeFileSync(path.join(dist, 'kidsy-standalone.html'), tpl.replace('<!--CSS-->', () => `<style>${css.code}</style>`).replace('<!--JS-->', () => `<script>window.__KIDSY_PDF_WORKER__=${JSON.stringify(wt).replace(/<\/script/g, '<\\/script')};</script><script>${js}</script>`));
  const kb = (f) => (fs.statSync(path.join(dist, f)).size / 1024).toFixed(0) + ' KB';
  console.log(`built in ${Date.now() - t0}ms  app.js ${kb('app.js')}  app.css ${kb('app.css')}  standalone ${kb('kidsy-standalone.html')}`);
  return res;
}

if (watch) {
  const { default: http } = await import('node:http');
  let building = false;
  const rebuild = async () => { if (building) return; building = true; try { await buildAll(); } catch (e) { console.error(e.message); } building = false; };
  await rebuild();
  fs.watch(path.join(root, 'src'), { recursive: true }, () => setTimeout(rebuild, 150));
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  http.createServer((req, rsp) => {
    const p = path.join(dist, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(p)) { rsp.writeHead(404); return rsp.end('Not found'); }
    rsp.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(rsp);
  }).listen(5173, () => console.log('Kidsy dev server: http://localhost:5173'));
} else {
  await buildAll();
}
