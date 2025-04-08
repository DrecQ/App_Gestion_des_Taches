// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

const messaging = getMessaging();

export const requestForToken = () => {
    // The method getToken(): Promise<string> allows FCM to use the VAPID key credential
    // when sending message requests to different push services
    return getToken(messaging, { vapidKey: `BO1x0u12HcZN7SBK3p11gtMYOa7HmwyA8Wjwl8sgu_AF8EkO6zRTNOJzPFYp20Ewss3OdNskszr111MeuA1m0mc` }) //to authorize send requests to supported web push services
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);

                if (localStorage.getItem('fcmToken') && currentToken !== localStorage.getItem('fcmToken')) {
                    localStorage.setItem('fcmToken', currentToken);

                }

                else if (!localStorage.getItem('fcmToken')) {
                    localStorage.setItem('fcmToken', currentToken);

                }

            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export function requestPermission() {
    return messaging.requestPermission()
        .then(() => {
            console.log('Notification permission granted.');
            return messaging.getToken();
        })
        .catch((error) => {
            console.error('Unable to get permission to notify.', error);
        });
}

export function onMessageListener() {
    return new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
}