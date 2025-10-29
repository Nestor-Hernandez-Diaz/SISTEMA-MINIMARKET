// Manejador común para formularios de creación/edición en módulos de sucursal
// Uso estándar:
//  <form data-auto data-endpoint="/api/productos" data-success-redirect="productos.html">
//    <input name="nombre" data-validate="required|min:3" />
//    ...
//  </form>
// - Ejecuta Validation.validateForm
// - Maneja estado del botón submit (deshabilitar/cargar/restaurar)
// - Envía datos al endpoint con API.post
// - Muestra notificaciones de éxito/error
// - Redirige en éxito si se define data-success-redirect

window.Forms = (function() {
  const getSubmitButton = ($form) => $form.find('[type="submit"]');

  const setLoading = ($btn, loadingText = 'Guardando...') => {
    if (!$btn.length) return;
    const originalText = $btn.data('originalText') || $btn.text();
    $btn.data('originalText', originalText);
    $btn.prop('disabled', true).text(loadingText);
  };

  const clearLoading = ($btn) => {
    if (!$btn.length) return;
    const originalText = $btn.data('originalText') || 'Guardar';
    $btn.prop('disabled', false).text(originalText);
  };

  const serialize = ($form) => {
    const obj = {};
    $form.serializeArray().forEach(({ name, value }) => {
      if (obj[name] !== undefined) {
        if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
        obj[name].push(value);
      } else {
        obj[name] = value;
      }
    });
    return obj;
  };

  const validateAndNotify = ($form) => {
    const errors = Validation.validateForm($form);
    if (errors.length) {
      const first = errors[0];
      Notifications.show('Corrige los campos requeridos', 'warning');
      const $field = $form.find(`[name="${first.field}"]`);
      if ($field.length) $field.focus();
    }
    return errors;
  };

  const bindAuto = () => {
    $(function() {
      $(document).on('submit', 'form[data-auto]', async function(e) {
        e.preventDefault();
        const $form = $(this);
        const endpoint = $form.data('endpoint');
        const successRedirect = $form.data('successRedirect');
        const $btn = getSubmitButton($form);

        setLoading($btn);

        const errors = validateAndNotify($form);
        if (errors.length) {
          clearLoading($btn);
          return;
        }

        try {
          const data = serialize($form);
          const res = await API.post(endpoint || '/api/resource', data);
          if (res.ok) {
            Notifications.show('Guardado correctamente', 'success');
            if (successRedirect) {
              setTimeout(() => { window.location.href = successRedirect; }, 800);
            }
          } else {
            Notifications.show(res.message || 'Error al guardar', 'danger');
          }
        } catch (err) {
          console.error(err);
          Notifications.show('Error de red o del servidor', 'danger');
        } finally {
          clearLoading($btn);
        }
      });
    });
  };

  return {
    bindAuto,
    serialize,
    validateAndNotify,
    setLoading,
    clearLoading
  };
})();

// Inicializar comportamiento por defecto
Forms.bindAuto();