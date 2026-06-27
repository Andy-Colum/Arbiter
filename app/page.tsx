import Link from "next/link";

const principles = [
  {
    title: "Meet patients where they are",
    body: "Not everyone answers a phone call or opens a portal. The same outreach should adapt across email, text, voice, and video — without the hospital lifting a finger.",
  },
  {
    title: "Close the loop, not just send a blast",
    body: "A reminder isn't done when it's sent. An agent confirms, reschedules, answers questions, and escalates to a human only when it actually needs to.",
  },
  {
    title: "The hospital's system of record stays the source of truth",
    body: "Preferences, scheduling, and history live in Epic. Arbiter reads intent and writes back outcomes — it orchestrates, it doesn't replace.",
  },
  {
    title: "Demo-honest architecture",
    body: "Every box in our diagram maps to something real: an MCP server, an intent orchestrator, channel agents. This demo runs the real shape with mock data.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="py-12 text-center">
        <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          Interactive demo · mock data
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight">
          Agentic patient outreach that adapts to{" "}
          <span className="text-[var(--accent)]">every channel</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-[var(--muted)]">
          When a hospital needs to reach a patient about an appointment, Arbiter
          picks the right channel, holds the conversation end-to-end, and writes
          the outcome back to the EHR.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/experience"
            className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            See the patient experience →
          </Link>
          <Link
            href="/architecture"
            className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--accent)]"
          >
            View architecture
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
          The principle behind the design
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
                {i + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--panel)] to-[var(--bg-soft)] p-8">
        <h2 className="text-xl font-semibold">How to read this demo</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Hospital Setup",
              d: "How a hospital configures Arbiter and how an appointment request kicks off the flow.",
            },
            {
              n: "02",
              t: "Patient Experience",
              d: "A phone view — switch between email, text, voice, and video to see what the patient gets.",
            },
            {
              n: "03",
              t: "Architecture",
              d: "The end-to-end system: Epic → MCP → orchestrator → channel agents.",
            },
          ].map((s) => (
            <div key={s.n}>
              <div className="text-2xl font-bold text-[var(--accent)]">
                {s.n}
              </div>
              <div className="mt-1 font-semibold">{s.t}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
