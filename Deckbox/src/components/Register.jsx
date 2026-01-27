import React, { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Register({ onRegistered, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, { username, password });
      // auto-login
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      const { token } = res.data;
      if (token && onRegistered) onRegistered(token);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h3>Create account</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <button type="button" onClick={onCancel} style={{marginLeft:8}}>Cancel</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  )
}
