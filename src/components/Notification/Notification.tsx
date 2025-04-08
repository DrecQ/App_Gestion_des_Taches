import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { onMessageListener, requestPermission } from '../../firebase/firebase';
import { FirebaseMessagePayload } from '../../types/types';

function Notification() {
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    // Demander la permission à l'utilisateur
    requestPermission();

    // Fonction pour souscrire à la notification
    const subscribeToNotifications = async () => {
      try {
        const payload = await onMessageListener();  // Attendre la réponse de la promesse

        // Cast explicite du type de payload
        const typedPayload = payload as FirebaseMessagePayload;

        setNotification({
          title: typedPayload.notification.title,
          body: typedPayload.notification.body,
        });

        // Afficher une notification toast
        toast.success(`${typedPayload.notification.title}: ${typedPayload.notification.body}`, {
          duration: 60000,
          position: 'top-right',
        });
      } catch (err) {
        console.error('Erreur lors de la réception de la notification: ', err);
      }
    };

    subscribeToNotifications();

    // Retourner une fonction de nettoyage pour annuler l'abonnement
    return () => {
      // Si nécessaire, ajoutez ici le nettoyage d'abonnement Firebase
    };
  }, []); // Le tableau vide [] signifie que ce code ne s'exécutera qu'une seule fois après le montage du composant

  return (
    <div>
      <Toaster />
      {/* Affichage de la notification */}
      <div>
        <h1>{notification.title}</h1>
        <p>{notification.body}</p>
      </div>
    </div>
  );
}

export default Notification;
