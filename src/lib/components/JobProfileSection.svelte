<script lang="ts">
	const missionItems = [
		'Vivenciar o fluxo completo da operação através da nossa Jornada 360° (Produto, Qualidade, Desenvolvimento e Suporte);',
		'Apoiar na gestão e priorização do backlog de produto, conectando as necessidades reais dos clientes ao código;',
		'Participar ativamente de processos de product discovery e validação de soluções com usuários finais;',
		'Colaborar de forma estreita com os times de engenharia e design no dia a dia do desenvolvimento;',
		'Ser preparado para, gradativamente, assumir rituais de liderança, acompanhamento de metas, indicadores e desenvolvimento de pessoas na squad;',
		'Contribuir diretamente para a evolução e agilidade dos processos internos da Brasil Software.'
	] as const;

	const requirements = [
		'Residir em Feira de Santana ou região e ter disponibilidade para participar da nossa rotina híbrida e encontros presenciais;',
		'Formação (ou cursando) em Engenharia de Software, Ciência da Computação, Sistemas de Informação, Análise e Desenvolvimento de Sistemas ou áreas correlatas;',
		'Base teórica ou prática em metodologias ágeis e lógica de desenvolvimento de software;',
		'Perfil "hands-on" (mão na massa), demonstrando forte proatividade e adaptabilidade;',
		'Excelente habilidade de comunicação, empatia para ouvir clientes e capacidade de trabalhar em equipe;',
		'Mentalidade analítica e interesse em usar dados para resolver problemas de negócio.'
	] as const;

	const competitiveAdvantages = [
		'Conhecimento prévio ou vivência em empresas de tecnologia (modelo SaaS);',
		'Noções de Qualidade de Software, testes ou processos de homologação;',
		'Participação anterior em projetos acadêmicos, diretórios acadêmicos, empresas juniores ou liderança de equipes de estudos.'
	] as const;

	const goodFit = [
		'Deseja se tornar um profissional completo que entende tanto de tecnologia quanto de estratégia de negócio;',
		'Gosta de atuar próximo da execução, entendendo o impacto real do produto na vida do cliente;',
		'Sente-se confortável em ambientes com autonomia e quer acelerar sua curva de aprendizado.'
	] as const;

	const notFit = [
		'Busca uma posição puramente teórica ou estritamente voltada a código isolado, sem contato com o negócio;',
		'Prefere atuar em ambientes rigidamente estruturados e sem espaço para propor inovações;',
		'Não tem interesse em desenvolver habilidades de liderança de pessoas ou gestão de processos no futuro.'
	] as const;
</script>

<section class="bg-slate-50 py-16 sm:py-24" id="perfil">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl">
			<p class="text-sm font-semibold tracking-[0.2em] text-brand-green-dark uppercase">
				Vaga Trainee
			</p>
			<h2 class="mt-2 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
				Perfil e Requisitos da Vaga
			</h2>
			<p class="mt-4 text-lg text-slate-600">
				Conheça o perfil que a Brasil Software busca e descubra se essa jornada combina com você.
			</p>
		</div>

		<!-- Intro -->
		<div class="mt-12 grid gap-6 lg:grid-cols-2">
			<article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<div class="flex items-start gap-4">
					<span
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green text-brand-navy"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</span>
					<div>
						<h3 class="text-lg font-semibold text-brand-navy">O que buscamos?</h3>
						<p class="mt-3 text-sm leading-relaxed text-slate-600">
							Buscamos talentos com alto potencial de crescimento para se tornarem os futuros líderes
							das nossas squads de produto. Essa posição combina o desenvolvimento de uma sólida base
							técnica com a preparação para liderança de pessoas e processos. É a oportunidade ideal
							para quem deseja atuar de forma "mão na massa" e próxima das áreas de Engenharia,
							Qualidade, Produto e Suporte, garantindo entregas de valor e a evolução contínua das
							nossas soluções em um ambiente dinâmico e em crescimento.
						</p>
					</div>
				</div>
			</article>

			<article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<div class="flex items-start gap-4">
					<span
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-yellow"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</span>
					<div>
						<h3 class="text-lg font-semibold text-brand-navy">No que acreditamos?</h3>
						<p class="mt-3 text-sm leading-relaxed text-slate-600">
							Acreditamos em um ambiente transformador, colaborativo e focado em resultados.
							Valorizamos a comunicação transparente, a cultura de feedbacks, a autogestão e o
							protagonismo. Se você quer autonomia para propor melhorias e deseja acelerar sua
							maturidade profissional de ponta a ponta na tecnologia, seu lugar é aqui.
						</p>
					</div>
				</div>
			</article>
		</div>

		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			<article class="rounded-2xl border border-brand-green/30 bg-white p-6 shadow-sm sm:p-8">
				<h3 class="text-lg font-semibold text-brand-navy">
					O que você vai desenvolver e realizar conosco
					<span class="font-normal text-slate-500">(Sua Missão)</span>
				</h3>
				<ul class="mt-5 space-y-3">
					{#each missionItems as item}
						<li class="flex gap-3 text-sm leading-relaxed text-slate-600">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true"></span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>

			<article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<h3 class="text-lg font-semibold text-brand-navy">Para decolar com a gente, você precisa:</h3>
				<ul class="mt-5 space-y-3">
					{#each requirements as item}
						<li class="flex gap-3 text-sm leading-relaxed text-slate-600">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true"></span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>
		</div>

		<article class="mt-6 rounded-2xl border border-brand-yellow-muted bg-brand-yellow/40 p-6 shadow-sm sm:p-8">
			<h3 class="text-lg font-semibold text-brand-navy">Sao diferenciais competitivos</h3>
			<ul class="mt-5 grid gap-4 md:grid-cols-3">
				{#each competitiveAdvantages as item}
					<li class="rounded-xl border border-brand-navy/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
						{item}
					</li>
				{/each}
			</ul>
		</article>

		<!-- Fit -->
		<div class="mt-6 grid gap-6 md:grid-cols-2">
			<article
				class="rounded-2xl border-2 border-brand-green/40 bg-white p-6 shadow-sm sm:p-8"
			>
				<div class="flex items-center gap-3">
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-brand-navy"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</span>
					<h3 class="text-lg font-semibold text-brand-navy">Essa jornada é para você se:</h3>
				</div>
				<ul class="mt-5 space-y-3">
					{#each goodFit as item}
						<li class="flex gap-3 text-sm leading-relaxed text-slate-600">
							<span class="font-semibold text-brand-green-dark" aria-hidden="true">✓</span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>

			<article class="rounded-2xl border border-slate-200 bg-slate-100/80 p-6 sm:p-8">
				<div class="flex items-center gap-3">
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-slate-600"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</span>
					<h3 class="text-lg font-semibold text-slate-700">
						Essa jornada pode não ser para você se:
					</h3>
				</div>
				<ul class="mt-5 space-y-3">
					{#each notFit as item}
						<li class="flex gap-3 text-sm leading-relaxed text-slate-600">
							<span class="font-semibold text-slate-400" aria-hidden="true">×</span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>
		</div>
	</div>
</section>
