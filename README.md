This is a README file to get familiar with the files provided in this repository.

In SPFGenerator/Cypress/Tests/TestCases.md, you can find all the test cases I executed on the EasyDmarc SPF Generator tool.
Due to a short timeframe, I didn’t perform further testing such as adding the SPF record to DNS or API/E2E testing, as previously discussed via email. 
I tried to cover all possible cases during tool testing, although we know that it’s impossible to cover everything. :) 

In SPFGenerator/Cypress/Tests/UI/SPFGenerator.ts, you can find the test cases I automated using the Cypress framework with TypeScript. Again, I've tried to automate all the cases, but mostly focused on the important ones.

There are files like SPFGeneratorModels, SPFGeneratorPage, Cypress custom commands that I used when writing tests, you can check them out as well. 


In SPFGenerator/package.json, you can find scripts to run the tests, which can be executed as needed.
