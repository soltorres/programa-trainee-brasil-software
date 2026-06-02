import { initializeCandidateProgress } from '$lib/candidateProgress';
import {
	EDUCATION_LEVELS,
	isEducationLevel,
	RESUME_ALLOWED_TYPES,
	RESUME_MAX_BYTES,
	resumeExtension
} from '$lib/candidate';
import { fail, redirect } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';

const MIN_PASSWORD_LENGTH = 6;

export const load: PageServerLoad = async ({ locals: { session, supabase } }) => {
	if (session) {
		const { data: candidate } = await supabase
			.from('candidates')
			.select('id')
			.eq('id', session.user.id)
			.maybeSingle();

		if (candidate) {
			redirect(303, '/dashboard');
		}
	}

	return {
		educationLevels: EDUCATION_LEVELS,
		completingProfile: Boolean(session)
	};
};

function parseBirthDate(value: string): string | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const date = new Date(`${value}T12:00:00`);
	if (Number.isNaN(date.getTime())) return null;
	if (date > new Date()) return null;
	return value;
}

type FormValues = {
	full_name: string;
	birth_date: string;
	education_level: string;
	email: string;
};

async function saveCandidateProfile(
	supabase: SupabaseClient,
	userId: string,
	profile: {
		fullName: string;
		birthDate: string;
		educationLevel: string;
		resumeBuffer: Buffer;
		resumeType: string;
		extension: string;
	},
	values?: FormValues
) {
	const resumePath = `${userId}/curriculo${profile.extension}`;

	const { error: uploadError } = await supabase.storage
		.from('resumes')
		.upload(resumePath, profile.resumeBuffer, {
			contentType: profile.resumeType,
			upsert: true
		});

	if (uploadError) {
		return fail(500, {
			error: 'Falha ao enviar o currículo. Tente novamente ou contate o suporte.',
			...(values ? { values } : {})
		});
	}

	const { error: profileError } = await supabase.from('candidates').insert({
		id: userId,
		full_name: profile.fullName,
		birth_date: profile.birthDate,
		education_level: profile.educationLevel,
		resume_path: resumePath
	});

	if (profileError) {
		await supabase.storage.from('resumes').remove([resumePath]);
		return fail(500, {
			error:
				profileError.message.includes('relation') || profileError.message.includes('candidates')
					? 'Execute a migração do banco (tabela candidates). Veja supabase/README.md.'
					: 'Não foi possível salvar seus dados. Tente novamente ou contate o suporte.',
			...(values ? { values } : {})
		});
	}

	const { error: progressError } = await initializeCandidateProgress(supabase, userId, {
		completeCadastro: true
	});

	if (progressError) {
		console.error('initializeCandidateProgress', progressError);
	}

	redirect(303, '/dashboard');
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const fullName = formData.get('full_name');
		const birthDate = formData.get('birth_date');
		const educationLevel = formData.get('education_level');
		const email = formData.get('email');
		const password = formData.get('password');
		const passwordConfirm = formData.get('password_confirm');
		const resume = formData.get('resume');

		const {
			data: { user: existingUser }
		} = await supabase.auth.getUser();

		const values = {
			full_name: typeof fullName === 'string' ? fullName : '',
			birth_date: typeof birthDate === 'string' ? birthDate : '',
			education_level: typeof educationLevel === 'string' ? educationLevel : '',
			email: typeof email === 'string' ? email : existingUser?.email ?? ''
		};

		if (typeof fullName !== 'string' || fullName.trim().length < 3) {
			return fail(400, { error: 'Informe seu nome completo.', values });
		}

		if (typeof birthDate !== 'string' || !parseBirthDate(birthDate)) {
			return fail(400, { error: 'Informe uma data de nascimento válida.', values });
		}

		if (typeof educationLevel !== 'string' || !isEducationLevel(educationLevel)) {
			return fail(400, { error: 'Selecione o grau de escolaridade.', values });
		}

		if (!(resume instanceof File) || resume.size === 0) {
			return fail(400, { error: 'Envie seu currículo em PDF ou Word.', values });
		}

		if (resume.size > RESUME_MAX_BYTES) {
			return fail(400, { error: 'O currículo deve ter no máximo 5 MB.', values });
		}

		const extension = resumeExtension(resume.name);
		if (!extension) {
			return fail(400, {
				error: 'Formato inválido. Envie PDF (.pdf) ou Word (.doc, .docx).',
				values
			});
		}

		if (resume.type && !RESUME_ALLOWED_TYPES.has(resume.type)) {
			return fail(400, {
				error: 'Formato inválido. Envie PDF (.pdf) ou Word (.doc, .docx).',
				values
			});
		}

		const resumeBuffer = Buffer.from(await resume.arrayBuffer());

		if (existingUser) {
			return saveCandidateProfile(
				supabase,
				existingUser.id,
				{
					fullName: fullName.trim(),
					birthDate,
					educationLevel,
					resumeBuffer,
					resumeType: resume.type,
					extension
				},
				values
			);
		}

		if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
			return fail(400, { error: 'Informe um e-mail válido.', values });
		}

		if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
			return fail(400, {
				error: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
				values
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, { error: 'As senhas não coincidem.', values });
		}

		const { data: authData, error: signUpError } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: {
				data: {
					full_name: fullName.trim()
				}
			}
		});

		if (signUpError) {
			return fail(400, { error: signUpError.message, values });
		}

		const userId = authData.user?.id;
		if (!userId) {
			return fail(500, {
				error: 'Não foi possível concluir o cadastro. Tente novamente.',
				values
			});
		}

		if (!authData.session) {
			return {
				success: true,
				message:
					'Conta criada! Confirme seu e-mail pelo link enviado e depois faça login para acompanhar seu progresso. Boa Jornada!'
			};
		}

		return saveCandidateProfile(
			supabase,
			userId,
			{
				fullName: fullName.trim(),
				birthDate,
				educationLevel,
				resumeBuffer,
				resumeType: resume.type,
				extension
			},
			values
		);
	}
};
