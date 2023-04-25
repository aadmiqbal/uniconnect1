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

describe('FinalUser e2e test', () => {
  const finalUserPageUrl = '/final-user';
  const finalUserPageUrlPattern = new RegExp('/final-user(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const finalUserSample = {};

  let finalUser;
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
      body: {"login":"Books Auto revolutionize","firstName":"Makenzie","lastName":"Pagac"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/final-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/final-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/final-users/*').as('deleteEntityRequest');
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
    if (finalUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/final-users/${finalUser.id}`,
      }).then(() => {
        finalUser = undefined;
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

  it('FinalUsers menu should load FinalUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('final-user');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FinalUser').should('exist');
    cy.url().should('match', finalUserPageUrlPattern);
  });

  describe('FinalUser page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(finalUserPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FinalUser page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/final-user/new$'));
        cy.getEntityCreateUpdateHeading('FinalUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalUserPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/final-users',
          body: {
            ...finalUserSample,
            user: user,
          },
        }).then(({ body }) => {
          finalUser = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/final-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/final-users?page=0&size=20>; rel="last",<http://localhost/api/final-users?page=0&size=20>; rel="first"',
              },
              body: [finalUser],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(finalUserPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(finalUserPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details FinalUser page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('finalUser');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalUserPageUrlPattern);
      });

      it('edit button click should load edit FinalUser page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinalUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalUserPageUrlPattern);
      });

      it.skip('edit button click should load edit FinalUser page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinalUser');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalUserPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of FinalUser', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('finalUser').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalUserPageUrlPattern);

        finalUser = undefined;
      });
    });
  });

  describe('new FinalUser page', () => {
    beforeEach(() => {
      cy.visit(`${finalUserPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FinalUser');
    });

    it.skip('should create an instance of FinalUser', () => {
      cy.get(`[data-cy="name"]`).type('Human payment').should('have.value', 'Human payment');

      cy.get(`[data-cy="studyYear"]`).type('62094').should('have.value', '62094');

      cy.get(`[data-cy="bio"]`).type('Sports Rubber systems').should('have.value', 'Sports Rubber systems');

      cy.get(`[data-cy="pfp"]`).type('Engineer next-generation').should('have.value', 'Engineer next-generation');

      cy.get(`[data-cy="modules"]`).type('Solutions').should('have.value', 'Solutions');

      cy.get(`[data-cy="firstName"]`).type('Halie').should('have.value', 'Halie');

      cy.get(`[data-cy="lastName"]`).type('Huel').should('have.value', 'Huel');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        finalUser = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', finalUserPageUrlPattern);
    });
  });
});
