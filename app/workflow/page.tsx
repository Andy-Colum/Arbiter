"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCohort } from "@/lib/store";
import { SCENARIOS } from "@/lib/data";
import { Channel, ScenarioId, isLocked } from "@/lib/types";
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

type Phase = "idle" | "sending" | "responded";

export default function WorkflowPage() {
  const { dispatchedPatients, patients } = useCohort();

  // Fall back to eligible patients if the page is opened directly.
  const cohort = useMemo(
    () =>
      dispatchedPatients.length > 0
        ? dispatchedPatients
        : patients.filter((p) => !isLocked(p)),
    [dispatchedPatients, patients]
  );

  const [activeId, setActiveId] = useState(cohort[0]?.id);
  const activePatient =
    cohort.find((p) => p.id === activeId) ?? cohort[0];

  const [channel, setChannel] = useState<Channel>(
    activePatient?.channel ?? "SMS"
  );
  const [scenario, setScenario] = useState<ScenarioId>("clinical");
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [clock, setClock] = useState(0);

  // When the active patient changes, snap the channel to their preference.
  useEffect(() => {
    if (activePatient) {
      setChannel(activePatient.channel);
      resetSim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function resetSim() {
    setPhase("idle");
    setRevealed(0);
    setClock(0);
  }

  const scenarioData = SCENARIOS.find((s) => s.id === scenario)!;

  // Drive the simulation timeline.
  useEffect(() => {
    if (phase !== "sending") return;
    setClock(0);
    const clockTick = setInterval(() => setClock((c) => c + 1), 250);
    const toResponded = setTimeout(() => setPhase("responded"), 1400);
    return () => {
      clearInterval(clockTick);
      clearTimeout(toResponded);
    };
  }, [phase]);

  // Reveal decision-chain steps one at a time after the response lands.
  useEffect(() => {
    if (phase !== "responded") return;
    setRevealed(0);
    const timers = scenarioData.steps.map((_, i) =>
      setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), 350 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, scenario, scenarioData.steps]);

  if (!activePatient) {
    return <EmptyState />;
  }

  const responded = phase === "responded";

  return (
    <div>
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 02 — See it work · centerpiece
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Agent Workflow</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          Exactly what the patient receives, then send and watch the agent handle
          a real response — with the decision chain made visible.
        </p>
      </header>

      {/* Cohort strip */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-[var(--faint)]">
          Cohort ({cohort.length}):
        </span>
        {cohort.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`rounded-full border px-2.5 py-1 text-[12px] transition-colors ${
              p.id === activePatient.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {p.name.split(" ")[0]} · {p.channel}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Phone column */}
        <div>
          {/* Channel switcher */}
          <div className="mb-3 inline-flex w-full justify-between gap-1 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-1">
            {CHANNELS.map((c) => {
              const consented =
                activePatient.consent[
                  c.id.toLowerCase() as keyof typeof activePatient.consent
                ];
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setChannel(c.id);
                    resetSim();
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
                    channel === c.id
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                  title={consented ? "" : "No consent on file"}
                >
                  <span>{c.icon}</span>
                  {c.id}
                  {!consented && (
                    <span className="text-[10px] text-[var(--amber)]">!</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <PhoneFrame>
              {channel === "SMS" && (
                <TextChannel
                  patient={activePatient}
                  scenario={scenario}
                  responded={responded}
                />
              )}
              {channel === "Email" && <EmailChannel patient={activePatient} />}
              {channel === "Voice" && (
                <VoiceChannel patient={activePatient} playing={phase !== "idle"} />
              )}
              {channel === "Video" && (
                <VideoChannel patient={activePatient} playing={phase !== "idle"} />
              )}
            </PhoneFrame>
          </div>

          {/* Action bar */}
          <div className="mt-3">
            <button
              onClick={() => setPhase("sending")}
              disabled={phase !== "idle"}
              className="w-full rounded-md bg-[var(--accent)] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--faint)]"
            >
              {phase === "idle"
                ? "Send Outreach"
                : phase === "sending"
                  ? "Sending…"
                  : "Outreach sent ✓"}
            </button>
            {phase !== "idle" && (
              <button
                onClick={resetSim}
                className="mt-2 w-full rounded-md border border-[var(--border)] py-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
              >
                Reset simulation
              </button>
            )}
          </div>
        </div>

        {/* Simulation column */}
        <div>
          {/* Scenario selector */}
          <div className="mb-3">
            <div className="mb-2 text-[11px] uppercase tracking-wide text-[var(--faint)]">
              Response scenario
            </div>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScenario(s.id);
                    if (phase !== "idle") setPhase("idle");
                    resetSim();
                  }}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    scenario === s.id
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                      : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {s.short}
                  {s.guardrail && (
                    <span className="ml-1.5 rounded bg-[var(--accent)] px-1 text-[9px] uppercase text-white">
                      guardrail
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Decision chain */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
              <div className="text-[13px] font-semibold">{scenarioData.title}</div>
              <div className="tabular text-[11px] text-[var(--faint)]">
                {phase === "idle"
                  ? "t = 0:00"
                  : `t = +${(clock * 0.25).toFixed(1)}s (simulated)`}
              </div>
            </div>

            {phase === "idle" ? (
              <p className="py-8 text-center text-[13px] text-[var(--faint)]">
                Press <span className="text-[var(--text)]">Send Outreach</span> to
                simulate the patient response and watch the agent handle it.
              </p>
            ) : (
              <ol className="mt-3 space-y-2.5">
                {scenarioData.steps.map((step, i) => {
                  const shown = i < revealed;
                  return (
                    <li
                      key={i}
                      className={`flex gap-3 rounded-md border p-3 transition-all duration-300 ${
                        shown
                          ? "opacity-100"
                          : "translate-y-1 opacity-0"
                      } ${toneClasses(step.tone)}`}
                    >
                      <ToneDot tone={step.tone} />
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {step.label}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[var(--muted)]">
                          {step.detail}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--faint)]">
            <span className="rounded border border-dashed border-[var(--border)] px-1.5 py-0.5">
              Simulated
            </span>
            Mock responses. In production these are generated live by the channel
            agent and outcomes feed Pages 3 &amp; 4.
          </div>
        </div>
      </div>
    </div>
  );
}

function toneClasses(tone: string) {
  switch (tone) {
    case "patient":
      return "border-[var(--blue)]/30 bg-[var(--blue)]/5";
    case "agent":
      return "border-[var(--border)] bg-[var(--panel-2)]";
    case "alert":
      return "border-[var(--accent)]/50 bg-[var(--accent-soft)]";
    case "action":
      return "border-[var(--amber)]/30 bg-[var(--amber)]/5";
    case "outcome":
      return "border-[var(--green)]/30 bg-[var(--green)]/5";
    default:
      return "border-[var(--border)]";
  }
}

function ToneDot({ tone }: { tone: string }) {
  const color =
    tone === "patient"
      ? "var(--blue)"
      : tone === "alert"
        ? "var(--accent)"
        : tone === "action"
          ? "var(--amber)"
          : tone === "outcome"
            ? "var(--green)"
            : "var(--muted)";
  return (
    <span
      className="mt-1 h-2 w-2 shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-xl font-bold">No cohort dispatched yet</h1>
      <p className="mt-2 max-w-sm text-[14px] text-[var(--muted)]">
        Head to Trigger Intake, select patients, and send them to the Agent
        Workflow.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)]"
      >
        ← Go to Trigger Intake
      </Link>
    </div>
  );
}
