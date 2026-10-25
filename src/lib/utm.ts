// Remembers ad campaign tags (?utm_source=...) from the first page a visitor lands on,
// so the enquiry they send later is attributed to the right campaign.
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORE = "almaluxe_utm";

export function captureUtm() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const found = Object.fromEntries(KEYS.filter((k) => p.get(k)).map((k) => [k, p.get(k)!.slice(0, 150)]));
  if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found));
}

export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(sessionStorage.getItem(STORE) ?? "{}"); } catch { return {}; }
}
