create table public.profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.clothing_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    category text not null,
    color text,
    pattern text,
    season text,
    occasion text[] not null default '{}',
    image_path text,
    ai_predictions jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.clothing_items enable row level security;

create policy "Users can view own profile"
on public.profiles for select to authenticated
using (auth.uid() = user_id);

create policy "Users can create own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own clothing"
on public.clothing_items for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.clothing_items to authenticated;