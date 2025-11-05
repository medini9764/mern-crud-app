import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/items/${editingId}`, { title, description });
        setEditingId(null);
      } else {
        await API.post('/items', { title, description });
      }
      setTitle('');
      setDescription('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard - Welcome {user?.username}!</h2>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', minHeight: '100px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
          {editingId ? 'Update' : 'Add'} Item
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Your Items</h3>
      {items.length === 0 ? (
        <p>No items yet. Add your first item above!</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <small style={{ color: '#666' }}>Created: {new Date(item.createdAt).toLocaleDateString()}</small>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(item)} style={{ padding: '5px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} style={{ padding: '5px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;