import { SharedUser, Todo, User } from "../../types/types";

interface TodoListProps {
  todos: Todo[];
  activeMenu: string;
  currentUser: User;
  sharedUsers: SharedUser[];
  onToggleTodo: (id: number) => void;
  onToggleImportant: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onClearCompleted: () => void;
}

const TodoList = ({
  todos,
  currentUser,
  sharedUsers,
  onToggleTodo,
  onToggleImportant,
  onDeleteTodo,
  onClearCompleted
}: TodoListProps) => {
  return (
    <div className="todo-list-container">
      <ul className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>Aucune tâche à afficher</p>
          </div>
        ) : (
          todos.map(todo => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''} ${todo.addedBy !== currentUser.email ? 'shared' : ''}`}
            >
              <div className="todo-content" onClick={() => onToggleTodo(todo.id)}>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => {}}
                  className="todo-checkbox"
                  aria-label={todo.completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
                />
                <span className="todo-text">{todo.text}</span>
                
                {(todo.dueDate || todo.dueTime) && (
                  <span className="due-datetime">
                    {todo.dueDate && (
                      <>
                        <i className="fas fa-calendar-alt datetime-icon"></i>
                        {new Date(todo.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </>
                    )}
                    {todo.dueTime && (
                      <>
                        <i className="fas fa-clock datetime-icon"></i>
                        {todo.dueTime}
                      </>
                    )}
                  </span>
                )}
                
                {todo.addedBy && todo.addedBy !== currentUser.email && (
                  <span className="shared-by">
                    {sharedUsers.find(u => u.email === todo.addedBy)?.name || todo.addedBy.split('@')[0]}
                  </span>
                )}
              </div>
              
              <div className="todo-actions">
                <button 
                  className={`importance-btn ${todo.important ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleImportant(todo.id);
                  }}
                  aria-label={todo.important ? "Retirer des tâches importantes" : "Marquer comme importante"}
                >
                  <i className={`far ${todo.important ? 'fas' : 'far'} fa-star`}></i>
                </button>
                
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTodo(todo.id);
                  }}
                  aria-label="Supprimer la tâche"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;