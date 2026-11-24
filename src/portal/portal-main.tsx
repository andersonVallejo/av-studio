import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../platform/platform.css';
import { PortalApp } from './PortalApp';

const rootEl = document.getElementById('portal-root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <PortalApp />
    </StrictMode>
  );
}
