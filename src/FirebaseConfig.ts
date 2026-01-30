// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBlToovihIhYpqK8IJ7FPB0snigzZydKjQ",
  authDomain: "miniprojekt-paw.firebaseapp.com",
  projectId: "miniprojekt-paw",
  storageBucket: "miniprojekt-paw.firebasestorage.app",
  messagingSenderId: "965213929305",
  appId: "1:965213929305:web:7bb95fd723f36df8bf9648",
  measurementId: "G-BC77H5PMEL"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(fireApp);
export const fireDb = getFirestore(fireApp);
export const auth = getAuth(fireApp);