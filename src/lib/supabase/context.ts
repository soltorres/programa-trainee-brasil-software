import { getContext, setContext } from 'svelte';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_CONTEXT_KEY = Symbol('supabase');

export function setSupabaseClient(client: SupabaseClient) {
	setContext(SUPABASE_CONTEXT_KEY, client);
}

export function getSupabaseClient(): SupabaseClient {
	const client = getContext<SupabaseClient | undefined>(SUPABASE_CONTEXT_KEY);
	if (!client) {
		throw new Error(
			'Cliente Supabase não encontrado. Use getSupabaseClient() apenas em componentes dentro do layout raiz.'
		);
	}
	return client;
}
