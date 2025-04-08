// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js');

// ✅ Configuration Firebase avec les VRAIES VALEURS (pas de process.env ici)
const firebaseConfig = {
  apiKey: "AIzaSyCi5aj3n6dZ4dZMb-whwkoA5u0hXllFyds",
  authDomain: "gestiontachenotifs.firebaseapp.com",
  projectId: "gestiontachenotifs",
  storageBucket: "gestiontachenotifs.firebasestorage.app",
  messagingSenderId: "986544092877",
  appId: "1:986544092877:web:471f92268182cf6f08db84",
  measurementId: "G-K8Q9YEMRGY"
};

// Initialiser Firebase
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage(function(payload) {
  console.log('📩 Message en arrière-plan reçu : ', payload);
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "Nouveau message",
    icon: "/firebase-logo.png",
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
