<script lang="ts">
	import { buildRoutePath, toPercent } from '$lib/utils/mapRoute';
	import LineIcon, { type IconName } from '$lib/components/LineIcon.svelte';

	export type SelectionStop = {
		icon: IconName;
		label: string;
		hint: string;
	};

	let { stops }: { stops: readonly SelectionStop[] } = $props();

	const MAP_W = 300;
	const MAP_H = 520;

	/** Coordenadas verticais com leve variação lateral (ordem 1 -> 6). */
	const pinCoords = [
		{ x: 136, y: 62 },
		{ x: 168, y: 138 },
		{ x: 124, y: 214 },
		{ x: 164, y: 290 },
		{ x: 122, y: 366 },
		{ x: 158, y: 442 }
	] as const;

	const routePath = buildRoutePath(pinCoords);

	const pinPercents = pinCoords.map((p) => toPercent(p, MAP_W, MAP_H));
</script>

<article class="flex flex-col">
	<div class="mb-3">
		<div class="flex items-center justify-between gap-3">
			<p
				class="inline-flex items-center rounded-full border border-green-200/60 bg-green-50 px-3 py-1 text-xs font-semibold tracking-wider text-green-700 uppercase"
			>
				Sua jornada de seleção
			</p>
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm"
				aria-hidden="true"
			>
				<LineIcon name="compass" class="h-5 w-5" />
			</div>
		</div>
		<p class="mt-2 text-[11px] leading-relaxed text-slate-500">
			Etapas para entrar no Programa de Trainee da Brasil Software.
		</p>
	</div>

	<div class="selection-map relative w-full overflow-visible" role="img" aria-label="Mapa do processo seletivo com seis etapas numeradas">
		<div
			class="selection-map-parchment relative mx-auto w-full max-w-[16.5rem] sm:max-w-[17rem]"
			style="aspect-ratio: 1 / 1.65; border-radius: 1.8rem 1.1rem 2rem 1.3rem / 1rem 1.8rem 1.35rem 2.2rem;"
		>
			<span
				class="pointer-events-none absolute top-2.5 left-3 z-20 font-mono text-[9px] tracking-widest text-journey-graphite/30 uppercase"
				aria-hidden="true">Expedição · BS</span
			>
			<span
				class="pointer-events-none absolute right-3 bottom-2.5 z-20 font-mono text-[9px] text-journey-graphite/30"
				aria-hidden="true">N ↑</span
			>

			<div class="absolute inset-x-[10%] inset-y-[5%]">
				<svg
					class="selection-map-route pointer-events-none absolute inset-0 h-full w-full"
					viewBox={`0 0 ${MAP_W} ${MAP_H}`}
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
				>
					<path
						d={routePath}
						fill="none"
						stroke="#16a34a"
						stroke-width="2.5"
						stroke-dasharray="2 9"
						stroke-linecap="round"
						stroke-linejoin="round"
						opacity="0.7"
					/>
				</svg>

				<ol class="absolute inset-0 m-0 list-none p-0">
					{#each stops as stop, i}
						{@const pos = pinPercents[i]}
						{@const phase = i + 1}
						{@const labelSide = i % 2 === 0 ? 'right' : 'left'}
						<li
							class="selection-map-pin absolute z-10 flex items-center"
							style="left: {pos.x}%; top: {pos.y}%;"
						>
							<div class="relative shrink-0">
								<span
									class="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 shadow-sm sm:h-10 sm:w-10"
								>
									<LineIcon name={stop.icon} class="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
								</span>
								<span
									class="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-600 text-[10px] font-bold text-white shadow-sm"
								>
									{phase}
								</span>
								{#if i === 0}
									<span
										class="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-green-200 bg-green-50 px-1.5 py-0.5 text-[7px] font-bold tracking-wide text-green-700 uppercase"
									>
										Comece aqui
									</span>
								{/if}
								{#if i === stops.length - 1}
									<span
										class="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white shadow-sm"
										aria-hidden="true"
									>
										<LineIcon name="check" class="h-2.5 w-2.5" strokeWidth={2.5} />
									</span>
								{/if}
							</div>
							<div
								class="absolute top-1/2 w-[6.4rem] -translate-y-1/2 sm:w-[6.8rem]"
								class:left-full={labelSide === 'right'}
								class:ml-2.5={labelSide === 'right'}
								class:text-left={labelSide === 'right'}
								class:right-full={labelSide === 'left'}
								class:mr-2.5={labelSide === 'left'}
								class:text-right={labelSide === 'left'}
							>
								<p class="text-[9px] leading-tight font-semibold text-slate-900 sm:text-[10px]">
									<span class="sr-only">Fase {phase}: </span>{stop.label}
								</p>
								<p
									class="mt-0.5 text-[8px] leading-snug sm:text-[9px] {i === stops.length - 1
										? 'text-green-600'
										: 'text-slate-500'}"
								>
									{stop.hint}
								</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</article>
