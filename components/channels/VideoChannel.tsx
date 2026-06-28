import { AppointmentRecord } from "@/lib/types";

export function VideoChannel({
  patient,
  playing,
}: {
  patient: AppointmentRecord;
  playing: boolean;
}) {
  const first = patient.patientName.split(" ")[0];
  return (
    <div className="flex h-full flex-col bg-[#08080b]">
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-[#1c1318] to-[#0a0a0d]">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#7a1d27] text-3xl">
            🧑‍⚕️
          </div>
          <div className="mt-2 text-[13px] font-semibold text-white">
            Care Assistant
          </div>
          <div className="text-[10px] text-[var(--green)]">
            {playing ? "● Live · captions on" : "Personalized video · tap play"}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 flex h-20 w-14 items-center justify-center rounded-lg border border-white/15 bg-[#0c0c10] text-xl">
          🙂
        </div>

        <div className="absolute bottom-3 left-3 right-20 rounded-lg bg-black/70 px-3 py-2 text-[10.5px] leading-snug text-white backdrop-blur">
          &ldquo;Hi {first}, this is Pinecrest Care. Here&rsquo;s what to expect for your {patient.serviceType.toLowerCase()} visit. Please arrive 15 minutes early and bring your ID and insurance card.&rdquo;
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0c0c10] p-3">
        <div className="rounded-lg border border-white/10 bg-[#131317] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--faint)]">
            Proposed appointment
          </div>
          <div className="mt-1 text-[13px] font-semibold text-white">
            Tuesday · 3:00 PM
          </div>
          <div className="text-[11px] text-[var(--faint)]">
            {patient.serviceType}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="flex-1 rounded-md bg-[var(--accent)] py-1.5 text-[11px] font-semibold text-white">
              Confirm
            </button>
            <button className="flex-1 rounded-md border border-white/15 py-1.5 text-[11px] font-semibold text-[var(--text)]">
              Other times
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
