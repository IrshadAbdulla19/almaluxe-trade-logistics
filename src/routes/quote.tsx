import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Quote | Almaluxe" },
      { name: "description", content: "Request a quote for food exports or packers and movers services." },
      { property: "og:title", content: "Request a Quote — Almaluxe" },
      { property: "og:description", content: "Tell us what you need and our team will get back to you." },
    ],
  }),
  component: Quote,
});

function Quote() {
  return (
    <>
      <PageHero eyebrow="Request a quote" title="Tell us what you need">
        Choose export products or packers & movers, share your requirements, and we'll get back to you.
      </PageHero>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <LeadForm form="quote" showCountry />
      </section>
    </>
  );
}
