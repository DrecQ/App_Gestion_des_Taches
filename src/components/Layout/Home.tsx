import { useState, useRef, useEffect } from 'react';



interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
      adjustTextareaHeight();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newTodo]);

  return (
    <div className="container">
      <div className="input-field">
        <textarea
          ref={textareaRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter your new todo"
          rows={1}
        />
        <i className="uil uil-notes note-icon"></i>
      </div>

      <ul className="todoLists">
        {todos.map(todo => (
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
        <span>
          You have <span className="pending-num">{todos.length || 'no'}</span> tasks pending.
        </span>
        {todos.length > 0 && (
          <button className="clear-button" onClick={clearAllTodos}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;