import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Task } from "../types/Task";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(tasksRef, where("userId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === "" || dueDate === "") return;
    await addDoc(tasksRef, {
      title: newTask,
      dueDate,
      completed: false,
      userId: auth.currentUser?.uid,
    });
    setNewTask("");
    setDueDate("");
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  return (
    <div>
      <h2>Mes Tâches</h2>
      <input
        type="text"
        placeholder="Nouvelle tâche"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={addTask}>Ajouter</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title} - {task.dueDate}
            </span>
            <button onClick={() => toggleComplete(task.id!, task.completed)}>
  {task.completed ? "Annuler" : "Tache effectuée"}
</button>
<button onClick={() => deleteTask(task.id!)}>
  Supprimer
</button>
    </li>
        ))}
        <button onClick={() => signOut(auth)}>Déconnexion</button>
      </ul>
    </div>
  );
};

export default TaskManager;
