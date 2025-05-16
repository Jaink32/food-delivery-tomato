import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./ChatWidget.css";

const BASE_URL =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [userId] = useState(
    () =>
      localStorage.getItem("userId") || Math.random().toString(36).substring(7)
  );
  const messagesEndRef = useRef(null);

  const loadChatHistory = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/api/chat/history/${userId}`
      );
      if (response.data && Array.isArray(response.data)) {
        // Sort messages by timestamp in ascending order
        const sortedMessages = [...response.data].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setError("Failed to load chat history. Please try again.");
      setMessages([]);
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen, userId, loadChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get(`${BASE_URL}/api/chat/status`);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    if (isOpen) {
      checkConnection();
      const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 1000)
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = inputMessage.trim();
    if (!messageText) return;

    try {
      setError(null);
      setInputMessage("");

      // Add user message immediately
      const tempUserMessage = {
        isBot: false,
        message: messageText,
        timestamp: new Date(),
        temporary: true,
      };

      setMessages((prev) => [...prev, tempUserMessage]);

      // Show typing indicator
      await simulateTyping();

      const response = await axios.post(`${BASE_URL}/api/chat/send`, {
        userId,
        message: messageText,
      });

      if (response.data) {
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.temporary),
          response.data.userMessage,
          response.data.botMessage,
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      // Remove the temporary message
      setMessages((prev) => prev.filter((msg) => !msg.temporary));
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (msg, index) => {
    if (!msg || !msg.message) return null;

    const messageContent = msg.message.split("\n").map((line, i) => (
      <div key={i} className="message-line">
        {line.startsWith("•") ? <div className="food-item">{line}</div> : line}
      </div>
    ));

    return (
      <div
        key={index}
        className={`message-wrapper ${msg.isBot ? "bot" : "user"}`}
      >
        {msg.isBot && (
          <div className="bot-avatar">
            <span role="img" aria-label="bot">
              🍅
            </span>
          </div>
        )}
        <div className={`message ${msg.isBot ? "bot" : "user"}`}>
          <div className="message-content">{messageContent}</div>
          <div className="message-timestamp">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-widget">
      <button
        className={`chat-widget-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <div className="chat-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                fill="currentColor"
              />
              <path
                d="M7 9H17M7 12H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="notification-dot"></span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="chat-widget-container">
          <div className="chat-header">
            <h3>
              <span className="header-icon">🍅</span>
              Tomato Food Assistant
              <span
                className={`status-indicator ${
                  isOnline ? "online" : "offline"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </h3>
            <button
              className="mobile-close-button"
              onClick={handleClose}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && !error && (
              <div className="welcome-message">
                <div className="bot-avatar">
                  <span role="img" aria-label="bot">
                    🍅
                  </span>
                </div>
                <div className="message bot">
                  <div className="message-content">
                    {isOnline
                      ? "Hello! I'm your Tomato Food Assistant. I can help you find delicious food, track your order, or answer any questions. What would you like to eat today?"
                      : "I'm currently offline. Please try again later or contact our customer support at support@tomato.com"}
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="error-message">
                <div className="message bot error">
                  <div className="message-content">{error}</div>
                </div>
              </div>
            )}
            {messages.map((msg, index) => renderMessage(msg, index))}
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="bot-avatar">
                  <span role="img" aria-label="bot">
                    🍅
                  </span>
                </div>
                <div className="message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isOnline
                  ? "Ask about our menu or type a food you'd like..."
                  : "Chat is currently offline"
              }
              className="chat-input"
              disabled={!isOnline}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isTyping || !isOnline}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
