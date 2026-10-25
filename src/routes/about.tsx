import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import products from "@/assets/products.jpg";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Almaluxe Export LLP" },
      { name: "description", content: "Almaluxe Export LLP is a Thrissur, Kerala based food exporter that also runs Almaluxe Packers and Movers." },
      { property: "og:title", content: "About Almaluxe Export LLP" },
      { property: "og:description", content: "Food exports from India and relocation services from Thrissur, Kerala." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Two businesses, one standard of care" image={products} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <h2 className="text-4xl text-primary">{SITE.exportName}</h2>
          <p className="mt-4 text-muted-foreground">
            Based in Perumbilavu, Thrissur, Kerala, we supply fresh, organic, frozen and dry food products —
            vegetables, fruits, meat, fish and seafood, spices, pulses, eggs and nuts — carefully sourced and
            exported to buyers worldwide, with a focus on quality, freshness and reliable delivery.
          </p>
          <p className="mt-4 italic text-primary">"{SITE.exportTagline}"</p>
        </div>
        <div>
          <h2 className="text-4xl text-primary">{SITE.moversName}</h2>
          <p className="mt-4 text-muted-foreground">
            Our relocation service offers safe handling, on-time delivery, door-to-door service, experienced
            workers and all types of covering materials. We serve {SITE.moversCities.join(", ")}.
          </p>
          <p className="mt-4 italic text-primary">"{SITE.moversTagline}"</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-lg border border-border bg-card p-8">
          <h3 className="text-3xl">Head office</h3>
          <p className="mt-2 text-muted-foreground">{SITE.address}</p>
          <Button className="mt-6" asChild><Link to="/contact">Contact us</Link></Button>
        </div>
      </section>
    </>
  );
}
