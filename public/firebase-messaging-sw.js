// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyD1FwfnwuzneaQ9ZLpfVaIB6l6Chcjkuqg",
    authDomain: "gestion-tache-d0969.firebaseapp.com",
    projectId: "gestion-tache-d0969",
    storageBucket: "gestion-tache-d0969.firebasestorage.app",
    messagingSenderId: "222484882598",
    appId: "1:222484882598:web:35e27ce45c32bea606c067",
    measurementId: "G-650XL4GV4D"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png', // Chemin vers l'icône de votre notification
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});