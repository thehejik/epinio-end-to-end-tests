import { Epinio } from '~/cypress/support/epinio';
import { TopLevelMenu } from '~/cypress/support/toplevelmenu';

Cypress.config();
const epinio = new Epinio();
const topLevelMenu = new TopLevelMenu();

if (Cypress.env('ui') == "rancher") {
  describe('First login on Rancher', () => {
    it('Log in and accept terms and conditions', () => {
      cy.runFirstConnectionTest();
    });
  });
}

describe('Menu testing', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('Check Epinio menu', () => {
    if (Cypress.env('ui') == "rancher") {
      topLevelMenu.openIfClosed();

      // Epinio's icon should appear in the side menu
      epinio.epinioIcon().should('exist');

      // Click on the Epinio's logo as well as your Epinio instance 
      epinio.accessEpinioMenu(Cypress.env('cluster'));
    }

    // Check Epinio's side menu
    epinio.checkEpinioNav();
  });
});

describe('Applications testing', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    if (Cypress.env('ui') == "rancher") {
      topLevelMenu.openIfClosed();
      epinio.accessEpinioMenu(Cypress.env('cluster'));
    }
    // Executes application cleansing of "testapp" and "configuration01"
    // If the app does not exist it will not fail
    // Destroy application "testapp" and verify
    cy.exec('epinio app delete testapp', { failOnNonZeroExit: false });
    cy.clickEpinioMenu('Applications');
    cy.contains('testapp', { timeout: 60000 }).should('not.exist');

    // Destroy configuration "configuration01" and verify
    cy.exec('epinio configuration delete configuration01', { failOnNonZeroExit: false });
    cy.clickEpinioMenu('Configurations');
    cy.contains('configuration01', { timeout: 60000 }).should('not.exist');
  });

  it('Push basic application and check we can restart and rebuild it', () => {
    cy.runApplicationsTest('restartAndRebuild');
  });

  it('Push a 5 instances application with container image into default namespace and check it', () => {
    cy.runApplicationsTest('multipleInstanceAndContainer');
  });

  it('Push application with custom route into default namespace and check app log/shell features', () => {
    cy.runApplicationsTest('customRoute');
  });

  it('Push application with env vars and Git URL into default namespace and check it', () => {
    cy.runApplicationsTest('envVarsAndGitUrl');
  });

  it('Push a 5 instances application with mixed options into default namespace and check it', () => {
    cy.runApplicationsTest('allTests');
  });
});

describe('Configurations testing', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    if (Cypress.env('ui') == "rancher") {
      topLevelMenu.openIfClosed();
      epinio.accessEpinioMenu(Cypress.env('cluster'));
    }
  });

  it('Create an application with a configuration, unbind the configuration and delete all', () => {
    cy.runConfigurationsTest('newAppWithConfiguration');
  });

  it('Bind a created configuration to an existing application, edit configuration and delete all', () => {
    cy.runConfigurationsTest('bindConfigurationOnApp');
  });
});

describe('Namespaces testing', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    if (Cypress.env('ui') == "rancher") {
      topLevelMenu.openIfClosed();
      epinio.accessEpinioMenu(Cypress.env('cluster'));
    }
  });

  it('Push and check an application into the created namespace', () => {
    cy.runNamespacesTest('newNamespace');
  });

  it('Try to push an application without any namespace', () => {
    cy.runNamespacesTest('withoutNamespace');
  });
});
