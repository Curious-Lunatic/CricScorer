create extension if not exists "uuid-ossp";

create table if not exists public.profiles(
    id  uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.venues(
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    city text not null default '',
    country text not null default '',
    image_url text, 
    capacity int,
    is_preset boolean not null default false,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

create table if not exists public.players(
    id uuid primary key default uuid_generate_v4(),
    team_id uuid not null,
    name text not null,
    image_url text, 
    role           text    not null check (role in ('batsman','bowler','all-rounder','wicketkeeper')),
    batting_style  text    not null check (batting_style in ('right-hand','left-hand')),
    bowling_style  text    not null,
    jersey_number  int, 
    is_preset boolean not null default false,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

create table if not exists public.matches(
    id uuid primary key default uuid_generate_v4(),
    title text,
    format text not null check (format in ('T20','ODI','Test','Street','Customized')),
    format_config jsonb   not null,    
    team_a jsonb not null,    
    team_b  jsonb not null,
    venue jsonb,
    ball_type text not null check (ball_type in ('leather','tennis','hot-tennis','tape-ball','other')),
    pitch_type text check (pitch_type in ('grass','concrete','matting','astroturf','dirt'))
    match_date date not null,
    match_time time,
    is_legacy boolean not null default false,
    legacy_notes text,
    weather text,
    gully_rules jsonb,
    toss_winner_id text,
    toss_decision text check (toss_decision in ('bat','bowl')),
    status text not null default 'setup' check (status in ('setup', 'toss', 'live', 'innings-break', 'completed', 'abandoned')),
    result jsonb,
    batting_order jsonb not null default '[]'::jsonb,
    current_innings int not null default 0,
    created_by uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)

create table if not exists public.innings(
    id uuid primary key default uuid_generate_v4(),
    match_id uuid not null references public.matches(id) on delete cascade,
    innings_number int not null,
    batting_team_id text not null,
    bowling_team_id text not null,
    runs int not null default 0,
    wickets int not null default 0,
    balls int not null default 0,
    total_deliveries int not null default 0,
    extras jsonb not null default '{"wides":0,"noballs":0,"byes":0,"legbyes":0,"penalties":0}'::jsonb
    batsmen jsonb not null default '{}'::jsonb
    bowler jsonb not null default '{}'::jsonb
    fall_of_wickets not null default '[]'::jsonb
    on_strike_id text not null default ' ',
    non_strike_id text not null default ' ',
    target int,
    is_completed boolean not null default false,
    completion_reason text check(completion_reason in ('all-out','overs','taget-chased','declared','retired','abandoned')),
    over_log jsonb not null default '[[]]'::jsonb
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (match_id,innings_number)
);

create index if not exists idx_matches_created_by on public.matches(created_by);
create index if not exists idx_matches_status on public.matches(status);
create index if not exists idx_matches_date on public.matches(match_date desc);
create index if not exists idx_innings_match_id on public.innings(match_id);
create index if not exists idx_ball_events_innings on public.ball_events(innings_id, legal_ball_seq);
create index if not exists idx_ball_events_match on public.ball_events(match_id);
create index if not exists idx_players_team on public.players(team_id);
create index if not exists idx_teams_created_by on public.teams(created_by);

alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.innings enable row level security;
alter table public.ball_events enable row level security;

create policy "profiles: own row" on public.profiles for all using (auth.uid()==id);
create policy "venues: read presets or own" on public.venues for select using (is_preset = true or auth.uid() = created_by);
create policy "venues: insert own" on public.venues for insert with check (auth.uid() = created_by);
create policy "venues: update own" on public.venues for update using (auth.uid() = created_by);
create policy "venues: delete own" on public.venues for delete using (auth.uid() = created_by);
create policy "teams: read presets or own" on public.teams for select using (is_preset = true or auth.uid() = created_by);
create policy "teams: insert own" on public.teams for insert with check (auth.uid() = created_by);
create policy "teams: update own" on public.teams for update using (auth.uid() = created_by);
create policy "teams: delete own non-preset" on public.teams for delete using (auth.uid() = created_by and is_preset = false);

create policy "players: read via team" on public.players
  for select using (
    is_preset = true or
    exists (
      select 1 from public.teams t
      where t.id = players.team_id and t.created_by = auth.uid()
    )
  );
create policy "players: insert own team" on public.players
  for insert with check (
    exists (
      select 1 from public.teams t
      where t.id = players.team_id and t.created_by = auth.uid()
    )
  );
create policy "players: update own team" on public.players
  for update using (
    exists (
      select 1 from public.teams t
      where t.id = players.team_id and t.created_by = auth.uid()
    )
  );
create policy "players: delete own team" on public.players
  for delete using (
    exists (
      select 1 from public.teams t
      where t.id = players.team_id and t.created_by = auth.uid()
    )
  );

create policy "matches: own" on public.matches
  for all using (auth.uid() = created_by);

create policy "innings: via match" on public.innings
  for all using (
    exists (
      select 1 from public.matches m
      where m.id = innings.match_id and m.created_by = auth.uid()
    )
  );

create policy "ball_events: via match" on public.ball_events
  for all using (
    exists (
      select 1 from public.matches m
      where m.id = ball_events.match_id and m.created_by = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
 
create trigger set_matches_updated_at before update on public.matches
  for each row execute procedure public.set_updated_at();
create trigger set_innings_updated_at before update on public.innings
  for each row execute procedure public.set_updated_at();
create trigger set_teams_updated_at before update on public.teams
  for each row execute procedure public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('player-images', 'player-images', false, 5242880,  array['image/jpeg','image/png','image/webp']),
  ('team-logos',    'team-logos',    false, 2097152,   array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('venue-images',  'venue-images',  false, 5242880,   array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
 
create policy "player-images: own folder" on storage.objects
  for all using (
    bucket_id = 'player-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "team-logos: own folder" on storage.objects
  for all using (
    bucket_id = 'team-logos' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "venue-images: own folder" on storage.objects
  for all using (
    bucket_id = 'venue-images' and auth.uid()::text = (storage.foldername(name))[1]
  );