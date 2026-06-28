"use client";

import { useState } from "react";
import { useCohort } from "@/lib/store";
import { AppointmentRecord, Channel, Risk, ServiceType } from "@/lib/types";

const SERVICE_TYPES: ServiceType[] = [
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

const CHANNELS: Channel[] = ["SMS", "Email", "Voice", "Video"];
const RISKS: Risk[] = ["High", "Medium", "Low"];

export function AddPatientModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addAppointment } = useCohort();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("IV Hydration");
  const [icd10, setIcd10] = useState("");
  const [icd10Desc, setIcd10Desc] = useState("");
  const [cptFamily, setCptFamily] = useState("");
  const [channel, setChannel] = useState<Channel>("SMS");
  const [risk, setRisk] = useState<Risk>("Medium");
  const [language, setLanguage] = useState("English");
  const [triggerReason, setTriggerReason] = useState("No confirmation received");

  if (!open) return null;

  function submit() {
    if (!name.trim()) return;
    const appt: AppointmentRecord = {
      patientId: `PT-${Math.floor(3000 + Math.random() * 6999)}`,
      patientName: name.trim(),
      appointmentId: `APT-${Math.floor(8000 + Math.random() * 1999)}`,
      appointmentDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Pinecrest Infusion Center",
      serviceType,
      careNeed: serviceType,
      icd10Code: icd10 || "—",
      icd10Description: icd10Desc || "Not specified",
      cptFamily: cptFamily || "—",
      expectedDurationMinutes: 60,
      appointmentStatus: "Upcoming",
      triggerReason,
      riskLevel: risk,
      communicationPreference: channel,
      preferredLanguage: language,
      consentSms: true,
      consentVoice: true,
      consentEmail: true,
      consentVideo: false,
      source: "Manual",
      lastContacted: "Never",
      age: Number(age) || 50,
    };
    addAppointment(appt);
    reset();
    onClose();
  }

  function reset() {
    setName("");
    setAge("");
    setServiceType("IV Hydration");
    setIcd10("");
    setIcd10Desc("");
    setCptFamily("");
    setChannel("SMS");
    setRisk("Medium");
    setLanguage("English");
    setTriggerReason("No confirmation received");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">Add appointment (manual)</h3>
          <button onClick={onClose} className="text-[var(--faint)] hover:text-[var(--text)]">
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Patient name" full>
            <input value={name} onChange={(e) => setName(e.target.value)} className="modal-input" placeholder="Full name" />
          </Field>
          <Field label="Age">
            <input value={age} onChange={(e) => setAge(e.target.value)} className="modal-input" placeholder="50" inputMode="numeric" />
          </Field>
          <Field label="Language">
            <input value={language} onChange={(e) => setLanguage(e.target.value)} className="modal-input" />
          </Field>
          <Field label="Service type" full>
            <ModalSelect value={serviceType} onChange={(v) => setServiceType(v as ServiceType)} options={SERVICE_TYPES} />
          </Field>
          <Field label="ICD-10 code">
            <input value={icd10} onChange={(e) => setIcd10(e.target.value)} className="modal-input" placeholder="e.g. E86.0" />
          </Field>
          <Field label="ICD-10 description">
            <input value={icd10Desc} onChange={(e) => setIcd10Desc(e.target.value)} className="modal-input" placeholder="Dehydration" />
          </Field>
          <Field label="CPT family">
            <input value={cptFamily} onChange={(e) => setCptFamily(e.target.value)} className="modal-input" placeholder="e.g. 96360" />
          </Field>
          <Field label="Trigger reason" full>
            <input value={triggerReason} onChange={(e) => setTriggerReason(e.target.value)} className="modal-input" />
          </Field>
          <Field label="Channel">
            <ModalSelect value={channel} onChange={(v) => setChannel(v as Channel)} options={CHANNELS} />
          </Field>
          <Field label="Risk">
            <ModalSelect value={risk} onChange={(v) => setRisk(v as Risk)} options={RISKS} />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)]">
            Cancel
          </button>
          <button onClick={submit} className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)]">
            Add to intake
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

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-[var(--faint)]">{label}</span>
      {children}
    </label>
  );
}

function ModalSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="modal-input">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
