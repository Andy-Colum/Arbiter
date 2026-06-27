export function VideoChannel() {
  return (
    <div className="flex h-full flex-col bg-[#07101f]">
      {/* main video area */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-[#16233f] to-[#0a1426]">
        {/* avatar / agent */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] text-4xl">
            🧑‍⚕️
          </div>
          <div className="mt-3 text-sm font-semibold text-white">
            Care Assistant
          </div>
          <div className="text-[11px] text-[var(--teal)]">● Live · ASL + captions on</div>
        </div>

        {/* self view */}
        <div className="absolute bottom-3 right-3 h-24 w-16 overflow-hidden rounded-xl border border-white/20 bg-[#0c1322]">
          <div className="flex h-full items-center justify-center text-2xl">
            🙂
          </div>
        </div>

        {/* caption bar */}
        <div className="absolute bottom-3 left-3 right-20 rounded-lg bg-black/60 px-3 py-2 text-[11px] leading-snug text-white backdrop-blur">
          "Dr. Chen wants to see you in two weeks. I've got Thursday the 16th at
          2 PM — shall I book it?"
        </div>
      </div>

      {/* appointment card */}
      <div className="border-t border-white/10 bg-[#0c1322] p-4">
        <div className="rounded-xl border border-white/10 bg-[#101829] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Proposed appointment
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            Thu Jul 16 · 2:00 PM
          </div>
          <div className="text-[12px] text-[var(--muted)]">
            Dr. Chen · Cardiology follow-up
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-lg bg-[var(--accent)] py-2 text-[12px] font-semibold text-white">
              Confirm
            </button>
            <button className="flex-1 rounded-lg border border-white/15 py-2 text-[12px] font-semibold text-[var(--text)]">
              Other times
            </button>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex justify-center gap-5 bg-[#0c1322] pb-5">
        {["🎤", "📷", "💬", "📞"].map((c, i) => (
          <div
            key={i}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-base ${
              i === 3 ? "bg-red-500" : "bg-white/10"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
