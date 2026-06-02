<script lang="ts">
	import { enhance } from '$app/forms';
	import { initialPhaseForAdmin } from '$lib/admin/phaseControl';
	import type { AdminCandidateRow } from '$lib/admin/loadCandidates';
	import type { PhaseKey } from '$lib/selectionPhases';

	let {
		candidate,
		phaseOptions
	}: {
		candidate: AdminCandidateRow;
		phaseOptions: { key: string; label: string }[];
	} = $props();

	let phaseKey = $state<PhaseKey>('cadastro');
	let submitting = $state(false);

	$effect(() => {
		phaseKey = initialPhaseForAdmin(candidate) as PhaseKey;
	});
</script>

<form
	method="POST"
	action="/superadmin?/finalizePhase"
	class="flex flex-wrap items-end gap-2"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			submitting = false;
			await update();
		};
	}}
>
	<input type="hidden" name="candidateId" value={candidate.id} />
	<input type="hidden" name="phaseKey" value={phaseKey} />
	<div class="min-w-[12rem] flex-1">
		<label for="phase-{candidate.id}" class="block text-xs font-semibold text-slate-700">
			Etapa a finalizar
		</label>
		<select
			id="phase-{candidate.id}"
			bind:value={phaseKey}
			disabled={submitting}
			class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none disabled:opacity-60"
		>
			{#each phaseOptions as option}
				<option value={option.key}>{option.label}</option>
			{/each}
		</select>
	</div>
	<button
		type="submit"
		disabled={submitting}
		class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
	>
		{submitting ? 'Finalizando…' : 'Finalizar fase'}
	</button>
</form>
