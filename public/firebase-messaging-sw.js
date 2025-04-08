import { onMessageListener } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { NotificationPayload} from '../../types/types';

// interface NotificationPayload {
//   notification?: {
//     title: string;
//     body: string;
//   };
//   // autres champs si nécessaire
// }

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { onMessageListener } from "../../firebase/firebase";

// Interface pour le payload de la notification
interface NotificationPayload {
  notification?: {
    title: string;
    body: string;
  };
}

const Notification = () => {
  const [notificationState, setNotificationState] = useState<{ title?: string; body?: string }>({});

  useEffect(() => {
    // Utilisation correcte de onMessageListener pour écouter les messages
    function handleMessage(payload: NotificationPayload) {
      setNotificationState({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });

      if (payload?.notification) {
        toast.success(`${payload.notification.title}: ${payload.notification.body}`, {
          duration: 60000,
          position: 'top-right',
        });
      }
    }

    // Appel de onMessageListener
    const unsubscribe = onMessageListener().then((payload: NotificationPayload) => {
      handleMessage(payload);
    });

    // Nettoyage
    return () => {
      unsubscribe.catch(err => console.error('Error during unsubscription:', err));
    };
  }, []);

  return null; // ou ton JSX si tu veux afficher quelque chose
};

export { Notification };

    // On s'abonne aux notifications
    const unsubscribe = onMessageListener().then(handleMessage).catch((err) => {
      console.log("Error receiving message: ", err);
    });

    // Fonction de nettoyage pour la désinscription ou autres actions de nettoyage
    return () => {
      unsubscribe?.catch((err) => {
        console.log("Error unsubscribing from message listener: ", err);
      });
    };
  }, []);

  return null; // ou votre JSX
};

export default Notification;
