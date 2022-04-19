import { username } from "../../../support/commands";

describe("dashboard test", () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.get("#page-content", { timeout: 5 * 60 * 1000 });

    // check initial condition of each test
    // use white theme
    cy.get("body").then((el) => {
      if (el[0].classList.contains("dark")) cy.get("#change_theme_btn").click();
    });
    cy.get("body").should("not.have.class", "dark");
    // have no active containers
    cy.get("#page-content #current-run")
      .should("have.attr", "data-containers")
      .and("eq", "0");
    // have an instructor and student course
    cy.get("#page-content #course-grid").within(() => {
      cy.contains("instructor");
      cy.contains("student");
    });
  });

  after(() => {});

  afterEach(() => {});

  it("check topbar", () => {
    // user menu button
    cy.get("#topbar #action-bar .usermenu", { timeout: 10000 })
      .should("have.text", username)
      .click();
    cy.get("#topbar").contains("Sign Out");

    // message alarm button
    cy.get("#topbar #action-bar [title='Notification']").click();
    cy.get(".notification-popover");

    // help doc btn
    cy.get("#topbar #help_doc_btn");

    // change theme btn
    cy.get("body").should("not.have.class", "dark");
    cy.get("#topbar #change_theme_btn").click();

    cy.get("body").should("have.class", "dark");
    // change back the theme
    cy.get("#topbar #change_theme_btn").click();
  });

  it("check current run container match number", () => {
    cy.get("#page-content #current-run")
      .should("have.attr", "data-containers")
      .and("eq", "0");

    cy.get("#page-content #current-run")
      .should("have.attr", "data-quota")
      .and("eq", "3");

    // check the number is the same on side bar
    cy.get(".sidebar #current-run")
      .should("have.attr", "data-containers")
      .and("eq", "0");
    cy.get(".sidebar #current-run")
      .should("have.attr", "data-quota")
      .and("eq", "3");
    // check the div have same number of workspace cards
    cy.get("#container-list-grid").should("not.exist");
  });

  it("check sidebar pages works normally", () => {
    // visit notification page
    // visit file transfer page
    cy.get("#sidebar #navigation #Messages").click();
    cy.get("#page-content").within(() => {
      cy.contains("messages", { timeout: 10000 });
    });
    cy.get("#sidebar #navigation [id='File Transfer']").click();
    cy.get("#page-content").within(() => {
      cy.contains("Personal Volume", { timeout: 10000 });
    });
    cy.get("#sidebar #navigation #Dashboard").click();
    cy.contains(username);
  });

  it("check tabs work normally", () => {
    // click personal workspace
    cy.get("#page-content").within(() => {
      cy.contains("personal workspaces").click();
      cy.get("#sandbox-grid");
      cy.contains("Courses").click();
      cy.get("#course-grid");
    });
  });
});

export {};
