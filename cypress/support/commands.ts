// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { recurse } from "cypress-recurse";
import { c } from "../fixtures/constant";

const _ = Cypress._;

export const cookies = Cypress.env("cookies");
export const hostname = Cypress.env("hostname");
export const username = Cypress.env("username");
export const password = Cypress.env("password");

Cypress.Commands.add("login", (overrides = {}) => {
  for (let cookie of cookies) {
    cookie.sameSite = "lax";
    cy.setCookie(cookie.name, cookie.value, cookie);
  }
  // const shouldHave = ["appSession", "sub", "email"];
  // cy.getCookies().then((cookies) => {
  //   // ensure that the cookies contains all should have
  //   expect(cookies.map((c) => c.name)).to.include.members(shouldHave);
  // });
  // Cypress.log({
  //   name: "login ITSC",
  // });

  // const options = {
  //   method: "post",
  //   url: "https://cas.ust.hk/cas/login",
  //   form: true,
  //   body: {
  //     username: username,
  //     password: password,
  //   },
  // };

  // allow us to override defaults with passed in overrides
  // _.extend(options, overrides);

  // cy.request(options).then((resp) => {
  //   expect(resp.status).eq(200);
  //   // cy.getCookie("TGC").should("exist");
  //   cy.visit("/");
  // });

  // cy.request({
  //   method: "post",
  //   url: "https://codespace.ust.dev",
  // }).then((resp) => {
  //   expect(resp.status).eq(200);
  // });
});

// this needs to be called on BeforeEach
Cypress.Commands.add("preserveCookies", () => {
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

Cypress.Commands.add("visitPersonalWorkspace", () => {
  cy.intercept("/api/sandbox/listSandboxImage?userId=**").as("listSandbox");
  cy.visit(hostname);
  // click the personal workspace tab
  cy.get("#page-content").contains("button", "Personal Workspaces").click();
  cy.wait("@listSandbox").then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
  });
});

Cypress.Commands.add("interceptMenuBtn", (text, intercept) => {
  cy.get("button[id^=headlessui-menu-button-]").click();
  cy.get("div[id^=headlessui-menu-items-]").should("exist");
  if (intercept) {
    const { api, alias } = intercept;
    cy.intercept(api).as(alias);
  }
  cy.contains("button[id^=headlessui-menu-item-]", text).click();
  cy.get("div[id^=headlessui-menu-items-]").should("not.exist");
});

Cypress.Commands.add("getPersonalWorkspaceCard", (name) => {
  cy.get(".sandbox-grid")
    .contains("#sandbox-name", name)
    .closest("div[id^=sandbox-card-]");
});

Cypress.Commands.add("removePersonalWorkspace", (name: string) => {
  cy.getPersonalWorkspaceCard(name).within(() => {
    cy.interceptMenuBtn("Delete", {
      api: "/api/sandbox/removeSandboxImage",
      alias: "removeSandboxImage",
    });
  });
  cy.get(".toaster-loading").should("exist");
  cy.wait("@removeSandboxImage", {
    responseTimeout: c.responseTimeout,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(true);
    cy.get(".toaster-loading").should("not.exist");
    cy.get(".toaster-success").should("exist").click();
    cy.get(".sandbox-grid").contains("#sandbox-name", name).should("not.exist");
  });
});

Cypress.Commands.add("createPersonalWorkspace", () => {
  let workspaceNumber: number;
  let personalWorkspaceName: string;
  let personalWorkspaceDescription = "this is a test description";
  cy.get(".sandbox-grid")
    .children()
    .then((children) => {
      workspaceNumber = children.length - 1;
    });
  cy.get(".sandbox-grid").children().last().click();
  // wait for the modal to show up
  cy.wait(1000)
    .then(() => {
      cy.get(".modal-form").within(() => {
        cy.get("#name")
          .find("input")
          .should("not.have.value", "")
          .then((el) => {
            personalWorkspaceName = el[0].value;
          });
        cy.get("#description")
          .find("textarea")
          .should("have.value", "")
          .type(personalWorkspaceDescription)
          .then((el) => {
            expect(el[0].value).equal(personalWorkspaceDescription);
          });
      });

      cy.intercept("/api/sandbox/addSandboxImage").as("addSandboxImage");
      cy.get(".modal-form").contains("button", "OK").click();
      // should have a loading toast
      cy.get(".toaster-loading").should("exist");
      // the modal should close
      cy.get(".modal-form").should("not.exist");
      cy.wait("@addSandboxImage", { responseTimeout: c.responseTimeout }).then(
        (interception) => {
          const response = interception.response.body;
          expect(response.success).eq(true);
          // the loading toast should disappear
          cy.get(".toaster-loading").should("not.exist");
          cy.wait(1000).then(() => {
            cy.get(".toaster-success").should("exist").click();
            cy.get(".sandbox-grid")
              .children()
              .not("div[id=sandbox-create-btn]")
              .then((children) => {
                expect(children.length).equal(workspaceNumber + 1);
              });
            cy.contains("p#sandbox-name", personalWorkspaceName).should(
              "exist"
            );
            cy.contains(
              "p#sandbox-description",
              personalWorkspaceDescription
            ).should("exist");
          });
        }
      );
    })
    .then(() => {
      cy.getPersonalWorkspaceCard(personalWorkspaceName);
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
              .find("#sandbox-name")
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
            timeout: 60 * 60 * 1000,
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
  cy.wait("@update", { responseTimeout: c.responseTimeout }).then(
    (interception) => {
      cy.get(".toaster-loading").should("not.exist");
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.get(".toaster-success").should("exist").click();
      cy.contains("p#sandbox-name", newData.name).should("exist");
      cy.contains("p#sandbox-description", newData.description).should("exist");
    }
  );
});
