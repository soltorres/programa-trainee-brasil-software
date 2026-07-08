import type { PhaseKey } from '$lib/selectionPhases';

export type AdminPhaseKey = PhaseKey | 'concluido' | 'frozen' | 'incomplete';

type PhaseStyle = {
	badge: string;
	pillCompleted: string;
	pillOpen: string;
	chip: string;
	chipActive: string;
};

// Tailwind: mantenha classes como literais (não gerar dinamicamente), para não depender de safelist.
export const ADMIN_PHASE_STYLES: Record<AdminPhaseKey, PhaseStyle> = {
	cadastro: {
		badge: 'bg-indigo-100 text-indigo-800',
		pillCompleted: 'bg-indigo-50/80 text-indigo-900',
		pillOpen: 'bg-indigo-50/30 text-indigo-800/90',
		chip: 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100',
		chipActive:
			'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-600/15'
	},
	disc: {
		badge: 'bg-sky-100 text-sky-800',
		pillCompleted: 'bg-sky-50/80 text-sky-900',
		pillOpen: 'bg-sky-50/30 text-sky-800/90',
		chip: 'bg-sky-50 text-sky-800 border-sky-100 hover:bg-sky-100',
		chipActive:
			'bg-sky-600 text-white border-sky-600 hover:bg-sky-700 ring-4 ring-sky-600/15'
	},
	technical: {
		badge: 'bg-blue-100 text-blue-800',
		pillCompleted: 'bg-blue-50/80 text-blue-900',
		pillOpen: 'bg-blue-50/30 text-blue-800/90',
		chip: 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100',
		chipActive: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 ring-4 ring-blue-600/15'
	},
	cultural: {
		badge: 'bg-emerald-100 text-emerald-800',
		pillCompleted: 'bg-emerald-50/80 text-emerald-900',
		pillOpen: 'bg-emerald-50/30 text-emerald-800/90',
		chip: 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100',
		chipActive:
			'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-600/15'
	},
	legal: {
		badge: 'bg-amber-100 text-amber-800',
		pillCompleted: 'bg-amber-50/80 text-amber-900',
		pillOpen: 'bg-amber-50/30 text-amber-800/90',
		chip: 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100',
		chipActive:
			'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 ring-4 ring-amber-600/15'
	},
	onboarding: {
		badge: 'bg-fuchsia-100 text-fuchsia-800',
		pillCompleted: 'bg-fuchsia-50/80 text-fuchsia-900',
		pillOpen: 'bg-fuchsia-50/30 text-fuchsia-800/90',
		chip: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100 hover:bg-fuchsia-100',
		chipActive:
			'bg-fuchsia-600 text-white border-fuchsia-600 hover:bg-fuchsia-700 ring-4 ring-fuchsia-600/15'
	},
	concluido: {
		badge: 'bg-green-100 text-green-800',
		pillCompleted: 'bg-green-50/80 text-green-900',
		pillOpen: 'bg-green-50/30 text-green-800/90',
		chip: 'bg-green-50 text-green-800 border-green-100 hover:bg-green-100',
		chipActive:
			'bg-green-600 text-white border-green-600 hover:bg-green-700 ring-4 ring-green-600/15'
	},
	frozen: {
		badge: 'bg-slate-100 text-slate-700',
		pillCompleted: 'bg-slate-50/80 text-slate-800',
		pillOpen: 'bg-slate-50/30 text-slate-700/90',
		chip: 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100',
		chipActive:
			'bg-slate-700 text-white border-slate-700 hover:bg-slate-800 ring-4 ring-slate-700/15'
	},
	incomplete: {
		badge: 'bg-amber-100 text-amber-900',
		pillCompleted: 'bg-amber-50/80 text-amber-950',
		pillOpen: 'bg-amber-50/30 text-amber-900/90',
		chip: 'bg-amber-50 text-amber-900 border-amber-100 hover:bg-amber-100',
		chipActive:
			'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 ring-4 ring-amber-600/15'
	}
};

