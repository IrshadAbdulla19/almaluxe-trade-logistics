import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Package, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import movers from "@/assets/movers.jpg";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/about")({ head: () => pageHead("About Us", "Meet Almaluxe Packers and Movers, your household and office relocation team based in Perumbilavu, Thrissur, Kerala."), component: About });
function About() { return <>
  <PageHero eyebrow="About us" title={SITE.moversName} image={movers}>{SITE.moversTagline}.</PageHero>
  <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2"><div><h2 className="text-4xl text-primary">Moving begins with care</h2><p className="mt-4 text-muted-foreground">Based in Perumbilavu, Thrissur, Kerala, Almaluxe Packers and Movers helps households and offices move with organised packing, safe handling and door-to-door service.</p><p className="mt-4 text-muted-foreground">Our experienced workers use suitable covering materials and help with loading, transport and unloading. Tell us your locations and requirements so we can plan the right moving service for you.</p></div><div><h2 className="text-4xl">Where we're based</h2><p className="mt-4 text-muted-foreground">{SITE.address}</p><p className="mt-4 text-muted-foreground">We serve {SITE.moversCities.join(", ")}.</p><Button asChild className="mt-6"><Link to="/contact">Contact our team</Link></Button></div></section>
  <section className="border-t border-border bg-card"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3">{[[ShieldCheck, "Safe handling"], [Users, "Experienced workers"], [Package, "Suitable covering materials"]].map(([I, t]) => {const Icon=I as typeof Package;return <div key={String(t)}><Icon className="h-8 w-8 text-primary"/><h3 className="mt-3 text-2xl">{String(t)}</h3></div>;})}</div></section>
</>; }
