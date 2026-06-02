<script lang="ts">
	import './layout.css';
	import { createBrowserClient } from '@supabase/ssr';
	import {
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		PUBLIC_SUPABASE_URL
	} from '$env/static/public';
	import { setSupabaseClient } from '$lib/supabase/context';
	import { invalidate } from '$app/navigation';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	setSupabaseClient(supabase);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event) => {
			if (
				event === 'SIGNED_IN' ||
				event === 'SIGNED_OUT' ||
				event === 'TOKEN_REFRESHED' ||
				event === 'USER_UPDATED'
			) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#f8fafc]">
	{#if !data.hideSiteHeader}
		<SiteHeader session={data.session} />
	{/if}
	<main class="flex-1">
		{@render children()}
	</main>
</div>
