$(async function() {
  const $thead = $('#dataTable thead');
  const $tbody = $('#dataTable tbody');
  const data = await API.get('/api/productos');

  const headers = ['ID', 'Producto', 'Precio', 'Stock', 'Acciones'];
  $thead.html(`<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`);

  const renderRows = (rows) => {
    $tbody.html(rows.map(r => `
      <tr data-id="${r.id}">
        <td>${r.id}</td>
        <td>${r.nombre}</td>
        <td>${Utils.formatCurrency(r.precio)}</td>
        <td>${r.stock}</td>
        <td class="table-actions">
          <button class="btn" data-action="add" data-id="${r.id}">Agregar al POS</button>
        </td>
      </tr>
    `).join(''));
    $('#tableInfo').text(`${rows.length} registros`);
  };

  renderRows(data);

  $('#tableSearch').on('input', Utils.debounce(function() {
    const q = $(this).val().toLowerCase();
    const filtered = data.filter(d => d.nombre.toLowerCase().includes(q));
    renderRows(filtered);
  }, 200));
});