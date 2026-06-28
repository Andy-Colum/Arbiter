export type ServiceType =
  | "IV Hydration"
  | "Non-Chemo Therapeutic Infusion"
  | "Chemotherapy IV Infusion"
  | "Chemotherapy IV Push"
  | "Chemotherapy Injection"
  | "Blood Transfusion"
  | "IV Iron Infusion"
  | "Biologic Infusion"
  | "Immunoglobulin Infusion"
  | "Neurology Infusion"
  | "Port Flush / Line Care"
  | "Supportive Oncology Injection";

export type AppointmentStatus =
  | "Upcoming"
  | "Confirmed"
  | "Cancelled"
  | "No Show"
  | "Rebooking Needed"
  | "Completed";

export type Risk = "High" | "Medium" | "Low";
export type Channel = "SMS" | "Email" | "Voice" | "Video";
export type Source = "EHR" | "Manual";

export interface AppointmentRecord {
  patientId: string;
  patientName: string;
  appointmentId: string;
  appointmentDateTime: string;
  location: string;
  serviceType: ServiceType;
  careNeed: string;
  icd10Code: string;
  icd10Description: string;
  cptFamily: string;
  drugCode?: string;
  expectedDurationMinutes?: number;
  appointmentStatus: AppointmentStatus;
  triggerReason: string;
  riskLevel: Risk;
  communicationPreference: Channel;
  preferredLanguage: string;
  consentSms: boolean;
  consentVoice: boolean;
  consentEmail: boolean;
  consentVideo: boolean;
  source: Source;
  lastContacted: string;
  age: number;
}

export interface AvailableSlot {
  slotId: string;
  dateTime: string;
  label: string;
  location: string;
  serviceTypeSupported: string;
  durationMinutes: number;
  chairOrResource?: string;
  staffApprovalRequired: boolean;
  status: "Available" | "Held" | "Booked";
}

export type ConversationSender = "Patient" | "Agent" | "System";
export type Sentiment = "Positive" | "Neutral" | "Negative";

export interface ConversationMessage {
  id: string;
  sender: ConversationSender;
  message: string;
  timestamp: string;
  intent?: string;
  reasonCategory?: string;
  sentiment?: Sentiment;
  actionTriggered?: string;
}

export type BackendEventType =
  | "CONTEXT_LOADED"
  | "SLOT_IDENTIFIED"
  | "MESSAGE_SENT"
  | "PATIENT_RESPONSE_RECEIVED"
  | "INTENT_CLASSIFIED"
  | "REASON_CAPTURED"
  | "REBOOKING_TASK_CREATED"
  | "STAFF_ESCALATION_CREATED"
  | "KPI_UPDATED"
  | "OPT_OUT_RECORDED"
  | "WRONG_NUMBER_FLAGGED"
  | "LANGUAGE_UPDATED"
  | "BILLING_HANDOFF"
  | "CLINICAL_ESCALATION"
  | "FOLLOW_UP_SCHEDULED";

export interface BackendTraceEvent {
  traceId: string;
  timestamp: string;
  eventType: BackendEventType;
  description: string;
  metadata?: Record<string, string>;
}

export interface PilotKpis {
  totalPatients: number;
  sameDayLeakageRate: number;
  baselineLeakageRate: number;
  controlLeakageRate: number;
  confirmationRate: number;
  pendingRate: number;
  noResponseRate: number;
  reasonCaptureRate: number;
  rebookingAttempts: number;
  rebookingAccepted: number;
  rebookingCompleted: number;
  completedVisits: number;
  automatedPatientActions: number;
  avgMinutesSavedPerAction: number;
  staffTimeSavedHours: number;
  sentimentPositivePct: number;
  sentimentNeutralPct: number;
  sentimentNegativePct: number;
}

// Legacy kept for AddPatientModal compatibility
export type PatientStatus = "New" | "In progress" | "Confirmed" | "Opted-out";
export type CareNeed = ServiceType;

export const LOCKED_STATUSES: AppointmentStatus[] = ["Confirmed"];

export function isLocked(r: AppointmentRecord): boolean {
  return r.appointmentStatus === "Confirmed";
}

// Scenario types
export type ScenarioId =
  | "billing"
  | "clinical"
  | "language"
  | "no_response"
  | "transportation"
  | "schedule_conflict"
  | "accept_slot"
  | "reject_slot"
  | "wrong_number"
  | "opt_out";

export interface ScenarioChip {
  id: ScenarioId;
  label: string;
  guardrail?: boolean;
  patientMessage: string;
  agentResponse: string;
  intent: string;
  reasonCategory?: string;
  sentiment: Sentiment;
  actionTriggered: string;
  traceEvents: Omit<BackendTraceEvent, "traceId" | "timestamp">[];
}

// Dashboard: cancellation/no-show reason capture
export type CancellationReason =
  | "no_reason_given"
  | "transportation"
  | "illness"
  | "financial"
  | "schedule_conflict"
  | "prep_confusion"
  | "clinical_concern"
  | "wrong_number"
  | "other";

export interface ReasonStat {
  reason: CancellationReason;
  pct: number;
  count: number;
}

// Dashboard: staffing savings calculator
export interface StaffingCalcInputs {
  avgMinutesPerBooking: number; // default 10
  hourlyWage: number; // default 28
  patientsHandled: number; // default from funnel (contacted), editable
}
