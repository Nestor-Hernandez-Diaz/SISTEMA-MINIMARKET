describe('POS', () => {
  it('addItem debería agregar y acumular cantidades', () => {
    const p = { id: 1, nombre: 'Leche', precio: 4.5 };
    POS.addItem(p, 1);
    POS.addItem(p, 2);
    expect(POS.subtotal()).toBeCloseTo(13.5, 5);
  });

  it('total debería incluir IGV 18%', () => {
    const total = POS.total();
    const sub = POS.subtotal();
    expect(total).toBeCloseTo(sub * 1.18, 5);
  });
});