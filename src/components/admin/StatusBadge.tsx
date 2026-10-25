export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "new" ? "bg-primary text-primary-foreground" :
    status === "won" ? "bg-success text-background" :
    status === "lost" ? "bg-destructive text-destructive-foreground" :
    "bg-accent text-primary";
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${tone}`}>{status}</span>;
}
