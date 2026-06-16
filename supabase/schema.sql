-- ============================================================
-- GreenTrack — Supabase schema
-- Виконайте цей скрипт у Supabase → SQL Editor → New query → Run.
-- Безпечно запускати повторно (idempotent).
-- ============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text not null default 'Користувач',
  avatar_color text default '#52B788',
  baseline     numeric,                 -- т CO₂ / рік (з калькулятора)
  monthly_goal integer not null default 300,
  eco_points   integer not null default 0,
  total_co2    numeric not null default 0,
  month_co2    numeric not null default 0,
  settings     jsonb not null default '{"weeklyDigest":true,"publicProfile":true,"reminders":false}'::jsonb,
  created_at   timestamptz not null default now()
);

-- ---------- ACTIVITIES ----------
create table if not exists public.activities (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  category   text not null,
  co2        numeric not null,
  note       text default '',
  date       date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists activities_user_date_idx on public.activities (user_id, date desc);

-- ---------- USER CHALLENGES ----------
create table if not exists public.user_challenges (
  user_id      uuid not null references auth.users (id) on delete cascade,
  challenge_id text not null,
  joined       boolean not null default false,
  completed    boolean not null default false,
  progress     numeric not null default 0,
  joined_at    timestamptz,
  completed_at timestamptz,
  primary key (user_id, challenge_id)
);

-- ---------- USER ACHIEVEMENTS ----------
create table if not exists public.user_achievements (
  user_id        uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at    timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.activities        enable row level security;
alter table public.user_challenges   enable row level security;
alter table public.user_achievements enable row level security;

-- profiles: усі автентифіковані можуть читати (для рейтингу),
-- редагувати — лише власник. Email тут НЕ зберігається (він в auth.users).
drop policy if exists "profiles read all" on public.profiles;
create policy "profiles read all" on public.profiles
  for select using (true);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- activities: лише власник
drop policy if exists "activities own" on public.activities;
create policy "activities own" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_challenges: лише власник
drop policy if exists "challenges own" on public.user_challenges;
create policy "challenges own" on public.user_challenges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_achievements: лише власник
drop policy if exists "achievements own" on public.user_achievements;
create policy "achievements own" on public.user_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: автоматично створювати профіль при реєстрації
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_color, eco_points)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Користувач'),
    coalesce(new.raw_user_meta_data->>'avatar_color', '#52B788'),
    20
  )
  on conflict (id) do nothing;

  insert into public.user_achievements (user_id, achievement_id)
  values (new.id, 'welcome')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
