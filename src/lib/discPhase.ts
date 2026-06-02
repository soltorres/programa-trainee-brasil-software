export const DISC_PDF_MAX_BYTES = 5 * 1024 * 1024;

export const DISC_PDF_TYPES = new Set([
	'application/pdf',
	'application/x-pdf',
	'application/octet-stream'
]);

/** URL do teste DISC externo — defina PUBLIC_DISC_ASSESSMENT_URL no .env */
export const DEFAULT_DISC_ASSESSMENT_URL =
	'https://www.mrcoach.com.br/teste-perfil-comportamental-disc.php';

export function isDiscPdf(file: File): boolean {
	if (!file.name.toLowerCase().endsWith('.pdf')) return false;
	if (!file.type) return true;
	return DISC_PDF_TYPES.has(file.type);
}
