$(async function() {
  const $thead = $('#dataTable thead');
  const $tbody = $('#dataTable tbody');
  const data = await API.get('/api/minimarkets');

  const headers = ['ID', 'Nombre', 'Estado', 'Acciones'];
  $thead.html(`<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`);

  const renderRows = (rows) => {
    $tbody.html(rows.map(r => `
      <tr data-id="${r.id}">
        <td>${r.id}</td>
        <td>${r.nombre}</td>
        <td>${r.estado}</td>
        <td class="table-actions">
          <button class="btn btn-primary" data-action="edit" data-id="${r.id}">Editar</button>
          <button class="btn btn-danger" data-action="delete" data-id="${r.id}">Eliminar</button>
        </td>
      </tr>
    `).join(''));
    $('#tableInfo').text(`${rows.length} registros`);
  };

  renderRows(data);

  // Buscador
  $('#tableSearch').on('input', Utils.debounce(function() {
    const q = $(this).val().toLowerCase();
    const filtered = data.filter(d => d.nombre.toLowerCase().includes(q));
    renderRows(filtered);
  }, 200));

  // Acciones
  $tbody.on('click', '[data-action="delete"]', async function() {
    const id = $(this).data('id');
    $('#modalTitle').text('Eliminar sucursal');
    $('#modalBody').text(`¿Deseas eliminar la sucursal #${id}?`);
    $('#modalBackdrop').addClass('show');
    $('#modalConfirm').one('click', async () => {
      await API.del(`/api/minimarkets/${id}`);
      Notifications.show('Eliminado', 'success');
      $('#modalBackdrop').removeClass('show');
    });
    $('#modalCancel').one('click', () => $('#modalBackdrop').removeClass('show'));
  });
});