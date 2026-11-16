/**
 * AV STUDIO — Main Entry Point
 * Initializes navigation, editorial interactions, contact system,
 * and dynamic copyright year.
 */

import { initNavigation } from './navigation.js';
import { initInteractions } from './interactions.js';
import { initContactForm } from './contact.js';

function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initInteractions();
  initContactForm();
  initFooterYear();
});
