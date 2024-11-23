import React from "react";
import './CardLogin.css';
import Login from '../../features/Login/Login'; 

function CardLogin({ title, description, imageUrl }) {
  return (
    <div className="CardLogin">
      <h2>{title}</h2>
      <p>{description}</p>
      <Login />
      <p>Don't have an account?<button type="submit">Sign In</button></p>
    </div>
  );
}

export default CardLogin;
