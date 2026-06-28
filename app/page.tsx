"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCohort } from "@/lib/store";
import {
  AppointmentRecord,
  AppointmentStatus,
  Channel,
  Risk,
  ServiceType,
} from "@/lib/types";
import { AddPatientModal } from "@/components/AddPatientModal";

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
  Upcoming: "text-[var(--blue)] border-[var(--blue)]/30 bg-[var(--blue)]/10",
  Confirmed: "text-[var(--green)] border-[var(--green)]/30 bg-[var(--green)]/10",
  Cancelled: "text-[var(--amber)] border-[var(--amber)]/30 bg-[var(--amber)]/10",
  "No Show": "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-soft)]",
  "Rebooking Needed":
    "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-soft)]",
  Completed: "text-[var(--green)] border-[var(--green)]/30 bg-[var(--green)]/10",
};

const RISK_COLORS: Record<Risk, string> = {
  High: "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-soft)]",
  Medium: "text-[var(--amber)] border-[var(--amber)]/30 bg-[var(--amber)]/10",
  Low: "text-[var(--muted)] border-[var(--border)] bg-[var(--panel-2)]",
};

const CHANNEL_ICON: Record<Channel, string> = {
  SMS: "💬",
  Email: "✉️",
  Voice: "📞",
  Video: "🎥",
};

export default function TriggerIntakePage() {
  const router = useRouter();
  const {
    appointments,
    selectedIds,
    toggleSelect,
    selectAllEligible,
    clearSelection,
    dispatch,
  } = useCohort();

  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "All">("All");
  const [riskFilter, setRiskFilter] = useState<Risk | "All">("All");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">(
    "All"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (query && !a.patientName.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (serviceFilter !== "All" && a.serviceType !== serviceFilter)
        return false;
      if (riskFilter !== "All" && a.riskLevel !== riskFilter) return false;
      if (statusFilter !== "All" && a.appointmentStatus !== statusFilter)
        return false;
      return true;
    });
  }, [appointments, query, serviceFilter, riskFilter, statusFilter]);

  const eligibleCount = appointments.filter(
    (a) => a.appointmentStatus !== "Confirmed"
  ).length;

  function handleDispatch() {
    if (selectedIds.length === 0) return;
    dispatch();
    router.push("/workflow");
  }

  return (
    <div>
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-widest text-[var(--accent)]">
          Step 01 — Setup
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Trigger Intake</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[var(--muted)]">
          Review patients with a pending care need, curate who is eligible, and
          dispatch the cohort to the agent. This is the human gate that keeps the
          AI bounded.
        </p>
      </header>

      {/* Intake lanes */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <LaneCard
          title="EHR-synced intake"
          desc="Pulled automatically from the scheduling feed."
          count={appointments.filter((a) => a.source === "EHR").length}
          accent
        />
        <LaneCard
          title="Manually-added"
          desc="Staff-curated additions for this cohort."
          count={appointments.filter((a) => a.source === "Manual").length}
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
          value={serviceFilter}
          onChange={(v) => setServiceFilter(v as ServiceType | "All")}
          options={SERVICE_TYPES}
        />
        <Select
          value={riskFilter}
          onChange={(v) => setRiskFilter(v as Risk | "All")}
          options={["All", "High", "Medium", "Low"]}
        />
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as AppointmentStatus | "All")}
          options={["All", "Upcoming", "No Show", "Rebooking Needed", "Confirmed"]}
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
              <Th className="min-w-[240px]">Care need</Th>
              <Th>Risk</Th>
              <Th>Channel</Th>
              <Th>Trigger</Th>
              <Th>Last contacted</Th>
              <Th>Status</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {filtered.map((a) => {
              const locked = a.appointmentStatus === "Confirmed";
              const checked = selectedIds.includes(a.appointmentId);
              return (
                <tr
                  key={a.appointmentId}
                  onClick={() => !locked && toggleSelect(a.appointmentId)}
                  className={`align-top text-[13px] transition-colors ${
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
                      {a.patientName}
                    </div>
                    <div className="text-[11px] text-[var(--faint)]">
                      {a.patientId} · {a.preferredLanguage}
                    </div>
                  </Td>
                  <Td className="tabular text-[var(--muted)]">{a.age}</Td>
                  <Td>
                    <CareNeedCell record={a} />
                  </Td>
                  <Td>
                    <Badge className={RISK_COLORS[a.riskLevel]}>
                      {a.riskLevel}
                    </Badge>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[var(--text)]">
                      <span className="text-[11px]">
                        {CHANNEL_ICON[a.communicationPreference]}
                      </span>
                      {a.communicationPreference}
                    </span>
                  </Td>
                  <Td className="text-[var(--muted)]">{a.triggerReason}</Td>
                  <Td className="text-[var(--muted)]">{a.lastContacted}</Td>
                  <Td>
                    <Badge
                      className={
                        STATUS_COLORS[a.appointmentStatus] ??
                        "border-[var(--border)] text-[var(--muted)]"
                      }
                    >
                      {a.appointmentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <span
                      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        a.source === "EHR"
                          ? "bg-[var(--panel-2)] text-[var(--muted)]"
                          : "bg-[var(--accent-soft)] text-[var(--accent)]"
                      }`}
                    >
                      {a.source === "EHR" ? "EHR-synced" : "Manual"}
                    </span>
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
          selected · Confirmed rows are locked (human gate)
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

function CareNeedCell({ record }: { record: AppointmentRecord }) {
  return (
    <div className="leading-tight">
      {/* Service type — bright */}
      <div className="font-semibold text-[var(--text)]">
        {record.serviceType}
      </div>
      {/* ICD-10 diagnosis (diagnosis code) */}
      <div className="mt-0.5 text-[11px] text-[var(--muted)]">
        <span className="font-mono">{record.icd10Code}</span> ·{" "}
        {record.icd10Description}
      </div>
      {/* CPT (procedure) + HCPCS / J-code (drug / product) */}
      <div className="text-[11px] text-[var(--faint)]">
        <span className="font-mono">CPT {record.cptFamily}</span>
        {record.drugCode && (
          <>
            {" · "}
            <span className="font-mono">HCPCS {record.drugCode}</span>
          </>
        )}
      </div>
    </div>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
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
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[13px] outline-none focus:border-[var(--accent)]"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
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
  return <td className={`px-3 py-2.5 ${className}`}>{children}</td>;
}
