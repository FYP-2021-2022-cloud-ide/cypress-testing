// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "./personalWorkspaces";

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * this command sets the cookies from environment
       */
      login(): void;
      /**
       * this commands preserve the cookies across tests.
       */
      preserveCookies(): void;

      /**
       * this commands find a menu button in the current scope and click the target button.
       * This function can also intercept the button
       *
       * @param text text of the target button
       * @param intercept
       */
      interceptMenuBtn(
        text: string,
        intercept?: { api: string; alias: string }
      ): void;

      // personal_workspace.spec.ts
      getPersonalWorkspaceCard(
        name: string
      ): Cypress.Chainable<JQuery<HTMLElement>>;
      /**
       * this command visit the personal workspace section
       */
      visitPersonalWorkspace(): void;
      /**
       * This command create a personal workspace with desired name and description
       * @param name
       * @param description
       */
      createPersonalWorkspace(workspace?: {
        environment?: string;
        name?: string;
        description?: string;
      }): Cypress.Chainable<JQuery<HTMLElement>>;
      removePersonalWorkspace(name: string);
      removeAllPersonalWorkspaces();
      updatePersonalWorkspace(
        name: string,
        newData: {
          name: string;
          description: string;
        }
      ): Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }
}
