import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Award, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
        Cookies.set('jwt_token', token, { expires: 7 }); // Set expires for 7 days
        navigate('/', { replace: true });
      } else {
        // Show exact error message from backend or fallback to the requested text
        const errorText = responseJson.message || 'Invalid email or password';
        setErrorMsg(errorText);
      }
    } catch (err) {
      setErrorMsg('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
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
      </div>
    </div>
  );
};

export default Login;
