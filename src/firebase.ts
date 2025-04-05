// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';


  const firebaseConfig = {
  apiKey: "AIzaSyAUl0-w6bDNidbnpuHrRjehpBn-nendIys",
    authDomain: "gestion-taches-da5b2.firebaseapp.com",
    projectId: "gestion-taches-da5b2",
    storageBucket: "gestion-taches-da5b2.firebasestorage.app",
    messagingSenderId: "376187320106",
    appId: "1:376187320106:web:aa49f23ebd46f78b47d053",
    measurementId: "G-NV4XX5QP45"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const vapidKey = "BM7NUMha-nLCJLSwxNUHuent3lmyGl9oL0tgKVVFiIdmfFKxTEY5qrzR7AWeRdWB7JDzCDq_Qt0eYuG6PR-AAaY";
export const messaging = getMessaging(app); // 👈 ajouter la messagerie

