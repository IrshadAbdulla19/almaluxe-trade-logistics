import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";
import { submitLead } from "@/lib/leads.functions";
import { leadSchema, PROPERTY_TYPES, MOVING_SERVICES, type LeadInput } from "@/lib/leads.schema";
import { getUtm } from "@/lib/utm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = { form: LeadInput["form"]; interestOptions?: string[] };
export function LeadForm({ form, interestOptions }: Props) {
  const send = useServerFn(submitLead);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const options = interestOptions?.length ? interestOptions : [...MOVING_SERVICES];
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const services = fd.getAll("required_services").map(String);
    const parsed = leadSchema.safeParse({ ...Object.fromEntries(fd), required_services: services,
      business_line: "movers", interest: services.join(", ").slice(0, 150), form, ...getUtm() });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({}); setServerError(""); setStatus("sending");
    try { await send({ data: parsed.data }); setStatus("done"); }
    catch (err) { setServerError(err instanceof Error ? err.message : "We could not send your enquiry."); setStatus("error"); }
  }
  if (status === "done") return (
    <div role="status" className="border border-primary/40 bg-card p-8 text-center rounded-lg">
      <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
      <h3 className="mt-4 text-3xl">Enquiry received</h3>
      <p className="mt-2 text-muted-foreground">Thank you. Our moving team will contact you about your requirements.</p>
    </div>
  );
  const field = (name: string, label: string, el: React.ReactNode) => (
    <div className="space-y-1.5"><Label htmlFor={name}>{label}</Label>{el}
      {errors[name] && <p id={`${name}-error`} className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );
  const attrs = (name: string) => ({ id: name, name, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Customer name *", <Input {...attrs("name")} autoComplete="name" maxLength={100} required />)}
        {field("phone", "Phone / WhatsApp *", <Input {...attrs("phone")} type="tel" autoComplete="tel" maxLength={20} required />)}
        {field("email", "Email (optional)", <Input {...attrs("email")} type="email" autoComplete="email" maxLength={255} />)}
        {field("property_type", "Property type *", <select {...attrs("property_type")} required defaultValue="" className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"><option value="" disabled>Select property type</option>{PROPERTY_TYPES.map((p) => <option key={p}>{p}</option>)}</select>)}
        {field("pickup_location", "Pickup location *", <Input {...attrs("pickup_location")} placeholder="City / area" maxLength={250} required />)}
        {field("destination", "Destination *", <Input {...attrs("destination")} placeholder="City / area" maxLength={250} required />)}
        {field("moving_date", "Preferred moving date *", <Input {...attrs("moving_date")} type="date" required />)}
      </div>
      <fieldset className="space-y-3"><legend className="text-sm font-medium">Required services *</legend>
        <div className="grid gap-3 sm:grid-cols-2">{options.map((s) => <label key={s} className="flex items-start gap-2 text-sm"><input type="checkbox" name="required_services" value={s} className="mt-1 accent-primary" />{s}</label>)}</div>
        {errors.required_services && <p className="text-sm text-destructive">{errors.required_services}</p>}
      </fieldset>
      {field("message", "Additional details", <Textarea {...attrs("message")} rows={4} maxLength={2000} />)}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && <p role="alert" className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>{status === "sending" ? <><Loader2 className="animate-spin" /> Sending…</> : <>Request a Moving Quote <ArrowUpRight /></>}</Button>
      <p className="text-xs text-muted-foreground">By submitting you agree to our <Link to="/privacy" className="underline hover:text-primary">privacy policy</Link>.</p>
    </form>
  );
}
