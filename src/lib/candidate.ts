export const EDUCATION_LEVELS = [
	{ value: 'ensino_medio', label: 'Ensino médio completo' },
	{ value: 'ensino_superior_incompleto', label: 'Ensino superior incompleto' },
	{ value: 'ensino_superior_completo', label: 'Ensino superior completo' },
	{ value: 'pos_graduacao', label: 'Pós-graduação' },
	{ value: 'mestrado_doutorado', label: 'Mestrado ou doutorado' }
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number]['value'];

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_ALLOWED_TYPES = new Set([
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

export const RESUME_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

export function isEducationLevel(value: string): value is EducationLevel {
	return EDUCATION_LEVELS.some((level) => level.value === value);
}

export function resumeExtension(filename: string): string | null {
	const lower = filename.toLowerCase();
	const ext = RESUME_ALLOWED_EXTENSIONS.find((candidate) => lower.endsWith(candidate));
	return ext ?? null;
}
