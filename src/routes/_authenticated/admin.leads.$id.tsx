import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_STATUSES } from "@/lib/leads.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { pageHead } from "@/lib/metadata";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/leads/$id")({ head: () => pageHead("Enquiry Details", "Secure moving enquiry details, statuses and follow-up notes."), component: LeadDetail });

function LeadDetail() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const lead = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const notes = useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: { status?: string; follow_up_date?: string | null }) => {
      const { error } = await supabase.from("leads").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Lead updated"); qc.invalidateQueries({ queryKey: ["lead", id] }); qc.invalidateQueries({ queryKey: ["leads"] }); },
    onError: (e) => toast.error((e as Error).message),
  });
  const addNote = useMutation({
    mutationFn: async () => {
      const body = note.trim().slice(0, 2000);
      if (!body) return;
      const { error } = await supabase.from("lead_notes").insert({ lead_id: id, body, author_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => { setNote(""); qc.invalidateQueries({ queryKey: ["notes", id] }); },
    onError: (e) => toast.error((e as Error).message),
  });
  const delNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes", id] }),
  });

  if (lead.isLoading) return <Loader2 className="mx-auto animate-spin text-primary" />;
  if (lead.error) return <p className="text-destructive">{(lead.error as Error).message}</p>;
  const l = lead.data;
  if (!l) return <p>Lead not found. <Link to="/admin" className="text-primary">Back</Link></p>;

  const rows: [string, string | null][] = [
    ["Phone", l.phone], ["Email", l.email], ["Pickup location", l.pickup_location ?? l.country], ["Destination", l.destination],
    ["Moving date", l.moving_date], ["Property type", l.property_type],
    ["Required services", l.required_services?.join(", ") ?? l.interest], ["Form", l.form], ["Source", l.source],
    ["UTM source", l.utm_source], ["UTM medium", l.utm_medium], ["UTM campaign", l.utm_campaign],
    ["Received", new Date(l.created_at).toLocaleString()], ["Updated", new Date(l.updated_at).toLocaleString()],
    ["Synced to Sheets", l.sheets_synced_at ? new Date(l.sheets_synced_at).toLocaleString() : "Not synced"],
  ];

  return (
    <div>
      <Link to="/admin" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> All leads</Link>
      <div className="mt-4 flex flex-wrap items-center gap-3"><h1 className="text-5xl">{l.name}</h1><StatusBadge status={l.status} /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <dl className="grid gap-3 sm:grid-cols-2">
              {rows.map(([k, v]) => <div key={k}><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="break-words">{v || "—"}</dd></div>)}
            </dl>
            <div className="mt-4"><p className="text-xs uppercase text-muted-foreground">Message</p><p className="whitespace-pre-line">{l.message || "—"}</p></div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" asChild><a href={`tel:${l.phone}`}>Call</a></Button>
              <Button size="sm" variant="outline" asChild><a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a></Button>
              {l.email && <Button size="sm" variant="outline" asChild><a href={`mailto:${l.email}`}>Email</a></Button>}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-2xl">Status & follow-up</h2>
            <select className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm capitalize" value={l.status}
              onChange={(e) => update.mutate({ status: e.target.value })}>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Input type="date" defaultValue={l.follow_up_date ?? ""} onChange={(e) => update.mutate({ follow_up_date: e.target.value || null })} />
          </div>
          <div className="space-y-3 rounded-lg border border-border bg-card p-5">
            <h2 className="text-2xl">Internal notes</h2>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (only admins can see this)" maxLength={2000} />
            <Button size="sm" disabled={!note.trim() || addNote.isPending} onClick={() => addNote.mutate()}>Add note</Button>
            <ul className="space-y-2">
              {notes.data?.map((n) => (
                <li key={n.id} className="rounded bg-muted p-3 text-sm">
                  <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                    <button aria-label="Delete note" onClick={() => delNote.mutate(n.id)}><Trash2 className="h-3.5 w-3.5 hover:text-destructive" /></button>
                  </div>
                  <p className="mt-1 whitespace-pre-line">{n.body}</p>
                </li>
              ))}
              {notes.data?.length === 0 && <li className="text-sm text-muted-foreground">No notes yet.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
