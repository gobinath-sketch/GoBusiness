import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Award, Lock, Mail, AlertCircle, FlaskConical, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('credentials'); // 'credentials' | 'demo'
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // ── With Credentials: existing API flow (untouched) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(
        '/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const responseJson = await response.json();

      if (response.ok && responseJson.data?.token) {
        const token = responseJson.data.token;
        Cookies.set('jwt_token', token, { expires: 7 });
        navigate('/', { replace: true });
      } else {
        const errorText = responseJson.message || 'Invalid email or password';
        setErrorMsg(errorText);
      }
    } catch (err) {
      setErrorMsg('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Without Credentials: demo bypass ──
  const handleDemoSignIn = () => {
    Cookies.set('jwt_token', 'demo-bypass-token', { expires: 1 });
    navigate('/', { replace: true });
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-container">
            <Award className="login-logo-icon" />
          </div>
          <h1 className="login-title">Go Business</h1>
          <p className="login-tagline">Sign in to open your referral dashboard.</p>
        </div>

        {/* ── Mode Toggle ── */}
        <div className="login-mode-toggle" role="group" aria-label="Sign in mode">
          <button
            type="button"
            className={`mode-tab ${mode === 'credentials' ? 'mode-tab-active' : ''}`}
            onClick={() => handleModeSwitch('credentials')}
          >
            <ShieldCheck size={14} />
            With Credentials
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === 'demo' ? 'mode-tab-active' : ''}`}
            onClick={() => handleModeSwitch('demo')}
          >
            <FlaskConical size={14} />
            Without Credentials
          </button>
        </div>

        {/* ── With Credentials Mode (existing form — untouched) ── */}
        {mode === 'credentials' && (
          <>
            {errorMsg && (
              <div className="error-banner" role="alert">
                <AlertCircle className="error-icon" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email-input" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="email-input"
                    type="text"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password-input" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-button">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </>
        )}

        {/* ── Without Credentials Mode (demo bypass) ── */}
        {mode === 'demo' && (
          <div className="demo-signin-section">
            <p className="demo-signin-hint">
              Click below to access the dashboard instantly — no credentials required.
            </p>
            <button
              type="button"
              className="login-submit-button"
              onClick={handleDemoSignIn}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
