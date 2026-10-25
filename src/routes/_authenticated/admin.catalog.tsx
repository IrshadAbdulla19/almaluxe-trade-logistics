import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/catalog")({ component: Catalog });

type Table = "products" | "services";

function Catalog() {
  const [tab, setTab] = useState<Table>("products");
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["admin-catalog", tab],
    queryFn: async () => {
      const { data, error } = await supabase.from(tab).select("*").order("sort_order");
      if (error) throw error;
      return data as { id: string; name: string; description: string; is_active: boolean }[];
    },
  });
  const save = useMutation({
    mutationFn: async (row: { id: string; name: string; description: string; is_active: boolean }) => {
      const { error } = await supabase.from(tab).update({ name: row.name.slice(0, 100), description: row.description.slice(0, 4000), is_active: row.is_active }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries(); },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <h1 className="text-5xl">Catalog</h1>
      <div className="mt-4 flex gap-2">
        {(["products", "services"] as const).map((t) => (
          <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)} className="capitalize">{t}</Button>
        ))}
      </div>
      {list.isLoading && <Loader2 className="mt-6 animate-spin text-primary" />}
      <div className="mt-6 space-y-4">
        {list.data?.map((r) => (
          <form key={r.id} className="space-y-2 rounded-lg border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              save.mutate({ id: r.id, name: String(fd.get("name")), description: String(fd.get("description")), is_active: fd.get("active") === "on" });
            }}>
            <Input name="name" defaultValue={r.name} required />
            <Textarea name="description" defaultValue={r.description} rows={3} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={r.is_active} /> Visible on website</label>
              <Button size="sm" disabled={save.isPending}>Save</Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
