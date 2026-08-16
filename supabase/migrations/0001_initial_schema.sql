-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Projects: source of truth for all portfolio cases
create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  label         text,           -- e.g. "Case Study", "Insight"
  role          text,
  date          text,
  thumbnail_url text,
  thumbnail_alt text,
  responsibilities text,
  conclusion    text,
  content_html  text,           -- sanitized legacy HTML
  published     boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Project sections (modular structure from COMPLETO_RICO CSV)
create table if not exists project_sections (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  label       text not null,
  content_html text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Metrics per project
create table if not exists metrics (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  label       text not null,
  value       text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Migration audit log (idempotent import tracking)
create table if not exists migration_logs (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null,
  source_file text not null,
  status      text not null check (status in ('success', 'skipped', 'error')),
  message     text,
  imported_at timestamptz not null default now()
);

-- Auto-update updated_at on projects
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at();

-- Row Level Security
alter table projects enable row level security;
alter table project_sections enable row level security;
alter table metrics enable row level security;
alter table migration_logs enable row level security;

-- Public can read published projects
create policy "public_read_published_projects"
  on projects for select
  using (published = true);

create policy "public_read_project_sections"
  on project_sections for select
  using (
    exists (
      select 1 from projects p
      where p.id = project_id and p.published = true
    )
  );

create policy "public_read_metrics"
  on metrics for select
  using (
    exists (
      select 1 from projects p
      where p.id = project_id and p.published = true
    )
  );

-- Service role (admin) has full access (bypasses RLS via service_role key)
-- No explicit policy needed — service_role bypasses RLS by design

-- Indexes
create index if not exists projects_slug_idx on projects(slug);
create index if not exists projects_published_sort_idx on projects(published, sort_order);
create index if not exists project_sections_project_id_idx on project_sections(project_id, sort_order);
create index if not exists metrics_project_id_idx on metrics(project_id, sort_order);
