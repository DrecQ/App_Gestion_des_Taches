// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const requestPermission = () => {

  console.log("Requesting User Permission......");
  Notification.requestPermission().then((permission) => {

    if (permission === "granted") {

      console.log("Notification User Permission Granted."); 
      return getToken(messaging, { vapidKey: `Notification_key_pair` })
        .then((currentToken: any) => {

          if (currentToken) {

            console.log('Client Token: ', currentToken);
          } else {
            
            console.log('Failed to generate the app registration token.');
          }
        })
        .catch((err: any) => {

          console.log('An error occurred when requesting to receive the token.', err);
        });
    } else {

      console.log("User Permission Denied.");
    }
  });

}

requestPermission();

function getToken(messaging: any, arg1: { vapidKey: string; }) {
  throw new Error("Function not implemented.");
}


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
}); 