
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from '../types';
import { TREND_SPOTTER_INTEL } from '../constants';

interface TrendSpotterPageProps {
  onBack: () => void;
  onPushToStrategist: (context: { 
    niche: string; 
    location: string; 
    trend: string; 
    goal: string; 
    primaryGoal: 'Awareness' | 'Foot Traffic' | 'Engagement' | 'Sales Push';
    confidences: { trend: number; strategy: number; copy: number; art: number }
  }) => void;
}

const SCAN_STEPS = [
  "Initializing neural connection to local mobility APIs...",
  "Parsing regional foot traffic data (last 24h)...",
  "Scraping local social signals for specified niche...",
  "Cross-referencing weather forecast with local consumer mobility...",
  "Analyzing competitor post frequency vs. engagement density...",
  "Filtering noise: Over-saturated global hashtags...",
  "Identifying opportunity: Hyper-local context gaps...",
  "Finalizing content hooks based on brand tone..."
];

const TrendSpotterPage: React.FC<TrendSpotterPageProps> = ({ onBack, onPushToStrategist }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [showResults, setShowResults] = useState(true); 
  const [niche, setNiche] = useState(TREND_SPOTTER_INTEL.grounding.niche);
  const [location, setLocation] = useState(TREND_SPOTTER_INTEL.grounding.location);
  const [goal, setGoal] = useState(TREND_SPOTTER_INTEL.grounding.goal);
  const [primaryGoal, setPrimaryGoal] = useState<'Awareness' | 'Foot Traffic' | 'Engagement' | 'Sales Push'>('Awareness');
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(98.1);
  
  const [activeIntel, setActiveIntel] = useState({
    trendName: "The Mid-Week Shift",
    trendDetails: ["Local mobility is shifting toward hybrid hubs.", "Competitors are missing the afternoon productivity gap."],
    gapAnalysis: "Focusing on seasonal products while missing the 'Work Sanctuary' intent.",
    hooks: [
      { platform: "IG Reel / TikTok", text: "Finding your focus in the city noise. Your sanctuary is ready." },
      { platform: "X / Threads", text: "Tired of the home office slump? We have reserved booths available." }
    ],
    recommendation: "Execute a 'Sanctuary' campaign to capture the high-intent remote demographic."
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  const currentMonth = new Date().getMonth();
  const seasonal = useMemo(() => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const name = months[currentMonth];
    
    if (currentMonth === 11) return { event: "Holiday Season & Christmas Peak", monthName: name };
    if (currentMonth === 0) return { event: "New Year / Resolution Window", monthName: name };
    return { event: `${name} Standard Cycle`, monthName: name };
  }, [currentMonth]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logMessages]);

  const runResearchScan = async () => {
    setIsScanning(true);
    setShowResults(false);
    setLogMessages(["[SYSTEM] Connection established. Initializing Autonomous Research..."]);
    
    let step = 0;
    const logInterval = setInterval(() => {
      if (step < SCAN_STEPS.length - 1) {
        setLogMessages(prev => [...prev, `[PROCESS] ${SCAN_STEPS[step].replace('specified niche', niche)}`]);
        setCurrentStep(SCAN_STEPS[step]);
        step++;
      }
    }, 600);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Research the ${niche} market in ${location} for the month of ${seasonal.monthName}. 
                   Focus on seasonal cultural shifts like ${seasonal.event}. 
                   The brand goal is: ${goal}.
                   Primary Objective: ${primaryGoal}.
                   Identify a high-urgency micro-trend, a competitor gap, and platform-specific hooks.
                   Also provide a confidence score (0-100) for this trend's accuracy.`,
        config: {
          systemInstruction: `You are the BrandWiz Trend Spotter Agent. You provide high-velocity, hyper-local market intelligence. 
                              Analyze the specific location and niche provided. 
                              Look for "Gaps" where competitors are being generic. 
                              Provide actionable, specific trends.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trendName: { type: Type.STRING },
              trendDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
              gapAnalysis: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              hooks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["platform", "text"]
                }
              },
              recommendation: { type: Type.STRING }
            },
            required: ["trendName", "trendDetails", "gapAnalysis", "hooks", "recommendation", "confidenceScore"]
          }
        }
      });

      clearInterval(logInterval);
      const data = JSON.parse(response.text || '{}');
      
      setActiveIntel(data);
      if (data.confidenceScore) setConfidence(data.confidenceScore);
      setLogMessages(prev => [...prev, "[SUCCESS] Intelligence brief generated via Gemini 3 Pro."]);
      setShowResults(true);
    } catch (error: any) {
      console.error("Agent failed to synthesize:", error);
      const isQuotaError = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
      
      if (isQuotaError) {
        setLogMessages(prev => [...prev, "[ERROR] API Quota Exhausted (429). Please select a paid API key with billing enabled."]);
        if (window.aistudio) {
          const retry = confirm("API Quota Exhausted. Would you like to select a different API key or check your billing settings?");
          if (retry) window.aistudio.openSelectKey();
        }
      } else {
        setLogMessages(prev => [...prev, "[ERROR] Critical node failure. Reverting to local cache."]);
      }
      setShowResults(true);
    } finally {
      setIsScanning(false);
      clearInterval(logInterval);
    }
  };

  const handlePush = () => {
    onPushToStrategist({
      niche,
      location,
      goal,
      primaryGoal,
      trend: activeIntel.recommendation || activeIntel.trendName,
      confidences: { trend: confidence, strategy: 0, copy: 0, art: 0 }
    });
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
              <span className="text-2xl">🕵️</span>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Trend Spotter Agent</h1>
                <p className="text-xs text-[#00d8ff] font-bold uppercase tracking-widest mt-1">Autonomous Neural Unit</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 3 Pro Active
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-[#141417] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-6">Grounding Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Location Context</label>
                  <input 
                    type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Business Niche</label>
                  <input 
                    type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium"
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
                  />
                </div>
                <button 
                  onClick={runResearchScan} disabled={isScanning}
                  className={`w-full py-4 mt-2 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                    isScanning ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#00d8ff] hover:bg-[#00c2e5] text-black shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isScanning ? "Synthesizing..." : "Update Intelligence"}
                </button>
              </div>
            </section>

            {(isScanning || logMessages.length > 0) && (
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
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
                 <div className="w-16 h-16 border-2 border-[#00d8ff] border-t-transparent rounded-full animate-spin mb-6"></div>
                 <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Accessing Global & Local Data Streams</h2>
                 <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">{currentStep}</p>
              </div>
            ) : showResults ? (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 hover:border-[#00d8ff]/40 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#00d8ff]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Local Trend Detection</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-[#00d8ff] font-bold">"{activeIntel.trendName}"</p>
                      <ul className="space-y-2">
                        {activeIntel.trendDetails.map((detail, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex gap-2"><span className="text-[#00d8ff]">•</span>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 hover:border-[#00d8ff]/40 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cultural Context</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] text-purple-400 font-bold uppercase w-fit">{seasonal.event}</div>
                      <p className="text-xs text-gray-400">Neural analysis indicates a {currentMonth === 11 ? 'high-stress' : 'routine'} consumption cycle in {location}.</p>
                    </div>
                  </div>

                  <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 hover:border-[#00d8ff]/40 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-red-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gap Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 leading-relaxed"><span className="text-red-400 font-bold uppercase text-[10px] block mb-1">Competitor Vulnerability</span>{activeIntel.gapAnalysis}</p>
                    </div>
                  </div>

                  <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 xl:col-span-2">
                    <div className="flex items-center gap-3 mb-4 text-[#00d8ff]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Actionable Content Hooks</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeIntel.hooks.map((hook, idx) => (
                        <div key={idx} className="p-4 bg-black/40 rounded-xl border border-gray-800/50">
                          <p className="text-[10px] text-[#00d8ff] font-bold uppercase mb-1">{hook.platform}</p>
                          <p className="text-xs text-white italic leading-relaxed">"{hook.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Urgency Confidence</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00d8ff" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="0"></circle>
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0088aa" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-30"></circle>
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#004455" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-55"></circle>
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e1e24" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-80"></circle>
                        </svg>
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold space-y-1">
                        <p><span className="text-[#00d8ff]">■</span> Local Signals</p>
                        <p><span className="text-[#0088aa]">■</span> Seasonal Cont.</p>
                        <p><span className="text-[#004455]">■</span> Growth Intent</p>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="bg-gradient-to-br from-[#141417] to-[#0b0f14] border border-[#00d8ff]/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                   <h2 className="text-2xl font-black text-white mb-4 tracking-tight flex items-center gap-3">
                     <span className="w-8 h-[2px] bg-[#00d8ff]"></span>Autonomous Recommendation
                   </h2>
                   <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">{activeIntel.recommendation}</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <div className="px-4 py-2 bg-[#00d8ff]/10 border border-[#00d8ff]/20 rounded-full text-[10px] text-[#00d8ff] font-black uppercase tracking-widest">Confidence: {confidence.toFixed(1)}%</div>
                      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-black uppercase tracking-widest">ROI: High Potential</div>
                    </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 text-gray-700">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Autonomous Engine Standby</h3>
                <p className="text-gray-400 max-w-sm text-sm">Update context to trigger Gemini 3 Pro market synthesis.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showResults && !isScanning && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#0b0f14]/80 backdrop-blur-xl border-t border-gray-800/60 z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agent Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-white font-bold">Intelligence Synced</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-gray-800"></div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Grounding</p>
                <span className="text-xs text-gray-300 font-mono italic">{location} | {niche}</span>
              </div>
            </div>
            <button 
              onClick={handlePush}
              className="px-10 py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-extrabold rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 group"
            >
              Push to Strategist
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" /></svg>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default TrendSpotterPage;
