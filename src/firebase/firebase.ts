// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app); // Initialize messaging service

export const requestPermission = async (): Promise<string | null> => {
  try {
    console.log("Requesting User Permission...");
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("Notification User Permission Granted.");
      const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
      
      if (!vapidKey) {
        console.error("VAPID key is missing in environment variables");
        throw new Error("VAPID key is missing in environment variables");
      }

      const currentToken = await getToken(messaging, { vapidKey });
      
      if (currentToken) {
        console.log("Client Token: ", currentToken);
        return currentToken;
      } else {
        console.error("Failed to generate the app registration token.");
        return null;
      }
    } else {
      console.error("User Permission Denied.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred when requesting to receive the token:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
    
    // Il n'est pas nécessaire de passer deux arguments ici. 
    // Le gestionnaire d'erreur se gère directement dans le premier paramètre de onMessage.
  });
  
// Function to retrieve the FCM token (optional if you want to use it separately)
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key is missing in environment variables");
      throw new Error("VAPID key is missing in environment variables");
    }
    
    const currentToken = await getToken(messaging, { vapidKey });
    return currentToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
