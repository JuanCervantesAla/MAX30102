import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import '../Login/Login.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registered successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Register</h2>
      <form onSubmit={handleRegister}>
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
        <button className="login-button" type="submit">Sign Up</button>
        <p className="login-signin-link">
          Already have an account? 
          <button className="login-signin-link-button" type="button">Sign In</button>
        </p>
      </form>
    </div>
  );
}

export default Register;
