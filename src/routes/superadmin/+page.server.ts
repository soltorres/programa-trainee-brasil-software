import { finalizeAdminPhase, setCandidateFrozen } from '$lib/admin/phaseControl';
import { loadAdminCandidates } from '$lib/admin/loadCandidates';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin';
import { SELECTION_PHASES, type PhaseKey } from '$lib/selectionPhases';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const PHASE_KEYS = new Set<string>(SELECTION_PHASES.map((phase) => phase.key));
const FILTER_PHASE_KEYS = new Set<string>([
	'all',
	...SELECTION_PHASES.map((phase) => phase.key),
	'concluido',
	'frozen',
	'incomplete'
]);

function adminUnavailable() {
	return fail(503, {
		adminError: 'Configure SUPABASE_SERVICE_ROLE_KEY no servidor para usar o painel administrativo.'
	});
}

export const load: PageServerLoad = async ({ url }) => {
	const supabase = getSupabaseAdmin();
	const successMessage = url.searchParams.get('success');
	const requestedPhase = url.searchParams.get('phase');
	const phaseFilterKey = requestedPhase && FILTER_PHASE_KEYS.has(requestedPhase) ? requestedPhase : 'all';

	if (!supabase) {
		return {
			configured: false as const,
			candidates: [],
			totalCandidates: 0,
			completeCount: 0,
			warning: null,
			incompleteCount: 0,
			successMessage,
			phaseOptions: SELECTION_PHASES.map((phase) => ({ key: phase.key, label: phase.label })),
			phaseFilterKey: 'all',
			phaseFilters: [
				{ key: 'all', label: 'Todas', count: 0 },
				...SELECTION_PHASES.map((phase) => ({
					key: phase.key,
					label: phase.label,
					count: 0
				})),
				{ key: 'concluido', label: 'Concluído', count: 0 },
				{ key: 'frozen', label: 'Congelado', count: 0 },
				{ key: 'incomplete', label: 'Cadastro incompleto', count: 0 }
			]
		};
	}

	try {
		const { candidates, warning, incompleteCount } = await loadAdminCandidates(supabase);

		const totalCandidates = candidates.length;
		const completeCount = totalCandidates - incompleteCount;
		const countsByPhaseKey = new Map<string, number>();
		for (const candidate of candidates) {
			const key = candidate.currentPhaseKey;
			countsByPhaseKey.set(key, (countsByPhaseKey.get(key) ?? 0) + 1);
		}

		const phaseFilters = [
			{ key: 'all', label: 'Todas', count: totalCandidates },
			...SELECTION_PHASES.map((phase) => ({
				key: phase.key,
				label: phase.label,
				count: countsByPhaseKey.get(phase.key) ?? 0
			})),
			{ key: 'concluido', label: 'Concluído', count: countsByPhaseKey.get('concluido') ?? 0 },
			{ key: 'frozen', label: 'Congelado', count: countsByPhaseKey.get('frozen') ?? 0 },
			{
				key: 'incomplete',
				label: 'Cadastro incompleto',
				count: countsByPhaseKey.get('incomplete') ?? 0
			}
		];

		const filteredCandidates =
			phaseFilterKey === 'all'
				? candidates
				: candidates.filter((candidate) => candidate.currentPhaseKey === phaseFilterKey);

		return {
			configured: true as const,
			candidates: filteredCandidates,
			totalCandidates,
			completeCount,
			warning,
			incompleteCount,
			successMessage,
			phaseOptions: SELECTION_PHASES.map((phase) => ({ key: phase.key, label: phase.label })),
			phaseFilterKey,
			phaseFilters
		};
	} catch (error) {
		console.error('superadmin load', error);
		return {
			configured: true as const,
			candidates: [],
			totalCandidates: 0,
			completeCount: 0,
			warning: null,
			phaseFilterKey: 'all',
			phaseFilters: [
				{ key: 'all', label: 'Todas', count: 0 },
				...SELECTION_PHASES.map((phase) => ({
					key: phase.key,
					label: phase.label,
					count: 0
				})),
				{ key: 'concluido', label: 'Concluído', count: 0 },
				{ key: 'frozen', label: 'Congelado', count: 0 },
				{ key: 'incomplete', label: 'Cadastro incompleto', count: 0 }
			],
			incompleteCount: 0,
			loadError: error instanceof Error ? error.message : 'Erro ao carregar candidatos.',
			successMessage,
			phaseOptions: SELECTION_PHASES.map((phase) => ({ key: phase.key, label: phase.label }))
		};
	}
};

export const actions: Actions = {
	updateNotes: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return adminUnavailable();
		}

		const formData = await request.formData();
		const candidateId = formData.get('candidateId')?.toString();
		const notes = formData.get('notes')?.toString() ?? '';

		if (!candidateId) {
			return fail(400, { adminError: 'Candidato não informado.' });
		}

		const { error } = await supabase
			.from('candidates')
			.update({ admin_notes: notes })
			.eq('id', candidateId);

		if (error) {
			console.error('superadmin updateNotes', error);
			return fail(500, { adminError: 'Não foi possível salvar a anotação.' });
		}

		redirect(303, '/superadmin?success=Anotação salva');
	},

	finalizePhase: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return adminUnavailable();
		}

		const formData = await request.formData();
		const candidateId = formData.get('candidateId')?.toString();
		const phaseKey = formData.get('phaseKey')?.toString();

		if (!candidateId || !phaseKey || !PHASE_KEYS.has(phaseKey)) {
			return fail(400, { adminError: 'Dados inválidos para finalizar a fase.' });
		}

		try {
			await finalizeAdminPhase(supabase, candidateId, phaseKey as PhaseKey);
		} catch (error) {
			console.error('superadmin finalizePhase', error);
			const message =
				error instanceof Error ? error.message : 'Não foi possível finalizar a fase do candidato.';
			return fail(500, {
				adminError: message.includes('column')
					? `${message} Execute o setup.sql atualizado no Supabase.`
					: `Não foi possível finalizar a fase: ${message}`
			});
		}

		const label = SELECTION_PHASES.find((phase) => phase.key === phaseKey)?.label ?? phaseKey;
		redirect(303, `/superadmin?success=${encodeURIComponent(`Etapa finalizada: ${label}`)}`);
	},

	freeze: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return adminUnavailable();
		}

		const candidateId = (await request.formData()).get('candidateId')?.toString();
		if (!candidateId) {
			return fail(400, { adminError: 'Candidato não informado.' });
		}

		try {
			await setCandidateFrozen(supabase, candidateId, true);
		} catch (error) {
			console.error('superadmin freeze', error);
			return fail(500, { adminError: 'Não foi possível congelar o candidato.' });
		}

		redirect(303, '/superadmin?success=Candidato congelado');
	},

	unfreeze: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			return adminUnavailable();
		}

		const candidateId = (await request.formData()).get('candidateId')?.toString();
		if (!candidateId) {
			return fail(400, { adminError: 'Candidato não informado.' });
		}

		try {
			await setCandidateFrozen(supabase, candidateId, false);
		} catch (error) {
			console.error('superadmin unfreeze', error);
			return fail(500, { adminError: 'Não foi possível descongelar o candidato.' });
		}

		redirect(303, '/superadmin?success=Candidato descongelado');
	}
};
