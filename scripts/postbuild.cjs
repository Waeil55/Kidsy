const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Copy dist/assets to assets/
const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });
  console.log('[Postbuild] Cleaned and copied dist/assets to assets/');
}

// 2. Read dist/index.html
const distIndexFile = path.join(rootDir, 'dist', 'index.html');
if (fs.existsSync(distIndexFile)) {
  let html = fs.readFileSync(distIndexFile, 'utf8');

  // Fix manifest link to always point to root ./manifest.webmanifest
  html = html.replace(/href="\.\/assets\/manifest-[^"]+\.webmanifest"/g, 'href="./manifest.webmanifest"');

  // Write to root index.html
  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
  console.log('[Postbuild] Generated root index.html with direct manifest link');

  // 3. Create 404.html with automatic SPA redirection for GitHub Pages
  // If user opens a missing URL or launches PWA from /Kidsy/assets/ or /, redirect to /Kidsy/index.html
  const redirectScript = `
  <script>
    (function() {
      // GitHub Pages SPA Redirect Handler
      var path = window.location.pathname;
      if (!path.endsWith('.html') && !path.endsWith('.js') && !path.endsWith('.css') && !path.endsWith('.svg') && !path.endsWith('.webmanifest')) {
        // Redirect to repository base
        if (path.indexOf('/Kidsy') !== -1 && path !== '/Kidsy/' && path !== '/Kidsy/index.html') {
          window.location.replace('/Kidsy/index.html');
        }
      }
    })();
  </script>`;

  const html404 = html.replace('</head>', redirectScript + '\n</head>');
  fs.writeFileSync(path.join(rootDir, '404.html'), html404, 'utf8');
  console.log('[Postbuild] Generated 404.html for GitHub Pages SPA routing');
}

// 4. Create robust root manifest.webmanifest
const rootManifest = {
  name: "MerolaApp Enterprise",
  short_name: "MerolaApp",
  description: "Duolingo-grade K-6 learning suite featuring Grade 3 Week 5 curriculum.",
  start_url: "./index.html",
  scope: "./",
  display: "standalone",
  orientation: "any",
  background_color: "#f5f9ff",
  theme_color: "#159eea",
  icons: [
    {
      src: "./icon.svg",
      sizes: "any",
      type: "image/svg+xml"
    }
  ]
};

fs.writeFileSync(
  path.join(rootDir, 'manifest.webmanifest'),
  JSON.stringify(rootManifest, null, 2),
  'utf8'
);
console.log('[Postbuild] Generated root manifest.webmanifest with start_url: "./index.html"');

// 5. Also patch any manifest inside assets/
if (fs.existsSync(rootAssetsDir)) {
  const files = fs.readdirSync(rootAssetsDir);
  for (const f of files) {
    if (f.endsWith('.webmanifest')) {
      const assetManifest = {
        ...rootManifest,
        start_url: "../index.html",
        scope: "../",
        icons: [{ src: "../icon.svg", sizes: "any", type: "image/svg+xml" }]
      };
      fs.writeFileSync(
        path.join(rootAssetsDir, f),
        JSON.stringify(assetManifest, null, 2),
        'utf8'
      );
      console.log(`[Postbuild] Patched ${f} in assets/ to relative parent start_url`);
    }
  }
}

// 6. Copy root files: sw.js, icon.svg, .nojekyll
if (fs.existsSync(path.join(rootDir, 'dist', 'sw.js'))) {
  fs.copyFileSync(path.join(rootDir, 'dist', 'sw.js'), path.join(rootDir, 'sw.js'));
}
if (fs.existsSync(path.join(rootDir, 'dist', 'icon.svg'))) {
  fs.copyFileSync(path.join(rootDir, 'dist', 'icon.svg'), path.join(rootDir, 'icon.svg'));
}
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf8');
console.log('[Postbuild] Created .nojekyll and verified root files.');
