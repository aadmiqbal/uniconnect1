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

describe('Degrees e2e test', () => {
  const degreesPageUrl = '/degrees';
  const degreesPageUrlPattern = new RegExp('/degrees(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const degreesSample = { degreeName: 'Movies UIC-Franc' };

  let degrees;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/degrees+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/degrees').as('postEntityRequest');
    cy.intercept('DELETE', '/api/degrees/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (degrees) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/degrees/${degrees.id}`,
      }).then(() => {
        degrees = undefined;
      });
    }
  });

  it('Degrees menu should load Degrees page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('degrees');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Degrees').should('exist');
    cy.url().should('match', degreesPageUrlPattern);
  });

  describe('Degrees page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(degreesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Degrees page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/degrees/new$'));
        cy.getEntityCreateUpdateHeading('Degrees');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/degrees',
          body: degreesSample,
        }).then(({ body }) => {
          degrees = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/degrees+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [degrees],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(degreesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Degrees page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('degrees');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreesPageUrlPattern);
      });

      it('edit button click should load edit Degrees page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Degrees');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreesPageUrlPattern);
      });

      it('edit button click should load edit Degrees page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Degrees');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreesPageUrlPattern);
      });

      it('last delete button click should delete instance of Degrees', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('degrees').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreesPageUrlPattern);

        degrees = undefined;
      });
    });
  });

  describe('new Degrees page', () => {
    beforeEach(() => {
      cy.visit(`${degreesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Degrees');
    });

    it('should create an instance of Degrees', () => {
      cy.get(`[data-cy="degreeName"]`).type('Fresh Tools').should('have.value', 'Fresh Tools');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        degrees = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', degreesPageUrlPattern);
    });
  });
});
