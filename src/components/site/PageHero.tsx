import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children, image }: { eyebrow: string; title: string; children?: ReactNode; image?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-fade" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-5xl md:text-7xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}
