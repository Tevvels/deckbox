import React, { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ForgotPassword({ onDone, onCancel, onLogin }) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const requestReset = async (e) => {
    e.preventDefault();
    setError(null); setMessage(null);
    try {
      const res = await axios.post(`${API_BASE}/auth/forgot`, { username });
      setMessage(res.data.message || 'If the user exists, a reset token was generated');
      if (res.data.token) setToken(res.data.token); // dev: show token
    } catch (err) { setError(err.response?.data?.message || err.message); }
  }

  const doReset = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/auth/reset`, { token, password: newPassword });
      const jwt = res.data.token;
      if (jwt) {
        if (onLogin) onLogin(jwt);
        if (onDone) onDone();
      }
    } catch (err) { setError(err.response?.data?.message || err.message); }
  }

  return (
    <div>
      <h3>Forgot password</h3>
      <form onSubmit={requestReset}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <button type="submit">Request reset</button>
      </form>
      {message && <div style={{color:'green'}}>{message}</div>}
      {token && (
        <div style={{marginTop:8}}>
          <div>Dev reset token: <code>{token}</code></div>
          <form onSubmit={doReset} style={{marginTop:8}}>
            <input placeholder="reset token" value={token} onChange={e=>setToken(e.target.value)} />
            <input placeholder="new password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            <button type="submit">Reset password</button>
          </form>
        </div>
      )}
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{marginTop:8}}><button onClick={onCancel}>Cancel</button></div>
    </div>
  )
}
