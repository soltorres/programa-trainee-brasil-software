<script lang="ts">
	import CandidateProgressTimeline from '$lib/components/CandidateProgressTimeline.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const greetingName = $derived(data.candidateName ?? data.email ?? 'Explorador');
</script>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
	<header>
		<p class="text-xs font-semibold tracking-[0.2em] text-green-600 uppercase">Área do candidato</p>
		<h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Meu progresso</h1>
		<p class="mt-3 text-slate-600">
			Olá, <span class="font-medium text-slate-900">{greetingName}</span>. Acompanhe cada etapa do seu
			processo seletivo.
		</p>
	</header>

	{#if data.schemaMissing}
		<div
			class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950"
			role="alert"
		>
			<p class="font-semibold">Banco de dados ainda não configurado</p>
			<p class="mt-2 leading-relaxed">
				As tabelas do Supabase ainda não existem neste projeto. A timeline abaixo é uma prévia; para
				salvar seu progresso de forma individual:
			</p>
			<ol class="mt-3 list-decimal space-y-1.5 pl-5">
				<li>Abra o painel do Supabase → <strong>SQL Editor</strong></li>
				<li>Cole e execute o arquivo <code class="rounded bg-amber-100/80 px-1">supabase/setup.sql</code> do repositório</li>
				<li>Recarregue esta página</li>
			</ol>
		</div>
	{:else if !data.progressReady}
		<div
			class="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
			Não foi possível carregar seu progresso.
			{#if data.progressError}
				<span class="mt-1 block text-red-700/90">{data.progressError}</span>
			{/if}
		</div>
	{/if}

	{#if !data.hasCandidateProfile}
		<div class="mt-6 rounded-2xl border border-green-200/60 bg-green-50/80 px-4 py-3 text-sm text-green-900">
			Complete seu cadastro em
			<a href="/candidatar" class="font-semibold underline hover:text-green-800">Candidate-se</a>
			para concluir a primeira etapa.
		</div>
	{/if}

	{#if data.isFrozen}
		<div
			class="mt-8 rounded-2xl border border-slate-200/80 bg-white px-5 py-6 text-sm leading-relaxed text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
			role="status"
		>
			<p class="font-semibold text-slate-900">Processo seletivo em pausa</p>
			<p class="mt-2">
				Sua jornada no processo seletivo está temporariamente pausada pela equipe Brasil Software.
				Em breve entraremos em contato com os próximos passos.
			</p>
		</div>
	{:else}
	<div class="mt-8">
		<CandidateProgressTimeline
			phases={data.phases}
			percent={data.percent}
			discAssessmentUrl={data.discAssessmentUrl}
			discError={form?.discError}
			technicalChallengeUrl={data.technicalChallengeUrl}
			technicalError={form?.technicalError}
			technicalLinksDraft={form?.technicalLinksDraft ?? data.technicalLinksDraft}
			culturalCalendarUrl={data.culturalCalendarUrl}
		/>
	</div>

	{#if data.currentPhase}
		<p class="mt-6 text-center text-sm text-slate-500">
			Etapa atual:
			<span class="font-semibold text-slate-700">{data.currentPhase.label}</span>
			· {data.completedCount} de {data.totalPhases} fases concluídas
		</p>
	{/if}
	{/if}

	<a href="/" class="mt-8 inline-block text-sm font-semibold text-green-700 hover:underline">
		← Voltar à página inicial
	</a>
</div>
