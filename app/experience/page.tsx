"use client";

import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { TextChannel } from "@/components/channels/TextChannel";
import { EmailChannel } from "@/components/channels/EmailChannel";
import { VoiceChannel } from "@/components/channels/VoiceChannel";
import { VideoChannel } from "@/components/channels/VideoChannel";

const channels = [
  { id: "text", label: "Text", icon: "💬" },
  { id: "email", label: "Email", icon: "✉️" },
  { id: "voice", label: "Voice", icon: "📞" },
  { id: "video", label: "Video", icon: "🎥" },
] as const;

type ChannelId = (typeof channels)[number]["id"];

export default function ExperiencePage() {
  const [active, setActive] = useState<ChannelId>("text");

  return (
    <div>
      <header className="py-8 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
          Step 02
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          What the patient sees
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Same intent, four channels. Switch tabs to see how Arbiter adapts the
          same appointment outreach to each medium.
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1">
          {channels.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active === c.id
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <PhoneFrame>
          {active === "text" && <TextChannel />}
          {active === "email" && <EmailChannel />}
          {active === "voice" && <VoiceChannel />}
          {active === "video" && <VideoChannel />}
        </PhoneFrame>
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-sm text-[var(--muted)]">
        Responses are mock data for the demo. In production these are generated
        live by the channel agent and confirmed back to Epic.
      </p>
    </div>
  );
}
