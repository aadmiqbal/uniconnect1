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

describe('UserGroupUsers e2e test', () => {
  const userGroupUsersPageUrl = '/user-group-users';
  const userGroupUsersPageUrlPattern = new RegExp('/user-group-users(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userGroupUsersSample = {};

  let userGroupUsers;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-group-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-group-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-group-users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userGroupUsers) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-group-users/${userGroupUsers.id}`,
      }).then(() => {
        userGroupUsers = undefined;
      });
    }
  });

  it('UserGroupUsers menu should load UserGroupUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-group-users');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserGroupUsers').should('exist');
    cy.url().should('match', userGroupUsersPageUrlPattern);
  });

  describe('UserGroupUsers page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userGroupUsersPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserGroupUsers page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-group-users/new$'));
        cy.getEntityCreateUpdateHeading('UserGroupUsers');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupUsersPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-group-users',
          body: userGroupUsersSample,
        }).then(({ body }) => {
          userGroupUsers = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-group-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-group-users?page=0&size=20>; rel="last",<http://localhost/api/user-group-users?page=0&size=20>; rel="first"',
              },
              body: [userGroupUsers],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userGroupUsersPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserGroupUsers page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userGroupUsers');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupUsersPageUrlPattern);
      });

      it('edit button click should load edit UserGroupUsers page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupUsers');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupUsersPageUrlPattern);
      });

      it('edit button click should load edit UserGroupUsers page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupUsers');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupUsersPageUrlPattern);
      });

      it('last delete button click should delete instance of UserGroupUsers', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userGroupUsers').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupUsersPageUrlPattern);

        userGroupUsers = undefined;
      });
    });
  });

  describe('new UserGroupUsers page', () => {
    beforeEach(() => {
      cy.visit(`${userGroupUsersPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserGroupUsers');
    });

    it('should create an instance of UserGroupUsers', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userGroupUsers = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userGroupUsersPageUrlPattern);
    });
  });
});
