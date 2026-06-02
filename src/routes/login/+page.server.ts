import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || !email.trim()) {
			return fail(400, { error: 'Informe um e-mail válido.' });
		}

		if (typeof password !== 'string' || !password) {
			return fail(400, { error: 'Informe sua senha.' });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});

		if (error) {
			return fail(401, { error: error.message });
		}

		redirect(303, '/dashboard');
	}
};
