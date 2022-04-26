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
import "./containers";
import "./instructor";
import "./message";

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
      /**
       *
       * @param name name of the personal workspace
       * @param expected whether this operation is expected to be successful
       */
      startPersonalWorkspace(name: string, expected?: boolean): void;
      /**
       *
       * @param name name of the personal workspace
       * @param expected whether this operation is expected to be successful
       */
      stopPersonalWorkspace(name: string, expected?: boolean): void;
      removePersonalWorkspace(name: string): void;
      removeAllPersonalWorkspaces(): void;
      updatePersonalWorkspace(
        name: string,
        newData: {
          name: string;
          description: string;
        }
      ): Cypress.Chainable<JQuery<HTMLElement>>;
      updatePersonalWorkspaceInternal(name: string, confirm?: boolean): void;
      /**
       *
       * @param name name of container
       */
      getContainer(name: string): Cypress.Chainable<JQuery<HTMLElement>>;
      /**
       *
       * @param name name of container
       * @param confirm confirm to remove this
       */
      stopContainer(name: string, confirm?: boolean): void;
      visitInstructorPage(): void;
      removeAllTemplates(): void;
      publishTemplate(name: string): void;
      unpublishTemplate(name: string): void;
      getTemplateCard(name: string): Cypress.Chainable<JQuery<HTMLElement>>;
      removeTemplate(name: string): void;
      createTemplate(template?: {
        environment?: string;
        name?: string;
        description?: string;
        allowQuestion?: boolean;
        examMode?: boolean;
        timeLimit?: number;
      }): void;
      updateTemplateInfo(
        name: string,
        newData: {
          name: string;
          description: string;
          allowQuestion: boolean;
          examMode: boolean;
          timeLimit: number;
        }
      ): void;
      updateTemplateInternal(name: string): void;
      startTemplateWorkspace(name: string): void;
      stopTemplateWorkspace(name: string): void;
      removeAllEnv(): void;
      getEnvCard(name: string): Cypress.Chainable<JQuery<HTMLElement>>;
      removeEnv(
        name: string,
        expected?: boolean
      ): Cypress.Chainable<JQuery<HTMLElement>>;
      createEnv(env?: {
        environment_choice?: string;
        name?: string;
        description?: string;
      }): void;
      updateEnv(
        name: string,
        newData: { name: string; description: string }
      ): void;
      updateEnvInternal(name: string): void;
      makeAnnouncement(title: string, content: string): void;
      sendMessage(): void;
      removeAllMessages(): void;
    }
  }
}
