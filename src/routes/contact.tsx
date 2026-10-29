import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/site/LeadForm";
import { pageHead } from "@/lib/metadata";
import { SITE, tel } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact Us", "Call +91 94478 34071 or +91 99950 55922 for moving enquiries in Thrissur. Contact Almaluxe Packers and Movers."),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="Let's talk" />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Block icon={MapPin} title="Head office">{SITE.address}</Block>
          <Block icon={Phone} title="Moving enquiries">
            {SITE.moversPhones.map((p) => <a key={p} href={tel(p)} className="block hover:text-primary">{p}</a>)}
            <a href={`mailto:${SITE.moversEmail}`} className="block break-all hover:text-primary">{SITE.moversEmail}</a>
          </Block>
          <Block icon={MessageCircle} title="WhatsApp">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-primary">Chat on WhatsApp</a>
          </Block>
          <iframe title="Map" className="h-64 w-full rounded-lg border border-border" loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent("Perumbilavu, Thrissur, Kerala 680519")}&output=embed`} />
        </div>
        <LeadForm form="contact" />
      </section>
    </>
  );
}

function Block({ icon: I, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <I className="mt-1 h-6 w-6 shrink-0 text-primary" />
      <div><h2 className="text-2xl">{title}</h2><div className="text-muted-foreground">{children}</div></div>
    </div>
  );
}
