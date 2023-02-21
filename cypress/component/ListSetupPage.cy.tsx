// import ListSetupPage from '../../src/js/components/List/setup-page/';
// describe('ListSetupPage.cy.tsx', () => {
//   it('playground', () => {
//     cy.mount(ListSetupPage);
//   });
// });

import React from 'react';

console.log('React in test', React);

it('uses custom text for the button label', () => {
  cy.mount(<button>Click me!</button>);
  cy.get('button').should('contains.text', 'Click me!');
});
