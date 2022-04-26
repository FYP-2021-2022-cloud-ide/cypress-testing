import { recurse } from "cypress-recurse";
import { first } from "cypress/types/lodash";

Cypress.Commands.add("visitInstructorPage", () => {
  cy.visit("/");
  cy.intercept("/api/template/listTemplates*").as("listTemplates");
  cy.intercept("/api/environment/listEnvironments*").as("listEnvironments");
  cy.get("#course-grid")
    .find(".instructor-badge")
    .closest(".course-card")
    .click();
  cy.wait("@listEnvironments").then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
  });
  cy.wait("@listTemplates").then((interception) => {
    const response = interception.response.body;
    expect(response.success).equal(true);
  });
  cy.get("#page-content").contains("div#title", "Environments");
  cy.get("#page-content").contains("div#title", "Templates");
});

Cypress.Commands.add("getTemplateCard", (name) => {
  cy.get(".template-grid").contains("#name", name).closest(".template-card");
});

Cypress.Commands.add("publishTemplate", (name) => {
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("publish", {
      api: "/api/template/activateTemplate",
      alias: "activateTemplate",
    });
  });
  cy.wait("@activateTemplate", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.wait(1000).then(() =>
        cy.get(".toaster-success").click({ multiple: true })
      );
    }
  );
});

Cypress.Commands.add("unpublishTemplate", (name) => {
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("unpublish", {
      api: "/api/template/deactivateTemplate",
      alias: "deactivateTemplate",
    });
  });
  cy.wait("@deactivateTemplate", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.wait(1000).then(() =>
        cy.get(".toaster-success").click({ multiple: true })
      );
    }
  );
});

Cypress.Commands.add("removeTemplate", (name) => {
  cy.getTemplateCard(name).then((el) => {
    cy.log("check if it is publish...", el.attr("data-published"));
    if (el.attr("data-published") == "true") cy.unpublishTemplate(name);
  });
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("delete", {
      api: "/api/template/removeTemplate",
      alias: "removeTemplate",
    });
  });
  cy.get(".modal-form").contains("button", "Confirm").click();
  cy.wait("@removeTemplate", {
    responseTimeout: 60 * 1000,
  }).then((interception) => {
    const response = interception.response.body;
    expect(response.success).eq(true);
    cy.wait(1000)
      .then(() => cy.get(".toaster-success"))
      .click();
  });
});

Cypress.Commands.add("removeAllTemplates", () => {
  cy.get(".template-list")
    .children()
    .last()
    .then((el) => {
      if (!el.hasClass("empty-div")) {
        recurse(
          () => {
            cy.get(".template-card")
              .first()
              .find("#name")
              .then((el) => {
                let name = el[0].innerText;
                cy.removeTemplate(name);
              });
            return cy.get(".template-list").children().last();
          },
          (el) => {
            return el.hasClass("empty-div");
          },
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

Cypress.Commands.add("getEnvCard", (name) => {
  cy.get(".env-grid").contains("#name", name).closest(".env-card");
});

Cypress.Commands.add("removeEnv", (name, expected = true) => {
  cy.getEnvCard(name).within(() => {
    cy.interceptMenuBtn("delete", {
      api: "/api/environment/removeEnvironment",
      alias: "removeEnvironment",
    });
  });
  cy.get(".modal-form").find("#btn-ok").click();
  if (expected) {
    cy.wait("@removeEnvironment", { responseTimeout: 60 * 1000 }).then(
      (interception) => {
        const response = interception.response.body;
        expect(response.success).eq(true);
        cy.wait(1000).then(() => {
          cy.get(".toaster-success").click({ multiple: true });
        });
      }
    );
  } else {
    cy.wait(1000).then(() => {
      cy.get(".toaster-error").click({ multiple: true });
    });
  }
});

Cypress.Commands.add("removeAllEnv", () => {
  cy.get(".env-list")
    .children()
    .last()
    .then((el) => {
      if (!el.hasClass("empty-div")) {
        recurse(
          () => {
            cy.get(".env-card")
              .first()
              .find("#name")
              .then((el) => {
                const name = el[0].innerText;
                cy.removeEnv(name);
              });
            return cy.get(".env-list").children().last();
          },
          (el) => {
            return el.hasClass("empty-div");
          },
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

Cypress.Commands.add("createTemplate", (template = {}) => {
  const { name, description, environment, allowQuestion, examMode, timeLimit } =
    template;
  cy.get(".template-list").find("button#add").click();
  cy.intercept("/api/container/addTempContainer").as("addTempContainer");
  cy.get(".modal-form").within(() => {
    if (environment) {
      cy.get("#environment[data-entry-type=listbox] button").click();
      cy.contains("li", environment).click();
    }
    if (name) {
      cy.get("#name[data-entry-type=input] input").clear().type(name);
    }
    cy.get("#description[data-entry-type=textarea] textarea").should(
      "have.value",
      ""
    );
    if (description) {
      cy.get("#description[data-entry-type=textarea]  textarea")
        .clear()
        .type(description);
    }
    cy.contains("OK").click();
  });
  cy.wait("@addTempContainer", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
    }
  );
  cy.wait(1000).then(() => {
    cy.intercept("/api/template/addTemplate").as("addTemplate");
    cy.get(".toaster-temp-container").find("#btn-ok").click();
  });
  cy.wait("@addTemplate", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      const request = JSON.parse(interception.request.body);
      expect(response.success).eq(true);
      cy.wait(1000).then(() => {
        cy.get(".toaster-success").click({ multiple: true });
        cy.getTemplateCard(request.name);
      });
    }
  );
});

Cypress.Commands.add("createEnv", (env = {}) => {
  const { name, description, environment_choice } = env;
  cy.get(".env-list").find("button#add").click();
  if (environment_choice)
    cy.intercept("/api/environment/addEnvironment").as("addEnvironment");
  else cy.intercept("/api/container/addTempContainer").as("addTempContainer");
  cy.get(".modal-form").within(() => {
    if (environment_choice) {
      cy.get("#environment_choice[data-entry-type=listbox] button").click();
      cy.contains("li", environment_choice).click();
    } else {
      cy.get("#is_predefined[data-entry-type=toggle] button").click();
    }
    if (name) {
      cy.get("#name[data-entry-type=input] input").clear().type(name);
    }
    cy.get("#description[data-entry-type=textarea] textarea").should(
      "have.value",
      ""
    );
    if (description) {
      cy.get("#description[data-entry-type=textarea]  textarea")
        .clear()
        .type(description);
    }
    cy.contains("OK").click();
  });
  if (environment_choice) {
    cy.wait("@addEnvironment", { responseTimeout: 60 * 1000 }).then(
      (interception) => {
        const response = interception.response.body;
        const request = JSON.parse(interception.request.body);
        expect(response.success).eq(true);
        cy.wait(1000).then(() => {
          cy.get(".toaster-success").click({ multiple: true });

          cy.getEnvCard(request.name);
        });
      }
    );
  } else {
    cy.wait("@addTempContainer", {
      responseTimeout: 60 * 1000,
    }).then((interception) => {
      const response = interception.response.body;
      expect(response.success).equal(true);
      cy.wait(1000).then(() => {
        cy.get(".toaster-temp-container");
      });
    });
  }
});

Cypress.Commands.add("updateEnv", (name, newData) => {
  let description: string;
  cy.getEnvCard(name).within(() => {
    cy.interceptMenuBtn("update info");
    cy.get("p#description").then((el) => {
      description = el[0].innerText;
    });
  });
  cy.intercept("/api/environment/updateEnvironment").as("updateEnvironment");
  cy.get(".modal-form").within(() => {
    cy.get("#name[data-entry-type=input] input").should("have.value", name);
    cy.get("#name[data-entry-type=input] input").clear().type(newData.name);
    cy.get("#description[data-entry-type=textarea] textarea").should(
      "have.value",
      description
    );
    cy.get("#description[data-entry-type=textarea]  textarea")
      .clear()
      .type(newData.description);
    cy.contains("OK").click();
  });
  cy.wait("@updateEnvironment", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.wait(1000).then(() =>
        cy.get(".toaster-success").click({ multiple: true })
      );
    }
  );
  cy.getEnvCard(newData.name)
    .find("p#description")
    .should("have.text", newData.description);
});

Cypress.Commands.add("updateEnvInternal", (name) => {
  cy.getEnvCard(name).within(() => {
    cy.interceptMenuBtn("update internal", {
      api: "/api/container/addTempContainer",
      alias: "addTempContainer",
    });
  });
  cy.wait("@addTempContainer", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.get(".toaster-temp-container");
      cy.getEnvCard(name)
        .should("have.attr", "data-container-status")
        .and("eq", "DEFAULT");
    }
  );
});

Cypress.Commands.add("updateTemplateInfo", (name, newData) => {
  let description: string;
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("update info");
    cy.get("p#description").then((el) => {
      description = el[0].innerText;
    });
  });
  cy.intercept("/api/template/updateTemplate").as("updateTemplate");
  cy.get(".modal-form").within(() => {
    cy.get("#name[data-entry-type=input] input").should("have.value", name);
    cy.get("#name[data-entry-type=input] input").clear().type(newData.name);
    cy.get("#description[data-entry-type=textarea] textarea").should(
      "have.value",
      description
    );
    cy.get("#description[data-entry-type=textarea] textarea")
      .clear()
      .type(newData.description);
    cy.get("#allow_notification[data-entry-type=toggle] button").then((el) => {
      if (el.attr("aria-checked") != String(newData.allowQuestion)) {
        cy.get("#allow_notification[data-entry-type=toggle] button").click();
      }
    });
    cy.get("#is_exam[data-entry-type=toggle] button").then((el) => {
      if (el.attr("aria-checked") != String(newData.examMode)) {
        cy.get("#is_exam[data-entry-type=toggle] button").click();
      }
    });
    if (newData.examMode) {
      cy.get("#time_limit[data-entry-type=input] input")
        .clear()
        .type(String(newData.timeLimit));
    }
    cy.get("#btn-ok").click();
  });
  cy.wait("@updateTemplate", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      const request = JSON.parse(interception.request.body);
      expect(response.success).eq(true);
      expect(request.name).eq(newData.name);
      expect(request.description).eq(newData.description);
      expect(request.isExam).eq(newData.examMode);
      if (newData.examMode) expect(request.timeLimit).eq(newData.timeLimit);
      cy.wait(1000).then(() => {
        cy.get(".toaster-success").click({ multiple: true });
      });
      cy.getTemplateCard(newData.name)
        .find("p#description")
        .should("have.text", newData.description);
    }
  );
});

Cypress.Commands.add("updateTemplateInternal", (name) => {
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("update internal", {
      api: "/api/container/addTempContainer",
      alias: "addTempContainer",
    });
  });
  cy.wait("@addTempContainer", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).eq(true);
      cy.get(".toaster-temp-container");
      cy.getTemplateCard(name)
        .should("have.attr", "data-container-status")
        .and("eq", "DEFAULT");
    }
  );
});

Cypress.Commands.add("startTemplateWorkspace", (name) => {
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("start workspace", {
      api: "/api/template/addTemplateContainer",
      alias: "addTemplateContainer",
    });
  });
  cy.wait("@addTemplateContainer", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).equal(true);
    }
  );
  cy.wait(1000).then(() => {
    cy.get(".toaster-success").click();
  });
  cy.getTemplateCard(name)
    .should("have.attr", "data-container-status")
    .and("eq", "DEFAULT");
});

Cypress.Commands.add("stopTemplateWorkspace", (name) => {
  cy.getTemplateCard(name).within(() => {
    cy.interceptMenuBtn("stop workspace", {
      api: "/api/template/removeTemplateContainer",
      alias: "removeTemplateContainer",
    });
  });
  cy.wait("@removeTemplateContainer", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).equal(true);
    }
  );
  cy.wait(1000).then(() => {
    cy.get(".toaster-success").click();
  });
  cy.getTemplateCard(name).should("have.not.attr", "data-container-status");
});

Cypress.Commands.add("makeAnnouncement", (title, content) => {
  cy.get("#course-bar")
    .parent()
    .within(() => {
      cy.interceptMenuBtn("make announcement");
    });
  cy.get(".modal-form").within(() => {
    cy.get("#btn-ok").should("be.disabled");
    cy.get("#title[data-entry-type=input] input").clear().type(title);
    cy.get("#content[data-entry-type=markdown] textarea")
      .last()
      .should("not.have.text");
    cy.get("#content[data-entry-type=markdown] .CodeMirror textarea").type(
      content,
      { force: true }
    );
    cy.get("button.preview").click();
    cy.wait(3000);
    cy.get("#btn-ok").should("not.be.disabled");
  });

  cy.intercept("/api/notification/sendNotificationAnnouncement").as(
    "announcement"
  );
  // recurse(
  //   () => {
  //     cy.get(".modal-form #btn-ok").click();
  //     cy.wait(1000);
  //     return cy.get(".modal-form" ).;
  //   },
  //   (el) => {
  //     expect(el).not.exist
  //   },
  //   {
  //     log: true,
  //     timeout: 10000,
  //     limit: 999,
  //   }
  // );
  cy.get(".modal-form #btn-ok").invoke("click");
  cy.wait("@announcement", { responseTimeout: 60 * 1000 }).then(
    (interception) => {
      const response = interception.response.body;
      expect(response.success).equal(true);
      cy.wait(1000).then(() => {
        cy.get(".toaster-success").click();
      });
      // cy.wait(2000).then(() => {
      // cy.get(".toaster-notification").click();
      // });
    }
  );
});
export {};
