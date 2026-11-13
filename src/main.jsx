import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store/store.js';
import App from './App.jsx';
import ErrorBoundary from './ui/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <StoreProvider><App /></StoreProvider>
  </ErrorBoundary>
);

// Makes the app installable and able to open with no internet connection. register() simply (and
// silently) fails where a service worker cannot run — the double-click standalone file opened as
// file://, for instance. The iOS/Android apps already ship every file inside the app, so they skip
// it: a cached service worker there would keep showing old screens after an app-store update.
const isNativeApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
if ('serviceWorker' in navigator && !isNativeApp) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}
