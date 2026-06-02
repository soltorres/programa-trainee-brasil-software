export const TECHNICAL_CHALLENGE_PATH = '/desafio-tecnico';

export type ContentBlock =
	| { type: 'paragraph'; text: string }
	| { type: 'list'; items: string[] }
	| { type: 'note'; text: string }
	| { type: 'flow'; steps: string[] };

export type ChallengeSubsection = {
	title: string;
	blocks: ContentBlock[];
};

export type ChallengeSection = {
	id: string;
	title: string;
	blocks: ContentBlock[];
	subsections?: ChallengeSubsection[];
	blocksAfter?: ContentBlock[];
};

export type DeliveryStep = {
	number: string;
	title: string;
	description: string;
	optional?: boolean;
};

export const technicalChallengeMeta = {
	eyebrow: 'Processo seletivo',
	title: 'Desafio Técnico — Programa de Trainee — Brasil Software',
	track: 'Desenvolvimento Web — Sistema de Tarefas',
	intro: [
		'A Brasil Software convida você a participar do nosso processo seletivo para o Programa de Trainee. Este desafio tem como objetivo avaliar sua capacidade de análise, organização, raciocínio lógico, qualidade de entrega e construção de soluções funcionais.',
		'Desenvolva um sistema web de gerenciamento de tarefas que seja funcional, organizado e bem estruturado.'
	],
	closing:
		'Este desafio foi pensado para avaliar sua forma de pensar, estruturar e entregar soluções. Organização, clareza e funcionamento são tão importantes quanto a implementação técnica.'
};

export const technicalChallengeSections: ChallengeSection[] = [
	{
		id: 'o-desafio',
		title: 'O Desafio',
		blocks: [
			{
				type: 'paragraph',
				text: 'Você deverá desenvolver um sistema web de gerenciamento de tarefas. O sistema deve ser funcional, organizado e permitir o controle básico de tarefas do dia a dia. Mais importante do que a complexidade técnica é a forma como você estrutura a solução, organiza o código e garante o funcionamento do sistema.'
			},
			{
				type: 'paragraph',
				text: 'O que construir: Um sistema completo com autenticação, CRUD de tarefas, filtros, dashboard e persistência de dados, tudo acessível via navegador.'
			},
			{ type: 'paragraph', text: 'O que importa:' },
			{
				type: 'list',
				items: [
					'Funcionamento geral do sistema.',
					'Organização e estrutura do código.',
					'Clareza e usabilidade da interface.',
					'Qualidade das validações.',
					'Comunicação técnica no arquivo README.'
				]
			}
		]
	},
	{
		id: 'autenticacao',
		title: 'Autenticação de Usuários',
		blocks: [
			{
				type: 'paragraph',
				text: 'O sistema deve garantir que apenas usuários cadastrados e autenticados possam acessar suas tarefas. Esta é a base de segurança do sistema e deve ser implementada com cuidado, incluindo validações adequadas nos campos de entrada.'
			}
		],
		subsections: [
			{
				title: 'Cadastro de Usuários',
				blocks: [
					{
						type: 'paragraph',
						text: 'Permitir que novos usuários criem uma conta com dados válidos, incluindo validação de campos como e-mail e senha. O sistema deve tratar cenários de erro, como e-mail já cadastrado ou senhas incompatíveis.'
					}
				]
			},
			{
				title: 'Login de Usuários',
				blocks: [
					{
						type: 'paragraph',
						text: 'Autenticar usuários com credenciais válidas, garantindo sessões seguras e tratamento adequado de tentativas de login inválidas, como senhas incorretas ou contas inexistentes.'
					}
				]
			},
			{
				title: 'Controle de Acesso',
				blocks: [
					{
						type: 'paragraph',
						text: 'Cada usuário deve visualizar e gerenciar apenas as suas próprias tarefas, garantindo isolamento e segurança dos dados entre diferentes contas.'
					}
				]
			}
		]
	},
	{
		id: 'gerenciamento',
		title: 'Gerenciamento de Tarefas',
		blocks: [
			{
				type: 'paragraph',
				text: 'O núcleo do sistema é o gerenciamento completo do ciclo de vida das tarefas. O usuário deve poder criar, visualizar, editar e excluir tarefas com facilidade, além de controlar seu status e atributos essenciais.'
			}
		],
		subsections: [
			{
				title: 'Cadastro e Edição',
				blocks: [
					{
						type: 'paragraph',
						text: 'Criar novas tarefas com título, descrição e demais atributos. Editar informações existentes com validações de campos obrigatórios e tratamento de erros.'
					}
				]
			},
			{
				title: 'Listagem e Exclusão',
				blocks: [
					{
						type: 'paragraph',
						text: 'Visualizar todas as tarefas em uma lista organizada e excluir tarefas com confirmação, prevenindo exclusões acidentais.'
					}
				]
			},
			{
				title: 'Alteração de Status',
				blocks: [
					{
						type: 'paragraph',
						text: 'Marcar tarefas como pendentes, em andamento ou concluídas, com feedback visual claro sobre o estado atual de cada item.'
					}
				]
			},
			{
				title: 'Histórico de Alterações',
				blocks: [
					{
						type: 'paragraph',
						text: 'Registrar um histórico básico das modificações realizadas em cada tarefa, permitindo rastreabilidade das mudanças ao longo do tempo.'
					}
				]
			}
		]
	},
	{
		id: 'atributos',
		title: 'Atributos das Tarefas',
		blocks: [
			{
				type: 'paragraph',
				text: 'Cada tarefa deve possuir atributos que permitam uma gestão eficiente e priorização adequada do trabalho. Esses campos são essenciais para a funcionalidade do sistema e devem ser validados corretamente.'
			},
			{
				type: 'list',
				items: [
					'Prioridade: Definir o nível de urgência de cada tarefa, como baixa, média ou alta, permitindo que o usuário organize suas atividades de forma estratégica.',
					'Responsável: Associar um responsável à tarefa, possibilitando a distribuição e o acompanhamento de atividades em contextos colaborativos.',
					'Data Limite: Estabelecer um prazo de entrega para cada tarefa, com validação de datas e identificação visual de tarefas atrasadas no dashboard.'
				]
			},
			{
				type: 'note',
				text: 'Os atributos de prioridade, responsável e data limite são fundamentais para o funcionamento do dashboard e dos filtros de tarefas.'
			}
		]
	},
	{
		id: 'filtros',
		title: 'Filtros e Pesquisa',
		blocks: [
			{
				type: 'paragraph',
				text: 'O sistema deve oferecer mecanismos eficientes para que o usuário encontre rapidamente as tarefas que precisa. Filtros e pesquisa são diferenciais importantes de usabilidade que demonstram atenção à experiência do usuário.'
			}
		],
		subsections: [
			{
				title: 'Filtros de Tarefas',
				blocks: [
					{
						type: 'paragraph',
						text: 'Permitir filtrar tarefas por status, prioridade, responsável ou data limite, combinando múltiplos critérios para refinar os resultados exibidos.'
					}
				]
			},
			{
				title: 'Pesquisa de Tarefas',
				blocks: [
					{
						type: 'paragraph',
						text: 'Implementar busca textual que permita localizar tarefas por título ou descrição, com resultados atualizados em tempo real à medida que o usuário digita.'
					}
				]
			}
		],
		blocksAfter: [
			{
				type: 'paragraph',
				text: 'O fluxo operacional deve seguir as etapas de Abrir Lista, Aplicar Filtros e Exibir Resultados.'
			},
			{
				type: 'flow',
				steps: ['Abrir Lista', 'Aplicar Filtros', 'Exibir Resultados']
			},
			{
				type: 'paragraph',
				text: 'Este fluxo de filtragem e pesquisa deve ser intuitivo e responsivo, proporcionando uma experiência fluida ao usuário durante a navegação pelas tarefas.'
			}
		]
	},
	{
		id: 'dashboard',
		title: 'Dashboard com Indicadores',
		blocks: [
			{
				type: 'paragraph',
				text: 'O dashboard é a tela inicial do sistema e deve apresentar uma visão geral do estado das tarefas do usuário. Os indicadores devem ser claros, atualizados em tempo real e ajudar o usuário a priorizar suas atividades.'
			},
			{
				type: 'list',
				items: [
					'Tarefas Pendentes: Tarefas aguardando início ou em andamento que ainda não foram concluídas pelo usuário.',
					'Tarefas Concluídas: Total de tarefas finalizadas com sucesso, demonstrando a produtividade do usuário ao longo do tempo.',
					'Tarefas Atrasadas: Tarefas cuja data limite já expirou sem conclusão, exigindo atenção imediata do usuário.'
				]
			},
			{
				type: 'note',
				text: 'Os valores apresentados na interface de exemplo são ilustrativos. Seu dashboard deve exibir dados reais baseados nas tarefas cadastradas pelo usuário logado.'
			}
		]
	},
	{
		id: 'requisitos-tecnicos',
		title: 'Requisitos Técnicos do Sistema',
		blocks: [
			{
				type: 'paragraph',
				text: 'Além das funcionalidades, o sistema deve atender a requisitos técnicos que garantam sua qualidade, manutenibilidade e usabilidade. Estes critérios são fundamentais para a avaliação da sua solução.'
			},
			{
				type: 'list',
				items: [
					'Sistema Funcional: O sistema deve estar completamente operacional, com todas as funcionalidades obrigatórias implementadas e testadas.',
					'Interface Organizada: Interface limpa, intuitiva e de fácil uso, com boa experiência do usuário (UX) e design consistente.',
					'Código Estruturado e Legível: Código bem organizado, com estrutura clara de componentes ou módulos, nomes significativos e boas práticas de desenvolvimento.',
					'Persistência de Dados: Utilizar banco de dados ou equivalente para armazenar os dados de forma permanente, garantindo que as informações persistam entre sessões.',
					'Instruções de Execução: Documentação clara e objetiva com passo a passo para configurar e rodar o projeto localmente, incluindo dependências e comandos necessários.'
				]
			}
		]
	},
	{
		id: 'criterios',
		title: 'Critérios de Avaliação e Diferenciais',
		blocks: [
			{
				type: 'paragraph',
				text: 'Sua entrega será avaliada em múltiplas dimensões. Entenda o que os avaliadores observarão e como se destacar com diferenciais que demonstram maturidade técnica.'
			},
			{ type: 'paragraph', text: 'Critérios de Avaliação:' },
			{
				type: 'list',
				items: [
					'Funcionamento geral do sistema.',
					'Organização e estrutura da solução.',
					'Clareza e qualidade do código.',
					'Experiência do usuário referente à usabilidade.',
					'Validações e consistência dos dados.',
					'Atenção a detalhes e tratamento de erros.',
					'Potencial de evolução da solução.',
					'Comunicação técnica no README.'
				]
			},
			{ type: 'paragraph', text: 'Diferenciais:' },
			{
				type: 'list',
				items: [
					'Interface bem organizada e intuitiva.',
					'Boa experiência de uso (UX).',
					'Boas práticas de desenvolvimento.',
					'Estruturação clara de componentes ou módulos.',
					'Cuidados com validações e cenários de erro.',
					'Documentação clara e objetiva.',
					'Publicação do sistema em ambiente online, sendo este item opcional.'
				]
			}
		]
	}
];

export const technicalDeliveryIntro =
	'Após concluir o desenvolvimento, organize sua entrega conforme os itens abaixo. Uma entrega bem estruturada e documentada demonstra profissionalismo e atenção aos detalhes, que são características valorizadas no Programa de Trainee.';

export const technicalDeliverySteps: DeliveryStep[] = [
	{
		number: '01',
		title: 'Link do Repositório',
		description:
			'Envie o link do repositório do projeto, por exemplo no GitHub, garantindo que o código esteja organizado, legível e com histórico de commits coerente.'
	},
	{
		number: '02',
		title: 'Instruções de Execução',
		description:
			'Inclua um README claro e objetivo com passo a passo para configurar o ambiente, instalar dependências e rodar o sistema localmente.'
	},
	{
		number: '03',
		title: 'Aplicação Publicada',
		description:
			'Se possível, publique o sistema em ambiente online, como Vercel, Render ou Railway, e inclua o link de acesso na sua entrega.',
		optional: true
	}
];

export const technicalSubmissionHints = [
	'https://github.com/seu-usuario/seu-repositorio',
	'https://seu-app.vercel.app (opcional)'
];
