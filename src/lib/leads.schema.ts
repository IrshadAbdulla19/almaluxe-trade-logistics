import { z } from "zod";

// One schema shared by the browser form and the server, so rules match exactly.
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  business_line: z.enum(["export", "movers"]),
  interest: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  form: z.enum(["contact", "quote", "product", "movers"]),
  utm_source: z.string().max(150).optional(),
  utm_medium: z.string().max(150).optional(),
  utm_campaign: z.string().max(150).optional(),
  utm_content: z.string().max(150).optional(),
  utm_term: z.string().max(150).optional(),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});
export type LeadInput = z.infer<typeof leadSchema>;

export const LEAD_STATUSES = ["new", "contacted", "qualified", "quoted", "won", "lost"] as const;
