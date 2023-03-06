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

describe('Connections e2e test', () => {
  const connectionsPageUrl = '/connections';
  const connectionsPageUrlPattern = new RegExp('/connections(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const connectionsSample = {};

  let connections;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/connections+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/connections').as('postEntityRequest');
    cy.intercept('DELETE', '/api/connections/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (connections) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/connections/${connections.id}`,
      }).then(() => {
        connections = undefined;
      });
    }
  });

  it('Connections menu should load Connections page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('connections');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Connections').should('exist');
    cy.url().should('match', connectionsPageUrlPattern);
  });

  describe('Connections page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(connectionsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Connections page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/connections/new$'));
        cy.getEntityCreateUpdateHeading('Connections');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', connectionsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/connections',
          body: connectionsSample,
        }).then(({ body }) => {
          connections = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/connections+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/connections?page=0&size=20>; rel="last",<http://localhost/api/connections?page=0&size=20>; rel="first"',
              },
              body: [connections],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(connectionsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Connections page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('connections');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', connectionsPageUrlPattern);
      });

      it('edit button click should load edit Connections page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Connections');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', connectionsPageUrlPattern);
      });

      it('edit button click should load edit Connections page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Connections');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', connectionsPageUrlPattern);
      });

      it('last delete button click should delete instance of Connections', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('connections').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', connectionsPageUrlPattern);

        connections = undefined;
      });
    });
  });

  describe('new Connections page', () => {
    beforeEach(() => {
      cy.visit(`${connectionsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Connections');
    });

    it('should create an instance of Connections', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        connections = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', connectionsPageUrlPattern);
    });
  });
});
