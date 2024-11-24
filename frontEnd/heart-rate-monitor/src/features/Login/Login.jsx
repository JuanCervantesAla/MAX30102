import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/Main');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      goToHome();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Log - In</h2>
      <form onSubmit={handleLogin}>
        <div>
          <p className="login-label">Email:</p>
          <input
            className="login-input"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="login-label">Password:</p>
          <input
            className="login-input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">Login</button>
        <p className="login-signin-link">
          Don't have an account? 
          <button className="login-signin-link-button" type="button">Sign In</button>
        </p>
      </form>
    </div>
  );
}

export default Login;
