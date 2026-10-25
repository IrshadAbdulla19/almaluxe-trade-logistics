import { createServerFn } from "@tanstack/react-start";
import { leadSchema } from "./leads.schema";

// Public endpoint: website forms call this. It validates, saves, then runs
// optional integrations. Visitors can never read leads back.
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }; // bot filled the honeypot; pretend success
    const { website: _hp, ...rest } = data;
    const clean = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v]),
    ) as Record<string, string | null>;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("leads")
      .insert({
        ...clean,
        source: data.utm_source ? `website:${data.utm_source}` : "website",
      } as never)
      .select()
      .single();
    if (error || !row) {
      console.error("Lead insert failed", error);
      throw new Error("We could not save your enquiry. Please call or WhatsApp us.");
    }
    const { runLeadIntegrations } = await import("./integrations.server");
    await runLeadIntegrations(row);
    return { ok: true };
  });
