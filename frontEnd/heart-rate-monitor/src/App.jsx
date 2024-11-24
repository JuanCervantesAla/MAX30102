import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Main from './pages/Main/Main';
import LogIn from './pages/Log-In/Log-In';
import Register from './pages/Regis-Ter/Regis-Ter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/LogIn" element={<LogIn />} /> 
        <Route path="/Register" element={<Register />} /> 
        <Route path="/Main" element={<Main />} /> 
      </Routes>
    </Router>
  );
}

export default App;