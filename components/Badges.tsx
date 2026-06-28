import { AppointmentStatus, Channel, Risk } from "@/lib/types";

export function RiskBadge({ risk }: { risk: Risk }) {
  const map: Record<Risk, string> = {
    High: "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-soft)]",
    Medium: "text-[var(--amber)] border-[var(--amber)]/30 bg-[var(--amber)]/10",
    Low: "text-[var(--muted)] border-[var(--border)] bg-[var(--panel-2)]",
  };
  return (
    <span className={`inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium ${map[risk]}`}>
      {risk}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    Upcoming: "text-[var(--blue)] border-[var(--blue)]/30 bg-[var(--blue)]/10",
    Confirmed: "text-[var(--green)] border-[var(--green)]/30 bg-[var(--green)]/10",
    Cancelled: "text-[var(--amber)] border-[var(--amber)]/30 bg-[var(--amber)]/10",
    "No Show": "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent-soft)]",
    "Rebooking Needed": "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent-soft)]",
    Completed: "text-[var(--green)] border-[var(--green)]/30 bg-[var(--green)]/10",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

const channelIcon: Record<Channel, string> = {
  SMS: "💬",
  Email: "✉️",
  Voice: "📞",
  Video: "🎥",
};

export function ChannelBadge({ channel }: { channel: Channel }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-[var(--text)]">
      <span className="text-[11px]">{channelIcon[channel]}</span>
      {channel}
    </span>
  );
}

export function SourceBadge({ source }: { source: "EHR" | "Manual" }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
        source === "EHR"
          ? "bg-[var(--panel-2)] text-[var(--muted)]"
          : "bg-[var(--accent-soft)] text-[var(--accent)]"
      }`}
    >
      {source === "EHR" ? "EHR-synced" : "Manual"}
    </span>
  );
}

export function FutureTag({ children = "Future-state" }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-dashed border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--faint)]">
      {children}
    </span>
  );
}
