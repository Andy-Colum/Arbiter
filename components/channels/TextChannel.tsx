import { AppointmentRecord } from "@/lib/types";

export function TextChannel({ patient }: { patient: AppointmentRecord }) {
  const firstName = patient.patientName.split(" ")[0];
  const messages: { from: "them" | "me"; text: string }[] = [
    {
      from: "them",
      text: `Hi ${firstName}, this is Pinecrest Care. We're confirming your upcoming ${patient.serviceType.toLowerCase()} appointment. Tuesday at 3:00 PM is the first available slot. Would that work for you? Reply YES to confirm, NO for other times, or QUESTION if you need help.`,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#0c0c10]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#161619] px-4 py-3 pt-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
          P
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white">Pinecrest Care</div>
          <div className="text-[10px] text-[var(--green)]">● Arbiter assistant</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${
              m.from === "me"
                ? "self-end rounded-br-md bg-[var(--accent)] text-white"
                : "self-start rounded-bl-md bg-[#23232a] text-[var(--text)]"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-full bg-[#23232a] px-4 py-2 text-[11px] text-[var(--faint)]">
          Text message…
        </div>
      </div>
    </div>
  );
}
