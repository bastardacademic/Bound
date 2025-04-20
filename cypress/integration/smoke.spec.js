describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('/');
    cy.contains('Bound');
  });
});
