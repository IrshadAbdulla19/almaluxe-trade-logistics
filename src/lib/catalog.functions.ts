import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// Read-only public client (only sees active products/services thanks to RLS).
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("products").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().max(100) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient().from("products").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("services").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const productsQuery = queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });
export const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: () => listServices() });
export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });
