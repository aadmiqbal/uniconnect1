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

describe('Mentors e2e test', () => {
  const mentorsPageUrl = '/mentors';
  const mentorsPageUrlPattern = new RegExp('/mentors(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const mentorsSample = {};

  let mentors;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/mentors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/mentors').as('postEntityRequest');
    cy.intercept('DELETE', '/api/mentors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mentors) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/mentors/${mentors.id}`,
      }).then(() => {
        mentors = undefined;
      });
    }
  });

  it('Mentors menu should load Mentors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('mentors');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Mentors').should('exist');
    cy.url().should('match', mentorsPageUrlPattern);
  });

  describe('Mentors page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(mentorsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Mentors page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/mentors/new$'));
        cy.getEntityCreateUpdateHeading('Mentors');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/mentors',
          body: mentorsSample,
        }).then(({ body }) => {
          mentors = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/mentors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mentors],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(mentorsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Mentors page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mentors');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorsPageUrlPattern);
      });

      it('edit button click should load edit Mentors page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mentors');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorsPageUrlPattern);
      });

      it('edit button click should load edit Mentors page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mentors');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorsPageUrlPattern);
      });

      it('last delete button click should delete instance of Mentors', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mentors').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorsPageUrlPattern);

        mentors = undefined;
      });
    });
  });

  describe('new Mentors page', () => {
    beforeEach(() => {
      cy.visit(`${mentorsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Mentors');
    });

    it('should create an instance of Mentors', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        mentors = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', mentorsPageUrlPattern);
    });
  });
});
