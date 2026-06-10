import { getCurrentPhaseKey } from '$lib/admin/phaseControl';
import { SELECTION_PHASES } from '$lib/selectionPhases';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const PAGE_SIZE = 1000;

type CandidateRecord = {
	id: string;
	full_name: string;
	birth_date: string;
	education_level: string;
	resume_path: string;
	created_at: string;
	is_frozen: boolean | null;
	admin_notes: string | null;
};

type ProgressRecord = {
	candidate_id: string;
	phase_key: string;
	completed_at: string | null;
	sort_order: number;
};

type TechnicalRecord = {
	candidate_id: string;
	links: string;
	submitted_at: string;
};

export type AdminCandidateRow = {
	id: string;
	email: string | null;
	fullName: string;
	birthDate: string;
	educationLevel: string;
	resumePath: string;
	createdAt: string;
	isFrozen: boolean;
	adminNotes: string;
	currentPhaseKey: string;
	currentPhaseLabel: string;
	phases: {
		key: string;
		label: string;
		completedAt: string | null;
	}[];
	technicalSubmission: { links: string; submittedAt: string } | null;
	resumeSignedUrl: string | null;
	discSignedUrl: string | null;
	/** Conta criada no Auth, mas sem linha em `candidates` (cadastro não concluído). */
	profileIncomplete: boolean;
};

async function fetchPaginated<T>(
	fetchPage: (from: number, to: number) => Promise<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
	const rows: T[] = [];
	let from = 0;

	while (true) {
		const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
		if (error) {
			throw error;
		}

		const page = data ?? [];
		rows.push(...page);

		if (page.length < PAGE_SIZE) {
			break;
		}

		from += PAGE_SIZE;
	}

	return rows;
}

async function fetchAllAuthUsers(supabase: SupabaseClient): Promise<User[]> {
	const users: User[] = [];
	let page = 1;

	while (true) {
		const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PAGE_SIZE });
		if (error) {
			throw error;
		}

		users.push(...data.users);

		if (data.users.length < PAGE_SIZE) {
			break;
		}

		page += 1;
	}

	return users;
}

function buildPhases(
	candidate: CandidateRecord,
	progress: { phase_key: string; completed_at: string | null }[]
) {
	return SELECTION_PHASES.map((phase) => ({
		key: phase.key,
		label: phase.label,
		completedAt:
			progress.find((row) => row.phase_key === phase.key)?.completed_at ??
			(phase.key === 'cadastro' ? candidate.created_at : null)
	}));
}

async function buildCandidateRow(
	supabase: SupabaseClient,
	candidate: CandidateRecord,
	progress: { phase_key: string; completed_at: string | null }[],
	email: string | null,
	technicalSubmission: { links: string; submittedAt: string } | null,
	phaseLabelByKey: Map<string, string>
): Promise<AdminCandidateRow> {
	const currentKey = candidate.is_frozen ? 'frozen' : getCurrentPhaseKey(progress, true);

	const currentPhaseLabel =
		currentKey === 'frozen'
			? 'Congelado'
			: currentKey === 'concluido'
				? 'Processo concluído'
				: (phaseLabelByKey.get(currentKey) ?? currentKey);

	const discCompleted = progress.some((row) => row.phase_key === 'disc' && row.completed_at);

	const [resumeSigned, discSigned] = await Promise.all([
		supabase.storage.from('resumes').createSignedUrl(candidate.resume_path, 3600),
		discCompleted
			? supabase.storage
					.from('resumes')
					.createSignedUrl(`${candidate.id}/disc-mapeamento.pdf`, 3600)
			: Promise.resolve({ data: null, error: null })
	]);

	return {
		id: candidate.id,
		email,
		fullName: candidate.full_name,
		birthDate: candidate.birth_date,
		educationLevel: candidate.education_level,
		resumePath: candidate.resume_path,
		createdAt: candidate.created_at,
		isFrozen: candidate.is_frozen ?? false,
		adminNotes: candidate.admin_notes ?? '',
		currentPhaseKey: currentKey,
		currentPhaseLabel,
		phases: buildPhases(candidate, progress),
		technicalSubmission,
		resumeSignedUrl: resumeSigned.data?.signedUrl ?? null,
		discSignedUrl: discSigned.data?.signedUrl ?? null,
		profileIncomplete: false
	};
}

function buildIncompleteRow(user: User): AdminCandidateRow {
	const fullName =
		(typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
		user.email?.split('@')[0] ||
		'Cadastro incompleto';

	return {
		id: user.id,
		email: user.email ?? null,
		fullName,
		birthDate: '',
		educationLevel: '—',
		resumePath: '',
		createdAt: user.created_at,
		isFrozen: false,
		adminNotes: '',
		currentPhaseKey: 'incomplete',
		currentPhaseLabel: 'Cadastro incompleto',
		phases: SELECTION_PHASES.map((phase) => ({
			key: phase.key,
			label: phase.label,
			completedAt: null
		})),
		technicalSubmission: null,
		resumeSignedUrl: null,
		discSignedUrl: null,
		profileIncomplete: true
	};
}

export async function loadAdminCandidates(supabase: SupabaseClient): Promise<{
	candidates: AdminCandidateRow[];
	warning: string | null;
	incompleteCount: number;
}> {
	const [candidates, progressRows, technicalRows, authUsers] = await Promise.all([
		fetchPaginated<CandidateRecord>(async (from, to) =>
			supabase
				.from('candidates')
				.select(
					'id, full_name, birth_date, education_level, resume_path, created_at, is_frozen, admin_notes'
				)
				.order('created_at', { ascending: false })
				.range(from, to)
		),
		fetchPaginated<ProgressRecord>(async (from, to) =>
			supabase
				.from('candidate_phase_progress')
				.select('candidate_id, phase_key, completed_at, sort_order')
				.range(from, to)
		),
		fetchPaginated<TechnicalRecord>(async (from, to) =>
			supabase
				.from('candidate_technical_submissions')
				.select('candidate_id, links, submitted_at')
				.range(from, to)
		),
		fetchAllAuthUsers(supabase)
	]);

	const emailById = new Map(authUsers.map((user) => [user.id, user.email ?? null] as const));

	const progressByCandidate = new Map<string, { phase_key: string; completed_at: string | null }[]>();
	for (const row of progressRows) {
		const list = progressByCandidate.get(row.candidate_id) ?? [];
		list.push({ phase_key: row.phase_key, completed_at: row.completed_at });
		progressByCandidate.set(row.candidate_id, list);
	}

	const technicalByCandidate = new Map(
		technicalRows.map((row) => [
			row.candidate_id,
			{ links: row.links, submittedAt: row.submitted_at }
		])
	);

	const phaseLabelByKey = new Map(SELECTION_PHASES.map((phase) => [phase.key, phase.label]));
	const candidateIds = new Set(candidates.map((candidate) => candidate.id));

	const completeRows = await Promise.all(
		candidates.map((candidate) =>
			buildCandidateRow(
				supabase,
				candidate,
				progressByCandidate.get(candidate.id) ?? [],
				emailById.get(candidate.id) ?? null,
				technicalByCandidate.get(candidate.id) ?? null,
				phaseLabelByKey
			)
		)
	);

	const incompleteRows = authUsers
		.filter((user) => !candidateIds.has(user.id))
		.map((user) => buildIncompleteRow(user));

	const allRows = [...completeRows, ...incompleteRows].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	return {
		candidates: allRows,
		warning: null,
		incompleteCount: incompleteRows.length
	};
}
