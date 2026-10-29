import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { SITE, tel } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/packers-movers", label: "Moving Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" onClick={() => setOpen(false)}><Logo /></Link>
        <nav className="hidden items-center gap-4 xl:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <a href={tel(SITE.moversPhones[0])} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <Phone className="h-4 w-4" /> {SITE.moversPhones[0]}
          </a>
          <Button asChild><Link to="/quote">Request a Quote</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-4 xl:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-foreground"
              activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          <Button asChild className="mt-2"><Link to="/quote" onClick={() => setOpen(false)}>Request a Quote</Link></Button>
        </nav>
      )}
    </header>
  );
}
