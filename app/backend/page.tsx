const steps = [
  {
    n: 1,
    title: "Hospital connects Epic",
    body: "Arbiter authenticates against the hospital's Epic instance (FHIR + scheduling APIs). No patient data leaves the EHR's trust boundary without an explicit, audited request.",
    tag: "One-time setup",
  },
  {
    n: 2,
    title: "Configure outreach policy",
    body: "The hospital sets the rules: which channels are allowed, quiet hours, escalation thresholds, and which appointment types Arbiter is permitted to act on.",
    tag: "Per-department",
  },
  {
    n: 3,
    title: "An event fires",
    body: "A new appointment request, a cancellation, or a no-risk flag in Epic emits an event. This is the trigger — no human has to push a button.",
    tag: "Automatic",
  },
  {
    n: 4,
    title: "Arbiter picks up the intent",
    body: "The MCP server reads the event + patient channel preferences and hands a structured intent to the orchestrator: who, why, urgency, and preferred channel.",
    tag: "Real-time",
  },
];

const triggerExample = `{
  "event": "appointment.request.created",
  "patient_ref": "Patient/abc-123",
  "appointment": {
    "type": "cardiology-followup",
    "window": "2026-07-10..2026-07-24",
    "priority": "routine"
  },
  "channel_preference": ["text", "email", "voice"],
  "consent": { "sms": true, "voice": true, "video": false }
}`;

export default function BackendPage() {
  return (
    <div>
      <header className="py-8">
        <span className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
          Step 01
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          What setup looks like for a hospital
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Arbiter is configured once, then runs on events. Here's how a hospital
          wires it up and how an appointment request actually initiates the
          flow.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] font-bold text-[var(--accent)]">
                {s.n}
              </div>
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                {s.tag}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
          <h3 className="text-lg font-semibold">The trigger event</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            When Epic emits an appointment request, this is the shape of the
            payload Arbiter receives. Mock example:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-xs leading-relaxed text-[var(--teal)]">
            <code>{triggerExample}</code>
          </pre>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
          <h3 className="text-lg font-semibold">What the hospital controls</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["Channels", "email · text · voice · video — toggle per dept."],
              ["Quiet hours", "No outreach 9pm–8am patient-local."],
              ["Escalation", "Hand to a human after 2 failed confirmations."],
              ["Scope", "Routine follow-ups only; no urgent/clinical triage."],
              ["Audit", "Every message + EHR write is logged and reviewable."],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>
                  <span className="font-semibold">{k}:</span>{" "}
                  <span className="text-[var(--muted)]">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
