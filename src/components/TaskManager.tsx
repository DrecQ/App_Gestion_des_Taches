import React, { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
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
  arrayUnion,
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sharedUid, setSharedUid] = useState("");

  const tasksRef = collection(db, "tasks");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const data = [
    { name: "Complétées", value: tasks.filter((t) => t.completed).length },
    { name: "En cours", value: tasks.filter((t) => !t.completed).length },
  ];

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

  const addTask = async () => {
    if (newTask.trim() === "" || dueDate === "") return;

    await addDoc(tasksRef, {
      title: newTask,
      dueDate,
      completed: false,
      userId: auth.currentUser?.uid,
      priority,
      sharedWith: [],
    });

    setNewTask("");
    setDueDate("");
    setPriority("Normal");
  };

  const shareTask = async (taskId: string) => {
    if (sharedUid.trim() === "") return;

    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      sharedWith: arrayUnion(sharedUid),
    });

    setSharedUid("");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const priorityColors: Record<string, string> = {
    Urgent: "danger",
    Normal: "warning",
    Faible: "success",
  };

  const handleTabClick = (tab: string) => {
    setFilter(tab);
    setActiveTab(tab);
  };

  return (
    <div className={`container py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Mes Tâches</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
          Mode {isDarkMode ? "Clair" : "Sombre"}
        </button>
      </div>

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

      <input
        type="text"
        className="form-control my-3"
        placeholder="🔍 Rechercher une tâche"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="btn-group mb-3 w-100">
        <button className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleTabClick("all")}>Toutes</button>
        <button className={`btn ${activeTab === "completed" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleTabClick("completed")}>✔️ Complétées</button>
        <button className={`btn ${activeTab === "due" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleTabClick("due")}>⏰ Échues</button>
        <button className={`btn ${activeTab === "upcoming" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => handleTabClick("upcoming")}>📅 À venir</button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="form-select mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="Urgent">🚨 Urgent</option>
          <option value="Normal">🟠 Normal</option>
          <option value="Faible">🟢 Faible</option>
        </select>
        <button className="btn btn-success w-100" onClick={addTask}>➕ Ajouter</button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="User ID à partager"
          value={sharedUid}
          onChange={(e) => setSharedUid(e.target.value)}
        />
        <button className="btn btn-info w-100" onClick={() => shareTask(tasks[0]?.id)}>Partager</button>
      </div>

      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span className={`text-${priorityColors[task.priority]}`} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.title} ({task.priority}) - {task.dueDate}
            </span>
            <div>
              <button className="btn btn-sm btn-outline-success me-2" onClick={() => toggleComplete(task.id, task.completed)}>
                {task.completed ? "↩️ Annuler" : "✅ Terminer"}
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-center mt-4">
        <button className="btn btn-link text-muted" onClick={() => signOut(auth)}>🔓 Déconnexion</button>
      </div>
    </div>
  );
};

export default TaskManager;
