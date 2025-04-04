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

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  fcmTokens?: string[];
}

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  permission: 'read' | 'write';
  sharedAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'error' | 'success' | 'task' | 'share';
  icon?: string;
  data?: {
    url?: string;
  };
}

export interface FirebaseDocument {
  id: string;
  createdAt: number;
  updatedAt: number;
}

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