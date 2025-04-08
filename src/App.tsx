import React, { useEffect } from 'react';
import './App.css';
import Home from './components/Layout/Home';
import TodoApp from './components/Layout/SideBar';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
// import notifee, { AndroidImportance } from '@notifee/react-native'; // notifee est importé mais non utilisé

function NotificationHandler() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM Message (foreground):', remoteMessage);
      Alert.alert('New FCM Message', JSON.stringify(remoteMessage.notification));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const getInitialMessage = async () => {
      const initialMessage = await messaging().getInitialNotification();
      if (initialMessage) {
        console.log('Notification which opened the app', initialMessage);
        Alert.alert('Notification which opened the app', JSON.stringify(initialMessage.notification));
      }
    };

    getInitialMessage();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        messaging()
          .getToken()
          .then(fcmToken => {
            if (fcmToken) {
              console.log('Your FCM Token:', fcmToken);
              // Send fcmToken to your server
            }
          });
      }
    };

    requestUserPermission();
  }, []);

  return null;
}

const App = () => {
  return (
    <div className="App">
      <NotificationHandler /> {/* Ajout du composant NotificationHandler */}
      <TodoApp />
      <Home />
    </div>
  );
};

export default App;