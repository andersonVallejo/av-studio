import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../platform/platform.css';
import { AdminApp } from './AdminApp';

const rootEl = document.getElementById('admin-root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
}
