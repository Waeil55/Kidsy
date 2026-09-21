import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store/store.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StoreProvider><App /></StoreProvider>
);
