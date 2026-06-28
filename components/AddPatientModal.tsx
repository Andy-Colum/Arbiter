"use client";

import { useState } from "react";
import { useCohort } from "@/lib/store";
import { CareNeed, Channel, Patient, Risk, TriggerType } from "@/lib/types";

const CARE_NEEDS: CareNeed[] = [
  "Infusion therapy",
  "Oncology follow-up",
  "Cardiology follow-up",
  "Post-discharge check-in",
  "Imaging / diagnostic",
  "Lab work",
];
const TRIGGERS: TriggerType[] = [
  "Missed appointment",
  "Same-day cancellation",
  "No-show risk",
  "Referral pending",
  "Recall / overdue",
];
const CHANNELS: Channel[] = ["SMS", "Email", "Voice", "Video"];
const RISKS: Risk[] = ["High", "Medium", "Low"];

export function AddPatientModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addPatient } = useCohort();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [careNeed, setCareNeed] = useState<CareNeed>("Infusion therapy");
  const [triggerType, setTriggerType] = useState<TriggerType>(
    "Missed appointment"
  );
  const [channel, setChannel] = useState<Channel>("SMS");
  const [risk, setRisk] = useState<Risk>("Medium");
  const [language, setLanguage] = useState("English");

  if (!open) return null;

  function submit() {
    if (!name.trim()) return;
    const p: Patient = {
      id: `PT-${Math.floor(3000 + Math.random() * 6999)}`,
      name: name.trim(),
      age: Number(age) || 50,
      careNeed,
      risk,
      channel,
      language,
      consent: { sms: true, email: true, voice: true, video: false },
      lastContacted: "Never",
      status: "New",
      triggerType,
      source: "Manual",
    };
    addPatient(p);
    reset();
    onClose();
  }

  function reset() {
    setName("");
    setAge("");
    setCareNeed("Infusion therapy");
    setTriggerType("Missed appointment");
    setChannel("SMS");
    setRisk("Medium");
    setLanguage("English");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">Add patient (manual lane)</h3>
          <button
            onClick={onClose}
            className="text-[var(--faint)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Name" full>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
              placeholder="Patient name"
            />
          </Field>
          <Field label="Age">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="modal-input"
              placeholder="50"
              inputMode="numeric"
            />
          </Field>
          <Field label="Language">
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="modal-input"
            />
          </Field>
          <Field label="Care need" full>
            <ModalSelect value={careNeed} onChange={(v) => setCareNeed(v as CareNeed)} options={CARE_NEEDS} />
          </Field>
          <Field label="Trigger type" full>
            <ModalSelect value={triggerType} onChange={(v) => setTriggerType(v as TriggerType)} options={TRIGGERS} />
          </Field>
          <Field label="Channel">
            <ModalSelect value={channel} onChange={(v) => setChannel(v as Channel)} options={CHANNELS} />
          </Field>
          <Field label="Risk">
            <ModalSelect value={risk} onChange={(v) => setRisk(v as Risk)} options={RISKS} />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            Add to cohort
          </button>
        </div>
      </div>

      <style>{`
        .modal-input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 0.4rem 0.55rem;
          font-size: 13px;
          outline: none;
        }
        .modal-input:focus { border-color: var(--accent); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-[var(--faint)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ModalSelect({
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
      className="modal-input"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
