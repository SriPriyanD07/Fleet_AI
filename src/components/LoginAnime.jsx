import React, { useState, useRef, useEffect } from 'react';
import './LoginAnime.css';

const ADMIN_EMAIL = 'narayanan@gmail.com';
const ADMIN_PASSWORD = 'fleet@2025';

export default function LoginAnime({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setOpened(true), 100);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setError("");
      onLogin && onLogin({ email, password });
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="login-anime-bg">
      <div className={`paper-fold-card${opened ? ' open' : ''}`} ref={cardRef}>
        <form className="paper-form" autoComplete="off" onSubmit={handleLogin}>
          <h2>User Login</h2>
          <div className="input-wrapper">
            <label htmlFor="login-username">USERNAME</label>
            <div className="input-group">
              <span className="icon">
                <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
              </span>
              <input
                type="text"
                id="login-username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                data-lpignore="true"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="login-password">PASSWORD</label>
            <div className="input-group">
              <span className="icon">
                <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6V9a6 6 0 0 0-12 0v2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-8-2a4 4 0 0 1 8 0v2H8V9zm10 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7z" /></svg>
              </span>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                data-lpignore="true"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="btn-group">
            <button className="btn btn--primary" type="submit">SIGN IN</button>
            <a className="btn--text" href="#0">Forgot password?</a>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="paper-fold left"></div>
        <div className="paper-fold right"></div>
      </div>
    </div>
  );
}

