import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // We'll create this next

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      localStorage.removeItem('gameStarted');
      
      if (typeof onLogout === 'function') {
        onLogout();
      }
      
      // Redirect after a brief delay for visual feedback
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    };

    logout();
  }, [navigate, onLogout]);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h2>Logging Out...</h2>
        <div className="logout-spinner"></div>
        <p>You're being securely signed out</p>
      </div>
    </div>
  );
};

export default Logout;