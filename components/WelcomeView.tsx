
import React from 'react';

interface WelcomeViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[#00d8ff] to-[#005f73] rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/40 mx-auto mb-6">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4">
          Brand<span className="text-[#00d8ff]">Wiz</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
          Your autonomous AI marketing team — research, strategy, copy, and design, synchronized in a single neural workspace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <button
          onClick={onGetStarted}
          className="px-10 py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          Get Started
        </button>
        <button
          onClick={onLogin}
          className="px-10 py-4 bg-transparent border border-gray-700 hover:border-[#00d8ff] hover:text-[#00d8ff] text-white font-bold rounded-xl transition-all active:scale-95"
        >
          Log In
        </button>
      </div>

      <div className="mt-20 flex gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="text-xs font-bold uppercase tracking-[0.3em]">Scalable</div>
        <div className="text-xs font-bold uppercase tracking-[0.3em]">Autonomous</div>
        <div className="text-xs font-bold uppercase tracking-[0.3em]">Precision</div>
      </div>
    </div>
  );
};

export default WelcomeView;
