$(async function() {
  if (!Auth.requireRole(['sucursal'])) return;
  const productos = await API.get('/api/productos');
  $('#kpiProductos').text(productos.length);
  const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  $('#kpiStock').text(stockTotal);
  $('#kpiVentasHoy').text(Utils.formatCurrency(0));
});