import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { requestPermission, onMessageListener } from '../../firebase';
import TodoApp from '../Layout/SideBar';

// Définir une interface pour le payload
interface FirebaseMessagePayload {
    notification?: {
        title?: string;
        body?: string;
    };
    data?: any; // Vous pouvez définir un type plus spécifique pour les données si nécessaire
    // ... autres propriétés du payload ...
}

function Notification() {
    const [notification, setNotification] = useState({ title: '', body: '' });

    useEffect(() => {
        requestPermission();

        onMessageListener()
            .then(unsubscribe => {
                if (unsubscribe && typeof unsubscribe === 'function') {
                    const handlePayload = (payload: FirebaseMessagePayload) => { // Type specified here.
                        setNotification({
                            title: payload?.notification?.title || '',
                            body: payload?.notification?.body || '',
                        });
                        toast.success(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
                            duration: 60000,
                            position: 'top-right',
                        });
                    };

                    unsubscribe(handlePayload); //Pass the handler to the unsubscribe function.
                    return () => {
                        if (unsubscribe) {
                            unsubscribe(); //Call the function to unsubscribe.
                        }
                    };
                } else {
                    console.error('onMessageListener did not return a valid unsubscribe function.');
                    return () => { }; // return an empty unsubscribe function
                }
            })
            .catch(error => {
                console.error('Error listening for messages:', error);
                return () => { }; // return an empty unsubscribe function
            });

        // useEffect expects a cleanup function or nothing.
        return undefined; // or return () => {};

    }, []);

    return (
        <div>
            <TodoApp />
        </div>
    );
}

export default Notification;