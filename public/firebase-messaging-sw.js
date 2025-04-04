const { default: firebase } = require("firebase/compat/app");

// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDKBPmRqtiwszFxhQi3zwjzQ2Nn6OLwlW8",
    authDomain: "gestiondestaches-9e332.firebaseapp.com",
    projectId: "gestiondestaches-9e332",
    storageBucket: "gestiondestaches-9e332.firebasestorage.app",
    messagingSenderId: "444578129172",
    appId: "1:444578129172:web:c55b69ffb776163ba48e01",
    measurementId: "G-1XBPWBTBJP"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});