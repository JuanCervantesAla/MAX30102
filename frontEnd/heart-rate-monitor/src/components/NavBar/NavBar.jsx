import React from 'react';
import './NavBar.css';
import '../Button/MedicalButton.css';

const NavBar = () => {
  return (
    <div className='NavBarContainer'>
      <div className='NavBarLeft'>
        <p className='title'>Heart4All</p>
      </div>
      <div className='NavBarRight'>
        <button className='medical-btn medical-btn-primary'>Sign In</button>
        <button className='medical-btn medical-btn-secondary'>Login</button>
      </div>
    </div>
  );
};

export default NavBar;

