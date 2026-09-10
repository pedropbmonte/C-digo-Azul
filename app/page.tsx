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
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos e provisões trabalhistas/previdenciárias." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de encargos atuariais corporativos." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPC 33, compliance com a PREVIC e proteção cambial." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento com o conselho." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias e macroeconômicas." } }
];

// --- EVENTOS CISNE NEGRO (CHOQUES MACROECONÔMICOS) ---
const blackSwans = [
  { title: "CHOQUE MACROECONÔMICO", text: "O Banco Central aumentou a Selic em 1.5% em reunião extraordinária. O custo da dívida flutuante da empresa explodiu, corroendo a margem.", impacts: { caixa: -350000, margem: -1.5, compliance: 0 } },
  { title: "ATAQUE RANSOMWARE", text: "Os servidores sofreram uma tentativa de invasão (Phishing). A operação foi paralisada por 12 horas para contenção, gerando perda de faturamento e multas de atraso.", impacts: { caixa: -250000, margem: -0.8, compliance: -10 } },
  { title: "QUEBRA DE CADEIA LOGÍSTICA", text: "Um fornecedor chinês essencial decretou falência abruptamente. A compra emergencial de insumos no mercado interno para não parar a fábrica esvaziou o caixa.", impacts: { caixa: -600000, margem: -2.5, compliance: 0 } },
  { title: "PASSIVO TRABALHISTA OCULTO", text: "O STF mudou o entendimento sobre a base de cálculo de um encargo da folha. Um passivo retroativo de 5 anos atingiu o balanço da companhia de surpresa.", impacts: { caixa: -400000, margem: 0, compliance: -15 } }
];

// --- BANCO DE DADOS DINÂMICO ---
const allScenarios = [
  {
    id: 1, tier: 1, criticality: "Baixa", points: 20, sector: "Tesouraria / Gestão de Caixa",
    title: "O Descasamento do Ciclo Operacional",
    theory: "Crescer sem capital de giro consome a liquidez imediata, desencadeando risco de insolvência, independente do volume faturado.",
    context: "Vendas cresceram 35%, mas o caixa está vermelho. Fornecedores exigem 15 dias, clientes pagam em 60 dias.", character: "Supervisão de Tesouraria",
    options: [
      { text: "Captar cheque especial corporativo para cobrir os boletos.", xp: -15, impacts: { caixa: 500000, margem: -2.5, compliance: -5 }, feedback: "INVIÁVEL. Você estancou a sangria com dívida cara, destruindo sua margem." },
      { text: "Antecipar recebíveis com trava de spread e realinhar prazos.", xp: 20, impacts: { caixa: 1200000, margem: -0.5, compliance: 10 }, feedback: "PRECISO. Trouxe liquidez com sacrifício mínimo de margem." }
    ]
  },
  {
    id: 2, tier: 1, criticality: "Baixa", points: 22, sector: "Contas a Pagar",
    title: "A Arbitragem do Desconto",
    theory: "Deixar de capturar um desconto que supera o rendimento do CDI é destruição direta de margem.",
    context: "Fornecedor oferece 2,5% de abatimento para pagamento hoje (R$ 2M). O caixa rende 0,85% ao mês.", character: "Mesa de Pagamentos",
    options: [
      { text: "Recusar desconto e manter saldo aplicado até o vencimento.", xp: -10, impacts: { caixa: 0, margem: -1.2, compliance: 0 }, feedback: "EQUÍVOCO. Sacrificou spread financeiro e espremeu a margem." },
      { text: "Resgatar saldo e liquidar capturando o desconto.", xp: 22, impacts: { caixa: -1950000, margem: 1.6, compliance: 0 }, feedback: "EFICIENTE. A saída antecipada gerou ganho financeiro direto para o resultado." }
    ]
  },
  {
    id: 3, tier: 1, criticality: "Baixa", points: 25, sector: "Folha e Encargos",
    title: "Tabela Progressiva (EC 103)",
    theory: "Erros no cálculo progressivo do INSS via eSocial geram autos de infração pela Receita Federal.",
    context: "O RH fechou a folha aplicando alíquota cheia (14%), gerando desconto indevido de funcionários.", character: "Auditoria Interna",
    options: [
      { text: "Manter retenção e compensar no próximo ano.", xp: -15, impacts: { caixa: 0, margem: 0, compliance: -35 }, feedback: "IRREGULAR. Retenção indevida gera passivo e multas federais pesadas." },
      { text: "Retificar eSocial e estornar a diferença aos colaboradores.", xp: 25, impacts: { caixa: -85000, margem: 0, compliance: 20 }, feedback: "CORRETO. Gastou caixa nos estornos, mas blindou o CNPJ." }
    ]
  },
  {
    id: 4, tier: 2, criticality: "Média", points: 30, sector: "Controladoria / CPC 16",
    title: "Custeio ABC",
    theory: "O rateio linear mascara a ineficiência de produtos sob medida. O ABC aloca despesas conforme a demanda real.",
    context: "Linha padrão e Linha sob medida dão '18% de lucro'. Mas a sob medida consome 4x mais manutenção.", character: "Controladoria Operacional",
    options: [
      { text: "Reajustar linearmente os preços de ambas as linhas em 10%.", xp: -20, impacts: { caixa: -300000, margem: -2.0, compliance: 0 }, feedback: "FALHA ESTRATÉGICA. Encareceu o produto eficiente e perdeu vendas." },
      { text: "Reprecificar via ABC apenas a linha sob medida.", xp: 30, impacts: { caixa: 650000, margem: 3.5, compliance: 10 }, feedback: "ESTRATÉGICO. Isolou a ineficiência e destravou a rentabilidade." }
    ]
  },
  {
    id: 5, tier: 2, criticality: "Média", points: 32, sector: "RH / Previdência",
    title: "Retenção com Vesting",
    theory: "Cláusulas de Vesting condicionam o repasse do aporte patronal ao tempo de casa, protegendo o caixa.",
    context: "A empresa lançará previdência 1:1, mas teme financiar executivos que saem após 1 ano.", character: "Comitê de Remuneração",
    options: [
      { text: "Permitir resgate total dos aportes imediatamente em caso de demissão.", xp: -20, impacts: { caixa: -1200000, margem: -1.5, compliance: 0 }, feedback: "PREJUÍZO. A companhia financiou a concorrência sem reter talentos." },
      { text: "Instituir Vesting progressivo (100% após 5 anos).", xp: 32, impacts: { caixa: 450000, margem: 1.0, compliance: 15 }, feedback: "EXCELENTE. Alinhou RH à sustentabilidade de caixa." }
    ]
  },
  {
    id: 6, tier: 2, criticality: "Média", points: 35, sector: "Gestão de Risco / PDD",
    title: "Perdas Esperadas (PECLD)",
    theory: "O IFRS 9 exige provisão baseada em perda esperada, não apenas no atraso consumado.",
    context: "Venda a prazo recorde para redes em crise. Diretoria não quer lançar provisão antes do vencimento.", character: "Risco e Crédito",
    options: [
      { text: "Adiar a provisão até os títulos completarem 90 dias de atraso.", xp: -25, impacts: { caixa: -800000, margem: 2.0, compliance: -40 }, feedback: "DESCOMPLIANCE. Ocultar risco infla a margem irreal e frauda o balanço." },
      { text: "Lançar a PECLD pelo risco histórico, impactando o lucro hoje.", xp: 35, impacts: { caixa: 0, margem: -3.0, compliance: 40 }, feedback: "RIGOR TÉCNICO. Golpe na margem, mas transparência total garantida." }
    ]
  },
  {
    id: 7, tier: 3, criticality: "Alta", points: 40, sector: "Contabilidade / CPC 33",
    title: "Déficit Atuarial (BD)",
    theory: "Déficits em fundos de pensão patrocinados devem ser reconhecidos como passivo na holding.",
    context: "Fundo de pensão apurou déficit de R$ 18 Milhões. A diretoria quer excluir a obrigação do balanço.", character: "Auditoria CVM",
    options: [
      { text: "Omitir déficit do balanço e esconder em notas explicativas.", xp: -35, impacts: { caixa: 0, margem: 0, compliance: -60 }, feedback: "RESSALVA GRAVE. Omitir R$ 18M destrói a credibilidade com auditores." },
      { text: "Reconhecer passivo pelo valor justo e aprovar equacionamento.", xp: 40, impacts: { caixa: -2500000, margem: -4.0, compliance: 50 }, feedback: "GOVERNANÇA. A dor no caixa inicial salva o compliance institucional." }
    ]
  },
  {
    id: 8, tier: 3, criticality: "Alta", points: 42, sector: "Compliance / SoD",
    title: "Segregação de Funções Bancárias",
    theory: "Quem cadastra não aprova. Falhas no SoD permitem desvios e fraudes milionárias.",
    context: "Gerente de filial ganhou perfil de 'cadastro' e 'autorizador' no banco para 'agilizar' fretes.", character: "Inspetoria",
    options: [
      { text: "Validar autonomia local com auditoria de recibos impressos.", xp: -30, impacts: { caixa: -1800000, margem: -1.0, compliance: -50 }, feedback: "FRAUDE. O controle físico não impediu um desvio de R$ 1.8M." },
      { text: "Revogar acesso. Filial cadastra, Tesouraria Central aprova.", xp: 42, impacts: { caixa: 0, margem: 0, compliance: 35 }, feedback: "BLINDAGEM. Vetor de fraude corporativa eliminado imediatamente." }
    ]
  },
  {
    id: 9, tier: 3, criticality: "Alta", points: 45, sector: "Tributário / Lucro Real",
    title: "Dedutibilidade de Previdência",
    theory: "Aportes patronais (até 20% da folha) são dedutíveis do IRPJ/CSLL, gerando eficiência tributária.",
    context: "Empresa repassará R$ 3 Milhões a executivos e quer evitar a explosão de encargos diretos.", character: "Comitê Tributário",
    options: [
      { text: "Pagar como bônus cash (PLR) irrestrito em dezembro.", xp: -30, impacts: { caixa: -3800000, margem: -2.5, compliance: -10 }, feedback: "ONERAÇÃO. Elevou encargos. Os R$ 3M viraram quase R$ 4M de custo real." },
      { text: "Estruturar repasse como aporte em previdência fechada.", xp: 45, impacts: { caixa: 1500000, margem: 3.5, compliance: 15 }, feedback: "EFICIÊNCIA TRIBUTÁRIA. A dedutibilidade gerou economia de milhões em imposto." }
    ]
  },
  {
    id: 10, tier: 4, criticality: "Extrema", points: 50, sector: "M&A / Engenharia",
    title: "Leveraged Buyout (LBO)",
    theory: "Dívida bancária gera escudo fiscal e custa menos que o capital do sócio (Ke).",
    context: "Aquisição de concorrente por R$ 25 Milhões. Custo do Sócio é 19%, Banco é 11%.", character: "Diretoria M&A",
    options: [
      { text: "Liquidar à vista com caixa próprio para evitar dívidas.", xp: -40, impacts: { caixa: -25000000, margem: -4.0, compliance: 0 }, feedback: "MIOPIA DE ALOCAÇÃO. Sangrou o caixa com o capital mais caro da firma." },
      { text: "Estruturar LBO: 30% caixa, 70% banco garantido pela operação.", xp: 50, impacts: { caixa: -7500000, margem: 4.5, compliance: 10 }, feedback: "ENGENHARIA CFO. Usou dinheiro barato, capturou escudo fiscal e maximizou ROE." }
    ]
  },
  {
    id: 11, tier: 4, criticality: "Extrema", points: 50, sector: "Finanças / Dívida",
    title: "Covenants e Cross Default",
    theory: "Romper limite de Dívida/Ebitda permite ao banco executar a dívida inteira à vista.",
    context: "Limite do Covenant é 2,5x. O índice atual está em 2,42x. Diretoria quer torrar R$ 8 Milhões em Marketing.", character: "Relações com Investidores",
    options: [
      { text: "Aprovar campanha e queimar o caixa.", xp: -50, impacts: { caixa: -8000000, margem: -2.0, compliance: -60 }, feedback: "SUICÍDIO INSTITUCIONAL. O covenant estourou e o banco congelou as contas." },
      { text: "Vetar campanha e reter liquidez até o índice recuar para 2,0x.", xp: 50, impacts: { caixa: 4500000, margem: 1.5, compliance: 40 }, feedback: "PRESERVAÇÃO DO CNPJ. Sobrevivência antecede o marketing irresponsável." }
    ]
  },
  {
    id: 12, tier: 4, criticality: "Extrema", points: 50, sector: "Previdência / CVM",
    title: "Transição de Risco Atuarial",
    theory: "Planos de Benefício Definido (BD) geram risco ilimitado. Migrar para Contribuição Definida (CD) trava a sangria.",
    context: "Plano BD da empresa apura déficits bilionários por longevidade, ameaçando o caixa futuro.", character: "Conselho de Administração",
    options: [
      { text: "Aportar capital extraordinário anualmente.", xp: -45, impacts: { caixa: -6500000, margem: -5.0, compliance: 0 }, feedback: "SANGRAMENTO LENTO. Injetou R$ 6.5M e o rombo continua crescendo." },
      { text: "Saldar plano BD e migrar para modelo CD.", xp: 50, impacts: { caixa: 3000000, margem: 4.0, compliance: 25 }, feedback: "VISÃO PERPÉTUA. Encerrou risco atuarial e blindou as finanças." }
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
  
  // STATUS CORE (Cifras Reais)
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(5000000);
  const [margem, setMargem] = useState(20.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastImpacts, setLastImpacts] = useState<any>(null);

  // NOVOS ESTADOS (Consultoria, Cisne Negro, DRE)
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

  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v9') || '{}');
    if (db[nickname]) {
      db[nickname].data = { 
        playerName, companyName, xp, caixa, margem, compliance, 
        currentStage, sessionScenarios, sessionStartStats, showDRE 
      };
      localStorage.setItem('codigoAzul_Corp_v9', JSON.stringify(db));
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
    return shuffleArray(eligibleScenarios.length > 0 ? eligibleScenarios : allScenarios).slice(0, 10);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nickname.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanNickname || !cleanPassword) { setLoginError("Credenciais inválidas."); return; }

    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v9') || '{}');

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
        setLoginError(""); setGameStarted(true);
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
      localStorage.setItem('codigoAzul_Corp_v9', JSON.stringify(db));
      
      setPlayerName(cleanNickname); setCompanyName(newCompany); 
      setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setSessionScenarios(initialPool);
      setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setLoginError(""); setTimeLeft(60); setGameStarted(true); setIsGameOver(false); setShowDRE(false);
    }
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
      handleChoice(-15, "TEMPO ESGOTADO. Hesitação corporativa sob fogo inimigo destrói liquidez.", true, timeoutImpacts);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentBlackSwan, gameStarted, currentLevel.hasTimer]);

  const handleConsultoria = () => {
    if (caixa < 50000 || isProcessing || isGameOver) return;
    setIsProcessing(true);
    
    const scenario = sessionScenarios[currentStage];
    const correctOption = scenario.options.reduce((prev: any, curr: any) => (prev.xp > curr.xp) ? prev : curr);
    
    const combinedImpacts = {
      caixa: (correctOption.impacts?.caixa || 0) - 50000, // Custo da consultoria
      margem: correctOption.impacts?.margem || 0,
      compliance: correctOption.impacts?.compliance || 0,
    };

    handleChoice(correctOption.xp, `💡 PARECER DA CONSULTORIA (Custo: R$ 50k): ${correctOption.feedback}`, false, combinedImpacts);
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
      setIsGameOver(true); setFeedback("FALÊNCIA DECRETADA. O caixa da companhia foi aniquilado."); return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA. O nível de compliance zerou."); return;
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
      // Chance de Cisne Negro entre as fases (20% de chance a partir do Tier 2)
      if (Math.random() < 0.20 && currentLevel.tier >= 2) {
        const randomSwan = blackSwans[Math.floor(Math.random() * blackSwans.length)];
        setCurrentBlackSwan(randomSwan);
      } else {
        setCurrentStage(prev => prev + 1);
      }
    } else {
      setShowDRE(true); // Exibe o DRE Gamificado no final da sessão
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
      setIsGameOver(true); setFeedback("FALÊNCIA DECRETADA POR CHOQUE EXTERNO. O caixa não resistiu à volatilidade do mercado."); return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA PÓS-CRISE. A empresa colapsou sob o peso regulatório."); return;
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
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador Fiduciário Corporativo</p>
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
            {caixa <= 0 ? "FALÊNCIA DECRETADA" : "INTERVENÇÃO REGULATÓRIA"}
          </h1>
          <div className="bg-[#060202]/50 p-6 rounded-xl border border-red-900/40 mb-8 text-left">
            <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed text-justify border-l-2 border-red-500 pl-4">{feedback}</p>
          </div>
          <div className="flex justify-center">
             <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 hover:border-red-500 text-red-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">Liquidar CNPJ e Recomeçar</button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DRE GAMIFICADO ---
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
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Relatório Gerencial</h2>
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 tracking-wide uppercase">Fechamento do <span className="font-semibold text-cyan-400">Trimestre</span></h1>
          
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left space-y-4 font-mono">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500 text-xs">Caixa Inicial:</span><span className="text-slate-300 text-xs">{formatBRL(sessionStartStats.caixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500 text-xs">Caixa Final:</span><span className="text-slate-300 text-xs">{formatBRL(caixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 bg-slate-900/30 p-2 rounded">
              <span className="text-slate-400 text-xs font-bold">Geração de Caixa Livre (FCF):</span>
              <span className={`text-sm font-bold ${deltaCaixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{deltaCaixa >= 0 ? '+' : ''}{formatBRL(deltaCaixa)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 pt-2">
              <span className="text-slate-500 text-xs">Variação de Margem:</span>
              <span className={`text-xs font-bold ${deltaMargem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{deltaMargem >= 0 ? '+' : ''}{formatPct(deltaMargem)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500 text-xs">XP Executivo Total:</span><span className="text-cyan-400 text-xs font-bold">{xp} XP</span>
            </div>
          </div>
          <button onClick={handleStartNewQuarter} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">Assinar Balanço & Iniciar Novo Ciclo</button>
        </div>
      </div>
    );
  }

  // --- TELA DE CISNE NEGRO ---
  if (currentBlackSwan) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="z-10 bg-[#170f0f]/90 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-red-900/50 shadow-2xl max-w-2xl w-full text-center">
          <div className="text-red-500 text-6xl mb-6">📉</div>
          <h2 className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em] mb-2">Alerta de Cisne Negro</h2>
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 tracking-wide uppercase">{currentBlackSwan.title}</h1>
          <div className="bg-[#060202]/50 p-6 rounded-xl border border-red-900/40 mb-8 text-left">
            <p className="text-slate-300 text-sm font-light leading-relaxed text-justify border-l-2 border-red-500 pl-4 mb-4">{currentBlackSwan.text}</p>
            <div className="font-mono text-[10px] text-red-400 border-t border-red-900/50 pt-4 mt-4">
               Impacto no Caixa: {formatBRL(currentBlackSwan.impacts.caixa)}<br/>
               Impacto na Margem: {formatPct(currentBlackSwan.impacts.margem)}
            </div>
          </div>
          <button onClick={handleAcknowledgeBlackSwan} className="bg-red-950/50 border border-red-800 hover:border-red-500 text-red-400 text-xs font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">Absorver Impacto e Prosseguir</button>
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
        
        {/* HUD FINANCEIRO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-lg">
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
               <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Compliance & Risco</span>
               <span className={`text-xs font-bold font-mono ${compliance >= 80 ? 'text-purple-400' : 'text-amber-400'}`}>{compliance}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-purple-900/30">
              <div className={`h-full transition-all duration-700 ease-out ${compliance > 60 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${compliance}%` }}></div>
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
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border border-slate-700/50 bg-[#020617]/50 px-3 py-1 rounded-md">Passo {currentStage + 1}/10</span>
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
              
              {/* BOTÃO LIFELINE: CONSULTORIA */}
              <div className="pt-4 border-t border-white/5 mt-4">
                <button
                  disabled={isProcessing || caixa < 50000}
                  onClick={handleConsultoria}
                  className={`w-full text-center p-3 rounded-lg border transition-all font-mono text-[10px] tracking-widest uppercase ${isProcessing || caixa < 50000 ? 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-amber-950/20 border-amber-800/50 text-amber-500 hover:bg-amber-900/40 hover:border-amber-500'}`}
                >
                  📞 Acionar Consultoria Técnica Pedro Monte (Custo: R$ 50.000)
                </button>
              </div>
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

            {lastImpacts && (
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8 border-y border-white/5 py-5 bg-[#020617]/30">
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Caixa</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Margem</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Compliance</p>
                   <p className={`font-mono text-lg md:text-xl font-bold ${lastImpacts.compliance >= 0 ? 'text-purple-400' : 'text-red-400'}`}>{lastImpacts.compliance >= 0 ? '+' : ''}{lastImpacts.compliance}%</p>
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