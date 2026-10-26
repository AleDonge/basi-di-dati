import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { ProgressProvider } from "@/components/progress-provider";
import "katex/dist/katex.min.css";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Database Academy", template: "%s · Database Academy" }, description: "Spazio personale e locale per lo studio di Basi di Dati UNITN 2026/27.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it" className="dark"><body><Shell><ProgressProvider>{children}</ProgressProvider></Shell></body></html>;
}
