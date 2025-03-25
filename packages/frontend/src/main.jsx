/* eslint-disable react/prop-types */
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Register';
import Play from './MemoryCardGame/Play';
import Easy from './MemoryCardGame/MemoryEasy';
import Medium from './MemoryCardGame/MemoryMedium';
import MemoryCardGame from './MemoryCardGame/MemoryCardGame';
import Congratulations from "./MemoryCardGame/Congratulation";
import CongtEasy from "./MemoryCardGame/Congratseasy";
import CongtNormal from "./MemoryCardGame/Congratsnormal";
import History from './History/History';
import Logout from './Login/Logout';


const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for both token and userID in localStorage
    return !!localStorage.getItem('token') && !!localStorage.getItem('userID');
  });


  const handleLogin = () => {
    setIsAuthenticated(true);
  };




  //function to check auth
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    return !!token && !!userID;
  };

  const ProtectedRoute = ({ element: Element, ...rest }) => {
    return checkAuth() ? <Element {...rest} /> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout onLogout={() => setIsAuthenticated(false)} />} />

        <Route path="/play" element={<ProtectedRoute element={Play} />} />

        <Route path="/congt-easy" element={<ProtectedRoute element={CongtEasy} />} />
        <Route path="/congt-normal" element={<ProtectedRoute element={CongtNormal} />} />
        <Route path="/congratulations" element={<ProtectedRoute element={Congratulations} />} />


        <Route path="/easy" element={<ProtectedRoute element={Easy} />} />
        <Route path="/medium" element={<ProtectedRoute element={Medium} />} />
        <Route path="/memory-card-game" element={<ProtectedRoute element={MemoryCardGame} />} />

        <Route path="/history" element={<ProtectedRoute element={History} />} />

        {/* Fallback for unknown routes  */}
        <Route path="/" element={<Navigate to={checkAuth() ? "/play" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={checkAuth() ? "/play" : "/login"} replace />} />

      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
