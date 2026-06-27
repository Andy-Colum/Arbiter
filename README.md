# Arbiter AI — Demo

Interactive demo for **Arbiter**, agentic patient outreach for healthcare. When a
hospital needs to reach a patient about an appointment, Arbiter picks the right
channel, holds the conversation end-to-end, and writes the outcome back to the EHR.

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and TypeScript. All
data is mock data for demo purposes.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Principle | The design philosophy behind Arbiter |
| `/backend` | Hospital Setup | How a hospital configures Arbiter and how an appointment request triggers the flow |
| `/experience` | Patient Experience | A phone view — switch between text, email, voice, and video to see the patient experience |
| `/architecture` | Architecture | End-to-end system: Epic → MCP → intent orchestrator → channel agents |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploys to [Vercel](https://vercel.com) with zero config — import the repo and ship.
