<script lang="ts">
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/brasil-software-logo.png';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<div class="mb-6 flex justify-center">
				<img src={logo} alt="Brasil Software" class="h-10 w-auto" width="160" height="40" />
			</div>
			<h1 class="text-2xl font-semibold tracking-tight text-brand-navy">Entrar</h1>
			<p class="mt-2 text-sm text-slate-600">
				Acesse sua conta para acompanhar o processo seletivo do Programa de Trainee.
			</p>

			<form
				method="POST"
				class="mt-8 space-y-5"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<div>
					<label for="email" class="block text-sm font-medium text-brand-navy">E-mail</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="mt-1.5 block w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-green focus:ring-brand-green"
						placeholder="voce@exemplo.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-brand-navy">Senha</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="mt-1.5 block w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-green focus:ring-brand-green"
						placeholder="••••••••"
					/>
				</div>

				{#if form?.error}
					<p class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{form.error}
					</p>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="flex w-full justify-center rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:bg-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? 'Entrando…' : 'Entrar'}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-slate-500">
				Ainda não tem conta?
				<a href="/candidatar" class="font-medium text-brand-green-dark hover:underline">Candidate-se</a>
			</p>
		</div>
	</div>
</div>
