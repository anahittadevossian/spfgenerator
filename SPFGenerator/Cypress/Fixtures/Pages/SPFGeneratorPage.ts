export class SPFGeneratorPage {
  static domainNameInput = () => cy.get("#domain");

  static domainErrorMessage = () => cy.get(".parsley-extractDomain");

  static includeInput = () => cy.get('input[data-name="include"]');

  static includeButton = () => cy.get(".js-add-option").contains("Include");

  static nestedIncludeContent = () => cy.get(".sub-spf-record");

  static nestedIncludeBlock = () => cy.get(".break-word.well-sub-spf");

  static nestedIncludeLabel = () => cy.get(".badge-light-blue");

  static ipV4Input = () => cy.get('input[data-name="ip4"]');

  static ipV4Button = () => cy.get(".js-add-option").contains("IPv4");

  static showMoreButton = () => cy.get("span.show-more-text").contains("Show more");

  static ipV6Button = () => cy.get(".js-add-option").contains("IPv6");

  static ipV6Input = () => cy.get('input[data-name="ip6"]');

  static aRecordButton = () => cy.get(".js-add-option").contains("A");

  static aRecordInput = () => cy.get('input[data-name="a"]');

  static mxRecordButton = () => cy.get(".js-add-option").contains("MX");

  static mxRecordInput = () => cy.get('input[data-name="mx"]');

  static existRecordButton = () => cy.get(".js-add-option").contains("Exists");

  static existRecordInput = () => cy.get('input[data-name="exists"]');

  static failurePolicyDropDown = () => cy.get("button.js-failure-policy");

  static failPolicy = () => cy.get('li.js-dropdown-item[data-value="Fail"]');

  static nonePolicy = () => cy.get('li.js-dropdown-item[data-value="None"]');

  static neutralPolicy = () => cy.get('li.js-dropdown-item[data-value="Neutral"]');

  static softFailPolicy = () => cy.get('li.js-dropdown-item[data-value="SoftFail"]');

  static redirectToggle = () => cy.get(".eas-toggle-switcher__slider");

  static redirectInput = () => cy.get("#redirect");

  static errorContainer = () => cy.get("#toggle-error-container");

  static warningContainer = () => cy.get(".warning-container");

  static recordStatusContainerSuccess = () => cy.get(".spf-lookup-box .text-status-success");

  static recordStatusContainerError = () => cy.get(".spf-lookup-box .text-status-error");

  static spfRecordContainer = () => cy.get("#generated-spf-record");

  static spfHostName = () => cy.get("#spf-host");

  static generateButton = () => cy.get(".js-spf-generator-submit-form-btn");
}
