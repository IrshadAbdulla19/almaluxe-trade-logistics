import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { productQuery } from "@/lib/catalog.functions";
import { CATEGORY_IMAGES } from "@/lib/site";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    return { name: p.name, desc: p.short_description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} Export | Almaluxe Export LLP` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.name} — Almaluxe Export LLP` },
          { property: "og:description", content: loaderData.desc },
        ]
      : [{ title: "Product unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  if (!p) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <Link to="/products" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> All products</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <img src={p.image_url || CATEGORY_IMAGES[p.category]} alt={p.name} width={944} height={704} className="w-full rounded-lg border border-border object-cover" />
          <h1 className="mt-8 text-6xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.forms.map((f) => <span key={f} className="rounded bg-accent px-3 py-1 text-sm capitalize text-primary">{f}</span>)}
          </div>
          <p className="mt-6 whitespace-pre-line text-lg text-muted-foreground">{p.description}</p>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 text-4xl">Enquire about <span className="text-primary">{p.name}</span></h2>
          <LeadForm form="product" businessLine="export" interest={p.name} showCountry />
        </div>
      </div>
    </section>
  );
}
