create table public.user_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    preferred_colors text[] not null default '{}',
    preferred_styles text[] not null default '{}',
    usual_occasions text[] not null default '{}',
    disliked_colors text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can view own preferences"
on public.user_preferences for select to authenticated
using (auth.uid() = user_id);

create policy "Users can create own preferences"
on public.user_preferences for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own preferences"
on public.user_preferences for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.user_preferences to authenticated;