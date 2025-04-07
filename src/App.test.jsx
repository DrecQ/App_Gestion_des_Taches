import React, { useState } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  };

  return (
    <div className="todo-app-container">
      <h2>Ma Liste de Tâches</h2>

      <div className="input-field">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Ajouter une tâche"
        />
        <button onClick={handleAddTodo}>Ajouter</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <ul
            key={todo.id}
            className={todo.completed ? 'completed' : ''}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </ul>
        ))}
      </ul>

      <div className="todo-footer">
        <span>{todos.filter((todo) => !todo.completed).length} tâche(s) en attente</span>
        {todos.some((todo) => todo.completed) && (
          <button onClick={clearCompleted}>Effacer les terminées</button>
        )}
      </div>
    </div>
  );
};

export default TodoApp;