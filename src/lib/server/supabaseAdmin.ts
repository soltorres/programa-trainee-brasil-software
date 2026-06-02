import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
	const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

	if (!PUBLIC_SUPABASE_URL || !serviceRoleKey) {
		return null;
	}

	if (!adminClient) {
		adminClient = createClient(PUBLIC_SUPABASE_URL, serviceRoleKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
	}

	return adminClient;
}
