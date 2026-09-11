"use client";

import { useState, useEffect } from "react";

// --- FORMATADORES FINANCEIROS ---
const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};
const formatPct = (value: number) => {
  return value.toFixed(1).replace('.', ',') + '%';
};

// --- GERADORES DINÂMICOS ---
const companyPrefixes = ["Indústria", "Varejo", "Tech", "Distribuidora", "Logística", "Holdings", "Construtora", "Laboratório", "Clínica", "Agronegócio"];
const companySuffixes = ["Alfa", "Ômega", "Titan", "Vértice", "Nexus", "Prime", "Quantum", "Horizonte", "Global", "Meridiano"];
const generateCompanyName = () => {
  return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
};

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const playPromotionSound = () => {
  try {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch (err) {}
};

// --- CURVA DE CARREIRA ---
const levels = [
  { tier: 1, title: "Estagiário", minXp: 0, hasTimer: false, feedback: null },
  { tier: 1, title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Execução metódica de conciliações e rotinas de contas a pagar/receber.", vulnerabilidade: "Sua leitura ainda é de curto prazo (regime de caixa). É preciso absorver o impacto das obrigações futuras e da competência contábil." } },
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos, provisões e impacto tributário na precificação." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de impactos macroeconômicos (como a transição tributária)." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPCs complexos, auditoria atuária e proteção cambial estrutural." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal agressiva.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento direto com o conselho e acionistas." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias seculares e crises geopolíticas." } }
];

// --- EVENTOS CISNE NEGRO (CHOQUES MACROECONÔMICOS) ---
const blackSwans = [
  { title: "CHOQUE MACROECONÔMICO", text: "O Banco Central aumentou a Selic em 1.5% em reunião extraordinária. O custo da dívida flutuante da empresa explodiu, corroendo a margem e drenando o caixa operacional instantaneamente.", impacts: { caixa: -350000, margem: -1.5, compliance: 0 } },
  { title: "ATAQUE RANSOMWARE", text: "Os servidores sofreram uma tentativa de invasão (Phishing). A operação foi paralisada por 12 horas para contenção do vazamento de dados, gerando perda de faturamento e exposição regulatória.", impacts: { caixa: -250000, margem: -0.8, compliance: -10 } },
  { title: "QUEBRA DE CADEIA LOGÍSTICA", text: "Um fornecedor crítico asiático decretou falência abruptamente. A necessidade de compra emergencial de insumos no mercado interno para não parar a fábrica esvaziou as reservas de caixa.", impacts: { caixa: -600000, margem: -2.5, compliance: 0 } },
  { title: "PASSIVO TRABALHISTA OCULTO", text: "O STF alterou a jurisprudência sobre a base de cálculo de um encargo da folha de pagamento. Um passivo retroativo de 5 anos atingiu o balanço da companhia de surpresa.", impacts: { caixa: -400000, margem: 0, compliance: -15 } }
];

// --- BANCO DE DADOS DINÂMICO (COM REFORMA TRIBUTÁRIA E ALTA DENSIDADE) ---
const allScenarios = [
  // TIER 1 & 2
  {
    id: 1, tier: 1, criticality: "Baixa", points: 20, sector: "Tesouraria / Gestão de Caixa",
    title: "O Descasamento do Ciclo Operacional (Overtrading)",
    theory: "Segundo as diretrizes de solvência do BCB, lucros contábeis não garantem liquidez. O Ciclo de Conversão de Caixa (CCC) é vital. Crescer vendas financiando clientes em prazos longos enquanto se paga fornecedores à vista consome o capital de giro exponencialmente, gerando o chamado Efeito Tesoura.",
    context: "O faturamento saltou 35% neste trimestre e a DRE mostra 15% de margem líquida. Contudo, o caixa amanheceu descoberto antes do fechamento bancário. Os fornecedores exigem liquidação em 15 dias, mas o setor comercial alongou os recebimentos para 60 dias para bater a meta agressiva.", character: "Supervisão de Tesouraria",
    options: [
      { text: "Captar limite de cheque especial corporativo ou linha de curto prazo para cobrir os boletos e sustentar a concessão de crédito comercial irrestrita.", xp: -15, impacts: { caixa: 500000, margem: -2.5, compliance: -5 }, feedback: "INVIÁVEL. Financiar um ciclo financeiro estruturalmente deficitário com dívida bancária cara mascara o problema hoje, mas as taxas de rotativo destroem a margem da empresa rapidamente." },
      { text: "Travar imediatamente as vendas a prazo para novos clientes, antecipar parte dos recebíveis com trava de spread e realinhar os prazos a 30 dias.", xp: 20, impacts: { caixa: 1200000, margem: -0.5, compliance: 10 }, feedback: "CIRÚRGICO. Você estancou a hemorragia de liquidez trazendo R$ 1.2M para o caixa com sacrifício mínimo de margem, realinhando a governança comercial." }
    ]
  },
  {
    id: 2, tier: 1, criticality: "Baixa", points: 22, sector: "Contas a Pagar / Custo de Oportunidade",
    title: "A Arbitragem do Desconto de Duplicatas",
    theory: "O desconto concedido por um fornecedor para quitação à vista deve ser comparado matematicamente ao custo de oportunidade das aplicações de liquidez imediata (CDI/Selic). Deixar de capturar um desconto mercantil que supera amplamente o CDI é uma perda direta e silenciosa de margem.",
    context: "Um fornecedor homologado oferece 2,5% de abatimento para o pagamento à vista de uma fatura de R$ 2 Milhões hoje. Caso contrário, o prazo padrão será de 30 dias. A empresa mantém um caixa volumoso investido em aplicações rendendo 0,85% ao mês.", character: "Mesa de Pagamentos",
    options: [
      { text: "Recusar o desconto ofertado para manter o saldo intocado na aplicação bancária rendendo os juros até o trigésimo dia do vencimento.", xp: -10, impacts: { caixa: 0, margem: -1.2, compliance: 0 }, feedback: "EQUÍVOCO FINANCEIRO. Você sacrificou um ganho financeiro líquido superior ao rendimento bancário do período, espremendo a margem do negócio." },
      { text: "Resgatar o saldo necessário da aplicação e liquidar a fatura à vista, capturando integralmente o desconto financeiro de 2,5%.", xp: 22, impacts: { caixa: -1950000, margem: 1.6, compliance: 0 }, feedback: "EFICIÊNCIA DE ALOCAÇÃO. A saída antecipada gerou um spread financeiro positivo direto e seguro, convertendo o setor de AP em um gerador de lucro." }
    ]
  },
  {
    id: 3, tier: 2, criticality: "Média", points: 30, sector: "Controladoria / CPC 16",
    title: "Custeio ABC e o Subsídio Cruzado",
    theory: "O rateio linear de custos indiretos por volume (absorção simples) mascara a ineficiência de produtos de nicho que exigem setup complexo. O Custeio Baseado em Atividades (ABC) aloca despesas conforme a demanda real de processos, evitando o 'subsídio cruzado', onde produtos lucrativos pagam a conta de produtos ineficientes.",
    context: "A linha tradicional tem alta tiragem e o balanço aponta margem contábil de 18%. A linha sob medida também registra 18%, mas a fábrica reclama que ela exige 4x mais horas de manutenção, inspeções e retrabalho fabril, secando o caixa invisivelmente.", character: "Controladoria Operacional",
    options: [
      { text: "Reajustar linearmente os preços de ambas as linhas de produção em 10% para recompor a margem global exigida pelo conselho de administração.", xp: -20, impacts: { caixa: -300000, margem: -2.0, compliance: 0 }, feedback: "FALHA ESTRATÉGICA. O aumento cego encarece o produto que te sustenta no mercado (perdendo vendas) e perpetua o subsídio do produto deficitário que drena a operação." },
      { text: "Rastrear os geradores de custo via ABC, elevar rigorosamente a precificação apenas da linha sob medida e incentivar as vendas da linha padrão.", xp: 30, impacts: { caixa: 650000, margem: 3.5, compliance: 10 }, feedback: "VISÃO ESTRATÉGICA ATIVADA. Você isolou a ineficiência fabril e destravou a rentabilidade real, engordando o fluxo de caixa sustentável." }
    ]
  },
  {
    id: 4, tier: 2, criticality: "Média", points: 35, sector: "Gestão de Risco / PDD",
    title: "Provisão de Perdas Esperadas (PECLD / IFRS 9)",
    theory: "O modelo de perdas incorridas foi superado pela mensuração de perdas esperadas. O IFRS 9 exige que a empresa provisione a inadimplência com base no histórico de rolagem de dívidas e variáveis macroeconômicas, e não apenas aguardando o atraso se consumar.",
    context: "O setor comercial atingiu um recorde histórico vendendo fortemente a prazo para redes varejistas que estão em processo de reestruturação. A diretoria recusa-se a lançar provisões de perda (PDD) para não estragar a comemoração do Ebitda mensal.", character: "Risco e Crédito Corporativo",
    options: [
      { text: "Adiar o reconhecimento da provisão até que os títulos comerciais completem 90 dias de inadimplência efetiva e inquestionável no cartório.", xp: -25, impacts: { caixa: -800000, margem: 2.0, compliance: -40 }, feedback: "DESCOMPLIANCE POR OMISSÃO. A margem pareceu subir artificialmente, mas o caixa foi surpreendido por calotes sucessivos. O balanço foi maquiado." },
      { text: "Calcular e lançar imediatamente a PECLD ponderando o risco histórico do novo cluster, aceitando o impacto negativo no lucro do trimestre atual.", xp: 35, impacts: { caixa: 0, margem: -3.0, compliance: 40 }, feedback: "RIGOR TÉCNICO INEGOCIÁVEL. Você aceitou o golpe contábil na margem para manter a transparência absoluta perante as normas IFRS e os acionistas." }
    ]
  },

  // NOVOS CENÁRIOS: REFORMA TRIBUTÁRIA E ALTA GESTÃO (TIERS 3 & 4)
  {
    id: 5, tier: 3, criticality: "Alta", points: 45, sector: "Tributário / Reforma Tributária (EC 132)",
    title: "IVA Dual: Precificação e Não Cumulatividade Plena",
    theory: "A Reforma Tributária extinguiu PIS, COFINS, IPI, ICMS e ISS, substituindo-os pelo IVA Dual (CBS federal e IBS subnacional). A grande mudança estrutural é a 'não cumulatividade plena': a empresa passa a creditar-se do imposto sobre praticamente todos os insumos adquiridos, mas as alíquotas nominais finais são significativamente maiores (estimadas acima de 26%). Precificar produtos usando lógicas antigas destrói a rentabilidade instantaneamente.",
    context: "Sua indústria compra insumos pesados. No sistema antigo, você não tomava crédito de PIS/COFINS sobre várias despesas operacionais. Agora, com o IBS/CBS operando, o Diretor Comercial quer reduzir o preço de venda em 10% alegando que 'teremos mais créditos tributários para abater', sem repassar a nova alíquota nominal ao mercado.", character: "Comitê de Transição Tributária",
    options: [
      { text: "Aprovar a redução de preço sugerida pelo Comercial. Afinal, a promessa da reforma é baratear a carga, e a abundância de créditos do IBS/CBS compensará a queda da receita bruta.", xp: -45, impacts: { caixa: -1500000, margem: -5.5, compliance: 0 }, feedback: "RUÍNA DE PRECIFICAÇÃO. Você ignorou que a alíquota de saída do IBS/CBS é muito superior à soma do ICMS/PIS/COFINS antigos. Os créditos novos não compensaram o imposto final devido, sangrando a margem brutalmente." },
      { text: "Vetar a redução. Exigir o recálculo do Markup (Mark-up Múltiplo) deduzindo os novos créditos da base de custo, mas aplicando a nova alíquota cheia (IVA) na formação do preço de venda final.", xp: 45, impacts: { caixa: 800000, margem: 2.5, compliance: 30 }, feedback: "MAESTRIA TRIBUTÁRIA. Você adaptou o DRE gerencial à nova realidade do IVA. O preço foi formado corretamente sobre o custo líquido, garantindo a proteção da margem e a neutralidade fiscal da operação." }
    ]
  },
  {
    id: 6, tier: 3, criticality: "Alta", points: 45, sector: "Controladoria / Orçamento",
    title: "O Custo de Compliance na Transição Tributária",
    theory: "O artigo 125 do ADCT (Reforma Tributária) prevê um período de transição de 7 anos (2026 a 2032). Durante esse período, as empresas precisarão apurar simultaneamente os impostos do sistema antigo (ICMS, PIS, COFINS) em proporções decrescentes e os impostos do novo sistema (CBS, IBS) em proporções crescentes. O custo administrativo e sistêmico (ERP) para auditar dois mundos fiscais simultâneos é gigantesco.",
    context: "Estamos elaborando o Orçamento Base Zero (OBZ) para o próximo biênio. O gerente de TI e o Controller solicitam a aprovação de R$ 2 Milhões em capex para a implantação de um novo módulo de motor de cálculo tributário no ERP, além da contratação de uma consultoria especialista na transição.", character: "Diretoria de Controladoria (FP&A)",
    options: [
      { text: "Reprovar o orçamento. Cortar o investimento em TI e exigir que o atual departamento contábil apure os dois sistemas tributários (Antigo e Novo) utilizando planilhas eletrônicas (Excel) para economizar caixa.", xp: -40, impacts: { caixa: 2000000, margem: 0, compliance: -70 }, feedback: "COLAPSO OPERACIONAL E MULTAS. Economizar 2 Milhões hoje gerou o caos. Planilhas não suportam cruzamento de alíquotas fracionadas do período de transição. As malhas finas da Receita bloquearão a empresa em meses." },
      { text: "Aprovar integralmente o investimento (Capex). Encarar a atualização do ERP e a consultoria como custo indispensável de sobrevivência regulatória, amortizando a despesa ao longo dos anos de transição.", xp: 45, impacts: { caixa: -2000000, margem: -1.0, compliance: 60 }, feedback: "GOVERNANÇA PREVENTIVA. A dor no caixa foi pesada e imediata, mas você blindou a companhia contra o período mais caótico da história fiscal do país, garantindo continuidade dos negócios." }
    ]
  },
  {
    id: 7, tier: 4, criticality: "Extrema", points: 50, sector: "Planejamento Estratégico / Imposto Seletivo",
    title: "A Ameaça do Imposto Seletivo (Sin Tax)",
    theory: "A EC 132 criou o Imposto Seletivo (IS), incidindo sobre bens e serviços prejudiciais à saúde ou ao meio ambiente. Ao contrário do IVA, o IS compõe a própria base de cálculo de outros tributos (incidência 'por dentro') e não gera crédito tributário para o adquirente, configurando custo puro que destrói a competitividade do produto no mercado.",
    context: "A sua indústria química acaba de ser notificada que seu principal produto (que representa 40% do faturamento) foi enquadrado na lista de incidência do novo Imposto Seletivo federal. O repasse integral do novo custo aumentaria o preço final na gôndola em absurdos 35%.", character: "Conselho de Administração",
    options: [
      { text: "Absorver o custo do Imposto Seletivo reduzindo a margem de lucro para não perder *Market Share*, mantendo os preços atuais na prateleira até a concorrência quebrar.", xp: -50, impacts: { caixa: -4500000, margem: -15.0, compliance: 0 }, feedback: "DESTRUIÇÃO DE VALOR ECONÔMICO. O Imposto Seletivo não gera crédito; é perda seca. Absorver 35% de carga eliminou o Ebitda da linha de produção. A empresa entrou em insolvência estrutural." },
      { text: "Pivotar a estratégia: aprovar um plano imediato de *Spin-off* (separação) da linha afetada, focar o capex no desenvolvimento de um produto substituto verde (isento de IS) e realizar o *Pass-through* parcial do custo para o mercado até a transição concluir.", xp: 50, impacts: { caixa: -1000000, margem: 5.0, compliance: 20 }, feedback: "RESILIÊNCIA DE CEO. Você entendeu que tributação comportamental não se combate absorvendo margem, mas inovando o portfólio. A rápida readaptação salvou o Market Cap da empresa." }
    ]
  },
  {
    id: 8, tier: 4, criticality: "Extrema", points: 50, sector: "M&A / Engenharia Financeira",
    title: "Alavancagem Ótima (WACC) em Leveraged Buyout",
    theory: "Em finanças corporativas, fugir de dívidas a qualquer custo destrói valor. O capital próprio (Ke) exige prêmio de risco superior. A dívida bancária (Kd) gera escudo fiscal (dedutibilidade dos juros). O Leveraged Buyout (LBO) estrutura aquisições usando dívida atrelada ao próprio ativo comprado para maximizar o ROE.",
    context: "O conselho aprovou a aquisição de um concorrente vital por R$ 30 Milhões. A matriz possui liquidez livre e poderia pagar à vista. A taxa exigida pelos acionistas da holding é de 19% a.a. Um sindicato de bancos oferece o financiamento a 11% a.a.", character: "Diretoria de Estratégia M&A",
    options: [
      { text: "Liquidar a aquisição 100% à vista utilizando o caixa próprio, publicando na imprensa a solidez da empresa por não precisar de financiamentos.", xp: -40, impacts: { caixa: -30000000, margem: -4.0, compliance: 0 }, feedback: "MIOPIA DE ALOCAÇÃO DE CAPITAL. Você sangrou R$ 30M do balanço usando o capital mais caro da firma (19%). O Custo Médio Ponderado (WACC) subiu e o ROE despencou." },
      { text: "Estruturar a transação em LBO: usar 30% do caixa como entrada e alavancar os 70% restantes no banco, travando os ativos da adquirida como garantia.", xp: 50, impacts: { caixa: -9000000, margem: 5.5, compliance: 10 }, feedback: "DOMÍNIO ABSOLUTO DE FINANÇAS. A aquisição custou apenas R$ 9M em caixa. Você capturou o escudo fiscal dos juros a 11% e explodiu o retorno sobre o capital investido." }
    ]
  },
  {
    id: 9, tier: 3, criticality: "Alta", points: 42, sector: "Compliance / Controles Internos",
    title: "Matriz SoD e o Conflito de Acesso Bancário",
    theory: "No framework do COSO, a Segregação de Funções (SoD) é a espinha dorsal da prevenção. Quem cadastra e agenda ordens de pagamento no ERP não pode possuir privilégios de liberação de token bancário. Falhas nesse ponto viabilizam a criação de empresas fantasmas e sangrias indetectáveis.",
    context: "Para acelerar a expansão, o gerente de uma filial longínqua recebeu perfil de 'cadastro' no ERP e 'autorizador master' no banco corporativo para destravar fretes noturnos e pagar fornecedores sem depender do fuso da matriz.", character: "Inspetoria de Governança",
    options: [
      { text: "Manter a autonomia local temporariamente, mitigando o risco com a exigência de envio de um relatório mensal em Excel assinado pelo gerente.", xp: -30, impacts: { caixa: -1800000, margem: -1.0, compliance: -50 }, feedback: "VULNERABILIDADE EXPLORADA. Controles físicos atrasados não impediram um desvio eletrônico de R$ 1.8M via triangulação de notas frias." },
      { text: "Revogar o acesso master na hora. O procedimento exige que a filial cadastre a despesa, e exclusivamente a Tesouraria Central libere a TED.", xp: 42, impacts: { caixa: 0, margem: 0, compliance: 35 }, feedback: "BLINDAGEM DO AMBIENTE DE CONTROLE. Você eliminou um vetor crítico de fraude corporativa fechando a brecha no fluxo de aprovação sistêmica." }
    ]
  },
  {
    id: 10, tier: 4, criticality: "Extrema", points: 50, sector: "Finanças Estruturadas",
    title: "Covenants Financeiros e Risco de Cross Default",
    theory: "Debêntures e linhas de crédito internacionais exigem conformidade contínua de travas financeiras (Covenants). Romper a relação 'Dívida Líquida / Ebitda' aciona a quebra de contrato, permitindo aos credores declarar o vencimento antecipado e imediato de todo o passivo da empresa.",
    context: "A holding emitiu debêntures com um teto de Covenant estrito de 2,5x. O balanço trimestral fechou com o índice batendo 2,42x. Ignorando isso, a diretoria exige aprovar hoje uma campanha massiva de aquisição de mercado que queimará R$ 12 Milhões à vista.", character: "Comitê de Relações com Investidores",
    options: [
      { text: "Aprovar a verba de marketing para não travar o crescimento da receita, operando na esperança de que os bancos não executem a dívida em caso de leve estouro.", xp: -50, impacts: { caixa: -12000000, margem: -2.0, compliance: -60 }, feedback: "RISCO DE RUÍNA CONCRETIZADO. A queima de R$ 12M elevou a Dívida Líquida. O covenant de 2.5x estourou e os credores bloquearam as contas para execução sumária." },
      { text: "Vetar a campanha categoricamente. Instituir um regime de retenção de liquidez e contenção de OPEX até que o indicador recue para uma margem de segurança de 2,0x.", xp: 50, impacts: { caixa: 5500000, margem: 1.5, compliance: 40 }, feedback: "PROTEÇÃO FIDUCIÁRIA. Você enfrentou a diretoria, protegeu a solidez contratual perante o mercado e garantiu a sobrevivência do CNPJ. A imprudência foi evitada." }
    ]
  }
];

export default function CodigoAzulGame() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(5000000);
  const [margem, setMargem] = useState(20.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastImpacts, setLastImpacts] = useState<any>(null);

  const [showDRE, setShowDRE] = useState(false);
  const [sessionStartStats, setSessionStartStats] = useState({ caixa: 5000000, margem: 20.0 });
  const [currentBlackSwan, setCurrentBlackSwan] = useState<any>(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [sessionScenarios, setSessionScenarios] = useState<any[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // V11: Novo DB para integrar os novos cenários de Reforma Tributária
  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v11') || '{}');
    if (db[nickname]) {
      db[nickname].data = { 
        playerName, companyName, xp, caixa, margem, compliance, 
        currentStage, sessionScenarios, sessionStartStats, showDRE 
      };
      localStorage.setItem('codigoAzul_Corp_v11', JSON.stringify(db));
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameStarted && sessionScenarios.length > 0 && !isGameOver && !currentBlackSwan) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, sessionScenarios, isGameOver, showDRE, currentBlackSwan]);

  const generateSessionPool = (currentTier: number) => {
    const eligibleScenarios = allScenarios.filter(s => 
      s.tier === currentTier || (currentTier > 1 && s.tier === currentTier - 1) || (currentTier < 4 && s.tier === currentTier + 1)
    );
    return shuffleArray(eligibleScenarios.length > 0 ? eligibleScenarios : allScenarios).slice(0, 10); // Lotes de 10
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nickname.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanNickname || !cleanPassword) { setLoginError("Credenciais inválidas."); return; }

    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v11') || '{}');

    if (db[cleanNickname]) {
      if (db[cleanNickname].password === cleanPassword) {
        const d = db[cleanNickname].data;
        setPlayerName(d.playerName); setCompanyName(d.companyName);
        setXp(d.xp || 0); 
        setCaixa(d.caixa ?? 5000000); setMargem(d.margem ?? 20.0); setCompliance(d.compliance ?? 100);
        setCurrentStage(d.currentStage || 0); setSessionScenarios(d.sessionScenarios || []);
        setSessionStartStats(d.sessionStartStats || { caixa: d.caixa ?? 5000000, margem: d.margem ?? 20.0 });
        setShowDRE(d.showDRE || false);
        
        if((d.caixa ?? 5000000) <= 0 || (d.compliance ?? 100) <= 0) setIsGameOver(true);
        setLoginError(""); setForgotPasswordMsg(""); setGameStarted(true);
      } else {
        setLoginError("Acesso negado. Senha incorreta.");
      }
    } else {
      const newCompany = generateCompanyName();
      const initialPool = generateSessionPool(1);
      db[cleanNickname] = {
        password: cleanPassword,
        data: { 
          playerName: cleanNickname, companyName: newCompany, xp: 0, 
          caixa: 5000000, margem: 20.0, compliance: 100, 
          currentStage: 0, sessionScenarios: initialPool,
          sessionStartStats: { caixa: 5000000, margem: 20.0 }, showDRE: false
        }
      };
      localStorage.setItem('codigoAzul_Corp_v11', JSON.stringify(db));
      
      setPlayerName(cleanNickname); setCompanyName(newCompany); 
      setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setSessionScenarios(initialPool);
      setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setLoginError(""); setForgotPasswordMsg(""); setTimeLeft(60); setGameStarted(true); setIsGameOver(false); setShowDRE(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordMsg("A recuperação de senha via e-mail exige conexão com nosso Cloud Database. O recurso será ativado no próximo update de infraestrutura.");
  };

  const handleLogout = () => {
    if(!isGameOver) saveToDB();
    setGameStarted(false); setNickname(""); setPassword(""); setLoginError("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false); setShowDRE(false); setCurrentBlackSwan(null);
  };

  const handleManualSave = () => {
    saveToDB(); setSaveStatus("DADOS GRAVADOS"); setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetCareer = () => {
    if (confirm("Confirma a liquidação da empresa? Seu XP e Status serão destruídos.")) {
      const newCompany = generateCompanyName();
      const initialPool = generateSessionPool(1);
      setCompanyName(newCompany); setXp(0); 
      setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setSessionScenarios(initialPool);
      setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setFeedback(null); setPromotionPending(false); setTimeLeft(60); setIsGameOver(false); setLastImpacts(null); setShowDRE(false); setCurrentBlackSwan(null);
    }
  };

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || showDRE || currentBlackSwan || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, showDRE, currentBlackSwan, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && !showDRE && !currentBlackSwan && gameStarted && currentLevel.hasTimer) {
      const timeoutImpacts = { caixa: -500000, margem: -1.5, compliance: -10 };
      handleChoice(-15, "TEMPO ESGOTADO. Hesitação corporativa sob fogo inimigo destrói liquidez imediata e afasta investidores.", true, timeoutImpacts);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentBlackSwan, gameStarted, currentLevel.hasTimer]);

  const handleConsultoria = () => {
    if (caixa < 50000 || isProcessing || isGameOver) return;
    setIsProcessing(true);
    
    const scenario = sessionScenarios[currentStage];
    const correctOption = scenario.options.reduce((prev: any, curr: any) => (prev.xp > curr.xp) ? prev : curr);
    
    const combinedImpacts = {
      caixa: (correctOption.impacts?.caixa || 0) - 50000,
      margem: correctOption.impacts?.margem || 0,
      compliance: correctOption.impacts?.compliance || 0,
    };

    handleChoice(correctOption.xp, `🤖 IA MENTORIA PEDRO MONTE (Honorários: R$ 50k debitados): ${correctOption.feedback}`, false, combinedImpacts);
  };

  const handleChoice = (baseXpGained: number, feedbackText: string, isTimeout: boolean = false, impacts: any = null) => {
    if (isProcessing || isGameOver) return;
    setIsProcessing(true);

    let bonus = 0;
    if (baseXpGained > 0 && !isTimeout && currentLevel.hasTimer) {
      if (timeLeft >= 45) bonus = 5; else if (timeLeft >= 30) bonus = 2;
    }
    
    const totalXpGained = baseXpGained + bonus;
    const newXp = Math.max(0, xp + totalXpGained);
    
    let newCaixa = caixa; let newMargem = margem; let newCompliance = compliance;
    if (impacts) {
      newCaixa = Math.max(0, caixa + impacts.caixa);
      newMargem = margem + impacts.margem;
      newCompliance = Math.min(100, Math.max(0, compliance + impacts.compliance));
    }

    setCaixa(newCaixa); setMargem(newMargem); setCompliance(newCompliance);
    setXp(newXp); setLastXpChange(totalXpGained); setTimeBonus(bonus); setLastImpacts(impacts);

    if (newCaixa <= 0) {
      setIsGameOver(true); setFeedback("FALÊNCIA DECRETADA. O caixa da companhia foi aniquilado sumariamente. Sem liquidez imediata para honrar a folha de pagamento e impostos, os credores pediram a recuperação judicial da holding."); return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA EXTREMA. O nível de compliance atingiu margens inaceitáveis. O acúmulo de sonegações, infrações na matriz SoD e violações do IFRS desencadearam bloqueio cautelar das contas."); return;
    }

    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true); setPromotedLevel(newCalculatedLevel);
    }

    setFeedback(feedbackText);
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) {
      setFeedback(null); playPromotionSound(); setIsProcessing(false); return;
    }
    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    setPromotionPending(false); setPromotedLevel(null); setFeedback(null);
    setLastXpChange(null); setTimeBonus(0); setTimeLeft(60); setLastImpacts(null);
    setIsProcessing(false);

    if (currentStage < sessionScenarios.length - 1) {
      if (Math.random() < 0.20 && currentLevel.tier >= 2) {
        const randomSwan = blackSwans[Math.floor(Math.random() * blackSwans.length)];
        setCurrentBlackSwan(randomSwan);
      } else {
        setCurrentStage(prev => prev + 1);
      }
    } else {
      setShowDRE(true);
    }
  };

  const handleAcknowledgeBlackSwan = () => {
    const impacts = currentBlackSwan.impacts;
    const newCaixa = Math.max(0, caixa + impacts.caixa);
    const newMargem = margem + impacts.margem;
    const newCompliance = Math.min(100, Math.max(0, compliance + impacts.compliance));

    setCaixa(newCaixa); setMargem(newMargem); setCompliance(newCompliance);
    setCurrentBlackSwan(null);

    if (newCaixa <= 0) {
      setIsGameOver(true); setFeedback("FALÊNCIA POR CHOQUE EXTERNO (Cisne Negro). Seu colchão de liquidez era insuficiente para absorver a crise sistêmica no mercado."); return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true); setFeedback("COLAPSO INSTITUCIONAL. A tempestade externa encontrou uma empresa com controles internos fragilizados, levando à intervenção."); return;
    }

    setCurrentStage(prev => prev + 1);
  };

  const handleStartNewQuarter = () => {
    setShowDRE(false);
    setSessionStartStats({ caixa, margem });
    const newPool = generateSessionPool(currentLevel.tier);
    setCurrentStage(0);
    setSessionScenarios(newPool);
  };

  const caixaBarFill = Math.min(100, (caixa / 15000000) * 100);
  const margemBarFill = Math.min(100, Math.max(0, (margem / 40.0) * 100));

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">Sincronizando Terminal Corporativo...</div>;

  // --- TELA DE LOGIN ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/70 backdrop-blur-2xl p-10 rounded-2xl border border-white/5 shadow-2xl max-w-sm w-full relative">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-cyan-500/40 bg-slate-900 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <img src="https://images2.imgbox.com/71/2a/v5KjH8Lp_o.png" alt="Executivo" className="w-full h-full object-cover object-top" />
            </div>
            <h1 className="text-2xl font-light text-slate-200 tracking-[0.2em] uppercase">Código <span className="font-semibold text-cyan-400">Azul</span></h1>
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador Fiduciário Corporativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Credencial de Operador</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="diretoria.corp" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono flex justify-between">
                <span>Chave de Segurança</span>
                <button type="button" onClick={handleForgotPassword} className="text-cyan-600 hover:text-cyan-400 underline">Esqueci a Senha</button>
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            
            {loginError && <div className="text-red-400 text-[11px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{loginError}</div>}
            {forgotPasswordMsg && <div className="text-amber-400 text-[10px] text-justify p-3 rounded bg-amber-500/10 border border-amber-500/20 leading-relaxed">{forgotPasswordMsg}</div>}

            <button type="submit" className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 text-xs font-mono tracking-widest py-3.5 px-4 rounded-lg transition-all mt-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">CONECTAR SISTEMA ERP</button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE GAME OVER (FALÊNCIA) ---
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="z-10 bg-[#170f0f]/80 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-red-900/50 shadow-2xl max-w-2xl w-full text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em] mb-2">Ordem Judicial de Bloqueio</h2>
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 tracking-wide uppercase">
            {caixa <= 0 ? "FALÊNCIA DECRETADA" : "INTERVENÇÃO REGULATÓRIA"}
          </h1>
          <div className="bg-[#060202]/50 p-6 rounded-xl border border-red-900/40 mb-8 text-left">
            <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed text-justify border-l-2 border-red-500 pl-4">{feedback}</p>
          </div>
          <div className="flex justify-center">
             <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 hover:border-red-500 text-red-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">Liquidar CNPJ e Iniciar Nova Operação</button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DRE GAMIFICADO (FECHAMENTO DE TRIMESTRE) ---
  if (showDRE) {
    const deltaCaixa = caixa - sessionStartStats.caixa;
    const deltaMargem = margem - sessionStartStats.margem;
    
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/90 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#020617]/50 border border-white/10 mb-6 shadow-inner">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">DRE Sintético Gerencial</h2>
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 tracking-wide uppercase">Fechamento do <span className="font-semibold text-cyan-400">Trimestre</span></h1>
          
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left space-y-4 font-mono">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500 text-xs">Caixa Abertura Trimestre:</span><span className="text-slate-300 text-xs">{formatBRL(sessionStartStats.caixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500 text-xs">Caixa Fechamento Atual:</span><span className="text-slate-300 text-xs">{formatBRL(caixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 bg-slate-900/30 p-2 rounded">
              <span className="text-slate-400 text-xs font-bold">Fluxo de Caixa Livre (FCF):</span>
              <span className={`text-sm font-bold ${deltaCaixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{deltaCaixa >= 0 ? '+' : ''}{formatBRL(deltaCaixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 pt-2">
              <span className="text-slate-500 text-xs">Variação EBITDA Margin:</span>
              <span className={`text-xs font-bold ${deltaMargem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{deltaMargem >= 0 ? '+' : ''}{formatPct(deltaMargem)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500 text-xs">XP Executivo Consolidado:</span><span className="text-cyan-400 text-xs font-bold">{xp} Pontos</span>
            </div>
          </div>
          <button onClick={handleStartNewQuarter} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">Assinar Balanço & Iniciar Novo Ciclo</button>
        </div>
      </div>
    );
  }

  // --- TELA DE CISNE NEGRO (CHOQUES MACRO) ---
  if (currentBlackSwan) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="z-10 bg-[#170f0f]/90 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-red-900/50 shadow-2xl max-w-2xl w-full text-center">
          <div className="text-red-500 text-6xl mb-6">📉</div>
          <h2 className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em] mb-2">Cisne Negro (Tail Risk)</h2>
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 tracking-wide uppercase">{currentBlackSwan.title}</h1>
          <div className="bg-[#060202]/50 p-6 rounded-xl border border-red-900/40 mb-8 text-left">
            <p className="text-slate-300 text-sm font-light leading-relaxed text-justify border-l-2 border-red-500 pl-4 mb-4">{currentBlackSwan.text}</p>
            <div className="font-mono text-[11px] text-red-400 border-t border-red-900/50 pt-4 mt-4 space-y-1">
               <p>Impacto Conta Caixa: <span className="font-bold">{formatBRL(currentBlackSwan.impacts.caixa)}</span></p>
               <p>Erosão de Margem: <span className="font-bold">{formatPct(currentBlackSwan.impacts.margem)}</span></p>
            </div>
          </div>
          <button onClick={handleAcknowledgeBlackSwan} className="bg-red-950/50 border border-red-800 hover:border-red-500 text-red-400 text-xs font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">Absorver Prejuízo e Operar</button>
        </div>
      </div>
    );
  }

  // --- TELA DE PROMOÇÃO DE PATENTE ---
  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-cyan-400 bg-slate-900 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <img src="https://images2.imgbox.com/71/2a/v5KjH8Lp_o.png" alt="Executivo" className="w-full h-full object-cover object-top" />
          </div>
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Comitê de Governança</h2>
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 tracking-wide uppercase">Ascensão <span className="font-semibold text-cyan-400">Homologada</span></h1>
          
          <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-slate-800 mb-8 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="flex justify-between items-end border-b border-slate-800/80 pb-4 mb-4">
              <span className="text-slate-500 uppercase text-[10px] tracking-[0.2em] font-mono">Nova Patente Adquirida</span>
              <span className="text-xl md:text-2xl font-semibold text-cyan-400">{promotedLevel?.title}</span>
            </div>
            <div className="space-y-4">
              <div><h3 className="text-cyan-500/80 font-mono uppercase text-[10px] tracking-widest mb-1">Parecer de Capacidade Instalada</h3><p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed text-justify">{promotedLevel?.feedback?.forca}</p></div>
              <div><h3 className="text-amber-500/80 font-mono uppercase text-[10px] tracking-widest mb-1">Ponto de Atenção para Próximo Ciclo</h3><p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed text-justify">{promotedLevel?.feedback?.vulnerabilidade}</p></div>
            </div>
          </div>
          <button onClick={proceedToNextQuestion} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">Assumir Painel de Controle</button>
        </div>
      </div>
    );
  }

  const scenario = sessionScenarios[currentStage];
  if (!scenario) return null;
  const timerColor = timeLeft > 30 ? 'bg-cyan-500' : timeLeft > 15 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        {/* HUD FINANCEIRO: SINAIS VITAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5 shadow-lg">
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline mb-1">
               <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Caixa Operacional</span>
               <span className={`text-xs font-bold font-mono ${caixa > 2000000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span>
            </div>
            <div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-emerald-900/30">
              <div className={`h-full transition-all duration-700 ease-out ${caixa > 2500000 ? 'bg-emerald-500' : caixa > 1000000 ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} style={{ width: `${caixaBarFill}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline mb-1">
               <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Margem EBITDA</span>
               <span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span>
            </div>
            <div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-blue-900/30">
              <div className={`h-full transition-all duration-700 ease-out ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline mb-1">
               <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Compliance Matriz</span>
               <span className={`text-xs font-bold font-mono ${compliance >= 80 ? 'text-purple-400' : 'text-amber-400'}`}>{compliance}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-purple-900/30">
              <div className={`h-full transition-all duration-700 ease-out ${compliance > 60 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${compliance}%` }}></div>
            </div>
          </div>
        </div>

        {/* HEADER IDENTIFICAÇÃO */}
        <header className="bg-[#0f172a]/50 backdrop-blur-xl p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-xl border border-cyan-500/40 bg-slate-900 overflow-hidden shrink-0 hidden md:block">
              <img src="https://images2.imgbox.com/71/2a/v5KjH8Lp_o.png" alt="Avatar" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <h1 className="text-base font-light text-slate-100 tracking-[0.15em] uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1>
              <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Estrategista: <span className="text-slate-300">{playerName}</span></p>
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{currentLevel.title}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono tracking-widest">
                <span>XP GERADO: {xp}</span><span className="text-cyan-600">GATILHO: {nextLevel ? `${nextLevel.minXp}` : 'MAX'}</span>
              </div>
              <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 transition-all duration-1000 ease-out" style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* PAINEL DE OPERAÇÕES PRINCIPAL */}
        {!feedback ? (
          <main className="bg-[#0f172a]/40 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            {currentLevel.hasTimer ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#020617] rounded-t-2xl overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-linear ${timerColor} shadow-[0_0_10px_currentColor]`} style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
              </div>
            ) : null}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/5 pb-4 mt-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold">{scenario.sector}</span>
                  <span className="hidden md:inline text-slate-600 font-mono text-[9px]">•</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${scenario.criticality === 'Extrema' ? 'border-red-500/40 text-red-400 bg-red-950/20' : scenario.criticality === 'Alta' ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' : scenario.criticality === 'Média' ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' : 'border-slate-600/40 text-slate-400 bg-slate-900/30'}`}>
                    Risco: {scenario.criticality}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{scenario.title}</h2>
              </div>
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border border-slate-700/50 bg-[#020617]/50 px-3 py-1.5 rounded-md whitespace-nowrap">
                Fase {currentStage + 1}/{sessionScenarios.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5">
                <h3 className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> Marco Normativo / Teoria</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{scenario.theory}</p>
              </div>
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                <h3 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2 relative z-10"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Contexto Corporativo (Field)</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify relative z-10">{scenario.context}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-3 text-center">Definição do C-Level</h3>
              {scenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  disabled={isProcessing}
                  onClick={() => handleChoice(option.xp, option.feedback, false, option.impacts)}
                  className={`w-full text-left p-6 rounded-xl bg-[#020617]/50 border border-slate-700/50 transition-all group relative overflow-hidden ${isProcessing ? 'opacity-50' : 'hover:border-cyan-500/50 hover:bg-[#081229] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'}`}
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2 text-justify">{option.text}</p>
                </button>
              ))}

              {/* BOTÃO LIFELINE: CONSULTORIA PREMIUM COM IA */}
              <div className="pt-6 border-t border-white/5 mt-6">
                <button
                  disabled={isProcessing || caixa < 50000}
                  onClick={handleConsultoria}
                  className={`w-full text-center p-4 rounded-xl border transition-all font-mono text-[10px] tracking-[0.2em] uppercase ${isProcessing || caixa < 50000 ? 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-amber-950/20 border-amber-800/50 text-amber-500 hover:bg-amber-900/40 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'}`}
                >
                  🤖 Acionar Consultoria Pedro Monte (Debita R$ 50.000 do Caixa)
                </button>
              </div>
            </div>
          </main>
        ) : (
          /* TELA DE FEEDBACK TÉCNICO E IMPACTO NO HUD */
          <div className="bg-[#0f172a]/60 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative text-center">
            <div className={`absolute top-0 left-0 w-full h-1 ${lastXpChange && lastXpChange > 0 ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-500' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Parecer Técnico Homologado' : 'Alerta de Irregularidade de Risco'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 tracking-wider mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {lastImpacts && (
              <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mb-8 border-y border-white/5 py-6 bg-[#020617]/30">
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Caixa (Liquidez)</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Margem (Ebitda)</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Governança</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.compliance >= 0 ? 'text-purple-400' : 'text-red-400'}`}>{lastImpacts.compliance >= 0 ? '+' : ''}{lastImpacts.compliance}%</p>
                 </div>
              </div>
            )}

            <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-2xl mx-auto relative">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">Parecer Técnico:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={handleNextStageOrPromotion} className="bg-transparent border border-slate-600 hover:border-cyan-400 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono tracking-[0.3em] py-3.5 px-10 rounded-xl transition-all uppercase hover:bg-cyan-950/20">
              {promotionPending ? "Acessar Avaliação de Patente" : "Proceder ao Próximo Arquivo"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleManualSave} className="text-[9px] text-cyan-600/60 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">{saveStatus || "Gravar Data Center"}</button>
          <span className="text-slate-800">/</span><button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Desconectar (Logout)</button>
          <span className="text-slate-800">/</span><button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Liquidacao Total (Reset)</button>
        </div>

      </div>
    </div>
  );
}