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

describe('UserGroups e2e test', () => {
  const userGroupsPageUrl = '/user-groups';
  const userGroupsPageUrlPattern = new RegExp('/user-groups(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userGroupsSample = { groupName: 'Borders payment Granite' };

  let userGroups;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-groups+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-groups').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-groups/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userGroups) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-groups/${userGroups.id}`,
      }).then(() => {
        userGroups = undefined;
      });
    }
  });

  it('UserGroups menu should load UserGroups page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-groups');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserGroups').should('exist');
    cy.url().should('match', userGroupsPageUrlPattern);
  });

  describe('UserGroups page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userGroupsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserGroups page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-groups/new$'));
        cy.getEntityCreateUpdateHeading('UserGroups');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-groups',
          body: userGroupsSample,
        }).then(({ body }) => {
          userGroups = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-groups+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-groups?page=0&size=20>; rel="last",<http://localhost/api/user-groups?page=0&size=20>; rel="first"',
              },
              body: [userGroups],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userGroupsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserGroups page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userGroups');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupsPageUrlPattern);
      });

      it('edit button click should load edit UserGroups page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroups');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupsPageUrlPattern);
      });

      it('edit button click should load edit UserGroups page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroups');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupsPageUrlPattern);
      });

      it('last delete button click should delete instance of UserGroups', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userGroups').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupsPageUrlPattern);

        userGroups = undefined;
      });
    });
  });

  describe('new UserGroups page', () => {
    beforeEach(() => {
      cy.visit(`${userGroupsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserGroups');
    });

    it('should create an instance of UserGroups', () => {
      cy.get(`[data-cy="groupName"]`).type('Handcrafted Soft Chips').should('have.value', 'Handcrafted Soft Chips');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userGroups = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userGroupsPageUrlPattern);
    });
  });
});
