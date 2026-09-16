import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';

function App() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/*"
        element={user ? <ChatPage theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
