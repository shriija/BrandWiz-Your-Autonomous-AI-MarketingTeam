
# 🧠 BrandWiz: Multi-Agent AI Orchestration Studio
BrandWiz is a sophisticated creative intelligence platform that implements a multi-agent orchestration pattern to simulate a professional brand agency workflow. Built with React 19 and TypeScript, it leverages the Google Gemini API to coordinate specialized AI personas through a synchronized data pipeline.

# 🏗️ Technical Architecture
Unlike standard AI wrappers, BrandWiz uses a Sequential Agentic Workflow. Each agent (Trend Spotter, Strategist, Copywriter, Art Director) is a specialized persona with unique system instructions, designed to consume and refine data from the previous stage of the branding lifecycle.

State Management: Utilizes a centralized SharedContext pattern to maintain data integrity across asynchronous agent hand-offs.

Type Safety: Implements strict TypeScript interfaces and Enums (AgentStatus, Urgency, Trend) to ensure predictable data flow between LLM-driven components.

Modular Design: Features a decoupled view architecture, allowing for independent scaling of agent capabilities and specialized UI/UX interactions.

# 🛠️ Tech Stack
Frontend: React 19, Tailwind CSS (Custom Dark Design System)

Language: TypeScript (Strictly Typed)

AI Orchestration: Google Gemini API (@google/genai)

Build Tooling: Vite, ESLint

Deployment: Optimized for Vercel/Netlify environments

# 🚀 Key Engineering Features
Sequential Context Chaining The platform implements an automated hand-off mechanism where the TrendSpotter identifies market signals, which are then injected into the Strategist persona's prompt context. This ensures that the final brand outputs are grounded in real-world data rather than generic AI hallucinations.

Custom Persona-Centric UI Leveraging professional UI/UX principles, the dashboard utilizes a high-contrast dark mode aesthetic to reduce cognitive load during complex strategy sessions. Each agent view is custom-built to reflect the data density required for that specific creative role.

Schema-Driven AI Responses By enforcing structured JSON schemas in the communication layer with Gemini, the system ensures that AI-generated responses map directly to the application's TypeScript interfaces without parsing errors.

# 📂 Repository Structure
/ # UI Views (Welcome, Auth, Dashboard, Agents) # Configuration and Default Grounding data # Global TypeScript interfaces and Enums # Main Routing and Context Controller # Entry point # Static assets # Build and API environment configuration

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

