$(function() {
  // Navbar
  Utils.loadComponent('#navbar', '/minimarket-system/shared/components/navbar.html').then(() => {
    const s = Auth.getSession();
    $('#navbarUser').text(s ? s.usuario : 'Invitado');
    $('#btnLogout').on('click', () => { Auth.logout(); location.href = './index.html'; });
  });
  // Sidebar sucursal
  Utils.loadComponent('#sidebar', '/minimarket-system/shared/components/sidebar-sucursal.html').then(() => {
    const path = location.pathname.split('/').pop();
    const map = {
      'dashboard.html': 'dashboard',
      'productos.html': 'productos',
      'compras.html': 'compras',
      'almacen.html': 'almacen',
      'inventario.html': 'inventario',
      'pos.html': 'ventas',
      'caja.html': 'caja',
      'clientes.html': 'clientes',
      'cotizaciones.html': 'cotizaciones',
      'transferencias.html': 'transferencias',
      'reportes.html': 'reportes',
      'usuarios.html': 'usuarios',
      'parametros.html': 'parametros'
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
        'productos': 'productos/productos.html',
        'compras': 'compras/compras.html',
        'almacen': 'almacen/almacen.html',
        'inventario': 'inventario/inventario.html',
        'ventas': 'ventas/pos.html',
        'caja': 'caja/caja.html',
        'clientes': 'clientes/clientes.html',
        'cotizaciones': 'cotizaciones/cotizaciones.html',
        'transferencias': 'transferencias/transferencias.html',
        'reportes': 'reportes/reportes.html',
        'usuarios': 'usuarios/usuarios.html',
        'parametros': 'parametros/parametros.html'
      };
      if (routes[link]) {
        window.location.href = routes[link];
      }
    });
  });
});