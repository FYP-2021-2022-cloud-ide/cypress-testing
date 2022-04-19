import { username } from "../../../support/commands";

describe("dashboard test", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    // cy.waitUntil(() => cy.get(username), {
    //   errorMsg: "This is a custom error message",
    //   timeout: 5 * 60 * 1000,
    //   interval: 500,
    // });
  });

  beforeEach(() => {
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
    cy.contains(username, { timeout: 5 * 60 * 1000 });
  });

  after(() => {});

  afterEach(() => {});

  it("list cookies", () => {
    // const shouldHave = ["appSession", "sub", "email", "userId", "name"];
    // cy.getCookies().then((cookies) => {
    //   // ensure that the cookies contains all should have
    //   expect(cookies.map((c) => c.name)).to.include.members(shouldHave);
    // });
    cy.contains("mlkyeung");
  });

  // it("check topbar", () => {
  //   // user menu button
  //   cy.get("#topbar #action-bar .usermenu", { timeout: 10000 }).click();
  //   cy.get('a[href*="/logout"]');

  //   // message alarm button
  //   cy.get("#topbar #action-bar [title='Notification']").click();
  //   cy.get(".notification-popover");

  //   // help doc btn
  //   cy.get("#help_doc_btn");

  //   // change theme btn
  //   let darkTheme;
  //   cy.get("body").then((el) => {
  //     darkTheme = el[0].classList.contains("dark");
  //   });
  //   let themeBtn = cy.get("#change_theme_btn");
  //   themeBtn.click();
  //   cy.get("body").should((el) => {
  //     let darkTheme2 = el[0].classList.contains("dark");
  //     expect(darkTheme2).to.not.equal(darkTheme);
  //   });
  //   // change back the theme
  //   themeBtn.click();
  // });

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
    // cy.get("#container-list-grid").children().should("have.length", 0);
  });

  // });

  it("check sidebar pages works normally", () => {
    // visit notification page
    // visit file transfer page
    cy.get("#sidebar").within(() => {
      cy.contains("Dashboard").closest("a").click().wait(3000);
      cy.contains("Messages").closest("a").click().wait(3000);
      cy.contains("File Transfer").closest("a").click().wait(3000);
    });
  });

  // it("check tabs work normally", () => {
  //   // click personal workspace
  //   cy.get("#page-content").within(() => {
  //     cy.get("button").contains("Personal Workspaces").click();
  //     cy.get("#sandbox-grid").should("exist");
  //     cy.get("button").contains("Courses").click();
  //     cy.get("#course-grid").should("exist");
  //   });
  // });
});

export {};
