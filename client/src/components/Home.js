import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  console.log('Home component rendered');
  return (
    <div>
      <h1>Inventory Management System</h1>
      <nav>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;