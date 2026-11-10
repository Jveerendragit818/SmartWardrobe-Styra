create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (user_id, display_name)
    values (
        new.id,
        nullif(
            trim(
                coalesce(
                    new.raw_user_meta_data ->> 'display_name',
                    new.raw_user_meta_data ->> 'full_name'
                )
            ),
            ''
        )
    )
    on conflict (user_id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (user_id, display_name)
select
    id,
    nullif(
        trim(
            coalesce(
                raw_user_meta_data ->> 'display_name',
                raw_user_meta_data ->> 'full_name'
            )
        ),
        ''
    )
from auth.users
on conflict (user_id) do nothing;