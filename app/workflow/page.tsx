"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCohort } from "@/lib/store";
import { SCENARIOS, AVAILABLE_SLOTS } from "@/lib/data";
import { AppointmentRecord, BackendTraceEvent, Channel, ConversationMessage, ScenarioId } from "@/lib/types";
import { PhoneFrame } from "@/components/PhoneFrame";
import { TextChannel } from "@/components/channels/TextChannel";
import { EmailChannel } from "@/components/channels/EmailChannel";
import { VoiceChannel } from "@/components/channels/VoiceChannel";
import { VideoChannel } from "@/components/channels/VideoChannel";

const CHANNELS: { id: Channel; icon: string }[] = [
  { id: "SMS", icon: "💬" },
  { id: "Email", icon: "✉️" },
  { id: "Voice", icon: "📞" },
  { id: "Video", icon: "🎥" },
];

function formatTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function now() {
  return new Date().toISOString();
}

function buildInitialTrace(appt: AppointmentRecord): BackendTraceEvent[] {
  return [
    { traceId: makeId(), timestamp: now(), eventType: "CONTEXT_LOADED", description: `Appointment context loaded for ${appt.patientName}` },
    { traceId: makeId(), timestamp: now(), eventType: "CONTEXT_LOADED", description: `Service type identified: ${appt.serviceType}` },
    { traceId: makeId(), timestamp: now(), eventType: "CONTEXT_LOADED", description: `ICD-10 loaded: ${appt.icd10Code} — ${appt.icd10Description}` },
    { traceId: makeId(), timestamp: now(), eventType: "CONTEXT_LOADED", description: `CPT family loaded: ${appt.cptFamily}` },
    { traceId: makeId(), timestamp: now(), eventType: "SLOT_IDENTIFIED", description: `First available slot identified: ${AVAILABLE_SLOTS[0].label}` },
    { traceId: makeId(), timestamp: now(), eventType: "MESSAGE_SENT", description: `Initial ${appt.communicationPreference} outreach sent to ${appt.patientName}` },
  ];
}

function buildInitialMessages(appt: AppointmentRecord): ConversationMessage[] {
  const firstName = appt.patientName.split(" ")[0];
  const serviceLabel = appt.serviceType.toLowerCase();
  const slot = AVAILABLE_SLOTS[0];

  let text = `Hi ${firstName}, this is Pinecrest Care. We're confirming your upcoming ${serviceLabel} appointment. ${slot.label.replace("·", "at")} is the first available slot. Would that work for you? Reply YES to confirm, NO for other times, or QUESTION if you need help.`;

  if (appt.appointmentStatus === "No Show" || appt.appointmentStatus === "Rebooking Needed") {
    text = `Hi ${firstName}, this is Pinecrest Care. We're following up on your missed ${serviceLabel} appointment. The first available appointment is ${slot.label.replace("·", "at")}. Would that work for you?`;
  }

  return [
    {
      id: makeId(),
      sender: "Agent",
      message: text,
      timestamp: now(),
    },
  ];
}

export default function WorkflowPage() {
  const { activeAppointment, appointments } = useCohort();

  const appt: AppointmentRecord | null =
    activeAppointment ??
    appointments.find((a) => a.appointmentStatus !== "Confirmed") ??
    null;

  const [channel, setChannel] = useState<Channel>(appt?.communicationPreference ?? "SMS");
  const [messages, setMessages] = useState<ConversationMessage[]>(appt ? buildInitialMessages(appt) : []);
  const [traceEvents, setTraceEvents] = useState<BackendTraceEvent[]>(appt ? buildInitialTrace(appt) : []);
  const [input, setInput] = useState("");
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const traceEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appt) {
      setMessages(buildInitialMessages(appt));
      setTraceEvents(buildInitialTrace(appt));
      setChannel(appt.communicationPreference);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appt?.appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    traceEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [traceEvents]);

  if (!appt) return <EmptyState />;

  const firstName = appt.patientName.split(" ")[0];

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const patientMsg: ConversationMessage = {
      id: makeId(),
      sender: "Patient",
      message: text.trim(),
      timestamp: now(),
    };
    setMessages((prev) => [...prev, patientMsg]);
    setInput("");
    setIsTyping(true);

    // Detect scenario from input text for free-typing
    const lower = text.toLowerCase();
    let matchedId: ScenarioId | null = null;
    if (/stop|opt.?out|unsubscribe/.test(lower)) matchedId = "opt_out";
    else if (/wrong number/.test(lower)) matchedId = "wrong_number";
    else if (/billing|insurance|cost|afford|pay/.test(lower)) matchedId = "billing";
    else if (/sick|hurt|pain|reaction|symptom|fever|bleed/.test(lower)) matchedId = "clinical";
    else if (/spanish|español|chinese|français|中文/.test(lower)) matchedId = "language";
    else if (/no ride|transportation|no car|can't drive/.test(lower)) matchedId = "transportation";
    else if (/work|can't make|busy|conflict|wednesday|thursday|morning|afternoon/.test(lower)) matchedId = "schedule_conflict";
    else if (/yes|tuesday|confirm|works|ok|sure|book it/.test(lower)) matchedId = "accept_slot";
    else if (/no|different|other|not tuesday|prefer/.test(lower)) matchedId = "reject_slot";

    const scenario = SCENARIOS.find((s) => s.id === (matchedId ?? activeScenario));

    setTimeout(() => {
      setIsTyping(false);
      const agentMsg: ConversationMessage = {
        id: makeId(),
        sender: "Agent",
        message: scenario?.agentResponse ?? `Thanks for your message, ${firstName}. Let me check on that for you and get back to you shortly.`,
        timestamp: now(),
        intent: scenario?.intent,
        reasonCategory: scenario?.reasonCategory,
        sentiment: scenario?.sentiment,
        actionTriggered: scenario?.actionTriggered,
      };
      setMessages((prev) => [...prev, agentMsg]);

      if (scenario) {
        const newEvents: BackendTraceEvent[] = scenario.traceEvents.map((e) => ({
          ...e,
          traceId: makeId(),
          timestamp: now(),
        }));
        setTraceEvents((prev) => [...prev, ...newEvents]);
      }
    }, 1200);
  }

  function applyScenario(id: ScenarioId) {
    const s = SCENARIOS.find((sc) => sc.id === id)!;
    setActiveScenario(id);
    sendMessage(s.patientMessage);
  }

  function resetConversation() {
    setMessages(buildInitialMessages(appt!));
    setTraceEvents(buildInitialTrace(appt!));
    setActiveScenario(null);
    setInput("");
    setIsTyping(false);
  }

  const consentKey = channel.toLowerCase() as "sms" | "email" | "voice" | "video";
  const consentMap = {
    sms: appt.consentSms,
    email: appt.consentEmail,
    voice: appt.consentVoice,
    video: appt.consentVideo,
  };

  return (
    <div>
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 02 — See it work · centerpiece
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Agent Workflow</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          Closed-loop visit recovery — confirm, capture, and recover. Watch the agent handle real responses with the decision chain made visible.
        </p>
      </header>

      {/* Selected case context */}
      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-[var(--faint)]">Selected case</div>
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[var(--text)]">{appt.patientName}</div>
            <div className="text-[11px] text-[var(--faint)]">{appt.patientId} · {appt.age}yo · {appt.preferredLanguage}</div>
          </div>
          <ContextPill label="Service" value={appt.serviceType} />
          <ContextPill label="ICD-10" value={`${appt.icd10Code} — ${appt.icd10Description}`} />
          <ContextPill label="CPT" value={appt.cptFamily} />
          {appt.drugCode && <ContextPill label="Drug" value={appt.drugCode} />}
          <ContextPill label="Status" value={appt.appointmentStatus} />
          <ContextPill label="Trigger" value={appt.triggerReason} />
          <ContextPill label="Risk" value={appt.riskLevel} />
        </div>
        <div className="mt-2 text-[11px] text-[var(--muted)]">
          Next best action:{" "}
          <span className="font-medium text-[var(--text)]">
            {appt.appointmentStatus === "No Show" || appt.appointmentStatus === "Rebooking Needed"
              ? "SMS rebooking recovery + first-available appointment offer"
              : "SMS confirmation + first-available appointment offer if reschedule needed"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Phone column */}
        <div>
          {/* Channel switcher */}
          <div className="mb-3 inline-flex w-full justify-between gap-1 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-1">
            {CHANNELS.map((c) => {
              const consented = consentMap[c.id.toLowerCase() as keyof typeof consentMap];
              return (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
                    channel === c.id
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                  title={consented ? "" : "No consent on file"}
                >
                  <span>{c.icon}</span>
                  {c.id}
                  {!consented && <span className="text-[10px] text-[var(--amber)]">!</span>}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <PhoneFrame>
              {channel === "SMS" && (
                <SmsConversation
                  appt={appt}
                  messages={messages}
                  input={input}
                  isTyping={isTyping}
                  onInput={setInput}
                  onSend={sendMessage}
                  messagesEndRef={messagesEndRef}
                />
              )}
              {channel === "Email" && <EmailChannel patient={appt} />}
              {channel === "Voice" && <VoiceChannel patient={appt} playing={messages.length > 1} />}
              {channel === "Video" && <VideoChannel patient={appt} playing={messages.length > 1} />}
            </PhoneFrame>
          </div>

          <button
            onClick={resetConversation}
            className="mt-3 w-full rounded-md border border-[var(--border)] py-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
          >
            Reset conversation
          </button>
        </div>

        {/* Right column: scenario chips + backend trace */}
        <div className="space-y-4">
          {/* First-available slot offer */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3">
            <div className="mb-2 text-[11px] uppercase tracking-wide text-[var(--faint)]">First-available appointment offer</div>
            <div className="space-y-2">
              {AVAILABLE_SLOTS.map((slot, i) => (
                <div
                  key={slot.slotId}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-[12px] ${
                    i === 0
                      ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]/20"
                      : "border-[var(--border)] bg-[var(--panel-2)]"
                  }`}
                >
                  <div>
                    <span className={`font-medium ${i === 0 ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>
                      {i === 0 && <span className="mr-1.5 rounded bg-[var(--accent)] px-1 py-0.5 text-[9px] font-bold uppercase text-white">First</span>}
                      {slot.label}
                    </span>
                    <div className="text-[10px] text-[var(--faint)]">{slot.chairOrResource} · {slot.durationMinutes} min{slot.staffApprovalRequired ? " · Staff approval req." : ""}</div>
                  </div>
                  <span className={`text-[10px] ${i === 0 ? "text-[var(--green)]" : "text-[var(--faint)]"}`}>Available</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario chips */}
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-wide text-[var(--faint)]">Test a scenario</div>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => applyScenario(s.id)}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    activeScenario === s.id
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                      : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {s.label}
                  {s.guardrail && (
                    <span className="ml-1.5 rounded bg-[var(--accent)] px-1 text-[9px] uppercase text-white">
                      guardrail
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Backend event trace */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-4 py-2.5">
              <div className="text-[13px] font-semibold">Backend event trace</div>
              <span className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[10px] text-[var(--faint)]">{traceEvents.length} events</span>
            </div>
            <div className="max-h-80 overflow-y-auto p-3 space-y-1.5">
              {traceEvents.map((e) => (
                <TraceRow key={e.traceId} event={e} />
              ))}
              <div ref={traceEndRef} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--faint)]">
            <span className="rounded border border-dashed border-[var(--border)] px-1.5 py-0.5">Simulated</span>
            Mock responses. In production, events feed live from the channel agent and update Pages 3 &amp; 4.
          </div>
        </div>
      </div>
    </div>
  );
}

function SmsConversation({
  appt,
  messages,
  input,
  isTyping,
  onInput,
  onSend,
  messagesEndRef,
}: {
  appt: AppointmentRecord;
  messages: ConversationMessage[];
  input: string;
  isTyping: boolean;
  onInput: (v: string) => void;
  onSend: (v: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex h-full flex-col bg-[#0c0c10]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#161619] px-4 py-3 pt-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">P</div>
        <div>
          <div className="text-[13px] font-semibold text-white">Pinecrest Care</div>
          <div className="text-[10px] text-[var(--green)]">● Arbiter assistant</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[12px] leading-snug ${
              m.sender === "Patient"
                ? "self-end rounded-br-md bg-[var(--accent)] text-white"
                : "self-start rounded-bl-md bg-[#23232a] text-[var(--text)]"
            }`}
          >
            {m.message}
          </div>
        ))}
        {isTyping && (
          <div className="self-start rounded-2xl rounded-bl-md bg-[#23232a] px-3 py-2 text-[12px] text-[var(--faint)]">
            Arbiter is responding…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-full bg-[#23232a] px-3 py-1.5">
          <input
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(input);
              }
            }}
            placeholder="Type a reply…"
            className="flex-1 bg-transparent text-[12px] text-[var(--text)] outline-none placeholder:text-[var(--faint)]"
          />
          <button
            onClick={() => onSend(input)}
            disabled={!input.trim()}
            className="text-[11px] font-semibold text-[var(--accent)] disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TraceRow({ event }: { event: BackendTraceEvent }) {
  const colorMap: Record<string, string> = {
    CONTEXT_LOADED: "var(--blue)",
    SLOT_IDENTIFIED: "var(--green)",
    MESSAGE_SENT: "var(--muted)",
    PATIENT_RESPONSE_RECEIVED: "var(--blue)",
    INTENT_CLASSIFIED: "var(--amber)",
    REASON_CAPTURED: "var(--green)",
    REBOOKING_TASK_CREATED: "var(--green)",
    STAFF_ESCALATION_CREATED: "var(--amber)",
    KPI_UPDATED: "var(--accent)",
    OPT_OUT_RECORDED: "var(--accent)",
    WRONG_NUMBER_FLAGGED: "var(--accent)",
    LANGUAGE_UPDATED: "var(--blue)",
    BILLING_HANDOFF: "var(--amber)",
    CLINICAL_ESCALATION: "var(--accent)",
    FOLLOW_UP_SCHEDULED: "var(--muted)",
  };
  const color = colorMap[event.eventType] ?? "var(--muted)";
  const time = new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex gap-2.5 text-[11px]">
      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, marginTop: 5 }} />
      <div className="min-w-0">
        <span className="font-mono text-[var(--faint)]">{time}</span>
        <span className="ml-2 font-medium" style={{ color }}>{event.eventType}</span>
        <div className="text-[var(--muted)] leading-snug">{event.description}</div>
      </div>
    </div>
  );
}

function ContextPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px]">
      <div className="text-[var(--faint)]">{label}</div>
      <div className="font-medium text-[var(--text)]">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-xl font-bold">No appointment selected</h1>
      <p className="mt-2 max-w-sm text-[14px] text-[var(--muted)]">
        Head to Trigger Intake, select an appointment, and send it to the Agent Workflow.
      </p>
      <Link href="/" className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)]">
        ← Go to Trigger Intake
      </Link>
    </div>
  );
}
