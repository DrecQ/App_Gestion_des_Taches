import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { onMessageListener, requestPermission } from '../../firebase/firebase';
import { FirebaseMessagePayload } from '../../types/types';

function Notification() {
  const [notification, setNotification] = useState<{ title: string; body: string }>({
    title: '',
    body: '',
  });

  useEffect(() => {
    // Demander la permission à l'utilisateur pour les notifications
    requestPermission();
  
    // Souscrire à la notification en utilisant le onMessageListener
    const subscribeToMessages = () => {
      onMessageListener()
        .then((payload: FirebaseMessagePayload) => {
          console.log("Received message: ", payload);  // Ajout d'un log pour vérifier les messages
          setNotification({
            title: payload.notification?.title || 'No title',
            body: payload.notification?.body || 'No body',
          });
  
          // Afficher une notification toast
          toast.success(`${payload.notification?.title}: ${payload.notification?.body}`, {
            duration: 60000,
            position: 'top-right',
          });
        })
        .catch((error) => {
          console.error('Error receiving message: ', error);
        });
    };
  
    // Souscrire aux messages lorsque le composant est monté
    subscribeToMessages();
  
    return () => {
      // Aucune fonction de nettoyage n'est nécessaire ici pour onMessageListener
    };
  }, []);

  return (
    <div>
      <Toaster />
      {/* Affichage de la notification dans le composant */}
      <div>
        <h1>{notification.title}</h1>
        <p>{notification.body}</p>
      </div>
    </div>
  );
}

export default Notification;
