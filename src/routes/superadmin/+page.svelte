<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminPhaseForm from '$lib/components/admin/AdminPhaseForm.svelte';
	import type { AdminCandidateRow } from '$lib/admin/loadCandidates';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatDate(iso: string | null): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('pt-BR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function statusBadge(candidate: AdminCandidateRow) {
		if (candidate.profileIncomplete) {
			return { label: 'Cadastro incompleto', class: 'bg-amber-100 text-amber-900' };
		}
		if (candidate.isFrozen) {
			return { label: 'Congelado', class: 'bg-slate-200 text-slate-700' };
		}
		if (candidate.currentPhaseKey === 'concluido') {
			return { label: 'Concluído', class: 'bg-green-100 text-green-800' };
		}
		return { label: candidate.currentPhaseLabel, class: 'bg-blue-100 text-blue-800' };
	}

	const completeCount = $derived(
		data.configured ? data.candidates.filter((c) => !c.profileIncomplete).length : 0
	);
</script>

<svelte:head>
	<title>Superadmin — Programa de Trainee</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-[#f8fafc]">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
			<div>
				<p class="text-xs font-semibold tracking-[0.2em] text-green-600 uppercase">
					Brasil Software
				</p>
				<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
					Painel administrativo
				</h1>
				<p class="mt-2 text-sm text-slate-600">
					Candidatos, entregas e controle de fases do processo seletivo.
				</p>
			</div>
			<p class="text-sm font-medium text-slate-500">
				{#if data.configured}
					{data.candidates.length} no total
					<span class="text-slate-400">·</span>
					{completeCount} com perfil completo
					{#if data.incompleteCount > 0}
						<span class="text-slate-400">·</span>
						{data.incompleteCount} cadastro incompleto
					{/if}
				{:else}
					0 candidato(s)
				{/if}
			</p>
		</div>
	</header>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if data.successMessage}
			<div
				class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900"
				role="status"
			>
				{data.successMessage}
			</div>
		{/if}

		{#if form?.adminError}
			<div
				class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
				role="alert"
			>
				{form.adminError}
			</div>
		{/if}

		{#if !data.configured}
			<div
				class="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950"
				role="alert"
			>
				<p class="font-semibold">Service role não configurada</p>
				<p class="mt-2 leading-relaxed">
					No arquivo <code class="rounded bg-amber-100/80 px-1">.env</code> na raiz do projeto, preencha
					<code class="rounded bg-amber-100/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> com a chave
					<strong>service_role</strong> (Supabase → Project Settings → API → service_role → Reveal).
					Depois pare e rode de novo <code class="rounded bg-amber-100/80 px-1">npm run dev</code>.
				</p>
				<p class="mt-2 text-xs text-amber-900/80">
					A linha já existe no seu <code class="rounded bg-amber-100/80 px-1">.env</code>; falta colar o
					valor secreto após o <code class="rounded bg-amber-100/80 px-1">=</code>.
				</p>
			</div>
		{:else if data.loadError}
			<div
				class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
				role="alert"
			>
				{data.loadError}
			</div>
		{:else}
			{#if data.warning}
				<p class="mb-4 text-sm text-amber-800">{data.warning}</p>
			{/if}

			{#if data.candidates.length === 0}
				<div
					class="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center text-sm text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
				>
					Nenhum candidato cadastrado ainda.
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.candidates as candidate (candidate.id)}
						{@const badge = statusBadge(candidate)}
						<article
							class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
						>
							<details class="group">
								<summary
									class="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-4 sm:px-6 [&::-webkit-details-marker]:hidden"
								>
									<span
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600"
										aria-hidden="true"
									>
										{candidate.fullName.charAt(0).toUpperCase()}
									</span>
									<div class="min-w-0 flex-1">
										<p class="font-semibold text-slate-900">{candidate.fullName}</p>
										<p class="truncate text-sm text-slate-500">
											{candidate.email ?? 'E-mail não disponível'}
										</p>
									</div>
									<span
										class="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase {badge.class}"
									>
										{badge.label}
									</span>
									<span class="text-slate-400 transition group-open:rotate-180" aria-hidden="true"
										>▼</span
									>
								</summary>

								<div class="border-t border-slate-100 px-4 py-5 sm:px-6">
									<div class="grid gap-6 lg:grid-cols-2">
										<div>
											<h3 class="text-xs font-semibold tracking-wide text-slate-500 uppercase">
												Dados do candidato
											</h3>
											<dl class="mt-3 space-y-2 text-sm">
												<div class="flex gap-2">
													<dt class="w-28 shrink-0 text-slate-500">Formação</dt>
													<dd class="text-slate-800">{candidate.educationLevel}</dd>
												</div>
												<div class="flex gap-2">
													<dt class="w-28 shrink-0 text-slate-500">Nascimento</dt>
													<dd class="text-slate-800">
														{#if candidate.birthDate}
															{new Date(candidate.birthDate + 'T12:00:00').toLocaleDateString(
																'pt-BR'
															)}
														{:else}
															—
														{/if}
													</dd>
												</div>
												<div class="flex gap-2">
													<dt class="w-28 shrink-0 text-slate-500">Cadastro</dt>
													<dd class="text-slate-800">{formatDate(candidate.createdAt)}</dd>
												</div>
											</dl>

											<h3
												class="mt-6 text-xs font-semibold tracking-wide text-slate-500 uppercase"
											>
												Arquivos e entregas
											</h3>
											<ul class="mt-3 space-y-2 text-sm">
												<li>
													{#if candidate.resumeSignedUrl}
														<a
															href={candidate.resumeSignedUrl}
															target="_blank"
															rel="noopener noreferrer"
															class="font-medium text-green-700 underline hover:text-green-800"
														>
															Currículo (PDF)
														</a>
													{:else}
														<span class="text-slate-500">Currículo indisponível</span>
													{/if}
												</li>
												<li>
													{#if candidate.discSignedUrl}
														<a
															href={candidate.discSignedUrl}
															target="_blank"
															rel="noopener noreferrer"
															class="font-medium text-green-700 underline hover:text-green-800"
														>
															Mapeamento DISC (PDF)
														</a>
													{:else}
														<span class="text-slate-500">DISC não enviado</span>
													{/if}
												</li>
												<li class="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
													<p class="text-xs font-semibold text-slate-600">
														Desafio técnico
														{#if candidate.technicalSubmission}
															<span class="font-normal text-slate-400">
																· {formatDate(candidate.technicalSubmission.submittedAt)}
															</span>
														{/if}
													</p>
													{#if candidate.technicalSubmission?.links}
														<pre
															class="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700">{candidate.technicalSubmission.links}</pre>
													{:else}
														<p class="mt-1 text-xs text-slate-500">Sem envio registrado.</p>
													{/if}
												</li>
											</ul>
										</div>

										<div>
											<h3 class="text-xs font-semibold tracking-wide text-slate-500 uppercase">
												Fases do processo
											</h3>
											<ul class="mt-3 space-y-1.5">
												{#each candidate.phases as phase}
													<li
														class="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm {phase.completedAt
															? 'bg-green-50/80 text-green-900'
															: 'text-slate-600'}"
													>
														<span>{phase.label}</span>
														<span class="text-xs text-slate-500">
															{phase.completedAt ? '✓' : '—'}
														</span>
													</li>
												{/each}
											</ul>

											{#if candidate.profileIncomplete}
												<p class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
													Esta pessoa criou conta, mas não concluiu o formulário em
													<code class="rounded bg-amber-100/80 px-1">/candidatar</code> (currículo e
													dados). Peça para tentar novamente ou fazer login e completar o cadastro.
												</p>
											{:else}
												<div class="mt-6 space-y-4">
													<AdminPhaseForm
														{candidate}
														phaseOptions={data.phaseOptions}
													/>

													<div class="flex flex-wrap gap-2">
														{#if candidate.isFrozen}
															<form method="POST" action="/superadmin?/unfreeze" use:enhance>
																<input
																	type="hidden"
																	name="candidateId"
																	value={candidate.id}
																/>
																<button
																	type="submit"
																	class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-green-500"
																>
																	Descongelar
																</button>
															</form>
														{:else}
															<form method="POST" action="/superadmin?/freeze" use:enhance>
																<input
																	type="hidden"
																	name="candidateId"
																	value={candidate.id}
																/>
																<button
																	type="submit"
																	class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-400"
																>
																	Congelar candidato
																</button>
															</form>
														{/if}
													</div>

													<form method="POST" action="/superadmin?/updateNotes" use:enhance>
														<input type="hidden" name="candidateId" value={candidate.id} />
														<label
															for="notes-{candidate.id}"
															class="block text-xs font-semibold text-slate-700"
														>
															Anotações internas
														</label>
														<textarea
															id="notes-{candidate.id}"
															name="notes"
															rows="3"
															class="mt-1 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
															placeholder="Visível apenas neste painel…"
														>{candidate.adminNotes}</textarea>
														<button
															type="submit"
															class="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
														>
															Salvar anotação
														</button>
													</form>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</details>
						</article>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
