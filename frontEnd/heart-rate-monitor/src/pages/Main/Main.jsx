import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBarLogged/NavBarLogged';
import { auth, db } from '../../config/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import './Main.css';
import Graph from '../../components/BPMGauge/BPMGauge.jsx';
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor';

const Main = () => {
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bpm, setBpm] = useState(0); // Estado para almacenar el BPM

  const bpmLowDuration = 0;
  const lowBpmThreshold = 60;
  const lowBpmTimeLimit = 1 * 60 * 1000;

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

  useEffect(() => {
    let bpmLowTimer = null;

    if (bpm < lowBpmThreshold) {
      if (bpmLowTimer === null) {
        bpmLowTimer = Date.now();
      }
    } else {
      bpmLowTimer = null;
    }
  }, [bpm]);

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
            <HeartRateMonitor setBpm={setBpm} /> {/* Actualiza BPM */}
            <Graph bpm={bpm} /> {/* Pasa BPM al Graph */}
            <p>Current BPM: {bpm}</p>
            {bpmLowDuration >= lowBpmTimeLimit && <p>ALERT: BPM is low for too long!</p>}
          </div>
        );
      case 'profile':
        return <p>Perfil del usuario: {email}</p>;
      case 'contacts':
        return (
          <div>
            <p>Emergency contacts</p>
            <p>Add emergency contacts, they'll get an alert message if your bpm are low</p>
            <p>Mis contactos:</p>
            <ul>
              {contacts.length === 0 ? (
                <p>No contacts available</p>
              ) : (
                contacts.map((contact) => (
                  <li key={contact.id}>
                    {contact.name} - {contact.phone}
                  </li>
                ))
              )}
            </ul>
            <form>
              <p>Name: <input value={contactName} onChange={(e) => setContactName(e.target.value)} /></p>
              <p>Phone: <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></p>
            </form>
            <button onClick={handleAddContact}>Add a contact</button>
          </div>
        );
      case 'howToUse':
        return <p>Como usar</p>;
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
          IA Analisys
        </button>
        <button
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
        <button
          className={`tab ${activeTab === 'howToUse' ? 'active' : ''}`}
          onClick={() => setActiveTab('howToUse')}
        >
          How to Use?
        </button>
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Main;

