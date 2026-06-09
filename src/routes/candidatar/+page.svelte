<script lang="ts">
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/brasil-software-logo.png';
	import { getSupabaseClient } from '$lib/supabase/context';
	import { formatAuthError } from '$lib/supabaseErrors';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const supabase = getSupabaseClient();
	const MIN_PASSWORD_LENGTH = 6;

	let loading = $state(false);
	let clientError = $state<string | null>(null);
	let emailConfirmMessage = $state<string | null>(null);

	const inputClass =
		'mt-1.5 block w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-green focus:ring-brand-green';

	const displayError = $derived(clientError ?? form?.error ?? null);
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
	<div class="w-full max-w-lg">
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<div class="mb-6 flex justify-center">
				<img src={logo} alt="Brasil Software" class="h-10 w-auto" width="160" height="40" />
			</div>

			<h1 class="text-2xl font-semibold tracking-tight text-brand-navy">Candidate-se</h1>
			<p class="mt-2 text-sm text-slate-600">
				{#if data.completingProfile}
					Complete seu cadastro para liberar a primeira etapa do processo seletivo.
				{:else}
					Preencha seus dados para criar sua conta e iniciar o processo seletivo do Programa de
					Trainee.
				{/if}
			</p>

			{#if emailConfirmMessage}
				<p
					class="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
					role="status"
				>
					{emailConfirmMessage}
				</p>
				<p class="mt-6 text-center text-sm text-slate-500">
					<a href="/login" class="font-medium text-brand-green-dark hover:underline">Ir para o login</a>
				</p>
			{:else}
				<form
					method="POST"
					enctype="multipart/form-data"
					class="mt-8 space-y-8"
					use:enhance={async ({ formElement, cancel }) => {
						loading = true;
						clientError = null;
						emailConfirmMessage = null;

						if (!data.completingProfile) {
							const formData = new FormData(formElement);
							const email = formData.get('email');
							const password = formData.get('password');
							const passwordConfirm = formData.get('password_confirm');
							const fullName = formData.get('full_name');

							if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
								clientError = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
								loading = false;
								cancel();
								return;
							}

							if (password !== passwordConfirm) {
								clientError = 'As senhas não coincidem.';
								loading = false;
								cancel();
								return;
							}

							if (typeof email !== 'string' || !email.trim().includes('@')) {
								clientError = 'Informe um e-mail válido.';
								loading = false;
								cancel();
								return;
							}

							const { data: authData, error } = await supabase.auth.signUp({
								email: email.trim(),
								password,
								options: {
									data: {
										full_name: typeof fullName === 'string' ? fullName.trim() : undefined
									},
									emailRedirectTo: `${window.location.origin}/candidatar`
								}
							});

							if (error) {
								console.error('candidatar signUp', error);
								clientError = formatAuthError(error);
								loading = false;
								cancel();
								return;
							}

							if (!authData.session) {
								emailConfirmMessage =
									'Conta criada! Confirme seu e-mail pelo link enviado e depois faça login para acompanhar seu progresso. Boa Jornada!';
								loading = false;
								cancel();
								return;
							}
						}

						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
				>
					<fieldset class="space-y-4">
						<legend class="text-sm font-semibold text-brand-navy">Dados pessoais</legend>

						<div>
							<label for="full_name" class="block text-sm font-medium text-brand-navy"
								>Nome completo</label
							>
							<input
								id="full_name"
								name="full_name"
								type="text"
								autocomplete="name"
								required
								class={inputClass}
								value={form?.values?.full_name ?? ''}
							/>
						</div>

						<div>
							<label for="birth_date" class="block text-sm font-medium text-brand-navy"
								>Data de nascimento</label
							>
							<input
								id="birth_date"
								name="birth_date"
								type="date"
								required
								class={inputClass}
								value={form?.values?.birth_date ?? ''}
							/>
						</div>

						<div>
							<label for="education_level" class="block text-sm font-medium text-brand-navy"
								>Grau de escolaridade</label
							>
							<select
								id="education_level"
								name="education_level"
								required
								class={inputClass}
								value={form?.values?.education_level ?? ''}
							>
								<option value="" disabled>Selecione…</option>
								{#each data.educationLevels as level}
									<option value={level.value}>{level.label}</option>
								{/each}
							</select>
						</div>
					</fieldset>

					<fieldset class="space-y-4">
						<legend class="text-sm font-semibold text-brand-navy">Currículo</legend>

						<div>
							<label for="resume" class="block text-sm font-medium text-brand-navy"
								>Upload do currículo</label
							>
							<input
								id="resume"
								name="resume"
								type="file"
								required
								accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								class="mt-1.5 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-800 hover:file:bg-green-100"
							/>
							<p class="mt-1.5 text-xs text-slate-500">PDF ou Word, até 5 MB.</p>
						</div>
					</fieldset>

					{#if !data.completingProfile}
						<fieldset class="space-y-4">
							<legend class="text-sm font-semibold text-brand-navy">Dados de acesso</legend>

							<div>
								<label for="email" class="block text-sm font-medium text-brand-navy">E-mail</label>
								<input
									id="email"
									name="email"
									type="email"
									autocomplete="email"
									required
									class={inputClass}
									placeholder="voce@exemplo.com"
									value={form?.values?.email ?? ''}
								/>
							</div>

							<div>
								<label for="password" class="block text-sm font-medium text-brand-navy">Senha</label>
								<input
									id="password"
									name="password"
									type="password"
									autocomplete="new-password"
									required
									minlength="6"
									class={inputClass}
									placeholder="Mínimo 6 caracteres"
								/>
							</div>

							<div>
								<label for="password_confirm" class="block text-sm font-medium text-brand-navy"
									>Confirmar senha</label
								>
								<input
									id="password_confirm"
									name="password_confirm"
									type="password"
									autocomplete="new-password"
									required
									minlength="6"
									class={inputClass}
									placeholder="Repita a senha"
								/>
							</div>
						</fieldset>
					{/if}

					{#if displayError}
						<p class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
							{displayError}
						</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:bg-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading
							? 'Enviando inscrição…'
							: data.completingProfile
								? 'Concluir cadastro'
								: 'Criar conta e candidatar-se'}
					</button>
				</form>

				{#if !data.completingProfile}
					<p class="mt-6 text-center text-sm text-slate-500">
						Já tem conta?
						<a href="/login" class="font-medium text-brand-green-dark hover:underline">Entrar</a>
					</p>
				{/if}
			{/if}
		</div>
	</div>
</div>
