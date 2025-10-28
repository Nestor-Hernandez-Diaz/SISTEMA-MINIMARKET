describe('Utils', () => {
  it('formatCurrency debería formatear valores en PEN', () => {
    const s = Utils.formatCurrency(10);
    expect(s).toContain('S/');
  });

  it('paginate debería paginar correctamente', () => {
    const items = Array.from({length: 25}, (_,i)=>i+1);
    const p = Utils.paginate(items, 2, 10);
    expect(p.page).toBe(2);
    expect(p.pages).toBe(3);
    expect(p.data.length).toBe(10);
    expect(p.data[0]).toBe(11);
  });
});