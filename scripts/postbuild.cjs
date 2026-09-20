const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// dist/assets -> assets/ (clean + copy)
const distAssets = path.join(dist, 'assets');
const rootAssets = path.join(root, 'assets');
if (fs.existsSync(rootAssets)) fs.rmSync(rootAssets, { recursive: true, force: true });
if (fs.existsSync(distAssets)) {
  fs.mkdirSync(rootAssets, { recursive: true });
  for (const f of fs.readdirSync(distAssets)) {
    copyFile(path.join(distAssets, f), path.join(rootAssets, f));
  }
  console.log('[Postbuild] Cleaned and copied dist/assets to assets/');
}

// dist/index.html -> root index.html with relative asset paths
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace(/href="\/manifest\.webmanifest"/, 'href="./manifest.webmanifest"');
html = html.replace(/href="\/icon\.svg"/, 'href="./icon.svg"');
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('[Postbuild] Generated root index.html');

// 404.html for GitHub Pages SPA routing
const notFound = `<!DOCTYPE html><html><head><meta charset="utf-8"><script>location.replace(location.href.replace(/\\/Kidsy\\/.*/, '/Kidsy/index.html'));</script></head><body></body></html>`;
fs.writeFileSync(path.join(root, '404.html'), notFound);

// root manifest + sw + icon + .nojekyll
copyFile(path.join(root, 'public', 'manifest.webmanifest'), path.join(root, 'manifest.webmanifest'));
copyFile(path.join(dist, 'sw.js'), path.join(root, 'sw.js'));
copyFile(path.join(root, 'public', 'icon.svg'), path.join(root, 'icon.svg'));
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log('[Postbuild] Generated 404.html, manifest, sw.js, icon.svg, .nojekyll');
