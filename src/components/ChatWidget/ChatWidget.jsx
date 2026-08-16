import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, LogIn } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './ChatWidget.scss';

// Helper: extract string ID from any format (string, ObjectId, populated object)
const getId = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (val._id) return String(val._id);
  return String(val);
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([{
    message: "Hello! Welcome to Ray's Healthy Living. How may I help you today?",
    senderId: 'system',
    timestamp: new Date(),
    isWelcome: true
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  let decodedToken = null;
  try {
    decodedToken = token ? jwtDecode(token) : null;
    // Check if token is expired
    if (decodedToken?.exp && decodedToken.exp * 1000 < Date.now()) {
      decodedToken = null;
      localStorage.removeItem('userToken');
    }
  } catch (e) {
    decodedToken = null;
    localStorage.removeItem('userToken');
  }
  const isLoggedIn = !!decodedToken?.id?._id;
  const userId = decodedToken?.id?._id || null;

  useEffect(() => {
    // Don't try to connect to socket if we're in demo mode or if API is failing
    let newSocket = null;
    
    try {
      newSocket = io(import.meta.env.VITE_BASE_URL, {
        timeout: 5000,
        transports: ['websocket', 'polling']
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
        if (userId) newSocket.emit('join-room', userId);
        newSocket.emit('check-admin-status');
      });

      newSocket.on('connect_error', (error) => {
        console.log('Socket connection failed:', error.message);
        setIsConnected(false);
        setIsAdminOnline(false);
      });

      newSocket.on('admin-online-status', (data) => {
        setIsAdminOnline(data.isOnline);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setIsAdminOnline(false);
      });

      newSocket.on('receive-message', (data) => {
        const receiverId = getId(data.receiverId);
        // Only accept messages meant for this user
        if (receiverId !== userId && String(receiverId) !== String(userId)) return;

        setMessages(prev => {
          const exists = prev.some(m =>
            m.message === data.message &&
            getId(m.senderId) === getId(data.senderId) &&
            Math.abs(new Date(m.timestamp) - new Date(data.timestamp)) < 2000
          );
          if (exists) return prev;
          return [...prev, data];
        });
      });
    } catch (error) {
      console.log('Failed to initialize socket connection:', error);
      setIsConnected(false);
      setIsAdminOnline(false);
    }

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [userId]);

  // Reset messages to greeting when widget is closed
  useEffect(() => {
    if (!isOpen) {
      setMessages([{
        message: "Hello! Welcome to Ray's Healthy Living. How may I help you today?",
        senderId: 'system',
        timestamp: new Date(),
        isWelcome: true
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !isLoggedIn) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/chat/send`, {
        receiverId: 'admin',
        message: newMessage,
        senderId: userId
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (socket && isConnected) {
        socket.emit('send-message', response.data);
      }
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // If API is unavailable, add message locally for demo purposes
      if (error.response?.status === 429 || error.code === 'ECONNREFUSED' || !error.response) {
        const localMessage = {
          message: newMessage,
          senderId: userId,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, localMessage]);
        
        // Add an auto-response for demo purposes
        setTimeout(() => {
          setMessages(prev => [...prev, {
            message: "Thank you for your message! We're currently experiencing high traffic but we'll get back to you soon.",
            senderId: 'system',
            timestamp: new Date()
          }]);
        }, 1000);
        
        setNewMessage('');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('userToken');
        navigate('/auth/login');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple alignment logic:
  // - 'system' messages → received (left)
  // - Messages with role 'admin' → received (left)
  // - Everything else → sent (right)
  const isMyMessage = (msg) => {
    if (msg.senderId === 'system' || msg.isWelcome) return false;
    if (msg.senderId?.role === 'admin') return false;
    if (msg.senderId === 'admin') return false;
    return true;
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chat-widget-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open live chat support"
          aria-haspopup="dialog"
        >
          <MessageCircle size={28} />
          <span className="pulse-ring" aria-hidden="true"></span>
        </button>
      )}

      {isOpen && (
        <div className={`chat-widget-container ${isMinimized ? 'minimized' : ''}`}>
          <div className="chat-widget-header">
            <div className="header-content">
              <MessageCircle size={22} />
              <div>
                <h3>Chat Support</h3>
                <span className={`status ${isAdminOnline ? 'online' : 'offline'}`}>
                  {isAdminOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? "Expand chat" : "Minimize chat"}>
                <Minimize2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-widget-messages">
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <MessageCircle size={48} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`message ${isMyMessage(msg) ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        <p>{msg.message}</p>
                        <span className="time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {isLoggedIn ? (
                <div className="chat-widget-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                  >
                    <Send size={18} />
                  </button>
                </div>
              ) : (
                <div className="chat-widget-input" style={{ justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => navigate('/auth/login')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>
                    <LogIn size={18} />
                    <span>Please login to send messages</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
