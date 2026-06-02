import { TECHNICAL_CHALLENGE_PATH } from '$lib/content/technicalChallenge';

/** Rota interna das orientações — override opcional com PUBLIC_TECHNICAL_CHALLENGE_URL */
export const DEFAULT_TECHNICAL_CHALLENGE_URL = TECHNICAL_CHALLENGE_PATH;

export function isInternalChallengeUrl(url: string): boolean {
	return url.startsWith('/') && !url.startsWith('//');
}

/** Aceita qualquer texto; sem validação de URL ou formato. */
export function normalizeTechnicalSubmission(raw: string): string {
	return raw.trim();
}
