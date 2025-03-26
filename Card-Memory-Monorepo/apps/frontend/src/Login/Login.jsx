import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      onLogin();
      navigate('/play');
    } catch (error) {
      setError(error.response?.data.message || 'Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-login-container">
      <div className="cosmic-login-card">
        <h2 className="cosmic-login-title">Memory Game</h2>
        <div className="cosmic-glow-bar"></div>
        
        <form onSubmit={handleSubmit} className="cosmic-login-form">
          <div className="cosmic-form-group">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="cosmic-input"
              required
            />
            <span className="cosmic-input-border"></span>
          </div>
          
          <div className="cosmic-form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="cosmic-input"
              required
            />
            <span className="cosmic-input-border"></span>
          </div>
          
          {error && <div className="cosmic-error-message">{error}</div>}
          
          <button type="submit" className="cosmic-login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="cosmic-loading">
                <span className="cosmic-loading-dot"></span>
                <span className="cosmic-loading-dot"></span>
                <span className="cosmic-loading-dot"></span>
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
          
          <div className="cosmic-register-prompt">
            New to the cosmos?{' '}
            <button 
              type="button" 
              className="cosmic-register-link"
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
      
      <div className="cosmic-stars"></div>
      <div className="cosmic-stars small"></div>
      <div className="cosmic-stars tiny"></div>
    </div>
  );
};

export default Login;