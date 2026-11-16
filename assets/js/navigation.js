/**
 * AV STUDIO — Navigation Module
 * Manages sticky header state, mobile drawer accessibility,
 * and active section link tracking.
 */

export function initNavigation() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = Array.from(document.querySelectorAll('.primary-nav__link'));
  const drawerLinks = Array.from(document.querySelectorAll('.mobile-drawer__link, .mobile-drawer__cta'));

  if (header) {
    const updateScrolledState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
  }

  const closeDrawer = () => {
    if (!drawer || !toggleBtn) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  const openDrawer = () => {
    if (!drawer || !toggleBtn) return;
    drawer.removeAttribute('hidden');
    drawer.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
  };

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
        toggleBtn.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
      }
    });
  }

  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', matches);
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
