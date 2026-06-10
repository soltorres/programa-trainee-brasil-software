export function isSupabaseTableMissing(
	error: { code?: string; message?: string } | null | undefined
): boolean {
	if (!error) return false;

	const message = error.message?.toLowerCase() ?? '';

	return (
		error.code === 'PGRST205' ||
		error.code === '42P01' ||
		message.includes('could not find the table') ||
		message.includes('does not exist')
	);
}

type AuthErrorLike = {
	message?: string;
	status?: number;
	code?: string;
	name?: string;
};

/** Mensagens amigáveis para erros do Supabase Auth (evita textos crus como "falha na busca"). */
export function formatAuthError(error: AuthErrorLike): string {
	const message = error.message?.toLowerCase() ?? '';
	const code = error.code ?? '';

	if (
		error.name === 'AuthRetryableFetchError' ||
		message.includes('fetch') ||
		message.includes('falha na busca') ||
		message.includes('network') ||
		message.includes('failed to fetch') ||
		message.includes('networkerror')
	) {
		return 'Não foi possível conectar ao serviço de autenticação. Verifique sua internet e tente novamente em alguns instantes.';
	}

	if (
		code === 'unexpected_failure' ||
		message.includes('database error') ||
		message.includes('error finding user') ||
		message.includes('error saving new user') ||
		message.includes('error granting user')
	) {
		return 'Erro ao criar a conta no servidor de autenticação. Tente novamente; se persistir, a equipe Brasil Software deve verificar os logs do Supabase (Authentication → Logs).';
	}

	if (
		code === 'over_email_send_rate_limit' ||
		message.includes('rate limit exceeded') ||
		message.includes('email rate limit')
	) {
		return 'O limite de envio de e-mails de confirmação foi atingido. Aguarde cerca de 1 hora e tente novamente, ou faça login se já criou a conta. Se precisar de ajuda, fale com a equipe Brasil Software.';
	}

	if (code === 'user_already_exists' || message.includes('already registered')) {
		return 'Este e-mail já está cadastrado. Faça login ou use outro endereço.';
	}

	if (code === 'email_address_invalid' || message.includes('invalid email')) {
		return 'Informe um endereço de e-mail válido.';
	}

	if (code === 'weak_password' || message.includes('password')) {
		return 'A senha não atende aos requisitos mínimos. Use pelo menos 6 caracteres.';
	}

	return error.message ?? 'Não foi possível completar a autenticação. Tente novamente.';
}
