import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoApp.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
  dueDate?: string;
  dueTime?: string;
}

interface User {
  name: string;
  email: string;
}

const TodoApp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeMenu, setActiveMenu] = useState('today');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chargement des données utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Trie les tâches
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return 0;
  });

  const filteredTodos = sortedTodos.filter(todo => {
    switch(activeMenu) {
      case 'important': return todo.important;
      case 'completed': return todo.completed;
      case 'planned': return !!todo.dueDate;
      default: return true;
    }
  });

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        important: false,
      };
      if (activeMenu === 'planned' && dueDate) {
        newTask.dueDate = dueDate;
        if (dueTime) {
          newTask.dueTime = dueTime;
        }
      }
      setTodos([...todos, newTask]);
      setNewTodo('');
      setDueDate('');
      setDueTime('');
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

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  if (!user) {
    return <div className="loading">Chargement en cours...</div>;
  }

  return (
    <div className="todo-app-container">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
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
            onClick={() => setActiveMenu('planned')} 
            className={`menu-item ${activeMenu === 'planned' ? 'active' : ''}`}
          >
            <span className="menu-icon">📅</span>
            <span>Planifié</span>
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
            {activeMenu === 'planned' && 'Tâches planifiées'}
            {activeMenu === 'important' && 'Tâches importantes'}
            {activeMenu === 'completed' && 'Tâches terminées'}
          </h2>

          {activeMenu !== 'completed' && (
            <div className="input-field">
              <textarea
                ref={textareaRef}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="Entrez votre nouvelle tâche"
                rows={1}
              />
              {activeMenu === 'planned' && (
                <div className="datetime-inputs">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="time-input"
                  />
                </div>
              )}
              <span className="note-icon">✏️</span>
            </div>
          )}

          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''}`}
              >
                <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => {}} 
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                  {(todo.dueDate || todo.dueTime) && (
                    <span className="due-datetime">
                      📅 {todo.dueDate && new Date(todo.dueDate).toLocaleDateString()}
                      {todo.dueTime && (
                        <>
                          🕒 {todo.dueTime}
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  <button 
                    className="importance-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImportant(todo.id);
                    }}
                  >
                    {todo.important ? '★' : '☆'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="todo-footer">
            <span>{filteredTodos.length} tâche(s)</span>
            {activeMenu === 'completed' && filteredTodos.length > 0 && (
              <button className="clear-btn" onClick={clearCompleted}>
                Effacer toutes les tâches terminées
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoApp;