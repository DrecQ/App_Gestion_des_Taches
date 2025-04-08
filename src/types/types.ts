import { onMessageListener } from "../firebase/firebase";

// Todo interface
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
  dueDate?: string;
  dueTime?: string;
  addedBy: string;
  createdAt?: number;
  updatedAt?: number;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  fcmTokens?: string[];
}

// Shared user for collaborative tasks
export interface SharedUser {
  id: string;
  email: string;
  name: string;
  permission: 'read' | 'write';
  sharedAt: number;
}

// types.ts
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: Date | string | number;
  type?: 'info' | 'warning' | 'error' | 'success' | 'task' | 'share';
  icon?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}


// Firebase payload when receiving a push notification
export interface FirebaseMessagePayload {
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: {
    [key: string]: string;
  };
}

// Used internally in the React app to display and handle notifications
export interface AppNotification {
  id?: string;
  title: string;
  body: string;
  read?: boolean;
  timestamp?: Date;
  type?: 'info' | 'warning' | 'error' | 'success' | 'task' | 'share';
  icon?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}

// Optional: if you're saving notifications in Firebase
export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'error' | 'success' | 'task' | 'share';
  icon?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
}

// Firebase base document shape if you're using common fields
export interface FirebaseDocument {
  id: string;
  createdAt: number;
  updatedAt: number;
}

interface NotificationPayload {
  notification?: {
    title: string;
    body: string;
  };
  // autres champs si nécessaire
}
