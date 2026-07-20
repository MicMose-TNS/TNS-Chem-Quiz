create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  student_name text not null,
  score integer not null,
  total_questions integer not null,
  theme text,
  reference_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
