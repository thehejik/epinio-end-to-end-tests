import { Epinio } from '~/cypress/support/epinio';
import { TopLevelMenu } from '~/cypress/support/toplevelmenu';

Cypress.config();
describe('Epinio installation testing', () => {
  const topLevelMenu = new TopLevelMenu();
  const epinio = new Epinio();

  beforeEach(() => {
    cy.login();
    cy.visit('/home');
    topLevelMenu.openIfClosed();
    cy.get('.clusters').contains(Cypress.env('cluster')).click()
  });

  it('Add the Epinio helm repo', () => {
    cy.addHelmRepo({repoName: 'epinio-repo', repoUrl: 'https://github.com/epinio/helm-charts', repoType: 'git'});
  });

  it('Install Epinio', () => {
    // Boolean must be forced to false otherwise code is failing
    cy.epinioInstall({s3: false, extRegistry: false});
  });

  it('Verify epinio-ui ingress URL', () => {
    // WORKAROUND until Epinio icon is not present in Rancher UI
    cy.contains('More Resources').click();
    cy.contains('Networking').click();
    cy.contains('Ingresses').click();
    cy.contains('.ingress-target .target > a', 'epinio-ui')
      .prevAll('a')
      .invoke('attr', 'href').then( (href) => {
        cy.origin(href, (href) => {
        cy.visit('/');
        cy.get('.dashboard-body');
        cy.url().then(url => {
          const tempUrl= url.replace(/^(https:\/\/.*?)\/.*$/, "$1");
          cy.log(`Epinio URL from ingress: ${tempUrl}`);
        // TODO add an assert of the epinio URL with the value from RANCHER_URL
        });
      });
    });
  });
});
