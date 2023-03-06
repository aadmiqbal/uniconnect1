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

describe('AppUsers e2e test', () => {
  const appUsersPageUrl = '/app-users';
  const appUsersPageUrlPattern = new RegExp('/app-users(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const appUsersSample = { name: 'magenta capability Innovative', studyYear: 5 };

  let appUsers;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/app-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/app-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/app-users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (appUsers) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/app-users/${appUsers.id}`,
      }).then(() => {
        appUsers = undefined;
      });
    }
  });

  it('AppUsers menu should load AppUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('app-users');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AppUsers').should('exist');
    cy.url().should('match', appUsersPageUrlPattern);
  });

  describe('AppUsers page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(appUsersPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AppUsers page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/app-users/new$'));
        cy.getEntityCreateUpdateHeading('AppUsers');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUsersPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/app-users',
          body: appUsersSample,
        }).then(({ body }) => {
          appUsers = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/app-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/app-users?page=0&size=20>; rel="last",<http://localhost/api/app-users?page=0&size=20>; rel="first"',
              },
              body: [appUsers],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(appUsersPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AppUsers page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('appUsers');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUsersPageUrlPattern);
      });

      it('edit button click should load edit AppUsers page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AppUsers');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUsersPageUrlPattern);
      });

      it('edit button click should load edit AppUsers page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AppUsers');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUsersPageUrlPattern);
      });

      it('last delete button click should delete instance of AppUsers', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('appUsers').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', appUsersPageUrlPattern);

        appUsers = undefined;
      });
    });
  });

  describe('new AppUsers page', () => {
    beforeEach(() => {
      cy.visit(`${appUsersPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AppUsers');
    });

    it('should create an instance of AppUsers', () => {
      cy.get(`[data-cy="name"]`).type('transparent').should('have.value', 'transparent');

      cy.get(`[data-cy="studyYear"]`).type('4').should('have.value', '4');

      cy.get(`[data-cy="bio"]`).type('Designer').should('have.value', 'Designer');

      cy.get(`[data-cy="pfp"]`).type('connecting Handcrafted').should('have.value', 'connecting Handcrafted');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        appUsers = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', appUsersPageUrlPattern);
    });
  });
});
