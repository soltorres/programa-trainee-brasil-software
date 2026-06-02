import { finalizeAdminPhase, setCandidateFrozen } from '$lib/admin/phaseControl';
import { loadAdminCandidates } from '$lib/admin/loadCandidates';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin';
import { SELECTION_PHASES, type PhaseKey } from '$lib/selectionPhases';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const PHASE_KEYS = new Set<string>(SELECTION_PHASES.map((phase) => phase.key));

function adminUnavailable() {
	return fail(503, {
		adminError: 'Configure SUPABASE_SERVICE_ROLE_KEY no servidor para usar o painel administrativo.'
	});
}

export const load: PageServerLoad = async ({ url }) => {
	const supabase = getSupabaseAdmin();
	const successMessage = url.searchParams.get('success');

	if (!supabase) {
		return {
			configured: false as const,
			candidates: [],
			warning: null,
			successMessage,
			phaseOptions: SELECTION_PHASES.map((phase) => ({ key: phase.key, label: phase.label }))
		};
	}

	try {
		const { candidates, warning } = await loadAdminCandidates(supabase);
		return {
			configured: true as const,
			candidates,
			warning,
			successMessage,
			phaseOptions: SELECTION_PHASES.map((phase) => ({ key: phase.key, label: phase.label }))
		};
	} catch (error) {
		console.error('superadmin load', error);
		return {
			configured: true as const,
			candidates: [],
			warning: null,
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
