const funnel = [
  { stage: "Identified", count: 420 },
  { stage: "Contacted", count: 408 },
  { stage: "Responded", count: 291 },
  { stage: "Scheduled", count: 214 },
  { stage: "Completed", count: 176 },
  { stage: "Feedback", count: 142 },
];

const agentPerf = [
  { label: "Autonomous", count: 188, color: "var(--green)" },
  { label: "Retry", count: 64, color: "var(--amber)" },
  { label: "Escalated to human", count: 48, color: "var(--blue)" },
  { label: "Failed", count: 12, color: "var(--accent)" },
];

const kpis = [
  { label: "Same-day leakage rate", value: "11.4%", sub: "test", compare: "vs 18.9% control · 21.2% baseline", tier: "primary", good: true },
  { label: "Confirmation rate", value: "71%", sub: "leading indicator", compare: "+19 pts vs control", tier: "leading", good: true },
  { label: "Completed recovered visits", value: "176", sub: "business value", compare: "of 214 scheduled", tier: "value", good: true },
  { label: "Reason-capture rate", value: "63%", sub: "", compare: "of responders", tier: "normal", good: true },
  { label: "Rebooking acceptance", value: "74%", sub: "", compare: "of offers", tier: "normal", good: true },
  { label: "Staff time saved", value: "~46 hrs", sub: "", compare: "this pilot window", tier: "normal", good: true },
  { label: "Opt-out / complaint rate", value: "1.2%", sub: "guardrail", compare: "within target (<3%)", tier: "guardrail", good: true },
];

export default function DashboardPage() {
  const maxFunnel = funnel[0].count;
  const totalPerf = agentPerf.reduce((s, a) => s + a.count, 0);

  return (
    <div>
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 04 — Prove it
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          The recovery funnel and agent performance against the pilot KPIs.
          Completed recovered visits — not just scheduled — are the payoff.
        </p>
      </header>

      {/* KPI hierarchy row */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis
          .filter((k) =>
            ["leading", "primary", "value", "guardrail"].includes(k.tier)
          )
          .map((k) => (
            <KpiCard key={k.label} {...k} highlight />
          ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
          <h2 className="text-[15px] font-semibold">Recovery funnel</h2>
          <p className="text-[12px] text-[var(--faint)]">
            Conversion and drop-off at each stage.
          </p>
          <div className="mt-4 space-y-2.5">
            {funnel.map((f, i) => {
              const pct = Math.round((f.count / maxFunnel) * 100);
              const prev = i > 0 ? funnel[i - 1].count : f.count;
              const drop = i > 0 ? prev - f.count : 0;
              const conv = i > 0 ? Math.round((f.count / prev) * 100) : 100;
              return (
                <div key={f.stage}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-medium">{f.stage}</span>
                    <span className="tabular text-[var(--muted)]">
                      {f.count}
                      {i > 0 && (
                        <span className="ml-2 text-[var(--faint)]">
                          {conv}% · −{drop}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-6 overflow-hidden rounded bg-[var(--panel-2)]">
                    <div
                      className="flex h-full items-center rounded bg-gradient-to-r from-[var(--accent)] to-[#7a1d27] px-2 text-[10px] font-semibold text-white"
                      style={{ width: `${pct}%` }}
                    >
                      {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent performance */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
          <h2 className="text-[15px] font-semibold">Agent performance</h2>
          <p className="text-[12px] text-[var(--faint)]">
            How outreach outcomes resolved.
          </p>

          {/* stacked bar */}
          <div className="mt-4 flex h-7 overflow-hidden rounded">
            {agentPerf.map((a) => (
              <div
                key={a.label}
                style={{
                  width: `${(a.count / totalPerf) * 100}%`,
                  background: a.color,
                }}
                title={`${a.label}: ${a.count}`}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {agentPerf.map((a) => {
              const pct = Math.round((a.count / totalPerf) * 100);
              return (
                <div
                  key={a.label}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: a.color }}
                    />
                    {a.label}
                  </span>
                  <span className="tabular text-[var(--muted)]">
                    {a.count}{" "}
                    <span className="text-[var(--faint)]">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--panel-2)] p-2.5 text-[12px] text-[var(--muted)]">
            <span className="font-semibold text-[var(--green)]">
              {Math.round((agentPerf[0].count / totalPerf) * 100)}%
            </span>{" "}
            resolved autonomously — every clinical case was escalated to a human.
          </div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold">All pilot KPIs</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
      </div>

      {/* Feedback / sentiment guardrail */}
      <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold">
              Patient experience signal
            </h2>
            <p className="text-[12px] text-[var(--faint)]">
              Sentiment from post-interaction feedback — the guardrail metric.
            </p>
          </div>
          <span className="rounded bg-[var(--green)]/15 px-2 py-1 text-[12px] font-semibold text-[var(--green)]">
            Positive 88%
          </span>
        </div>
        <div className="mt-3 flex h-3 overflow-hidden rounded">
          <div style={{ width: "88%" }} className="bg-[var(--green)]" />
          <div style={{ width: "9%" }} className="bg-[var(--amber)]" />
          <div style={{ width: "3%" }} className="bg-[var(--accent)]" />
        </div>
        <div className="mt-2 flex gap-4 text-[11px] text-[var(--muted)]">
          <span>● Positive 88%</span>
          <span>● Neutral 9%</span>
          <span>● Negative 3%</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[var(--faint)]">
        All figures are mock data for demonstration.
      </p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  compare,
  tier,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  compare?: string;
  tier?: string;
  highlight?: boolean;
}) {
  const tierColor =
    tier === "primary"
      ? "var(--accent)"
      : tier === "leading"
        ? "var(--blue)"
        : tier === "value"
          ? "var(--green)"
          : tier === "guardrail"
            ? "var(--amber)"
            : "var(--border)";
  return (
    <div
      className="rounded-lg border bg-[var(--panel)] p-3"
      style={{
        borderColor: highlight ? tierColor : "var(--border)",
        borderTopWidth: highlight ? 2 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[var(--muted)]">{label}</span>
        {sub && (
          <span
            className="text-[10px] font-medium uppercase tracking-wide"
            style={{ color: tierColor }}
          >
            {sub}
          </span>
        )}
      </div>
      <div className="tabular mt-1 text-2xl font-bold">{value}</div>
      {compare && (
        <div className="mt-0.5 text-[11px] text-[var(--faint)]">{compare}</div>
      )}
    </div>
  );
}
