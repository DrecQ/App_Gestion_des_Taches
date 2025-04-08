import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID!,
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Initialisation Firebase Messaging
const messaging = getMessaging(app);

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker enregistré avec le scope :', registration.scope);
    })
    .catch((error) => {
      console.error('Échec de l’enregistrement du Service Worker :', error);
    });
} else {
  console.warn('Service Worker non supporté par ce navigateur.');
}

// Demander la permission pour les notifications + récupérer le token FCM
export const requestPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permission de notification refusée.');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (!token) {
      console.warn('Impossible d’obtenir le token de messagerie.');
      return null;
    }

    console.log('Token FCM récupéré :', token);
    return token;
  } catch (error) {
    console.error(' Erreur lors de la demande de permission :', error);
    return null;
  }
};

// Écoute des messages reçus quand l’app est au premier plan
export const onMessageListener = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        console.log(' Message reçu en foreground :', payload);
        resolve(payload);
      });
    } catch (error) {
      console.error(' Erreur dans le listener :', error);
      reject(error);
    }
  });
};
