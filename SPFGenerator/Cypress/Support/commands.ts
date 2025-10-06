import "@testing-library/cypress/add-commands";
import "cypress-file-upload";
import { SPFGeneratorPage } from "Pages/SPFGeneratorPage";

Cypress.Commands.add("safeFixture", (fixturePath, options) => {
  cy.task("checkFixtureExists", fixturePath).then((exists) => {
    if (exists) {
      return cy.fixture(fixturePath, options);
    } else {
      cy.log("Fixture not found: ", fixturePath);
      return null;
    }
  });
});

Cypress.Commands.add("clickOutside", () => {
  return cy.get("body").click("top");
});

Cypress.Commands.add("typeDomain", (domain: string) => {
  SPFGeneratorPage.domainNameInput().clear().type(domain);
});

Cypress.Commands.add("addInclude", (include: string, index = 0) => {
  SPFGeneratorPage.includeButton().click();
  SPFGeneratorPage.includeInput().eq(index).type(`${include}{enter}`);
});

Cypress.Commands.add("addIPv4", (ip: string) => {
  SPFGeneratorPage.ipV4Button().click();
  SPFGeneratorPage.ipV4Input().type(ip);
});

Cypress.Commands.add("addIPv6", (ip: string) => {
  SPFGeneratorPage.showMoreButton().click();
  SPFGeneratorPage.ipV6Button().click();
  SPFGeneratorPage.ipV6Input().type(ip);
});

Cypress.Commands.add("selectFailPolicy", (policy: "Fail" | "SoftFail" | "None" | "Neutral") => {
  SPFGeneratorPage.failurePolicyDropDown().click();
  const policies = {
    Fail: SPFGeneratorPage.failPolicy,
    SoftFail: SPFGeneratorPage.softFailPolicy,
    None: SPFGeneratorPage.nonePolicy,
    Neutral: SPFGeneratorPage.neutralPolicy,
  };
  policies[policy]().click();
});

Cypress.Commands.add("generateSPF", () => {
  SPFGeneratorPage.generateButton().click();
});
