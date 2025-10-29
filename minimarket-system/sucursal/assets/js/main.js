$(function() {
  // Navbar
  Utils.loadComponent('#navbar', '/minimarket-system/shared/components/navbar.html').then(() => {
    const s = Auth.getSession();
    $('#navbarUser').text(s ? s.usuario : 'Invitado');
    $('#btnLogout').on('click', () => { Auth.logout(); location.href = './index.html'; });
  });

  // Sidebar sucursal con caché de HTML para evitar recarga por navegación
  const loadSidebarCached = (selector, url) => {
    const CACHE_KEY = 'sidebar:sucursal:html:v2';
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      $(selector).html(cached);
      return Promise.resolve();
    }
    return $.get(url).then(html => {
      $(selector).html(html);
      sessionStorage.setItem(CACHE_KEY, html);
    });
  };

  loadSidebarCached('#sidebar', '/minimarket-system/shared/components/sidebar-sucursal.html').then(() => {
    const ACTIVE_KEY = 'sidebar:sucursal:active_module';
    const activeModule = localStorage.getItem(ACTIVE_KEY) || '';

    // Cerrar todo y abrir solo el activo persistido
    $('.menu-module').removeClass('open');
    $('.menu-module .module-toggle').removeClass('active');
    $('.menu-module .submenu').css({ maxHeight: 0 });
    if (activeModule) {
      const $m = $(`.menu-module[data-module="${activeModule}"]`);
      $m.addClass('open');
      $m.find('.module-toggle').addClass('active');
      const $sub = $m.find('.submenu');
      if ($sub.length) $sub.css({ maxHeight: $sub[0]?.scrollHeight || 0 });
    }

    // Toggle módulos: único activo y cerrar otros
    $(document).on('click', '.menu-module .module-toggle', function(e) {
      e.preventDefault();
      const $mod = $(this).closest('.menu-module');
      const id = $mod.data('module');
      const $sub = $mod.find('.submenu');

      // Cerrar otros módulos abiertos
      $('.menu-module.open').not($mod).removeClass('open').find('.submenu').css({ maxHeight: 0 });
      // Remover activo anterior
      $('.menu-module .module-toggle.active').not(this).removeClass('active');

      // Toggle actual
      const isOpen = $mod.toggleClass('open').hasClass('open');
      if (isOpen) $sub.css({ maxHeight: $sub[0]?.scrollHeight || 0 });
      else $sub.css({ maxHeight: 0 });

      // Activar solo el módulo actual
      $(this).toggleClass('active', isOpen);

      // Persistencia: único módulo activo
      if (isOpen) localStorage.setItem(ACTIVE_KEY, id);
      else localStorage.removeItem(ACTIVE_KEY);
    });

    // Al hacer click en un enlace del sidebar: marcar activo único y preparar módulo
    $(document).on('click', '.sidebar-menu a', function() {
      // Estado activo único en enlaces
      $('.sidebar-menu a.active').removeClass('active');
      $(this).addClass('active');
      // Activar módulo padre y desactivar otros
      const $parent = $(this).closest('.menu-module');
      $('.menu-module .module-toggle.active').not($parent.find('.module-toggle')).removeClass('active');
      $parent.addClass('open');
      $parent.find('.module-toggle').addClass('active');
      $('.menu-module.open').not($parent).removeClass('open').find('.submenu').css({ maxHeight: 0 });

      // Persistencia del módulo activo
      const id = $parent.data('module');
      if (id) localStorage.setItem(ACTIVE_KEY, id);
    });

    // Resaltar activo por ruta (y limpiar estados previos)
    const pathname = location.pathname.replace(/\\/g, '/');
    $('.sidebar-menu a.active').removeClass('active');
    $('.menu-module .module-toggle.active').removeClass('active');
    $('.sidebar-menu a').each(function() {
      const href = $(this).attr('href');
      if (!href) return;
      if (pathname.endsWith(href)) {
        $(this).addClass('active');
        const $parent = $(this).closest('.menu-module');
        $parent.addClass('open');
        const $sub = $parent.find('.submenu');
        if ($sub.length) $sub.css({ maxHeight: $sub[0]?.scrollHeight || 0 });
        $parent.find('.module-toggle').addClass('active');
        const id = $parent.data('module');
        if (id) localStorage.setItem(ACTIVE_KEY, id);
      }
    });
  });
});