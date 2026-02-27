
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface CopywriterPageProps {
  onBack: () => void;
  onPushToArtDirector?: (context: any) => void;
  initialContext?: { 
    niche: string; 
    location: string; 
    trend: string; 
    goal: string;
    primaryGoal?: 'Awareness' | 'Foot Traffic' | 'Engagement' | 'Sales Push';
    confidences?: { trend: number; strategy: number; copy: number; art: number };
    strategy?: {
      planName: string;
      phases: { day: number; task: string; objective: string }[];
    };
  } | null;
}

const COPY_STEPS = [
  "Parsing strategic campaign roadmap...",
  "Analyzing brand voice and niche context...",
  "Applying psychological conversion principles...",
  "Optimizing for platform-specific algorithms...",
  "Drafting social, email, and ad variants...",
  "Reviewing narrative consistency..."
];

const CopywriterPage: React.FC<CopywriterPageProps> = ({ onBack, initialContext, onPushToArtDirector }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [tone, setTone] = useState("Professional & High-Energy");
  const [confidence, setConfidence] = useState(92.8);
  const [evaluation, setEvaluation] = useState<{ score: number; reasoning: string[] } | null>({
    score: 91,
    reasoning: ["Strong CTA alignment with 'Foot Traffic' goal", "High local relevance for Austin market"]
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [activeCopy, setActiveCopy] = useState({
    variants: [
      {
        platform: "Instagram / Facebook",
        headline: "Austin's Hidden Focus Hub is Here",
        body: "Tired of the home office slump? ☕️ Our Mid-Week Anchor bundle is designed for the high-intent remote worker who needs space to crush it.",
        cta: "Reserve Your Spot"
      },
      {
        platform: "X / Threads",
        headline: "The Wednesday Slump is Real.",
        body: "Austin: 15% drop in office attendance means 100% need for better 3rd spaces. We've got the bottomless brew and the quiet booths you've been looking for.",
        cta: "View Map"
      },
      {
        platform: "Email Blast",
        headline: "Your New Mid-Week Sanctuary",
        body: "Hello neighbors! We noticed the city gets a little quieter on Wednesdays. That's why we're launching the Anchor Bundle—premium fuel for your most productive hours.",
        cta: "Get Anchor Bundle"
      }
    ],
    taglines: [
      "Find Your Focus in the City Noise.",
      "Work Better, Austin.",
      "The Anchor for Your Busiest Days."
    ]
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logMessages]);

  const generateCopy = async () => {
    setIsProcessing(true);
    setShowResults(false);
    setLogMessages(["[SYSTEM] Narrative Engine Initializing..."]);

    let step = 0;
    const logInterval = setInterval(() => {
      if (step < COPY_STEPS.length - 1) {
        setLogMessages(prev => [...prev, `[WRITING] ${COPY_STEPS[step]}`]);
        setCurrentStep(COPY_STEPS[step]);
        step++;
      }
    }, 600);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const strategyStr = initialContext?.strategy 
        ? JSON.stringify(initialContext.strategy) 
        : "Generic growth plan";

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generate marketing copy for a ${initialContext?.niche} in ${initialContext?.location}.
                   Goal: ${initialContext?.goal}
                   Primary Objective: ${initialContext?.primaryGoal}
                   Trend: ${initialContext?.trend}
                   Strategy: ${strategyStr}
                   Tone: ${tone}
                   Provide 3 multi-platform variants and 3 core taglines.
                   Also provide a copy confidence score (0-100).`,
        config: {
          systemInstruction: `You are the BrandWiz Copywriter Agent. You are a world-class conversion copywriter.
                              Your task is to turn strategy into high-impact words. 
                              Focus on:
                              1. "Hook, Story, Offer" framework.
                              2. Local relevance.
                              3. Platform-specific formatting.
                              Keep it punchy, rhythmic, and high-conversion.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              variants: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING }
                  },
                  required: ["platform", "headline", "body", "cta"]
                }
              },
              taglines: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              confidenceScore: { type: Type.NUMBER }
            },
            required: ["variants", "taglines", "confidenceScore"]
          }
        }
      });

      clearInterval(logInterval);
      const data = JSON.parse(response.text || '{}');
      setActiveCopy(data);
      if (data.confidenceScore) setConfidence(data.confidenceScore);
      setLogMessages(prev => [...prev, "[SUCCESS] Narrative brief synthesized via Gemini 3 Pro."]);
      
      // SILENT EVALUATOR PASS
      setIsEvaluating(true);
      setLogMessages(prev => [...prev, "[SYSTEM] Initializing Silent Evaluator pass..."]);
      
      const evalResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Evaluate the following marketing copy variants for a ${initialContext?.niche} with goal ${initialContext?.goal} (${initialContext?.primaryGoal}).
                   Copy: ${JSON.stringify(data.variants)}
                   Score the copy from 0-100 based on CTA strength, clarity, and alignment with the primary goal.
                   Provide 2 brief bullet points of reasoning.`,
        config: {
          systemInstruction: "You are the BrandWiz Quality Agent. You provide objective, critical evaluations of marketing assets.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "reasoning"]
          }
        }
      });
      
      const evalData = JSON.parse(evalResponse.text || '{}');
      setEvaluation(evalData);
      setLogMessages(prev => [...prev, `[SUCCESS] Quality Agent validation complete: ${evalData.score}% Alignment.`]);
      setIsEvaluating(false);
      
      setShowResults(true);
    } catch (error: any) {
      console.error("Copy generation failed:", error);
      const isQuotaError = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
      
      if (isQuotaError) {
        setLogMessages(prev => [...prev, "[ERROR] API Quota Exhausted (429). Please select a paid API key with billing enabled."]);
        if (window.aistudio) {
          const retry = confirm("API Quota Exhausted. Would you like to select a different API key or check your billing settings?");
          if (retry) window.aistudio.openSelectKey();
        }
      } else {
        setLogMessages(prev => [...prev, "[ERROR] Narrative logic breach. Reverting to backup creative..."]);
      }
      setShowResults(true);
    } finally {
      setIsProcessing(false);
      clearInterval(logInterval);
    }
  };

  const handlePush = () => {
    if (onPushToArtDirector) {
      onPushToArtDirector({
        ...initialContext,
        confidences: {
          ...initialContext?.confidences,
          copy: confidence
        },
        evaluation: evaluation,
        copy: activeCopy
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
              <span className="text-2xl">✍️</span>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Copywriter Agent</h1>
                <p className="text-xs text-[#00d8ff] font-bold uppercase tracking-widest mt-1">Narrative & Voice Architect</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            Creative Sync Active
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-[#141417] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-6">Voice Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Campaign Tone</label>
                  <select 
                    value={tone} onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0b0f14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d8ff] transition-colors font-medium appearance-none cursor-pointer"
                  >
                    <option>Professional & High-Energy</option>
                    <option>Witty & Conversational</option>
                    <option>Minimalist & Luxury</option>
                    <option>Urgent & Direct</option>
                  </select>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Inherited Context</p>
                  <p className="text-[11px] text-[#00d8ff] font-mono leading-tight mb-1">STRAT: {initialContext?.strategy?.planName || 'N/A'}</p>
                  <p className="text-[11px] text-gray-400 font-mono leading-tight mb-1">GOAL: {initialContext?.goal || 'N/A'}</p>
                  <p className="text-[11px] text-emerald-400 font-mono leading-tight">OBJ: {initialContext?.primaryGoal || 'N/A'}</p>
                </div>
                <button 
                  onClick={generateCopy} disabled={isProcessing}
                  className={`w-full py-4 mt-2 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                    isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#00d8ff] hover:bg-[#00c2e5] text-black shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isProcessing ? "Writing..." : "Generate Drafts"}
                </button>
              </div>
            </section>

            {(isProcessing || logMessages.length > 0) && (
              <section className="bg-black/40 border border-gray-800 rounded-2xl p-4 font-mono text-[10px] h-[300px] flex flex-col shadow-inner">
                <div className="flex items-center justify-between mb-3 text-gray-500 uppercase tracking-widest font-bold">Process Stream</div>
                <div className="flex-grow overflow-y-auto space-y-1.5 scrollbar-hide opacity-80">
                  {logMessages.map((msg, i) => (
                    <div key={i} className={msg.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
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
                 <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Synthesizing Narrative Assets</h2>
                 <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">{currentStep}</p>
              </div>
            ) : showResults ? (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                  {/* Taglines */}
                  <div className="md:col-span-12 flex flex-wrap gap-4">
                    {activeCopy.taglines.map((tag, i) => (
                      <div key={i} className="px-6 py-3 bg-[#141417] border border-gray-800 rounded-full text-sm font-bold text-white hover:border-[#00d8ff]/50 transition-colors cursor-default">
                        <span className="text-[#00d8ff] mr-2">/</span> {tag}
                      </div>
                    ))}
                  </div>

                  {/* Copy Variants */}
                  <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeCopy.variants.map((v, i) => (
                      <div key={i} className="bg-[#141417] border border-gray-800 rounded-2xl flex flex-col hover:border-[#00d8ff]/30 transition-all group">
                        <div className="p-6 border-b border-gray-800/50">
                          <div className="flex items-center gap-2 text-[10px] text-[#00d8ff] font-bold uppercase tracking-widest mb-3">
                            <span className="w-1 h-1 rounded-full bg-[#00d8ff]"></span>
                            {v.platform}
                          </div>
                          <h3 className="text-lg font-black text-white leading-tight">{v.headline}</h3>
                        </div>
                        <div className="p-6 flex-grow">
                          <p className="text-sm text-gray-400 leading-relaxed italic mb-6">"{v.body}"</p>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(v.body);
                              alert('Copied to clipboard!');
                            }}
                            className="w-full py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-[#00d8ff] transition-all flex items-center justify-center gap-2"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                             Copy {v.cta}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                 <section className="bg-gradient-to-br from-[#141417] to-[#0b0f14] border border-[#00d8ff]/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                          <span className="w-8 h-[2px] bg-[#00d8ff]"></span>Copywriter's Note
                        </h2>
                        {evaluation && (
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                            Validated by Quality Agent – {evaluation.score}% Alignment
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg max-w-4xl italic">
                        "The narrative is anchored in the mid-week mobility gap identified by the Trend Spotter. Each variant maintains the tone while optimizing for the specific psychological cues of each platform—curiosity for Instagram, authority for X, and community for Email."
                      </p>
                      <div className="mt-8 flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-[#00d8ff]/10 border border-[#00d8ff]/20 rounded-full text-[10px] text-[#00d8ff] font-black uppercase tracking-widest">Confidence: {confidence.toFixed(1)}%</div>
                        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-black uppercase tracking-widest">Psychological Hook: Scarcity & Focus</div>
                      </div>
                    </div>
                 </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 text-gray-700">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Narrative Engine Standby</h3>
                <p className="text-gray-400 max-w-sm text-sm">Update voice parameters or strategy context to begin copywriting.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FIXED: Replacing undefined isScanning with isProcessing */}
      {showResults && !isProcessing && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#0b0f14]/80 backdrop-blur-xl border-t border-gray-800/60 z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agent Sync</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d8ff] animate-pulse"></span>
                  <span className="text-xs text-white font-bold">Copy Brief Ready</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-gray-800"></div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Next Step</p>
                <span className="text-xs text-gray-300 font-mono italic">Creative Concept Visualization</span>
              </div>
            </div>
            <button 
              onClick={handlePush}
              className="px-10 py-4 bg-[#00d8ff] hover:bg-[#00c2e5] text-black font-extrabold rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 group"
            >
              Push to Art Director
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" /></svg>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default CopywriterPage;
