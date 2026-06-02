<script lang="ts">
	import { onMount } from 'svelte';

	let {
		text,
		class: className = '',
		speed = 42,
		startDelay = 280
	}: {
		text: string;
		class?: string;
		speed?: number;
		startDelay?: number;
	} = $props();

	let displayed = $state('');
	let cursorVisible = $state(true);
	let isTyping = $state(true);

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			displayed = text;
			isTyping = false;
			return;
		}

		const cursorTimer = window.setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 530);

		let charIndex = 0;
		let typeTimer: ReturnType<typeof setInterval> | undefined;

		const startTimer = window.setTimeout(() => {
			typeTimer = setInterval(() => {
				charIndex += 1;
				displayed = text.slice(0, charIndex);

				if (charIndex >= text.length) {
					if (typeTimer) clearInterval(typeTimer);
					isTyping = false;
				}
			}, speed);
		}, startDelay);

		return () => {
			clearTimeout(startTimer);
			if (typeTimer) clearInterval(typeTimer);
			clearInterval(cursorTimer);
		};
	});
</script>

<span class={className} aria-hidden="true">
	<span aria-hidden="true">{displayed}</span>
	<span
		class="ml-0.5 inline-block w-[3px] translate-y-[0.08em] bg-brand-green align-baseline transition-opacity duration-100"
		class:opacity-0={!cursorVisible && isTyping}
		class:h-[0.85em]={true}
		aria-hidden="true"
	></span>
</span>
