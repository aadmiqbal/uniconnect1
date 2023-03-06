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

describe('DegreeSubjects e2e test', () => {
  const degreeSubjectsPageUrl = '/degree-subjects';
  const degreeSubjectsPageUrlPattern = new RegExp('/degree-subjects(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const degreeSubjectsSample = {};

  let degreeSubjects;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/degree-subjects+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/degree-subjects').as('postEntityRequest');
    cy.intercept('DELETE', '/api/degree-subjects/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (degreeSubjects) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/degree-subjects/${degreeSubjects.id}`,
      }).then(() => {
        degreeSubjects = undefined;
      });
    }
  });

  it('DegreeSubjects menu should load DegreeSubjects page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('degree-subjects');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('DegreeSubjects').should('exist');
    cy.url().should('match', degreeSubjectsPageUrlPattern);
  });

  describe('DegreeSubjects page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(degreeSubjectsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create DegreeSubjects page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/degree-subjects/new$'));
        cy.getEntityCreateUpdateHeading('DegreeSubjects');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreeSubjectsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/degree-subjects',
          body: degreeSubjectsSample,
        }).then(({ body }) => {
          degreeSubjects = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/degree-subjects+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [degreeSubjects],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(degreeSubjectsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details DegreeSubjects page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('degreeSubjects');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreeSubjectsPageUrlPattern);
      });

      it('edit button click should load edit DegreeSubjects page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DegreeSubjects');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreeSubjectsPageUrlPattern);
      });

      it('edit button click should load edit DegreeSubjects page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DegreeSubjects');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreeSubjectsPageUrlPattern);
      });

      it('last delete button click should delete instance of DegreeSubjects', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('degreeSubjects').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', degreeSubjectsPageUrlPattern);

        degreeSubjects = undefined;
      });
    });
  });

  describe('new DegreeSubjects page', () => {
    beforeEach(() => {
      cy.visit(`${degreeSubjectsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('DegreeSubjects');
    });

    it('should create an instance of DegreeSubjects', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        degreeSubjects = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', degreeSubjectsPageUrlPattern);
    });
  });
});
