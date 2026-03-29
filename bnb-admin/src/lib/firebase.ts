import {
  initializeFirebase,
  FirebaseAuth,
  FirebaseDatabase,
  FirestoreDatabase,
} from "refine-firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ1NGJ2WmCZBHiH-IU3lk90b76UFU9OLY",
  authDomain: "hotel-booking-33562.firebaseapp.com",
  projectId: "hotel-booking-33562",
  storageBucket: "hotel-booking-33562.appspot.com",
  messagingSenderId: "125700564668",
  appId: "1:125700564668:web:7ed98199d06eb66e54d2b9",
  measurementId: "G-SRKPPW5ZBJ"
};

export const firebaseApp = initializeFirebase(firebaseConfig);

export const firebaseAuth = new FirebaseAuth();

export const firestoreDatabase = new FirestoreDatabase();

export const firebaseDatabase = new FirebaseDatabase();
