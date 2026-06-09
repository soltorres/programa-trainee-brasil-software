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
		const resume = formData.get('resume');

		const {
			data: { user: existingUser },
			error: authError
		} = await supabase.auth.getUser();

		if (authError) {
			console.error('candidatar getUser', authError);
		}

		const values = {
			full_name: typeof fullName === 'string' ? fullName : '',
			birth_date: typeof birthDate === 'string' ? birthDate : '',
			education_level: typeof educationLevel === 'string' ? educationLevel : '',
			email: existingUser?.email ?? ''
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

		if (!existingUser) {
			return fail(401, {
				error:
					'Sessão não encontrada. Ative o JavaScript, tente novamente ou faça login para concluir seu cadastro.',
				values
			});
		}

		const resumeBuffer = Buffer.from(await resume.arrayBuffer());

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
};
