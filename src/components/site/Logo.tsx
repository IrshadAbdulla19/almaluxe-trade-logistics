export function Logo({ sub = "Packers and Movers" }: { sub?: string }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-3xl tracking-wide text-foreground">
        ALMALUX<span className="text-primary">E</span>
      </span>
      <span className="mt-0.5 border-t border-foreground/70 pt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
        {sub}
      </span>
    </span>
  );
}
