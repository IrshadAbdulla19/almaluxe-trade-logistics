import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, tel } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="h-1.5 bg-gold" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Household and office relocation from Thrissur, Kerala. We pack with care, we move with trust.
          </p>
          <p className="mt-4 flex gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" />{SITE.address}</p>
        </div>
        <div>
          <h3 className="text-xl text-primary">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/service-areas" className="hover:text-primary">Service Areas</Link></li>
            <li><Link to="/packers-movers" className="hover:text-primary">Moving Services</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/quote" className="hover:text-primary">Request a Quote</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl text-primary">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {SITE.moversPhones.map((p) => (
              <li key={p}><a href={tel(p)} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{p}</a></li>
            ))}
            <li><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
            <li><a href={`mailto:${SITE.moversEmail}`} className="flex items-center gap-2 break-all hover:text-primary"><Mail className="h-4 w-4 shrink-0" />{SITE.moversEmail}</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.moversName}. All rights reserved.
      </p>
    </footer>
  );
}
