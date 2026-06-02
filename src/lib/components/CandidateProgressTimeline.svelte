<script lang="ts">
	import { animateProgress } from '$lib/actions/animateProgress';
	import DiscPhasePanel from '$lib/components/DiscPhasePanel.svelte';
	import CulturalPhasePanel from '$lib/components/CulturalPhasePanel.svelte';
	import TechnicalPhasePanel from '$lib/components/TechnicalPhasePanel.svelte';
	import LineIcon from '$lib/components/LineIcon.svelte';
	import type { PhaseTimelineItem } from '$lib/selectionPhases';

	let {
		phases,
		percent,
		discAssessmentUrl,
		discError = null,
		technicalChallengeUrl,
		technicalError = null,
		technicalLinksDraft = '',
		culturalCalendarUrl
	}: {
		phases: PhaseTimelineItem[];
		percent: number;
		discAssessmentUrl: string;
		discError?: string | null;
		technicalChallengeUrl: string;
		technicalError?: string | null;
		technicalLinksDraft?: string;
		culturalCalendarUrl: string;
	} = $props();

	const statusLabel = {
		completed: 'Concluída',
		current: 'Desbloqueado',
		locked: 'Bloqueada'
	} as const;
</script>

<div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-8">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-xs font-semibold tracking-[0.2em] text-green-600 uppercase">Sua jornada</p>
			<h2 class="mt-1 text-lg font-bold text-slate-900">Processo seletivo</h2>
		</div>
		<p class="text-sm font-semibold text-slate-600">
			<span class="text-2xl font-bold text-green-700">{percent}%</span>
			concluído
		</p>
	</div>

	<div class="mt-6" use:animateProgress={percent}>
		<div
			class="h-2.5 overflow-hidden rounded-full bg-slate-100"
			role="progressbar"
			aria-valuenow={percent}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Progresso no processo seletivo"
		>
			<div
				data-progress-fill
				class="progress-fill h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500 shadow-[0_2px_12px_rgba(22,163,74,0.35)]"
				style="width: 0%"
			></div>
		</div>
	</div>

	<ol class="relative mt-10 space-y-0">
		{#each phases as phase, index}
			<li class="relative flex gap-4 pb-10 last:pb-0">
				{#if index < phases.length - 1}
					<span
						class="absolute top-10 left-[1.125rem] h-[calc(100%-1.5rem)] w-px -translate-x-1/2 {phase.status ===
						'completed'
							? 'bg-green-400'
							: 'bg-slate-200'}"
						aria-hidden="true"
					></span>
				{/if}

				<div class="relative z-10 shrink-0">
					<span
						class="flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors {phase.status ===
						'completed'
							? 'border-green-600 bg-green-600 text-white'
							: phase.status === 'current'
								? 'border-blue-500 bg-white text-blue-700 ring-4 ring-blue-500/15'
								: 'border-slate-200 bg-slate-50 text-slate-400'}"
					>
						{#if phase.status === 'completed'}
							<LineIcon name="check" class="h-4 w-4" strokeWidth={2.5} />
						{:else}
							{index + 1}
						{/if}
					</span>
				</div>

				<div class="min-w-0 flex-1 pt-0.5">
					<div class="flex flex-wrap items-center gap-2">
						<span
							class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 {phase.status ===
							'current'
								? 'text-blue-600'
								: ''} {phase.status === 'locked' ? 'opacity-50' : ''}"
						>
							<LineIcon name={phase.icon} class="h-4 w-4" strokeWidth={2} />
						</span>
						<h3
							class="text-base font-semibold tracking-tight {phase.status === 'locked'
								? 'text-slate-400'
								: 'text-slate-900'}"
						>
							{phase.label}
						</h3>
						<span
							class="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase {phase.status ===
							'completed'
								? 'bg-green-50 text-green-700'
								: phase.status === 'current'
									? 'bg-blue-100 text-blue-800'
									: 'bg-slate-100 text-slate-500'}"
						>
							{statusLabel[phase.status]}
						</span>
					</div>
					<p
						class="mt-1.5 text-sm leading-relaxed {phase.status === 'locked'
							? 'text-slate-400'
							: 'text-slate-600'}"
					>
						{phase.hint}
					</p>
					{#if phase.status === 'locked'}
						<p class="mt-2 text-xs text-slate-400">
							Conclua a etapa anterior para desbloquear esta fase.
						</p>
					{:else if phase.status === 'current' && phase.key === 'disc'}
						<DiscPhasePanel assessmentUrl={discAssessmentUrl} error={discError} />
					{:else if phase.status === 'current' && phase.key === 'technical'}
						<TechnicalPhasePanel
							challengeUrl={technicalChallengeUrl}
							error={technicalError}
							initialLinks={technicalLinksDraft}
						/>
					{:else if phase.status === 'current' && phase.key === 'cultural'}
						<CulturalPhasePanel calendarUrl={culturalCalendarUrl} />
					{:else if phase.status === 'current'}
						<p class="mt-2 text-xs font-medium text-blue-700">
							Esta fase está desbloqueada. Aguarde as orientações da equipe Brasil Software.
						</p>
					{:else if phase.completedAt}
						<p class="mt-2 text-xs text-slate-500">
							Concluída em {new Date(phase.completedAt).toLocaleDateString('pt-BR', {
								day: '2-digit',
								month: 'short',
								year: 'numeric'
							})}
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</div>
