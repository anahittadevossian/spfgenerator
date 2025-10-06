declare namespace Cypress {
  interface Chainable<Subject> {
    safeFixture(fixturePath: string, options?: Partial<Timeoutable>): Chainable<Subject>;
    
    clickOutside(): Chainable<Subject>;
  }
}

declare namespace Cypress {
  interface Chainable {
    typeDomain(domain: string): Chainable<void>;
    addInclude(include: string, index?: number): Chainable<void>;
    addIPv4(ip: string): Chainable<void>;
    addIPv6(ip: string): Chainable<void>;
    selectFailPolicy(policy: "Fail" | "SoftFail" | "None" | "Neutral"): Chainable<void>;
    generateSPF(): Chainable<void>;
  }
}