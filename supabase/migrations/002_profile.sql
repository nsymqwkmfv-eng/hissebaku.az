create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text not null,
  model text not null,
  year int,
  vin text,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists recent_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  target_price numeric,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table profiles enable row level security;
alter table user_vehicles enable row level security;
alter table favorites enable row level security;
alter table saved_filters enable row level security;
alter table recent_views enable row level security;
alter table price_alerts enable row level security;

create policy "Profiles self access" on profiles
  for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Vehicles self access" on user_vehicles
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Favorites self access" on favorites
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Filters self access" on saved_filters
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Recent views self access" on recent_views
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Price alerts self access" on price_alerts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
