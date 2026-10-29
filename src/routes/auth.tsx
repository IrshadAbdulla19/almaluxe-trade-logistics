import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/metadata";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [...pageHead("Admin Sign In", "Secure staff sign-in for Almaluxe Packers and Movers.").meta, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

// Admin sign-in. The very first account created becomes the admin
// (database trigger). Accounts created later have no admin access.
function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")), password = String(fd.get("password"));
    setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message); else nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-8">
        <Logo sub="Admin" />
        <h1 className="text-3xl">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /></div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "in" ? "Sign in" : "Create account"}</Button>
        <button type="button" className="w-full text-xs text-muted-foreground hover:text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "First time setup? Create the admin account" : "Back to sign in"}
        </button>
      </form>
    </div>
  );
}
