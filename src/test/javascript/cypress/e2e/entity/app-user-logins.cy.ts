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

describe('AppUserLogins e2e test', () => {
  const appUserLoginsPageUrl = '/app-user-logins';
  const appUserLoginsPageUrlPattern = new RegExp('/app-user-logins(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const appUserLoginsSample = { userEmail: 'circuit', passwordSalt: 'Supervisor', passwordHash: 'Jewelery optimizing Metal' };

  let appUserLogins;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/app-user-logins+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/app-user-logins').as('postEntityRequest');
    cy.intercept('DELETE', '/api/app-user-logins/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (appUserLogins) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/app-user-logins/${appUserLogins.id}`,
      }).then(() => {
        appUserLogins = undefined;
      });
    }
  });

  it('AppUserLogins menu should load AppUserLogins page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('app-user-logins');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AppUserLogins').should('exist');
    cy.url().should('match', appUserLoginsPageUrlPattern);
  });

  describe('AppUserLogins page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(appUserLoginsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AppUserLogins page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/app-user-logins/new$'));
        cy.getEntityCreateUpdateHeading('AppUserLogins');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUserLoginsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/app-user-logins',
          body: appUserLoginsSample,
        }).then(({ body }) => {
          appUserLogins = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/app-user-logins+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [appUserLogins],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(appUserLoginsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AppUserLogins page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('appUserLogins');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUserLoginsPageUrlPattern);
      });

      it('edit button click should load edit AppUserLogins page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AppUserLogins');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUserLoginsPageUrlPattern);
      });

      it('edit button click should load edit AppUserLogins page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AppUserLogins');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUserLoginsPageUrlPattern);
      });

      it('last delete button click should delete instance of AppUserLogins', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('appUserLogins').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUserLoginsPageUrlPattern);

        appUserLogins = undefined;
      });
    });
  });

  describe('new AppUserLogins page', () => {
    beforeEach(() => {
      cy.visit(`${appUserLoginsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AppUserLogins');
    });

    it('should create an instance of AppUserLogins', () => {
      cy.get(`[data-cy="userEmail"]`).type('Drives platforms Security').should('have.value', 'Drives platforms Security');

      cy.get(`[data-cy="passwordSalt"]`).type('task-force').should('have.value', 'task-force');

      cy.get(`[data-cy="passwordHash"]`).type('Greenland Handcrafted').should('have.value', 'Greenland Handcrafted');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        appUserLogins = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', appUserLoginsPageUrlPattern);
    });
  });
});
