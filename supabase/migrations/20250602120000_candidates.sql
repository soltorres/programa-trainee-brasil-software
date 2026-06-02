-- Candidatos do Programa de Trainee
create table if not exists public.candidates (
	id uuid primary key references auth.users (id) on delete cascade,
	full_name text not null,
	birth_date date not null,
	education_level text not null,
	resume_path text not null,
	created_at timestamptz not null default now()
);

alter table public.candidates enable row level security;

create policy "Candidatos leem o próprio perfil"
	on public.candidates
	for select
	to authenticated
	using (auth.uid () = id);

create policy "Candidatos inserem o próprio perfil"
	on public.candidates
	for insert
	to authenticated
	with check (auth.uid () = id);

create policy "Candidatos atualizam o próprio perfil"
	on public.candidates
	for update
	to authenticated
	using (auth.uid () = id)
	with check (auth.uid () = id);

-- Bucket privado para currículos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'resumes',
	'resumes',
	false,
	5242880,
	array[
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	]
)
on conflict (id) do update
set
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

create policy "Candidatos enviam o próprio currículo"
	on storage.objects
	for insert
	to authenticated
	with check (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

create policy "Candidatos leem o próprio currículo"
	on storage.objects
	for select
	to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

create policy "Candidatos atualizam o próprio currículo"
	on storage.objects
	for update
	to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

create policy "Candidatos removem o próprio currículo"
	on storage.objects
	for delete
	to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);
