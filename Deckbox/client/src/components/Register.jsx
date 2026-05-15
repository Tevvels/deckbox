import React, { useState } from 'react'
import axios from 'axios'
import Gradient from '../modules/Gradient';

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
    <div className="portal">
    <Gradient className=' portal_container container'>
      <h3 className='headers portal_header'>Create account</h3>
      <form className='forms portal_form' onSubmit={handleSubmit}>
        <input className='inputs portal_input-username' placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className='inputs portal_password' placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className='portal_buttons'>
        <button className='buttons portal_button submit' type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <button className='buttons portal_button cancel' type="button" onClick={onCancel} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
      {error && <span className='spans' style={{color:'red'}}>{error}</span>}
    </Gradient>
    </div>
  )
}
