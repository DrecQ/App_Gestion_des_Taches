// src/App.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import TaskManager from "./components/TaskManager";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Pour éviter un flash

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {!user ? <Auth /> : <TaskManager />}
    </>
  );
};

export default App;
