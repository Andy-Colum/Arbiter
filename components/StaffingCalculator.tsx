"use client";

import { useState } from "react";

export function StaffingCalculator({
  defaultPatientsHandled,
}: {
  defaultPatientsHandled: number;
}) {
  const [avgMinutesPerBooking, setAvgMinutes] = useState(10);
  const [hourlyWage, setHourlyWage] = useState(28);
  const [patientsHandled, setPatientsHandled] = useState(defaultPatientsHandled);

  const staffTimeSavedHours = (avgMinutesPerBooking * patientsHandled) / 60;
  const staffCostSaved = staffTimeSavedHours * hourlyWage;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <h2 className="text-[15px] font-semibold">Staffing savings</h2>
      <p className="text-[12px] text-[var(--faint)]">
        Estimated staff time and cost avoided. Adjust the inputs — outputs
        recompute live.
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Inputs */}
        <div className="space-y-4">
          <CalcInput
            label="Avg minutes per booking / rebooking"
            value={avgMinutesPerBooking}
            onChange={setAvgMinutes}
            min={1}
            max={60}
            step={1}
            suffix="min"
          />
          <CalcInput
            label="Avg staff hourly wage"
            value={hourlyWage}
            onChange={setHourlyWage}
            min={10}
            max={100}
            step={1}
            prefix="$"
          />
          <CalcInput
            label="Patients handled by the agent"
            value={patientsHandled}
            onChange={setPatientsHandled}
            min={0}
            max={2000}
            step={1}
            help="Defaults to the funnel's Contacted count — editable."
          />
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <Output
            label="Staff time saved"
            value={`${staffTimeSavedHours.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })} hrs`}
            color="var(--green)"
          />
          <Output
            label="Staff cost saved"
            value={staffCostSaved.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            color="var(--accent)"
          />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[var(--faint)]">
        {avgMinutesPerBooking} min × {patientsHandled.toLocaleString()} patients ={" "}
        {staffTimeSavedHours.toLocaleString("en-US", {
          maximumFractionDigits: 1,
        })}{" "}
        hrs × ${hourlyWage}/hr. Mock figures for demonstration.
      </p>
    </div>
  );
}

function CalcInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  help?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-[12px] text-[var(--muted)]">{label}</label>
        <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[13px]">
          {prefix && <span className="text-[var(--faint)]">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="tabular w-16 bg-transparent text-right outline-none"
          />
          {suffix && (
            <span className="ml-1 text-[var(--faint)]">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
      {help && (
        <div className="mt-0.5 text-[11px] text-[var(--faint)]">{help}</div>
      )}
    </div>
  );
}

function Output({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border bg-[var(--panel-2)] p-3"
      style={{ borderColor: color, borderTopWidth: 2 }}
    >
      <div className="text-[12px] text-[var(--muted)]">{label}</div>
      <div className="tabular mt-1 text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
