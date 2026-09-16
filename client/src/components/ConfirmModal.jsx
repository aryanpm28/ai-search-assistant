export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            Clear
          </button>
        </div>
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
    padding: '1.5rem',
    width: '90%',
    maxWidth: 360,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)'
  },
  title: {
    fontSize: '1.15rem',
    marginBottom: 8
  },
  message: {
    color: 'var(--text-muted)',
    fontSize: 14,
    marginBottom: '1.4rem',
    lineHeight: 1.5
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end'
  },
  cancelBtn: {
    padding: '0.55rem 1.1rem',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 14,
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '0.55rem 1.1rem',
    borderRadius: 8,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer'
  }
};
