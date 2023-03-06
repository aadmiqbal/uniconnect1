import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Subjects e2e test', () => {
  const subjectsPageUrl = '/subjects';
  const subjectsPageUrlPattern = new RegExp('/subjects(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const subjectsSample = { subjectName: 'programming green methodologies' };

  let subjects;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/subjects+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/subjects').as('postEntityRequest');
    cy.intercept('DELETE', '/api/subjects/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (subjects) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/subjects/${subjects.id}`,
      }).then(() => {
        subjects = undefined;
      });
    }
  });

  it('Subjects menu should load Subjects page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('subjects');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Subjects').should('exist');
    cy.url().should('match', subjectsPageUrlPattern);
  });

  describe('Subjects page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(subjectsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Subjects page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/subjects/new$'));
        cy.getEntityCreateUpdateHeading('Subjects');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', subjectsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/subjects',
          body: subjectsSample,
        }).then(({ body }) => {
          subjects = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/subjects+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [subjects],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(subjectsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Subjects page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('subjects');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', subjectsPageUrlPattern);
      });

      it('edit button click should load edit Subjects page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Subjects');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', subjectsPageUrlPattern);
      });

      it('edit button click should load edit Subjects page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Subjects');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', subjectsPageUrlPattern);
      });

      it('last delete button click should delete instance of Subjects', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('subjects').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', subjectsPageUrlPattern);

        subjects = undefined;
      });
    });
  });

  describe('new Subjects page', () => {
    beforeEach(() => {
      cy.visit(`${subjectsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Subjects');
    });

    it('should create an instance of Subjects', () => {
      cy.get(`[data-cy="subjectName"]`).type('Avon').should('have.value', 'Avon');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        subjects = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', subjectsPageUrlPattern);
    });
  });
});
