import { Epinio } from '~/cypress/support/epinio';
import { TopLevelMenu } from '~/cypress/support/toplevelmenu';
import '~/cypress/support/functions';

Cypress.config();
describe('Menu testing', () => {
  const topLevelMenu = new TopLevelMenu();
  const epinio = new Epinio();

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

  it('Verify Welcome Screen without Namespaces', () => {
    cy.deleteAll('Namespaces')
    cy.clickEpinioMenu('Applications');
    cy.get('h1').contains('Welcome to Epinio').should('be.visible')
    // Verify creating namespace from Get Started button works
    cy.get('a.btn.role-secondary').contains('Get started').click()
    cy.clickButton('Create');
    const defaultNamespace = 'workspace'
    cy.typeValue({label: 'Name', value: defaultNamespace});
    cy.clickButton('Create');
    // Check that the namespace has effectively been created
    cy.contains(defaultNamespace).should('be.visible');
  });

  it('Check binary links from version in menu', () => {
    // Check link in main page is present and works after clicking
    cy.get('.version.text-muted > a').should('have.attr', 'href').and('include', '/epinio/about');
    cy.get('.version.text-muted > a').click();

    // Test in ABOUT page starts here
    cy.get('table > tr > td:nth-child(2)').eq(0).invoke('text').then(version => {
      cy.log(`Epinio version in ABOUT PAGE is ${version}`);
      // Check "Go back" link
      cy.get('.back-link').should('exist').click();
      cy.get('span.label.no-icon').eq(0).contains('Applications').should('be.visible');
      // Checks version displayed in about page is the same as in main page
      // Later returns to About page
      cy.get('.version.text-muted > a').invoke('text').should('contains', version).then(version_main => {
        cy.log(`Epinio version in MAIN UI is ${version_main}`);
        cy.visit('/epinio/about');
      });

      // The following should happen only if server version = 6 chars (v2.0.0 for instance)
      cy.log(`Server version is (${version.length} characters) long.`)
      if (version.length < 7) {

        // Check all links work and match the expected version

        // Verify amount of binaries in the page
        cy.get('tr.link > td > a').should('have.length', 3);
        const binOsNames = ['darwin-x86_64', 'linux-x86_64', 'windows-x86_64.zip'];

        for (let i = 0; i < binOsNames.length; i++) {

          // Verify binaries names and version match the one in the page
          cy.get('tr.link > td > a').contains(binOsNames[i]).and('have.attr', 'href')
            .and('include', `https://github.com/epinio/epinio/releases/download/${version}/epinio-${binOsNames[i]}`);
        }
        // Downloading using wget to issues with Github when clicking
        // Scoping download solely to Linux amd
        cy.exec('mkdir -p cypress/downloads');
        cy.exec(`wget -qS  https://github.com/epinio/epinio/releases/download/${version}/epinio-linux-x86_64 -O cypress/downloads/epinio-linux-x86_64`, { failOnNonZeroExit: false }).then((result) => {
          if (result.code != 0) {
            cy.task('log', '### ERROR: Could not download binary. Probably an error on Github ###');
          }
          cy.task('log', '### Stderr for download binary command starts here.');
          cy.task('log', result.stderr);
        });

        // Check link "See all packages" and visit binary page
        // Check version number in binary page matches the one in Epinio
        cy.get('.mt-5').contains('See all packages').invoke('attr', 'href').as('href_repo').then(() => {
          cy.get('@href_repo').should('eq', `https://github.com/epinio/epinio/releases/tag/${version}`);
          // Giving a bit of time beween latest time hitting github and now
          cy.wait(2000);
          cy.origin('https://github.com', { args: { version } }, ({ version }) => {
            cy.visit(`/epinio/epinio/releases/tag/${version}`, { timeout: 15000 });
            cy.get('.d-inline.mr-3', { timeout: 15000 }).contains(`${version}`).should('be.visible');
            cy.screenshot(`epinio-bin-repo-${version}`, { timeout: 15000 });
          });
        });
      }
      else {cy.log(`Server version is too long (${version.length} characters) so binary download will not work and it is currently disabled.`)}
    });
  });
});

// Note: this test needs to be adapted for Rancher Dashboard
// Currently we are good if the custom user is unable to login when chart installed over Rancher
// We'd need to apply values.yaml with the users first in Edit YAML
describe('Login with different users', () => {

  it('Check login with admin user', () => {
    const user_epinio = "admin"
    const pwd_epinio = "password"
    cy.login(user_epinio, pwd_epinio);
    cy.contains('Invalid username or password. Please try again.').should('not.exist')
    cy.contains('Applications').should('be.visible')
  });

  it('Check login with regular user and simple password', () => {
    const user_epinio = "epinio"
    const pwd_epinio = "password"
    cy.login(user_epinio, pwd_epinio);
    cy.contains('Invalid username or password. Please try again.').should('not.exist')
    cy.contains('Applications').should('be.visible')
  });

  it('Check login with regular user "user1" and password with special characters', () => {
    const user_epinio = "user1"
    const pwd_epinio = "Hell@World"
    cy.login(user_epinio, pwd_epinio);
    if (Cypress.env('ui') == null ) {
      cy.contains('Invalid username or password. Please try again.').should('not.exist')
      cy.contains('Applications').should('be.visible')
    }
    // Login fails when installed from rancher
    else if (Cypress.env('ui') == 'epinio-rancher' || Cypress.env('ui') == 'rancher') {
      cy.contains('Invalid username or password. Please try again.').should('exist')
      cy.exec('echo "Negative testing for users. This user not allowed to log in unless values-users.yaml is applied."')
    }
    else {
      throw new Error('ERROR: Variable "ui" is set to an unexpected value.')
    }
  });

  it('Check login with regular user "user2" and password with many special characters', () => {
    const user_epinio = "user2"
    const pwd_epinio = "Hell#@~%/=World"
    cy.login(user_epinio, pwd_epinio);
    if (Cypress.env('ui') == null ) {
      cy.contains('Invalid username or password. Please try again.').should('not.exist')
      cy.contains('Applications').should('be.visible')
    }
    // Login fails when installed from rancher
    else if (Cypress.env('ui') == 'epinio-rancher' || Cypress.env('ui') == 'rancher') {
      cy.contains('Invalid username or password. Please try again.').should('exist')
      cy.exec('echo "Negative testing for users. This user not allowed to log in unless values-users.yaml is applied."')
    }
    else {
      throw new Error('ERROR: Variable "ui" is set to an unexpected value.')
    }
  });

  it('Check login with admin user name with special character (user@test) and password also with special characters', () => {
    const user_epinio = "user@test"
    const pwd_epinio = "Hell@World"
    cy.login(user_epinio, pwd_epinio);
    if (Cypress.env('ui') == null ) {
      cy.contains('Invalid username or password. Please try again.').should('not.exist')
      cy.contains('Applications').should('be.visible')
    }
    // Login fails when installed from rancher
    else if (Cypress.env('ui') == 'epinio-rancher' || Cypress.env('ui') == 'rancher') {
      cy.contains('Invalid username or password. Please try again.').should('exist')
      cy.exec('echo "Negative testing for users. This user not allowed to log in unless values-users.yaml is applied."')
    }
    else {
      throw new Error('ERROR: Variable "ui" is set to an unexpected value.')
    }
  });

  it('Check login with admin user name with numbers (0123456789) and password', () => {
    const user_epinio = "0123456789"
    const pwd_epinio = "password"
    cy.login(user_epinio, pwd_epinio);
    if (Cypress.env('ui') == null) {
      cy.contains('Invalid username or password. Please try again.').should('not.exist')
      cy.contains('Applications').should('be.visible')
    }
    // Login fails when installed from rancher
    else if (Cypress.env('ui') == 'epinio-rancher' || Cypress.env('ui') == 'rancher') {
      cy.contains('Invalid username or password. Please try again.').should('exist')
      cy.exec('echo "Negative testing for users. This user not allowed to log in unless values-users.yaml is applied."')
    }
    else {
      throw new Error('ERROR: Variable "ui" is set to an unexpected value.')
    }
  });

})
