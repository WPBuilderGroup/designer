create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  slug text not null, -- e.g., 'home'
  gjs_html text,
  gjs_css text,
  gjs_components jsonb,
  gjs_styles jsonb,
  updated_at timestamptz not null default now(),
  unique (project_id, slug)
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'page',
  gjs_html text,
  gjs_css text,
  gjs_components jsonb,
  gjs_styles jsonb,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists domains (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  domain text unique not null,
  status text not null default 'pending', -- pending|verified
  token text not null default encode(gen_random_bytes(8), 'hex'),
  verified_at timestamptz
);

create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  html text,
  css text,
  created_at timestamptz not null default now()
);
