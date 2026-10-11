import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSliders } from 'react-icons/fi';
import { GiThink } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [thinkingMode, setThinkingMode] = useState(true);
  const [focusLevel, setFocusLevel] = useState(100);
  const [apiStatus, setApiStatus] = useState<'active' | 'inactive' | 'loading'>('loading');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    checkApiStatus();
    loadSettings();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setApiStatus('active');
    } catch (error) {
      setApiStatus('inactive');
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/agent/settings`);
      setThinkingMode(response.data.thinking_mode);
      setFocusLevel(response.data.focus_level);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await axios.post(`${API_URL}/agent/settings`, {
        thinkingMode,
        focusLevel,
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Chat
        </button>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">⚙️ Agent Settings</h1>
            <p className="text-gray-500">Configure Zero 1 Advanced Parameters</p>
          </div>

          {/* API Status */}
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <FiSliders /> System Status
              </h2>
              <div className={`px-3 py-1 rounded text-sm font-mono ${
                apiStatus === 'active'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : apiStatus === 'loading'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {apiStatus === 'active' && '🟢 ONLINE'}
                {apiStatus === 'loading' && '🟡 CHECKING'}
                {apiStatus === 'inactive' && '🔴 OFFLINE'}
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>API Endpoint:</span>
                <span className="text-green-400 font-mono">localhost:5000</span>
              </div>
              <div className="flex justify-between">
                <span>Agent Name:</span>
                <span className="text-green-400 font-mono">Zero 1</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-green-400 font-mono">BLACK_HAT_LOGIC</span>
              </div>
              <div className="flex justify-between">
                <span>Developer:</span>
                <span className="text-green-400 font-mono">Mustafa Abdullah</span>
              </div>
            </div>
          </div>

          {/* Thinking Mode */}
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <GiThink /> Thinking Configuration
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={thinkingMode}
                  onChange={(e) => setThinkingMode(e.target.checked)}
                  className="w-5 h-5 accent-green-400"
                />
                <div>
                  <div className="text-green-400 font-semibold">Deep Thinking Mode</div>
                  <div className="text-sm text-gray-500">Enable advanced reasoning and analysis</div>
                </div>
              </label>

              <div>
                <label className="block text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <GiThink /> Focus Level: {focusLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={focusLevel}
                  onChange={(e) => setFocusLevel(Number(e.target.value))}
                  className="w-full accent-green-400"
                />
                <div className="text-xs text-gray-500 mt-2">
                  {focusLevel < 30 && 'Low Focus - Quick Responses'}
                  {focusLevel >= 30 && focusLevel < 70 && 'Balanced - Standard Responses'}
                  {focusLevel >= 70 && 'High Focus - Detailed Analysis'}
                </div>
              </div>
            </div>
          </div>

          {/* Model Information */}
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-400 mb-4">🤖 Model Configuration</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <span className="text-green-400 font-semibold">Model Name:</span>
                <p>Zero 1 (Proprietary Intelligence System)</p>
              </div>
              <div>
                <span className="text-green-400 font-semibold">Capabilities:</span>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
                  <li>Advanced Context Understanding</li>
                  <li>Deep Logical Analysis</li>
                  <li>File Processing & Code Analysis</li>
                  <li>Multi-turn Reasoning</li>
                  <li>Maximum Thinking Budget Allocation</li>
                </ul>
              </div>
              <div>
                <span className="text-green-400 font-semibold">Thinking Tokens:</span>
                <p>Up to 8000 tokens per response</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-semibold py-3 rounded transition-all"
          >
            Save Configuration
          </button>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-6">
            <p>🖤 Zero 1 Agent Platform</p>
            <p>Developed by Mustafa Abdullah © 2024</p>
            <p>Black Hat Logic Mode • Maximum Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
