// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAUl0-w6bDNidbnpuHrRjehpBn-nendIys",
  authDomain: "gestion-taches-da5b2.firebaseapp.com",
  projectId: "gestion-taches-da5b2",
  storageBucket: "gestion-taches-da5b2.firebasestorage.app",
  messagingSenderId: "376187320106",
  appId: "1:376187320106:web:aa49f23ebd46f78b47d053",
  measurementId: "G-NV4XX5QP45"
});

// Configuration de la messagerie
const messaging = firebase.messaging();

// Demande de permission et récupération du token
messaging.getToken({ vapidKey: "BM7NUMha-nLCJLSwxNUHuent3lmyGl9oL0tgKVVFiJDzCDq_Qt0eYuG6PR-AAaY" })
  .then((currentToken) => {
    if (currentToken) {
      console.log("Token FCM:", currentToken);
      // Envoie ce token à ton serveur pour pouvoir envoyer des notifications
    } else {
      console.log("Pas de token FCM disponible");
    }
  })
  .catch((err) => {
    console.log("Erreur lors de la récupération du token :", err);
  });

// Gestion de la notification en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Notification reçue:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
