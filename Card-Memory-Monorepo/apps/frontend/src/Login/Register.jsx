import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Reusing the same styles

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      setMessage(response.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.response?.data.message || 'Error registering');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-login-container">
      <div className="cosmic-login-card">
        <h2 className="cosmic-login-title">Join the Cosmos</h2>
        <div className="cosmic-glow-bar"></div>
        
        <form onSubmit={handleSubmit} className="cosmic-login-form">
          <div className="cosmic-form-group">
            <input
              type="text"
              placeholder="Choose a username"
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
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="cosmic-input"
              required
            />
            <span className="cosmic-input-border"></span>
          </div>
          
          {message && (
            <div className={`cosmic-message ${
              message.includes('successfully') ? 'success' : 'error'
            }`}>
              {message}
            </div>
          )}
          
          <button type="submit" className="cosmic-login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="cosmic-loading">
                <span className="cosmic-loading-dot"></span>
                <span className="cosmic-loading-dot"></span>
                <span className="cosmic-loading-dot"></span>
              </span>
            ) : (
              'REGISTER'
            )}
          </button>
          
          <div className="cosmic-register-prompt">
            Already have an account?{' '}
            <button 
              type="button" 
              className="cosmic-register-link"
              onClick={() => navigate('/')}
            >
              Login Here
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

export default Register;