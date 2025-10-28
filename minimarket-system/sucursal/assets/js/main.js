$(function() {
  // Navbar
  Utils.loadComponent('#navbar', '/minimarket-system/shared/components/navbar.html').then(() => {
    const s = Auth.getSession();
    $('#navbarUser').text(s ? s.usuario : 'Invitado');
    $('#btnLogout').on('click', () => { Auth.logout(); location.href = './index.html'; });
  });
  // Sidebar sucursal (jerárquico con persistencia de estado)
  Utils.loadComponent('#sidebar', '/minimarket-system/shared/components/sidebar-sucursal.html').then(() => {
    const KEY = 'sidebar:sucursal:expanded';
    const expanded = JSON.parse(localStorage.getItem(KEY) || '[]');

    // Expandir según persistencia
    expanded.forEach(mod => {
      const $m = $(`.menu-module[data-module="${mod}"]`);
      $m.addClass('open');
      $m.find('.submenu').css({ maxHeight: $m.find('.submenu')[0]?.scrollHeight || 0 });
    });

    // Toggle módulos
    $('.menu-module .module-toggle').on('click', function() {
      const $mod = $(this).closest('.menu-module');
      const id = $mod.data('module');
      const isOpen = $mod.toggleClass('open').hasClass('open');
      const $sub = $mod.find('.submenu');
      if (isOpen) $sub.css({ maxHeight: $sub[0]?.scrollHeight || 0 });
      else $sub.css({ maxHeight: 0 });
      // Persistencia
      const set = new Set(expanded);
      if (isOpen) set.add(id); else set.delete(id);
      localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
    });

    // Resaltar activo por ruta
    const pathname = location.pathname.replace(/\\/g, '/');
    $('.sidebar-menu a').each(function(){
      const href = $(this).attr('href');
      if (!href) return;
      if (pathname.endsWith(href)) {
        $(this).addClass('active');
        const $parent = $(this).closest('.menu-module');
        $parent.addClass('open');
        const $sub = $parent.find('.submenu');
        $sub.css({ maxHeight: $sub[0]?.scrollHeight || 0 });
        $parent.find('.module-toggle').addClass('active');
      }
    });
  });
});