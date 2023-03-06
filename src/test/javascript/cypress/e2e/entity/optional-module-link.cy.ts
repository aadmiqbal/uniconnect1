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

describe('OptionalModuleLink e2e test', () => {
  const optionalModuleLinkPageUrl = '/optional-module-link';
  const optionalModuleLinkPageUrlPattern = new RegExp('/optional-module-link(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const optionalModuleLinkSample = {};

  let optionalModuleLink;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/optional-module-links+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/optional-module-links').as('postEntityRequest');
    cy.intercept('DELETE', '/api/optional-module-links/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (optionalModuleLink) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/optional-module-links/${optionalModuleLink.id}`,
      }).then(() => {
        optionalModuleLink = undefined;
      });
    }
  });

  it('OptionalModuleLinks menu should load OptionalModuleLinks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('optional-module-link');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OptionalModuleLink').should('exist');
    cy.url().should('match', optionalModuleLinkPageUrlPattern);
  });

  describe('OptionalModuleLink page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(optionalModuleLinkPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OptionalModuleLink page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/optional-module-link/new$'));
        cy.getEntityCreateUpdateHeading('OptionalModuleLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', optionalModuleLinkPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/optional-module-links',
          body: optionalModuleLinkSample,
        }).then(({ body }) => {
          optionalModuleLink = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/optional-module-links+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [optionalModuleLink],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(optionalModuleLinkPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OptionalModuleLink page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('optionalModuleLink');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', optionalModuleLinkPageUrlPattern);
      });

      it('edit button click should load edit OptionalModuleLink page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OptionalModuleLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', optionalModuleLinkPageUrlPattern);
      });

      it('edit button click should load edit OptionalModuleLink page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OptionalModuleLink');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', optionalModuleLinkPageUrlPattern);
      });

      it('last delete button click should delete instance of OptionalModuleLink', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('optionalModuleLink').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', optionalModuleLinkPageUrlPattern);

        optionalModuleLink = undefined;
      });
    });
  });

  describe('new OptionalModuleLink page', () => {
    beforeEach(() => {
      cy.visit(`${optionalModuleLinkPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OptionalModuleLink');
    });

    it('should create an instance of OptionalModuleLink', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        optionalModuleLink = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', optionalModuleLinkPageUrlPattern);
    });
  });
});
