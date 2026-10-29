import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/leads.schema";
import { SITE, tel } from "@/lib/site";
const quote = { name: "Test Customer", phone: "+91 94478 34071", email: "", form: "quote", pickup_location: "Thrissur", destination: "Chennai", moving_date: "2026-11-15", property_type: "House", required_services: ["Home Shifting"], message: "Two bedroom home" };
describe("moving quotations", () => {
  it("accepts moving details with optional email and fixes the business to movers", () => { const result = leadSchema.parse(quote); expect(result.business_line).toBe("movers"); expect(result.email).toBe(""); expect(result.pickup_location).toBe("Thrissur"); expect(result.destination).toBe("Chennai"); });
  it("does not accept enquiries for another business", () => { expect(leadSchema.safeParse({ ...quote, business_line: "export" }).success).toBe(false); });
  for (const field of ["name", "phone", "pickup_location", "destination", "moving_date", "property_type"] as const) {
    it(`requires ${field}`, () => { expect(leadSchema.safeParse({ ...quote, [field]: "" }).success).toBe(false); });
  }
  it("requires at least one service", () => { expect(leadSchema.safeParse({ ...quote, required_services: [] }).success).toBe(false); });
  it("rejects malformed optional email", () => { expect(leadSchema.safeParse({ ...quote, email: "invalid" }).success).toBe(false); });
  it("rejects a nonexistent moving date", () => { expect(leadSchema.safeParse({ ...quote, moving_date: "2026-02-30" }).success).toBe(false); });
});
describe("confirmed moving business contacts", () => {
  it("uses both confirmed phone numbers", () => { expect(SITE.moversPhones).toEqual(["+91 94478 34071", "+91 99950 55922"]); expect(tel(SITE.moversPhones[0])).toBe("tel:+919447834071"); });
  it("retains the confirmed email", () => { expect(SITE.moversEmail).toBe("packersandmovers@almaluxeexportllp.com"); });
  it("uses an international-format WhatsApp number matching a confirmed phone", () => { expect(SITE.whatsapp).toBe("919995055922"); });
  it("uses the confirmed office address", () => { expect(SITE.address).toBe("Building No. 282, C Flowers Business Zone Building, Perumbilavu, Thrissur, Kerala, India – 680519."); });
});
