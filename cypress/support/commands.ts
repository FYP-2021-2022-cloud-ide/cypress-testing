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
import "cypress-wait-until";

const _ = Cypress._;

export const cookies = Cypress.env("cookies");
export const hostname = Cypress.env("hostname");
export const username = Cypress.env("username");
export const password = Cypress.env("password");

Cypress.Commands.add("login", () => {
  for (let cookie of cookies) {
    cookie.sameSite = "lax";
    cy.setCookie(cookie.name, cookie.value, cookie);
  }
});

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

Cypress.Commands.overwrite(
  "contains",
  (originalFn, selector, text, options) => {
    return originalFn(selector, text, {
      matchCase: false,
      ...options,
    });
  }
);

Cypress.Commands.add("interceptMenuBtn", (text, intercept) => {
  cy.get("button[id^=headlessui-menu-button-]").click();
  cy.get("div[id^=headlessui-menu-items-]").should("exist");
  if (intercept) {
    const { api, alias } = intercept;
    cy.intercept(api).as(alias);
  }
  cy.contains("button[id^=headlessui-menu-item-]", text, {
    matchCase: false,
  }).click();
  cy.get("div[id^=headlessui-menu-items-]").should("not.exist");
});
