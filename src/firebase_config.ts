// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKBPmRqtiwszFxhQi3zwjzQ2Nn6OLwlW8",
  authDomain: "gestiondestaches-9e332.firebaseapp.com",
  projectId: "gestiondestaches-9e332",
  storageBucket: "gestiondestaches-9e332.firebasestorage.app",
  messagingSenderId: "444578129172",
  appId: "1:444578129172:web:c55b69ffb776163ba48e01",
  measurementId: "G-1XBPWBTBJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
