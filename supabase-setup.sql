-- Arlene's Kitchen Table: database setup for Supabase.
-- Run this once: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.

-- 1. Recipes. New submissions start as 'pending' and stay hidden until approved.
create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null check (char_length(title) between 1 and 120),
  cook        text,
  place       text,
  year        int check (year between 1700 and 2100),
  cats        text[] not null default '{}',
  ingredients text[] not null default '{}',
  method      text check (char_length(method) <= 5000),
  image_path  text,                       -- file name in the 'cards' storage bucket
  manual      boolean not null default false,  -- true when typed in with no photo
  contact     text,                       -- optional, only so a card can be removed on request
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected'))
);

-- 2. Admins. Only people listed here can approve, edit or delete cards.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 3. Row level security: this is what actually keeps the admin page private.
alter table public.recipes enable row level security;
alter table public.admins  enable row level security;

drop policy if exists "public reads approved"   on public.recipes;
drop policy if exists "anyone submits pending"  on public.recipes;
drop policy if exists "admin reads all"         on public.recipes;
drop policy if exists "admin updates"           on public.recipes;
drop policy if exists "admin deletes"           on public.recipes;
drop policy if exists "see own admin row"       on public.admins;

create policy "public reads approved"  on public.recipes for select using (status = 'approved');
create policy "anyone submits pending" on public.recipes for insert with check (status = 'pending');
create policy "admin reads all"        on public.recipes for select using (public.is_admin());
create policy "admin updates"          on public.recipes for update using (public.is_admin()) with check (public.is_admin());
create policy "admin deletes"          on public.recipes for delete using (public.is_admin());
create policy "see own admin row"      on public.admins  for select using (user_id = auth.uid());

-- 4. Photo storage: public bucket, images only, 5 MB each.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cards', 'cards', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "anyone uploads card photos" on storage.objects;
drop policy if exists "anyone views card photos"   on storage.objects;
drop policy if exists "admin deletes card photos"  on storage.objects;

create policy "anyone uploads card photos" on storage.objects for insert with check (bucket_id = 'cards');
create policy "anyone views card photos"   on storage.objects for select using (bucket_id = 'cards');
create policy "admin deletes card photos"  on storage.objects for delete using (bucket_id = 'cards' and public.is_admin());

-- 5. After you have signed in once on admin.html, make yourself an admin:
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'shattoblue@gmail.com';
