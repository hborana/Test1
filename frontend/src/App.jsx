import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WeatherWidget from './components/WeatherWidget';
import URLViewer from './components/URLViewer';
import TimeDisplay from './components/TimeDisplay';
import TroubleshootingWidget from './components/TroubleshootingWidget';
import BatteryUsageWidget from './components/BatteryUsageWidget';
import VideoPlayerWidget from './components/VideoPlayerWidget';

const API_URL = 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'light'
    return localStorage.getItem('surface-theme') || 'light';
  });
  const messagesEndRef = useRef(null);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Save theme preference
    localStorage.setItem('surface-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: messageText,
        conversationHistory: messages,
      });

      const { type, message, toolName, toolResult } = response.data;

      if (type === 'tool_call') {
        // Add assistant message with tool result
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: message || 'Here\'s what I found:',
          toolName,
          toolResult,
        }]);
      } else {
        // Regular text response
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: message,
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderToolResult = (toolName, toolResult) => {
    console.log('🔍 Rendering tool:', toolName, toolResult);

    switch (toolName) {
      case 'get_weather':
        return <WeatherWidget data={toolResult} />;
      case 'open_url':
        return <URLViewer data={toolResult} />;
      case 'get_current_time':
        return <TimeDisplay data={toolResult} />;
      case 'get_troubleshooting':
        return <TroubleshootingWidget data={toolResult} />;
      case 'get_battery_usage':
        return <BatteryUsageWidget data={toolResult} />;
      case 'play_video':
        return <VideoPlayerWidget data={toolResult} />;
      default:
        return (
          <pre style={{
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
            {JSON.stringify(toolResult, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="app">
      <div className="header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            // Moon icon for light mode (click to go dark)
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            // Sun icon for dark mode (click to go light)
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
        <h1>Surface</h1>
        <p>Chat with AI that can check weather, open URLs, and more!</p>
      </div>

      <div className="chat-container">
        {messages.length === 0 && (
          <div className="examples">
            <h3>Try asking:</h3>
            <div className="example-buttons">
              <button className="example-btn" onClick={() => sendMessage("What's the weather in San Francisco?")}>
                What's the weather in San Francisco?
              </button>
              <button className="example-btn" onClick={() => sendMessage("How does my battery usage look like?")}>
                How does my battery usage look like?
              </button>
              <button className="example-btn" onClick={() => sendMessage("Play a video")}>
                Play a video
              </button>
              <button className="example-btn" onClick={() => sendMessage("Open apple.com")}>
                Open apple.com
              </button>
              <button className="example-btn" onClick={() => sendMessage("What time is it?")}>
                What time is it?
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className="message-content">
              {msg.content}
              {msg.toolResult && (
                <div style={{ marginTop: '12px' }}>
                  {renderToolResult(msg.toolName, msg.toolResult)}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about weather, open a URL, or anything else..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
