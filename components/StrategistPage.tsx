
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TREND_SPOTTER_INTEL } from '../constants';

interface StrategistPageProps {
  onBack: () => void;
  initialContext?: { 
    niche: string; 
    location: string; 
    trend: string; 
    goal: string;
    primaryGoal?: 'Awareness' | 'Foot Traffic' | 'Engagement' | 'Sales Push';
    confidences?: { trend: number; strategy: number; copy: number; art: number };
  } | null;
  onPushToCopywriter?: (context: any) => void;
}

const STRATEGY_STEPS = [
  "Retrieving trend intelligence data...",
  "Analyzing specific marketing goals...",
  "Mapping customer journey phases...",
  "Calculating resource requirements...",
  "Optimizing multi-channel touchpoints...",
  "Synthesizing 5-day execution roadmap...",
  "Finalizing growth KPIs and benchmarks..."
];

const StrategistPage: React.FC<StrategistPageProps> = ({ onBack, initialContext, onPushToCopywriter }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [showPlan, setShowPlan] = useState(true);
  const [niche, setNiche] = useState(initialContext?.niche || TREND_SPOTTER_INTEL.grounding.niche);
  const [location, setLocation] = useState(initialContext?.location || TREND_SPOTTER_INTEL.grounding.location);
  const [goal, setGoal] = useState(initialContext?.goal || TREND_SPOTTER_INTEL.grounding.goal);
  const [primaryGoal, setPrimaryGoal] = useState(initialContext?.primaryGoal || 'Awareness');
  const [inputTrend, setInputTrend] = useState(initialContext?.trend || "The Mid-Week Remote Work Sanctuary Shift");
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(94.5);

  const [activeStrategy, setActiveStrategy] = useState({
    planName: "The Productivity Anchor Campaign",
    summary: "A focused growth strategy designed to capture remote workers during mid-week mobility slumps.",
    phases: [
      { day: 1, task: "Atmosphere Prep", objective: "Optimize space for quiet focus sessions." },
      { day: 2, task: "Soft Launch", objective: "Invite local influencers for 'Work With Me' sessions." },
      { day: 3, task: "Broad Deployment", objective: "Launch geo-fenced social ads targeting tech hubs." },
      { day: 4, task: "Engagement Spike", objective: "Host live Q&A or niche networking hour." },
      { day: 5, task: "Retention Loop", objective: "Deploy 'Focus Loyalty' cards for repeat visitors." }
    ],
    resourceAllocation: [
      { category: "Visual Content", percentage: 40 },
      { category: "Community Outreach", percentage: 30 },
      { category: "Paid Traffic", percentage: 20 },
      { category: "Operations", percentage: 10 }
    ],
    kpis: [
      { metric: "Foot Traffic Increase", target: "+25% Mid-week" },
      { metric: "Average Order Value", target: "+15% via Bundles" }
    ]
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logMessages]);

  const runStrategyGeneration = async () => {
    setIsProcessing(true);
    setShowPlan(false);
    setLogMessages(["[SYSTEM] Initializing Growth Engine..."]);

    let step = 0;
    const logInterval = setInterval(() => {
      if (step < STRATEGY_STEPS.length - 1) {
        setLogMessages(prev => [...prev, `[PLANNING] ${STRATEGY_STEPS[step]}`]);
        setCurrentStep(STRATEGY_STEPS[step]);
        step++;
      }
    }, 700);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Architect a growth strategy for a ${niche} business located in ${location}. 
                   The primary marketing goal is: "${goal}".
                   Primary Objective: ${primaryGoal}.
                   This plan must be built around the following trend analysis: "${inputTrend}". 
                   Synthesize a coherent 5-day campaign roadmap that maximizes ROI for this specific goal.
                   Also provide a strategy confidence score (0-100) based on trend alignment.`,
        config: {
          systemInstruction: `You are the BrandWiz Strategist Agent. You specialize in high-impact growth operations and campaign architecture. 
                              Your core function is to synthesize market trends and business goals into executable, multi-day plans.
                              Focus on:
                              1. Operational feasibility (Can a real small/medium business do this?).
                              2. Logical progression (Day 1 must set up Day 2).
                              3. Clear Success Metrics (KPIs).
                              Ensure the output is high-fidelity and professional.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              planName: { type: Type.STRING },
              summary: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              phases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    task: { type: Type.STRING },
                    objective: { type: Type.STRING }
                  },
                  required: ["day", "task", "objective"]
                }
              },
              resourceAllocation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    percentage: { type: Type.NUMBER }
                  },
                  required: ["category", "percentage"]
                }
              },
              kpis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    metric: { type: Type.STRING },
                    target: { type: Type.STRING }
                  },
                  required: ["metric", "target"]
                }
              }
            },
            required: ["planName", "summary", "phases", "resourceAllocation", "kpis"]
          }
        }
      });

      clearInterval(logInterval);
      const data = JSON.parse(response.text || '{}');
      setActiveStrategy(data);
      if (data.confidenceScore) setConfidence(data.confidenceScore);
      setLogMessages(prev => [...prev, "[SUCCESS] Strategy synchronized with market intelligence."]);
      setShowPlan(true);
    } catch (error: any) {
      console.error("Strategy synthesis failed:", error);
      const isQuotaError = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
      
      if (isQuotaError) {
        setLogMessages(prev => [...prev, "[ERROR] API Quota Exhausted (429). Please select a paid API key with billing enabled."]);
        if (window.aistudio) {
          const retry = confirm("API Quota Exhausted. Would you like to select a different API key or check your billing settings?");
          if (retry) window.aistudio.openSelectKey();
        }
      } else {
        setLogMessages(prev => [...prev, "[ERROR] Strategy engine timeout. Reverting to backup protocols."]);
      }
      setShowPlan(true);
    } finally {
      setIsProcessing(false);
      clearInterval(logInterval);
    }
  };

  const handlePush = () => {
    if (onPushToCopywriter) {
      onPushToCopywriter({
        niche,
        location,
        goal,
        primaryGoal,
        trend: inputTrend,
        confidences: { 
          ...initialContext?.confidences, 
          strategy: confidence 
        },
        strategy: {
          planName: activeStrategy.planName,
          phases: activeStrategy.phases
        }
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="sticky top-0 z-40 bg-[#0b0f14]/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Strategist Agent</h1>
                <p className="text-xs text-[#00d8ff] font-bold uppercase tracking-widest mt-1">Growth & Ops Architect</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00d8ff]/10 border border-[#00d8ff]/20 text-[#00d8ff] text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d8ff] animate-pulse"></span>
            Gemini 3 Pro Active
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-[#141417] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-6">Strategic Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Trend Context</label>
                  <textarea 
                    value={inputTrend} onChange={(e) => setInputTrend(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium h-24 resize-none"
                    placeholder="Describe the trend or paste intelligence..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Primary Goal</label>
                  <select 
                    value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value as any)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium appearance-none cursor-pointer"
                  >
                    <option value="Awareness">Awareness</option>
                    <option value="Foot Traffic">Foot Traffic</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Sales Push">Sales Push</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Marketing Context</label>
                  <input 
                    type="text" value={goal} onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium"
                    placeholder="e.g., Increase foot traffic"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Business Type</label>
                  <input 
                    type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium"
                  />
                </div>
                <button 
                  onClick={runStrategyGeneration} disabled={isProcessing}
                  className={`w-full py-4 mt-2 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                    isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#00d8ff] hover:bg-[#00c2e5] text-black shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isProcessing ? "Architecting..." : "Generate Strategy"}
                </button>
              </div>
            </section>

            {(isProcessing || logMessages.length > 0) && (
              <section className="bg-black/40 border border-gray-800 rounded-2xl p-4 font-mono text-[10px] h-[300px] flex flex-col shadow-inner">
                <div className="flex items-center justify-between mb-3 text-gray-500 uppercase tracking-widest font-bold">Process Stream</div>
                <div className="flex-grow overflow-y-auto space-y-1.5 scrollbar-hide opacity-80">
                  {logMessages.map((msg, i) => (
                    <div key={i} className={msg.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : msg.includes('[ERROR]') ? 'text-red-400' : 'text-gray-400'}>
                      <span className="text-gray-700 font-normal mr-1">&gt;</span>{msg}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-9 space-y-8">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
                 <div className="w-16 h-16 border-2 border-[#00d8ff] border-t-transparent rounded-full animate-spin mb-6"></div>
                 <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Calculating Growth Trajectories</h2>
                 <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">{currentStep}</p>
              </div>
            ) : showPlan ? (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                  <div className="md:col-span-8 bg-[#141417] border border-gray-800 rounded-2xl p-8">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#00d8ff] font-bold mb-2">Strategy Title</h2>
                    <h3 className="text-3xl font-black text-white mb-4">{activeStrategy.planName}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{activeStrategy.summary}</p>
                  </div>

                  <div className="md:col-span-4 bg-[#141417] border border-gray-800 rounded-2xl p-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6">Resource Allocation</h4>
                    <div className="space-y-4">
                      {activeStrategy.resourceAllocation.map((res, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300 font-medium">{res.category}</span>
                            <span className="text-[#00d8ff] font-bold">{res.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1 rounded-full">
                            <div className="bg-[#00d8ff] h-full rounded-full" style={{ width: `${res.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-12">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6 px-2">Campaign Roadmap</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {activeStrategy.phases.map((phase, i) => (
                        <div key={i} className="bg-[#141417] border border-gray-800 p-5 rounded-2xl hover:border-[#00d8ff]/40 transition-all group">
                          <div className="text-2xl font-black text-[#00d8ff]/20 group-hover:text-[#00d8ff]/50 transition-colors mb-2">0{phase.day}</div>
                          <h5 className="text-sm font-bold text-white mb-2">{phase.task}</h5>
                          <p className="text-[11px] text-gray-500 leading-tight">{phase.objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeStrategy.kpis.map((kpi, i) => (
                      <div key={i} className="bg-gradient-to-r from-[#141417] to-[#0b0f14] border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{kpi.metric}</p>
                          <p className="text-2xl font-black text-white">{kpi.target}</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#00d8ff]/5 border border-[#00d8ff]/20 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-[#00d8ff] font-bold uppercase tracking-widest">Strategist Conclusion</p>
                    <p className="text-[10px] text-gray-500 font-bold">CONFIDENCE: {confidence.toFixed(1)}%</p>
                  </div>
                  <p className="text-sm text-gray-400 italic leading-relaxed">
                    "This architecture prioritizes immediate goal capturing via operational efficiency. Recommended deployment window is the next 24 hours to match the trend's urgency signals."
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 text-gray-700">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Growth Engine Standby</h3>
                <p className="text-gray-400 max-w-sm text-sm">Update parameters to trigger Gemini 3 Pro strategy synthesis.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showPlan && !isProcessing && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#0b0f14]/80 backdrop-blur-xl border-t border-gray-800/60 z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agent Sync</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d8ff] animate-pulse"></span>
                  <span className="text-xs text-white font-bold">Strategy Synchronized</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-gray-800"></div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Deployment Target</p>
                <span className="text-xs text-gray-300 font-mono italic">{activeStrategy.planName}</span>
              </div>
            </div>
            <button 
              onClick={handlePush}
              className="px-10 py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-extrabold rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 group"
            >
              Push to Copywriter
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" /></svg>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default StrategistPage;
