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

describe('UserModules e2e test', () => {
  const userModulesPageUrl = '/user-modules';
  const userModulesPageUrlPattern = new RegExp('/user-modules(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userModulesSample = { moduleName: 'Franc seize Liaison', optional: true, studyYear: 1 };

  let userModules;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-modules+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-modules').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-modules/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userModules) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-modules/${userModules.id}`,
      }).then(() => {
        userModules = undefined;
      });
    }
  });

  it('UserModules menu should load UserModules page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-modules');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserModules').should('exist');
    cy.url().should('match', userModulesPageUrlPattern);
  });

  describe('UserModules page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userModulesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserModules page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-modules/new$'));
        cy.getEntityCreateUpdateHeading('UserModules');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userModulesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-modules',
          body: userModulesSample,
        }).then(({ body }) => {
          userModules = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-modules+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userModules],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userModulesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserModules page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userModules');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userModulesPageUrlPattern);
      });

      it('edit button click should load edit UserModules page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserModules');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userModulesPageUrlPattern);
      });

      it('edit button click should load edit UserModules page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserModules');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userModulesPageUrlPattern);
      });

      it('last delete button click should delete instance of UserModules', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userModules').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userModulesPageUrlPattern);

        userModules = undefined;
      });
    });
  });

  describe('new UserModules page', () => {
    beforeEach(() => {
      cy.visit(`${userModulesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserModules');
    });

    it('should create an instance of UserModules', () => {
      cy.get(`[data-cy="moduleName"]`).type('Creative stable Technician').should('have.value', 'Creative stable Technician');

      cy.get(`[data-cy="optional"]`).should('not.be.checked');
      cy.get(`[data-cy="optional"]`).click().should('be.checked');

      cy.get(`[data-cy="studyYear"]`).type('2').should('have.value', '2');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userModules = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userModulesPageUrlPattern);
    });
  });
});
