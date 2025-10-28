$(function() {
  $('form[data-auto]').on('submit', async function(e) {
    e.preventDefault();
    const $form = $(this);
    const $btn = $form.find('[type="submit"]');
    $btn.prop('disabled', true).text('Guardando...');
    const errors = Validation.validateForm($form);
    if (errors.length) {
      Notifications.show('Corrige los campos requeridos', 'warning');
      $btn.prop('disabled', false).text('Guardar');
      return;
    }
    const data = $form.serializeArray().reduce((a,c)=>({...a,[c.name]:c.value}),{});
    const res = await API.post('/api/resource', data);
    Notifications.show(res.ok ? 'Guardado' : 'Error', res.ok ? 'success' : 'danger');
    $btn.prop('disabled', false).text('Guardar');
  });
});