// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Web3 from 'web3';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// add your api keys below
const firebaseConfig = {
  apiKey: "AIzaSyAQ1NGJ2WmCZBHiH-IU3lk90b76UFU9OLY",
  authDomain: "hotel-booking-33562.firebaseapp.com",
  projectId: "hotel-booking-33562",
  storageBucket: "hotel-booking-33562.appspot.com",
  messagingSenderId: "125700564668",
  appId: "1:125700564668:web:7ed98199d06eb66e54d2b9",
  measurementId: "G-SRKPPW5ZBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
