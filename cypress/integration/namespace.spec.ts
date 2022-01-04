import { TopLevelMenu } from '~/cypress/integration/util/toplevelmenu';
import { Epinio } from '~/cypress/integration/util/epinio';

Cypress.config();
describe('Namespace testing', () => {
  const topLevelMenu = new TopLevelMenu();
  const epinio = new Epinio();
  const nameSpace = 'mynamespace';
  const appName = 'testapp';

  beforeEach(() => {
    cy.login();
    cy.visit('/home');
    topLevelMenu.openIfClosed();
    epinio.epinioIcon().should('exist');
    epinio.accessEpinioMenu(Cypress.env('cluster'));
    // Make sure the Epinio nav menu is correct
    epinio.checkEpinioNav();
  });
  
  it('Create namespace', () => {
    cy.createNamespace(nameSpace);
  });

  it('Push an app into the created namespace', () => {
    cy.createApp(appName);
    cy.checkApp(appName, nameSpace);
  });

  it('Delete namespace', () => {
    cy.deleteNamespace(nameSpace, appName);
  });
});
