import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Card from '../../components/Card/Card'
import './Home.css';
import homeImage from '../../assets/home.jpg';
import heart from '../../assets/heart.png';
import cardiac from '../../assets/cardiac.png';
import result from '../../assets/result.png';

const Home = () => {

  return (
    <div className="HomeContainer">
      <NavBar />
      <div className="HomeContent">
        <img className="HomeImage" src={homeImage} alt="Home" />
        <div className="centered"><p>Medical Cardiac Sensor</p></div>
        <div className='cardContainer'>
          <Card
              title="Monitor Your Heartbeat"
              content="Track your heart rate in real time and ensure your well-being with precision."
              imageUrl={heart}
              imageAlt="Heart monitoring"
          />
          <Card
              title="Personalized Analysis"
              content="Simply place your finger on the sensor, and we’ll handle the rest with advanced insights."
              imageUrl={cardiac}
              imageAlt="Cardiac analysis"
          />
          <Card
              title="Comprehensive Results"
              content="Store your health data securely and get tailored advice from our AI assistant."
              imageUrl={result}
              imageAlt="Result summary"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
