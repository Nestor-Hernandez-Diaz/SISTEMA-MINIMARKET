$(async function() {
  if (!Auth.requireRole(['superadmin'])) return;
  // Datos simulados de KPIs
  const sucursales = await API.get('/api/minimarkets');
  const activos = sucursales.filter(s => s.estado === 'Activa').length;
  const inactivos = sucursales.length - activos;
  $('#kpiSucursales').text(sucursales.length);
  $('#kpiActivas').text(activos);
  $('#kpiInactivas').text(inactivos);
});