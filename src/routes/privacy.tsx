import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Almaluxe Export LLP" },
      { name: "description", content: "How Almaluxe Export LLP collects and uses information submitted through this website." },
      { property: "og:title", content: "Privacy Policy — Almaluxe" },
      { property: "og:description", content: "How we handle your enquiry data." },
    ],
  }),
  component: Privacy,
});

// NOTE: Template policy. Have it reviewed by a legal professional before publishing.
function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-muted-foreground [&_h2]:text-3xl [&_h2]:text-foreground">
        <p>This policy explains how {SITE.exportName} ("we") handles information you submit through this website.</p>
        <h2>Information we collect</h2>
        <p>When you send an enquiry we collect the details you provide: name, phone number, email, company, country or city, the product or service you are interested in, and your message. We may also record the advertising campaign that brought you to the site (for example, UTM tags) and the date of your enquiry.</p>
        <h2>How we use it</h2>
        <p>We use this information only to respond to your enquiry, prepare quotes, and follow up about our products and services.</p>
        <h2>Sharing</h2>
        <p>We do not sell your information. It may be processed by service providers we use to run our business, such as hosting, spreadsheets and messaging tools.</p>
        <h2>Lead ads</h2>
        <p>If you submit a lead form on Facebook or Instagram, Meta shares the details you entered in that form with us.</p>
        <h2>Your choices</h2>
        <p>You may ask us to access, correct or delete your information by contacting {SITE.exportEmail}.</p>
        <h2>Contact</h2>
        <p>{SITE.exportName}, {SITE.address}.</p>
      </article>
    </>
  );
}
