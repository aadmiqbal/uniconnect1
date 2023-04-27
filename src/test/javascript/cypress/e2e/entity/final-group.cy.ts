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

describe('FinalGroup e2e test', () => {
  const finalGroupPageUrl = '/final-group';
  const finalGroupPageUrlPattern = new RegExp('/final-group(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const finalGroupSample = {};

  let finalGroup;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/final-groups+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/final-groups').as('postEntityRequest');
    cy.intercept('DELETE', '/api/final-groups/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (finalGroup) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/final-groups/${finalGroup.id}`,
      }).then(() => {
        finalGroup = undefined;
      });
    }
  });

  it('FinalGroups menu should load FinalGroups page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('final-group');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FinalGroup').should('exist');
    cy.url().should('match', finalGroupPageUrlPattern);
  });

  describe('FinalGroup page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(finalGroupPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FinalGroup page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/final-group/new$'));
        cy.getEntityCreateUpdateHeading('FinalGroup');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalGroupPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/final-groups',
          body: finalGroupSample,
        }).then(({ body }) => {
          finalGroup = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/final-groups+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/final-groups?page=0&size=20>; rel="last",<http://localhost/api/final-groups?page=0&size=20>; rel="first"',
              },
              body: [finalGroup],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(finalGroupPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details FinalGroup page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('finalGroup');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalGroupPageUrlPattern);
      });

      it('edit button click should load edit FinalGroup page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinalGroup');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalGroupPageUrlPattern);
      });

      it.skip('edit button click should load edit FinalGroup page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinalGroup');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalGroupPageUrlPattern);
      });

      it('last delete button click should delete instance of FinalGroup', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('finalGroup').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', finalGroupPageUrlPattern);

        finalGroup = undefined;
      });
    });
  });

  describe('new FinalGroup page', () => {
    beforeEach(() => {
      cy.visit(`${finalGroupPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FinalGroup');
    });

    it('should create an instance of FinalGroup', () => {
      cy.get(`[data-cy="name"]`).type('Concrete Idaho Technician').should('have.value', 'Concrete Idaho Technician');

      cy.get(`[data-cy="members"]`).type('Car').should('have.value', 'Car');

      cy.get(`[data-cy="isAdvertised"]`).should('not.be.checked');
      cy.get(`[data-cy="isAdvertised"]`).click().should('be.checked');

      cy.get(`[data-cy="groupDescription"]`).type('Small').should('have.value', 'Small');

      cy.get(`[data-cy="pfp"]`).type('GB Automated visionary').should('have.value', 'GB Automated visionary');

      cy.get(`[data-cy="admins"]`).type('withdrawal').should('have.value', 'withdrawal');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        finalGroup = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', finalGroupPageUrlPattern);
    });
  });
});
