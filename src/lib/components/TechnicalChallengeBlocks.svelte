<script lang="ts">
	import type { ContentBlock } from '$lib/content/technicalChallenge';

	let { blocks }: { blocks: ContentBlock[] } = $props();
</script>

<div class="space-y-4">
	{#each blocks as block}
		{#if block.type === 'paragraph'}
			<p class="text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">{block.text}</p>
		{:else if block.type === 'list'}
			<ul class="space-y-2.5">
				{#each block.items as item}
					<li class="flex gap-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
						<span
							class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
							aria-hidden="true"
						></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		{:else if block.type === 'note'}
			<p
				class="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950"
				role="note"
			>
				{block.text}
			</p>
		{:else if block.type === 'flow'}
			<ol
				class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch"
				aria-label="Fluxo operacional"
			>
				{#each block.steps as step, index}
					<li
						class="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800"
					>
						<span
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
							aria-hidden="true"
						>
							{index + 1}
						</span>
						{step}
					</li>
				{/each}
			</ol>
		{/if}
	{/each}
</div>
