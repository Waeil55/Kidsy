// Renders the source images the iOS / Android apps need (into ./assets), from the same fox SVGs
// as the web icons. Then `npx @capacitor/assets generate` turns them into every native size.
//   npm run app:assets
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets');
fs.mkdirSync(out, { recursive: true });
const BLUE = '#2f9bec';
const icon = fs.readFileSync(path.join(root, 'scripts/icon-src.svg'));
const maskable = fs.readFileSync(path.join(root, 'scripts/icon-maskable-src.svg'));

// App Store icon: 1024 square, no transparency.
await sharp(icon, { density: 1200 }).resize(1024, 1024).flatten({ background: BLUE }).png().toFile(path.join(out, 'icon-only.png'));
// Android adaptive icon: foreground art + plain background.
await sharp(maskable, { density: 1200 }).resize(1024, 1024).png().toFile(path.join(out, 'icon-foreground.png'));
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BLUE } }).png().toFile(path.join(out, 'icon-background.png'));
// Splash: icon centred on the brand blue (light and dark use the same art).
const mark = await sharp(icon, { density: 1200 }).resize(800, 800).png().toBuffer();
for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: BLUE } })
    .composite([{ input: mark, gravity: 'center' }]).png().toFile(path.join(out, name));
}
console.log('app assets written to', out);
