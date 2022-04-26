import { recurse } from "cypress-recurse";

describe("personal workspace test", () => {
  before(() => {
    cy.login();
    cy.visitPersonalWorkspace();
    cy.removeAllPersonalWorkspaces();
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.get("#page-content", { timeout: 5 * 60 * 1000 });
    // initial state check
    cy.get("#sandbox-grid");
  });
  afterEach(() => {
    cy.removeAllPersonalWorkspaces();
  });
  after(() => {});

  it("create a personal workspace", () => {
    cy.createPersonalWorkspace();
    cy.get(".sandbox-grid #sandbox-card-0")
      .find("#name")
      .then((el) => {
        const name = el[0].innerText;
        cy.removePersonalWorkspace(name);
      });
    cy.get(".sandbox-grid #sandbox-card-0").should("not.exist");
  });

  it("cannot have same personal workspace name", () => {
    cy.createPersonalWorkspace({
      environment: "java",
      name: "workspace1",
      description: "this is a test description ",
    });
    cy.get("#sandbox-create-btn").click();
    cy.get(".modal-form").within(() => {
      cy.get('[data-entry-type="input"]  input').clear().type("workspace1");
      cy.contains("name crash");
      cy.get("#btn-ok").should("be.disabled");
      cy.get("#btn-cancel").click();
    });
  });

  it("update a personal workspace", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.updatePersonalWorkspace("test", {
      name: "new name",
      description: "new description",
    });
  });

  it("start and stop a personal workspace in personal workspace section", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.startPersonalWorkspace("test");
    cy.stopPersonalWorkspace("test");
  });

  it("stop a personal workspace in the container list", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.startPersonalWorkspace("test");
    cy.stopContainer("test");
  });

  it("starting more personal workspace than quota in a roll", () => {
    cy.createPersonalWorkspace({ name: "test1" });
    cy.createPersonalWorkspace({ name: "test2" });
    cy.createPersonalWorkspace({ name: "test3" });
    cy.createPersonalWorkspace({ name: "test4" });
    cy.getPersonalWorkspaceCard("test1").within(() => {
      cy.interceptMenuBtn("start workspace");
    });
    cy.getPersonalWorkspaceCard("test2").within(() => {
      cy.interceptMenuBtn("start workspace");
    });
    cy.getPersonalWorkspaceCard("test3").within(() => {
      cy.interceptMenuBtn("start workspace");
    });
    cy.startPersonalWorkspace("test4", false);
    recurse(
      () => {
        return cy.getPersonalWorkspaceCard("test1");
      },
      (el) => expect(el).attr("data-container-status", "DEFAULT"),
      { limit: 999, log: true, timeout: 60 * 1000, delay: 5000 }
    );
    recurse(
      () => {
        return cy.getPersonalWorkspaceCard("test2");
      },
      (el) => expect(el).attr("data-container-status", "DEFAULT"),
      { limit: 999, log: true, timeout: 60 * 1000, delay: 5000 }
    );
    recurse(
      () => {
        return cy.getPersonalWorkspaceCard("test3");
      },
      (el) => expect(el).attr("data-container-status", "DEFAULT"),
      { limit: 999, log: true, timeout: 60 * 1000, delay: 5000 }
    );
    cy.stopPersonalWorkspace("test1");
    cy.stopPersonalWorkspace("test2");
    cy.stopPersonalWorkspace("test3");
  });

  it("update internal personal workspace, confirm", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.updatePersonalWorkspaceInternal("test");
    cy.intercept("/api/sandbox/updateSandboxImage").as("updateSandboxImage");
    cy.get(".toaster-temp-container").find("#btn-ok").click();
    cy.wait("@updateSandboxImage", { responseTimeout: 60 * 1000 }).then(
      (interception) => {
        const response = interception.response.body;
        expect(response.success).equal(true);
        cy.wait(1000).then(() => {
          cy.get(".toaster-success").click({ multiple: true });
          cy.getPersonalWorkspaceCard("test").should(
            "not.have.attr",
            "data-container-status"
          );
        });
      }
    );
  });

  it("update internal personal workspace, cancel", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.updatePersonalWorkspaceInternal("test");
    cy.get(".toaster-temp-container").find("#btn-cancel").click();
    cy.intercept("/api/container/removeTempContainer").as(
      "removeTempContainer"
    );
    cy.get(".modal-form").find("#btn-ok").click();
    cy.wait("@removeTempContainer", { responseTimeout: 60 * 1000 }).then(
      (interception) => {
        const response = interception.response.body;
        expect(response.success).equal(true);
        cy.wait(1000).then(() => {
          cy.get(".toaster-success").click({ multiple: true });
          cy.getPersonalWorkspaceCard("test").should(
            "not.have.attr",
            "data-container-status"
          );
        });
      }
    );
  });
});
export {};
