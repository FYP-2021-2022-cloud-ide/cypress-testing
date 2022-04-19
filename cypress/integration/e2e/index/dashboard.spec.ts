describe("dashboard test", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait(3000);
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
  });

  after(() => {});

  afterEach(() => {
    cy.wait(1000);
  });

  it("list cookies", () => {
    const shouldHave = ["appSession", "sub", "email", "userId", "name"];
    cy.getCookies().then((cookies) => {
      // ensure that the cookies contains all should have
      expect(cookies.map((c) => c.name)).to.include.members(shouldHave);
    });
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

  // it("check current run container match number", () => {
  //   let current: number;
  //   let quota: number;
  //   let sidebarCurrent: number;
  //   let sidebarQuota: number;
  //   // get the number of current run container

  //   cy.get("#page-content #current-run").then((el) => {
  //     current = Number(el[0].innerText[0]);
  //     quota = Number(el[0].innerText[2]);
  //     // check it is not greater than quota
  //     expect(current).at.most(quota);
  //   });

  //   // check the number is the same on side bar
  //   cy.get("#sidebar").get("#current-run-percentage");
  //   cy.get("#sidebar #current-run-percentage").then((el) => {
  //     sidebarCurrent = Number(el[0].innerText[0]);
  //     sidebarQuota = Number(el[0].innerText[2]);
  //     expect(current).equal(sidebarCurrent);
  //     expect(quota).equal(sidebarQuota);
  //   });

  //   // check the div have same number of workspace cards
  //   cy.wait(1000).then(() => {
  //     if (current == 0) {
  //       cy.get("#page-content > div > div:nth-child(1) > div.empty-div");
  //     } else {
  //       cy.get("#container-list-grid").then((el) => {
  //         expect(current).equal(el[0].children.length);
  //       });
  //     }
  //   });
  // });

  // it("check sidebar pages works normally", () => {
  //   // visit notification page
  //   // visit file transfer page
  //   cy.get("#sidebar").within(() => {
  //     cy.contains("Dashboard").closest("a").click().wait(3000);
  //     cy.contains("Notifications").closest("a").click().wait(3000);
  //     cy.contains("File Transfer").closest("a").click().wait(3000);
  //   });
  // });

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
