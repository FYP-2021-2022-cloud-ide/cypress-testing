import { hostname } from "../../../support/commands";
describe("Error test", () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      "appSession",
      "sub",
      "email",
      "userId",
      "bio",
      "darkMode",
      "role",
      "semesterId",
      "name"
    );
  });

  it("visit the wrong url", () => {
    //visit https://codepsace.ust.dev/test_error
    cy.request({ url: "/test_error", failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
    cy.visit("/test_error", {
      failOnStatusCode: false,
    });
    cy.get("#page-content #status-code");
  });
});
export {};
