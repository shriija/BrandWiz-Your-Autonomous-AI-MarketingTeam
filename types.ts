
import React from 'react';

export enum AgentStatus {
  IDLE = 'Idle',
  PROCESSING = 'Processing',
  COMPLETE = 'Complete'
}

export enum Urgency {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface Feature {
  title: string;
  description: string;
}

export interface Trend {
  id: string;
  name: string;
  whyNow: string;
  localRelevance: string;
  urgency: Urgency;
  contentHook: string;
  reasoning: string;
}

export interface RejectedTopic {
  topic: string;
  reason: string;
}

export interface ExampleOutput {
  title: string;
  content: string | string[] | object;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  description: string;
  status: AgentStatus;
  features: Feature[];
  exampleOutput: ExampleOutput;
}
