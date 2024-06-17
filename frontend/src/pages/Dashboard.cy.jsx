import React from 'react'
import Dashboard from './Dashboard'
import { MemoryRouter } from 'react-router-dom'; 

describe('<Dashboard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MemoryRouter><Dashboard /></MemoryRouter>)
  })
})