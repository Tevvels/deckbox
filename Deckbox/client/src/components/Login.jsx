import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate,} from 'react-router-dom';
import "../styles/Login.css";
import Gradient from '../modules/Gradient';

// Vite exposes env vars on import.meta.env. Use VITE_API_BASE for the frontend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


export default function Login({ onLogin, onShowRegister, onShowForgot }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      const { token } = res.data;
      if (token) onLogin(token); localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
  }

useEffect(() => {
    window.addEventListener('beforeunload', handleLogout);
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  return (
    <div className="portal">
      <Gradient className='portal_container container'>
      <h3 className="headers portal_header">Login</h3>
      <form className="forms portal_form" onSubmit={handleLogin}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} className='inputs portal_input portal_input-username' />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className='inputs portal_input portal_input-password' />
      <div className='portal_buttons'>
        <button type="submit" className='buttons submit portal_button portal_button-submit'>Login</button>
        <button onClick={()=>{ setError(null); onShowRegister && onShowRegister(); }} className=' buttons portal_button portal_button-create'>Create account</button>
        <button onClick={()=>{ setError(null); onShowForgot && onShowForgot(); }} className=' buttons portal_button portal_button-forgot'>Forgot password</button>
      </div>
      </form>
      {error && <span className="span portal_span" style={{color:'red', marginTop:8}}>{error}</span>}
    </Gradient>
      </div>
  )
}
