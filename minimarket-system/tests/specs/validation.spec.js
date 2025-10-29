describe('Validation', () => {
  it('isEmail debería validar correos', () => {
    expect(Validation.isEmail('a@b.com')).toBeTrue();
    expect(Validation.isEmail('noemail')).toBeFalse();
  });

  it('isRequired debería validar strings no vacíos', () => {
    expect(Validation.isRequired('x')).toBeTrue();
    expect(Validation.isRequired('')).toBeFalse();
  });
});