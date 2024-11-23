import React from 'react';
import './Log-In.css';
import pattern from '../../assets/pattern.jpg';
import Card from '../../components/CardLogin/CardLogin'
import { Car } from 'lucide-react';
import Login from '../../features/Login/Login';
import NavBar from '../../components/NavBar/NavBar'

const LogIn = () => {
  return (
    <div className="Log-InContainer">
      <NavBar/>
      <div className="left">
        <Login />
      </div>
      <div className="right">
        <img src={pattern} alt="Pattern" />
      </div>
    </div>
  );
};

export default LogIn;
