import { StaffingCalculator } from "@/components/StaffingCalculator";
import { CancellationReason, ReasonStat } from "@/lib/types";

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

// Change 3: sublabels removed. Leakage comparison rendered as mini bars below.
const kpis = [
  { label: "Same-day leakage rate", value: "11.4%", sub: "primary outcome", tier: "primary" },
  { label: "Confirmation rate", value: "71%", sub: "leading indicator", tier: "leading" },
  { label: "Completed recovered visits", value: "176", sub: "business value", tier: "value" },
  { label: "Rebooking acceptance", value: "74%", sub: "", tier: "normal" },
  { label: "Opt-out / complaint rate", value: "1.2%", sub: "guardrail", tier: "guardrail" },
];

// Leakage: test vs control vs baseline (mini bars, not a text annotation). Lower is better.
const leakageBars = [
  { label: "Test", value: 11.4, color: "var(--green)" },
  { label: "Control", value: 18.9, color: "var(--amber)" },
  { label: "Baseline", value: 21.2, color: "var(--accent)" },
];

// Change 1: reason capture (N = cancellation/no-show responses, mock).
const REASON_N = 200;
const reasonStats: ReasonStat[] = [
  { reason: "no_reason_given", pct: 40, count: 80 },
  { reason: "transportation", pct: 14, count: 28 },
  { reason: "illness", pct: 12, count: 24 },
  { reason: "financial", pct: 10, count: 20 },
  { reason: "schedule_conflict", pct: 9, count: 18 },
  { reason: "prep_confusion", pct: 6, count: 12 },
  { reason: "clinical_concern", pct: 5, count: 10 },
  { reason: "wrong_number", pct: 2, count: 4 },
  { reason: "other", pct: 2, count: 4 },
];

const REASON_LABELS: Record<CancellationReason, string> = {
  no_reason_given: "No reason given",
  transportation: "Transportation / mobility",
  illness: "Illness / health",
  financial: "Financial / insurance",
  schedule_conflict: "Schedule conflict",
  prep_confusion: "Prep confusion / questions",
  clinical_concern: "Clinical concern",
  wrong_number: "Wrong number / bad contact",
  other: "Other",
};

export default function DashboardPage() {
  const maxFunnel = funnel[0].count;
  const totalPerf = agentPerf.reduce((s, a) => s + a.count, 0);

  // Reason capture = share of responders who gave a categorizable reason.
  const captured = reasonStats
    .filter((r) => r.reason !== "no_reason_given")
    .reduce((s, r) => s + r.count, 0);
  const capturePct = Math.round((captured / REASON_N) * 100);
  const maxReasonPct = Math.max(...reasonStats.map((r) => r.pct));

  const contactedCount = funnel.find((f) => f.stage === "Contacted")?.count ?? 0;

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
            <KpiCard
              key={k.label}
              {...k}
              highlight
              miniBars={k.tier === "primary" ? leakageBars : undefined}
            />
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

      {/* Change 1: Reason capture */}
      <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-semibold">Reason capture</h2>
            <p className="text-[12px] text-[var(--faint)]">
              Share of cancellation / no-show responders who gave a
              categorizable reason.
            </p>
          </div>
          <div className="text-right">
            <span className="tabular text-2xl font-bold text-[var(--text)]">
              {capturePct}%
            </span>
            <span className="ml-2 text-[12px] text-[var(--muted)]">
              ({captured} of {REASON_N} responses)
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {reasonStats.map((r) => {
            const muted = r.reason === "no_reason_given";
            const width = Math.round((r.pct / maxReasonPct) * 100);
            return (
              <div key={r.reason}>
                <div className="mb-0.5 flex items-center justify-between text-[12px]">
                  <span className={muted ? "text-[var(--faint)]" : "text-[var(--text)]"}>
                    {REASON_LABELS[r.reason]}
                  </span>
                  <span className="tabular text-[var(--muted)]">
                    {r.pct}%{" "}
                    <span className="text-[var(--faint)]">({r.count})</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded bg-[var(--panel-2)]">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${width}%`,
                      background: muted ? "var(--faint)" : "var(--accent)",
                      opacity: muted ? 0.5 : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-[var(--faint)]">
          “No reason given” (~40%) is expected real-world behavior — shown for
          transparency, not hidden. Capture rate ≈ 100% − that share.
        </p>
      </div>

      {/* Change 2: Staffing savings calculator */}
      <div className="mt-6">
        <StaffingCalculator defaultPatientsHandled={contactedCount} />
      </div>

      {/* Secondary KPIs */}
      <div className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold">All pilot KPIs</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <KpiCard
              key={k.label}
              {...k}
              miniBars={k.tier === "primary" ? leakageBars : undefined}
            />
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
  tier,
  highlight,
  miniBars,
}: {
  label: string;
  value: string;
  sub?: string;
  tier?: string;
  highlight?: boolean;
  miniBars?: { label: string; value: number; color: string }[];
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

  const maxBar = miniBars ? Math.max(...miniBars.map((b) => b.value)) : 0;

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

      {/* Change 3: leakage comparison as mini bars, not a text annotation */}
      {miniBars && (
        <div className="mt-2 space-y-1">
          {miniBars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-[10px] text-[var(--faint)]">
                {b.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-[var(--panel-2)]">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(b.value / maxBar) * 100}%`,
                    background: b.color,
                  }}
                />
              </div>
              <span className="tabular w-10 shrink-0 text-right text-[10px] text-[var(--muted)]">
                {b.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
