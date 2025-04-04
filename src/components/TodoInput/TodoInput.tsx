import { useEffect, useRef } from 'react';
import './TodoInput.css';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hook pour l'auto-ajustement de la hauteur
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Hauteur maximale avant de permettre le défilement
      
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [newTodo]);

  return (
    <div className="input-field">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onAddTodo();
            }
          }}
          placeholder="Entrez votre nouvelle tâche"
          rows={1}
          className="todo-input"
        />
        <button 
          onClick={onAddTodo}
          disabled={!newTodo.trim()}
          className="add-button"
          title="Ajouter la tâche"
        >
          <i className="fas fa-plus"></i> Ajouter
        </button>
      </div>

      {activeMenu === 'planned' && (
        <div className="datetime-fields">
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
  );
};

export default TodoInput;