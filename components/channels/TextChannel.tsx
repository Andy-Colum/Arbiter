const thread = [
  { from: "them", text: "Hi Maria, this is Riverside Cardiology. Dr. Chen would like to see you for a follow-up in the next two weeks. 💙" },
  { from: "them", text: "Want me to find a time? Reply YES and I'll send options." },
  { from: "me", text: "Yes please" },
  { from: "them", text: "Great! I have:\n• Tue Jul 14, 10:30 AM\n• Thu Jul 16, 2:00 PM\n• Fri Jul 17, 9:15 AM" },
  { from: "me", text: "Thursday works" },
  { from: "them", text: "Booked ✅ Thu Jul 16, 2:00 PM with Dr. Chen. I've added it to your chart and you'll get a reminder the day before. Anything else?" },
  { from: "me", text: "Do I need to fast?" },
  { from: "them", text: "No fasting needed for this visit. Just bring your current medications list. See you then! 👋" },
];

export function TextChannel() {
  return (
    <div className="flex h-full flex-col bg-[#0c1322]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#121a2e] px-4 py-3 pt-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
          R
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Riverside Cardiology</div>
          <div className="text-[11px] text-[var(--teal)]">● Arbiter assistant</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {thread.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
              m.from === "me"
                ? "self-end rounded-br-md bg-[var(--accent)] text-white"
                : "self-start rounded-bl-md bg-[#1c2540] text-[var(--text)]"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-full bg-[#1c2540] px-4 py-2 text-xs text-[var(--muted)]">
          Text message…
        </div>
      </div>
    </div>
  );
}
