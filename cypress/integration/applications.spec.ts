import { Epinio } from '~/cypress/support/epinio';
import { TopLevelMenu } from '~/cypress/support/toplevelmenu';

Cypress.config();
describe('Application testing', () => {
  const topLevelMenu = new TopLevelMenu();
  const epinio = new Epinio();
  const appName = 'testapp';

  beforeEach(() => {
    cy.login();
    cy.visit('/home');
    topLevelMenu.openIfClosed();
    epinio.accessEpinioMenu(Cypress.env('cluster'));
  });

  it('Push a 5 instances application into default namespace and check it', () => {
    cy.createApp({appName: appName, archiveName: 'sample-app.tar.gz', instanceNum: 5});
    cy.checkApp({appName: appName});
  });

  it('Delete the pushed application', () => {
    cy.deleteApp({appName: appName});
  });
});
