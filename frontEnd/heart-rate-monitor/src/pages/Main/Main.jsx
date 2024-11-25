import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBarLogged/NavBarLogged';
import { auth, db } from '../../config/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import './Main.css';
import Graph from '../../components/BPMGauge/BPMGauge.jsx';
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor';
import { GoogleGenerativeAI } from '@google/generative-ai';  

const Main = () => {
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bpm, setBpm] = useState(0);
  const [age, setAge] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const lowBpmThreshold = 60;

  
  const genAI = new GoogleGenerativeAI('AIzaSyBPUpcwdmlPLkXP-VU5gk5pQEnk3WajXLA');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }

    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const contactsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setContacts(contactsList);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const analyzeBpm = async () => {
    if (bpm && age) {
      try {
        const prompt = `Analyze the BPM of ${bpm} and age ${age}, and provide a recommendation for fitness or health, make the response in 100 words, make some suggestions`;
  
        const result = await model.generateContent(prompt);
  
        
        let recommendation = result.response.text();
  
        
        recommendation = recommendation
          .replace(/\*/g, '');
          
  
        setAnalysisResult({
          status: 'Success',
          recommendation: recommendation,
        });
  
      } catch (error) {
        console.error('Error generating content with Google Generative AI:', error);
        setAnalysisResult({
          status: 'Error',
          recommendation: 'There was an issue with the analysis request.',
        });
      }
    }
  };  

  const handleAddContact = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'contacts'), {
          userId: user.uid,
          name: contactName,
          phone: contactPhone,
          email: user.email,
          timestamp: new Date(),
        });
        setContactName('');
        setContactPhone('');
        alert('Contact added successfully!');
      }
    } catch (error) {
      console.error('Error adding contact: ', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <h1>Hi {email}</h1>
            <HeartRateMonitor setBpm={setBpm} />
            <Graph bpm={bpm} />
            {bpm < lowBpmThreshold && (
              <p className="alert">ALERT: BPM is too low!</p>
            )}
          </div>
        );
        case 'profile':
          return (
            <div className="ai-analysis-container">
              <h2 className="ai-analysis-title">IA Analysis</h2>
              <div className="ai-analysis-content">
                <div className="input-group">
                  <label>Enter your average BPM:</label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="input-field"
                    placeholder="BPM"
                  />
                </div>
                <div className="input-group">
                  <label>Enter your age:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="input-field"
                    placeholder="Age"
                  />
                </div>
                <button onClick={analyzeBpm} className="analyze-btn">
                  Analyze
                </button>
              </div>
              
              {analysisResult && (
                <div className="analysis-result">
                  <p className="status">{analysisResult.status}</p>
                  <p className="recommendation">{analysisResult.recommendation}</p>
                </div>
              )}
            </div>
          );
      case 'contacts':
        return (
          <div className="contacts-container">
            <h2>Emergency Contacts</h2>
            <p>Add emergency contacts, they'll get an alert message if your bpm is low</p>
            <h3>My Contacts</h3>
            <ul className="contacts-list">
              {contacts.length === 0 ? (
                <p>No contacts available</p>
              ) : (
                contacts.map((contact) => (
                  <li key={contact.id} className="contact-item">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-phone">{contact.phone}</span>
                  </li>
                ))
              )}
            </ul>
            <div className="contact-form">
              <h4>Add New Contact</h4>
              <form>
                <div className="input-group">
                  <label>Name:</label>
                  <input 
                    type="text" 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)} 
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="input-group">
                  <label>Phone:</label>
                  <input 
                    type="text" 
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)} 
                    placeholder="Enter contact phone number"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleAddContact} 
                  className="add-contact-btn"
                >
                  Add Contact
                </button>
              </form>
            </div>
          </div>
        );
      case 'howToUse':
        return <p>How to use this application?</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mainContainer">
      <NavBar />
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Measurements
        </button>
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          IA Analysis
        </button>
        <button
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Main;
