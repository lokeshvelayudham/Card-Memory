import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './History.css';

const History = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const userID = localStorage.getItem('userID');
        if (!userID) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/memory/history?userID=${userID}`);
        setGameHistory(response.data);
      } catch (err) {
        setError(err.response?.data.message || 'Failed to fetch game history');
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#f44336';
      default: return '#9a8c98';
    }
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1 className="history-title">Your Game History</h1>
      
      <button 
        className="back-button"
        onClick={() => navigate('/play')}
      >
        Back to Game
      </button>

      {gameHistory.length === 0 ? (
        <p className="no-history">No game history found</p>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Failed Attempts</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game, index) => (
                <tr key={index}>
                  <td>{formatDate(game.gameDate)}</td>
                  <td>
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                    >
                      {game.difficulty}
                    </span>
                  </td>
                  <td>
                    {game.completed ? (
                      <span className="status-completed">Completed</span>
                    ) : (
                      <span className="status-failed">Failed</span>
                    )}
                  </td>
                  <td>{game.failed}</td>
                  <td>{Math.floor(game.timeTaken / 60)}m {game.timeTaken % 60}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;