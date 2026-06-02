import { createServerClient } from '@supabase/ssr';
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';

const PUBLIC_EXACT_ROUTES = ['/', '/login', '/logout', '/candidatar'];

const PUBLIC_PREFIX_ROUTES = ['/superadmin'];

function isPublicRoute(pathname: string): boolean {
	if (PUBLIC_EXACT_ROUTES.includes(pathname)) return true;
	return PUBLIC_PREFIX_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	const {
		data: { session: cookieSession }
	} = await event.locals.supabase.auth.getSession();

	if (!cookieSession) {
		event.locals.session = null;
	} else {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			event.locals.session = null;
		} else {
			const { user: _staleUser, ...sessionWithoutUser } = cookieSession;
			event.locals.session = { ...sessionWithoutUser, user };
		}
	}

	const { pathname } = event.url;

	if (!event.locals.session && !isPublicRoute(pathname)) {
		redirect(303, '/login');
	}

	if (event.locals.session && pathname === '/login') {
		redirect(303, '/dashboard');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
