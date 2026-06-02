<script lang="ts">
	import { DEFAULT_CULTURAL_CALENDAR_URL } from '$lib/culturalPhase';

	let { calendarUrl = DEFAULT_CULTURAL_CALENDAR_URL }: { calendarUrl?: string } = $props();
</script>

<div class="mt-3 rounded-xl border border-blue-200/80 bg-blue-50/50 px-4 py-3">
	<p class="text-xs leading-relaxed text-blue-900">
		Sua jornada está no caminho certo! Você acaba de desbloquear a etapa de Fit Cultural.
	</p>
	<p class="mt-2 text-xs leading-relaxed text-blue-900">
		<a
			href={calendarUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="font-semibold text-blue-700 underline hover:text-blue-800"
		>
			Clique aqui
		</a>
		para agendar seu horário.
	</p>
	<p class="mt-2 text-xs leading-relaxed text-blue-900">
		Estamos ansiosos para conhecer você melhor e compartilhar mais sobre nossa cultura, valores e
		oportunidades.
	</p>
</div>
