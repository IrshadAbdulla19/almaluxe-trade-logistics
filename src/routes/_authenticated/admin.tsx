import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Users, Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin | Almaluxe" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/admin"><Logo sub="Admin" /></Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/admin" activeOptions={{ exact: true }} className="flex items-center gap-1 rounded px-3 py-2 hover:bg-muted" activeProps={{ className: "text-primary" }}><Users className="h-4 w-4" /> Leads</Link>
            <Link to="/admin/catalog" className="flex items-center gap-1 rounded px-3 py-2 hover:bg-muted" activeProps={{ className: "text-primary" }}><Package className="h-4 w-4" /> Catalog</Link>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></Button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? <Loader2 className="mx-auto animate-spin text-primary" /> :
          isAdmin ? <Outlet /> : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <h1 className="text-3xl">No admin access</h1>
              <p className="mt-2 text-muted-foreground">Signed in as {user.email}, but this account is not an administrator.</p>
            </div>
          )}
      </div>
    </div>
  );
}
