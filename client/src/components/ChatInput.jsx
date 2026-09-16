import { useState } from 'react';

// A few helpful suggestion chips
const SUGGESTIONS = [
  'What is quantum computing?',
  'Explain black holes simply',
  'History of the internet',
  'How does photosynthesis work?'
];

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  const handleSuggestion = (s) => {
    if (disabled) return;
    onSend(s);
  };

  return (
    <div style={styles.wrapper}>
      {/* Search suggestions */}
      <div style={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={disabled}
            style={styles.chip}
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask anything..."
          disabled={disabled}
          style={styles.input}
        />
        <button type="submit" disabled={disabled || !text.trim()} style={styles.sendBtn}>
          {disabled ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '0.8rem 1.5rem 1.2rem',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)'
  },
  suggestions: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    marginBottom: 10,
    paddingBottom: 4
  },
  chip: {
    flexShrink: 0,
    padding: '0.35rem 0.75rem',
    borderRadius: 20,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-muted)',
    fontSize: 12,
    whiteSpace: 'nowrap'
  },
  form: {
    display: 'flex',
    gap: 10
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: 12,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none'
  },
  sendBtn: {
    padding: '0.75rem 1.3rem',
    borderRadius: 12,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15
  }
};
