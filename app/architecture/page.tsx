const layers = [
  {
    title: "System of record",
    color: "var(--teal)",
    nodes: [
      { name: "Epic / EHR", desc: "Appointments, patient prefs, history" },
      { name: "FHIR + Scheduling APIs", desc: "Read intent · write outcomes" },
    ],
  },
  {
    title: "Integration",
    color: "var(--accent)",
    nodes: [
      { name: "MCP Server", desc: "Exposes EHR data + actions as tools" },
      { name: "Event listener", desc: "Subscribes to appointment events" },
    ],
  },
  {
    title: "Reasoning",
    color: "var(--amber)",
    nodes: [
      { name: "Intent Orchestrator Agent", desc: "Who · why · urgency · channel" },
      { name: "Policy + guardrails", desc: "Quiet hours · scope · escalation" },
    ],
  },
  {
    title: "Channels",
    color: "#c084fc",
    nodes: [
      { name: "Text agent", desc: "SMS conversation" },
      { name: "Email agent", desc: "Rich email + slot picker" },
      { name: "Voice agent", desc: "Live call + transcript" },
      { name: "Video agent", desc: "Accessible video visit" },
    ],
  },
];

export default function ArchitecturePage() {
  return (
    <div>
      <header className="py-8">
        <span className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
          Step 03
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          End-to-end architecture
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          How an appointment event flows from Epic to the patient's phone — and
          how the outcome flows back. Each box maps to a real component.
        </p>
      </header>

      <div className="space-y-3">
        {layers.map((layer, li) => (
          <div key={layer.title}>
            <div className="flex items-stretch gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="flex w-32 shrink-0 items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: layer.color }}
                  />
                  <span className="text-sm font-semibold">{layer.title}</span>
                </div>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {layer.nodes.map((n) => (
                  <div
                    key={n.name}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
                    style={{ borderTopColor: layer.color, borderTopWidth: 2 }}
                  >
                    <div className="text-sm font-semibold">{n.name}</div>
                    <div className="mt-1 text-xs leading-snug text-[var(--muted)]">
                      {n.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {li < layers.length - 1 && (
              <div className="flex justify-center py-1 text-[var(--muted)]">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] p-5 text-sm">
        <span className="text-2xl">📱</span>
        <span className="text-[var(--muted)]">
          Patient responds on their channel of choice →{" "}
          <span className="text-[var(--text)]">
            outcome is written back to Epic, loop closed.
          </span>
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
        <h3 className="text-lg font-semibold">The flow in one sentence</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Epic emits an appointment event → the MCP server packages it with
          patient preferences → the intent orchestrator decides the right
          channel and message → a channel agent holds the conversation → the
          confirmed appointment is written back to Epic. No human in the loop
          unless policy says so.
        </p>
      </div>
    </div>
  );
}
