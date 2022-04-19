describe("Check the initial testing states", () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.get("#page-content", { timeout: 5 * 60 * 1000 });
  });
  after(() => {});
  afterEach(() => {});

  it("using white theme", () => {
    cy.get("body").should("not.have.class", "dark");
  });

  it("have no containers", () => {
    cy.get("#page-content #current-run")
      .should("have.attr", "data-containers")
      .and("eq", "0");
  });

  it("have a instructor course and student course", () => {
    cy.get("#page-content #course-grid").within(() => {
      cy.contains("INSTRUCTOR");
      cy.contains("STUDENT");
    });
  });

  it("have no message", () => {});

  it("have no personal workspaces", () => {});

  it("have no environments in the course", () => {});

  it("have no templates in the course", () => {});
});

export {};
