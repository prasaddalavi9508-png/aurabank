import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! I am your FinTech assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking and responding
    setTimeout(() => {
      let botReply = "I'm sorry, I didn't quite catch that. Could you rephrase your question?";
      const lowerText = userMessage.text.toLowerCase();

      if (lowerText.includes("transfer") || lowerText.includes("send money")) {
        botReply = "To transfer money, head to the 'Overview' dashboard and use the 'Quick Transfer' widget! Just select a recipient, enter the amount, and hit send.";
      } else if (lowerText.includes("balance") || lowerText.includes("how much")) {
        botReply = "You can view your total balance dynamically at the top of your Overview Screen.";
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
        botReply = "Hello! I'm ready to assist you. What do you need help with today?";
      } else if (lowerText.includes("transactions") || lowerText.includes("history")) {
        botReply = "You can navigate to the 'Transactions' tab on the left sidebar to view a complete, search-able list of all your account activity.";
      } else if (lowerText.includes("settings") || lowerText.includes("profile")) {
        botReply = "Click on your Avatar in the top right corner or the Settings tab to manage your profile and preferences.";
      }

      const botMessage = { id: Date.now() + 1, sender: 'bot', text: botReply };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className={`chatbot-trigger ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </div>

      {/* Chatbot Window */}
      <div className={`chatbot-window glass-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <Bot size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Support Bot</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>● Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chatbot-message bot typing">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="chatbot-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="chatbot-send" disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
