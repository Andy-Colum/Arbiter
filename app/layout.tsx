import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Arbiter AI — Demo",
  description:
    "Agentic patient outreach for healthcare — principle, architecture, and the patient experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="glow min-h-screen">
          <Nav />
          <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
