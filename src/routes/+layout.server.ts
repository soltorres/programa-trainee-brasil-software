import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session }, url, depends }) => {
	depends('supabase:auth');

	return {
		session,
		hideSiteHeader: url.pathname === '/superadmin' || url.pathname.startsWith('/superadmin/')
	};
};
