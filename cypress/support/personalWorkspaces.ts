import { recurse } from "cypress-recurse";
import "cypress-wait-until";

Cypress.Commands.add("visitPersonalWorkspace", () => {
  cy.intercept("/api/sandbox/listSandboxImage?userId=**").as("listSandbox");
  cy.visit("/");
  // click the personal workspace tab
  cy.get("#page-content").contains("button", "Personal Workspaces").click();
  cy.wait("@listSandbox").then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
  });
});

Cypress.Commands.add("getPersonalWorkspaceCard", (name) => {
  cy.get(".sandbox-grid")
    .contains("#name", name)
    .closest("div[id^=sandbox-card-]");
});

Cypress.Commands.add(
  "createPersonalWorkspace",
  (environment, name, description) => {
    cy.intercept("/api/sandbox/addSandboxImage").as("addSandboxImage");
    cy.get("#sandbox-grid #sandbox-create-btn").click();
    cy.get(".modal-form").within(() => {
      cy.get("#name[data-entry-type=input] > input").should(
        "not.have.value",
        ""
      );
      if (name)
        cy.get("#name[data-entry-type=input] > input").clear().type(name);
      cy.get("#description[data-entry-type=textarea] > textarea").should(
        "have.value",
        ""
      );
      if (description)
        cy.get("#description[data-entry-type=textarea] > textarea").type(
          description
        );
      cy.contains("OK").click();
    });
    cy.wait("@addSandboxImage", {
      responseTimeout: 1000 * 60,
    }).then((interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.wait(1000).then(() => cy.get(".toaster-success").click());
    });
  }
);

Cypress.Commands.add("removePersonalWorkspace", (name: string) => {
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.interceptMenuBtn("Delete", {
      api: "/api/sandbox/removeSandboxImage",
      alias: "removeSandboxImage",
    });
  });
  cy.contains("button", "Confirm").click();

  cy.wait("@removeSandboxImage", {
    responseTimeout: 60 * 1000,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(true);
    cy.wait(1000).then(() => cy.get(".toaster-success").click());
  });
});

Cypress.Commands.add("removeAllPersonalWorkspaces", () => {
  cy.get(".sandbox-grid")
    .children()
    .then((children) => {
      if (children.length > 1) {
        recurse(
          () => {
            cy.get("div[id^=sandbox-card-]")
              .first()
              .find("#name")
              .then((el) => {
                let name = el[0].innerText;
                cy.removePersonalWorkspace(name);
              });
            return cy.get(".sandbox-grid").children();
          },
          (children) => children.length === 1,
          {
            log: true,
            limit: 999,
            timeout: 60 * 1000,
            delay: 300,
          }
        );
      }
    });
});

Cypress.Commands.add("updatePersonalWorkspace", (name, newData) => {
  let description: string;
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.get("p#sandbox-description").then((el) => {
      description = el[0].innerText;
    });
    cy.interceptMenuBtn("Update");
  });
  cy.wait(1000).then(() => {
    // modal form should open
    cy.get(".modal-form").within(() => {
      cy.get("#name").find("input").should("have.value", name);
      cy.get("#description").find("textarea").should("have.value", description);
      cy.get("#name").find("input").clear().type(newData.name);
      cy.get("#description").find("textarea").clear().type(newData.description);
      cy.intercept("/api/sandbox/updateSandboxImage").as("update");
      cy.contains("button", "OK").click();
    });
  });
  cy.get(".toaster-loading").should("exist");
  cy.get(".modal-form").should("not.exist");
  // cy.wait("@update", { responseTimeout: c.responseTimeout }).then(
  //   (interception) => {
  //     cy.get(".toaster-loading").should("not.exist");
  //     const response = interception.response.body;
  //     expect(response.success).eq(true);
  //     cy.get(".toaster-success").should("exist").click();
  //     cy.contains("p#sandbox-name", newData.name).should("exist");
  //     cy.contains("p#sandbox-description", newData.description).should("exist");
  //   }
  // );
});

export {};
