"use client";

import { useState, useEffect } from "react";

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

// --- CURVA DE CARREIRA (HARDCORE: LONGA PROGRESSÃO) ---
const levels = [
  { tier: 1, title: "Estagiário", minXp: 0, hasTimer: false, feedback: null },
  { tier: 1, title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Execução metódica de conciliações e rotinas de contas a pagar/receber.", vulnerabilidade: "Sua leitura ainda é de curto prazo (regime de caixa). É preciso absorver o impacto das obrigações futuras e da competência contábil." } },
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos e provisões trabalhistas/previdenciárias." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de encargos atuariais corporativos." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPC 33, compliance com a PREVIC e proteção cambial." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento com o conselho." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias e macroeconômicas." } }
];

// --- BANCO DE DADOS DINÂMICO COM CRITICIDADE E TEMAS DA PREVIDÊNCIA ---
const allScenarios = [
  // --- TIER 1: ENTRADA / BASE OPERACIONAL (CRITICIDADE: BAIXA / 20-25 XP) ---
  {
    id: 1,
    tier: 1,
    criticality: "Baixa",
    points: 20,
    sector: "Tesouraria / Gestão de Caixa",
    title: "O Descasamento do Ciclo Operacional",
    theory: "O Ciclo de Conversão de Caixa (CCC) mede a defasagem entre pagar insumos e receber pelas vendas. Crescer sem capital de giro de suporte consome a liquidez imediata, desencadeando risco de insolvência técnica, independentemente do volume faturado.",
    context: "As vendas cresceram 35%, mas o caixa está no vermelho antes do fechamento bancário. Fornecedores exigem liquidação em 15 dias, enquanto os clientes estão parcelando em até 60 dias.",
    character: "Supervisão de Tesouraria",
    options: [
      { text: "Captar cheque especial para cobrir os boletos e sustentar a concessão de crédito comercial irrestrita.", xp: -15, impacts: { caixa: 10, margem: -25, compliance: -5 }, feedback: "INVIÁVEL. Taxas de rotativo consomem a margem da empresa rapidamente." },
      { text: "Antecipar parte dos recebíveis com trava de spread e realinhar os prazos de recebimento a 30 dias.", xp: 20, impacts: { caixa: 25, margem: -5, compliance: 10 }, feedback: "PRECISO. Restabeleceu a liquidez imediata e equilibrou o ciclo de caixa da operação." }
    ]
  },
  {
    id: 2,
    tier: 1,
    criticality: "Baixa",
    points: 22,
    sector: "Contas a Pagar / Custo de Oportunidade",
    title: "A Arbitragem do Desconto de Duplicatas",
    theory: "O desconto concedido por um fornecedor para quitação à vista deve ser comparado ao custo de oportunidade das aplicações de liquidez imediata (CDI/Selic). Deixar de capturar um desconto que supera o CDI é perda direta de margem.",
    context: "Um fornecedor homologado oferece 2,5% de abatimento para pagamento hoje. Caso contrário, o prazo é 30 dias. A empresa mantém caixa investido rendendo 0,85% ao mês.",
    character: "Mesa de Pagamentos",
    options: [
      { text: "Recusar o desconto para manter o saldo intocado na aplicação bancária até o trigésimo dia.", xp: -10, impacts: { caixa: 0, margem: -15, compliance: 0 }, feedback: "EQUÍVOCO. Você sacrificou um ganho financeiro líquido superior ao rendimento bancário do período." },
      { text: "Resgatar o saldo necessário e liquidar a fatura à vista capturando o desconto financeiro de 2,5%.", xp: 22, impacts: { caixa: 15, margem: 20, compliance: 0 }, feedback: "EFICIENTE. A operação gerou um spread financeiro direto para o resultado da companhia." }
    ]
  },
  {
    id: 3,
    tier: 1,
    criticality: "Baixa",
    points: 25,
    sector: "Folha e Encargos / Reforma da Previdência",
    title: "Ajuste na Tabela Progressiva de Retenção (EC 103)",
    theory: "A Emenda Constitucional nº 103/2019 unificou e escalonou as alíquotas do INSS para empregados de forma progressiva (7,5% a 14%), incidindo faixa por faixa até o teto do RGPS. Erros no cálculo do eSocial geram autos de infração da Receita Federal.",
    context: "O setor de RH fechou a folha aplicando alíquota cheia de 14% sobre o salário bruto total de um profissional sênior, em vez do cálculo progressivo por faixas, gerando desconto indevido.",
    character: "Auditoria Interna de Folha",
    options: [
      { text: "Manter a retenção como está e orientar o colaborador a compensar no IRPF anual do próximo ano.", xp: -15, impacts: { caixa: 0, margem: 0, compliance: -35 }, feedback: "IRREGULAR. O eSocial rejeitará a guia e a retenção indevida gera passivo trabalhista imediato." },
      { text: "Retificar a parametrização do software de folha para o cálculo progressivo por faixas e estornar a diferença.", xp: 25, impacts: { caixa: -5, margem: 0, compliance: 25 }, feedback: "CORRETO. Garantiu a exatidão com as regras da EC 103/2019 e evitou autuações na Receita." }
    ]
  },

  // --- TIER 2: ANALISTAS / COMPLEXIDADE MÉDIA (CRITICIDADE: MÉDIA / 30-35 XP) ---
  {
    id: 4,
    tier: 2,
    criticality: "Média",
    points: 30,
    sector: "Controladoria / CPC 16",
    title: "Custeio ABC e Subsídio Cruzado",
    theory: "O rateio linear de custos indiretos por volume (absorção simples) mascara a ineficiência de produtos de nicho que exigem setup complexo. O Custeio Baseado em Atividades (ABC) aloca despesas conforme a demanda real de processos.",
    context: "A linha tradicional tem alta tiragem e margem contábil de 18%. A linha personalizada também registra 18%, mas exige 4x mais horas de manutenção, inspeções e retrabalho fabril.",
    character: "Controladoria Operacional",
    options: [
      { text: "Reajustar linearmente os preços de ambas as linhas em 10% para blindar o lucro global do setor.", xp: -20, impacts: { caixa: -10, margem: -20, compliance: 0 }, feedback: "FALHA ESTRATÉGICA. Você encarece o produto eficiente e perpetua o subsídio ao produto deficitário." },
      { text: "Rastrear os geradores de custo via ABC, elevar a precificação da linha sob medida e incentivar a linha padrão.", xp: 30, impacts: { caixa: 15, margem: 30, compliance: 10 }, feedback: "ESTRATÉGICO. Isolou a ineficiência e destravou a margem de contribuição real da fábrica." }
    ]
  },
  {
    id: 5,
    tier: 2,
    criticality: "Média",
    points: 32,
    sector: "RH Corporativo / Previdência Complementar",
    title: "Previdência Fechada e Retenção com Vesting",
    theory: "Após a Reforma da Previdência (EC 103), os planos corporativos ganharam papel central na atração de talentos. O desenho com cláusula de Vesting protege o investimento da empresa condicionando os aportes patronais ao tempo de casa.",
    context: "A diretoria quer oferecer plano de previdência corporativa com aporte paritário (1:1), mas teme financiar a aposentadoria de executivos que saem da companhia após 18 meses.",
    character: "Comitê de Remuneração e Pessoas",
    options: [
      { text: "Liberar o resgate total dos aportes patronais imediatamente no ato do desligamento, sem carência.", xp: -20, impacts: { caixa: -25, margem: -15, compliance: 0 }, feedback: "PREJUÍZO CORPORATIVO. A empresa financia custos de longo prazo sem obter a retenção do profissional." },
      { text: "Instituir cláusula de Vesting progressivo (ex: 20% ao ano, 100% após 5 anos) para o resgate dos aportes da patrocinadora.", xp: 32, impacts: { caixa: 15, margem: 10, compliance: 15 }, feedback: "EXCELENTE. Alinhou a política previdenciária à retenção e sustentabilidade de caixa da companhia." }
    ]
  },
  {
    id: 6,
    tier: 2,
    criticality: "Média",
    points: 35,
    sector: "Gestão de Risco / PDD",
    title: "Provisão de Perdas Esperadas (PECLD / IFRS 9)",
    theory: "Exige-se que a empresa provisione inadimplência com base no histórico de rolagem de dívidas e variáveis macroeconômicas futuras, e não apenas no atraso consumado.",
    context: "O setor comercial atingiu recorde trimestral vendendo a prazo para redes em reestruturação. A diretoria não quer lançar provisões antes do primeiro boleto vencer.",
    character: "Risco e Crédito Corporativo",
    options: [
      { text: "Adiar a provisão até que os títulos completem 90 dias de inadimplência efetiva no cartório.", xp: -25, impacts: { caixa: -15, margem: 10, compliance: -40 }, feedback: "DESCOMPLIANCE. Ocultar o risco iminente distorce o resultado e fere o princípio da prudência." },
      { text: "Calcular e lançar imediatamente a PECLD ponderando o risco histórico do cluster de novos clientes.", xp: 35, impacts: { caixa: 0, margem: -15, compliance: 40 }, feedback: "RIGOR TÉCNICO. Refletiu a perda provável na DRE e manteve a governança de crédito auditável." }
    ]
  },

  // --- TIER 3: BUSINESS PARTNER & CONTROLLERS (CRITICIDADE: ALTA / 40-45 XP) ---
  {
    id: 7,
    tier: 3,
    criticality: "Alta",
    points: 40,
    sector: "Contabilidade Societária / CPC 33 (R1)",
    title: "Déficit Atuarial em Plano de Benefício Definido (BD)",
    theory: "O CPC 33 determina que déficits atuariais em planos patrocinados devem ser reconhecidos no Balanço como passivo não circulante. Com a alta da longevidade, planos legados de BD geram obrigações crescentes.",
    context: "O fundo de pensão patrocinado pela empresa apurou um déficit atuarial de R$ 18 Milhões. A diretoria quer excluir essa obrigação do balanço da holding alegando que a entidade é independente.",
    character: "Auditoria Externa (Big 4)",
    options: [
      { text: "Omitir o déficit do balanço da patrocinadora e mencioná-lo de forma genérica em notas explicativas.", xp: -35, impacts: { caixa: 0, margem: 0, compliance: -60 }, feedback: "RESSALVA GRAVE. A responsabilidade subsidiária da patrocinadora pelo déficit exige reconhecimento formal." },
      { text: "Reconhecer o passivo atuarial pelo valor justo das obrigações líquidas e aprovar plano de equacionamento.", xp: 40, impacts: { caixa: -20, margem: -25, compliance: 50 }, feedback: "GOVERNANÇA PLENA. Em estrita conformidade com o CPC 33 e resoluções do CNPC/PREVIC." }
    ]
  },
  {
    id: 8,
    tier: 3,
    criticality: "Alta",
    points: 42,
    sector: "Compliance / Controles Internos (COSO)",
    title: "Segregação de Funções e Conflito de Token",
    theory: "Na matriz de Segregação de Funções (SoD), quem agenda ordens de pagamento não pode possuir privilégios de liberação de chave criptográfica. Falhas nesse ponto são a origem de fraudes volumosas.",
    context: "O gerente de filial recebeu os acessos de operador e autorizador no banco corporativo para 'destravar pagamentos urgentes de frete' sem precisar da matriz.",
    character: "Inspetoria de Governança",
    options: [
      { text: "Validar a autonomia local exigindo prestação de contas mensal com recibos escaneados.", xp: -30, impacts: { caixa: -30, margem: 0, compliance: -50 }, feedback: "VULNERABILIDADE CRÍTICA. Controles a posteriori não impedem desvios ou apropriação indevida." },
      { text: "Revogar o perfil de aprovação no banco. Delegar a liberação financeira exclusivamente para a Tesouraria Central.", xp: 42, impacts: { caixa: 0, margem: 0, compliance: 40 }, feedback: "BLINDAGEM EFETIVA. Eliminou o vetor de fraude e restaurou o compliance do sistema bancário." }
    ]
  },
  {
    id: 9,
    tier: 3,
    criticality: "Alta",
    points: 45,
    sector: "Tributário e Fiscal / Lucro Real",
    title: "Dedutibilidade de Contribuição Previdenciária Patronal",
    theory: "No Lucro Real, as contribuições da empresa para planos de previdência complementar dos empregados são dedutíveis da base de cálculo do IRPJ e da CSLL até o limite de 20% do total dos salários dos participantes.",
    context: "A empresa quer otimizar seu imposto de renda anual sem aumentar custos salariais diretos sujeitos a encargos do sistema S e FGTS.",
    character: "Planejamento Tributário",
    options: [
      { text: "Converter o montante pretendido em bônus em dinheiro pago diretamente no contracheque de fim de ano.", xp: -30, impacts: { caixa: -25, margem: -20, compliance: -10 }, feedback: "ONERAÇÃO FISCAL. Aumenta os encargos patronais sem benefício dedutível estrutural equivalente." },
      { text: "Estruturar aporte patronal em previdência fechada dentro do limite legal de 20%, gerando economia tributária no IRPJ.", xp: 45, impacts: { caixa: 10, margem: 25, compliance: 15 }, feedback: "EFICIÊNCIA TRIBUTÁRIA. Maximizou o escudo fiscal do Lucro Real gerando benefício de longo prazo." }
    ]
  },

  // --- TIER 4: C-LEVEL / CRITICIDADE MÁXIMA (CRITICIDADE: EXTREMA / 50 XP) ---
  {
    id: 10,
    tier: 4,
    criticality: "Extrema",
    points: 50,
    sector: "Previdência Complementar / Governança CNPC",
    title: "Migração de Regime: BD para Contribuição Definida (CD)",
    theory: "A manutenção de planos de Benefício Definido (BD) tornou-se inviável para corporações privadas. A transição para Contribuição Definida (CD) encerra o risco atuarial ilimitado da patrocinadora.",
    context: "O plano BD histórico da companhia ameaça consumir 25% do fluxo de caixa livre pelos próximos 10 anos devido a déficits contínuos de longevidade.",
    character: "Conselho de Administração",
    options: [
      { text: "Aportar capital extraordinário contínuo para sustentar a estrutura de Benefício Definido sem alterar os direitos.", xp: -45, impacts: { caixa: -50, margem: -40, compliance: 0 }, feedback: "DESTRUIÇÃO DE VALOR. O passivo continuará crescendo e consumindo a capacidade de investimento da companhia." },
      { text: "Aprovar plano formal de saldamento do plano BD e oferecer migração voluntária para Contribuição Definida (CD) via PREVIC.", xp: 50, impacts: { caixa: 20, margem: 30, compliance: 25 }, feedback: "DECISÃO ESTRATÉGICA. Estancou o risco atuarial futuro e protegeu a solvência da companhia no longo prazo." }
    ]
  },
  {
    id: 11,
    tier: 4,
    criticality: "Extrema",
    points: 50,
    sector: "M&A / Engenharia Financeira",
    title: "Alavancagem Ótima (WACC) em Leveraged Buyout",
    theory: "O custo do capital próprio (Ke) embute prêmio de risco superior à dívida (Kd). O LBO explora isso comprando empresas alavancadas pelas próprias aquisições, maximizando o ROE.",
    context: "A holding vai adquirir uma concorrente por R$ 40 Milhões. A empresa tem R$ 40M em caixa. O custo do equity é 19% e o sindicato de bancos oferece dívida a 11% a.a.",
    character: "Diretoria de M&A / Investment Banking",
    options: [
      { text: "Utilizar 100% de capital próprio do caixa livre para evitar qualquer registro de dívida no Balanço Consolidado.", xp: -40, impacts: { caixa: -70, margem: -20, compliance: 0 }, feedback: "ALOCAÇÃO INEFICIENTE. Desperdiçou o benefício fiscal da dívida e aumentou o WACC global." },
      { text: "Estruturar LBO com 30% de equity e 70% de dívida sênior com garantia nos ativos da adquirida, barateando o WACC.", xp: 50, impacts: { caixa: 20, margem: 35, compliance: 10 }, feedback: "ENGENHARIA DE CFO. Minimizou o custo de capital, capturou escudo fiscal e maximizou o ROE." }
    ]
  },
  {
    id: 12,
    tier: 4,
    criticality: "Extrema",
    points: 50,
    sector: "Finanças Estruturadas / Mercado",
    title: "Gestão de Covenants em Debêntures",
    theory: "Debêntures exigem conformidade contínua de covenants. O descumprimento permite aos credores declarar vencimento antecipado do passivo (Cross Default).",
    context: "A empresa tem alavancagem de 2,42x frente ao limite de 2,50x. A diretoria quer autorizar recompra agressiva de ações de R$ 15 Milhões no mercado aberto.",
    character: "Comitê de Finanças e RI",
    options: [
      { text: "Executar a recompra de ações assumindo que os credores renegociarão caso o índice atinja 2,65x.", xp: -50, impacts: { caixa: -80, margem: -10, compliance: -50 }, feedback: "RISCO DE RUÍNA. O rompimento do covenant permite aos debenturistas congelar as contas imediatamente." },
      { text: "Suspender recompra, reter liquidez e conter custos até o indicador recuar para 2,0x.", xp: 50, impacts: { caixa: 40, margem: 15, compliance: 40 }, feedback: "PRESERVAÇÃO DO VALOR. Garantiu a solidez contratual perante credores e evitou a antecipação da dívida." }
    ]
  }
];

export default function CodigoAzulGame() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
  // STATUS CORE
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(100);
  const [margem, setMargem] = useState(100);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastImpacts, setLastImpacts] = useState<any>(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null); // CORREÇÃO APLICADA AQUI
  const [sessionScenarios, setSessionScenarios] = useState<any[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v7') || '{}');
    if (db[nickname]) {
      db[nickname].data = { playerName, companyName, xp, caixa, margem, compliance, currentStage, sessionScenarios };
      localStorage.setItem('codigoAzul_Corp_v7', JSON.stringify(db));
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameStarted && sessionScenarios.length > 0 && !isGameOver) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, sessionScenarios, isGameOver]);

  const generateSessionPool = (currentTier: number) => {
    const eligibleScenarios = allScenarios.filter(s => 
      s.tier === currentTier || (currentTier > 1 && s.tier === currentTier - 1) || (currentTier < 4 && s.tier === currentTier + 1)
    );
    return shuffleArray(eligibleScenarios.length > 0 ? eligibleScenarios : allScenarios).slice(0, 10);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nickname.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanNickname || !cleanPassword) {
      setLoginError("Credenciais inválidas."); return;
    }

    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v7') || '{}');

    if (db[cleanNickname]) {
      if (db[cleanNickname].password === cleanPassword) {
        const d = db[cleanNickname].data;
        setPlayerName(d.playerName); setCompanyName(d.companyName);
        setXp(d.xp || 0); 
        setCaixa(d.caixa ?? 100); setMargem(d.margem ?? 100); setCompliance(d.compliance ?? 100);
        setCurrentStage(d.currentStage || 0); setSessionScenarios(d.sessionScenarios || []);
        
        if((d.caixa ?? 100) <= 0 || (d.compliance ?? 100) <= 0) {
           setIsGameOver(true);
        }
        
        setLoginError(""); setGameStarted(true);
      } else {
        setLoginError("Acesso negado. Senha incorreta.");
      }
    } else {
      const newCompany = generateCompanyName();
      const initialPool = generateSessionPool(1);
      db[cleanNickname] = {
        password: cleanPassword,
        data: { playerName: cleanNickname, companyName: newCompany, xp: 0, caixa: 100, margem: 100, compliance: 100, currentStage: 0, sessionScenarios: initialPool }
      };
      localStorage.setItem('codigoAzul_Corp_v7', JSON.stringify(db));
      
      setPlayerName(cleanNickname); setCompanyName(newCompany); 
      setXp(0); setCaixa(100); setMargem(100); setCompliance(100);
      setCurrentStage(0); setSessionScenarios(initialPool);
      setLoginError(""); setTimeLeft(60); setGameStarted(true); setIsGameOver(false);
    }
  };

  const handleLogout = () => {
    if(!isGameOver) saveToDB();
    setGameStarted(false); setNickname(""); setPassword(""); setLoginError("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false);
  };

  const handleManualSave = () => {
    saveToDB();
    setSaveStatus("DADOS GRAVADOS");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetCareer = () => {
    if (confirm("Confirma a liquidação da empresa? Seu XP e Status serão destruídos.")) {
      const newCompany = generateCompanyName();
      const initialPool = generateSessionPool(1);
      setCompanyName(newCompany); setXp(0); 
      setCaixa(100); setMargem(100); setCompliance(100);
      setCurrentStage(0); setSessionScenarios(initialPool);
      setFeedback(null); setPromotionPending(false); setTimeLeft(60); setIsGameOver(false); setLastImpacts(null);
    }
  };

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && gameStarted && currentLevel.hasTimer) {
      const timeoutImpacts = { caixa: -15, margem: -10, compliance: -10 };
      handleChoice(-15, "TEMPO ESGOTADO. Hesitação corporativa sob fogo inimigo destrói liquidez e afasta investidores.", true, timeoutImpacts);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, gameStarted, currentLevel.hasTimer]);

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
      newCaixa = Math.min(100, Math.max(0, caixa + impacts.caixa));
      newMargem = Math.min(100, Math.max(0, margem + impacts.margem));
      newCompliance = Math.min(100, Math.max(0, compliance + impacts.compliance));
    }

    setCaixa(newCaixa); setMargem(newMargem); setCompliance(newCompliance);
    setXp(newXp); setLastXpChange(totalXpGained); setTimeBonus(bonus); setLastImpacts(impacts);

    if (newCaixa <= 0) {
      setIsGameOver(true);
      setFeedback("FALÊNCIA DECRETADA. O caixa da companhia chegou a zero. Sem liquidez imediata, os credores travaram as operações e a empresa quebrou. Na alta gestão, uma tese brilhante sem gestão de caixa termina em liquidação.");
      return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true);
      setFeedback("INTERVENÇÃO REGULATÓRIA. O nível de compliance zerou. Devido a fraudes, sonegação ou descumprimento contínuo de normas, as contas foram bloqueadas e a diretoria afastada judicialmente.");
      return;
    }

    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true);
      setPromotedLevel(newCalculatedLevel);
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
      setCurrentStage(prev => prev + 1);
    } else {
      alert(`Ciclo de Auditoria Concluído!\n\nPatente Vigente: ${currentLevel.title}\nO sistema gerará o próximo lote de análises para você manter a empresa viva.`);
      const newPool = generateSessionPool(currentLevel.tier);
      setCurrentStage(0);
      setSessionScenarios(newPool);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">INICIALIZANDO TERMINAL CVM...</div>;

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
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador HUD de Sobrevivência</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">ID Operador</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="ceo.master" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Senha API</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            {loginError && <div className="text-amber-400 text-[11px] font-mono text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">{loginError}</div>}
            <button type="submit" className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 text-xs font-mono tracking-widest py-3.5 px-4 rounded-lg transition-all mt-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">CONECTAR AO TERMINAL</button>
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
          <h2 className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em] mb-2">Bloqueio Operacional Permanente</h2>
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 tracking-wide uppercase">
            {caixa <= 0 ? "FALÊNCIA DECRETADA" : "INTERVENÇÃO DA CVM"}
          </h1>
          <div className="bg-[#060202]/50 p-6 rounded-xl border border-red-900/40 mb-8 text-left">
            <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed text-justify border-l-2 border-red-500 pl-4">
              {feedback}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 hover:border-red-500 text-red-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              Liquidar CNPJ e Recomeçar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE PROMOÇÃO ---
  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-cyan-400 bg-slate-900 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <img src="https://images2.imgbox.com/71/2a/v5KjH8Lp_o.png" alt="Executivo" className="w-full h-full object-cover object-top" />
          </div>
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Conselho de Administração</h2>
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 tracking-wide uppercase">Promoção <span className="font-semibold text-cyan-400">Homologada</span></h1>
          
          <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-slate-800 mb-8 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="flex justify-between items-end border-b border-slate-800/80 pb-4 mb-4">
              <span className="text-slate-500 uppercase text-[10px] tracking-[0.2em] font-mono">Patente Adquirida</span>
              <span className="text-xl md:text-2xl font-semibold text-cyan-400">{promotedLevel?.title}</span>
            </div>
            <div className="space-y-4">
              <div><h3 className="text-cyan-500/80 font-mono uppercase text-[10px] tracking-widest mb-1">Parecer Favorável</h3><p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">{promotedLevel?.feedback?.forca}</p></div>
              <div><h3 className="text-amber-500/80 font-mono uppercase text-[10px] tracking-widest mb-1">Gargalo para Próximo Nível</h3><p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">{promotedLevel?.feedback?.vulnerabilidade}</p></div>
            </div>
          </div>
          <button onClick={proceedToNextQuestion} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">Assumir Operação</button>
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
        
        {/* HUD: SINAIS VITAIS DA EMPRESA */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Caixa (Liquidez)</span>
            <div className="h-2 w-full bg-[#020617] rounded-sm overflow-hidden border border-emerald-900/30">
              <div className={`h-full transition-all duration-700 ease-out ${caixa > 50 ? 'bg-emerald-500' : caixa > 25 ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} style={{ width: `${caixa}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Margem (Lucro)</span>
            <div className="h-2 w-full bg-[#020617] rounded-sm overflow-hidden border border-blue-900/30">
              <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${margem}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Compliance</span>
            <div className="h-2 w-full bg-[#020617] rounded-sm overflow-hidden border border-purple-900/30">
              <div className="h-full bg-purple-500 transition-all duration-700 ease-out" style={{ width: `${compliance}%` }}></div>
            </div>
          </div>
        </div>

        {/* HEADER CORPORATIVO */}
        <header className="bg-[#0f172a]/50 backdrop-blur-xl p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-xl border border-cyan-500/40 bg-slate-900 overflow-hidden shrink-0 hidden md:block">
              <img src="https://images2.imgbox.com/71/2a/v5KjH8Lp_o.png" alt="Avatar" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <h1 className="text-base font-light text-slate-100 tracking-[0.15em] uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1>
              <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Operador: <span className="text-slate-300">{playerName}</span></p>
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{currentLevel.title}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono tracking-widest">
                <span>XP: {xp}</span><span className="text-cyan-600">PROMOÇÃO: {nextLevel ? `${nextLevel.minXp}` : 'MAX'}</span>
              </div>
              <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 transition-all duration-1000 ease-out" style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* PAINEL DE OPERAÇÕES */}
        {!feedback ? (
          <main className="bg-[#0f172a]/40 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            {currentLevel.hasTimer ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#020617] rounded-t-2xl overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-linear ${timerColor} shadow-[0_0_10px_currentColor]`} style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
              </div>
            ) : null}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/5 pb-4 mt-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold">{scenario.sector}</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${scenario.criticality === 'Extrema' ? 'border-red-500/40 text-red-400 bg-red-950/20' : scenario.criticality === 'Alta' ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' : scenario.criticality === 'Média' ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' : 'border-slate-600/40 text-slate-400 bg-slate-900/30'}`}>
                    Nível de Risco: {scenario.criticality}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{scenario.title}</h2>
              </div>
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border border-slate-700/50 bg-[#020617]/50 px-3 py-1 rounded-md">{currentStage + 1}/{sessionScenarios.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5">
                <h3 className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> Embasamento Teórico</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{scenario.theory}</p>
              </div>
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                <h3 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2 relative z-10"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Contexto Corporativo Real</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify relative z-10">{scenario.context}</p>
              </div>
            </div>

            <div className="space-y-3">
              {scenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  disabled={isProcessing}
                  onClick={() => handleChoice(option.xp, option.feedback, false, option.impacts)}
                  className={`w-full text-left p-5 rounded-xl bg-[#020617]/50 border border-slate-700/50 transition-all group relative overflow-hidden ${isProcessing ? 'opacity-50' : 'hover:border-cyan-500/50 hover:bg-[#081229] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'}`}
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-sm font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          /* TELA DE FEEDBACK TÉCNICO COM RELATÓRIO DO HUD */
          <div className="bg-[#0f172a]/60 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative text-center">
            <div className={`absolute top-0 left-0 w-full h-1 ${lastXpChange && lastXpChange > 0 ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-500' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Parecer Conforme (Aprovado)' : 'Alerta de Irregularidade'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 tracking-wider mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {/* RELATÓRIO DE IMPACTO (HUD) */}
            {lastImpacts && (
              <div className="flex justify-center gap-4 md:gap-8 mb-8 border-y border-white/5 py-4 bg-[#020617]/30">
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Caixa</p>
                   <p className={`font-mono text-lg ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{lastImpacts.caixa}%</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Margem</p>
                   <p className={`font-mono text-lg ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{lastImpacts.margem}%</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Compliance</p>
                   <p className={`font-mono text-lg ${lastImpacts.compliance >= 0 ? 'text-purple-400' : 'text-red-400'}`}>{lastImpacts.compliance >= 0 ? '+' : ''}{lastImpacts.compliance}%</p>
                 </div>
              </div>
            )}

            <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-2xl mx-auto relative">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">Auditoria: {scenario.character}</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={handleNextStageOrPromotion} className="bg-transparent border border-slate-600 hover:border-cyan-400 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono tracking-[0.3em] py-3.5 px-10 rounded-xl transition-all uppercase hover:bg-cyan-950/20">
              {promotionPending ? "Ver Avaliação de Patente" : "Próximo Parecer"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleManualSave} className="text-[9px] text-cyan-600/60 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">{saveStatus || "Gravar Sessão"}</button>
          <span className="text-slate-800">/</span><button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Logout</button>
          <span className="text-slate-800">/</span><button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Resetar Carreira</button>
        </div>

      </div>
    </div>
  );
}