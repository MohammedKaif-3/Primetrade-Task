import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgetPassword from './pages/ForgetPassword';
import ResetPasswordOtp from './pages/ResetPassword';
import Profile from './pages/Profile';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/login' element={<LoginPage/ >}></Route>
        <Route path='/register' element={<RegisterPage/ >}></Route>
        <Route path='/reset-password' element={<ForgetPassword />}></Route>
        <Route path="/reset-password-otp" element={<ResetPasswordOtp />} />
      </Routes>
    </div>
  );
}

export default App;
