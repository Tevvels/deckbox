import React, { useState } from 'react'
import axios from 'axios'
import Gradient from '../modules/Gradient';

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
    <div className="portal">
    <Gradient className='portal_container'>
      <h3 className='header portal_header portal_header-forgot'>Forgot password</h3>
      <form className='forms portal_form portal_form-forgot' onSubmit={requestReset}>
        <input className="inputs portal_input portal_input-forgot" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <div className="portal_buttons">
        <button className='buttons portal_button portal_button-submit portal_button-forgot' type="submit">Request reset</button>
        </div>
      </form>
      {message && <span className=" spans portal_span portal_span-forgot" style={{color:'green'}}>{message}</span>}
      {token && (
        <div className="portal_container">
          <span className="portal_span portal_span-forgot">Dev reset token: <code>{token}</code></span>
          <form className=" forms portal_form portal_form-forgot" onSubmit={doReset} style={{marginTop:8}}>
            <input className='inputs portal_input portal_input-forgot' placeholder="reset token" value={token} onChange={e=>setToken(e.target.value)} />
            <input className='inputs portal_input portal_input-forgot' placeholder="new login" type="login" value={newlogin} onChange={e=>setNewPassword(e.target.value)} />
            <div className="portal_buttons">
             <button className='buttons submit portal_button portal_button-submit portal_button-forgot' type="submit">Reset login</button>
            </div>
          </form>
        </div>
      )}
      {error && <span className="spans portal_span portal_span-forgot" style={{color:'red'}}>{error}</span>}
      <div className='portal_buttons'><button className='buttons cancel portal_button portal_button-cancel portal_button-forgot' onClick={onCancel}>Cancel</button></div>
    </Gradient>
    </div>
  )
}
