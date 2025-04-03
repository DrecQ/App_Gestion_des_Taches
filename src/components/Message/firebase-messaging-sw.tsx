// Import Firebase modules (correct syntax)
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw"; // Correction ici
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1FwfnwuzneaQ9ZLpfVaIB6l6Chcjkuqg",
    authDomain: "gestion-tache-d0969.firebaseapp.com",
    projectId: "gestion-tache-d0969",
    storageBucket: "gestion-tache-d0969.appspot.com",
    messagingSenderId: "222484882598",
    appId: "1:222484882598:web:35e27ce45c32bea606c067",
    measurementId: "G-650XL4GV4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Messaging
const messaging = getMessaging(app);

// Handle background messages (dans votre service worker)
onBackgroundMessage(messaging, (payload) => {
    console.log('Received background message ', payload);
});