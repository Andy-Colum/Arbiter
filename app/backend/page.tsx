import { FutureTag } from "@/components/Badges";

const dataSources = [
  { name: "EHR / scheduling system", desc: "Appointments, visit history, order status.", future: true },
  { name: "SFTP appointment feed", desc: "Batch missed/cancelled visit exports.", future: false },
  { name: "Preference + consent store", desc: "Channel, time, language, opt-in/out.", future: false },
  { name: "Available-slot inventory", desc: "Open slots by service line and site.", future: false },
  { name: "Approved content library", desc: "Vetted scripts + translated templates.", future: false },
  { name: "Business + clinical rules", desc: "Eligibility, quiet hours, escalation policy.", future: false },
];

const boundary = {
  autonomous: [
    "Send approved outreach on the patient's channel",
    "Classify intent (billing, language, clinical, scheduling)",
    "Route to the correct queue / human",
    "Create a guided-rebooking task with a proposed slot",
    "Escalate channel and retry on schedule",
  ],
  approval: [
    "Any clinical response to the patient",
    "Direct schedule writeback to the EHR",
    "Sending outside consented channels or quiet hours",
    "Overriding an opt-out",
  ],
};

const routing = [
  { intent: "Clinical question", to: "Triage nurse", tone: "alert" },
  { intent: "Billing / coverage", to: "Financial counselor", tone: "amber" },
  { intent: "Language support", to: "Interpreter / translated flow", tone: "blue" },
  { intent: "Wrong number", to: "Suppress + flag record", tone: "muted" },
  { intent: "Opt-out request", to: "Honor immediately", tone: "muted" },
];

export default function BackendPage() {
  return (
    <div>
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 03 — Trust it
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Escalation / Backend
        </h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          Where the data comes from, how scheduling and autonomous actions fire,
          and where exceptions route — with the human-in-the-loop line drawn
          explicitly.
        </p>
      </header>

      {/* Phase banner */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-[12.5px]">
        <span className="rounded bg-[var(--green)]/15 px-2 py-0.5 font-semibold text-[var(--green)]">
          Phase 1 — Human-in-the-loop (this pilot)
        </span>
        <span className="text-[var(--faint)]">→</span>
        <span className="rounded border border-dashed border-[var(--border)] px-2 py-0.5 font-semibold text-[var(--faint)]">
          Phase 2 — Expanded autonomy (future-state)
        </span>
      </div>

      {/* Data sources */}
      <Section title="Data sources" subtitle="What the agent is grounded in.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dataSources.map((d) => (
            <div
              key={d.name}
              className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold">{d.name}</span>
                {d.future && <FutureTag>Live = future</FutureTag>}
              </div>
              <p className="mt-1 text-[12px] text-[var(--muted)]">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Scheduling logic */}
        <Section
          title="Scheduling / rebooking logic"
          subtitle="How a recovery slot is chosen."
          inGrid
        >
          <ol className="space-y-2.5">
            {[
              "A missed or cancelled visit triggers recovery.",
              "Agent matches service line + site + clinical/operational rules.",
              "Picks the first appropriate open slot from inventory.",
              'Offers guided rebooking: "Tuesday 3 PM is open — does that work?"',
              "On accept → rebooking task created for staff confirmation.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-[13px]">
                <span className="tabular flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px] font-bold text-[var(--accent)]">
                  {i + 1}
                </span>
                <span className="text-[var(--muted)]">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 rounded-md border border-[var(--border)] bg-[var(--panel-2)] p-2.5 text-[12px] text-[var(--faint)]">
            Schedule writeback to the EHR is staff-approved in Phase 1.{" "}
            <FutureTag>Auto-writeback = Phase 2</FutureTag>
          </div>
        </Section>

        {/* Preferences */}
        <Section
          title="Preferences"
          subtitle="Channel, time, language, consent."
          inGrid
        >
          <ul className="space-y-2.5 text-[13px]">
            {[
              ["Channel", "Sourced from preference store; respected per message."],
              ["Time", "Quiet hours enforced in patient-local time."],
              ["Language", "Detected + matched to preference; translated scripts."],
              ["Consent", "Per-channel opt-in required before any send."],
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
          <div className="mt-3 rounded-md border border-[var(--border)] bg-[var(--panel-2)] p-2.5 text-[12px] text-[var(--faint)]">
            <span className="font-semibold text-[var(--text)]">
              Missing preference?
            </span>{" "}
            Fallback to safest default channel (SMS if consented, else staff
            task) — never an unconsented send.
          </div>
        </Section>
      </div>

      {/* Autonomous boundary */}
      <Section
        title="Autonomous action boundary"
        subtitle="The human-in-the-loop line, drawn explicitly."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--green)]/30 bg-[var(--green)]/5 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--green)]">
              Agent does on its own
            </div>
            <ul className="mt-2 space-y-1.5">
              {boundary.autonomous.map((b) => (
                <li key={b} className="flex gap-2 text-[13px] text-[var(--text)]">
                  <span className="text-[var(--green)]">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-soft)] p-4">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              Requires staff approval
            </div>
            <ul className="mt-2 space-y-1.5">
              {boundary.approval.map((b) => (
                <li key={b} className="flex gap-2 text-[13px] text-[var(--text)]">
                  <span className="text-[var(--accent)]">⛔</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Exception routing */}
      <Section
        title="Exception routing / queue"
        subtitle="Where each escalation goes."
      >
        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[var(--panel-2)] text-[11px] uppercase tracking-wide text-[var(--faint)]">
              <tr>
                <th className="px-3 py-2 font-medium">Intent / exception</th>
                <th className="px-3 py-2 font-medium">Routes to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {routing.map((r) => (
                <tr key={r.intent} className="bg-[var(--panel)]">
                  <td className="px-3 py-2.5 font-medium">{r.intent}</td>
                  <td className="px-3 py-2.5 text-[var(--muted)]">{r.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  inGrid,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  inGrid?: boolean;
}) {
  return (
    <section className={inGrid ? "" : "mt-6"}>
      <div className="mb-3">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-[12px] text-[var(--faint)]">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
