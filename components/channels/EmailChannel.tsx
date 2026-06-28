import { AppointmentRecord } from "@/lib/types";

export function EmailChannel({ patient }: { patient: AppointmentRecord }) {
  const first = patient.patientName.split(" ")[0];
  return (
    <div className="flex h-full flex-col bg-[#0c0c10]">
      <div className="border-b border-white/10 bg-[#161619] px-4 py-3 pt-8">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--faint)]">
          Inbox
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="rounded-xl border border-white/10 bg-[#131317] p-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
              P
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-white">
                Pinecrest Care
              </div>
              <div className="truncate text-[10px] text-[var(--faint)]">
                care@pinecrest-health.org
              </div>
            </div>
          </div>

          <h3 className="mt-3 text-[14px] font-bold leading-snug text-white">
            Your {patient.serviceType} appointment — action needed
          </h3>

          <div className="mt-2 space-y-2 text-[12px] leading-relaxed text-[var(--text)]">
            <p>Hi {first},</p>
            <p>
              We noticed your recent appointment was missed. Your care team
              recommends rebooking soon — pick a time that works in one tap.
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {["Tue · 3:00 PM", "Wed · 10:30 AM", "Fri · 9:15 AM"].map((slot, i) => (
              <div
                key={slot}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[12px] ${
                  i === 0
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                    : "border-white/10 bg-[#0c0c10] text-[var(--text)]"
                }`}
              >
                <span>{slot}</span>
                <span className="text-[var(--accent)]">Select →</span>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full rounded-lg bg-[var(--accent)] py-2 text-[12px] font-semibold text-white">
            See all available times
          </button>

          <p className="mt-3 text-[10px] leading-relaxed text-[var(--faint)]">
            Questions? Reply and our assistant will help, or call (555) 010-2200.
          </p>
        </div>
      </div>
    </div>
  );
}
