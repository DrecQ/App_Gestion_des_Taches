// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1FwfnwuzneaQ9ZLpfVaIB6l6Chcjkuqg",
    authDomain: "gestion-tache-d0969.firebaseapp.com",
    projectId: "gestion-tache-d0969",
    storageBucket: "gestion-tache-d0969.firebasestorage.app",
    messagingSenderId: "222484882598",
    appId: "1:222484882598:web:35e27ce45c32bea606c067",
    measurementId: "G-650XL4GV4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const requestPermission = () => {

    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {

        if (permission === "granted") {

            console.log("Notification User Permission Granted.");
            return getToken(messaging, { vapidKey: `Notification_key_pair` })
                .then((currentToken) => {

                    if (currentToken) {

                        console.log('Client Token: ', currentToken);
                    } else {

                        console.log('Failed to generate the app registration token.');
                    }
                })
                .catch((err) => {

                    console.log('An error occurred when requesting to receive the token.', err);
                });
        } else {

            console.log("User Permission Denied.");
        }
    });

}

requestPermission();

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    }); 