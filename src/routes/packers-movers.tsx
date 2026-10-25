import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Clock, Home, Users, Package, MapPin, Phone, Mail } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/site/LeadForm";
import { servicesQuery } from "@/lib/catalog.functions";
import { SITE, tel } from "@/lib/site";
import movers from "@/assets/movers.jpg";

export const Route = createFileRoute("/packers-movers")({
  head: () => ({
    meta: [
      { title: "Packers and Movers Thrissur | Almaluxe Packers and Movers" },
      { name: "description", content: "Home shifting, office relocation and door-to-door moving from Thrissur. Serving Bangalore, Mangalore, Chennai and Hyderabad." },
      { property: "og:title", content: "Almaluxe Packers and Movers — Thrissur" },
      { property: "og:description", content: "We pack with care, we move with trust." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Movers,
});

const FEATURES = [
  [ShieldCheck, "Safe handling"], [Clock, "On-time delivery"], [Home, "Door-to-door service"],
  [Users, "Well-experienced workers"], [Package, "All types of covering materials"],
] as const;

function Movers() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  return (
    <>
      <PageHero eyebrow={SITE.moversName} title="Packers & Movers Thrissur" image={movers}>{SITE.moversTagline}.</PageHero>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(([I, t]) => (
            <div key={t} className="rounded-lg border border-border bg-card p-5">
              <I className="h-8 w-8 text-primary" />
              <p className="mt-3 font-display text-2xl">{t}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-16 text-5xl">Our services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-lg border-l-4 border-primary bg-card p-5">
              <h3 className="text-2xl">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          {SITE.moversCities.map((c) => (
            <span key={c} className="flex items-center gap-1 rounded-full border border-primary/50 px-4 py-1.5 text-sm"><MapPin className="h-4 w-4 text-primary" />{c}</span>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 lg:grid-cols-2">
        <div>
          <h2 className="text-5xl">Get a moving quote</h2>
          <p className="mt-2 text-muted-foreground">Tell us where you're moving from and to, and your preferred date.</p>
          <ul className="mt-6 space-y-3">
            {SITE.moversPhones.map((p) => <li key={p}><a href={tel(p)} className="flex items-center gap-2 text-xl hover:text-primary"><Phone className="h-5 w-5 text-primary" />{p}</a></li>)}
            <li><a href={`mailto:${SITE.moversEmail}`} className="flex items-center gap-2 break-all hover:text-primary"><Mail className="h-5 w-5 shrink-0 text-primary" />{SITE.moversEmail}</a></li>
          </ul>
        </div>
        <LeadForm form="movers" businessLine="movers" showCountry interestOptions={services.map((s) => s.name)} />
      </section>
    </>
  );
}
