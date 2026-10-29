import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Package, Truck, Home as HomeIcon, Building2, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/moving-hero.jpg";
import movers from "@/assets/movers.jpg";
import { SITE, tel } from "@/lib/site";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/")({
  head: () => pageHead("Moving with care, from Thrissur", "Almaluxe Packers and Movers: home shifting, office relocation, packing and loading from Thrissur, Kerala. Request a moving quote."),
  component: Home,
});
const services = [
  [HomeIcon, "Household shifting", "Careful packing and transport for the things that make your house a home."],
  [Building2, "Office relocation", "Furniture, equipment and files, moved with organised handling."],
  [Package, "Packing & covering", "Suitable covering materials to protect your belongings in transit."],
  [Truck, "Loading & unloading", "Experienced workers for careful handling at both ends of your move."],
] as const;
function Home() {
  return <>
    <section className="relative overflow-hidden home-hero">
      <img src={hero} alt="Movers carefully loading a packed box into a moving truck outside a Kerala home" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />
      <div className="absolute inset-0 bg-moving-overlay" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-14 md:px-8 fade-up">
        <p className="text-sm font-semibold uppercase text-primary">Thrissur, Kerala · Household & office relocation</p>
        <h1 className="mt-5 max-w-2xl text-5xl leading-none sm:text-6xl lg:text-7xl">Almaluxe<br /><span className="text-primary">Packers and Movers</span></h1>
        <p className="mt-5 max-w-md text-xl text-foreground">{SITE.moversTagline}.</p>
        <p className="mt-3 max-w-md text-muted-foreground">From careful packing to your next doorstep, a moving team that treats your belongings with care.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild><Link to="/quote">Request a Quote <ArrowUpRight /></Link></Button>
          <Button size="lg" variant="outline" asChild><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp us</a></Button>
        </div>
        <a href={tel(SITE.moversPhones[0])} className="mt-6 flex items-center gap-2 text-sm text-foreground hover:text-primary"><Phone className="h-4 w-4 text-primary" />{SITE.moversPhones[0]}</a>
      </div>
    </section>
    <section className="border-y border-primary/30 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-4 py-5 text-sm font-semibold sm:text-base">
        {[[ShieldCheck, "Safe handling"], [Package, "Careful packing"], [Truck, "Door-to-door moving"]].map(([I, text]) => { const Icon = I as typeof Truck; return <div key={String(text)} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center"><Icon className="h-5 w-5 shrink-0" />{String(text)}</div>; })}
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase text-primary">What we move</p><h2 className="mt-2 text-4xl md:text-5xl">A better way to your next address</h2></div><Link to="/packers-movers" className="flex items-center gap-2 text-sm text-primary">All moving services <ArrowUpRight className="h-4 w-4" /></Link></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(([Icon, name, description]) => <Link to="/packers-movers" key={name} className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"><Icon className="h-8 w-8 text-primary" /><h3 className="mt-6 text-2xl">{name}</h3><p className="mt-2 text-sm text-muted-foreground">{description}</p><ArrowUpRight className="mt-5 h-5 w-5 text-primary" /></Link>)}</div>
    </section>
    <section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
      <img src={movers} alt="Moving team packing and loading belongings" width={1408} height={912} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
      <div><p className="text-sm font-semibold uppercase text-primary">From Thrissur, with care</p><h2 className="mt-3 text-4xl md:text-5xl">Your move. Our responsibility.</h2><p className="mt-4 text-muted-foreground">Household goods, office furniture or a vehicle — our team brings experienced workers and suitable packing materials to each move.</p><div className="mt-6 flex gap-3"><MapPin className="h-6 w-6 shrink-0 text-primary" /><p className="text-sm text-muted-foreground">Serving {SITE.moversCities.join(", ")}.</p></div><Button className="mt-8" variant="outline" asChild><Link to="/service-areas">Our service areas <ArrowUpRight /></Link></Button></div>
    </div></section>
    <section className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-14 md:px-8"><div><p className="text-sm font-semibold uppercase">Planning a move?</p><h2 className="mt-2 text-4xl md:text-5xl">Let's get you moving.</h2></div><Button size="lg" variant="secondary" asChild><Link to="/quote">Request a Moving Quote <ArrowUpRight /></Link></Button></div></section>
  </>;
}
