import type { IconName } from '$lib/components/LineIcon.svelte';

export const SELECTION_PHASES = [
	{
		key: 'cadastro',
		label: 'Cadastro',
		hint: 'Primeiro passo da jornada',
		icon: 'pencil' satisfies IconName,
		sortOrder: 0
	},
	{
		key: 'disc',
		label: 'Teste DISC',
		hint: 'Mapeamento comportamental',
		icon: 'sparkles' satisfies IconName,
		sortOrder: 1
	},
	{
		key: 'technical',
		label: 'Desafio Técnico',
		hint: 'Demonstre seu potencial',
		icon: 'code' satisfies IconName,
		sortOrder: 2
	},
	{
		key: 'cultural',
		label: 'Fit Cultural',
		hint: 'Alinhamento com nossos valores',
		icon: 'users' satisfies IconName,
		sortOrder: 3
	},
	{
		key: 'legal',
		label: 'Conexão Legal',
		hint: 'Assinatura dos termos de estágio',
		icon: 'document' satisfies IconName,
		sortOrder: 4
	},
	{
		key: 'onboarding',
		label: 'Onboarding',
		hint: 'Bem-vindo à jornada Brasil Software',
		icon: 'rocket' satisfies IconName,
		sortOrder: 5
	}
] as const;

export type PhaseKey = (typeof SELECTION_PHASES)[number]['key'];

export type PhaseDisplayStatus = 'locked' | 'current' | 'completed';

export type PhaseProgressRow = {
	phase_key: string;
	completed_at: string | null;
	sort_order: number;
};

export type PhaseTimelineItem = (typeof SELECTION_PHASES)[number] & {
	status: PhaseDisplayStatus;
	completedAt: string | null;
};

export function buildPhaseTimeline(
	progressRows: PhaseProgressRow[],
	hasCandidateProfile: boolean
): PhaseTimelineItem[] {
	const progressByKey = new Map(progressRows.map((row) => [row.phase_key, row]));

	const completedFlags = SELECTION_PHASES.map((phase) => {
		if (phase.key === 'cadastro' && hasCandidateProfile) return true;
		return Boolean(progressByKey.get(phase.key)?.completed_at);
	});

	return SELECTION_PHASES.map((phase, index) => {
		const completed = completedFlags[index];
		const previousCompleted = index === 0 ? true : completedFlags[index - 1];
		const row = progressByKey.get(phase.key);

		let status: PhaseDisplayStatus;
		if (completed) {
			status = 'completed';
		} else if (previousCompleted) {
			status = 'current';
		} else {
			status = 'locked';
		}

		return {
			...phase,
			status,
			completedAt: row?.completed_at ?? (phase.key === 'cadastro' && hasCandidateProfile ? new Date().toISOString() : null)
		};
	});
}

export function progressPercent(phases: PhaseTimelineItem[]): number {
	const completed = phases.filter((phase) => phase.status === 'completed').length;
	return Math.round((completed / phases.length) * 100);
}
