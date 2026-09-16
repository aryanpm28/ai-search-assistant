import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ChatSidebar from '../components/ChatSidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import ProfileModal from '../components/ProfileModal';
import ConfirmModal from '../components/ConfirmModal';

export default function ChatPage({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [sending, setSending] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat list on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const loadChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChats(false);
    }
  };

  // ➕ New Chat
  const createNewChat = async () => {
    try {
      const res = await api.post('/chats');
      setChats((prev) => [res.data, ...prev]);
      setActiveChat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Open an existing chat
  const selectChat = async (chatId) => {
    try {
      const res = await api.get(`/chats/${chatId}`);
      setActiveChat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete entire chat
  const deleteChat = async (chatId) => {
    try {
      await api.delete(`/chats/${chatId}`);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) setActiveChat(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Rename chat
  const renameChat = async (chatId, newTitle) => {
    try {
      const res = await api.patch(`/chats/${chatId}`, { title: newTitle });
      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, title: res.data.title } : c))
      );
      if (activeChat?._id === chatId) {
        setActiveChat((prev) => ({ ...prev, title: res.data.title }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ Clear all messages in current chat
  const clearChat = async () => {
    if (!activeChat) return;
    try {
      const res = await api.delete(`/chats/${activeChat._id}/messages`);
      setActiveChat(res.data.chat);
      setShowClearConfirm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to clear chat');
    }
  };

  // Send a message → AI responds with sources
  const sendMessage = async (content) => {
    if (!content.trim() || sending) return;

    // Create chat if none is active
    let chat = activeChat;
    if (!chat) {
      const res = await api.post('/chats');
      chat = res.data;
      setChats((prev) => [chat, ...prev]);
      setActiveChat(chat);
    }

    // Optimistic UI
    const tempUserMsg = { role: 'user', content, _id: 'temp-' + Date.now() };
    setActiveChat((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), tempUserMsg]
    }));

    setSending(true);
    try {
      const res = await api.post(`/chats/${chat._id}/message`, { content });

      setActiveChat((prev) => {
        const msgs = prev.messages.filter((m) => m._id !== tempUserMsg._id);
        return {
          ...prev,
          title: res.data.title,
          messages: [...msgs, { role: 'user', content }, res.data.message]
        };
      });

      // Update title in sidebar
      setChats((prev) =>
        prev.map((c) => (c._id === chat._id ? { ...c, title: res.data.title } : c))
      );
    } catch (err) {
      console.error(err);
      setActiveChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m._id !== tempUserMsg._id)
      }));
      alert(err.response?.data?.message || 'Failed to get AI response');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeId={activeChat?._id}
        onSelect={selectChat}
        onNew={createNewChat}
        onDelete={deleteChat}
        onRename={renameChat}
        loading={loadingChats}
        user={user}
        onLogout={logout}
        onShowProfile={() => setShowProfile(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main chat area */}
      <main style={styles.main}>
        {activeChat ? (
          <>
            <header style={styles.header}>
              <h2 style={styles.headerTitle}>{activeChat.title || 'Chat'}</h2>
              {activeChat.messages?.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  style={styles.clearBtn}
                  title="Clear all messages"
                >
                  🗑️ Clear
                </button>
              )}
            </header>

            <MessageList messages={activeChat.messages || []} />
            <div ref={messagesEndRef} />
            <ChatInput onSend={sendMessage} disabled={sending} />
          </>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🤖</div>
            <h2>Start a conversation</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Ask anything — answers come with Wikipedia sources
            </p>
            <button onClick={createNewChat} style={styles.newBtn}>
              + New Chat
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}

      {showClearConfirm && (
        <ConfirmModal
          title="Clear this chat?"
          message="All messages in this conversation will be removed. This cannot be undone."
          onConfirm={clearChat}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)'
  },
  header: {
    padding: '0.9rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1
  },
  clearBtn: {
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-muted)',
    fontSize: 13,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center'
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  newBtn: {
    marginTop: 20,
    padding: '0.7rem 1.4rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  }
};
