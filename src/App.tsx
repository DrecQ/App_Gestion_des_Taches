import React from 'react';
import './App.css'; // Assure-toi que le fichier CSS est bien importé
import Home from './components/Layout/Home';
import TodoApp from './components/Layout/SideBar';

const App = () => {
  return (
    <div className="App">
      <TodoApp/>
      <Home />
    </div>
  );
};

export default App;
