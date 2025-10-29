$(function() {
  // Cargar componentes compartidos
  Utils.loadComponent('#navbar', '../shared/components/navbar.html').then(() => {
    const s = Auth.getSession();
    $('#navbarUser').text(s ? s.usuario : 'Invitado');
    $('#btnLogout').on('click', () => { Auth.logout(); location.href = '../superadmin/index.html'; });
  });
  Utils.loadComponent('#sidebar', '../shared/components/sidebar.html').then(() => {
    const path = location.pathname.split('/').pop();
    const map = {
      'dashboard.html': 'dashboard',
      'minimarkets.html': 'minimarkets',
      'administradores.html': 'administradores',
      'reportes-globales.html': 'reportes',
      'auditoria.html': 'auditoria',
      'configuracion.html': 'configuracion'
    };
    const active = map[path] || 'dashboard';
    $('.sidebar .menu a').removeClass('active');
    $(`.sidebar .menu a[data-link="${active}"]`).addClass('active');
    
    // Navegación del sidebar
    $('.sidebar .menu a').on('click', function(e) {
      e.preventDefault();
      const link = $(this).data('link');
      const routes = {
        'dashboard': 'dashboard.html',
        'minimarkets': 'minimarkets.html',
        'administradores': 'administradores.html',
        'reportes': 'reportes-globales.html',
        'auditoria': 'auditoria.html',
        'configuracion': 'configuracion.html'
      };
      if (routes[link]) {
        window.location.href = routes[link];
      }
    });
  });

  // Toggle sidebar en mobile
  $('#toggleSidebar').on('click', () => $('.sidebar').toggleClass('show'));
});