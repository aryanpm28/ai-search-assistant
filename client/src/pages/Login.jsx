import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login({ theme, toggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <button onClick={toggleTheme} style={styles.themeBtn}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={styles.card}>
        <h1 style={styles.title}>🤖 AI Chatbot Search</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative'
  },
  themeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    fontSize: 18
  },
  card: {
    background: 'var(--surface)',
    padding: '2rem',
    borderRadius: 16,
    boxShadow: 'var(--shadow)',
    width: '100%',
    maxWidth: 380,
    border: '1px solid var(--border)'
  },
  title: { fontSize: '1.5rem', marginBottom: 4, textAlign: 'center' },
  subtitle: { color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 15
  },
  btn: {
    padding: '0.75rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    marginTop: 4
  },
  error: {
    background: '#fef2f2',
    color: '#b91c1c',
    padding: '0.6rem',
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14
  },
  footer: { textAlign: 'center', marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: 14 }
};
