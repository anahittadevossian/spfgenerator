import { ValidationErrorMessages } from "Models/SPFGeneratorModels";
import { SPFGeneratorPage } from "Pages/SPFGeneratorPage";

function generateSPFWith(options: {
  domain?: string;
  includes?: string[];
  ipv4?: string[];
  ipv6?: string[];
  aRecords?: string[];
  mxRecords?: string[];
  exists?: string[];
  redirect?: string;
  failPolicy?: "Fail" | "SoftFail" | "None" | "Neutral";
}) {
  if (options.domain) cy.typeDomain(options.domain);
  options.includes?.forEach((i, idx) => cy.addInclude(i, idx));
  options.ipv4?.forEach((ip) => cy.addIPv4(ip));
  options.ipv6?.forEach((ip) => cy.addIPv6(ip));
  options.aRecords?.forEach((a) => {
    SPFGeneratorPage.showMoreButton().click();
    SPFGeneratorPage.aRecordButton().click();
    SPFGeneratorPage.aRecordInput().type(a);
  });
  options.mxRecords?.forEach((mx) => {
    SPFGeneratorPage.showMoreButton().click();
    SPFGeneratorPage.mxRecordButton().click();
    SPFGeneratorPage.mxRecordInput().type(mx);
  });
  options.exists?.forEach((e) => {
    SPFGeneratorPage.showMoreButton().click();
    SPFGeneratorPage.existRecordButton().click();
    SPFGeneratorPage.existRecordInput().type(e);
  });
  if (options.failPolicy) cy.selectFailPolicy(options.failPolicy);
  if (options.redirect) {
    SPFGeneratorPage.redirectToggle().click();
    SPFGeneratorPage.redirectInput().type(options.redirect);
  }
  cy.generateSPF();
}

describe("SPF Generator Tests", () => {
  const baseUrl = "/tools/spf-record-generator";
  const testDomains = { valid: "simplytechnologies.net", invalid: "simply", long: "a".repeat(50) + ".com" };
  const testIPs = { ipv4: "192.168.1.1", ipv6: "2001:db8::1" };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe("Domain Validation", () => {
    it("Valid Domain + Include", () => {
      generateSPFWith({ domain: testDomains.valid, includes: ["_spf.google.com"] });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 include:_spf.google.com ~all");
    });

    it("Invalid Domain Format", () => {
      cy.typeDomain(testDomains.invalid);
      cy.generateSPF();
      SPFGeneratorPage.domainErrorMessage().should("contain.text", ValidationErrorMessages.InvalidDomainFormat);
    });

    it("Long Domain Name (Boundary)", () => {
      cy.typeDomain(testDomains.long);
      cy.generateSPF();
      SPFGeneratorPage.spfHostName().should("contain", testDomains.long);
    });
  });

  describe("Include Mechanism", () => {
    it("Multiple Includes within Limit", () => {
      generateSPFWith({ domain: testDomains.valid, includes: ["_spf.google.com", "spf.protection.outlook.com"] });
      SPFGeneratorPage.spfRecordContainer().should(
        "contain.text",
        "v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all"
      );
    });

    it("Add More Than 10 Includes", () => {
      const includes = Array.from({ length: 11 }, (_, i) => `include${i + 1}.example.com`);
      generateSPFWith({ domain: testDomains.valid, includes });
      SPFGeneratorPage.errorContainer().should("contain", ValidationErrorMessages.ExceededLookupLimit);
    });

    it("Invalid Characters in Include", () => {
      generateSPFWith({ domain: testDomains.valid, includes: ["_spf#google.com"] });
      SPFGeneratorPage.errorContainer().should("contain", ValidationErrorMessages.InvalidIncludeDomain);
    });

    it("Duplicate Includes", () => {
      generateSPFWith({ domain: testDomains.valid, includes: ["_spf.google.com", "_spf.google.com"] });
      SPFGeneratorPage.warningContainer().should("contain", ValidationErrorMessages.DuplicateInclude);
    });
  });

  describe("IP Mechanism", () => {
    it("IPv4 + IPv6 Combination", () => {
      generateSPFWith({ domain: testDomains.valid, ipv4: [testIPs.ipv4], ipv6: [testIPs.ipv6], failPolicy: "Fail" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 ip4:192.168.1.1 ip6:2001:db8::1 -all");
    });

    it("Invalid IPv4", () => {
      generateSPFWith({ domain: testDomains.valid, ipv4: ["999.999.999.999"] });
      SPFGeneratorPage.errorContainer().should("contain", ValidationErrorMessages.InvalidIPv4);
    });

    it("Invalid IPv6", () => {
      generateSPFWith({ domain: testDomains.valid, ipv6: ["12345::abcd"] });
      SPFGeneratorPage.errorContainer().should("contain", ValidationErrorMessages.InvalidIPv6);
    });
  });

  describe("A, MX, EXISTS Mechanisms", () => {
    it("Valid A Record", () => {
      generateSPFWith({ domain: testDomains.valid, aRecords: ["easydmarc.com"], failPolicy: "Fail" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 a:easydmarc.com -all");
    });

    it("Valid MX Record", () => {
      generateSPFWith({ domain: testDomains.valid, mxRecords: ["google.com"], failPolicy: "Fail" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 mx:google.com -all");
    });

    it("Exists Mechanism", () => {
      generateSPFWith({ domain: testDomains.valid, exists: ["%{i}._spf.mta.salesforce.com"], failPolicy: "Fail" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 exists:%i._spf.mta.salesforce.com -all");
    });
  });

  describe("Redirect Mechanism", () => {
    beforeEach(() => cy.typeDomain(testDomains.valid));

    it("Valid Redirect", () => {
      generateSPFWith({ redirect: "_spf.google.com" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 redirect=_spf.google.com");
    });

    it("Invalid Redirect Domain", () => {
      generateSPFWith({ redirect: "_spf@google.com" });
      SPFGeneratorPage.errorContainer().should("contain", ValidationErrorMessages.InvalidRedirectDomain);
    });

    it("Redirect Overrides Fail Policy", () => {
      generateSPFWith({ failPolicy: "Fail", redirect: "_spf.google.com" });
      SPFGeneratorPage.spfRecordContainer().should("contain", "v=spf1 redirect=_spf.google.com");
    });

    it("Policy Dropdown Disabled When Redirect On", () => {
      SPFGeneratorPage.redirectToggle().click();
      SPFGeneratorPage.failurePolicyDropDown().should("be.disabled");
    });
  });

  describe("Failure Policy / SPF Qualifiers", () => {
    const policies = [
      { name: "None", expected: ValidationErrorMessages.MissingAllTag },
      { name: "SoftFail", expected: "v=spf1 include:_spf.google.com ~all" },
      { name: "Fail", expected: "v=spf1 include:_spf.google.com -all" },
      { name: "Neutral", expected: "v=spf1 include:_spf.google.com ?all" },
    ];

    beforeEach(() => generateSPFWith({ domain: testDomains.valid, includes: ["_spf.google.com"] }));

    policies.forEach(({ name, expected }) => {
      it(`Failure Policy = ${name}`, () => {
        cy.selectFailPolicy(name as any);
        cy.generateSPF();
        if (expected.startsWith("v=spf1")) {
          SPFGeneratorPage.spfRecordContainer().should("contain", expected);
        } else {
          SPFGeneratorPage.errorContainer().should("contain", expected);
        }
      });
    });
  });
});
