import { recurse } from "cypress-recurse";
import "cypress-wait-until";

Cypress.Commands.add("visitPersonalWorkspace", () => {
  cy.intercept("/api/sandbox/listSandboxImage?userId=**").as("listSandbox");
  cy.visit("/");
  // click the personal workspace tab
  cy.get("#page-content").contains("Personal Workspaces").click();
  cy.wait("@listSandbox").then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
  });
});

Cypress.Commands.add("getPersonalWorkspaceCard", (name) => {
  cy.get(".sandbox-grid").contains("#name", name).closest(".sandbox-card");
});

Cypress.Commands.add("createPersonalWorkspace", (workspace = {}) => {
  const { environment, name, description } = workspace;
  cy.intercept("/api/sandbox/addSandboxImage").as("addSandboxImage");
  cy.get("#sandbox-grid #sandbox-create-btn").click();
  cy.get(".modal-form").within(() => {
    if (environment) {
      cy.get("#environment_choice[data-entry-type=listbox] button").click();
      cy.contains("li", environment).click();
    }
    if (name) cy.get("#name[data-entry-type=input] > input").clear().type(name);
    cy.get("#description[data-entry-type=textarea] > textarea").should(
      "have.value",
      ""
    );
    if (description)
      cy.get("#description[data-entry-type=textarea] > textarea")
        .clear()
        .type(description);
    cy.contains("OK").click();
  });
  cy.wait("@addSandboxImage", {
    responseTimeout: 1000 * 60,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(true);
    cy.wait(1000).then(() =>
      cy.get(".toaster-success").click({ multiple: true })
    );
  });
});

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
            cy.get("div[id=sandbox-card-0]")
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
    cy.interceptMenuBtn("update");
    cy.get("p#description").then((el) => {
      description = el[0].innerText;
    });
  });
  // modal form should open
  cy.get(".modal-form").within(() => {
    cy.get("#name").find("input").should("have.value", name);
    cy.get("#description").find("textarea").should("have.value", description);
    cy.get("#name").find("input").clear().type(newData.name);
    cy.get("#description").find("textarea").clear().type(newData.description);
    cy.intercept("/api/sandbox/updateSandboxImage").as("update");
    cy.contains("button", "OK").click();
  });
  cy.wait("@update").then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(true);
    cy.wait(1000).then(() =>
      cy.get(".toaster-success").click({ multiple: true })
    );
  });
  cy.getPersonalWorkspaceCard(newData.name)
    .find("p#description")
    .should("have.text", newData.description);
});

Cypress.Commands.add("startPersonalWorkspace", (name, expected = true) => {
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.interceptMenuBtn("start workspace", {
      api: "/api/sandbox/addSandbox",
      alias: "addSandbox",
    });
  });
  cy.wait("@addSandbox", {
    responseTimeout: 60 * 1000,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(expected);
    cy.wait(1000).then(() =>
      cy
        .get(expected ? ".toaster-success" : ".toaster-error")
        .click({ multiple: true })
    );
  });
  if (expected)
    cy.getPersonalWorkspaceCard(name)
      .should("have.attr", "data-container-status")
      .and("eq", "DEFAULT");
  else
    cy.getPersonalWorkspaceCard(name).should(
      "not.have.attr",
      "data-container-status"
    );
});

Cypress.Commands.add("stopPersonalWorkspace", (name, expected = true) => {
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.interceptMenuBtn("stop workspace", {
      api: "/api/sandbox/removeSandbox",
      alias: "removeSandbox",
    });
  });
  cy.wait("@removeSandbox", {
    responseTimeout: 60 * 1000,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(expected);
    cy.wait(1000).then(() =>
      cy.get(expected ? ".toaster-success" : ".toaster-error").click({
        multiple: true,
      })
    );
  });
  if (expected)
    cy.getPersonalWorkspaceCard(name).should(
      "not.have.attr",
      "data-container-status"
    );
  else
    cy.getPersonalWorkspaceCard(name)
      .should("have.attr", "data-container-status")
      .and("eq", "DEFAULT");
});

Cypress.Commands.add("updatePersonalWorkspaceInternal", (name) => {
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.interceptMenuBtn("update internal", {
      api: "/api/container/addTempContainer",
      alias: "addTempContainer",
    });
  });
  cy.wait("@addTempContainer", {
    responseTimeout: 60 * 1000,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
    cy.wait(1000).then(() => {
      cy.get(".toaster-temp-container");
      cy.getPersonalWorkspaceCard(name)
        .should("have.attr", "data-container-status")
        .and("eq", "DEFAULT");
    });
  });
});

export {};
