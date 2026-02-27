
import React from 'react';
import { Agent, AgentStatus, Urgency, Trend, RejectedTopic } from './types';

export const TREND_SPOTTER_INTEL: {
  trends: Trend[];
  rejected: RejectedTopic[];
  grounding: { location: string; niche: string; goal: string };
} = {
  grounding: {
    location: "Austin, Texas",
    niche: "Artisanal Coffee & Workspace",
    goal: "In-store foot traffic"
  },
  trends: [
    {
      id: 't1',
      name: 'The "Ghost-Town" Co-working Shift',
      whyNow: 'Hyper-local data shows 15% drop in mid-week office attendance due to new local remote-work policies.',
      localRelevance: 'Austin tech hubs are seeing a "Wednesday Slump" where people want a 3rd space that isn\'t home or HQ.',
      urgency: Urgency.HIGH,
      contentHook: 'Offer a "Mid-Week Anchor" bundle (Bottomless brew + reserved quiet booth) targeting the 1 PM - 4 PM window.',
      reasoning: 'Synthesized from local mobility data and competitor heatmaps showing empty tables on Tuesdays/Wednesdays.'
    },
    {
      id: 't2',
      name: 'ASMR Pour-Over Visuals',
      whyNow: 'Rising "Micro-Moment" trend on TikTok (2-7 day peak) focusing on high-fidelity audio of coffee prep.',
      localRelevance: 'Aligns with the artisanal aesthetic of East Austin coffee culture.',
      urgency: Urgency.MEDIUM,
      contentHook: 'Post a 15-second "Sound of the Morning" reel with no music, just the kettle whistle and bean grind.',
      reasoning: 'Exploits the current algorithmic preference for high-retention sensory content over traditional ads.'
    }
  ],
  rejected: [
    {
      topic: 'Generic #MondayMotivation Quotes',
      reason: 'Low engagement density. MSME competitors are over-saturating this tag, leading to scroll-past behavior.'
    },
    {
      topic: 'Global "Coffee Day" Countdown',
      reason: 'Too generic. Lacks local urgency and fails to drive immediate foot traffic to the specific Austin location.'
    }
  ]
};

// Internal constant for default grounding to assist components
export const TREND_SPOTTER_DEFAULT_GROUNDING = TREND_SPOTTER_INTEL.grounding;

export const AGENTS: Agent[] = [
  {
    id: 'trend-spotter',
    name: 'Trend Spotter',
    role: 'Market Intelligence Lead',
    status: AgentStatus.COMPLETE,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
      </svg>
    ),
    description: 'Autonomous researcher scanning local culture, competitor gaps, and short-lived market shifts to find immediate growth opportunities.',
    features: [
      { title: 'Local Grounding', description: 'Filters intelligence by your specific city and business niche.' },
      { title: 'Noise Suppression', description: 'Rejects generic viral topics that lack business ROI.' },
      { title: 'Urgency Scoring', description: 'Prioritizes trends based on their actionable shelf-life.' }
    ],
    exampleOutput: {
      title: 'Active Intelligence Brief',
      content: '2 High-Urgency Trends Identified for Austin Coffee Market.'
    }
  },
  {
    id: 'strategist',
    name: 'Strategist',
    role: 'Growth & Operations Planner',
    status: AgentStatus.IDLE,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    description: 'Converts trend intelligence into multi-day executable plans and resource-optimized campaign architectures.',
    features: [
      { title: 'Funnel Blueprinting', description: 'Custom end-to-end customer journey mapping.' },
      { title: 'Resource Allocation', description: 'Budget optimization across multi-channel spend.' },
      { title: 'KPI Benchmarking', description: 'Industry-standard metric comparison and forecasting.' }
    ],
    exampleOutput: {
      title: 'Pending Input',
      content: 'Waiting for Trend Spotter data to initialize strategy.'
    }
  },
  {
    id: 'copywriter',
    name: 'Copywriter',
    role: 'Narrative & Voice Architect',
    status: AgentStatus.IDLE,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: 'Architects brand-consistent copy optimized for conversion, psychological impact, and specific platform algorithms.',
    features: [
      { title: 'Tone Tuning', description: 'Adaptive writing styles from "Corporate" to "Zillenial".' },
      { title: 'SEO Infusion', description: 'Natural integration of high-value keywords.' },
      { title: 'A/B Variant Gen', description: 'Instant generation of multiple headline hooks.' }
    ],
    exampleOutput: {
      title: 'Campaign Drafts',
      content: 'Initialize a campaign to see copywriting variants.'
    }
  },
  {
    id: 'art-director',
    name: 'Art Director',
    role: 'Visual Concept Designer',
    status: AgentStatus.IDLE,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Visual storyteller providing mood boards, layout logic, and aesthetic guidelines to ensure brand cohesion.',
    features: [
      { title: 'Visual Identity', description: 'Development of core brand guidelines.' },
      { title: 'Layout Logic', description: 'UX/UI focused design concepts.' },
      { title: 'Mood Boarding', description: 'Curation of textures, colors, and defining imagery.' }
    ],
    exampleOutput: {
      title: 'Visual Assets',
      content: 'Creative assets will be generated following strategy approval.'
    }
  }
];
