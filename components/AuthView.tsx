
import React, { useState } from 'react';

interface AuthViewProps {
  type: 'login' | 'signup';
  onSuccess: () => void;
  onBack: () => void;
  onSwitch: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ type, onSuccess, onBack, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In this UI-only phase, we just proceed
    onSuccess();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 animate-in zoom-in-95 duration-300">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <div className="w-full max-w-md bg-[#141417] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {type === 'login' ? 'Access your marketing intelligence' : 'Start your AI-powered growth journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#0b0f14] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d8ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0b0f14] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d8ff] transition-colors"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            {type === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            {type === 'login' ? "Don't have an account?" : "Already have an account?"}
            {' '}
            <button 
              onClick={onSwitch}
              className="text-[#00d8ff] hover:underline font-medium"
            >
              {type === 'login' ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
