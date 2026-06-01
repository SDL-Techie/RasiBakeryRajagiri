import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
// Sample data helper is kept for manual testing only
import { initializeSampleData } from './utils/sampleData';

// ensure storage keys exist; we no longer auto-populate with dummy items
if (!localStorage.getItem('rasi_cart')) {
  localStorage.setItem('rasi_cart', JSON.stringify([]));
}
if (!localStorage.getItem('rasi_orders')) {
  localStorage.setItem('rasi_orders', JSON.stringify([]));
}
if (!localStorage.getItem('rasi_wishlist')) {
  localStorage.setItem('rasi_wishlist', JSON.stringify([]));
}

// developers can call `initializeSampleData()` from the console if they
// want to seed test values; it is not invoked automatically anymore.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
