<script lang="ts">
	import { enhance } from '$app/forms';
	import { DEFAULT_TECHNICAL_CHALLENGE_URL, isInternalChallengeUrl } from '$lib/technicalPhase';

	let {
		challengeUrl = DEFAULT_TECHNICAL_CHALLENGE_URL,
		error = null,
		initialLinks = ''
	}: {
		challengeUrl?: string;
		error?: string | null;
		initialLinks?: string;
	} = $props();

	const opensInNewTab = $derived(!isInternalChallengeUrl(challengeUrl));

	let loading = $state(false);
	let links = $state('');

	$effect(() => {
		links = initialLinks;
	});
</script>

<div class="mt-3 rounded-xl border border-blue-200/80 bg-blue-50/50 px-4 py-3">
	<p class="text-xs leading-relaxed text-blue-900">
		Esta fase está desbloqueada. Leia as orientações do desafio
		<a
			href={challengeUrl}
			target={opensInNewTab ? '_blank' : undefined}
			rel={opensInNewTab ? 'noopener noreferrer' : undefined}
			class="font-semibold text-blue-700 underline hover:text-blue-800"
		>
			aqui
		</a>. Em seguida copie e cole os links no campo abaixo e clique em enviar.
	</p>

	<form
		method="POST"
		action="?/submitTechnical"
		class="mt-3 space-y-3"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
	>
		<div>
			<label for="technical_links" class="block text-xs font-semibold text-blue-900">
				Links da entrega
			</label>
			<textarea
				id="technical_links"
				name="links"
				rows="4"
				disabled={loading}
				bind:value={links}
				placeholder="Cole os links ou informações da sua entrega"
				class="mt-1.5 block w-full resize-y rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-60"
			></textarea>
			<p class="mt-1 text-[11px] text-blue-800/80">O envio conclui esta fase.</p>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{loading ? 'Enviando…' : 'Enviar'}
		</button>

		{#if error}
			<p class="rounded-lg bg-red-50 px-2.5 py-2 text-xs text-red-700" role="alert">{error}</p>
		{/if}
	</form>
</div>
