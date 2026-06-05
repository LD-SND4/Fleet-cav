-- =========================================================
-- USER QUERY
-- AUTH / ROLES / PERMISSIONS
-- SAFE MIGRATION VERSION
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- UPDATED AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
new.updated_at = now();
return new;
end;
$$;

-- =========================================================
-- FORCE RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.permission_requests enable row level security;

alter table public.profiles force row level security;
alter table public.roles force row level security;
alter table public.user_roles force row level security;
alter table public.permission_requests force row level security;

-- =========================================================
-- DROP OLD VIEW
-- =========================================================

drop view if exists public.user_permissions;

-- =========================================================
-- CURRENT USER PERMISSIONS RPC
-- =========================================================

create or replace function public.get_current_user_permissions()
returns table (
user_id uuid,
email text,
role_name text
)
language sql
security invoker
as $$
select
p.id as user_id,
p.email,
r.name as role_name
from public.profiles p
join public.user_roles ur
on ur.user_id = p.id
join public.roles r
on r.id = ur.role_id
where p.id = auth.uid();
$$;

grant execute
on function public.get_current_user_permissions()
to authenticated;

-- =========================================================
-- POLICIES
-- =========================================================

drop policy if exists "profiles_select_own"
on public.profiles;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
auth.uid() = id
);

drop policy if exists "profiles_insert_own"
on public.profiles;

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
auth.uid() = id
);

drop policy if exists "profiles_update_own"
on public.profiles;

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
auth.uid() = id
);

drop policy if exists "roles_select_authenticated"
on public.roles;

create policy "roles_select_authenticated"
on public.roles
for select
to authenticated
using (true);

drop policy if exists "user_roles_select_own"
on public.user_roles;

create policy "user_roles_select_own"
on public.user_roles
for select
to authenticated
using (
auth.uid() = user_id
);

drop policy if exists "permission_requests_select_own"
on public.permission_requests;

create policy "permission_requests_select_own"
on public.permission_requests
for select
to authenticated
using (
auth.uid() = user_id
);

drop policy if exists "permission_requests_insert_own"
on public.permission_requests;

create policy "permission_requests_insert_own"
on public.permission_requests
for insert
to authenticated
with check (
auth.uid() = user_id
);

-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists idx_user_roles_user
on public.user_roles(user_id);

create index if not exists idx_permission_requests_user
on public.permission_requests(user_id);

create index if not exists idx_permission_requests_status
on public.permission_requests(status);
