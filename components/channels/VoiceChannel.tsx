import { AppointmentRecord } from "@/lib/types";

export function VoiceChannel({
  patient,
  playing,
}: {
  patient: AppointmentRecord;
  playing: boolean;
}) {
  const first = patient.patientName.split(" ")[0];
  const transcript = [
    { who: "Arbiter", line: `Hi, is this ${first}? This is the Arbiter assistant calling on behalf of Pinecrest Care.` },
    { who: first, line: "Yes, speaking." },
    { who: "Arbiter", line: `We're following up on your ${patient.serviceType.toLowerCase()} appointment. Tuesday at 3:00 PM is the first available slot — does that work?` },
    { who: first, line: "That works." },
    { who: "Arbiter", line: "Great, you're rebooked. I've logged it and a confirmation is on its way." },
  ];

  return (
    <div className="flex h-full flex-col items-center bg-gradient-to-b from-[#1a1216] to-[#0c0c10] px-5 pb-5 pt-12">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-2xl font-bold text-white">
          P
        </div>
        <div className="mt-2 text-[15px] font-semibold text-white">
          Pinecrest Care
        </div>
        <div className="text-[11px] text-[var(--green)]">
          {playing ? "● Arbiter calling · 0:38" : "Tap play to simulate call"}
        </div>
      </div>

      <div className="mt-5 flex h-10 items-center justify-center gap-1">
        {[6, 14, 9, 20, 28, 16, 24, 12, 30, 18, 10, 22, 8].map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-[var(--accent)]"
            style={{
              height: `${h}px`,
              opacity: playing ? 1 : 0.3,
              animation: playing
                ? `vpulse 1s ease-in-out ${i * 0.08}s infinite alternate`
                : "none",
            }}
          />
        ))}
      </div>

      <div className="mt-5 w-full flex-1 overflow-y-auto rounded-xl border border-white/10 bg-[#0c0c10]/60 p-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--faint)]">
          Live transcript
        </div>
        <div className="space-y-2">
          {transcript.map((t, i) => (
            <div key={i} className="text-[11.5px] leading-snug">
              <span
                className={`font-semibold ${
                  t.who === "Arbiter" ? "text-[var(--accent)]" : "text-[var(--green)]"
                }`}
              >
                {t.who}:{" "}
              </span>
              <span className="text-[var(--text)]">{t.line}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes vpulse {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
