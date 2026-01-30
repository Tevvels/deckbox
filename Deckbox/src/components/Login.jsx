import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate,} from 'react-router-dom';
import "../styles/Login.css";

// Vite exposes env vars on import.meta.env. Use VITE_API_BASE for the frontend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


export default function Login({ onLogin, onShowRegister, onShowForgot }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('userToken');
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
      if (token) onLogin(token); localStorage.setItem('userToken', token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
  }

useEffect(() => {
    window.addEventListener('beforeunload', handleLogout);
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  return (
    <div className="Login">
      <h3>Login</h3>
      <form onSubmit={handleLogin} className='Login_Form'>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} className='Login_Form-Input Login_Form-Username' />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className='Login_Form-Input Login_Form-Password' />
        <button type="submit" className='Login_Form-Button Login_Form-Submit'>Login</button>
      </form>
      <div style={{marginTop:8}}>
        <button onClick={()=>{ setError(null); onShowRegister && onShowRegister(); }} className='Login_Form-Button Login_Form-Create'>Create account</button>
        <button onClick={()=>{ setError(null); onShowForgot && onShowForgot(); }} style={{marginLeft:8}} className='Login_Form-Button Login_Form-Forgot'>Forgot password</button>
      </div>
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
    </div>
  )
}
