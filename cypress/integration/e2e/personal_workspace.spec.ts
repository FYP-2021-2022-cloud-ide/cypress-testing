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
    cy.get('[data-entry-type="input"] > input').clear().type("workspace1");
    cy.contains("name crash");
    cy.get("#btn-ok").should("be.disabled");
    cy.get("#btn-cancel").click();
  });

  it("update a personal workspace", () => {
    cy.createPersonalWorkspace({ name: "test" });
    cy.updatePersonalWorkspace("test", {
      name: "new name",
      description: "new description",
    });
  });

  it("start a personal workspace", () => {
    //   let name: string;
    //   let card = cy
    //     .get(".sandbox-grid")
    //     .then((el) => {
    //       expect(el.children.length).greaterThan(1);
    //     })
    //     .children()
    //     .first();
    //   cy.intercept("/api/sandbox/addSandbox").as("start");
    //   card.should("exist");
    //   card.within(() => {
    //     cy.get(".sandbox-card-name").then((el) => {
    //       name = el[0].innerText;
    //     });
    //     cy.get("button").click();
    //     cy.get('div[role="menu"]').should("exist");
    //     cy.contains("button", "Start").click();
    //     cy.get('div[role="menu"]').should("not.exist");
    //   });
    //   cy.get(".toaster-loading").should("exist");
    //   cy.wait("@start", { responseTimeout: c.responseTimeout }).then(
    //     (interception) => {
    //       cy.get(".toaster-loading").should("not.exist");
    //       const response = interception.response.body as ContainerAddResponse;
    //       if (response.success) {
    //         cy.get(".toaster-success").should("exist");
    //         let card = cy
    //           .contains(".sandbox-card-name", name)
    //           .closest(".sandbox-card");
    //         card.should("exist");
    //         card.within(() => {
    //           cy.get("#indicator").should("have.class", "bg-green-400");
    //           cy.get("button").click();
    //           cy.contains("button", "Stop").should("exist");
    //         });
    //         cy.get("#container-list-grid").within(() => {
    //           cy.contains(name).should("exist");
    //         });
    //       } else {
    //         cy.get(".toaster-error").should("exist");
    //       }
    //     }
    //   );
  });

  it("stop a personal workspace", () => {
    // get an active personal workspace in the container list
    // stop it in the sandbox grid
  });

  it("starting more personal workspace than quota in a roll", () => {});

  it("change page when waiting for starting workspace", () => {});

  it("create another personal workspace when waiting", () => {});

  it("remove a personal workspace", () => {
    // cy.intercept("/api/sandbox/removeSandboxImage").as("remove");
    // cy.get(".sandbox-grid").within(() => {
    //   let name: string;
    //   let card = cy.get(".bg-gray-400").closest(".sandbox-card");
    //   card.find(".sandbox-card-name").then((el) => {
    //     name = el[0].innerText;
    //   });
    //   card.find("button").click();
    //   cy.contains("button", "Delete").click();
    //   cy.wait("@remove").then((interception) => {
    //     const response = interception.response.body as SuccessStringResponse;
    //     if (response.success) {
    //       cy.get(".toaster-success").should("exist");
    //       // the card should be removed
    //       cy.contains(".sandbox-card-name", name).should("not.exist");
    //     } else {
    //       cy.get(".toaster-error").should("exist");
    //     }
    //   });
    // });
  });

  it("cannot remove a working workspace", () => {
    // cy.get(".sandbox-grid").within(() => {
    //   cy.get(".bg-green-400").closest(".sandbox-card").find("button").click();
    //   cy.contains("button", "Delete").click();
    //   cy.get(".toaster-error").should("exist");
    // });
  });

  it("remove all personal workspaces", () => {});
});
export {};
