export type RevealOptions = {
	delay?: number;
	y?: number;
	/** Apenas opacidade — melhor para blocos com texto fino (evita pixelização por transform). */
	fadeOnly?: boolean;
};

function prefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function revealOnScroll(node: HTMLElement, options: RevealOptions = {}) {
	const delay = options.delay ?? 0;
	const y = options.y ?? 22;

	node.style.setProperty('--reveal-delay', `${delay}ms`);
	node.style.setProperty('--reveal-y', `${y}px`);

	if (options.fadeOnly) {
		node.classList.add('reveal-fade-only');
	}

	if (prefersReducedMotion()) {
		node.classList.add('reveal-done');
		return {};
	}

	node.classList.add('reveal-pending');

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			node.classList.remove('reveal-pending');
			node.classList.add('reveal-done');
			observer.disconnect();
		},
		{ threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
