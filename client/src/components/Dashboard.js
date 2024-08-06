import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: '', description: '', quantity: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await apiRequest('/items');
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleNewItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await apiRequest('/items', 'POST', newItem, token);
      setNewItem({ item_name: '', description: '', quantity: 0 });
      fetchItems();
    } catch (err) {
      setError('Failed to add new item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/items/${id}`, 'DELETE', null, token);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <h3>Add New Item</h3>
      <form onSubmit={handleNewItemSubmit}>
        <input
          type="text"
          name="item_name"
          value={newItem.item_name}
          onChange={handleNewItemChange}
          placeholder="Item Name"
          required
        />
        <input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleNewItemChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleNewItemChange}
          placeholder="Quantity"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <h3>Inventory Items</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.item_name} - Quantity: {item.quantity}
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;