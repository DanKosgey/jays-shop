-- Enable RLS
alter table public.tickets enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- Profiles: self read, admin all
create policy if not exists profiles_self_select on public.profiles
for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Tickets: owner CRUD, admins all
create policy if not exists tickets_owner_select on public.tickets
for select using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy if not exists tickets_owner_insert on public.tickets
for insert with check (user_id = auth.uid());

create policy if not exists tickets_owner_update on public.tickets
for update using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Products: anyone can read, only admins write
create policy if not exists products_public_select on public.products
for select using (true);

create policy if not exists products_admin_mod on public.products
for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
