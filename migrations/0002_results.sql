create table if not exists test_results (
  id         text primary key,
  user_id    text not null,
  primary_subtype text not null,
  result     jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists test_results_user_id_idx on test_results (user_id, created_at desc);
