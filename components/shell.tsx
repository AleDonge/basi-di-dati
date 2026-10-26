"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Braces, Database, GraduationCap, LayoutDashboard, Library, ListChecks, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", title: "Learn", icon: BookOpen },
  { href: "/practice", title: "Practice", icon: ListChecks },
  { href: "/sql-lab", title: "SQL Lab", icon: Database },
  { href: "/algebra-lab", title: "Algebra Lab", icon: Braces },
  { href: "/er-lab", title: "ER Lab", icon: Library },
  { href: "/exam-prep", title: "Exam Prep", icon: GraduationCap },
  { href: "/search", title: "Ricerca", icon: BookOpen },
];
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="app-shell">
    <a className="skip-link" href="#main">Vai al contenuto</a>
    <aside className="sidebar" aria-label="Barra laterale">
      <Link className="brand" href="/dashboard"><span className="brand-icon"><GraduationCap size={25} /></span><span>Database<span className="brand-sub">ACADEMY</span></span></Link>
      <div className="course-label">IL TUO SPAZIO DI STUDIO</div>
      <nav aria-label="Navigazione principale">{navigation.map(({ href, title, icon: Icon }) => <Link key={href} href={href} aria-current={(pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined} className={cn("nav-link", (pathname === href || pathname.startsWith(`${href}/`)) && "active")}><Icon size={19} /><span>{title}</span>{(pathname === href || pathname.startsWith(`${href}/`)) && <span className="active-dot" />}</Link>)}<Link href="/settings" className={cn("nav-link mobile-settings", pathname === "/settings" && "active")} aria-current={pathname === "/settings" ? "page" : undefined}><Settings size={19} />Impostazioni</Link></nav>
      <div className="sidebar-bottom">
        <Link className={cn("nav-link", pathname === "/settings" && "active")} href="/settings" aria-current={pathname === "/settings" ? "page" : undefined}><Settings size={19} />Impostazioni</Link>
        <div className="local-card"><ShieldCheck size={19} /><div><strong>Solo sul tuo dispositivo</strong><p>Nessun account. Nessun cloud.</p></div></div>
        <div className="sidebar-foot"><span className="status-dot" /> Ambiente locale <span>v0.7</span></div>
      </div>
    </aside>
    <div className="main-column">
      <header className="topbar"><span><Library size={17} /> UNITN <span className="separator">/</span> Basi di Dati</span><span className="year">A.A. 2026/27 <span className="pill">SPRINT 6</span></span></header>
      <main id="main" tabIndex={-1}>{children}</main>
      <footer className="page-footer">Database Academy <span>Il tuo percorso, un concetto alla volta.</span></footer>
    </div>
  </div>;
}
