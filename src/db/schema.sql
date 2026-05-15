create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
    id  uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

