import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrash2, FiCopy, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  message_count?: number;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'long'>('all');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations`);
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (window.confirm('Delete this conversation?')) {
      try {
        await axios.delete(`${API_URL}/conversations/${id}`);
        loadConversations();
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const downloadAllConversations = () => {
    const text = conversations
      .map(conv => {
        const msgs = conv.messages?.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') || '';
        return `=== ${conv.title} ===\n${msgs}\n`;
      })
      .join('\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', 'all_conversations.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'recent') {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(conv.updated_at) > dayAgo;
    }
    if (filter === 'long') {
      return matchesSearch && (conv.message_count || 0) > 10;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Chat
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-4">🖤 Conversation History</h1>
          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:border-green-400 focus:outline-none"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:border-green-400 focus:outline-none"
            >
              <option value="all">All Conversations</option>
              <option value="recent">Last 24 Hours</option>
              <option value="long">Long Conversations</option>
            </select>
            <button
              onClick={downloadAllConversations}
              className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500/30 transition-all flex items-center gap-2"
            >
              <FiDownload /> Export All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No conversations found</div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className="bg-gray-900 border border-green-500/20 rounded-lg p-4 hover:border-green-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/conversation/${conv.id}`)}
                    >
                      <h3 className="text-lg font-semibold text-green-400 hover:underline">{conv.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(conv.created_at).toLocaleString()} • {conv.message_count} messages • Model: {conv.model}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-all"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {conv.messages && conv.messages.length > 0 && (
                    <div className="bg-black/30 rounded p-3 max-h-32 overflow-y-auto text-sm text-gray-400">
                      {conv.messages.slice(0, 3).map((msg, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <span className="text-green-400 font-mono text-xs">{msg.role.toUpperCase()}</span>
                          <p className="truncate">{msg.content}</p>
                        </div>
                      ))}
                      {conv.messages.length > 3 && (
                        <p className="text-xs text-gray-600 mt-2">+{conv.messages.length - 3} more messages...</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
