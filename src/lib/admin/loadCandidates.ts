import { getCurrentPhaseKey } from '$lib/admin/phaseControl';
import { SELECTION_PHASES } from '$lib/selectionPhases';
import type { SupabaseClient } from '@supabase/supabase-js';

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
};

export async function loadAdminCandidates(supabase: SupabaseClient): Promise<{
	candidates: AdminCandidateRow[];
	warning: string | null;
}> {
	const [
		{ data: candidates, error: candidatesError },
		{ data: progressRows, error: progressError },
		{ data: technicalRows, error: technicalError },
		{ data: authData, error: authError }
	] = await Promise.all([
		supabase
			.from('candidates')
			.select(
				'id, full_name, birth_date, education_level, resume_path, created_at, is_frozen, admin_notes'
			)
			.order('created_at', { ascending: false }),
		supabase.from('candidate_phase_progress').select('candidate_id, phase_key, completed_at, sort_order'),
		supabase.from('candidate_technical_submissions').select('candidate_id, links, submitted_at'),
		supabase.auth.admin.listUsers({ perPage: 1000 })
	]);

	if (candidatesError) {
		throw candidatesError;
	}
	if (progressError) {
		throw progressError;
	}
	if (technicalError) {
		throw technicalError;
	}

	const warning = authError ? 'Não foi possível carregar e-mails de todos os usuários.' : null;

	const emailById = new Map(
		(authData?.users ?? []).map((user) => [user.id, user.email ?? null] as const)
	);

	const progressByCandidate = new Map<string, { phase_key: string; completed_at: string | null }[]>();
	for (const row of progressRows ?? []) {
		const list = progressByCandidate.get(row.candidate_id) ?? [];
		list.push({ phase_key: row.phase_key, completed_at: row.completed_at });
		progressByCandidate.set(row.candidate_id, list);
	}

	const technicalByCandidate = new Map(
		(technicalRows ?? []).map((row) => [
			row.candidate_id,
			{ links: row.links, submittedAt: row.submitted_at }
		])
	);

	const phaseLabelByKey = new Map(SELECTION_PHASES.map((phase) => [phase.key, phase.label]));

	const result: AdminCandidateRow[] = [];

	for (const candidate of candidates ?? []) {
		const progress = progressByCandidate.get(candidate.id) ?? [];
		const currentKey = candidate.is_frozen
			? 'frozen'
			: getCurrentPhaseKey(progress, true);

		const currentPhaseLabel =
			currentKey === 'frozen'
				? 'Congelado'
				: currentKey === 'concluido'
					? 'Processo concluído'
					: (phaseLabelByKey.get(currentKey) ?? currentKey);

		let resumeSignedUrl: string | null = null;
		let discSignedUrl: string | null = null;

		const { data: resumeSigned } = await supabase.storage
			.from('resumes')
			.createSignedUrl(candidate.resume_path, 3600);
		resumeSignedUrl = resumeSigned?.signedUrl ?? null;

		const discCompleted = progress.some(
			(row) => row.phase_key === 'disc' && row.completed_at
		);
		if (discCompleted) {
			const discPath = `${candidate.id}/disc-mapeamento.pdf`;
			const { data: discSigned } = await supabase.storage
				.from('resumes')
				.createSignedUrl(discPath, 3600);
			discSignedUrl = discSigned?.signedUrl ?? null;
		}

		result.push({
			id: candidate.id,
			email: emailById.get(candidate.id) ?? null,
			fullName: candidate.full_name,
			birthDate: candidate.birth_date,
			educationLevel: candidate.education_level,
			resumePath: candidate.resume_path,
			createdAt: candidate.created_at,
			isFrozen: candidate.is_frozen ?? false,
			adminNotes: candidate.admin_notes ?? '',
			currentPhaseKey: currentKey,
			currentPhaseLabel,
			phases: SELECTION_PHASES.map((phase) => ({
				key: phase.key,
				label: phase.label,
				completedAt:
					progress.find((row) => row.phase_key === phase.key)?.completed_at ??
					(phase.key === 'cadastro' ? candidate.created_at : null)
			})),
			technicalSubmission: technicalByCandidate.get(candidate.id) ?? null,
			resumeSignedUrl,
			discSignedUrl
		});
	}

	return { candidates: result, warning };
}
