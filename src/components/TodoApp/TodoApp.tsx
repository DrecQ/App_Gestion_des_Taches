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
  addedBy?: string;
}

interface User {
  name: string;
  email: string;
}

interface SharedUser {
  email: string;
  name: string;
}

const TodoApp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeMenu, setActiveMenu] = useState('today');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [emailToShare, setEmailToShare] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chargement des données utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Charger les todos et les utilisateurs partagés depuis le localStorage
      const storedTodos = localStorage.getItem(`todos_${userData.email}`);
      if (storedTodos) setTodos(JSON.parse(storedTodos));
      
      const storedShared = localStorage.getItem(`shared_${userData.email}`);
      if (storedShared) setSharedUsers(JSON.parse(storedShared));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Sauvegarde des données
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.email}`, JSON.stringify(todos));
      localStorage.setItem(`shared_${user.email}`, JSON.stringify(sharedUsers));
    }
  }, [todos, sharedUsers, user]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Fonctions de gestion des tâches
  const handleAddTodo = () => {
    if (newTodo.trim() && user) {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        important: false,
        addedBy: user.email
      };
      if (activeMenu === 'planned' && dueDate) {
        newTask.dueDate = dueDate;
        if (dueTime) newTask.dueTime = dueTime;
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

  // Fonctions de partage
  const handleShareList = () => {
    if (emailToShare.trim() && user) {
      const newSharedUser = {
        email: emailToShare,
        name: emailToShare.split('@')[0]
      };
      
      if (!sharedUsers.some(u => u.email === emailToShare)) {
        setSharedUsers([...sharedUsers, newSharedUser]);
        setEmailToShare('');
      }
    }
  };

  const handleRemoveAccess = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
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

  if (!user) {
    return <div className="loading">Chargement en cours...</div>;
  }

  return (
    <div className="todo-app-container">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="user-avatar"><i className="fas fa-user-circle"></i></div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>

        <nav className="sidebar-menu">
          <button 
            onClick={() => setActiveMenu('today')} 
            className={`menu-item ${activeMenu === 'today' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-sun"></i></span>
            <span>Ma journée</span>
          </button>
          
          <button 
            onClick={() => setActiveMenu('planned')} 
            className={`menu-item ${activeMenu === 'planned' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-calendar-alt"></i></span>
            <span>Planifié</span>
          </button>
          
          <button 
            onClick={() => setActiveMenu('important')} 
            className={`menu-item ${activeMenu === 'important' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-star"></i></span>
            <span>Important</span>
          </button>
          
          <button 
            onClick={() => setActiveMenu('completed')} 
            className={`menu-item ${activeMenu === 'completed' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-check-circle"></i></span>
            <span>Terminées</span>
          </button>

          <div className="menu-divider"></div>
          
          <button 
            onClick={() => setShowShareModal(true)}
            className="menu-item share-menu"
          >
            <span className="menu-icon"><i className="fas fa-share-alt"></i></span>
            <span>Partager ma liste</span>
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
              <div className="input-container">
                <textarea
                  ref={textareaRef}
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="Entrez votre nouvelle tâche"
                  rows={1}
                />
                <span className="note-icon">
                  <i className="fas fa-pencil-alt"></i>
                </span>
              </div>

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
            </div>
          )}

          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''} ${todo.addedBy !== user.email ? 'shared' : ''}`}
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
                      <i className="fas fa-calendar-alt datetime-icon"></i>
                      {todo.dueDate && new Date(todo.dueDate).toLocaleDateString()}
                      {todo.dueTime && (
                        <>
                          <i className="fas fa-clock datetime-icon"></i>
                          {todo.dueTime}
                        </>
                      )}
                    </span>
                  )}
                  {todo.addedBy && todo.addedBy !== user.email && (
                    <span className="shared-by">Ajouté par: {sharedUsers.find(u => u.email === todo.addedBy)?.name || todo.addedBy}</span>
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
                    {todo.important ? (
                      <i className="fas fa-star star-icon"></i>
                    ) : (
                      <i className="far fa-star star-icon"></i>
                    )}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.id);
                    }}
                  >
                    <i className="fas fa-trash-alt trash-icon"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="todo-footer">
            <span>{filteredTodos.length} tâche(s)</span>
            {activeMenu === 'completed' && filteredTodos.length > 0 && (
              <button className="clear-btn" onClick={clearCompleted}>
                <i className="fas fa-trash"></i> Effacer toutes les tâches terminées
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3><i className="fas fa-share-alt"></i> Partager ma liste</h3>
            <div className="share-input-group">
              <input
                type="email"
                value={emailToShare}
                onChange={(e) => setEmailToShare(e.target.value)}
                placeholder="Entrez l'email à partager"
                onKeyDown={(e) => e.key === 'Enter' && handleShareList()}
              />
              <button onClick={handleShareList} disabled={!emailToShare.trim()}>
                <i className="fas fa-user-plus"></i> Ajouter
              </button>
            </div>
            
            {sharedUsers.length > 0 && (
              <div className="shared-users-section">
                <h4>Personnes avec accès :</h4>
                <ul className="shared-users-list">
                  {sharedUsers.map(user => (
                    <li key={user.email}>
                      <span className="user-info">
                        <i className="fas fa-user-circle"></i>
                        {user.name} ({user.email})
                      </span>
                      <button 
                        className="remove-access-btn"
                        onClick={() => handleRemoveAccess(user.email)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              className="close-modal-btn"
              onClick={() => setShowShareModal(false)}
            >
              <i className="fas fa-times"></i> Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;