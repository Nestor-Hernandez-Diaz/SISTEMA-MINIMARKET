$(function() {
  // Validación y envio genérico
  $('form[data-auto]').on('submit', async function(e) {
    e.preventDefault();
    const $form = $(this);
    const $btn = $form.find('[type="submit"]');
    $btn.prop('disabled', true).text('Guardando...');
    const errors = Validation.validateForm($form);
    if (errors.length) {
      Notifications.show('Por favor corrige los campos marcados', 'warning');
      $btn.prop('disabled', false).text('Guardar');
      return;
    }
    const data = $form.serializeArray().reduce((acc, cur) => ({...acc, [cur.name]: cur.value}), {});
    const res = await API.post('/api/resource', data);
    if (res.ok) Notifications.show('Guardado correctamente', 'success');
    else Notifications.show('Error al guardar', 'danger');
    $btn.prop('disabled', false).text('Guardar');
  });

  // Mostrar/ocultar campos especiales
  $('[name="tipo"]').on('change', function() {
    const valor = $(this).val();
    $('.campos-especiales')[valor === 'especial' ? 'show' : 'hide']();
  });
});