import { Patient, Scenario } from "./types";

// Deterministic mock cohort for the Pinecrest pilot. No randomness — demo-stable.
export const PATIENTS: Patient[] = [
  {
    id: "PT-1042",
    name: "Maria Alvarez",
    age: 58,
    careNeed: "Infusion therapy",
    risk: "High",
    channel: "SMS",
    language: "Spanish",
    consent: { sms: true, email: true, voice: true, video: false },
    lastContacted: "Never",
    status: "New",
    triggerType: "Missed appointment",
    source: "EHR",
  },
  {
    id: "PT-1043",
    name: "James Whitfield",
    age: 67,
    careNeed: "Cardiology follow-up",
    risk: "High",
    channel: "Voice",
    language: "English",
    consent: { sms: true, email: false, voice: true, video: false },
    lastContacted: "3 days ago",
    status: "New",
    triggerType: "Same-day cancellation",
    source: "EHR",
  },
  {
    id: "PT-1044",
    name: "Aisha Bello",
    age: 44,
    careNeed: "Oncology follow-up",
    risk: "High",
    channel: "Email",
    language: "English",
    consent: { sms: true, email: true, voice: true, video: true },
    lastContacted: "1 week ago",
    status: "New",
    triggerType: "Recall / overdue",
    source: "EHR",
  },
  {
    id: "PT-1045",
    name: "Robert Tanaka",
    age: 71,
    careNeed: "Infusion therapy",
    risk: "Medium",
    channel: "SMS",
    language: "English",
    consent: { sms: true, email: true, voice: false, video: false },
    lastContacted: "2 days ago",
    status: "In progress",
    triggerType: "No-show risk",
    source: "EHR",
  },
  {
    id: "PT-1046",
    name: "Linda Park",
    age: 62,
    careNeed: "Imaging / diagnostic",
    risk: "Medium",
    channel: "Video",
    language: "Korean",
    consent: { sms: true, email: true, voice: true, video: true },
    lastContacted: "Never",
    status: "New",
    triggerType: "Referral pending",
    source: "EHR",
  },
  {
    id: "PT-1047",
    name: "David Okoro",
    age: 55,
    careNeed: "Cardiology follow-up",
    risk: "Low",
    channel: "SMS",
    language: "English",
    consent: { sms: true, email: false, voice: true, video: false },
    lastContacted: "5 days ago",
    status: "Confirmed",
    triggerType: "Missed appointment",
    source: "EHR",
  },
  {
    id: "PT-1048",
    name: "Grace Sullivan",
    age: 49,
    careNeed: "Lab work",
    risk: "Low",
    channel: "Email",
    language: "English",
    consent: { sms: false, email: true, voice: false, video: false },
    lastContacted: "2 weeks ago",
    status: "Opted-out",
    triggerType: "Recall / overdue",
    source: "EHR",
  },
  {
    id: "PT-1049",
    name: "Hector Ramirez",
    age: 60,
    careNeed: "Infusion therapy",
    risk: "High",
    channel: "Voice",
    language: "Spanish",
    consent: { sms: true, email: false, voice: true, video: false },
    lastContacted: "4 days ago",
    status: "New",
    triggerType: "Same-day cancellation",
    source: "EHR",
  },
  {
    id: "PT-2001",
    name: "Emily Chen",
    age: 38,
    careNeed: "Post-discharge check-in",
    risk: "Medium",
    channel: "SMS",
    language: "English",
    consent: { sms: true, email: true, voice: true, video: false },
    lastContacted: "Never",
    status: "New",
    triggerType: "No-show risk",
    source: "Manual",
  },
  {
    id: "PT-2002",
    name: "Frank DeLuca",
    age: 74,
    careNeed: "Cardiology follow-up",
    risk: "High",
    channel: "Voice",
    language: "English",
    consent: { sms: false, email: false, voice: true, video: false },
    lastContacted: "Never",
    status: "New",
    triggerType: "Missed appointment",
    source: "Manual",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "billing",
    title: "Insurance / billing question",
    short: "Billing",
    patientMessage:
      "Will my insurance cover this infusion? I can't afford a big bill again.",
    steps: [
      {
        label: "Patient reply received",
        detail:
          "Inbound message classified as a non-clinical financial question.",
        tone: "patient",
      },
      {
        label: "Agent decision",
        detail:
          "Intent = billing/coverage. Within bounds to capture, not to quote specifics.",
        tone: "agent",
      },
      {
        label: "Action taken",
        detail:
          "Shared approved coverage info + created a task for a financial counselor to follow up.",
        tone: "action",
      },
      {
        label: "Outcome",
        detail:
          "Patient reassured; counselor task queued. Appointment offer still open.",
        tone: "outcome",
      },
    ],
  },
  {
    id: "language",
    title: "Reply in another language",
    short: "Language",
    patientMessage: "Hola, no entiendo bien. ¿Pueden escribirme en español?",
    steps: [
      {
        label: "Patient reply received",
        detail: "Inbound message detected as Spanish.",
        tone: "patient",
      },
      {
        label: "Agent decision",
        detail:
          "Language = es. Patient preference confirms Spanish. Switch conversation language.",
        tone: "agent",
      },
      {
        label: "Action taken",
        detail:
          "Continued outreach in Spanish using approved translated scripts.",
        tone: "action",
      },
      {
        label: "Outcome",
        detail: "Patient re-engaged in preferred language; flow continues.",
        tone: "outcome",
      },
    ],
  },
  {
    id: "clinical",
    title: "Clinical question",
    short: "Clinical",
    guardrail: true,
    patientMessage:
      "I've had chest tightness and shortness of breath since yesterday. Is that normal before my infusion?",
    steps: [
      {
        label: "Patient reply received",
        detail: "Inbound message classified as clinical / symptom-related.",
        tone: "patient",
      },
      {
        label: "Agent decision — GUARDRAIL",
        detail:
          "Clinical content. Agent does NOT answer. Hard stop on autonomous clinical advice.",
        tone: "alert",
      },
      {
        label: "Action taken",
        detail:
          "Escalated to triage nurse with full context; flagged for callback within SLA.",
        tone: "action",
      },
      {
        label: "Outcome",
        detail:
          "Nurse owns the conversation. No clinical guidance was generated by the agent.",
        tone: "outcome",
      },
    ],
  },
  {
    id: "no_response",
    title: "No response",
    short: "No response",
    patientMessage: "(no reply after first outreach)",
    steps: [
      {
        label: "No reply within window",
        detail: "First outreach delivered; no response in the 24h window.",
        tone: "patient",
      },
      {
        label: "Agent decision",
        detail:
          "Next-best-action: escalate channel SMS → Voice per preference + consent.",
        tone: "agent",
      },
      {
        label: "Action taken",
        detail:
          "Scheduled retry on Voice; after 2 failed attempts, create a staff task.",
        tone: "action",
      },
      {
        label: "Outcome",
        detail:
          "Attempt logged; staff task queued so no patient falls through the cracks.",
        tone: "outcome",
      },
    ],
  },
];
