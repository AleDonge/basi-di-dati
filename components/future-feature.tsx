import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export function FutureFeature({ label, title, sprint, children }: { label: string; title: string; sprint: string; children: React.ReactNode }) {
  return <><p className="eyebrow">{label}</p><h1>{title}</h1><div className="feature-empty"><span className="feature-icon"><Construction size={30} /></span><span className="pill">{sprint}</span><h2>Questo spazio è in preparazione.</h2><div className="feature-description">{children}</div><Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>Torna alla dashboard <ArrowRight size={16} /></Link></div></>;
}
