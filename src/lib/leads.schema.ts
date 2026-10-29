import { z } from "zod";

export const PROPERTY_TYPES = ["Apartment", "House", "Office", "Other"] as const;
export const MOVING_SERVICES = ["Home Shifting", "Office Relocation", "Packing & Covering Materials", "Loading & Unloading", "Vehicle Transport"] as const;
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
// Shared by browser and server; new enquiries are moving enquiries only.
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  business_line: z.literal("movers").default("movers"),
  pickup_location: z.string().trim().min(2, "Enter your pickup location").max(250),
  destination: z.string().trim().min(2, "Enter your destination").max(250),
  moving_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a moving date").refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Choose a valid moving date"),
  property_type: z.enum(PROPERTY_TYPES, { errorMap: () => ({ message: "Choose a property type" }) }),
  required_services: z.array(z.string().trim().min(1).max(150)).min(1, "Select at least one service").max(20),
  interest: optionalText(150),
  message: optionalText(2000),
  form: z.enum(["contact", "quote", "movers"]),
  utm_source: optionalText(150), utm_medium: optionalText(150), utm_campaign: optionalText(150),
  utm_content: optionalText(150), utm_term: optionalText(150),
  website: z.string().max(0).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;
export const LEAD_STATUSES = ["new", "contacted", "qualified", "quoted", "won", "lost"] as const;
