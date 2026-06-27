export function EmailChannel() {
  return (
    <div className="flex h-full flex-col bg-[#0c1322]">
      <div className="border-b border-white/10 bg-[#121a2e] px-4 py-3 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Inbox
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-[#101829] p-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
              R
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                Riverside Cardiology
              </div>
              <div className="truncate text-[11px] text-[var(--muted)]">
                care@riverside-cardio.org
              </div>
            </div>
          </div>

          <h3 className="mt-3 text-[15px] font-bold leading-snug text-white">
            Time for your follow-up with Dr. Chen
          </h3>

          <div className="mt-3 space-y-3 text-[12.5px] leading-relaxed text-[var(--text)]">
            <p>Hi Maria,</p>
            <p>
              It's been about six months since your last visit. Dr. Chen
              recommends a routine follow-up in the next two weeks. Pick a time
              that works — it takes one tap.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {["Tue Jul 14 · 10:30 AM", "Thu Jul 16 · 2:00 PM", "Fri Jul 17 · 9:15 AM"].map(
              (slot, i) => (
                <div
                  key={slot}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-[12.5px] ${
                    i === 1
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                      : "border-white/10 bg-[#0c1322] text-[var(--text)]"
                  }`}
                >
                  <span>{slot}</span>
                  <span className="text-[var(--accent)]">Select →</span>
                </div>
              )
            )}
          </div>

          <button className="mt-4 w-full rounded-xl bg-[var(--accent)] py-2.5 text-[13px] font-semibold text-white">
            See all available times
          </button>

          <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted)]">
            No fasting required. Reply to this email and our assistant will help
            — or call us at (555) 010-2200.
          </p>
        </div>
      </div>
    </div>
  );
}
