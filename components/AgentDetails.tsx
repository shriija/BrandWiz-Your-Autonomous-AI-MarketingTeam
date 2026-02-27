
import React from 'react';
import { Agent } from '../types';

interface AgentDetailsProps {
  agent: Agent;
  onClose: () => void;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agent, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Sidebar Content */}
      <div className="relative w-full max-w-xl bg-[#0e0e11] h-full shadow-2xl border-l border-gray-800 p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#1e1e24] rounded-xl text-[#00d8ff] border border-cyan-900/30">
              {agent.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{agent.name}</h2>
              <p className="text-[#00d8ff] font-medium">{agent.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors bg-gray-900/50 rounded-lg border border-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Professional Brief</h4>
            <p className="text-gray-300 leading-relaxed text-lg">
              {agent.description}
            </p>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Core Capabilities</h4>
            <div className="grid grid-cols-1 gap-4">
              {agent.features.map((feature, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#141417] border border-gray-800 flex gap-4 items-start">
                  <div className="mt-1 p-1 rounded-full bg-cyan-900/20 text-[#00d8ff]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{feature.title}</p>
                    <p className="text-sm text-gray-400 leading-snug">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-[#1a1a20] border border-cyan-900/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest text-[#00d8ff] font-bold mb-4">Sample Output: {agent.exampleOutput.title}</h4>
            <div className="space-y-3 relative z-10">
              {Array.isArray(agent.exampleOutput.content) ? (
                agent.exampleOutput.content.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-300">
                    <span className="text-cyan-500 font-mono">•</span>
                    <p>{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{agent.exampleOutput.content}"
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <button 
             onClick={onClose}
             className="w-full py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
          >
            Acknowledge Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
