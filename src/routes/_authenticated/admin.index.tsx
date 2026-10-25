import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Download, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { fetchLeads, exportLeadsCsv, PAGE_SIZE } from "@/lib/admin";
import { LEAD_STATUSES } from "@/lib/leads.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";

const search = z.object({
  q: z.string().optional().catch(undefined),
  status: z.string().optional().catch(undefined),
  line: z.string().optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  validateSearch: (s) => search.parse(s),
  component: Leads,
});

const sel = "h-9 rounded-md border border-input bg-card px-3 text-sm";

function Leads() {
  const raw = Route.useSearch();
  const f = { q: raw.q ?? "", status: raw.status ?? "", line: raw.line ?? "", page: raw.page ?? 1 };
  const nav = useNavigate({ from: "/admin/" });
  const [q, setQ] = useState(f.q);
  const [exporting, setExporting] = useState(false);
  const { data, isLoading, error } = useQuery({ queryKey: ["leads", f], queryFn: () => fetchLeads(f), placeholderData: keepPreviousData });
  const set = (patch: Partial<typeof f>) => nav({ search: { ...f, page: 1, ...patch } });
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-5xl">Leads</h1><p className="text-sm text-muted-foreground">{data?.total ?? 0} total</p></div>
        <Button variant="outline" disabled={exporting} onClick={async () => {
          setExporting(true);
          try { await exportLeadsCsv(f); } catch { toast.error("Export failed"); }
          setExporting(false);
        }}>{exporting ? <Loader2 className="animate-spin" /> : <Download />} Export CSV</Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); set({ q }); }} className="flex min-w-60 flex-1 gap-2">
          <Input placeholder="Search name, phone, email, company…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="submit" size="icon" aria-label="Search"><Search /></Button>
        </form>
        <select className={sel} value={f.status} onChange={(e) => set({ status: e.target.value })}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className={sel} value={f.line} onChange={(e) => set({ line: e.target.value })}>
          <option value="">All businesses</option>
          <option value="export">Export</option>
          <option value="movers">Packers & Movers</option>
        </select>
      </div>
      {error && <p className="mt-6 text-destructive">Could not load leads: {(error as Error).message}</p>}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted-foreground">
            <tr>{["Date", "Name", "Phone", "Business", "Interest", "Source", "Status", "Follow-up"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="py-10 text-center"><Loader2 className="mx-auto animate-spin text-primary" /></td></tr>}
            {data?.rows.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No leads found.</td></tr>}
            {data?.rows.map((l) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/50">
                <td className="whitespace-nowrap px-3 py-2">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2"><Link to="/admin/leads/$id" params={{ id: l.id }} className="font-medium text-primary hover:underline">{l.name}</Link></td>
                <td className="whitespace-nowrap px-3 py-2">{l.phone}</td>
                <td className="px-3 py-2 capitalize">{l.business_line}</td>
                <td className="px-3 py-2">{l.interest}</td>
                <td className="px-3 py-2">{l.utm_campaign ? `${l.source} / ${l.utm_campaign}` : l.source}</td>
                <td className="px-3 py-2"><StatusBadge status={l.status} /></td>
                <td className="whitespace-nowrap px-3 py-2">{l.follow_up_date ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <Button variant="outline" size="sm" disabled={f.page <= 1} onClick={() => nav({ search: { ...f, page: f.page - 1 } })}>Previous</Button>
        <span>Page {f.page} of {pages}</span>
        <Button variant="outline" size="sm" disabled={f.page >= pages} onClick={() => nav({ search: { ...f, page: f.page + 1 } })}>Next</Button>
      </div>
    </div>
  );
}
