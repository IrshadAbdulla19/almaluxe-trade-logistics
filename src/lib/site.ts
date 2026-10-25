// Business details shown across the website. Edit this one file to change them.
// Taken from the company's business card and flyers.
export const SITE = {
  exportName: "Almaluxe Export LLP",
  moversName: "Almaluxe Packers and Movers",
  exportTagline: "Exporting innovation, importing success",
  moversTagline: "We pack with care, we move with trust",
  exportEmail: "info@almaluxeexportllp.com",
  moversEmail: "packersandmovers@almaluxeexportllp.com",
  exportPhones: ["+91 99950 55922", "+91 99950 65922"],
  moversPhones: ["+91 94478 34071", "+91 99950 55922"],
  whatsapp: "919995055922",
  address:
    "Building No 282 C, Flower's Business Zone Building, Perumbilavu, Thrissur, Kerala, India 680519",
  moversCities: ["Thrissur", "Bangalore", "Mangalore", "Chennai", "Hyderabad"],
  social: "almaluxe",
} as const;

export const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

import vegetables from "@/assets/cat-vegetables.jpg";
import fruits from "@/assets/cat-fruits.jpg";
import meat from "@/assets/cat-meat.jpg";
import fish from "@/assets/cat-fish-seafood.jpg";
import spices from "@/assets/cat-spices.jpg";
import pulses from "@/assets/cat-pulses.jpg";
import eggs from "@/assets/cat-eggs.jpg";
import nuts from "@/assets/cat-nuts.jpg";

// Fallback image per category (used when a product has no image_url).
export const CATEGORY_IMAGES: Record<string, string> = {
  vegetables, fruits, meat, "fish-seafood": fish, spices, pulses, eggs, nuts,
};
