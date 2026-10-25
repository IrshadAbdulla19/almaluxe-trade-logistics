import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/leads.functions";
import { leadSchema, type LeadInput } from "@/lib/leads.schema";
import { getUtm } from "@/lib/utm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  form: LeadInput["form"];
  businessLine?: LeadInput["business_line"];
  interest?: string;
  interestOptions?: string[];
  showCountry?: boolean;
};

export function LeadForm({ form, businessLine, interest, interestOptions, showCountry }: Props) {
  const send = useServerFn(submitLead);
  const [line, setLine] = useState<LeadInput["business_line"]>(businessLine ?? "export");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = leadSchema.safeParse({ ...fd, business_line: line, form, ...getUtm() });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await send({ data: parsed.data });
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-primary/40 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 text-3xl">Thank you!</h3>
        <p className="mt-2 text-muted-foreground">Your enquiry has been received. Our team will contact you.</p>
      </div>
    );
  }

  const field = (name: string, label: string, el: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {el}
      {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-border bg-card p-6">
      {!businessLine && (
        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
          {(["export", "movers"] as const).map((l) => (
            <button type="button" key={l} onClick={() => setLine(l)}
              className={`rounded px-3 py-2 text-sm font-semibold transition ${line === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {l === "export" ? "Export Products" : "Packers & Movers"}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Full name *", <Input id="name" name="name" maxLength={100} />)}
        {field("phone", "Phone / WhatsApp *", <Input id="phone" name="phone" type="tel" maxLength={20} />)}
        {field("email", "Email", <Input id="email" name="email" type="email" maxLength={255} />)}
        {field("company", "Company", <Input id="company" name="company" maxLength={150} />)}
        {(showCountry || line === "export") && field("country", line === "export" ? "Destination country" : "City", <Input id="country" name="country" maxLength={80} />)}
        {field("interest", line === "export" ? "Product of interest" : "Service needed",
          interestOptions ? (
            <select id="interest" name="interest" defaultValue={interest ?? ""}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
              <option value="" className="bg-card">Select…</option>
              {interestOptions.map((o) => <option key={o} value={o} className="bg-card">{o}</option>)}
            </select>
          ) : <Input id="interest" name="interest" defaultValue={interest} maxLength={150} />)}
      </div>
      {field("message", line === "export" ? "Requirements (quantity, packing, timeline)" : "Moving details (from, to, date)",
        <Textarea id="message" name="message" rows={4} maxLength={2000} />)}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status === "error" && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? <><Loader2 className="animate-spin" /> Sending…</> : "Send Enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">By submitting you agree to our privacy policy.</p>
    </form>
  );
}
