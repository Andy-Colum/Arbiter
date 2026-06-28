import { Patient, ScenarioId } from "@/lib/types";

interface Bubble {
  from: "them" | "me";
  text: string;
}

const responseByScenario: Record<ScenarioId, Bubble[]> = {
  billing: [
    { from: "me", text: "Will my insurance cover this infusion? I can't afford a big bill again." },
    { from: "them", text: "Good question — I've shared what's typically covered and asked a financial counselor to call you with specifics. Your appointment options are still held." },
  ],
  language: [
    { from: "me", text: "Hola, no entiendo bien. ¿Pueden escribirme en español?" },
    { from: "them", text: "¡Claro! Continuemos en español. El Dr. quiere reprogramar su infusión. ¿Le funciona el martes a las 3 PM?" },
  ],
  clinical: [
    { from: "me", text: "I've had chest tightness and shortness of breath since yesterday." },
    { from: "them", text: "Thanks for telling me — this needs a nurse. I'm connecting you to our care team now and they'll call you shortly. I won't try to advise on this myself." },
  ],
  no_response: [],
};

export function TextChannel({
  patient,
  scenario,
  responded,
}: {
  patient: Patient;
  scenario: ScenarioId;
  responded: boolean;
}) {
  const intro: Bubble[] = [
    { from: "them", text: `Hi ${patient.name.split(" ")[0]}, this is Pinecrest Care. We noticed your ${patient.careNeed.toLowerCase()} appointment was missed.` },
    { from: "them", text: "We'd like to get you rebooked — can I find you a new time?" },
  ];
  const extra = responded ? responseByScenario[scenario] : [];
  const thread = [...intro, ...extra];

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
        {thread.map((m, i) => (
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
        {responded && scenario === "no_response" && (
          <div className="mx-auto mt-2 rounded-full bg-[#23232a] px-3 py-1 text-[11px] text-[var(--faint)]">
            No reply · agent escalating to Voice
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-full bg-[#23232a] px-4 py-2 text-[11px] text-[var(--faint)]">
          Text message…
        </div>
      </div>
    </div>
  );
}
