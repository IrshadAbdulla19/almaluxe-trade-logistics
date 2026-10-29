// Business details shown across the website. Edit this one file to change them.
// Taken from the company's business card and flyers.
export const SITE = {
  moversName: "Almaluxe Packers and Movers",
  moversTagline: "We pack with care, we move with trust",
  moversEmail: "packersandmovers@almaluxeexportllp.com",
  moversPhones: ["+91 94478 34071", "+91 99950 55922"],
  whatsapp: "919995055922",
  address:
    "Building No. 282, C Flowers Business Zone Building, Perumbilavu, Thrissur, Kerala, India – 680519.",
  moversCities: ["Thrissur", "Bangalore", "Mangalore", "Chennai", "Hyderabad"],
  social: "almaluxe",
} as const;

export const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

