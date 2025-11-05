import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // store token if server returns JWT
      localStorage.setItem('token', data.token);
      // navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="login-root">
      <div className="left-pane">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RebpMnWu7Hi2RSCr8JCtpj0HvcT3Lxb4FQ&s" alt="school" className="left-image" />
      </div>

      <div className="right-card">
        <h2 className="welcome">Welcome</h2>
        <p className="subtitle">Please login to your account.</p>
        <form onSubmit={submit} className="login-form">
          <label>Username or Email</label>
          <input value={username} onChange={e => setUsername(e.target.value)} type="text" required />
          
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          
          <div className="row">
            <a className="forgot" href="/forgot">Forgot Password?</a>
            <button className="btn-login" type="submit">Login</button>
          </div>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
