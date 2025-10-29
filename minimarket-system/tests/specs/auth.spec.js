describe('Auth', () => {
  it('login debería guardar sesión en localStorage', async () => {
    const res = await Auth.login({ usuario: 'tester', password: '1234', rol: 'sucursal' });
    expect(res.ok).toBeTrue();
    const s = Auth.getSession();
    expect(s.usuario).toBe('tester');
    expect(s.rol).toBe('sucursal');
  });

  it('requireRole debería validar roles permitidos', () => {
    expect(Auth.requireRole(['sucursal'])).toBeTrue();
    expect(Auth.requireRole(['superadmin'])).toBeFalse();
  });
});