"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Trigger Intake", step: "1" },
  { href: "/workflow", label: "Agent Workflow", step: "2" },
  { href: "/backend", label: "Escalation / Backend", step: "3" },
  { href: "/dashboard", label: "Dashboard", step: "4" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-sm font-bold text-white">
            A
          </span>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight">
              Arbiter
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--faint)]">
              Pinecrest Pilot
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-[var(--panel-2)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold ${
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {link.step}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
