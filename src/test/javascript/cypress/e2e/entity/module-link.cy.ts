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

describe('ModuleLink e2e test', () => {
  const moduleLinkPageUrl = '/module-link';
  const moduleLinkPageUrlPattern = new RegExp('/module-link(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const moduleLinkSample = {};

  let moduleLink;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/module-links+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/module-links').as('postEntityRequest');
    cy.intercept('DELETE', '/api/module-links/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (moduleLink) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/module-links/${moduleLink.id}`,
      }).then(() => {
        moduleLink = undefined;
      });
    }
  });

  it('ModuleLinks menu should load ModuleLinks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('module-link');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ModuleLink').should('exist');
    cy.url().should('match', moduleLinkPageUrlPattern);
  });

  describe('ModuleLink page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(moduleLinkPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ModuleLink page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/module-link/new$'));
        cy.getEntityCreateUpdateHeading('ModuleLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', moduleLinkPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/module-links',
          body: moduleLinkSample,
        }).then(({ body }) => {
          moduleLink = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/module-links+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [moduleLink],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(moduleLinkPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ModuleLink page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('moduleLink');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', moduleLinkPageUrlPattern);
      });

      it('edit button click should load edit ModuleLink page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ModuleLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', moduleLinkPageUrlPattern);
      });

      it('edit button click should load edit ModuleLink page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ModuleLink');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', moduleLinkPageUrlPattern);
      });

      it('last delete button click should delete instance of ModuleLink', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('moduleLink').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', moduleLinkPageUrlPattern);

        moduleLink = undefined;
      });
    });
  });

  describe('new ModuleLink page', () => {
    beforeEach(() => {
      cy.visit(`${moduleLinkPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ModuleLink');
    });

    it('should create an instance of ModuleLink', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        moduleLink = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', moduleLinkPageUrlPattern);
    });
  });
});
