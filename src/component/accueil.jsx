import React, { useState } from 'react';

const TodoList = () => {
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

  const clearAllTodos = () => {
    setTodos([]);
  };

  return (
    <div className="container">
      <h2>Liste de Tâches</h2>

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
          <li
            key={todo.id}
            className={todo.completed ? 'completed' : ''}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </li>
        ))}
      </ul>

      <div className="pending-tasks">
        <span>{todos.length} tâche(s) en attente</span>
        {todos.length > 0 && (
          <button className="clear-button" onClick={clearAllTodos}>
            Tout Effacer
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;