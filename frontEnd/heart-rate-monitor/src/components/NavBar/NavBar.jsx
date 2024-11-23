import React from 'react';
import './NavBar.css';
import '../Button/MedicalButton.css';
import logo from '../../assets/logomedical.png';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();

  const goToLogIn = () => {
      navigate('/LogIn');
  };

  const goToRegister = () => {
    navigate('/Register');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className='NavBarContainer'>
      <div className='NavBarLeft'>
        <img className='logo' src={logo} alt="Heart4All Logo" />
        <p className='title' onClick={goToHome}>Heart4All</p>
      </div>
      <div className='NavBarRight'>
        <button className='medical-btn medical-btn-primary' onClick={goToRegister}>Sign In</button>
        <button className='medical-btn medical-btn-secondary' onClick={goToLogIn}>Login</button>
      </div>
    </div>
  );
};

export default NavBar;
