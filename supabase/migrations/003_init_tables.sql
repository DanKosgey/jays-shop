-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- Products catalog
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text,
  description text not null,
  price numeric not null,
  stock int default 0,
  stock_quantity int,
  image_url text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Repair tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket_number text not null unique,
  customer_name text not null,
  device_type text not null,
  device_brand text not null,
  device_model text not null,
  issue_description text not null,
  status text not null default 'received' check (status in ('received','diagnosing','awaiting_parts','repairing','quality_check','ready','completed','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  estimated_cost numeric,
  final_cost numeric,
  estimated_completion timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update updated_at on change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_tickets_updated_at on public.tickets;
create trigger set_tickets_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();
