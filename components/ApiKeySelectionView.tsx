
import React from 'react';

interface ApiKeySelectionViewProps {
  onKeySelected: () => void;
  onBack: () => void;
}

const ApiKeySelectionView: React.FC<ApiKeySelectionViewProps> = ({ onKeySelected, onBack }) => {
  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      onKeySelected();
    } else {
      onKeySelected();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0f14]">
      <div className="max-w-md w-full bg-[#141417] border border-gray-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-[#00d8ff]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00d8ff]/20">
          <span className="text-3xl">🔑</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-4 tracking-tight">API Key Required</h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          To use the high-performance Gemini 3 Pro models for campaign generation, you must select a paid API key from your Google Cloud project.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleOpenSelectKey}
            className="w-full py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3"
          >
            Select API Key
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-[10px] text-gray-500 hover:text-[#00d8ff] uppercase tracking-widest font-bold transition-colors"
          >
            Learn about Gemini API Billing
          </a>
          
          <button 
            onClick={onBack}
            className="w-full py-3 bg-transparent border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 rounded-xl text-xs font-bold transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelectionView;
