// src/components/NotificationSetup.tsx
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase"; // Assure-toi d'importer correctement ton FCM messaging

const NotificationSetup = () => {
  useEffect(() => {
    // Demander la permission pour recevoir les notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permission accordée ✅");

        // Obtenir le token FCM
        getToken(messaging, { vapidKey: "BM7NUMha-nLCJLSwxNUHuent3lmyGl9oL0tgKVVFiIdmfFKxTEY5qrzR7AWeRdWB7JDzCDq_Qt0eYuG6PR-AAaY" }).then((currentToken) => {
          if (currentToken) {
            console.log("Token FCM : ", currentToken); // Affichage du token FCM dans la console
            // Ici tu pourrais stocker ce token dans Firestore ou l'envoyer à ton backend pour l'utiliser
          } else {
            console.log("Aucun token disponible.");
          }
        }).catch((err) => {
          console.error("Erreur lors de la récupération du token :", err);
        });
      } else {
        console.log("Permission refusée ❌");
      }
    });

    // Écouter les notifications quand l'application est en premier plan
    onMessage(messaging, (payload) => {
      console.log("Notification reçue en premier plan :", payload);
      alert(`🔔 ${payload.notification?.title} - ${payload.notification?.body}`);
    });
  }, []);

  return null; // Ce composant ne rend rien à l'écran, il s'occupe uniquement de la configuration des notifications
};

export default NotificationSetup;
