import React from 'react';
import './Regis-Ter.css';
import pattern from '../../assets/pattern2.webp';
import RegisterV from '../../features/Register/Register';
import NavBar from '../../components/NavBar/NavBar';

const Register = () => {
  return (
    <div className="register-container">
      <NavBar />
      <div className="login-section">
        <img src={pattern} alt="Pattern" />
      </div>
      <div className="image-section">
        <RegisterV />
      </div>
    </div>
  );
};

export default Register;
