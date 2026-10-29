import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/metadata";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/quote")({
  head: () => pageHead("Request a Quote", "Request a moving quotation from Almaluxe Packers and Movers. Share your pickup, destination, moving date and packing requirements."),
  component: Quote,
});

function Quote() {
  return (
    <>
      <PageHero eyebrow="Request a quote" title="Tell us what you need">
        Share your locations, moving date and requirements with our moving team.
      </PageHero>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <LeadForm form="quote" />
      </section>
    </>
  );
}
