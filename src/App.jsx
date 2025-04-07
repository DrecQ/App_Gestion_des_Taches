import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TodoApp.css';

const TodoApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/add" element={<AddTaskForm />} />
      </Routes>
    </Router>
  );
};


const TodoList = ({ tasks, onCompleteTask }) => {
  return (
    <div className="app-container">
      <div className="header">
        <h2>To Do List</h2>
        <Link to="/add">
          <button className="add-task-button">+</button>
        </Link>
      </div>
      <div className="task-list">
        {tasks && tasks.map((task) => (
          <TaskItem key={task.id} task={task} onCompleteTask={onCompleteTask} />
        ))}
      </div>
    </div>
  );
};

const TaskItem = ({ task, onCompleteTask }) => {
  return (
    <div className="task-item">
      <span>{task.text}</span>
      <button onClick={onCompleteTask}>Terminé</button>
    </div>
  );
};

const AddTaskForm = () => {
  const [taskText, setTaskText] = useState('');
  const [dueDate, setDueDate] = useState(null);

  return (
    <div className="add-task-form">
      <h2>Ajouter une tâche</h2>
      <div className="form-group">
        <label>Que faut-il faire ?</label>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Entrez tâche ici"
        />
      </div>
      <div className="form-group">
        <label>Date limite</label>
        <div className="date-picker-container">
          <input
            type="text"
            value={dueDate ? dueDate.toLocaleDateString() : 'Date non fixée'}
            readOnly
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Choisir une date"
          />
        </div>
      </div>
      <button>Ajouter</button>
      <Link to="/">
        <button>Annuler</button>
      </Link>
    </div>
  );
};

export default TodoApp;