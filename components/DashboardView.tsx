
import React from 'react';
import { AGENTS } from '../constants';
import { Agent } from '../types';
import AgentCard from './AgentCard';

interface DashboardViewProps {
  onLogout: () => void;
  onNavigateToAgent: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onLogout, onNavigateToAgent }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-[#0b0f14]/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00d8ff] to-[#005f73] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">BrandWiz</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#00d8ff] font-bold mt-1">AI Marketing Agents</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-white border-b-2 border-[#00d8ff] py-1">Agents</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Strategy</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Creative</a>
          </nav>

          <div className="flex items-center gap-4">
             <button 
               onClick={onLogout}
               className="text-gray-400 hover:text-white text-sm font-medium transition-colors mr-4"
             >
               Log Out
             </button>
             <button className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                <img src="https://picsum.photos/32/32" alt="Avatar" className="w-full h-full object-cover" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Active Agents</h2>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            Collaborate with specialized intelligence units to dominate your market. Select an agent to enter their dedicated workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onViewDetails={(a) => onNavigateToAgent(a.id)}
            />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Network Integrity', value: 'Optimal' },
            { label: 'Active Insights', value: '42.1k' },
            { label: 'Agent Sync', value: 'Verified' }
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-[#141417] border border-gray-800/60 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-mono text-white font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardView;
