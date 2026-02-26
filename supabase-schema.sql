-- EuroShop Categories & Assignments Schema
-- Run this in your Supabase SQL Editor

-- Categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- Assignments table (links Drive files to categories)
create table if not exists assignments (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references categories(id) on delete cascade not null,
  drive_file_id text not null,
  filename text not null,
  thumbnail_url text not null,
  caption text default '',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- Observations & Use Cases table
create table if not exists observations (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  type text check (type in ('observation', 'use_case')) not null default 'observation',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_assignments_category on assignments(category_id);
create index if not exists idx_assignments_drive_file on assignments(drive_file_id);
create index if not exists idx_categories_order on categories("order");
create index if not exists idx_observations_order on observations("order");

-- Enable Realtime
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table assignments;
alter publication supabase_realtime add table observations;

-- Row Level Security (open for now — no auth)
alter table categories enable row level security;
alter table assignments enable row level security;
alter table observations enable row level security;

create policy "Allow all on categories" on categories for all using (true) with check (true);
create policy "Allow all on assignments" on assignments for all using (true) with check (true);
create policy "Allow all on observations" on observations for all using (true) with check (true);
