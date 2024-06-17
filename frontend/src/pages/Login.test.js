import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import SignIn from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

test('renders sign in text', () => {
  render(
    <MemoryRouter>
      <SignIn/>
    </MemoryRouter>
    // <BrowserRouter>
    //   <Routes>   
    //     <Route path="login" element={<SignIn setTokenFunction={storeToken} token={token} />} />
    //   </Routes>
    // </BrowserRouter>
  );
  console.log(module.parent.filename);
  // console.log(__filename)
  // Use a function to match the text flexibly
  // const signInText = screen.getByText('Presto');
  // expect(signInText).toBeInTheDocument();
  expect(screen.getByTestId('abc')).toBeInTheDocument();
});
