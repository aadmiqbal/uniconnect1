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

describe('MentorLink e2e test', () => {
  const mentorLinkPageUrl = '/mentor-link';
  const mentorLinkPageUrlPattern = new RegExp('/mentor-link(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const mentorLinkSample = {};

  let mentorLink;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/mentor-links+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/mentor-links').as('postEntityRequest');
    cy.intercept('DELETE', '/api/mentor-links/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mentorLink) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/mentor-links/${mentorLink.id}`,
      }).then(() => {
        mentorLink = undefined;
      });
    }
  });

  it('MentorLinks menu should load MentorLinks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('mentor-link');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MentorLink').should('exist');
    cy.url().should('match', mentorLinkPageUrlPattern);
  });

  describe('MentorLink page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(mentorLinkPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MentorLink page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/mentor-link/new$'));
        cy.getEntityCreateUpdateHeading('MentorLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorLinkPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/mentor-links',
          body: mentorLinkSample,
        }).then(({ body }) => {
          mentorLink = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/mentor-links+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mentorLink],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(mentorLinkPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MentorLink page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mentorLink');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorLinkPageUrlPattern);
      });

      it('edit button click should load edit MentorLink page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MentorLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorLinkPageUrlPattern);
      });

      it('edit button click should load edit MentorLink page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MentorLink');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorLinkPageUrlPattern);
      });

      it('last delete button click should delete instance of MentorLink', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mentorLink').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mentorLinkPageUrlPattern);

        mentorLink = undefined;
      });
    });
  });

  describe('new MentorLink page', () => {
    beforeEach(() => {
      cy.visit(`${mentorLinkPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MentorLink');
    });

    it('should create an instance of MentorLink', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        mentorLink = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', mentorLinkPageUrlPattern);
    });
  });
});
