import { Epinio } from '~/cypress/support/epinio';

Cypress.config();
describe('Example test calling kubectl and epinio commands', () => {
  const epinio = new Epinio();

  it('Log in and perform CLI commands', () => {
    
    cy.login();

    // Deploy kubectl (incl. configuration) and epinio
    // cy.kubectlDeployCli(); // in case you need only kubectl
    
    cy.epinioDeployCli();

    // Call commands here
    cy.commandCall('kubectl', 'get pods -A');
    //let result = cy.commandCall('epinio', 'login --user ' + Cypress.env('username') + ' --password ' + Cypress.env('password') + ' --trust-ca ' + Cypress.config().baseUrl);
    //console.log(result);

    //let result = cy.commandCall('nohup epinio', 'login --oidc --trust-ca ' + Cypress.config().baseUrl + '| tee bla \&');
    //console.log(result);
    //cy.commandCall('cat', 'bla');
    //cy.commandCall('fg',"");

    // This command is suppose to fail so add "|| true" at the end of arguments
    //cy.commandCall('epinio', 'info || true');

    //cy.task('execbg', 'epinio login --oidc --trust-ca ' + Cypress.config().baseUrl);
    cy.task('execbg', 'nautilus');
    cy.task('execbg', '(while true; do date; sleep 1; done)');
    cy.commandCall('kubectl', 'get pods -A');

  });
});
