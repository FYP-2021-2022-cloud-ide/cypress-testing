Cypress.Commands.add("getContainer", (name) => {
  cy.get("#container-list-grid")
    .contains("#title", name)
    .closest(".container-card");
});

Cypress.Commands.add("stopContainer", (name, confirm) => {
  cy.getContainer(name).within(() => {
    cy.get("#remove-btn").click();
  });
  if (confirm == true) {
    cy.wait(1000).then(() => {
      cy.intercept("/api/container/removeTempContainer", "removeTempContainer");
      cy.get(".modal-form").find("#btn-ok").click();
      cy.wait("@removeTempContainer", { responseTimeout: 60 * 1000 }).then(
        (interception) => {
          const response = interception.response.body;
          expect(response.success).eq(true);
          cy.wait(1000).then(() => {
            cy.get(".toaster-success").click();
          });
        }
      );
    });
  } else if (confirm == false) {
    cy.wait(1000).then(() => {
      cy.get(".modal-form").find("#btn-cancel").click();
    });
  } else {
    // confirm is undefined
    cy.wait(1000).then(() => {
      cy.get(".toaster-success").click();
    });
  }
});

export {};
