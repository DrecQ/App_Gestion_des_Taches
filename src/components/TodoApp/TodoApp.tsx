import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification, SharedUser, Todo, User } from '../../types/types';
import { ShareModal, NotificationsModal } from '../Modals/Modals';
import './TodoApp.css';
import './dark.css';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Gestion du mode sombre
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Appliquer le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Chargement des données
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      const storedTodos = localStorage.getItem(`todos_${userData.email}`);
      if (storedTodos) setTodos(JSON.parse(storedTodos));
      
      const storedShared = localStorage.getItem(`shared_${userData.email}`);
      if (storedShared) setSharedUsers(JSON.parse(storedShared));

      const storedNotifications = localStorage.getItem(`notifications_${userData.email}`);
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Sauvegarde des données
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.email}`, JSON.stringify(todos));
      localStorage.setItem(`shared_${user.email}`, JSON.stringify(sharedUsers));
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(notifications));
    }
  }, [todos, sharedUsers, notifications, user]);

  // Fermer le menu mobile lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (isMobileMenuOpen && sidebar && !sidebar.contains(event.target as Node) && 
          hamburger && !hamburger.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Gestion des notifications
  const addNotification = (
    title: string, 
    message: string, 
    type?: Notification['type'],
    icon?: string,
    data?: Notification['data']
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      body: message,
      read: false,
      timestamp: new Date(),
      type,
      icon,
      data
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Gestion des tâches
  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      setInputError("Veuillez saisir une tâche");
      return;
    }

    if (activeMenu === 'planned' && !dueDate) {
      setInputError("Veuillez sélectionner au moins une date");
      return;
    }

    if (user) {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        important: false,
        addedBy: user.email,
        createdAt: Date.now()
      };
      
      if (activeMenu === 'planned') {
        newTask.dueDate = dueDate;
        if (dueTime) newTask.dueTime = dueTime;
      }
      
      setTodos([...todos, newTask]);
      addNotification(
        'Tâche ajoutée',
        `"${newTodo}" a été ajoutée à votre liste`,
        'task',
        'fas fa-tasks'
      );
      setNewTodo('');
      setDueDate('');
      setDueTime('');
      setInputError(null);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: Date.now() } : todo
    ));
  };

  const toggleImportant = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, important: !todo.important, updatedAt: Date.now() } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (todoToDelete) {
      addNotification(
        'Tâche supprimée',
        `"${todoToDelete.text}" a été supprimée`,
        'warning',
        'fas fa-trash-alt'
      );
    }
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    addNotification(
      'Nettoyage effectué',
      'Toutes les tâches terminées ont été supprimées',
      'success',
      'fas fa-broom'
    );
  };

  // Partage de la liste
  const handleShareList = () => {
    if (emailToShare.trim() && user) {
      const newSharedUser: SharedUser = {
        id: Date.now().toString(),
        email: emailToShare,
        name: emailToShare.split('@')[0],
        permission: 'write',
        sharedAt: Date.now()
      };
      
      if (!sharedUsers.some(u => u.email === emailToShare)) {
        setSharedUsers([...sharedUsers, newSharedUser]);
        addNotification(
          'Liste partagée',
          `Vous avez partagé votre liste avec ${emailToShare}`,
          'share',
          'fas fa-share-alt'
        );
        setEmailToShare('');
      }
    }
  };

  const handleRemoveAccess = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
    addNotification(
      'Accès révoqué',
      `Vous avez révoqué l'accès pour ${email}`,
      'warning',
      'fas fa-user-times'
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Tri et filtrage des tâches
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const filteredTodos = sortedTodos.filter(todo => {
    switch(activeMenu) {
      case 'important': return todo.important;
      case 'completed': return todo.completed;
      case 'planned': return !!todo.dueDate;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return <div className="loading">Chargement en cours...</div>;
  }

  return (
    <div className="todo-app-container">
      {/* Bouton de basculement du mode sombre */}
      <button 
        onClick={toggleDarkMode}
        className="dark-mode-toggle"
        aria-label={darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
      >
        {darkMode ? (
          <i className="fas fa-sun" title="Mode clair"></i>
        ) : (
          <i className="fas fa-moon" title="Mode sombre"></i>
        )}
      </button>

      <button 
        className="hamburger-menu"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="user-profile">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>

        <nav className="sidebar-menu">
          <button 
            onClick={() => {
              setActiveMenu('today');
              setIsMobileMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'today' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-sun"></i></span>
            <span>Ma journée</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('planned');
              setIsMobileMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'planned' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-calendar-alt"></i></span>
            <span>Planifié</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('important');
              setIsMobileMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'important' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-star"></i></span>
            <span>Important</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('completed');
              setIsMobileMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'completed' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-check-circle"></i></span>
            <span>Terminées</span>
          </button>

          <div className="menu-divider"></div>

          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setIsMobileMenuOpen(false);
            }}
            className={`menu-item ${showNotifications ? 'active' : ''}`}
          >
            <span className="menu-icon">
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </span>
            <span>Notifications</span>
          </button>
          
          <button 
            onClick={() => {
              setShowShareModal(true);
              setIsMobileMenuOpen(false);
            }}
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
                  onChange={(e) => {
                    setNewTodo(e.target.value);
                    setInputError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddTodo()}
                  placeholder="Entrez votre nouvelle tâche"
                  rows={1}
                  className={inputError ? 'error' : ''}
                />
                <button 
                  onClick={handleAddTodo}
                  disabled={!newTodo.trim()}
                  className="add-button"
                  title="Ajouter la tâche"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              {activeMenu === 'planned' && (
                <div className="datetime-fields">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      setInputError(null);
                    }}
                    className={`date-input ${inputError ? 'error' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => {
                      setDueTime(e.target.value);
                      setInputError(null);
                    }}
                    className="time-input"
                  />
                </div>
              )}
              {inputError && <div className="error-message">{inputError}</div>}
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

      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        emailToShare={emailToShare}
        setEmailToShare={setEmailToShare}
        onShare={handleShareList}
        sharedUsers={sharedUsers}
        onRemoveAccess={handleRemoveAccess}
      />

      <NotificationsModal
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default TodoApp;