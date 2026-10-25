import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, Leaf, Snowflake, Package, Truck, ShieldCheck, Clock, Home as HomeIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-export.jpg";
import movers from "@/assets/movers.jpg";
import { CATEGORY_IMAGES, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almaluxe Export LLP | Food Exports & Packers and Movers, Thrissur" },
      { name: "description", content: "Vegetables, fruits, meat, seafood, spices, pulses, eggs and nuts exported from India — plus packers & movers services from Thrissur." },
      { property: "og:title", content: "Almaluxe Export LLP & Packers and Movers" },
      { property: "og:description", content: "Fresh, organic, frozen and dry food exports from India, and trusted relocation services." },
    ],
  }),
  component: Home,
});

const CATS = [
  ["vegetables", "Vegetables"], ["fruits", "Fruits"], ["meat", "Meat"], ["fish-seafood", "Fish & Seafood"],
  ["spices", "Spices"], ["pulses", "Pulses"], ["eggs", "Eggs"], ["nuts", "Nuts"],
] as const;

function Home() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={hero} alt="Container ship at port at sunset" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-20 fade-up">
          <p className="font-semibold italic text-primary">"{SITE.exportTagline}"</p>
          <h1 className="mt-3 max-w-4xl text-6xl leading-[0.9] md:text-8xl">
            Export India <span className="text-primary">to the world</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Fresh, organic, frozen and dry food products, carefully sourced and exported worldwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/products">Explore Products <ArrowRight /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/quote">Request a Quote</Link></Button>
          </div>
        </div>
      </section>

      <div className="bg-gold py-3 text-center font-display text-2xl tracking-widest text-primary-foreground">
        FRESH &nbsp;|&nbsp; ORGANIC &nbsp;|&nbsp; FROZEN &nbsp;|&nbsp; DRY
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our products</p>
            <h2 className="mt-2 text-5xl">Export categories</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-primary hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATS.map(([slug, name]) => (
            <Link key={slug} to="/products/$slug" params={{ slug }} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <img src={CATEGORY_IMAGES[slug]} alt={name} loading="lazy" width={944} height={704} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-fade" />
              <span className="absolute bottom-3 left-4 text-2xl md:text-3xl">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-4">
          {[
            [Leaf, "Carefully sourced", "Products selected for quality and freshness."],
            [Snowflake, "Fresh & frozen", "Multiple product forms for different markets."],
            [Package, "Export packing", "Packing prepared to suit each shipment."],
            [Globe2, "Worldwide", "Enquiries welcome from buyers in any country."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Leaf;
            return (
              <div key={t as string}>
                <I className="h-9 w-9 text-primary" />
                <h3 className="mt-3 text-2xl">{t as string}</h3>
                <p className="text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <img src={movers} alt="Movers loading boxes into a truck" loading="lazy" width={1408} height={912} className="rounded-lg border border-border" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{SITE.moversName}</p>
          <h2 className="mt-2 text-5xl">Packers & Movers <span className="text-primary">Thrissur</span></h2>
          <p className="mt-3 text-muted-foreground">{SITE.moversTagline}.</p>
          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {[[ShieldCheck, "Safe handling"], [Clock, "On-time delivery"], [HomeIcon, "Door-to-door service"], [Users, "Experienced workers"], [Package, "All covering materials"], [Truck, "Five cities served"]].map(([I, t]) => {
              const Icon = I as typeof Truck;
              return <li key={t as string} className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" />{t as string}</li>;
            })}
          </ul>
          <Button size="lg" className="mt-8" asChild><Link to="/packers-movers">Moving services <ArrowRight /></Link></Button>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gold">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
          <h2 className="text-5xl text-primary-foreground">Ready to talk?</h2>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild><Link to="/quote">Request a Quote</Link></Button>
            <Button size="lg" variant="outline" className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
