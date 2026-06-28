"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCohort } from "@/lib/store";
import { isLocked, CareNeed, Risk, Source } from "@/lib/types";
import {
  ChannelBadge,
  RiskBadge,
  SourceBadge,
  StatusBadge,
} from "@/components/Badges";
import { AddPatientModal } from "@/components/AddPatientModal";

const CARE_NEEDS: (CareNeed | "All")[] = [
  "All",
  "Infusion therapy",
  "Oncology follow-up",
  "Cardiology follow-up",
  "Post-discharge check-in",
  "Imaging / diagnostic",
  "Lab work",
];

export default function TriggerIntakePage() {
  const router = useRouter();
  const {
    patients,
    selectedIds,
    toggleSelect,
    selectAllEligible,
    clearSelection,
    dispatch,
  } = useCohort();

  const [query, setQuery] = useState("");
  const [careNeed, setCareNeed] = useState<CareNeed | "All">("All");
  const [risk, setRisk] = useState<Risk | "All">("All");
  const [source, setSource] = useState<Source | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (careNeed !== "All" && p.careNeed !== careNeed) return false;
      if (risk !== "All" && p.risk !== risk) return false;
      if (source !== "All" && p.source !== source) return false;
      return true;
    });
  }, [patients, query, careNeed, risk, source]);

  const eligibleCount = patients.filter((p) => !isLocked(p)).length;

  function handleDispatch() {
    if (selectedIds.length === 0) return;
    dispatch();
    router.push("/workflow");
  }

  return (
    <div>
      <PageHeader />

      {/* Intake lanes */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <LaneCard
          title="EHR-synced intake"
          desc="Pulled automatically from the scheduling feed."
          count={patients.filter((p) => p.source === "EHR").length}
          accent
        />
        <LaneCard
          title="Manually-added"
          desc="Staff-curated additions for this cohort."
          count={patients.filter((p) => p.source === "Manual").length}
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-2.5 py-1 text-[12px] font-medium text-[var(--text)] hover:border-[var(--accent)]"
            >
              + Add patient
            </button>
          }
        />
      </div>

      {/* Filter bar */}
      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient…"
          className="w-44 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[13px] outline-none placeholder:text-[var(--faint)] focus:border-[var(--accent)]"
        />
        <Select
          value={careNeed}
          onChange={(v) => setCareNeed(v as CareNeed | "All")}
          options={CARE_NEEDS}
        />
        <Select
          value={risk}
          onChange={(v) => setRisk(v as Risk | "All")}
          options={["All", "High", "Medium", "Low"]}
        />
        <Select
          value={source}
          onChange={(v) => setSource(v as Source | "All")}
          options={["All", "EHR", "Manual"]}
          labels={{ EHR: "EHR-synced", Manual: "Manual" }}
        />
        <div className="ml-auto flex items-center gap-2 text-[12px] text-[var(--muted)]">
          <button
            onClick={selectAllEligible}
            className="rounded px-2 py-1 hover:text-[var(--text)]"
          >
            Select all eligible ({eligibleCount})
          </button>
          <button
            onClick={clearSelection}
            className="rounded px-2 py-1 hover:text-[var(--text)]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-left">
          <thead className="bg-[var(--panel-2)] text-[11px] uppercase tracking-wide text-[var(--faint)]">
            <tr>
              <Th className="w-8"> </Th>
              <Th>Patient</Th>
              <Th>Age</Th>
              <Th>Care need</Th>
              <Th>Risk</Th>
              <Th>Channel</Th>
              <Th>Trigger</Th>
              <Th>Last contacted</Th>
              <Th>Status</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {filtered.map((p) => {
              const locked = isLocked(p);
              const checked = selectedIds.includes(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={() => !locked && toggleSelect(p.id)}
                  className={`text-[13px] transition-colors ${
                    locked
                      ? "cursor-not-allowed bg-[var(--bg)] opacity-50"
                      : checked
                        ? "cursor-pointer bg-[var(--accent-soft)]/40"
                        : "cursor-pointer bg-[var(--panel)] hover:bg-[var(--panel-2)]"
                  }`}
                >
                  <Td>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={locked}
                      readOnly
                      className="h-3.5 w-3.5 accent-[var(--accent)]"
                    />
                  </Td>
                  <Td>
                    <div className="font-medium text-[var(--text)]">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[var(--faint)]">
                      {p.id} · {p.language}
                    </div>
                  </Td>
                  <Td className="tabular text-[var(--muted)]">{p.age}</Td>
                  <Td className="text-[var(--muted)]">{p.careNeed}</Td>
                  <Td>
                    <RiskBadge risk={p.risk} />
                  </Td>
                  <Td>
                    <ChannelBadge channel={p.channel} />
                  </Td>
                  <Td className="text-[var(--muted)]">{p.triggerType}</Td>
                  <Td className="text-[var(--muted)]">{p.lastContacted}</Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                  <Td>
                    <SourceBadge source={p.source} />
                  </Td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="bg-[var(--panel)] px-4 py-10 text-center text-[13px] text-[var(--faint)]"
                >
                  No patients match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sticky dispatch bar */}
      <div className="sticky bottom-4 mt-4 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--panel)]/95 p-3 backdrop-blur">
        <div className="text-[13px] text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">
            {selectedIds.length}
          </span>{" "}
          selected · Confirmed and Opted-out rows are locked (human gate)
        </div>
        <button
          onClick={handleDispatch}
          disabled={selectedIds.length === 0}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--faint)]"
        >
          Send to Agent Workflow →
        </button>
      </div>

      <AddPatientModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function PageHeader() {
  return (
    <header className="pt-2">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[var(--accent)]">
        <span>Step 01 — Setup</span>
      </div>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">Trigger Intake</h1>
      <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
        Review patients with a pending care need, curate who is eligible, and
        dispatch the cohort to the agent. This is the human gate that keeps the
        AI bounded.
      </p>
    </header>
  );
}

function LaneCard({
  title,
  desc,
  count,
  accent,
  action,
}: {
  title: string;
  desc: string;
  count: number;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border bg-[var(--panel)] p-3 ${
        accent ? "border-[var(--accent)]/30" : "border-[var(--border)]"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold">{title}</span>
          <span className="tabular rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[11px] text-[var(--muted)]">
            {count}
          </span>
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--faint)]">{desc}</div>
      </div>
      {action}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[13px] outline-none focus:border-[var(--accent)]"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? "All" : labels?.[o] ?? o}
        </option>
      ))}
    </select>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={`px-3 py-2 font-medium ${className}`}>{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2.5 align-middle ${className}`}>{children}</td>;
}
