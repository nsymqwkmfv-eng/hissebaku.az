create extension if not exists pgcrypto;

create table if not exists categories (
  id text primary key,
  title text not null,
  icon text,
  items text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id text references categories(id) on delete set null,
  title text not null,
  part_type text not null,
  description text not null,
  images jsonb not null default '[]',
  price numeric not null,
  discount numeric,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);

-- Seed categories based on current catalog
insert into categories (id, title, icon, items)
values
  ('oils', 'Yağlar', 'droplet', array['Mühərrik Yağları', 'Transmissiya Yağları']),
  ('cooling', 'Maye sistemi', 'snowflake', array['Antifriz', 'Qatqılar']),
  ('brake-system', 'Əyləc sistemi', 'disc', array['Əyləc bəndi', 'Əyləc diski']),
  ('filters', 'Filtrlər', 'filter', array['Hava filtri', 'Yağ filtri', 'Yanacaq filtri']),
  ('engine-parts', 'Motor hissələri', 'engine', array['Kəmərlər', 'Qatqılar', 'Alışdırma şamları']),
  ('suspension', 'Asqı sistemi', 'suspension', array['Stabilizator', 'Amortizator'])
on conflict (id) do nothing;

-- RLS is intentionally permissive for the admin panel (client-side env gate).
alter table categories enable row level security;
alter table products enable row level security;

create policy "Public categories access" on categories
  for all
  using (true)
  with check (true);

create policy "Public products access" on products
  for all
  using (true)
  with check (true);
