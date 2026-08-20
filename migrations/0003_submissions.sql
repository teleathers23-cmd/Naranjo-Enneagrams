create table if not exists test_submissions (
  id               text primary key,
  created_at       timestamptz not null default now(),
  ip               text,
  user_agent       text,
  user_id          text,
  triad_code       text not null,
  primary_subtype  text not null,
  confidence       text,
  result           jsonb not null,
  answers          jsonb
);
create index if not exists test_submissions_created_idx
  on test_submissions (created_at desc);
