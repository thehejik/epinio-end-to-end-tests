import { defineConfig } from 'cypress'
import { exec, spawn } from 'child_process'

const startServer = async function (ExecuteCommandWithPath: string) {
  spawn(ExecuteCommandWithPath,
      (error, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);
          if (error !== null) {
              console.log(`exec error: ${error}`);
              return false;
          }
          return true;
      });
};

// export default defineConfig({
export default defineConfig({
  defaultCommandTimeout: 10000,
  // numTestsKeptInMemory:25,
  reporter: 'mochawesome',
  reporterOptions: {
    reportFilename: '[name]-report_[status]_[datetime]',
    timestamp: 'shortDate',
  },
  morgan: false,
  clientCertificates: [
    {
      url: 'https://*',
      ca: [],
      certs: [
        {
          cert: 'cypress/fixtures/epinio-private-cert-pem.file',
          key: 'cypress/fixtures/epinio-private-key-pem.file',
        },
      ],
    },
  ],
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
      on("task", {
        execbg(ExecuteCommandWithPath) {
          return new Promise((resolve, reject) => {
            startServer(ExecuteCommandWithPath);
            resolve(false);
          });
        }
      })
      return require('./cypress/plugins/index.ts')(on, config)
    },
    experimentalSessionAndOrigin: true,
    specPattern:
      'cypress/e2e/unit_tests/*.spec.ts',
  },
})
