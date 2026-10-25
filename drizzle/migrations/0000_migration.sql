create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First account ever created becomes admin; later signups get no role.
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  short_description text not null default '',
  description text not null default '',
  forms text[] not null default '{}',
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public reads active products" on public.products for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin writes products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public reads active services" on public.services for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin writes services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  company text,
  country text,
  business_line text not null check (business_line in ('export','movers')),
  interest text,
  message text,
  source text not null default 'website',
  form text not null default 'contact',
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  external_id text,
  status text not null default 'new' check (status in ('new','contacted','qualified','quoted','won','lost')),
  follow_up_date date,
  sheets_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index leads_external_id_idx on public.leads(source, external_id) where external_id is not null;
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "admin manages leads" on public.leads for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid,
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.lead_notes to authenticated;
grant all on public.lead_notes to service_role;
alter table public.lead_notes enable row level security;
create policy "admin manages notes" on public.lead_notes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end $$;
create trigger t_products before update on public.products for each row execute function public.touch_updated_at();
create trigger t_services before update on public.services for each row execute function public.touch_updated_at();
create trigger t_leads before update on public.leads for each row execute function public.touch_updated_at();

insert into public.products (slug,name,category,short_description,description,forms,sort_order) values
('vegetables','Vegetables','vegetables','Fresh and frozen vegetables sourced from Indian farms.','Fresh and frozen vegetables carefully sourced and packed for export. Contact us with your required variety, volume and destination for availability.','{fresh,frozen,organic}',1),
('fruits','Fruits','fruits','Seasonal Indian fruits for global buyers.','Seasonal fresh and frozen fruits packed for export. Share your requirements to receive current availability.','{fresh,frozen,organic}',2),
('meat','Meat','meat','Frozen meat products for export.','Frozen meat products prepared for export. Specifications depend on destination market requirements; send an enquiry for details.','{frozen}',3),
('fish-seafood','Fish & Seafood','fish-seafood','Fresh and frozen fish and seafood.','Fish and seafood products in fresh and frozen form. Contact us for species, sizes and packing options.','{fresh,frozen}',4),
('spices','Spices','spices','Whole and ground Indian spices.','Whole and ground spices from India. Tell us the spice, grade and quantity you need.','{dry,organic}',5),
('pulses','Pulses','pulses','Lentils, beans and other pulses.','A range of pulses and lentils packed for export. Request a quote with variety and volume.','{dry,organic}',6),
('eggs','Eggs','eggs','Table eggs for export.','Eggs packed for export. Contact us for grading and packing options.','{fresh}',7),
('nuts','Nuts','nuts','Cashews, almonds and other nuts.','Nuts and dry fruits for export. Share your preferred variety and grade for a quote.','{dry}',8);

insert into public.services (slug,name,description,sort_order) values
('home-shifting','Home Shifting','Packing, loading, transport and unloading of household goods.',1),
('office-relocation','Office Relocation','Moving office furniture, equipment and files.',2),
('vehicle-transport','Vehicle Transport','Transport of cars and two-wheelers.',3),
('packing-materials','Packing & Covering Materials','All types of covering materials for safe handling.',4),
('loading-unloading','Loading & Unloading','Experienced workers for loading and unloading.',5);