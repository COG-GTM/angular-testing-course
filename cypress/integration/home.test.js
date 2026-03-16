


describe('Home Page', () => {

    beforeEach(() => {

        cy.fixture('courses.json').as("coursesJSON");

        cy.server();

        cy.route('/api/courses', "@coursesJSON").as("courses");

        cy.visit('/');

    });

    it('should display a list of courses', () => {

        cy.contains("All Courses");

        cy.wait('@courses');

        cy.get("[data-testid='course-card']").should("have.length", 9);

    });

    it('should display the advanced courses', () => {

        cy.get('.MuiTab-root').should("have.length", 2);

        cy.get('.MuiTab-root').last().click();

        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').its('length').should('be.gt', 1);

        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').first()
            .should('contain', "Angular Security Course");

    });


});
