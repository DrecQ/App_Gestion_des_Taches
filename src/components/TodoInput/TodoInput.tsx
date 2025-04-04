import './TodoInput.css';



// TodoInput.tsx
interface TodoInputProps {
    activeMenu: string;
    newTodo: string;
    setNewTodo: (text: string) => void;
    onAddTodo: () => void;
    dueDate: string;
    setDueDate: (date: string) => void;
    dueTime: string;
    setDueTime: (time: string) => void;
  }
  
  const TodoInput = ({
    activeMenu,
    newTodo,
    setNewTodo,
    onAddTodo,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime
  }: TodoInputProps) => {
    return (
      <div className="input-field">
        <div className="input-container">
          <textarea
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onAddTodo()}
            placeholder="Entrez votre nouvelle tâche"
            rows={1}
          />
          <button 
            onClick={onAddTodo}
            disabled={!newTodo.trim()}
            className="add-btn"
            title="Ajouter la tâche"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
  
        {activeMenu === 'planned' && (
          <div className="datetime-inputs">
            <div className="datetime-input-container">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="datetime-input-container time">
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default TodoInput;