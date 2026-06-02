-- Execute este arquivo inteiro no Supabase: SQL Editor → New query → Run
-- Projeto: Programa de Trainee (candidates + progresso + storage)

-- ── Candidatos ─────────────────────────────────────────────────────────────
create table if not exists public.candidates (
	id uuid primary key references auth.users (id) on delete cascade,
	full_name text not null,
	birth_date date not null,
	education_level text not null,
	resume_path text not null,
	admin_notes text not null default '',
	is_frozen boolean not null default false,
	created_at timestamptz not null default now()
);

alter table public.candidates enable row level security;

drop policy if exists "Candidatos leem o próprio perfil" on public.candidates;
create policy "Candidatos leem o próprio perfil"
	on public.candidates for select to authenticated
	using (auth.uid () = id);

drop policy if exists "Candidatos inserem o próprio perfil" on public.candidates;
create policy "Candidatos inserem o próprio perfil"
	on public.candidates for insert to authenticated
	with check (auth.uid () = id);

drop policy if exists "Candidatos atualizam o próprio perfil" on public.candidates;
create policy "Candidatos atualizam o próprio perfil"
	on public.candidates for update to authenticated
	using (auth.uid () = id)
	with check (auth.uid () = id);

grant select, insert, update on public.candidates to authenticated;

-- ── Progresso por fase ─────────────────────────────────────────────────────
create table if not exists public.candidate_phase_progress (
	id uuid primary key default gen_random_uuid (),
	candidate_id uuid not null references auth.users (id) on delete cascade,
	phase_key text not null,
	sort_order smallint not null,
	completed_at timestamptz,
	created_at timestamptz not null default now(),
	unique (candidate_id, phase_key)
);

create index if not exists candidate_phase_progress_candidate_id_idx
	on public.candidate_phase_progress (candidate_id);

alter table public.candidate_phase_progress enable row level security;

drop policy if exists "Candidatos leem o próprio progresso" on public.candidate_phase_progress;
create policy "Candidatos leem o próprio progresso"
	on public.candidate_phase_progress for select to authenticated
	using (auth.uid () = candidate_id);

drop policy if exists "Candidatos inserem o próprio progresso" on public.candidate_phase_progress;
create policy "Candidatos inserem o próprio progresso"
	on public.candidate_phase_progress for insert to authenticated
	with check (auth.uid () = candidate_id);

drop policy if exists "Candidatos sincronizam conclusão do cadastro" on public.candidate_phase_progress;
create policy "Candidatos sincronizam conclusão do cadastro"
	on public.candidate_phase_progress for update to authenticated
	using (auth.uid () = candidate_id and phase_key = 'cadastro')
	with check (auth.uid () = candidate_id and phase_key = 'cadastro');

drop policy if exists "Candidatos concluem fase DISC" on public.candidate_phase_progress;
create policy "Candidatos concluem fase DISC"
	on public.candidate_phase_progress for update to authenticated
	using (auth.uid () = candidate_id and phase_key = 'disc')
	with check (auth.uid () = candidate_id and phase_key = 'disc');

drop policy if exists "Candidatos concluem fase técnica" on public.candidate_phase_progress;
create policy "Candidatos concluem fase técnica"
	on public.candidate_phase_progress for update to authenticated
	using (auth.uid () = candidate_id and phase_key = 'technical')
	with check (auth.uid () = candidate_id and phase_key = 'technical');

grant select, insert, update on public.candidate_phase_progress to authenticated;

-- ── Entrega do Desafio Técnico (links) ─────────────────────────────────────
create table if not exists public.candidate_technical_submissions (
	candidate_id uuid primary key references auth.users (id) on delete cascade,
	links text not null,
	submitted_at timestamptz not null default now()
);

alter table public.candidate_technical_submissions enable row level security;

drop policy if exists "Candidatos leem própria entrega técnica" on public.candidate_technical_submissions;
create policy "Candidatos leem própria entrega técnica"
	on public.candidate_technical_submissions for select to authenticated
	using (auth.uid () = candidate_id);

drop policy if exists "Candidatos enviam entrega técnica" on public.candidate_technical_submissions;
create policy "Candidatos enviam entrega técnica"
	on public.candidate_technical_submissions for insert to authenticated
	with check (auth.uid () = candidate_id);

drop policy if exists "Candidatos atualizam entrega técnica" on public.candidate_technical_submissions;
create policy "Candidatos atualizam entrega técnica"
	on public.candidate_technical_submissions for update to authenticated
	using (auth.uid () = candidate_id)
	with check (auth.uid () = candidate_id);

grant select, insert, update on public.candidate_technical_submissions to authenticated;

-- Colunas administrativas (projetos já criados antes desta versão do script)
alter table public.candidates add column if not exists admin_notes text not null default '';
alter table public.candidates add column if not exists is_frozen boolean not null default false;

-- ── Storage: currículos ────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'resumes',
	'resumes',
	false,
	5242880,
	array[
		'application/pdf',
		'application/x-pdf',
		'application/octet-stream',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	]
)
on conflict (id) do update
set
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Candidatos enviam o próprio currículo" on storage.objects;
create policy "Candidatos enviam o próprio currículo"
	on storage.objects for insert to authenticated
	with check (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

drop policy if exists "Candidatos leem o próprio currículo" on storage.objects;
create policy "Candidatos leem o próprio currículo"
	on storage.objects for select to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

drop policy if exists "Candidatos atualizam o próprio currículo" on storage.objects;
create policy "Candidatos atualizam o próprio currículo"
	on storage.objects for update to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);

drop policy if exists "Candidatos removem o próprio currículo" on storage.objects;
create policy "Candidatos removem o próprio currículo"
	on storage.objects for delete to authenticated
	using (
		bucket_id = 'resumes'
		and (storage.foldername (name)) [1] = auth.uid ()::text
	);
