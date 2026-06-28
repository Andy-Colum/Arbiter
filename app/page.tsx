"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCohort } from "@/lib/store";
import { AppointmentRecord, AppointmentStatus, Risk, ServiceType } from "@/lib/types";

const SERVICE_TYPES: (ServiceType | "All")[] = [
  "All",
  "IV Hydration",
  "IV Iron Infusion",
  "Chemotherapy IV Infusion",
  "Chemotherapy IV Push",
  "Chemotherapy Injection",
  "Blood Transfusion",
  "Biologic Infusion",
  "Immunoglobulin Infusion",
  "Neurology Infusion",
  "Non-Chemo Therapeutic Infusion",
  "Port Flush / Line Care",
  "Supportive Oncology Injection",
];

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  Upcoming: "text-[var(--blue)] bg-[var(--blue)]/10 border-[var(--blue)]/20",
  Confirmed: "text-[var(--green)] bg-[var(--green)]/10 border-[var(--green)]/20",
  Cancelled: "text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20",
  "No Show": "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
  "Rebooking Needed": "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
  Completed: "text-[var(--green)] bg-[var(--green)]/10 border-[var(--green)]/20",
};

const RISK_COLORS: Record<Risk, string> = {
  High: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
  Medium: "text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20",
  Low: "text-[var(--green)] bg-[var(--green)]/10 border-[var(--green)]/20",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TriggerIntakePage() {
  const router = useRouter();
  const { appointments, selectedIds, toggleSelect, selectAllEligible, clearSelection, dispatch } =
    useCohort();

  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "All">("All");
  const [riskFilter, setRiskFilter] = useState<Risk | "All">("All");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (query && !a.patientName.toLowerCase().includes(query.toLowerCase())) return false;
      if (serviceFilter !== "All" && a.serviceType !== serviceFilter) return false;
      if (riskFilter !== "All" && a.riskLevel !== riskFilter) return false;
      if (statusFilter !== "All" && a.appointmentStatus !== statusFilter) return false;
      return true;
    });
  }, [appointments, query, serviceFilter, riskFilter, statusFilter]);

  const eligibleCount = appointments.filter((a) => a.appointmentStatus !== "Confirmed").length;

  function handleDispatch() {
    if (selectedIds.length === 0) return;
    dispatch();
    router.push("/workflow");
  }

  return (
    <div>
      <header className="pt-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 01 — Setup
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Trigger Intake</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          Review infusion appointments with a pending care need. Select records and dispatch
          to the agent workflow. This is the human gate that keeps the AI bounded.
        </p>
      </header>

      {/* Summary lane cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <LaneCard
          title="EHR-synced"
          desc="Pulled from the scheduling feed."
          count={appointments.filter((a) => a.source === "EHR").length}
          accent
        />
        <LaneCard
          title="High risk"
          desc="Flagged for priority outreach."
          count={appointments.filter((a) => a.riskLevel === "High").length}
          highlight="accent"
        />
        <LaneCard
          title="Needs recovery"
          desc="No show or rebooking needed."
          count={appointments.filter((a) =>
            ["No Show", "Rebooking Needed", "Cancelled"].includes(a.appointmentStatus)
          ).length}
          highlight="amber"
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
          value={serviceFilter}
          onChange={(v) => setServiceFilter(v as ServiceType | "All")}
          options={SERVICE_TYPES}
          placeholder="Service type"
        />
        <Select
          value={riskFilter}
          onChange={(v) => setRiskFilter(v as Risk | "All")}
          options={["All", "High", "Medium", "Low"]}
          placeholder="Risk"
        />
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as AppointmentStatus | "All")}
          options={["All", "Upcoming", "No Show", "Rebooking Needed", "Confirmed"]}
          placeholder="Status"
        />
        <div className="ml-auto flex items-center gap-2 text-[12px] text-[var(--muted)]">
          <button onClick={selectAllEligible} className="rounded px-2 py-1 hover:text-[var(--text)]">
            Select all eligible ({eligibleCount})
          </button>
          <button onClick={clearSelection} className="rounded px-2 py-1 hover:text-[var(--text)]">
            Clear
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <AppointmentCard
            key={a.appointmentId}
            record={a}
            selected={selectedIds.includes(a.appointmentId)}
            onToggle={() => {
              if (a.appointmentStatus !== "Confirmed") toggleSelect(a.appointmentId);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-lg border border-[var(--border)] bg-[var(--panel)] py-12 text-center text-[13px] text-[var(--faint)]">
            No appointments match these filters.
          </div>
        )}
      </div>

      {/* Sticky dispatch bar */}
      <div className="sticky bottom-4 mt-4 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--panel)]/95 p-3 backdrop-blur">
        <div className="text-[13px] text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">{selectedIds.length}</span>{" "}
          selected · Agent workflow will process the first selected record
        </div>
        <button
          onClick={handleDispatch}
          disabled={selectedIds.length === 0}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--faint)]"
        >
          Send to Agent Flow →
        </button>
      </div>
    </div>
  );
}

function AppointmentCard({
  record,
  selected,
  onToggle,
}: {
  record: AppointmentRecord;
  selected: boolean;
  onToggle: () => void;
}) {
  const locked = record.appointmentStatus === "Confirmed";
  const statusCls = STATUS_COLORS[record.appointmentStatus] ?? "border-[var(--border)]";
  const riskCls = RISK_COLORS[record.riskLevel] ?? "";

  return (
    <div
      onClick={onToggle}
      className={`rounded-lg border p-4 transition-all ${
        locked
          ? "cursor-not-allowed opacity-50 border-[var(--border)] bg-[var(--bg)]"
          : selected
          ? "cursor-pointer border-[var(--accent)] bg-[var(--accent-soft)]/20 ring-1 ring-[var(--accent)]/30"
          : "cursor-pointer border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent)]/40 hover:bg-[var(--panel-2)]"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            disabled={locked}
            readOnly
            className="h-3.5 w-3.5 shrink-0 accent-[var(--accent)]"
          />
          <div>
            <div className="text-[14px] font-semibold text-[var(--text)]">{record.patientName}</div>
            <div className="text-[11px] text-[var(--faint)]">
              {record.patientId} · {record.age}yo · {record.preferredLanguage}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusCls}`}>
            {record.appointmentStatus}
          </span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${riskCls}`}>
            {record.riskLevel} risk
          </span>
        </div>
      </div>

      {/* Service type + appointment time */}
      <div className="mt-3 rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2">
        <div className="text-[13px] font-semibold text-[var(--text)]">{record.serviceType}</div>
        <div className="mt-0.5 text-[11px] text-[var(--muted)]">{formatDateTime(record.appointmentDateTime)}</div>
        {record.expectedDurationMinutes && (
          <div className="text-[11px] text-[var(--faint)]">Est. {record.expectedDurationMinutes} min · {record.location.split("—")[1]?.trim() ?? record.location}</div>
        )}
      </div>

      {/* Clinical codes */}
      <div className="mt-3 space-y-1.5">
        <CodeRow label="Diagnosis" value={`${record.icd10Code} — ${record.icd10Description}`} />
        <CodeRow label="CPT family" value={record.cptFamily} />
        {record.drugCode && <CodeRow label="Drug / product" value={record.drugCode} />}
        <CodeRow label="Care need" value={record.careNeed} />
      </div>

      {/* Trigger + channel */}
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-[var(--faint)]">
          Trigger: <span className="text-[var(--muted)]">{record.triggerReason}</span>
        </span>
        <span className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[var(--muted)]">
          {record.communicationPreference}
        </span>
      </div>
    </div>
  );
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="w-20 shrink-0 text-[var(--faint)]">{label}</span>
      <span className="font-mono text-[var(--muted)]">{value}</span>
    </div>
  );
}

function LaneCard({
  title,
  desc,
  count,
  accent,
  highlight,
}: {
  title: string;
  desc: string;
  count: number;
  accent?: boolean;
  highlight?: "accent" | "amber" | "green";
}) {
  const borderColor =
    accent || highlight === "accent"
      ? "border-[var(--accent)]/30"
      : highlight === "amber"
      ? "border-[var(--amber)]/30"
      : highlight === "green"
      ? "border-[var(--green)]/30"
      : "border-[var(--border)]";

  return (
    <div className={`flex items-center justify-between rounded-lg border bg-[var(--panel)] p-3 ${borderColor}`}>
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="mt-0.5 text-[12px] text-[var(--faint)]">{desc}</div>
      </div>
      <span className="tabular rounded bg-[var(--panel-2)] px-2 py-1 text-[18px] font-bold text-[var(--text)]">
        {count}
      </span>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[13px] outline-none focus:border-[var(--accent)]"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? (placeholder ? `All ${placeholder}s` : "All") : o}
        </option>
      ))}
    </select>
  );
}
