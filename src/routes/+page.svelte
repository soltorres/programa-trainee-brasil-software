<script lang="ts">
	import SelectionJourneyMap from '$lib/components/SelectionJourneyMap.svelte';
	import LineIcon, { type IconName } from '$lib/components/LineIcon.svelte';
	import { revealOnScroll } from '$lib/actions/revealOnScroll';

	const skills: { icon: IconName; title: string; description: string }[] = [
		{
			icon: 'target',
			title: 'Visão de Produto',
			description: 'Aprenda a entender problemas, clientes e geração de valor.'
		},
		{
			icon: 'cog',
			title: 'Conhecimento Operacional',
			description: 'Compreenda como o sistema impacta clientes e empresas.'
		},
		{
			icon: 'search',
			title: 'Mentalidade de Qualidade',
			description: 'Aprenda a validar, testar e melhorar soluções.'
		},
		{
			icon: 'chart',
			title: 'Pensamento Analítico',
			description: 'Transforme dados e informações em decisões.'
		},
		{
			icon: 'users',
			title: 'Colaboração',
			description: 'Aprenda a trabalhar com diferentes áreas.'
		},
		{
			icon: 'rocket',
			title: 'Crescimento Profissional',
			description: 'Desenvolva competências valorizadas pelo mercado.'
		}
	];

	const selectionPath: { icon: IconName; label: string; hint: string }[] = [
		{ icon: 'pencil', label: 'Cadastro', hint: 'Primeiro passo da jornada' },
		{ icon: 'sparkles', label: 'Teste DISC', hint: 'Mapeamento comportamental' },
		{ icon: 'code', label: 'Desafio Técnico', hint: 'Demonstre seu potencial' },
		{ icon: 'users', label: 'Fit Cultural', hint: 'Alinhamento com nossos valores' },
		{ icon: 'document', label: 'Conexão Legal', hint: 'Assinatura dos termos de estágio' },
		{ icon: 'rocket', label: 'Onboarding', hint: 'Bem-vindo à jornada Brasil Software' }
	];

	const journeyRhythm: {
		icon: IconName;
		title: string;
		items: string[];
		isCycle?: boolean;
	}[] = [
		{
			icon: 'building',
			title: 'Encontros presenciais',
			items: ['Integração', 'Planejamento', 'Mentorias', 'Troca de experiências']
		},
		{
			icon: 'desktop',
			title: 'Momentos remotos',
			items: ['Execução', 'Desenvolvimento', 'Autonomia', 'Evolução contínua']
		},
		{
			icon: 'refresh',
			title: 'Repetição do ciclo',
			items: ['Aprender', 'Executar', 'Compartilhar'],
			isCycle: true
		}
	];

	const rewards: { icon: IconName; label: string }[] = [
		{ icon: 'banknotes', label: 'Bolsa Auxílio de R$ 700,00' },
		{ icon: 'truck', label: 'Auxílio Transporte' },
		{ icon: 'academic-cap', label: 'Mentoria' },
		{ icon: 'chart', label: 'Possibilidade de Crescimento' }
	];

	const explorerYes = [
		'É curioso e gosta de aprender',
		'Faz perguntas antes de aceitar respostas',
		'Gosta de resolver problemas',
		'Quer entender como as coisas funcionam',
		'Tem interesse por tecnologia e negócios',
		'Busca crescimento profissional'
	] as const;

	const explorerNo = [
		'Busca apenas uma renda temporária',
		'Prefere atividades repetitivas',
		'Não gosta de desafios',
		'Não tem interesse em aprender continuamente',
		'Busca apenas executar tarefas',
		'Prefere trabalhar isoladamente'
	] as const;
</script>

<svelte:head>
	<title>Programa de Trainee — Brasil Software</title>
	<meta
		name="description"
		content="Inicie sua jornada de desenvolvimento profissional na Brasil Software. Aprenda, evolua e construa sua carreira."
	/>
</svelte:head>

<div class="relative">
	<!-- 1 — Sua missão começa agora -->
	<section class="relative overflow-hidden bg-gradient-to-b from-white to-[#f0fdf4] py-16 sm:py-20 lg:py-24">
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.5]"
			aria-hidden="true"
			style="background-image: radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0); background-size: 32px 32px; mask-image: linear-gradient(to bottom, black, transparent);"
		></div>

		<div
			class="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8"
		>
			<div class="text-left">
				<span
					class="motion-enter motion-delay-0 inline-flex items-center rounded-full border border-green-200/60 bg-green-50 px-3 py-1 text-xs font-semibold tracking-wider text-green-700 uppercase"
				>
					Processo Seletivo 2026
				</span>
				<h1
					class="motion-enter motion-delay-1 mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
				>
					Sua missão começa agora.
				</h1>
				<p class="motion-enter motion-delay-2 mt-5 text-lg leading-relaxed text-slate-600">
					Durante esta jornada você irá atravessar Produto e Operações para desenvolver uma visão
					completa do negócio e construir as competências que formarão os futuros líderes da Brasil
					Software.
				</p>
				<p class="motion-enter motion-delay-3 mt-4 text-base leading-relaxed text-slate-500">
					Mais do que um estágio, esta é uma experiência prática para quem deseja aprender, crescer e
					gerar impacto real.
				</p>

				<div class="motion-enter motion-delay-4 mt-8 flex flex-wrap gap-3">
					<a
						href="/login"
						class="btn-journey inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-100 hover:bg-green-700"
					>
						<LineIcon name="rocket" class="h-4 w-4" strokeWidth={2} />
						Iniciar Minha Jornada
					</a>
					<a
						href="#como-acontece"
						class="btn-journey inline-flex items-center gap-2 rounded-xl border border-green-600 bg-transparent px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50/50"
					>
						<LineIcon name="map" class="h-4 w-4 text-green-700" strokeWidth={2} />
						Explorar o Mapa
					</a>
				</div>

				<!-- Ficha técnica em linha -->
				<div class="motion-enter motion-delay-5 mt-8 flex flex-wrap gap-2.5">
					<span
						class="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-green-500"
					>
						<LineIcon name="refresh" class="h-4 w-4 text-slate-500" />
						6h por dia
					</span>
					<span
						class="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-green-500"
					>
						<LineIcon name="building" class="h-4 w-4 text-slate-500" />
						Modelo Híbrido
					</span>
					<span
						class="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-green-500"
					>
						<LineIcon name="banknotes" class="h-4 w-4 text-slate-500" />
						Bolsa R$ 700,00 + VT
					</span>
				</div>
			</div>

			<div id="mapa-jornada" class="scroll-mt-28 overflow-visible p-1 sm:p-2">
				<SelectionJourneyMap stops={selectionPath} />
			</div>
		</div>
	</section>

	<!-- 2 — Como acontece a jornada -->
	<section
		id="como-acontece"
		class="scroll-mt-28 border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24"
	>
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center" use:revealOnScroll>
				<p class="text-xs font-semibold tracking-[0.2em] text-green-600 uppercase">
					Ritmo da expedição
				</p>
				<h2 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
					Como acontece a jornada
				</h2>
				<p class="mt-4 text-base leading-relaxed text-slate-600">
					Uma rotina desenhada para equilibrar aprendizado, colaboração e autonomia.
				</p>
			</div>

			<div class="relative mt-14 lg:mt-16">
				<div
					class="pointer-events-none absolute top-7 right-[12%] left-[12%] hidden h-px bg-slate-200 lg:block"
					aria-hidden="true"
				></div>

				<ol
					class="mx-auto flex max-w-4xl flex-col items-stretch gap-0 lg:max-w-none lg:flex-row lg:items-start lg:justify-center"
				>
					{#each journeyRhythm as phase, i}
						{#if i > 0}
							<li
								class="flex shrink-0 items-center justify-center py-5 text-slate-300 lg:w-14 lg:py-0 lg:pt-7"
								aria-hidden="true"
							>
								<span class="lg:hidden">↓</span>
								<span class="hidden text-lg lg:inline">→</span>
							</li>
						{/if}

						<li
							class="flex flex-1 flex-col items-center text-center lg:max-w-[11.5rem] xl:max-w-xs"
							use:revealOnScroll={{ delay: i * 120 }}
						>
							<div class="relative z-10 flex flex-col items-center">
								<span
									class="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform duration-300 hover:scale-105 hover:text-green-600"
								>
									<LineIcon name={phase.icon} class="h-6 w-6" />
								</span>
								<h3
									class="mt-4 bg-gradient-to-r from-green-700 via-emerald-600 to-cyan-600 bg-clip-text text-base font-bold tracking-tight text-transparent"
								>
									{phase.title}
								</h3>
							</div>

							{#if phase.isCycle}
								<div class="mt-6 w-full">
									<ul
										class="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm text-slate-600"
									>
										{#each phase.items as step, j}
											<li class="inline-flex items-center gap-1.5">
												<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true"
												></span>
												<span class="font-medium text-slate-700">{step}</span>
												{#if j < phase.items.length - 1}
													<span class="text-slate-300" aria-hidden="true">→</span>
												{/if}
											</li>
										{/each}
									</ul>
									<p class="mt-4 text-xs text-slate-400">↻ ciclo contínuo</p>
								</div>
							{:else}
								<ul class="mt-6 w-full space-y-2.5 text-left">
									{#each phase.items as item}
										<li
											class="mx-auto flex max-w-[12rem] items-start gap-2.5 text-sm leading-relaxed text-slate-600"
										>
											<span
												class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
												aria-hidden="true"
											></span>
											{item}
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</section>

	<!-- 3 — Habilidades Desbloqueadas -->
	<section id="habilidades" class="scroll-mt-28 border-t border-slate-100 py-16 sm:py-20 lg:py-24">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center" use:revealOnScroll>
				<h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
					Habilidades Desbloqueadas
				</h2>
				<p class="mt-3 text-slate-600">
					Cada etapa da jornada revela competências que você levará para o resto da carreira.
				</p>
			</div>

			<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each skills as skill, i}
					<article
						class="card-journey group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-green-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
						use:revealOnScroll={{ delay: i * 80 }}
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 shadow-sm"
							>
								<LineIcon name={skill.icon} class="h-5 w-5" />
							</div>
							<h3
								class="min-w-0 bg-gradient-to-r from-green-700 via-emerald-600 to-cyan-600 bg-clip-text text-base font-bold leading-snug tracking-tight text-transparent sm:text-lg"
							>
								{skill.title}
							</h3>
						</div>
						<p class="mt-3 text-sm leading-relaxed text-slate-600">{skill.description}</p>
						<div class="mt-4 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
							<div
								class="h-full rounded-full bg-green-600 shadow-[0_2px_12px_rgba(22,163,74,0.3)] transition-all duration-500 group-hover:w-full"
								style="width: {55 + i * 7}%"
							></div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- 4 — O que oferecemos -->
	<section
		id="recompensas"
		class="scroll-mt-28 border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24"
	>
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center" use:revealOnScroll>
				<h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">O que oferecemos</h2>
				<p class="mt-3 text-slate-600">Recompensas da jornada — além do aprendizado.</p>
			</div>

			<div
				class="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:gap-5 lg:max-w-5xl lg:grid-cols-4"
			>
				{#each rewards as reward, i}
					<article
						class="card-journey flex aspect-square flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-green-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
						use:revealOnScroll={{ delay: i * 70 }}
					>
						<span
							class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 shadow-sm"
						>
							<LineIcon name={reward.icon} class="h-5 w-5" />
						</span>
						<p class="mt-3 text-sm font-semibold leading-snug text-journey-graphite sm:text-base">
							{reward.label}
						</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- 5 — Você possui o perfil do explorador? -->
	<section
		id="checkpoint-explorador"
		class="scroll-mt-28 overflow-hidden border-y border-slate-700/50 bg-gradient-to-r from-[#1a1a1a] via-journey-graphite to-[#333333] pt-16 pb-0 sm:pt-20 lg:pt-24"
	>
		<div class="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
			<div class="mx-auto max-w-3xl" use:revealOnScroll>
				<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Você possui o perfil do explorador?
				</h2>
				<p class="mt-4 text-base leading-relaxed text-slate-200">
					Antes de iniciar sua jornada, vale a pena refletir se este desafio combina com você.
				</p>
			</div>

			<div class="mt-14 grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-slate-600/50">
				<div class="md:pr-10 lg:pr-14" use:revealOnScroll={{ delay: 100, fadeOnly: true }}>
					<h3
						class="flex items-center gap-2 text-base font-semibold tracking-tight text-white"
					>
						<span
							class="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-emerald-300"
						>
							<LineIcon name="check" class="h-3.5 w-3.5" strokeWidth={2} />
						</span>
						Você provavelmente vai gostar desta experiência
					</h3>
					<ul class="mt-6 space-y-3.5">
						{#each explorerYes as item}
							<li class="flex items-start gap-3 leading-relaxed">
								<LineIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" strokeWidth={2} />
								<span class="explorer-item-text">{item}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="md:pl-10 lg:pl-14" use:revealOnScroll={{ delay: 200, fadeOnly: true }}>
					<h3
						class="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-50"
					>
						<span
							class="flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 bg-slate-700/60 text-slate-200"
						>
							<LineIcon name="alert" class="h-3.5 w-3.5" strokeWidth={2} />
						</span>
						Talvez esta não seja a melhor jornada para você
					</h3>
					<ul class="mt-6 space-y-3.5">
						{#each explorerNo as item}
							<li class="flex items-start gap-3 leading-relaxed">
								<span
									class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
									aria-hidden="true"
								></span>
								<span class="explorer-item-text">{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div
			class="border-t border-green-500/30 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-4 py-5 sm:px-6 sm:py-6"
			use:revealOnScroll={{ delay: 280 }}
		>
			<p class="mx-auto max-w-3xl text-center text-sm font-semibold leading-relaxed text-white sm:text-base">
				Se você se identificou com a maior parte dos itens da esquerda, provavelmente está no lugar
				certo.
			</p>
		</div>
	</section>

	<!-- 6 — Pronto para iniciar sua jornada? -->
	<section class="border-t border-slate-100 bg-gradient-to-b from-[#f0fdf4] to-white py-16 sm:py-20 lg:py-24">
		<div
			class="mx-auto max-w-3xl rounded-3xl border border-green-200/60 bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:px-10"
			use:revealOnScroll
		>
			<h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
				Pronto para iniciar sua jornada?
			</h2>
			<p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
				Estamos procurando pessoas curiosas, comprometidas e dispostas a construir o futuro junto com
				a Brasil Software.
			</p>
			<div class="mt-10 flex flex-wrap justify-center gap-4">
				<a
					href="/login"
					class="btn-journey inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-green-100 hover:bg-green-700"
				>
					<LineIcon name="rocket" class="h-4 w-4" strokeWidth={2} />
					Quero Participar
				</a>
				<a
					href="/dashboard"
					class="btn-journey inline-flex items-center gap-2 rounded-xl border border-green-600 bg-transparent px-7 py-3.5 text-sm font-semibold text-green-700 hover:bg-green-50/50"
				>
					<LineIcon name="document" class="h-4 w-4 text-green-700" strokeWidth={2} />
					Ver Meu Progresso
				</a>
			</div>
		</div>
	</section>
</div>
