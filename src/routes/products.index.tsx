import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { productsQuery } from "@/lib/catalog.functions";
import { CATEGORY_IMAGES } from "@/lib/site";
import products from "@/assets/products.jpg";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Export Products | Almaluxe Export LLP" },
      { name: "description", content: "Vegetables, fruits, meat, fish & seafood, spices, pulses, eggs and nuts exported from India." },
      { property: "og:title", content: "Export Products — Almaluxe Export LLP" },
      { property: "og:description", content: "Fresh, organic, frozen and dry food products from India." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Products,
});

const FORMS = ["all", "fresh", "organic", "frozen", "dry"];

function Products() {
  const { data } = useSuspenseQuery(productsQuery);
  const [form, setForm] = useState("all");
  const list = data.filter((p) => form === "all" || p.forms.includes(form));
  return (
    <>
      <PageHero eyebrow="Export products" title="Quality food products from India" image={products}>
        Select a category to learn more and send an enquiry.
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap gap-2">
          {FORMS.map((f) => (
            <button key={f} onClick={() => setForm(f)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${form === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>
              {f}
            </button>
          ))}
        </div>
        {list.length === 0 && <p className="mt-10 text-muted-foreground">No products in this filter.</p>}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image_url || CATEGORY_IMAGES[p.category] || products} alt={p.name} loading="lazy" width={944} height={704}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h2 className="text-3xl">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.short_description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.forms.map((f) => <span key={f} className="rounded bg-accent px-2 py-0.5 text-xs capitalize text-primary">{f}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
