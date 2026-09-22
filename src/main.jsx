import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store/store.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StoreProvider><App /></StoreProvider>
);

// Makes the app installable and able to open with no internet connection. register() simply (and
// silently) fails where a service worker cannot run — the double-click standalone file opened as
// file://, for instance — so no extra checks are needed here.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}
