import { useState } from 'react';

export default function ChatSidebar({
  chats,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  loading,
  user,
  onLogout,
  onShowProfile,
  theme,
  toggleTheme
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title || 'New Chat');
  };

  const saveRename = (e) => {
    e.preventDefault();
    if (editTitle.trim() && editingId) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = () => setEditingId(null);

  return (
    <aside style={styles.sidebar}>
      {/* Top actions */}
      <div style={styles.top}>
        <button onClick={onNew} style={styles.newBtn}>
          + New Chat
        </button>
        <button onClick={toggleTheme} style={styles.iconBtn} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Chat list */}
      <div style={styles.list}>
        {loading && <p style={styles.muted}>Loading chats...</p>}
        {!loading && chats.length === 0 && (
          <p style={styles.muted}>No chats yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            style={{
              ...styles.chatItem,
              ...(activeId === chat._id ? styles.active : {})
            }}
            onClick={() => editingId !== chat._id && onSelect(chat._id)}
          >
            {editingId === chat._id ? (
              /* Inline rename input */
              <form onSubmit={saveRename} style={styles.renameForm} onClick={(e) => e.stopPropagation()}>
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(e) => e.key === 'Escape' && cancelRename()}
                  style={styles.renameInput}
                />
              </form>
            ) : (
              <>
                <span style={styles.chatTitle} title={chat.title}>
                  {chat.title || 'New Chat'}
                </span>
                <div style={styles.actions}>
                  <button
                    onClick={(e) => startRename(e, chat)}
                    style={styles.actionBtn}
                    title="Rename"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this chat permanently?')) {
                        onDelete(chat._id);
                      }
                    }}
                    style={styles.actionBtn}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* User section */}
      <div style={styles.bottom}>
        <button onClick={onShowProfile} style={styles.userBtn} title="View profile">
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <span style={styles.userName}>{user?.name}</span>
        </button>
        <button onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  top: {
    padding: '0.8rem',
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid var(--border)'
  },
  newBtn: {
    flex: 1,
    padding: '0.55rem',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontWeight: 500,
    fontSize: 14
  },
  iconBtn: {
    width: 36,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    fontSize: 16
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '0.5rem'
  },
  muted: {
    color: 'var(--text-muted)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.55rem 0.7rem',
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: 2,
    gap: 6
  },
  active: {
    background: 'var(--assistant-bubble)'
  },
  chatTitle: {
    flex: 1,
    fontSize: 13,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  actions: {
    display: 'flex',
    gap: 2,
    opacity: 0.7
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1,
    padding: '2px 4px',
    cursor: 'pointer'
  },
  renameForm: { flex: 1 },
  renameInput: {
    width: '100%',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid var(--primary)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none'
  },
  bottom: {
    padding: '0.8rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text)',
    padding: 0
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 14
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 12,
    padding: '4px 8px',
    cursor: 'pointer'
  }
};
