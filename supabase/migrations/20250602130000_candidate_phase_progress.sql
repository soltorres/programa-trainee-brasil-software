-- Progresso individual por fase do processo seletivo
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

create policy "Candidatos leem o próprio progresso"
	on public.candidate_phase_progress
	for select
	to authenticated
	using (auth.uid () = candidate_id);

create policy "Candidatos inserem o próprio progresso"
	on public.candidate_phase_progress
	for insert
	to authenticated
	with check (auth.uid () = candidate_id);

create policy "Candidatos sincronizam conclusão do cadastro"
	on public.candidate_phase_progress
	for update
	to authenticated
	using (auth.uid () = candidate_id and phase_key = 'cadastro')
	with check (auth.uid () = candidate_id and phase_key = 'cadastro');

drop policy if exists "Candidatos concluem fase DISC" on public.candidate_phase_progress;
create policy "Candidatos concluem fase DISC"
	on public.candidate_phase_progress
	for update
	to authenticated
	using (auth.uid () = candidate_id and phase_key = 'disc')
	with check (auth.uid () = candidate_id and phase_key = 'disc');

-- Demais fases: equipe via service role / SQL no painel Supabase
