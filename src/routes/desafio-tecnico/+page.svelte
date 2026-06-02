<script lang="ts">
	import LineIcon from '$lib/components/LineIcon.svelte';
	import TechnicalChallengeBlocks from '$lib/components/TechnicalChallengeBlocks.svelte';
	import { revealOnScroll } from '$lib/actions/revealOnScroll';
	import {
		technicalChallengeMeta,
		technicalChallengeSections,
		technicalDeliveryIntro,
		technicalDeliverySteps
	} from '$lib/content/technicalChallenge';

	const navItems = [
		...technicalChallengeSections.map((section) => ({ id: section.id, label: section.title })),
		{ id: 'como-entregar', label: 'Como Entregar' }
	];
</script>

<svelte:head>
	<title>Desafio Técnico — Programa de Trainee — Brasil Software</title>
	<meta
		name="description"
		content="Orientações completas do Desafio Técnico: sistema web de gerenciamento de tarefas — Programa de Trainee Brasil Software."
	/>
</svelte:head>

<div class="border-b border-slate-100 bg-gradient-to-b from-white to-[#f0fdf4]">
	<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<header class="max-w-3xl" use:revealOnScroll>
			<p class="text-xs font-semibold tracking-[0.2em] text-green-600 uppercase">
				{technicalChallengeMeta.eyebrow}
			</p>
			<h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
				{technicalChallengeMeta.title}
			</h1>
			<p
				class="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-white px-3 py-1 text-xs font-semibold text-green-800 shadow-sm"
			>
				<LineIcon name="code" class="h-3.5 w-3.5" strokeWidth={2} />
				{technicalChallengeMeta.track}
			</p>
			<div class="mt-6 space-y-4">
				{#each technicalChallengeMeta.intro as paragraph}
					<p class="text-base leading-relaxed text-slate-600">{paragraph}</p>
				{/each}
			</div>
		</header>
	</div>
</div>

<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
	<div class="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[14rem_minmax(0,1fr)]">
		<nav
			class="mb-10 lg:sticky lg:top-24 lg:mb-0 lg:self-start"
			aria-label="Índice do desafio"
			use:revealOnScroll={{ delay: 80 }}
		>
			<p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Nesta página</p>
			<ul class="mt-3 max-h-[70vh] space-y-1 overflow-y-auto pr-2 text-sm">
				{#each navItems as item}
					<li>
						<a
							href="#{item.id}"
							class="block rounded-lg px-2.5 py-1.5 text-slate-600 transition hover:bg-green-50 hover:text-green-800"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="min-w-0 space-y-8">
			{#each technicalChallengeSections as section, sectionIndex}
				<section
					id={section.id}
					class="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-8"
					use:revealOnScroll={{ delay: 60 + sectionIndex * 40 }}
				>
					<h2 class="text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem]">
						{section.title}
					</h2>

					<div class="mt-5">
						<TechnicalChallengeBlocks blocks={section.blocks} />
					</div>

					{#if section.subsections?.length}
						<div class="mt-8 space-y-6 border-t border-slate-100 pt-8">
							{#each section.subsections as subsection}
								<div>
									<h3 class="text-base font-semibold text-slate-900">{subsection.title}</h3>
									<div class="mt-3">
										<TechnicalChallengeBlocks blocks={subsection.blocks} />
									</div>
								</div>
							{/each}
						</div>
					{/if}

					{#if section.blocksAfter?.length}
						<div class="mt-6 border-t border-slate-100 pt-6">
							<TechnicalChallengeBlocks blocks={section.blocksAfter} />
						</div>
					{/if}
				</section>
			{/each}

			<section
				id="como-entregar"
				class="scroll-mt-24 rounded-2xl border border-green-200/60 bg-gradient-to-br from-white to-green-50/40 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-8"
				use:revealOnScroll={{ delay: 120 }}
			>
				<h2 class="text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem]">
					Como Entregar
				</h2>
				<p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
					{technicalDeliveryIntro}
				</p>

				<ol class="mt-8 space-y-4">
					{#each technicalDeliverySteps as step}
						<li
							class="flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
						>
							<span
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-sm font-bold text-white"
								aria-hidden="true"
							>
								{step.number}
							</span>
							<div class="min-w-0">
								<h3 class="text-base font-semibold text-slate-900">
									{step.title}
									{#if step.optional}
										<span
											class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase"
										>
											Opcional
										</span>
									{/if}
								</h3>
								<p class="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
							</div>
						</li>
					{/each}
				</ol>

				<p class="mt-8 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
					{technicalChallengeMeta.closing}
				</p>
			</section>

			<footer
				class="flex flex-wrap gap-4 border-t border-slate-200 pt-8"
				use:revealOnScroll={{ delay: 160 }}
			>
				<a
					href="/dashboard"
					class="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-100 transition hover:bg-green-700"
				>
					<LineIcon name="rocket" class="h-4 w-4" strokeWidth={2} />
					Enviar links no meu progresso
				</a>
				<a
					href="/"
					class="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-green-700"
				>
					← Voltar ao início
				</a>
			</footer>
		</div>
	</div>
</div>
