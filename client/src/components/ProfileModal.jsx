export default function ProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>👤 Profile</h2>

        <div style={styles.avatarBig}>
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div style={styles.info}>
          <div style={styles.row}>
            <span style={styles.label}>Name</span>
            <span>{user.name}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span>{user.email}</span>
          </div>
          {user.createdAt && (
            <div style={styles.row}>
              <span style={styles.label}>Joined</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <button onClick={onClose} style={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'var(--surface)',
    borderRadius: 16,
    padding: '1.8rem',
    width: '90%',
    maxWidth: 340,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '1.2rem'
  },
  avatarBig: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 600,
    margin: '0 auto 1.2rem'
  },
  info: {
    textAlign: 'left',
    marginBottom: '1.5rem'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border)',
    fontSize: 14
  },
  label: {
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  closeBtn: {
    width: '100%',
    padding: '0.7rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  }
};
