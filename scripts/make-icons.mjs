// Renders the Kidsy fox icon (scripts/icon-src.svg) to every PNG size a PWA / iOS / favicon needs.
// Run once (npm run icons); the output lands in public/icons and is committed like any other asset,
// so the normal build does not need sharp or a browser to produce them.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/icons');
fs.mkdirSync(out, { recursive: true });

const src = fs.readFileSync(path.join(root, 'scripts/icon-src.svg'));
const maskableSrc = fs.readFileSync(path.join(root, 'scripts/icon-maskable-src.svg'));

const sizes = [16, 32, 48, 72, 96, 120, 128, 144, 152, 167, 180, 192, 256, 384, 512];

async function run() {
  for (const s of sizes) {
    await sharp(src, { density: 384 }).resize(s, s).png().toFile(path.join(out, `icon-${s}.png`));
  }
  for (const s of [192, 512]) {
    await sharp(maskableSrc, { density: 384 }).resize(s, s).png().toFile(path.join(out, `maskable-${s}.png`));
  }
  // apple-touch-icon: iOS ignores alpha and rounds the corners itself, so give it a flat (non-transparent) square.
  await sharp(src, { density: 384 }).resize(180, 180).flatten({ background: '#2f9bec' }).png().toFile(path.join(out, 'apple-touch-icon.png'));
  // favicon.ico-equivalent modern browsers accept: a 32px PNG works fine referenced as the shortcut icon.
  fs.copyFileSync(path.join(out, 'icon-32.png'), path.join(out, 'favicon.png'));
  console.log('icons written to', out);
}
run();
