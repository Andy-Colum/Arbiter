const transcript = [
  { who: "Arbiter", line: "Hi, is this Maria? This is the assistant calling on behalf of Riverside Cardiology." },
  { who: "Maria", line: "Yes, this is she." },
  { who: "Arbiter", line: "Dr. Chen would like to see you for a follow-up. I can book it now — would Thursday the 16th at 2 PM work?" },
  { who: "Maria", line: "That works for me." },
  { who: "Arbiter", line: "Perfect, you're booked. I've sent a text confirmation and updated your chart. Take care, Maria." },
];

export function VoiceChannel() {
  return (
    <div className="flex h-full flex-col items-center bg-gradient-to-b from-[#101a33] to-[#0c1322] px-5 pb-5 pt-12">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-3xl font-bold text-white shadow-lg shadow-[var(--accent)]/30">
          R
        </div>
        <div className="mt-3 text-lg font-semibold text-white">
          Riverside Cardiology
        </div>
        <div className="text-xs text-[var(--teal)]">● Arbiter calling · 0:42</div>
      </div>

      {/* waveform */}
      <div className="mt-6 flex h-12 items-center justify-center gap-1">
        {[6, 14, 9, 20, 28, 16, 24, 12, 30, 18, 10, 22, 8].map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-[var(--accent)]"
            style={{
              height: `${h}px`,
              animation: `pulse 1s ease-in-out ${i * 0.08}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="mt-6 w-full flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0c1322]/60 p-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Live transcript
        </div>
        <div className="space-y-2.5">
          {transcript.map((t, i) => (
            <div key={i} className="text-[12px] leading-snug">
              <span
                className={`font-semibold ${
                  t.who === "Arbiter" ? "text-[var(--accent)]" : "text-[var(--teal)]"
                }`}
              >
                {t.who}:{" "}
              </span>
              <span className="text-[var(--text)]">{t.line}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg">
          🔇
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-lg">
          📵
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg">
          🔊
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
