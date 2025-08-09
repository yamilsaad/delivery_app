// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq5f3_7Y5VY6BJahcD_6pOdebFx0oEjUk",
  authDomain: "sorteador-ipv.firebaseapp.com",
  projectId: "sorteador-ipv",
  storageBucket: "sorteador-ipv.firebasestorage.app",
  messagingSenderId: "671825976074",
  appId: "1:671825976074:web:4ddc789d02c9eca43bf8f3",
  measurementId: "G-YYWZ0VL5CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
