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

describe('UserExtra e2e test', () => {
  const userExtraPageUrl = '/user-extra';
  const userExtraPageUrlPattern = new RegExp('/user-extra(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const userExtraSample = {};

  let userExtra;
  // let user;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"Harbor bluetooth North","firstName":"Letha","lastName":"Satterfield"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-extras+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-extras').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-extras/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

  afterEach(() => {
    if (userExtra) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-extras/${userExtra.id}`,
      }).then(() => {
        userExtra = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
  });
   */

  it('UserExtras menu should load UserExtras page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-extra');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserExtra').should('exist');
    cy.url().should('match', userExtraPageUrlPattern);
  });

  describe('UserExtra page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userExtraPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserExtra page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-extra/new$'));
        cy.getEntityCreateUpdateHeading('UserExtra');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtraPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-extras',
          body: {
            ...userExtraSample,
            user: user,
          },
        }).then(({ body }) => {
          userExtra = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-extras+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-extras?page=0&size=20>; rel="last",<http://localhost/api/user-extras?page=0&size=20>; rel="first"',
              },
              body: [userExtra],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userExtraPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userExtraPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserExtra page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userExtra');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtraPageUrlPattern);
      });

      it('edit button click should load edit UserExtra page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserExtra');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtraPageUrlPattern);
      });

      it('edit button click should load edit UserExtra page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserExtra');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtraPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of UserExtra', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userExtra').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userExtraPageUrlPattern);

        userExtra = undefined;
      });
    });
  });

  describe('new UserExtra page', () => {
    beforeEach(() => {
      cy.visit(`${userExtraPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserExtra');
    });

    it.skip('should create an instance of UserExtra', () => {
      cy.get(`[data-cy="name"]`).type('Frozen').should('have.value', 'Frozen');

      cy.get(`[data-cy="studyYear"]`).type('2585').should('have.value', '2585');

      cy.get(`[data-cy="bio"]`).type('Account Toys').should('have.value', 'Account Toys');

      cy.get(`[data-cy="pfp"]`).type('Marketing Omani').should('have.value', 'Marketing Omani');

      cy.get(`[data-cy="modules"]`).type('6th').should('have.value', '6th');

      cy.get(`[data-cy="firstName"]`).type('Cindy').should('have.value', 'Cindy');

      cy.get(`[data-cy="lastName"]`).type('Gutkowski').should('have.value', 'Gutkowski');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userExtra = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userExtraPageUrlPattern);
    });
  });
});
