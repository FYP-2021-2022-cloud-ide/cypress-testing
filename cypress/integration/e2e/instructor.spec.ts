describe("instructor environment and template test", () => {
  before(() => {
    cy.login();
    cy.visitInstructorPage();
    cy.removeAllTemplates();
    cy.removeAllEnv();
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.get("#page-content", { timeout: 5 * 60 * 1000 });
    cy.get("#page-content").contains("div#title", "Environments");
    cy.get("#page-content").contains("div#title", "Templates");
  });

  describe("instructor environment test", () => {
    afterEach(() => {
      cy.removeAllEnv();
    });
    after(() => {});

    it("fail to create a template when there is no environment", () => {
      cy.get(".template-list").find("button#add").click();
      cy.wait(1000).then(() => {
        cy.get(".toaster-warning").click();
      });
    });

    it("create an predefined environment", () => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "test",
      });
    });

    it("cannot have environment of same name", () => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "env1",
      });
      cy.get(".env-list").find("button#add").click();
      cy.get(".modal-form").within(() => {
        cy.get("#name[data-entry-type=input] input").clear().type("env1");
        cy.contains("name crash");
        cy.get("#btn-ok").should("be.disabled");
        cy.get("#btn-cancel").click();
      });
    });

    it("create a custom environment", () => {
      cy.createEnv({
        name: "test",
      });
      cy.intercept("/api/environment/buildEnvironment").as("buildEnvironment");
      cy.get(".toaster-temp-container").find("#btn-ok").click();
      cy.wait("@buildEnvironment", {
        responseTimeout: 60 * 1000,
      }).then((interception) => {
        const response = interception.response.body;
        expect(response.success).equal(true);
        cy.wait(1000).then(() => cy.get(".toaster-success").click());
        cy.getEnvCard("test");
      });
    });

    it("update the info of an environment", () => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "test",
      });
      cy.updateEnv("test", {
        name: "new name",
        description: "new description",
      });
    });

    it("update the internal of an environment", () => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "test",
      });
      cy.updateEnvInternal("test");
      cy.intercept("/api/environment/updateEnvironment").as(
        "updateEnvironment"
      );
      cy.get(".toaster-temp-container").find("#btn-ok").click();
      cy.wait("@updateEnvironment", { responseTimeout: 60 * 1000 }).then(
        (interception) => {
          const response = interception.response.body;
          expect(response.success).eq(true);
          cy.wait(1000).then(() =>
            cy.get(".toaster-success").click({ multiple: true })
          );
        }
      );
    });

    it("warning when highlight templates but there is no templates", () => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "test",
      });
      cy.getEnvCard("test").within(() => {
        cy.interceptMenuBtn("highlight templates");
      });
      cy.wait(1000).then(() => {
        cy.get(".toaster-warning").click();
      });
    });
  });

  describe("instructor template test", () => {
    before(() => {
      cy.createEnv({
        environment_choice: "C++/C",
        name: "test",
      });
    });
    afterEach(() => {
      cy.removeAllTemplates();
    });
    it("create a template", () => {
      cy.createTemplate({
        name: "template1",
      });
    });

    it("cannot have template of same name", () => {
      cy.createTemplate({
        name: "template1",
      });
      cy.get(".template-list").find("button#add").click();
      cy.get(".modal-form").within(() => {
        cy.get("#name[data-entry-type=input] input").clear().type("template1");
        cy.contains("name crash");
        cy.get("#btn-ok").should("be.disabled");
        cy.get("#btn-cancel").click();
      });
    });

    it("publish a template", () => {
      cy.createTemplate({ name: "template1" });
      cy.publishTemplate("template1");

      // button not exist when a template is published
      cy.getTemplateCard("template1").within(() => {
        cy.get("button[id^=headlessui-menu-button-]").click();
        cy.get("div[id^=headlessui-menu-items-]");
        cy.contains("button[id^=headlessui-menu-item-]", "delete").should(
          "not.exist"
        );
        cy.contains("button[id^=headlessui-menu-item-]", "update info").should(
          "not.exist"
        );
        cy.contains(
          "button[id^=headlessui-menu-item-]",
          "update internal"
        ).should("not.exist");
        cy.get("button[id^=headlessui-menu-button-]").click();
      });
    });

    it("update the info of template", () => {
      cy.createTemplate({ name: "template1" });
      cy.updateTemplateInfo("template1", {
        name: "new name",
        description: "new description",
        allowQuestion: true,
        examMode: true,
        timeLimit: 120,
      });
    });

    it("update the internal of a template", () => {
      cy.createTemplate({ name: "template1" });
      cy.updateTemplateInternal("template1");
      cy.intercept("/api/template/updateTemplate").as("updateTemplate");
      cy.get(".toaster-temp-container").find("#btn-ok").click();
      cy.wait("@updateTemplate", {
        responseTimeout: 60 * 1000,
      }).then((interception) => {
        const response = interception.response.body;
        expect(response.success).equal(true);
        cy.wait(1000).then(() => {
          cy.get(".toaster-success").click();
        });
        cy.getTemplateCard("template1").should(
          "not.have.attr",
          "data-container-status"
        );
      });
    });

    it("start and stop a template workspace", () => {
      cy.createTemplate({
        name: "template1",
      });
      cy.startTemplateWorkspace("template1");
      cy.stopTemplateWorkspace("template1");
    });

    it("make announcement", () => {
      cy.fixture("announcement.md").then((md) => {
        cy.makeAnnouncement("this is a test announcement", md);
      });
    });
  });
});

export {};
