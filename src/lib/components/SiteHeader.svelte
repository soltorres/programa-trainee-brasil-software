<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import logo from '$lib/assets/brasil-software-logo.png';

	let { session = null }: { session?: Session | null } = $props();
</script>

<header class="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-3">
			<img
				src={logo}
				alt="Brasil Software"
				class="h-9 w-auto sm:h-10"
				width="160"
				height="40"
			/>
			<span
				class="hidden border-l border-slate-200 pl-3 text-xs font-semibold tracking-wide text-slate-700 sm:block"
			>
				Programa de Trainee
			</span>
		</a>

		<nav class="flex items-center gap-2 sm:gap-3" aria-label="Principal">
			<a
				href="/"
				class="hidden text-sm font-medium text-slate-600 transition hover:text-green-700 sm:inline"
			>
				Início
			</a>

			{#if session}
				<span class="hidden max-w-[12rem] truncate text-sm text-slate-500 md:inline">
					{session.user.email}
				</span>
				<a
					href="/dashboard"
					class="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-100 transition hover:bg-green-700 sm:px-4"
				>
					Meu progresso
				</a>
				<a
					href="/logout"
					class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-green-500 hover:bg-slate-50 sm:px-4"
				>
					Sair
				</a>
			{:else}
				<a
					href="/login"
					class="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-100 transition hover:bg-green-700 sm:px-4"
				>
					Acompanhar minha jornada
				</a>
			{/if}
		</nav>
	</div>
</header>
