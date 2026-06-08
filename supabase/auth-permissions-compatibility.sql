-- =========================================================
-- FLEET-CAV AUTH + PERMISSIONS COMPATIBILITY DRAFT
-- =========================================================
--
-- Review artifact only. Do not apply to Supabase until the app changes
-- and this schema are reviewed together.
--
-- Phase 1 goal:
-- - Keep public.profiles.role for backward compatibility with the current app.
-- - Add normalized roles, user_roles, and permission_requests tables.
-- - Backfill user_roles from profiles.role.
-- - Store registration permission choices as pending requests, not automatic grants.
--
-- Current app dependency:
-- - app/auth/account/route.ts reads public.profiles.role.
-- - lib/auth/require-authenticated-profile.ts reads public.profiles.role.
--
-- Future phase:
-- - Refactor auth/profile queries to read public.user_roles.
-- - Once stable, decide whether public.profiles.role remains as primary role
--   or is retired in a later migration.

-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

-- =========================================================
-- UPDATED_AT FUNCTION
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
-- PROFILES - BACKWARD COMPATIBLE
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  email text unique not null,
  full_name text,
  avatar_url text,

  -- Compatibility column used by the current application.
  role text not null default 'viewer',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists full_name text;

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  add column if not exists role text not null default 'viewer';

alter table public.profiles
  add column if not exists created_at timestamptz not null default now();

alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

update public.profiles
set role = 'viewer'
where role is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'dispatcher', 'driver', 'viewer'));
  end if;
end;
$$;

create unique index if not exists profiles_email_unique
on public.profiles (email);

drop trigger if exists trg_profiles_updated_at
on public.profiles;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

-- =========================================================
-- ROLES
-- =========================================================

create table if not exists public.roles (
  id serial primary key,
  name text unique not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'roles_name_check'
      and conrelid = 'public.roles'::regclass
  ) then
    alter table public.roles
      add constraint roles_name_check
      check (name in ('admin', 'dispatcher', 'driver', 'viewer'));
  end if;
end;
$$;

insert into public.roles (name)
values
  ('admin'),
  ('dispatcher'),
  ('driver'),
  ('viewer')
on conflict (name) do nothing;

-- =========================================================
-- USER ROLES - NEW MULTI-ROLE MODEL
-- =========================================================

create table if not exists public.user_roles (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  role_id integer not null
    references public.roles(id)
    on delete cascade,

  granted_at timestamptz not null default now(),

  granted_by uuid
    references public.profiles(id),

  primary key (user_id, role_id)
);

-- Backfill normalized roles from the compatibility profiles.role column.
insert into public.user_roles (user_id, role_id)
select profiles.id, roles.id
from public.profiles
join public.roles
  on roles.name = profiles.role
on conflict (user_id, role_id) do nothing;

-- Keep user_roles aware of the compatibility primary role while the app
-- still writes or depends on public.profiles.role.
create or replace function public.sync_profile_primary_role_to_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  primary_role_id integer;
begin
  select id
  into primary_role_id
  from public.roles
  where name = new.role;

  if primary_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (new.id, primary_role_id)
    on conflict (user_id, role_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_primary_role_sync
on public.profiles;

create trigger trg_profiles_primary_role_sync
after insert or update of role on public.profiles
for each row
execute procedure public.sync_profile_primary_role_to_user_roles();

-- =========================================================
-- PERMISSION REQUESTS
-- =========================================================

create table if not exists public.permission_requests (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  requested_role_id integer not null
    references public.roles(id)
    on delete cascade,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),

  notes text,

  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,

  reviewed_by uuid
    references public.profiles(id)
);

create unique index if not exists permission_requests_one_pending_per_role
on public.permission_requests (user_id, requested_role_id)
where status = 'pending';

-- =========================================================
-- AUTHORIZATION HELPER FOR RLS
-- =========================================================

create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = role_name
  )
  or exists (
    select 1
    from public.user_roles
    join public.roles
      on roles.id = user_roles.role_id
    where user_roles.user_id = auth.uid()
      and roles.name = role_name
  );
$$;

grant execute on function public.has_role(text) to authenticated;

-- =========================================================
-- NEW USER HANDLER
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  primary_role_name text;
  requested_permissions_json jsonb;
  requested_role_name text;
  requested_role_id integer;
begin
  requested_permissions_json :=
    case
      when jsonb_typeof(new.raw_user_meta_data->'requested_permissions') = 'array'
        then new.raw_user_meta_data->'requested_permissions'
      else '["viewer"]'::jsonb
    end;

  primary_role_name :=
    case
      when requested_permissions_json ? 'admin' then 'admin'
      when requested_permissions_json ? 'dispatcher' then 'dispatcher'
      when requested_permissions_json ? 'driver' then 'driver'
      else 'viewer'
    end;

  insert into public.profiles (
    id,
    email,
    full_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(new.email, '@', 1)
    ),
    primary_role_name
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    role = excluded.role,
    updated_at = now();

  for requested_role_name in
    select distinct requested_role
    from (
      select jsonb_array_elements_text(requested_permissions_json) as requested_role
      union all
      select 'viewer'
    ) requested_roles
  loop
    select id
    into requested_role_id
    from public.roles
    where name = requested_role_name;

    if requested_role_id is not null then
      insert into public.user_roles (
        user_id,
        role_id
      )
      values (
        new.id,
        requested_role_id
      )
      on conflict (user_id, role_id) do nothing;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.permission_requests enable row level security;

-- =========================================================
-- PROFILE POLICIES
-- =========================================================

drop policy if exists "Users can view own profile"
on public.profiles;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Admins can view all profiles"
on public.profiles;

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.has_role('admin'));

drop policy if exists "Users can insert own profile"
on public.profiles;

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile"
on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Admins can update profiles"
on public.profiles;

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

-- =========================================================
-- ROLES POLICIES
-- =========================================================

drop policy if exists "Authenticated users can view roles"
on public.roles;

create policy "Authenticated users can view roles"
on public.roles
for select
to authenticated
using (true);

-- =========================================================
-- USER ROLES POLICIES
-- =========================================================

drop policy if exists "Users can view own roles"
on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can view all user roles"
on public.user_roles;

create policy "Admins can view all user roles"
on public.user_roles
for select
to authenticated
using (public.has_role('admin'));

drop policy if exists "Admins can grant user roles"
on public.user_roles;

create policy "Admins can grant user roles"
on public.user_roles
for insert
to authenticated
with check (public.has_role('admin'));

drop policy if exists "Admins can revoke user roles"
on public.user_roles;

create policy "Admins can revoke user roles"
on public.user_roles
for delete
to authenticated
using (public.has_role('admin'));

-- =========================================================
-- PERMISSION REQUEST POLICIES
-- =========================================================

drop policy if exists "Users can view own requests"
on public.permission_requests;

create policy "Users can view own requests"
on public.permission_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can view all permission requests"
on public.permission_requests;

create policy "Admins can view all permission requests"
on public.permission_requests
for select
to authenticated
using (public.has_role('admin'));

drop policy if exists "Users can create own pending requests"
on public.permission_requests;

create policy "Users can create own pending requests"
on public.permission_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "Admins can review permission requests"
on public.permission_requests;

create policy "Admins can review permission requests"
on public.permission_requests
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));
