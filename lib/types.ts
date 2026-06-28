export type CareNeed =
  | "Infusion therapy"
  | "Oncology follow-up"
  | "Cardiology follow-up"
  | "Post-discharge check-in"
  | "Imaging / diagnostic"
  | "Lab work";

export type TriggerType =
  | "Missed appointment"
  | "Same-day cancellation"
  | "No-show risk"
  | "Referral pending"
  | "Recall / overdue";

export type Channel = "SMS" | "Email" | "Voice" | "Video";

export type Risk = "High" | "Medium" | "Low";

export type Source = "EHR" | "Manual";

// New: eligible for selection. Confirmed / Opted-out are locked.
export type PatientStatus = "New" | "In progress" | "Confirmed" | "Opted-out";

export interface Consent {
  sms: boolean;
  email: boolean;
  voice: boolean;
  video: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  careNeed: CareNeed;
  risk: Risk;
  channel: Channel;
  language: string;
  consent: Consent;
  lastContacted: string; // human-readable, or "Never"
  status: PatientStatus;
  triggerType: TriggerType;
  source: Source;
}

export const LOCKED_STATUSES: PatientStatus[] = ["Confirmed", "Opted-out"];

export function isLocked(p: Patient): boolean {
  return LOCKED_STATUSES.includes(p.status);
}

// The four response scenarios simulated on Page 2.
export type ScenarioId = "billing" | "language" | "clinical" | "no_response";

export interface ScenarioStep {
  label: string;
  detail: string;
  tone: "patient" | "agent" | "action" | "outcome" | "alert";
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  short: string;
  guardrail?: boolean;
  patientMessage: string;
  steps: ScenarioStep[];
}
