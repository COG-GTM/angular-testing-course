describe('Home Page', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesJSON');

    cy.intercept('GET', '/api/courses', { fixture: 'courses.json' }).as('courses');

    cy.visit('/');
  });

  it('should display a list of courses', () => {
    cy.contains('All Courses');

    cy.wait('@courses');

    cy.get('.course-card').should('have.length', 9);
  });

  it('should display the advanced courses', () => {
    cy.wait('@courses');

    cy.get('[role="tab"]').should('have.length', 2);

    cy.get('[role="tab"]').last().click();

    cy.get('.tab-body-active .card-title').its('length').should('be.gt', 1);

    cy.get('.tab-body-active .card-title').first().should('contain', 'Angular Security Course');
  });
});
