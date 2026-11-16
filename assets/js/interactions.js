/**
 * AV STUDIO — Interactions Module
 * Sector directory filters, accessible sector scope modal,
 * live customization preview, FAQ accordion, and scroll reveals.
 */

import {
  filterSectors,
  shouldEnableCinematicMotion,
  computeHeroParallax,
  computeHeroDepthShift,
  resolveBrandSurfaceConfig,
  resolveSectorOptionValue,
  resolveSectorFromQuery,
  SECTOR_CTA_MAP,
} from './studio-logic.js';

const SECTOR_DETAILS = {
  restaurantes: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 2)',
    features: [
      'Carta digital filtrable por tiempos y especialidades',
      'Galería gastronómica y ambiente del local en Cuenca',
      'Botón de reservas o pedidos directos por WhatsApp',
      'Ubicación de referencia y horarios en formato 24h',
    ],
  },
  pizzerias: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 2)',
    features: [
      'Menú interactivo de pizzas, hamburguesas y combos',
      'Precios claros en dólares (USD) por tamaño o porción',
      'Selección demostrativa rápida para armar el pedido',
      'Envío directo de orden preparada hacia WhatsApp',
    ],
  },
  cafeterias: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Historia de marca y origen del café ecuatoriano',
      'Secciones separadas de cafés, bebidas y repostería',
      'Galería visual cálida y diseño artesanal',
      'Horarios de atención y acceso rápido a ubicación',
    ],
  },
  pasteleria: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Catálogo visual de panadería, tortas y postres',
      'Formulario para pedidos especiales y fechas',
      'Sección de productos destacados de temporada',
      'Botón directo para cotizar tortas personalizadas',
    ],
  },
  odontologia: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 2)',
    features: [
      'Presentación clara de especialidades y tratamientos',
      'Espacio para equipo profesional e instalaciones',
      'Formulario validado de solicitud de cita',
      'Comunicación directa por WhatsApp y correo',
    ],
  },
  consultorio: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Directorio de especialidades médicas y horarios',
      'Información transparente de atención y requisitos',
      'Solicitud ordenada de cita previa',
      'Diseño sobrio, accesible y confiable en móviles',
    ],
  },
  juridico: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Áreas de práctica jurídica organizadas con claridad',
      'Presentación sobria del estudio y equipo legal',
      'Formulario confidencial de consulta inicial',
      'Tipografía editorial de alta legibilidad',
    ],
  },
  barberia: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 2)',
    features: [
      'Lista de servicios y tarifas claras en USD',
      'Presentación de barberos y galería de estilos',
      'Solicitud de reserva según horario disponible',
      'Acceso inmediato a WhatsApp para confirmar turno',
    ],
  },
  belleza: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Catálogo de tratamientos faciales, capilares y estética',
      'Galería de resultados y ambiente del salón',
      'Reserva demostrativa de citas y asesoría',
      'Estética cálida adaptada a la identidad de la marca',
    ],
  },
  inmobiliaria: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Listado de propiedades para comprar o alquilar',
      'Filtros por sector, tipo de inmueble y habitaciones',
      'Fichas individuales con precios en dólares (USD)',
      'Botón de consulta directa sobre cada propiedad',
    ],
  },
  automotriz: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Servicios de mantenimiento preventivo y diagnóstico',
      'Presentación técnica del taller y equipamiento',
      'Solicitud de turno de revisión vehicular',
      'Contacto ágil para emergencias o cotizaciones',
    ],
  },
  hotel: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Presentación de habitaciones, tarifas y servicios',
      'Experiencias turísticas en Cuenca y la región andina',
      'Galería editorial y mapa de referencia',
      'Formulario de consulta de disponibilidad y reservas',
    ],
  },
  tienda: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Catálogo de productos con filtros y buscador',
      'Fichas detalladas y carrito demostrativo con subtotales',
      'Sección de ofertas y novedades de temporada',
      'Envío de pedido o consulta por WhatsApp',
    ],
  },
  gimnasio: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Programas de entrenamiento y horarios de clases',
      'Planes de membresía claros sin cargos ocultos',
      'Galería de instalaciones y entrenadores',
      'Registro para clase de prueba o inscripción',
    ],
  },
  academia: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Oferta de programas, cursos y metodología',
      'Presentación de docentes y modalidades',
      'Formulario de inscripción o solicitud de pensum',
      'Arquitectura clara para estudiantes y padres',
    ],
  },
  eventos: {
    stage: 'Disponible — Demostración funcional publicada (Etapa 3)',
    features: [
      'Servicios para bodas, celebraciones y corporativos',
      'Galería visual cuidada por tipo de evento',
      'Solicitud de cotización según fecha y aforo',
      'Estética sofisticada adaptable al estilo del evento',
    ],
  },
};

function initSectorDirectory() {
  const filterButtons = Array.from(document.querySelectorAll('[data-filter-group]'));
  const sectorsGrid = document.getElementById('sectors-grid');
  const cards = Array.from(document.querySelectorAll('.sector-card'));
  const countEl = document.getElementById('directory-count');
  const totalCount = cards.length;

  const cardModels = cards.map((el) => ({
    el,
    group: el.getAttribute('data-group') || 'otros',
  }));

  const applyFilter = (group) => {
    const visibleModels = filterSectors(cardModels, group);
    const visibleSet = new Set(visibleModels.map((item) => item.el));

    if (sectorsGrid) {
      sectorsGrid.classList.toggle('is-filtered', group !== 'todos');
    }

    cards.forEach((card) => {
      card.classList.toggle('is-hidden', !visibleSet.has(card));
    });

    if (countEl) {
      countEl.textContent = `Mostrando ${visibleModels.length} de ${totalCount} sectores`;
    }

    filterButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-filter-group') === group;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-filter-group') || 'todos';
      applyFilter(group);
    });
  });

  if (cards.length > 0) {
    applyFilter('todos');
  }
}

function initSectorModal() {
  const dialog = document.getElementById('sector-dialog');
  if (!dialog) return;

  const closeBtn = document.getElementById('sector-dialog-close');
  const webpEl = document.getElementById('sector-dialog-webp');
  const imgEl = document.getElementById('sector-dialog-img');
  const indexEl = document.getElementById('sector-dialog-index');
  const titleEl = document.getElementById('sector-dialog-title');
  const descEl = document.getElementById('sector-dialog-desc');
  const statusEl = document.getElementById('sector-dialog-status');
  const listEl = document.getElementById('sector-dialog-features');
  const quoteBtn = document.getElementById('sector-dialog-quote');
  const openDemoLink = document.getElementById('sector-dialog-open-demo');
  const copyLinkBtn = document.getElementById('sector-dialog-copy-link');
  const copyFeedback = document.getElementById('sector-dialog-copy-feedback');

  let activeSectorKey = '';
  let activeSectorName = '';
  let activeDemoPath = '';

  const openSectorModal = (trigger) => {
    const sectorKey = trigger.getAttribute('data-sector-key') || '';
    const sectorName = trigger.getAttribute('data-sector-name') || 'Sector comercial';
    const sectorDesc = trigger.getAttribute('data-sector-desc') || '';
    const sectorIndex = trigger.getAttribute('data-sector-index') || '';
    const cardRoot = trigger.closest('.sector-card, .demo-showcase');
    const cardImg = cardRoot ? cardRoot.querySelector('img') : null;
    const cardSource = cardRoot ? cardRoot.querySelector('source[type="image/webp"]') : null;
    const cardDemoLink = cardRoot ? cardRoot.querySelector('a.sector-card__btn') : null;
    const detail = SECTOR_DETAILS[sectorKey] || {
      stage: 'Demostración en desarrollo',
      features: ['Diseño personalizado a la identidad de tu negocio', 'Navegación responsive y contacto directo'],
    };
    const ctaInfo = SECTOR_CTA_MAP[sectorKey];

    activeSectorKey = sectorKey;
    activeSectorName = sectorName;
    activeDemoPath =
      (cardDemoLink && cardDemoLink.getAttribute('href')) || (ctaInfo && ctaInfo.demoPath) || '';

    if (indexEl) indexEl.textContent = sectorIndex ? `Sector ${sectorIndex}` : 'Sector comercial';
    if (titleEl) titleEl.textContent = sectorName;
    if (descEl) descEl.textContent = sectorDesc;
    if (statusEl) {
      statusEl.textContent = `${detail.stage}. En AV·STUDIO no mostramos enlaces vacíos ni plantillas cerradas: este sitio se diseña y adapta según las necesidades reales de tu empresa.`;
    }
    if (quoteBtn) {
      quoteBtn.textContent = (ctaInfo && ctaInfo.label) || 'Solicitar proyecto para este sector';
    }
    if (openDemoLink) {
      if (activeDemoPath) {
        openDemoLink.setAttribute('href', activeDemoPath);
        openDemoLink.removeAttribute('hidden');
      } else {
        openDemoLink.setAttribute('hidden', '');
      }
    }
    if (copyFeedback) copyFeedback.textContent = '';

    if (webpEl && cardSource) {
      webpEl.setAttribute('srcset', cardSource.getAttribute('srcset') || '');
    }
    if (imgEl && cardImg) {
      imgEl.setAttribute('src', cardImg.getAttribute('src') || '');
      imgEl.setAttribute('alt', cardImg.getAttribute('alt') || sectorName);
    }

    if (listEl) {
      listEl.innerHTML = '';
      detail.features.forEach((feat) => {
        const li = document.createElement('li');
        li.textContent = `— ${feat}`;
        listEl.appendChild(li);
      });
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  };

  const closeModal = () => {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  document.querySelectorAll('[data-open-sector]').forEach((btn) => {
    btn.addEventListener('click', () => openSectorModal(btn));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeModal();
    }
  });

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      if (!activeDemoPath) return;
      const absoluteDemoUrl = new URL(activeDemoPath, window.location.href).href;
      try {
        await navigator.clipboard.writeText(absoluteDemoUrl);
        if (copyFeedback) {
          copyFeedback.textContent = 'Enlace de la demostración copiado para compartir.';
        }
      } catch {
        if (copyFeedback) {
          copyFeedback.textContent = `Comparte este enlace: ${absoluteDemoUrl}`;
        }
      }
    });
  }

  if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
      closeModal();
      const sectorSelect = document.getElementById('contact-sector');
      const contextEl = document.getElementById('form-sector-context');
      if (sectorSelect && (activeSectorKey || activeSectorName)) {
        const resolvedValue = resolveSectorOptionValue(activeSectorKey, activeSectorName);
        const match = Array.from(sectorSelect.options).find(
          (opt) => opt.value && opt.value === resolvedValue
        );
        if (match) {
          sectorSelect.value = match.value;
          if (contextEl) {
            contextEl.textContent = `Sector preseleccionado desde el catálogo: ${match.value}. Puedes cambiarlo si tu negocio combina otros servicios.`;
            contextEl.removeAttribute('hidden');
          }
        }
      }
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      const nameInput = document.getElementById('contact-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 350);
      }
    });
  }
}

function initSectorPreselection() {
  const sectorSelect = document.getElementById('contact-sector');
  if (!sectorSelect) return;

  const resolved = resolveSectorFromQuery(window.location.search);
  if (!resolved) return;

  const match = Array.from(sectorSelect.options).find(
    (opt) => opt.value && opt.value === resolved.optionValue
  );
  if (!match) return;

  sectorSelect.value = match.value;
  const contextEl = document.getElementById('form-sector-context');
  if (contextEl) {
    contextEl.textContent = `Sector preseleccionado según la demostración consultada: ${match.value}. Completa tus datos para preparar tu solicitud.`;
    contextEl.removeAttribute('hidden');
  }
}

function initCustomizationPreview() {
  const stage = document.getElementById('preview-stage');
  if (!stage) return;

  const paletteThemes = {
    av: {
      bg: '#F3F0E9',
      ink: '#171717',
      accent: '#A64E2B',
      surface: '#FFFFFF',
      label: 'Marfil cálido · Carbón · Terracota',
    },
    nocturno: {
      bg: '#171717',
      ink: '#F3F0E9',
      accent: '#C96F4A',
      surface: '#242422',
      label: 'Carbón · Marfil · Acento Terracota',
    },
    clinico: {
      bg: '#F2F5F3',
      ink: '#1A2B24',
      accent: '#2D6A54',
      surface: '#FFFFFF',
      label: 'Blanco mineral · Verde profundo',
    },
  };

  const fontThemes = {
    editorial: {
      family: "var(--font-display)",
      headline: 'Arquitectura digital pensada para tu marca.',
    },
    geometrica: {
      family: "var(--font-sans)",
      headline: 'Presencia digital clara y enfocada en clientes.',
    },
  };

  const chromeLabel = document.getElementById('preview-chrome-label');
  const headlineEl = document.getElementById('preview-headline');

  let currentPalette = 'av';

  document.querySelectorAll('[data-preview-palette]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preview-palette') || 'av';
      const theme = paletteThemes[key];
      if (!theme) return;
      currentPalette = key;
      stage.style.setProperty('--preview-bg', theme.bg);
      stage.style.setProperty('--preview-ink', theme.ink);
      stage.style.setProperty('--preview-accent', theme.accent);
      stage.style.setProperty('--preview-surface', theme.surface);
      if (chromeLabel) chromeLabel.textContent = theme.label;

      document.querySelectorAll('[data-preview-palette]').forEach((item) => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  document.querySelectorAll('[data-preview-font]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preview-font') || 'editorial';
      const font = fontThemes[key];
      if (!font) return;
      stage.style.setProperty('--preview-font', font.family);
      if (headlineEl) headlineEl.textContent = font.headline;

      document.querySelectorAll('[data-preview-font]').forEach((item) => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  document.querySelectorAll('[data-preview-layout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const layout = btn.getAttribute('data-preview-layout') || 'asimetrica';
      stage.classList.toggle('preview-stage--centered', layout === 'centrada');

      document.querySelectorAll('[data-preview-layout]').forEach((item) => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  if (chromeLabel && paletteThemes[currentPalette]) {
    chromeLabel.textContent = paletteThemes[currentPalette].label;
  }
}

function initFaqAccordion() {
  const triggers = Array.from(document.querySelectorAll('.faq-trigger'));
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        if (isExpanded) {
          panel.setAttribute('hidden', '');
        } else {
          panel.removeAttribute('hidden');
        }
      }
    });
  });
}

function initScrollReveals() {
  const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealNodes.length === 0) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initHeroCinematicParallax() {
  const hero = document.getElementById('inicio');
  if (!hero) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const allowMotion = shouldEnableCinematicMotion({
    prefersReducedMotion: prefersReduced,
    saveData: Boolean(conn && conn.saveData),
    effectiveType: conn ? conn.effectiveType : '',
  });

  if (!allowMotion) {
    hero.classList.add('hero--static');
    hero.style.setProperty('--hero-parallax-y', '0px');
    hero.style.setProperty('--hero-pointer-x', '0px');
    hero.style.setProperty('--hero-pointer-y', '0px');
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    const result = computeHeroParallax({
      rectTop: rect.top,
      rectBottom: rect.bottom,
      viewportHeight: window.innerHeight,
      heroHeight: hero.offsetHeight,
      maxShift: 28,
    });
    if (!result.active) return;
    hero.style.setProperty('--hero-parallax-y', `${result.offsetY}px`);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();

  const canHoverPointer =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHoverPointer) {
    let pointerFrame = false;
    let lastX = 0;
    let lastY = 0;

    hero.addEventListener(
      'pointermove',
      (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = true;
        window.requestAnimationFrame(() => {
          pointerFrame = false;
          const rect = hero.getBoundingClientRect();
          const shift = computeHeroDepthShift({
            clientX: lastX,
            clientY: lastY,
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            maxTilt: 7,
          });
          hero.style.setProperty('--hero-pointer-x', `${shift.x}px`);
          hero.style.setProperty('--hero-pointer-y', `${shift.y}px`);
        });
      },
      { passive: true }
    );

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-pointer-x', '0px');
      hero.style.setProperty('--hero-pointer-y', '0px');
    });
  }
}

function initBrandSystemShowcase() {
  const stage = document.getElementById('brand-system-stage');
  if (!stage) return;

  const labelEl = document.getElementById('brand-surface-status');
  const buttons = Array.from(document.querySelectorAll('[data-brand-surface]'));

  const applySurface = (mode) => {
    const config = resolveBrandSurfaceConfig(mode);
    stage.setAttribute('data-brand-surface-mode', config.mode);
    if (labelEl) {
      labelEl.textContent = config.label;
    }
    buttons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-brand-surface') === config.mode;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-brand-surface') || 'oscuro';
      applySurface(mode);
    });
  });

  applySurface('oscuro');
}

export function initInteractions() {
  initHeroCinematicParallax();
  initBrandSystemShowcase();
  initSectorDirectory();
  initSectorModal();
  initSectorPreselection();
  initCustomizationPreview();
  initFaqAccordion();
  initScrollReveals();
}
