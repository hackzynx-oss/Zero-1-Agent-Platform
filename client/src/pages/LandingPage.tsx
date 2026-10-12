import React from 'react';
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8 border-b border-green-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BsRobot className="text-4xl text-green-400" />
            <h1 className="text-3xl font-bold text-green-400">Zero 1</h1>
          </div>
          <a
            href="https://github.com/hackzynx-oss/Zero-1-Agent-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <FiGithub /> GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-green-400">Advanced AI</span><br />
                <span className="text-gray-300">Agent Platform</span>
              </h2>
              <p className="text-xl text-gray-400">
                Black Hat Logic Mode • Maximum Thinking Power
              </p>
            </div>

            <div className="space-y-4 text-lg text-gray-300">
              <p>🧠 Deep reasoning with 8000 thinking tokens</p>
              <p>💾 Persistent conversation storage</p>
              <p>⚡ Maximum performance & analysis</p>
              <p>🎨 Professional dark UI design</p>
              <p>🔧 Advanced file processing tools</p>
              <p>🔐 Secure & optimized backend</p>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-green-400 mb-3">Developed by</h3>
              <p className="text-2xl font-bold text-gray-200">Mustafa Abdullah</p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-8 py-4 rounded text-lg font-semibold transition-all group"
            >
              Start Chatting
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right side - Features */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-colors">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Black Hat Logic</h3>
              <p className="text-gray-400 text-sm">
                Direct, unfiltered, and razor-sharp analytical responses with zero nonsense approach.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-colors">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Maximum Thinking</h3>
              <p className="text-gray-400 text-sm">
                Up to 8000 thinking tokens for deep analysis and complex problem-solving.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-colors">
              <div className="text-3xl mb-2">💾</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Full History</h3>
              <p className="text-gray-400 text-sm">
                Complete conversation archive with search, export, and analysis capabilities.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-colors">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Advanced Tools</h3>
              <p className="text-gray-400 text-sm">
                File upload, code analysis, conversation search, and intelligent caching.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-500/20 py-8 px-6 text-center text-gray-500">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">🔥 Zero 1 Advanced AI Agent Platform</p>
          <p className="text-sm">Developed by Mustafa Abdullah © 2024 | Black Hat Logic Mode</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
