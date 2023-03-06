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

describe('UserGroupAd e2e test', () => {
  const userGroupAdPageUrl = '/user-group-ad';
  const userGroupAdPageUrlPattern = new RegExp('/user-group-ad(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userGroupAdSample = {};

  let userGroupAd;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-group-ads+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-group-ads').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-group-ads/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userGroupAd) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-group-ads/${userGroupAd.id}`,
      }).then(() => {
        userGroupAd = undefined;
      });
    }
  });

  it('UserGroupAds menu should load UserGroupAds page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-group-ad');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserGroupAd').should('exist');
    cy.url().should('match', userGroupAdPageUrlPattern);
  });

  describe('UserGroupAd page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userGroupAdPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserGroupAd page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-group-ad/new$'));
        cy.getEntityCreateUpdateHeading('UserGroupAd');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAdPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-group-ads',
          body: userGroupAdSample,
        }).then(({ body }) => {
          userGroupAd = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-group-ads+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userGroupAd],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userGroupAdPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserGroupAd page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userGroupAd');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAdPageUrlPattern);
      });

      it('edit button click should load edit UserGroupAd page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupAd');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAdPageUrlPattern);
      });

      it('edit button click should load edit UserGroupAd page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupAd');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAdPageUrlPattern);
      });

      it('last delete button click should delete instance of UserGroupAd', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userGroupAd').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAdPageUrlPattern);

        userGroupAd = undefined;
      });
    });
  });

  describe('new UserGroupAd page', () => {
    beforeEach(() => {
      cy.visit(`${userGroupAdPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserGroupAd');
    });

    it('should create an instance of UserGroupAd', () => {
      cy.get(`[data-cy="groupBio"]`).type('installation').should('have.value', 'installation');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userGroupAd = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userGroupAdPageUrlPattern);
    });
  });
});
