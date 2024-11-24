import React from 'react';
import './NavBarLogged.css';
import '../Button/MedicalButton.css';
import logo from '../../assets/logomedical.png';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();

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
        Aqui va tu perfil
      </div>
    </div>
  );
};

export default NavBar;
