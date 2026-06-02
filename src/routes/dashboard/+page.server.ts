import {
	completeCandidatePhase,
	ensureCandidateProgress
} from '$lib/candidateProgress';
import { DEFAULT_DISC_ASSESSMENT_URL } from '$lib/discPhase';
import { DEFAULT_CULTURAL_CALENDAR_URL } from '$lib/culturalPhase';
import {
	DEFAULT_TECHNICAL_CHALLENGE_URL,
	normalizeTechnicalSubmission
} from '$lib/technicalPhase';
import { buildPhaseTimeline, progressPercent, type PhaseKey } from '$lib/selectionPhases';
import { isSupabaseTableMissing } from '$lib/supabaseErrors';
import { env } from '$env/dynamic/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function loadDashboardData(supabase: App.Locals['supabase'], userId: string) {
	const { data: candidate, error: candidateError } = await supabase
		.from('candidates')
		.select('full_name, is_frozen')
		.eq('id', userId)
		.maybeSingle();

	const candidatesTableMissing = isSupabaseTableMissing(candidateError);
	const hasCandidateProfile = Boolean(candidate) && !candidatesTableMissing;

	const { rows, error, schemaMissing } = await ensureCandidateProgress(
		supabase,
		userId,
		hasCandidateProfile
	);

	const phases = buildPhaseTimeline(rows ?? [], hasCandidateProfile);

	return {
		candidate,
		hasCandidateProfile,
		isFrozen: Boolean(candidate?.is_frozen),
		phases,
		progressError: error,
		schemaMissing: schemaMissing || candidatesTableMissing
	};
}

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	const userId = session!.user.id;
	const data = await loadDashboardData(supabase, userId);

	if (data.progressError) {
		console.error('candidate progress', data.progressError);
	}

	const percent = progressPercent(data.phases);
	const completedCount = data.phases.filter((phase) => phase.status === 'completed').length;
	const currentPhase = data.phases.find((phase) => phase.status === 'current');

	const discAssessmentUrl = env.PUBLIC_DISC_ASSESSMENT_URL ?? DEFAULT_DISC_ASSESSMENT_URL;
	const technicalChallengeUrl =
		env.PUBLIC_TECHNICAL_CHALLENGE_URL ?? DEFAULT_TECHNICAL_CHALLENGE_URL;
	const culturalCalendarUrl =
		env.PUBLIC_CULTURAL_CALENDAR_URL ?? DEFAULT_CULTURAL_CALENDAR_URL;

	const { data: technicalSubmission } = await supabase
		.from('candidate_technical_submissions')
		.select('links')
		.eq('candidate_id', userId)
		.maybeSingle();

	return {
		candidateName: data.candidate?.full_name ?? session!.user.user_metadata?.full_name ?? null,
		email: session!.user.email,
		phases: data.phases,
		percent,
		completedCount,
		totalPhases: data.phases.length,
		currentPhase,
		progressReady: !data.progressError,
		schemaMissing: data.schemaMissing,
		progressError: data.progressError?.message ?? null,
		hasCandidateProfile: data.hasCandidateProfile,
		isFrozen: data.isFrozen,
		discAssessmentUrl,
		technicalChallengeUrl,
		technicalLinksDraft: technicalSubmission?.links ?? '',
		culturalCalendarUrl
	};
};

export const actions: Actions = {
	/** Arquivo enviado direto ao Storage no navegador; esta action só marca a fase como concluída. */
	completeDisc: async ({ locals: { supabase, session } }) => {
		const userId = session!.user.id;

		const dashboard = await loadDashboardData(supabase, userId);
		const discPhase = dashboard.phases.find((phase) => phase.key === 'disc');

		if (discPhase?.status !== 'current') {
			return fail(400, {
				discError: 'O Teste DISC ainda não está disponível para envio. Conclua a etapa anterior primeiro.'
			});
		}

		const storagePath = `${userId}/disc-mapeamento.pdf`;
		const { error: fileCheckError } = await supabase.storage.from('resumes').download(storagePath);

		if (fileCheckError) {
			return fail(400, {
				discError: 'Envie o PDF do mapeamento antes de concluir a fase.'
			});
		}

		const { error: completeError } = await completeCandidatePhase(
			supabase,
			userId,
			'disc' satisfies PhaseKey
		);

		if (completeError) {
			const policyBlocked = completeError.message.toLowerCase().includes('policy');
			return fail(500, {
				discError: policyBlocked
					? 'Permissão negada ao concluir a fase. Execute a política DISC no supabase/setup.sql.'
					: 'Não foi possível registrar a conclusão da fase. Tente novamente.'
			});
		}

		redirect(303, '/dashboard');
	},

	submitTechnical: async ({ request, locals: { supabase, session } }) => {
		const userId = session!.user.id;
		const formData = await request.formData();
		const linksRaw = formData.get('links')?.toString() ?? '';
		const linksStored = normalizeTechnicalSubmission(linksRaw);

		const dashboard = await loadDashboardData(supabase, userId);
		const technicalPhase = dashboard.phases.find((phase) => phase.key === 'technical');

		if (technicalPhase?.status !== 'current') {
			return fail(400, {
				technicalError:
					'O Desafio Técnico ainda não está disponível para envio. Conclua a etapa anterior primeiro.',
				technicalLinksDraft: linksRaw
			});
		}

		const submittedAt = new Date().toISOString();

		const { error: submissionError } = await supabase.from('candidate_technical_submissions').upsert(
			{
				candidate_id: userId,
				links: linksStored,
				submitted_at: submittedAt
			},
			{ onConflict: 'candidate_id' }
		);

		if (submissionError) {
			const lower = submissionError.message.toLowerCase();
			const schemaHint =
				lower.includes('does not exist') || lower.includes('relation')
					? ' Execute supabase/setup.sql no Supabase (tabela de entregas técnicas).'
					: '';
			return fail(500, {
				technicalError: `Não foi possível salvar os links.${schemaHint}`,
				technicalLinksDraft: linksRaw
			});
		}

		const { error: completeError } = await completeCandidatePhase(
			supabase,
			userId,
			'technical' satisfies PhaseKey
		);

		if (completeError) {
			const policyBlocked = completeError.message.toLowerCase().includes('policy');
			return fail(500, {
				technicalError: policyBlocked
					? 'Permissão negada ao concluir a fase. Execute a política do Desafio Técnico no supabase/setup.sql.'
					: 'Os links foram salvos, mas não foi possível concluir a fase. Tente novamente.',
				technicalLinksDraft: linksRaw
			});
		}

		redirect(303, '/dashboard');
	}
};
