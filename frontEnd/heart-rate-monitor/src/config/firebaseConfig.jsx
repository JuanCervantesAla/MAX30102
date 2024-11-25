import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';


const firebaseConfig = {
  apiKey: "AIzaSyBX_YlyQwySJbOZyQ3pFdnCpC0IJ4N-YzY",
  authDomain: "heart4all.firebaseapp.com",
  projectId: "heart4all",
  storageBucket: "heart4all.firebasestorage.app",
  messagingSenderId: "937937871695",
  appId: "1:937937871695:web:6fffac05cb47b70c4f9b3a",
  measurementId: "G-BZPBZ591M7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { auth, db, messaging };

