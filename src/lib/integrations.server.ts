// Optional integrations. Each one only runs when its credentials are configured,
// and a failure never blocks saving the lead. See README "Integrations".

type Lead = {
  id: string; name: string; email: string | null; phone: string; company: string | null;
  country: string | null; business_line: string; interest: string | null; message: string | null;
  source: string; utm_campaign: string | null; created_at: string;
  pickup_location?: string | null; destination?: string | null; moving_date?: string | null;
  property_type?: string | null; required_services?: string[] | null;
};

const GATEWAY = "https://connector-gateway.lovable.dev";

export async function syncLeadToSheets(lead: Lead): Promise<boolean> {
  const movingSummary = [
    lead.pickup_location && `Pickup: ${lead.pickup_location}`,
    lead.destination && `Destination: ${lead.destination}`,
    lead.moving_date && `Moving date: ${lead.moving_date}`,
    lead.property_type && `Property: ${lead.property_type}`,
    lead.required_services?.length && `Services: ${lead.required_services.join(", ")}`,
    lead.message,
  ].filter(Boolean).join("\n");
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
  const sheetId = process.env["LEADS_SPREADSHEET_ID"];
  if (!lovableKey || !sheetsKey || !sheetId) return false; // not configured yet
  const res = await fetch(
    `${GATEWAY}/google_sheets/v4/spreadsheets/${sheetId}/values/Leads!A:L:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [[lead.created_at, lead.id, lead.name, lead.phone, lead.email ?? "", lead.company ?? "",
          lead.country ?? "", lead.business_line, lead.interest ?? "", movingSummary, lead.source, lead.utm_campaign ?? ""]],
      }),
    },
  );
  if (!res.ok) {
    console.error(`Sheets sync failed [${res.status}]: ${await res.text()}`);
    return false;
  }
  return true;
}

export async function notifyWhatsApp(lead: Lead): Promise<void> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const waKey = process.env["WHATSAPP_API_KEY"];
  const to = process.env["WHATSAPP_NOTIFY_TO"]; // digits only, e.g. 919995055922
  const template = process.env["WHATSAPP_LEAD_TEMPLATE"]; // an APPROVED template name
  if (!lovableKey || !waKey || !to || !template) return;
  const res = await fetch(`${GATEWAY}/whatsapp/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": waKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: "en" },
        components: [{ type: "body", parameters: [
          { type: "text", text: lead.name },
          { type: "text", text: lead.business_line },
          { type: "text", text: lead.phone },
        ] }],
      },
    }),
  });
  if (!res.ok) console.error(`WhatsApp notify failed [${res.status}]: ${await res.text()}`);
}

export async function runLeadIntegrations(lead: Lead) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  try {
    if (await syncLeadToSheets(lead)) {
      await supabaseAdmin.from("leads").update({ sheets_synced_at: new Date().toISOString() }).eq("id", lead.id);
    }
  } catch (e) { console.error("Sheets error", e); }
  try { await notifyWhatsApp(lead); } catch (e) { console.error("WhatsApp error", e); }
}
