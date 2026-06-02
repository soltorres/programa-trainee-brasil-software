export function animateProgress(node: HTMLElement, targetPercent = 20) {
	const fill = node.querySelector<HTMLElement>('[data-progress-fill]');
	if (!fill) return {};

	if (prefersReducedMotion()) {
		fill.style.width = `${targetPercent}%`;
		return {};
	}

	fill.style.width = '0%';

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			requestAnimationFrame(() => {
				fill.style.width = `${targetPercent}%`;
			});
			observer.disconnect();
		},
		{ threshold: 0.4 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

function prefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
