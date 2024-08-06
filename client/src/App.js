import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//========================================================================COMPONENTS
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


//========================================================================REACT ROUTING
function App() {
  console.log('App component rendered');
  return (
    <Router>
      <div className="App" style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
