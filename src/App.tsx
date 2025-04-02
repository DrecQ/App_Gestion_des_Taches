import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Auth/Login';
import TodoApp from './components/TodoApp/TodoApp';
import Register from './components/Register/Register';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <TodoApp />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;