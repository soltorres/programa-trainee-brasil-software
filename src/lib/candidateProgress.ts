import { SELECTION_PHASES, type PhaseKey } from '$lib/selectionPhases';
import { isSupabaseTableMissing } from '$lib/supabaseErrors';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function initializeCandidateProgress(
	supabase: SupabaseClient,
	candidateId: string,
	options: { completeCadastro?: boolean } = {}
) {
	const completeCadastro = options.completeCadastro ?? false;
	const completedAt = completeCadastro ? new Date().toISOString() : null;

	const rows = SELECTION_PHASES.map((phase) => ({
		candidate_id: candidateId,
		phase_key: phase.key,
		sort_order: phase.sortOrder,
		completed_at: phase.key === 'cadastro' ? completedAt : null
	}));

	const { error } = await supabase.from('candidate_phase_progress').insert(rows);

	if (error?.code === '23505') {
		return { error: null };
	}

	return { error };
}

export async function ensureCandidateProgress(
	supabase: SupabaseClient,
	candidateId: string,
	hasCandidateProfile: boolean
) {
	const { data: existing, error: fetchError } = await supabase
		.from('candidate_phase_progress')
		.select('phase_key, completed_at, sort_order')
		.eq('candidate_id', candidateId)
		.order('sort_order');

	if (fetchError) {
		if (isSupabaseTableMissing(fetchError)) {
			return { error: null, rows: [], schemaMissing: true as const };
		}
		return { error: fetchError, rows: null, schemaMissing: false as const };
	}

	if (!existing?.length) {
		const { error } = await initializeCandidateProgress(supabase, candidateId, {
			completeCadastro: hasCandidateProfile
		});
		if (error) {
			if (isSupabaseTableMissing(error)) {
				return { error: null, rows: [], schemaMissing: true as const };
			}
			return { error, rows: null, schemaMissing: false as const };
		}

		const { data: seeded, error: reseedError } = await supabase
			.from('candidate_phase_progress')
			.select('phase_key, completed_at, sort_order')
			.eq('candidate_id', candidateId)
			.order('sort_order');

		if (reseedError) {
			if (isSupabaseTableMissing(reseedError)) {
				return { error: null, rows: [], schemaMissing: true as const };
			}
			return { error: reseedError, rows: null, schemaMissing: false as const };
		}

		return { error: null, rows: seeded, schemaMissing: false as const };
	}

	if (hasCandidateProfile) {
		const cadastro = existing.find((row) => row.phase_key === 'cadastro');
		if (cadastro && !cadastro.completed_at) {
			const { error: syncError } = await supabase
				.from('candidate_phase_progress')
				.update({ completed_at: new Date().toISOString() })
				.eq('candidate_id', candidateId)
				.eq('phase_key', 'cadastro' satisfies PhaseKey);

			if (syncError) {
				if (isSupabaseTableMissing(syncError)) {
					return { error: null, rows: [], schemaMissing: true as const };
				}
				return { error: syncError, rows: existing, schemaMissing: false as const };
			}

			cadastro.completed_at = new Date().toISOString();
		}
	}

	return { error: null, rows: existing, schemaMissing: false as const };
}

export async function completeCandidatePhase(
	supabase: SupabaseClient,
	candidateId: string,
	phaseKey: PhaseKey
) {
	const completedAt = new Date().toISOString();

	const { data, error } = await supabase
		.from('candidate_phase_progress')
		.update({ completed_at: completedAt })
		.eq('candidate_id', candidateId)
		.eq('phase_key', phaseKey)
		.is('completed_at', null)
		.select('phase_key, completed_at');

	if (error) {
		return { error };
	}

	if (!data?.length) {
		return {
			error: {
				message:
					'Não foi possível concluir a fase. Verifique se a política DISC foi aplicada no Supabase.'
			}
		};
	}

	return { error: null };
}
