import { createServerClient } from '@supabase/ssr';
import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

const PUBLIC_EXACT_ROUTES = ['/', '/login', '/logout', '/candidatar'];

const PUBLIC_PREFIX_ROUTES = ['/superadmin', '/desafio-tecnico'];

function isPublicRoute(pathname: string): boolean {
	if (PUBLIC_EXACT_ROUTES.includes(pathname)) return true;
	return PUBLIC_PREFIX_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

function shouldSkipAuth(pathname: string): boolean {
	if (pathname.startsWith('/_app/')) return true;
	if (/\.(png|ico|svg|webp|woff2?|txt|map)$/i.test(pathname)) return true;
	return false;
}

function hasSupabaseAuthCookies(cookies: Cookies): boolean {
	return cookies.getAll().some(({ name }) => name.includes('-auth-token'));
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (shouldSkipAuth(pathname)) {
		return resolve(event);
	}

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

	const isAnonymousPublicGet =
		event.request.method === 'GET' &&
		isPublicRoute(pathname) &&
		!hasSupabaseAuthCookies(event.cookies);

	if (isAnonymousPublicGet) {
		event.locals.session = null;
	} else {
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
	}

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
