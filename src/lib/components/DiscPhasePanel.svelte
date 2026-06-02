<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { DISC_PDF_MAX_BYTES, DEFAULT_DISC_ASSESSMENT_URL, isDiscPdf } from '$lib/discPhase';
	import { getSupabaseClient } from '$lib/supabase/context';

	let {
		assessmentUrl = DEFAULT_DISC_ASSESSMENT_URL,
		error = null
	}: {
		assessmentUrl?: string;
		error?: string | null;
	} = $props();

	let loading = $state(false);
	let localError = $state<string | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	const supabase = getSupabaseClient();
	const displayError = $derived(localError ?? error);

	function storageErrorMessage(message: string): string {
		const lower = message.toLowerCase();

		if (lower.includes('bucket') || lower.includes('not found')) {
			return 'Bucket de arquivos não configurado. Execute supabase/setup.sql no Supabase.';
		}
		if (lower.includes('row-level security') || lower.includes('policy')) {
			return 'Permissão negada no storage. Execute supabase/setup.sql (políticas do bucket resumes).';
		}
		if (lower.includes('mime') || lower.includes('invalid')) {
			return 'Tipo de arquivo não permitido. Envie um PDF válido.';
		}

		return message;
	}

	function progressErrorMessage(message: string): string {
		const lower = message.toLowerCase();

		if (lower.includes('policy') || lower.includes('row-level security')) {
			return 'Permissão negada ao concluir a fase. Execute a política DISC no supabase/setup.sql.';
		}

		return message;
	}

	async function onFileSelected() {
		if (loading) return;

		const file = fileInput?.files?.[0];
		if (!file) return;

		localError = null;

		if (!isDiscPdf(file)) {
			localError = 'Envie o mapeamento em formato PDF.';
			if (fileInput) fileInput.value = '';
			return;
		}

		if (file.size > DISC_PDF_MAX_BYTES) {
			localError = 'O PDF deve ter no máximo 5 MB.';
			if (fileInput) fileInput.value = '';
			return;
		}

		loading = true;

		try {
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			if (userError || !user) {
				localError = 'Sessão expirada. Faça login novamente.';
				return;
			}

			const storagePath = `${user.id}/disc-mapeamento.pdf`;
			const { error: uploadError } = await supabase.storage
				.from('resumes')
				.upload(storagePath, file, {
					contentType: 'application/pdf',
					upsert: true
				});

			if (uploadError) {
				console.error('disc upload', uploadError);
				localError = storageErrorMessage(uploadError.message);
				if (fileInput) fileInput.value = '';
				return;
			}

			const { data: updated, error: completeError } = await supabase
				.from('candidate_phase_progress')
				.update({ completed_at: new Date().toISOString() })
				.eq('candidate_id', user.id)
				.eq('phase_key', 'disc')
				.is('completed_at', null)
				.select('phase_key');

			if (completeError) {
				console.error('disc phase complete', completeError);
				localError = progressErrorMessage(completeError.message);
				if (fileInput) fileInput.value = '';
				return;
			}

			if (!updated?.length) {
				localError =
					'Não foi possível concluir a fase DISC. Verifique se a etapa está liberada e se supabase/setup.sql foi executado.';
				if (fileInput) fileInput.value = '';
				return;
			}

			await invalidateAll();
		} catch (err) {
			console.error('disc phase upload', err);
			localError =
				err instanceof Error
					? err.message
					: 'Não foi possível enviar o arquivo. Tente novamente.';
			if (fileInput) fileInput.value = '';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mt-3 rounded-xl border border-blue-200/80 bg-blue-50/50 px-4 py-3">
	<p class="text-xs leading-relaxed text-blue-900">
		Esta etapa está liberada.
		<a
			href={assessmentUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="font-semibold text-blue-700 underline hover:text-blue-800"
		>
			Clique aqui
		</a>
		para realizar seu mapeamento. Ao finalizar, informe seu e-mail para receber o teste. Acesse seu
		e-mail, salve o resultado em PDF e anexe o arquivo no campo abaixo.
	</p>

	<div class="mt-3">
		<label
			class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
		>
			{loading ? 'Enviando…' : 'Anexar arquivo'}
			<input
				bind:this={fileInput}
				id="disc_report"
				type="file"
				accept=".pdf,application/pdf"
				disabled={loading}
				class="sr-only"
				onchange={onFileSelected}
			/>
		</label>
		<p class="mt-1.5 text-[11px] text-blue-800/80">PDF, até 5 MB. O envio conclui esta fase.</p>

		{#if displayError}
			<p class="mt-2 rounded-lg bg-red-50 px-2.5 py-2 text-xs text-red-700" role="alert">
				{displayError}
			</p>
		{/if}
	</div>
</div>
