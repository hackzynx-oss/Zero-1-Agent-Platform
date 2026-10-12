import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiMenu, FiX, FiPlus, FiSettings, FiCopy, FiDownload, FiMaximize2, FiSearch } from 'react-icons/fi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { GiThink } from 'react-icons/gi';
import { BsRobot } from 'react-icons/bs';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: Date;
  updated_at: Date;
  messages: Message[];
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [focusLevel, setFocusLevel] = useState(100);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiReady, setApiReady] = useState(false);

  const API_URL = '/api'; // Use relative path for proxy

  // Check API health on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        setApiReady(true);
      } catch (error) {
        console.error('API not ready:', error);
        setApiReady(false);
      }
    };
    checkApi();
  }, []);

  // Initialize
  useEffect(() => {
    if (!apiReady) return;
    
    loadConversations();
    if (id) {
      loadConversation(id);
    } else {
      createNewConversation();
    }
  }, [id, apiReady]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (convId: string) => {
    try {
      const response = await axios.get(`${API_URL}/conversations/${convId}`);
      setCurrentConversation(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const title = `Chat ${new Date().toLocaleTimeString()}`;
      const response = await axios.post(`${API_URL}/conversations/new`, { title });
      const newConv = response.data;
      setCurrentConversation(newConv);
      setMessages([]);
      navigate(`/conversation/${newConv.id}`);
      loadConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentConversation || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/agent/chat`, {
        conversationId: currentConversation.id,
        message: messageContent,
        thinkingMode,
        focusLevel,
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.data.response,
        thinking: response.data.thinking,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🎯 Zero 1 encountered a processing error. Attempting recovery...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => console.error('Copy error:', err));
  };

  const downloadConversation = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}:\n${m.content}\n`).join('\n---\n\n');
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', `conversation_${currentConversation?.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputValue(`File: ${e.target.files![0].name}\n\n${content}`);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  if (!apiReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-400">
        <div className="text-center">
          <BsRobot className="text-6xl mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">Zero 1 Initializing</h1>
          <p className="text-gray-500">Connecting to server... Make sure backend is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-900 border-r border-green-500/20' : 'bg-gray-100 border-r border-green-500/20'} overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-green-500/20">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 rounded border border-green-500/30 transition-all"
          >
            <FiPlus /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/conversation/${conv.id}`)}
              className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-all ${
                currentConversation?.id === conv.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>

        <div className="border-t border-green-500/20 p-4 space-y-2">
          <button
            onClick={() => navigate('/history')}
            className="w-full text-left px-3 py-2 rounded text-sm hover:bg-green-500/10 hover:text-green-400 transition-all"
          >
            📋 History
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full text-left px-3 py-2 rounded text-sm hover:bg-green-500/10 hover:text-green-400 transition-all"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-900 border-b border-green-500/20' : 'bg-gray-100 border-b border-green-500/20'} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-green-400 hover:text-green-300 transition-all"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <BsRobot className="text-green-400 text-2xl" />
              <div>
                <h1 className="text-xl font-bold text-green-400">Zero 1</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Black Hat Logic Mode</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-green-500/10 text-green-400 transition-all"
            >
              {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            </button>
            <button
              onClick={downloadConversation}
              className="p-2 rounded hover:bg-green-500/10 text-green-400 transition-all"
              title="Download Conversation"
            >
              <FiDownload size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BsRobot className="text-6xl text-green-500/30 mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Zero 1 Ready</h2>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Developed by Mustafa Abdullah<br />
                Maximum Thinking Mode Enabled
              </p>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-green-500/10 border border-green-500/50 text-green-100'
                    : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-200 border border-gray-300'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <BsRobot size={16} className="text-green-400" />
                    <span className="text-xs text-green-400 font-mono">ZERO_1_AGENT</span>
                  </div>
                )}

                <div className="prose prose-invert max-w-none break-words">
                  <ReactMarkdown
                    components={{
                      code: ({ node, inline, className, children, ...props }: any) => {
                        if (!inline) {
                          return (
                            <pre className="bg-black/50 rounded p-3 my-2 overflow-x-auto border border-green-500/30">
                              <code className="text-green-400 font-mono text-sm">
                                {children}
                              </code>
                            </pre>
                          );
                        }
                        return <code className="bg-black/30 px-1 rounded text-green-300">{children}</code>;
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {message.thinking && showThinking && (
                  <div
                    className={`mt-3 pt-3 border-t border-gray-600 text-xs ${
                      expandedMessage === message.id ? '' : 'line-clamp-2'
                    } cursor-pointer`}
                    onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                  >
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <GiThink size={14} />
                      <span>Thinking Process</span>
                    </div>
                    <div className={`text-gray-400 ${darkMode ? 'bg-black/30' : 'bg-gray-300'} p-2 rounded font-mono text-xs max-h-40 overflow-y-auto`}>
                      {message.thinking}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3 text-xs text-gray-500">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="hover:text-green-400 transition-colors flex items-center gap-1"
                  >
                    <FiCopy size={14} /> Copy
                  </button>
                  {message.role === 'assistant' && message.thinking && (
                    <button
                      onClick={() => copyToClipboard(message.thinking)}
                      className="hover:text-green-400 transition-colors flex items-center gap-1"
                    >
                      <FiCopy size={14} /> Copy Thinking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-green-500/20 rounded-lg p-4 animate-pulse-neon">
                <div className="flex items-center gap-2 text-green-400">
                  <GiThink className="animate-spin" />
                  <span className="text-sm">Zero 1 is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${darkMode ? 'bg-gray-900 border-t border-green-500/20' : 'bg-gray-100 border-t border-green-500/20'} p-6`}>
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Controls */}
            <div className="flex items-center justify-between text-xs text-gray-500 flex-wrap gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 hover:text-green-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thinkingMode}
                    onChange={(e) => setThinkingMode(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Deep Thinking</span>
                </label>
                <div className="flex items-center gap-2">
                  <GiThink />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusLevel}
                    onChange={(e) => setFocusLevel(Number(e.target.value))}
                    className="w-24"
                  />
                  <span>{focusLevel}%</span>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Upload File"
              >
                📎 Attach
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".txt,.json,.js,.ts,.jsx,.tsx,.py,.md"
              />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message... (4040 for full history)"
                className={`flex-1 px-4 py-3 rounded border transition-all focus:outline-none focus:border-green-400 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-6 py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiSend /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
