import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/Login';
import SignUp from './pages/Register';
import Edit from './pages/Edit';
import Preview from './pages/Preview';

function App () {
  // set default value for token
  let lstoken = null;
  if (localStorage.getItem('token')) {
    lstoken = JSON.parse(localStorage.getItem('token'));
  }

  const [token, setToken] = React.useState(lstoken);
  const storeToken = (token) => {
    setToken(token);
    localStorage.setItem('token', JSON.stringify(token));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn setTokenFunction={storeToken} token={token} />} />
        <Route path="dashboard" element={<Dashboard setTokenFunctionD={storeToken} tokenD={token} />} />
        <Route path="edit/:slide" element={<Edit token={token}/>} />
        <Route path="preview/:slide" element={<Preview token={token}/>} />
        <Route path="register" element={<SignUp setTokenFunction={storeToken} token={token} />} />
        <Route path="login" element={<SignIn setTokenFunction={storeToken} token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
