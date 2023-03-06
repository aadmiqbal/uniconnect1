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

describe('Mentees e2e test', () => {
  const menteesPageUrl = '/mentees';
  const menteesPageUrlPattern = new RegExp('/mentees(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const menteesSample = {};

  let mentees;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/mentees+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/mentees').as('postEntityRequest');
    cy.intercept('DELETE', '/api/mentees/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mentees) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/mentees/${mentees.id}`,
      }).then(() => {
        mentees = undefined;
      });
    }
  });

  it('Mentees menu should load Mentees page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('mentees');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Mentees').should('exist');
    cy.url().should('match', menteesPageUrlPattern);
  });

  describe('Mentees page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(menteesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Mentees page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/mentees/new$'));
        cy.getEntityCreateUpdateHeading('Mentees');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menteesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/mentees',
          body: menteesSample,
        }).then(({ body }) => {
          mentees = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/mentees+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mentees],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(menteesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Mentees page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mentees');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menteesPageUrlPattern);
      });

      it('edit button click should load edit Mentees page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mentees');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menteesPageUrlPattern);
      });

      it('edit button click should load edit Mentees page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mentees');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menteesPageUrlPattern);
      });

      it('last delete button click should delete instance of Mentees', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mentees').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menteesPageUrlPattern);

        mentees = undefined;
      });
    });
  });

  describe('new Mentees page', () => {
    beforeEach(() => {
      cy.visit(`${menteesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Mentees');
    });

    it('should create an instance of Mentees', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        mentees = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', menteesPageUrlPattern);
    });
  });
});
