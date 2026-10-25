import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Admin data access. Runs in the browser as the signed-in user; the database's
// row-level security only lets admins read or change leads.
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export const PAGE_SIZE = 20;

export type LeadFilters = { q: string; status: string; line: string; page: number };

export async function fetchLeads(f: LeadFilters) {
  let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (f.status) query = query.eq("status", f.status);
  if (f.line) query = query.eq("business_line", f.line);
  if (f.q) {
    const q = f.q.replace(/[%,()]/g, " ").trim();
    if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,company.ilike.%${q}%,interest.ilike.%${q}%`);
  }
  const from = (f.page - 1) * PAGE_SIZE;
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}

const COLS: (keyof Lead)[] = ["created_at", "name", "phone", "email", "company", "country", "business_line", "interest",
  "message", "status", "follow_up_date", "source", "form", "utm_source", "utm_medium", "utm_campaign"];

export async function exportLeadsCsv(f: LeadFilters) {
  const all: Lead[] = [];
  for (let page = 1; ; page++) {
    const { rows, total } = await fetchLeads({ ...f, page });
    all.push(...rows);
    if (all.length >= total || rows.length === 0) break;
  }
  const esc = (v: unknown) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [COLS.join(","), ...all.map((r) => COLS.map((c) => esc(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = `almaluxe-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}
