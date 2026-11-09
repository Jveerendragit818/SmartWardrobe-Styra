create table public.saved_outfits (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text,
    created_at timestamptz not null default now()
);

create table public.saved_outfit_items (
    id uuid primary key default gen_random_uuid(),
    saved_outfit_id uuid not null
        references public.saved_outfits(id) on delete cascade,
    clothing_item_id uuid not null
        references public.clothing_items(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (saved_outfit_id, clothing_item_id)
);

alter table public.saved_outfits enable row level security;
alter table public.saved_outfit_items enable row level security;

create policy "Users manage own saved outfits"
on public.saved_outfits for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users view own saved outfit items"
on public.saved_outfit_items for select to authenticated
using (
    exists (
        select 1
        from public.saved_outfits
        where id = saved_outfit_id
          and user_id = auth.uid()
    )
);

create policy "Users link own clothing to own outfits"
on public.saved_outfit_items for insert to authenticated
with check (
    exists (
        select 1
        from public.saved_outfits
        where id = saved_outfit_id
          and user_id = auth.uid()
    )
    and exists (
        select 1
        from public.clothing_items
        where id = clothing_item_id
          and user_id = auth.uid()
    )
);

create policy "Users remove own saved outfit items"
on public.saved_outfit_items for delete to authenticated
using (
    exists (
        select 1
        from public.saved_outfits
        where id = saved_outfit_id
          and user_id = auth.uid()
    )
);

grant select, insert, update, delete
on public.saved_outfits to authenticated;

grant select, insert, delete
on public.saved_outfit_items to authenticated;