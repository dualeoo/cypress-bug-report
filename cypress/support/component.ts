// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
console.log('before import cypress/react');
import { mount } from 'cypress/react';
// import { mount } from 'cypress/react/dist/cypress-react.cjs';

// Alternatively you can use CommonJS syntax:
// require('./commands')
// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
Cypress.Commands.add('mount', mount);

// import '../../src/js/initializers/development';
// import '../../src/js/initializers/console';
// import '../../src/js/initializers/lodash';
// import '../../src/js/initializers/superagent';
// import '../../src/js/initializers/quill';
// import '../../src/js/initializers/react-style';
// import '../../src/js/initializers/react-chart';
// import '../../src/js/lib/store';
// import '../../src/js/initializers/local-storage';

console.log('after initialize');
// Example use:
// cy.mount(<MyComponent />)
