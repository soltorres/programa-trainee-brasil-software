import { SELECTION_PHASES, type PhaseKey } from '$lib/selectionPhases';
import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminPhaseTarget = PhaseKey;

export function initialPhaseForAdmin(candidate: {
	isFrozen: boolean;
	currentPhaseKey: string;
	phases: { key: string; completedAt: string | null }[];
}): PhaseKey {
	if (candidate.isFrozen) {
		const firstOpen = candidate.phases.find((phase) => !phase.completedAt);
		return (firstOpen?.key ?? 'cultural') as PhaseKey;
	}

	if (candidate.currentPhaseKey === 'concluido') {
		return 'onboarding';
	}

	if (SELECTION_PHASES.some((phase) => phase.key === candidate.currentPhaseKey)) {
		return candidate.currentPhaseKey as PhaseKey;
	}

	return 'cadastro';
}

export function getCurrentPhaseKey(
	progressRows: { phase_key: string; completed_at: string | null }[],
	hasProfile: boolean
): PhaseKey | 'concluido' | 'frozen' {
	const progressByKey = new Map(progressRows.map((row) => [row.phase_key, row.completed_at]));

	const completedFlags = SELECTION_PHASES.map((phase) => {
		if (phase.key === 'cadastro' && hasProfile) return true;
		return Boolean(progressByKey.get(phase.key));
	});

	if (completedFlags.every(Boolean)) {
		return 'concluido';
	}

	const firstOpen = SELECTION_PHASES.find((_, index) => !completedFlags[index]);
	return firstOpen?.key ?? 'cadastro';
}

/** Marca a etapa escolhida e todas as anteriores como concluídas; a próxima permanece em andamento. */
export async function finalizeAdminPhase(
	supabase: SupabaseClient,
	candidateId: string,
	phaseToFinalize: AdminPhaseTarget
) {
	const targetIndex = SELECTION_PHASES.findIndex((phase) => phase.key === phaseToFinalize);
	if (targetIndex < 0) {
		throw new Error('Fase inválida');
	}

	const now = new Date().toISOString();

	for (let index = 0; index < SELECTION_PHASES.length; index++) {
		const phase = SELECTION_PHASES[index];
		const completedAt = index <= targetIndex ? now : null;

		const { data: existing, error: fetchError } = await supabase
			.from('candidate_phase_progress')
			.select('id')
			.eq('candidate_id', candidateId)
			.eq('phase_key', phase.key)
			.maybeSingle();

		if (fetchError) {
			throw fetchError;
		}

		if (existing) {
			const { error: updateError } = await supabase
				.from('candidate_phase_progress')
				.update({ completed_at: completedAt, sort_order: phase.sortOrder })
				.eq('candidate_id', candidateId)
				.eq('phase_key', phase.key);

			if (updateError) {
				throw updateError;
			}
		} else {
			const { error: insertError } = await supabase.from('candidate_phase_progress').insert({
				candidate_id: candidateId,
				phase_key: phase.key,
				sort_order: phase.sortOrder,
				completed_at: completedAt
			});

			if (insertError) {
				throw insertError;
			}
		}
	}

	const { error: unfreezeError } = await supabase
		.from('candidates')
		.update({ is_frozen: false })
		.eq('id', candidateId);

	if (unfreezeError) {
		throw unfreezeError;
	}
}

export async function setCandidateFrozen(
	supabase: SupabaseClient,
	candidateId: string,
	frozen: boolean
) {
	const { error } = await supabase
		.from('candidates')
		.update({ is_frozen: frozen })
		.eq('id', candidateId);

	if (error) {
		throw error;
	}
}
