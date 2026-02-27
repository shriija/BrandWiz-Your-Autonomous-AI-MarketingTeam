
import React from 'react';
import { Agent, AgentStatus } from '../types';

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onViewDetails }) => {
  return (
    <div className="bg-[#141417] border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-[#00d8ff] hover:neon-glow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#1e1e24] rounded-lg text-[#00d8ff] group-hover:scale-110 transition-transform">
          {agent.icon}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          agent.status === AgentStatus.IDLE 
            ? 'bg-gray-900 text-gray-400 border-gray-700' 
            : 'bg-cyan-900/30 text-cyan-400 border-cyan-800'
        }`}>
          {agent.status}
        </span>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
        <p className="text-sm font-medium text-[#00d8ff] mb-3 opacity-80">{agent.role}</p>
        <p className="text-gray-400 text-sm line-clamp-3 mb-6">
          {agent.description}
        </p>
      </div>

      <button
        onClick={() => onViewDetails(agent)}
        className="w-full py-3 bg-transparent border border-gray-700 hover:border-[#00d8ff] hover:text-[#00d8ff] text-gray-300 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-[#00d8ff]/5"
      >
        View Details
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default AgentCard;
