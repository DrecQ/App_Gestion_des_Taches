import { useState, useRef } from 'react';
import './TodoApp.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
}

const TodoApp = () => {
  const [user] = useState({
    name: 'ismaila',
    email: 'bios.com'
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeMenu, setActiveMenu] = useState('today');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (activeMenu) {
      case 'important': return todo.important;
      case 'completed': return todo.completed;
      default: return !todo.completed;
    }
  });

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        important: activeMenu === 'important'
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const toggleImportant = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, important: !todo.important } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="todo-app-container">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>

        <nav className="sidebar-menu">
          <button
            onClick={() => setActiveMenu('today')}
            className={`menu-item ${activeMenu === 'today' ? 'active' : ''}`}
          >
            <span className="menu-icon">☀️</span>
            <span>Ma journée</span>
          </button>

          <button
            onClick={() => setActiveMenu('important')}
            className={`menu-item ${activeMenu === 'important' ? 'active' : ''}`}
          >
            <span className="menu-icon">⭐</span>
            <span>Important</span>
          </button>

          <button
            onClick={() => setActiveMenu('completed')}
            className={`menu-item ${activeMenu === 'completed' ? 'active' : ''}`}
          >
            <span className="menu-icon">✓</span>
            <span>Terminées</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="todo-container">
          <h2 className="section-title">
            {activeMenu === 'today' && 'Ma journée'}
            {activeMenu === 'important' && 'Tâches importantes'}
            {activeMenu === 'completed' && 'Tâches terminées'}
          </h2>

          <div className="input-field">
            <textarea
              ref={textareaRef}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Entrez votre nouvelle tâche"
              rows={1}
            />
            <span className="note-icon">✏️</span>
          </div>

          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => { }}
                  />
                  <span>{todo.text}</span>
                </div>
                <button
                  className={`importance-btn ${todo.important ? 'important' : ''}`}
                  onClick={() => toggleImportant(todo.id)}
                >
                  {todo.important ? '★' : '☆'}
                </button>
              </li>
            ))}
          </ul>

          <div className="todo-footer">
            <span>{filteredTodos.length} tâche(s) restante(s)</span>
            {todos.some(todo => todo.completed) && (
              <button className="clear-btn" onClick={clearCompleted}>
                Effacer terminées
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoApp;