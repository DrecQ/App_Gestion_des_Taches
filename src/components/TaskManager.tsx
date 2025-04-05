// src/components/TaskManager.tsx
import React, { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import 'react-calendar/dist/Calendar.css';
import { PieChart, Pie } from "recharts";
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
  const [priority, setPriority] = useState<"Urgent" | "Normal" | "Faible">("Normal");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const tasksRef = collection(db, "tasks");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const data = [
    { name: "Complétées", value: tasks.filter((t) => t.completed).length },
    { name: "En cours", value: tasks.filter((t) => !t.completed).length },
  ];

  // Récupération des tâches en temps réel selon le filtre
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const today = new Date().toISOString();

    let q;
    if (filter === "completed") {
      q = query(tasksRef, where("userId", "==", currentUser.uid), where("completed", "==", true));
    } else if (filter === "due") {
      q = query(tasksRef, where("userId", "==", currentUser.uid), where("dueDate", "<=", today));
    } else if (filter === "upcoming") {
      q = query(tasksRef, where("userId", "==", currentUser.uid), where("dueDate", ">", today));
    } else {
      q = query(tasksRef, where("userId", "==", currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [filter]);

  // Ajout d'une tâche
  const addTask = async () => {
    if (newTask.trim() === "" || dueDate === "") return;

    await addDoc(tasksRef, {
      title: newTask,
      dueDate,
      completed: false,
      userId: auth.currentUser?.uid,
      priority,
    });

    setNewTask("");
    setDueDate("");
    setPriority("Normal");
  };

  // Filtrage dynamique
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // Changer l'état d'une tâche
  const toggleComplete = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  // Supprimer une tâche
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Couleurs de priorité
  const priorityColors: Record<string, string> = {
    Urgent: "red",
    Normal: "orange",
    Faible: "green",
  };

  return (
    <div className={`p-4 max-w-xl mx-auto min-h-screen ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📋 Mes Tâches</h2>
        <button onClick={toggleTheme} className="text-sm border px-2 py-1 rounded">
          Mode {isDarkMode ? "Clair" : "Sombre"}
        </button>
      </div>

      {/* Graphique des tâches */}
      <PieChart width={400} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
          label
        />
      </PieChart>

      {/* Recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher une tâche"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      {/* Filtres */}
      <div className="space-x-2 mb-4">
        <button onClick={() => setFilter("all")}>Toutes</button>
        <button onClick={() => setFilter("completed")}>✔️ Complétées</button>
        <button onClick={() => setFilter("due")}>⏰ Échues</button>
        <button onClick={() => setFilter("upcoming")}>📅 À venir</button>
      </div>

      {/* Ajout de tâche */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 w-full"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="border p-2 w-full"
        >
          <option value="Urgent">🚨 Urgent</option>
          <option value="Normal">🟠 Normal</option>
          <option value="Faible">🟢 Faible</option>
        </select>
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          ➕ Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: priorityColors[task.priority] || "black",
                }}
              >
                {task.title} ({task.priority}) - {task.dueDate}
              </span>
            </div>
            <div className="space-x-2">
              <button onClick={() => toggleComplete(task.id, task.completed)}>
                {task.completed ? "↩️ Annuler" : "✅ Terminer"}
              </button>
              <button onClick={() => deleteTask(task.id)} className="text-red-500">
                🗑️ Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Déconnexion */}
      <div className="mt-4">
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-gray-600 underline"
        >
          🔓 Déconnexion
        </button>
      </div>
    </div>
  );
};

export default TaskManager;
