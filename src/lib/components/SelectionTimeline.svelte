<script lang="ts">
	const steps = [
		{
			title: 'Cadastro',
			description: 'Envie seus dados e inicie sua participação no processo seletivo.'
		},
		{
			title: 'Teste de perfil comportamental',
			description: 'Avaliação para entender seu estilo de trabalho e colaboração.'
		},
		{
			title: 'Desafio Técnico',
			description: 'Demonstração prática das suas habilidades e raciocínio técnico.'
		},
		{
			title: 'Entrevista de Fit Cultural',
			description: 'Conversa com o time para alinhar valores, expectativas e propósito.'
		},
		{
			title: 'Documentos de Estágio',
			description: 'Envio e validação da documentação necessária para contratação.'
		},
		{
			title: 'Onboarding',
			description: 'Integração oficial ao programa e início da jornada de aprendizado.'
		}
	] as const;
</script>

<ol class="relative mx-auto max-w-3xl lg:max-w-none">
	<div
		class="absolute top-3 bottom-3 left-[1.125rem] w-0.5 bg-gradient-to-b from-brand-green via-brand-green-light/60 to-slate-200 lg:hidden"
		aria-hidden="true"
	></div>

	<div
		class="absolute top-6 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-brand-green via-brand-green-light/60 to-slate-200 lg:block"
		aria-hidden="true"
	></div>

	<div class="grid gap-8 lg:grid-cols-6 lg:gap-4">
		{#each steps as step, index}
			<li class="relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center">
				<div class="relative z-10 flex shrink-0 flex-col items-center">
					<span
						class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-navy text-sm font-bold text-white shadow-md ring-4 ring-brand-green/25"
					>
						{index + 1}
					</span>
				</div>
				<div class="min-w-0 pb-2 lg:pb-0">
					<h3 class="text-base font-semibold text-brand-navy">{step.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
				</div>
			</li>
		{/each}
	</div>
</ol>
