// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

// FOR UNIT TEST RESULTS
var reporters = require('jasmine-reporters');

// FOR COVERAGE
var istanbul = require("istanbul-lib-coverage");
var map = istanbul.createCoverageMap({});

exports.config = {
  //chromeDriver: '../chromedriver',
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  suites: {
    critical: ['./src/app.e2e-spec.ts'],
    core: ['./src/app.e2e-spec.ts']
  },
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
	
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
	
	jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
		savePath: require('path').join(__dirname, '..', 'target', 'e2e'),
		filePrefix: 'e2e-test-results',
		consolidateAll: true
	}));
  },
  async onComplete() {
    try {
      console.log('Retrieving coverage...');
      const lastCoverage = await browser.executeScript('return window.__coverage__;');
      map.merge(lastCoverage);
      if (map) {
        console.log(`Overall coverage retrieved (${JSON.stringify(map).length} bytes)!`);
        const fs = require('fs');
        const path = require('path');
        fs.mkdirSync(path.join(__dirname, '..', '.nyc_output'));
        fs.writeFileSync(path.join(__dirname, '..', '.nyc_output', 'out.json'), JSON.stringify(map));
        const NYC = require('nyc');
        const nycInstance = new NYC({
          cwd: path.join(__dirname, '..'),
          reportDir: 'target/e2e',
          reporter: ['lcov', 'json', 'text-summary']
        });
        nycInstance.report();
        nycInstance.cleanup();
        console.log("Coverage saved successfully!");
      } else {
        console.log("No coverage data!");
      }
      //SONAR TEST RESULTS
      console.log('Retrieving test results...');
      const xsltProcessor = require("xslt-processor");
      const fs = require('fs');
      const path = require('path');
      // reading files
      const fileNameXml = path.join(__dirname, '..', 'target/e2e', 'e2e-test-results.xml');
      const fileNameXslt = path.join(__dirname, 'fromJUNITtoSONAR.xslt');
      const xmlString = fs.readFileSync(fileNameXml).toString(); 
      const xslString = fs.readFileSync(fileNameXslt).toString(); 
      console.log('JUnit test results read: ' + !!xmlString);
      console.log('XSLT for SONAR read: ' + !!xslString);
      const xml  = xsltProcessor.xmlParse(xmlString);
      const xslt  = xsltProcessor.xmlParse(xslString);
      console.log('JUnit test results parsed: ' + !!xml);
      console.log('XSLT for SONAR parsed: ' + !!xslt);
      // transforming file to Generic Test Result (SONAR)
      // xslt was defined according the testcases for xsltProcessor
      // ATTENTION: some features of xslt were not working
      const sonarTestResult = xsltProcessor.xsltProcess(xml,xslt);
      console.log('Result to SONAR ready: ' + !!sonarTestResult);
      // writing file
      fs.writeFileSync(path.join(__dirname, '..', 'target/e2e', 'e2e-test-results-sonar.xml'), sonarTestResult);
      console.log('Test Results retrieved! It is ready for sonnar-scanner!');
    } catch (error) {
      console.log("Error in onComplete:", error);
      process.exit(1);
    }
  }
};