import './functions';
import './tests';
const addContext = require('mochawesome/addContext');

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Cypress {
    interface Chainable {
      // Functions declared in functions.ts
      login(username?: string, password?: string, cacheSession?: boolean,): Chainable<Element>;
      byLabel(label: string,): Chainable<Element>;
      clickButton(label: string,): Chainable<Element>;
      deleteAll(label: string,):Chainable<Element>;
      clickEpinioMenu(label: string,): Chainable<Element>;
      clickClusterMenu(listLabel: string[],): Chainable<Element>;
      confirmDelete(namespace?: string,): Chainable<Element>;
      checkStageStatus(numIndex: number, sourceType: string, timeout?: number, status?: string, appName?: string,): Chainable<Element>;
      typeValue(label: string, value: string, noLabel?: boolean, log?: boolean): Chainable<Element>;
      typeKeyValue(key: string, value: string,): Chainable<Element>;
      getDetail(name: string, type: string, namespace?: string): Chainable<Element>;
      createApp(appName: string, archiveName: string, sourceType: string, customPaketoImage?: string, customApplicationChart?: string, route?: string, addVar?: string, instanceNum?: number, configurationName?: string, shouldBeDisabled?: boolean, manifestName?: string, serviceName?: string, catalogType?: string, namespace?: string,): Chainable<Element>;
      checkApp(appName: string, namespace?: string, route?: string, checkVar?: boolean, checkConfiguration?: boolean, dontCheckRouteAccess?: boolean, instanceNum?: number, serviceName?: string, checkCreatedApp?: string ): Chainable<Element>;
      deleteApp(appName: string, state?: string,): Chainable<Element>;
      restartApp(appName: string, namespace?: string,): Chainable<Element>;
      rebuildApp(appName: string, namespace?: string,): Chainable<Element>;
      showAppLog(appName: string, namespace?: string,): Chainable<Element>;
      showAppShell(appName: string, namespace?: string,): Chainable<Element>;
      downloadManifest(appName: string): Chainable<Element>;
      createNamespace(namespace: string,): Chainable<Element>;
      deleteNamespace(namespace: string, appName?: string,): Chainable<Element>;
      openNamespacesFilter(location: string, namespace?: string, appName?: string, configurationName?: string,): Chainable<Element>;
      filterNamespacesAndCheck(namespace: string, elemInNamespaceName?: string, filterOut?: boolean,): Chainable<Element>;
      checkOutcomeFilteredNamespaces(expectedNumFilteredNamespaces: number, expectedNumElemInNamespaces: number, expectedNameElementInNamespaces?:string,): Chainable<Element>;
      selectNamespaceinComboBox(namespace: string,): Chainable<Element>;    
      createConfiguration(configurationName: string, fromFile?: boolean, namespace?: string,): Chainable<Element>;
      editConfiguration(configurationName: string, fromFile?: boolean, namespace?: string,): Chainable<Element>;
      deleteConfiguration(configurationName: string, namespace?: string,): Chainable<Element>;
      bindConfiguration(appName: string, configurationName: string, namespace?: string,): Chainable<Element>;
      unbindConfiguration(appName: string, configurationName: string, namespace?: string,): Chainable<Element>;
      createService(serviceName: string, catalogType: string): Chainable<Element>;
      bindServiceFromSevicesPage(appName: string, serviceName: string, bindingOption?: string): Chainable<Element>;
      deleteService(serviceName: string): Chainable<Element>;
      addHelmRepo(repoName: string, repoUrl: string, repoType?: string,): Chainable<Element>;
      removeHelmRepo(): Chainable<Element>;
      epinioInstall(s3?: boolean, extRegistry?: boolean,): Chainable<Element>;
      epinioUninstall(): Chainable<Element>;

      // Functions declared in tests.ts
      runApplicationsTest(testName: string,): Chainable<Element>;
      runConfigurationsTest(testName: string,): Chainable<Element>;
      runNamespacesTest(testName: string,): Chainable<Element>;
      runFirstConnectionTest(): Chainable<Element>;
    }
}}

// TODO handle redirection errors better?
// we see a lot of 'error nagivation cancelled' uncaught exceptions that don't actually break anything; ignore them here
Cypress.on('uncaught:exception', (err, runnable, promise) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('navigation guard')) {
    return false;
  }
  if (err.message.includes('on cross-origin object')) {
    return false;
  }
  if (promise) {
    return false;
  }
});

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    // Searches screenshots and videos previously copied in 
    // mochawesome-report from CI 
    const screenshot_ci = `screenshots/${Cypress.spec.name
      }/${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext({ test }, screenshot_ci);
  }
  const video_ci = `videos/${Cypress.spec.name}.mp4`;
  addContext({ test }, video_ci);
});

require('cypress-dark');
