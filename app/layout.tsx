import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CohortProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Arbiter — Pinecrest Pilot Control Room",
  description:
    "Closed-loop leakage recovery: Confirm → Capture → Recover. Operator demo with mock data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CohortProvider>
          <div className="min-h-screen">
            <Nav />
            <main className="mx-auto max-w-7xl px-6 pb-24 pt-6">{children}</main>
          </div>
        </CohortProvider>
      </body>
    </html>
  );
}
