/**
 * AV·STUDIO — Contact & Project Request Module
 * Validates project inquiry inputs and prepares formatted
 * WhatsApp and Email messages without fake backend claims.
 */

import {
  validateContactForm,
  formatInquiryMessage,
  buildWhatsAppUrl,
  buildMailtoUrl,
} from './studio-logic.js';

export function initContactForm() {
  const form = document.getElementById('project-request-form');
  if (!form) return;

  const fields = {
    name: document.getElementById('contact-name'),
    business: document.getElementById('contact-business'),
    sector: document.getElementById('contact-sector'),
    siteType: document.getElementById('contact-site-type'),
    contactChannel: document.getElementById('contact-channel'),
    contactInfo: document.getElementById('contact-info'),
    budget: document.getElementById('contact-budget'),
    timeline: document.getElementById('contact-timeline'),
    description: document.getElementById('contact-description'),
  };

  const outputBox = document.getElementById('prepared-output');
  const previewEl = document.getElementById('prepared-message-preview');
  const waLink = document.getElementById('prepared-whatsapp-link');
  const mailLink = document.getElementById('prepared-email-link');
  const copyBtn = document.getElementById('prepared-copy-btn');
  const copyFeedback = document.getElementById('prepared-copy-feedback');

  let activeMode = 'whatsapp';

  form.querySelectorAll('button[data-submit-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeMode = btn.getAttribute('data-submit-mode') || 'whatsapp';
    });
  });

  const clearFieldErrors = () => {
    Object.entries(fields).forEach(([key, input]) => {
      if (!input) return;
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      const errorEl = document.getElementById(`error-${key}`);
      if (errorEl) errorEl.textContent = '';
    });
  };

  Object.entries(fields).forEach(([key, input]) => {
    if (!input) return;
    const clearEvent = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(clearEvent, () => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      const errorEl = document.getElementById(`error-${key}`);
      if (errorEl) errorEl.textContent = '';
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFieldErrors();

    const rawData = {
      name: fields.name?.value || '',
      business: fields.business?.value || '',
      sector: fields.sector?.value || '',
      siteType: fields.siteType?.value || '',
      contactChannel: fields.contactChannel?.value || 'WhatsApp',
      contactInfo: fields.contactInfo?.value || '',
      budget: fields.budget?.value || '',
      timeline: fields.timeline?.value || '',
      description: fields.description?.value || '',
    };

    const result = validateContactForm(rawData);

    if (!result.valid) {
      if (outputBox) outputBox.setAttribute('hidden', '');
      let firstInvalid = null;

      Object.entries(result.errors).forEach(([key, message]) => {
        const input = fields[key];
        const errorEl = document.getElementById(`error-${key}`);
        if (input) {
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = input;
        }
        if (errorEl) {
          errorEl.textContent = message;
        }
      });

      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const messageText = formatInquiryMessage(result.clean);
    const waUrl = buildWhatsAppUrl(result.clean);
    const mailUrl = buildMailtoUrl(result.clean);

    if (previewEl) previewEl.textContent = messageText;
    if (waLink) waLink.setAttribute('href', waUrl);
    if (mailLink) mailLink.setAttribute('href', mailUrl);
    if (copyFeedback) copyFeedback.textContent = '';

    if (outputBox) {
      outputBox.removeAttribute('hidden');
      outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (activeMode === 'email' && mailLink) {
      mailLink.focus();
    } else if (waLink) {
      waLink.focus();
    }
  });

  if (copyBtn && previewEl) {
    copyBtn.addEventListener('click', async () => {
      const text = previewEl.textContent || '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        if (copyFeedback) copyFeedback.textContent = 'Mensaje copiado al portapapeles.';
      } catch {
        if (copyFeedback) copyFeedback.textContent = 'Selecciona el texto para copiarlo manualmente.';
      }
    });
  }
}
