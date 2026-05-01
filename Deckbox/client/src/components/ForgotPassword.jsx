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
    <div className='login login_forgot container'>
      <h3 className='header login_header login_header-forgot'>Forgot password</h3>
      <form className='forms login_form login_form-forgot' onSubmit={requestReset}>
        <input className="inputs login_input login_input-forgot" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <button className='buttons login_button login_button-submit login_button-forgot' type="submit">Request reset</button>
      </form>
      {message && <span className=" spans login_span login_span-forgot" style={{color:'green'}}>{message}</span>}
      {token && (
        <div className="login_container-sub" style={{marginTop:8}}>
          <span className="login_span login_span-forgot">Dev reset token: <code>{token}</code></span>
          <form className=" forms login_form login_form-forgot" onSubmit={doReset} style={{marginTop:8}}>
            <input className='inputs login_input login_input-forgot' placeholder="reset token" value={token} onChange={e=>setToken(e.target.value)} />
            <input className='inputs login_input login_input-forgot' placeholder="new login" type="login" value={newlogin} onChange={e=>setNewPassword(e.target.value)} />
            <button className='buttons submit login_button login_button-submit login_button-forgot' type="submit">Reset login</button>
          </form>
        </div>
      )}
      {error && <span className="spans login_span login_span-forgot" style={{color:'red'}}>{error}</span>}
      <div style={{marginTop:8}}><button className='buttons cancel login_button login_button-cancel login_button-forgot' onClick={onCancel}>Cancel</button></div>
    </div>
  )
}
