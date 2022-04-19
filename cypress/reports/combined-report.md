# Test report
> Run start date: 20/04/2022, 00:29:03 

> Duration: 169s 

## Tests run stats
  - 📚 total tests: 59
  - ✔️ passed: 58
  - ❌ failed: 1
  - 🔜 skipped: 0
  - ⚠️ skipped by Cypress: 0
  - ❇️ other: 0 

## Passed tests
  <details>
  <summary>Click to reveal</summary>
  <article>
  
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: using white theme
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have no containers
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have a instructor course and student course
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have no message
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have no personal workspaces
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have no environments in the course
- ✔️ Path: cypress/integration/e2e/checkInitial.spec.ts, test: have no templates in the course
- ✔️ Path: cypress/integration/e2e/containers.spec.ts, test: create 3 containers
- ✔️ Path: cypress/integration/e2e/containers.spec.ts, test: fail to create the fourth container
- ✔️ Path: cypress/integration/e2e/containers.spec.ts, test: remove all containers
- ✔️ Path: cypress/integration/e2e/containers.spec.ts, test: create a custom environment and revisit the dashboard before the container is created
- ✔️ Path: cypress/integration/e2e/dashboard.spec.ts, test: check topbar
- ✔️ Path: cypress/integration/e2e/dashboard.spec.ts, test: check current run container match number
- ✔️ Path: cypress/integration/e2e/dashboard.spec.ts, test: check sidebar pages works normally
- ✔️ Path: cypress/integration/e2e/dashboard.spec.ts, test: check tabs work normally
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: empty if no files
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: drop a file in personal volume
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: drop a file with same name in personal volume
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: rename a file in personal volumen
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: remove a file in personal volume
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: create folder in personal volume
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: show login button if not login
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: login google drive 
- ✔️ Path: cypress/integration/e2e/file_transfer.spec.ts, test: drop a file from google drive to personal volumne
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: fail to create a template when there is no environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: create an predefined environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: remove an environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: create a custom environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: update the info of an environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: update the internal of an environment
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: warning when highlight templates but there is no templates
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: create a template
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: publish a template
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: fail to update internal when a template is published
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: unpublish a template
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: update the info of template
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: update the internal of a template
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: start a template workspace
- ✔️ Path: cypress/integration/e2e/instructor.spec.ts, test: remove a template
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: empty if no message
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: send messages if 'send test message' button exists
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: click a message to view content
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: click a message on alarm menut to go to message
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: click more button of alarm menu to go message table
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: reply a message
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: delete a message
- ✔️ Path: cypress/integration/e2e/message_table.spec.ts, test: delete all messages
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: create a personal workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: cannot have same personal workspace name
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: update a personal workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: start a personal workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: stop a personal workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: starting more personal workspace than quota in a roll
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: change page when waiting for starting workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: create another personal workspace when waiting
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: remove a personal workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: cannot remove a working workspace
- ✔️ Path: cypress/integration/e2e/personal_workspace.spec.ts, test: remove all personal workspaces
  </article>
  </details>

## Failed tests
  <details>
  <summary>Click to reveal</summary>
  <article>
  
- 💢 Path: cypress/integration/e2e/error.spec.ts, test: visit the wrong url
  </article>
  </details>

## Skipped tests
  <details>
  <summary>Click to reveal</summary>
  <article>
  

  </article>
  </details>

## Skipped tests by Cypress
  <details>
  <summary>Click to reveal</summary>
  <article>
  

  </article>
  </details>

