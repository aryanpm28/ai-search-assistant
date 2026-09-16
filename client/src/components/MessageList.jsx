import ReactMarkdown from 'react-markdown';

export default function MessageList({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ color: 'var(--text-muted)' }}>Send a message to start chatting</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {messages.map((msg, i) => (
        <div
          key={msg._id || i}
          style={{
            ...styles.row,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <div
            style={{
              ...styles.bubble,
              background: msg.role === 'user' ? 'var(--user-bubble)' : 'var(--assistant-bubble)',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16
            }}
          >
            {msg.role === 'assistant' ? (
              <div className="markdown">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            )}

            {/* Show Wikipedia sources under assistant messages */}
            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div style={styles.sources}>
                <strong style={{ fontSize: 12 }}>Sources:</strong>
                <ul style={styles.sourceList}>
                  {msg.sources.map((s, idx) => (
                    <li key={idx}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    display: 'flex',
    width: '100%'
  },
  bubble: {
    maxWidth: '75%',
    padding: '0.75rem 1rem',
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 1.55,
    boxShadow: 'var(--shadow)'
  },
  sources: {
    marginTop: 10,
    paddingTop: 8,
    borderTop: '1px solid rgba(0,0,0,0.08)',
    fontSize: 13
  },
  sourceList: {
    margin: '4px 0 0 0',
    paddingLeft: 18
  }
};
