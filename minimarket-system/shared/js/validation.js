// Validaciones simples
window.Validation = (function() {
  const isRequired = (value) => String(value || '').trim().length > 0;
  const isEmail = (value) => /.+@.+\..+/.test(String(value || ''));
  const minLength = (value, min) => String(value || '').trim().length >= min;
  const isNumber = (value) => /^-?\d+(\.\d+)?$/.test(String(value || ''));

  const validateForm = ($form) => {
    const errors = [];
    $form.find('[data-validate]')?.each(function() {
      const rules = $(this).data('validate').split('|');
      const val = $(this).val();
      rules.forEach(r => {
        if (r === 'required' && !isRequired(val)) errors.push({ field: this.name, rule: 'required' });
        if (r === 'email' && !isEmail(val)) errors.push({ field: this.name, rule: 'email' });
        if (r.startsWith('min:')) {
          const m = Number(r.split(':')[1]);
          if (!minLength(val, m)) errors.push({ field: this.name, rule: 'min' });
        }
        if (r === 'number' && !isNumber(val)) errors.push({ field: this.name, rule: 'number' });
      });
    });
    return errors;
  };

  return { isRequired, isEmail, minLength, isNumber, validateForm };
})();