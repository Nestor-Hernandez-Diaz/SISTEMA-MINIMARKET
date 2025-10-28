// Manejo de modales genérico
window.Modales = (function() {
  const open = (title, body, { confirmText = 'Confirmar', onConfirm = null } = {}) => {
    $('#modalTitle').text(title);
    $('#modalBody').html(body);
    $('#modalConfirm').text(confirmText);
    $('#modalBackdrop').addClass('show');
    $('#modalConfirm').off('click').on('click', function(){
      if (typeof onConfirm === 'function') onConfirm();
      close();
    });
    $('#modalCancel').off('click').on('click', close);
  };
  const close = () => $('#modalBackdrop').removeClass('show');
  return { open, close };
})();