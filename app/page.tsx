"use client";

import { useState, useEffect } from "react";
// IMPORTAÇÕES DO FIREBASE
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- CONFIGURAÇÃO DO FIREBASE (SEU DATA CENTER) ---
const firebaseConfig = {
  apiKey: "AIzaSyB79sktVNzvTvntgeh4xIdIFaPRTwviZEM",
  authDomain: "codigo-azul-erp.firebaseapp.com",
  projectId: "codigo-azul-erp",
  storageBucket: "codigo-azul-erp.firebasestorage.app",
  messagingSenderId: "180459648575",
  appId: "1:180459648575:web:d2fedafe0eba452b76aa8a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CHAVE DE API DO GOOGLE GEMINI ---
const GEMINI_API_KEY = "AQ.Ab8RN6IlD5wf8Me0nDtLf1TJ_krl6vU760sU0yjFpfiSu3bMyw";

// --- FORMATADORES FINANCEIROS ---
const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};
const formatPct = (value: number) => {
  return value.toFixed(1).replace('.', ',') + '%';
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

// --- EVENTOS CISNE NEGRO ---
const blackSwans = [
  { title: "CHOQUE MACROECONÔMICO", text: "O Banco Central aumentou a Selic em 1.5% em reunião extraordinária. O custo da dívida flutuante da empresa explodiu, corroendo a margem e drenando o caixa operacional instantaneamente.", impacts: { caixa: -350000, margem: -1.5, compliance: 0 } },
  { title: "ATAQUE RANSOMWARE", text: "Os servidores sofreram uma tentativa de invasão (Phishing). A operação foi paralisada por 12 horas para contenção do vazamento de dados, gerando perda de faturamento e exposição regulatória.", impacts: { caixa: -250000, margem: -0.8, compliance: -10 } },
  { title: "QUEBRA DE CADEIA LOGÍSTICA", text: "Um fornecedor crítico asiático decretou falência abruptamente. A necessidade de compra emergencial de insumos no mercado interno para não parar a fábrica esvaziou as reservas de caixa.", impacts: { caixa: -600000, margem: -2.5, compliance: 0 } },
  { title: "PASSIVO TRABALHISTA OCULTO", text: "O STF alterou a jurisprudência sobre a base de cálculo de um encargo da folha de pagamento. Um passivo retroativo de 5 anos atingiu o balanço da companhia de surpresa.", impacts: { caixa: -400000, margem: 0, compliance: -15 } }
];

export default function CodigoAzulGame() {
  // --- ESTADOS DE AUTENTICAÇÃO E ONBOARDING ---
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [needsCompanySetup, setNeedsCompanySetup] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [playerNameInput, setPlayerNameInput] = useState("");

  // --- ESTADOS CORE DO JOGO ---
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

  // --- MOTOR IA DINÂMICO ---
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FUNÇÕES DE BANCO DE DADOS (FIRESTORE) ---
  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { 
          playerName, phone: telefone, email: email.toLowerCase(),
          companyName, xp, caixa, margem, compliance, 
          currentStage, sessionStartStats, showDRE 
        }
      });
    } catch (e) {
      console.error("Erro no Data Center: ", e);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Salva no banco sempre que um turno termina
  useEffect(() => {
    if (gameStarted && !isGameOver && !currentBlackSwan) {
      saveToDB();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE, currentBlackSwan]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];

  // --- MOTOR GERADOR DE CENÁRIOS IA ---
  const fetchScenarioFromAI = async () => {
    setIsGeneratingScenario(true);
    setCurrentScenario(null);
    setFeedback(null);
    setIsProcessing(false);
    setTimeLeft(60); // Reseta o timer enquanto gera

    const temasPorTier: any = {
      1: "Tesouraria, Contas a Pagar/Receber, Capital de Giro, Retenções Simples (EC 103), Conciliação.",
      2: "Custeio ABC, Margem de Contribuição, Provisões de PDD (IFRS 9), Vesting de RH, Orçamento Base Zero.",
      3: "CPC 33 (Passivo Atuarial), Compliance SoD, IFRS 15 (Receita), Reforma Tributária (IVA Dual, IBS/CBS, Transição).",
      4: "M&A, LBO (Leveraged Buyout), Covenants Restritivos, Imposto Seletivo, Migração de Risco Atuarial (BD para CD)."
    };

    const temaNivel = temasPorTier[currentLevel.tier] || temasPorTier[1];

    const prompt = `Você é o arquiteto do simulador de negócios 'Código Azul'. Crie um cenário corporativo inédito, altamente técnico, complexo e realista em formato JSON ESTRITO.
    O jogador atual atua como: ${currentLevel.title} (Tier ${currentLevel.tier}).
    A empresa se chama: ${companyName}.
    Temas obrigatórios para este nível: ${temaNivel}. Escolha 1 ou 2 temas para aprofundar.
    
    Atenção: O campo 'theory' deve ser denso, com vocabulário de 'alta gestão' e referenciar explicitamente normas (CPCs, IFRS, EC 132/Reforma Tributária, CVM, BCB).
    
    Você deve fornecer exatamente 2 opções de decisão. 
    Uma opção DEVE ser ESTRATEGICAMENTE CORRETA (xp positivo, ex: 35) com impactos favoráveis de médio/longo prazo no caixa, margem ou compliance.
    A outra opção DEVE ser UMA ARMADILHA COMUM DE GESTÃO (xp negativo, ex: -30) que resolve algo rápido mas destrói a empresa (impactos negativos drásticos no caixa, margem ou compliance).

    O JSON final deve obedecer EXATAMENTE esta estrutura, sem crases Markdown (como \`\`\`json) e sem quebras de linha fora das strings:
    {
      "sector": "Nome do Setor Auditado",
      "criticality": "Alta",
      "title": "Título Dramático do Problema",
      "theory": "Texto longo, técnico e denso com a base teórica e regulatória da situação...",
      "context": "Contexto do problema que explodiu na empresa agora...",
      "character": "Nome do Comitê ou Diretor cobrando a ação",
      "options": [
        {
          "text": "Ação detalhada A...",
          "xp": 40,
          "impacts": { "caixa": 1500000, "margem": 2.5, "compliance": 10 },
          "feedback": "Parecer longo explicando por que a decisão foi brilhante ou desastrosa."
        },
        {
          "text": "Ação detalhada B...",
          "xp": -40,
          "impacts": { "caixa": -2500000, "margem": -4.0, "compliance": -30 },
          "feedback": "Parecer longo explicando por que a decisão foi brilhante ou desastrosa."
        }
      ]
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!response.ok) throw new Error("Erro na API do Gemini");

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      
      // Limpeza de Markdown indesejado que a IA possa enviar
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsedScenario = JSON.parse(aiText);
      
      // Embaralha as opções para não viciar a resposta (a certa nunca ficará sempre na mesma posição)
      parsedScenario.options = shuffleArray(parsedScenario.options);
      
      setCurrentScenario(parsedScenario);
    } catch (error) {
      console.error("Falha ao gerar cenário IA:", error);
      // Fallback seguro de emergência em caso de queda da API
      setCurrentScenario({
        sector: "Compliance & TI", criticality: "Extrema", title: "Falha de Conexão com Servidor CVM",
        theory: "O fluxo contínuo de dados exige contingência constante.",
        context: "A comunicação com o Data Center Central (IA) sofreu timeout. Tome uma decisão operacional imediata.",
        character: "Auditoria Sistêmica",
        options: shuffleArray([
          { text: "Acionar os protocolos de contingência manuais e reestabelecer o ciclo.", xp: 20, impacts: { caixa: 0, margem: 0, compliance: 10 }, feedback: "Eficiência tática. Sistema restabelecido." },
          { text: "Parar a empresa até que a TI global resolva o problema.", xp: -20, impacts: { caixa: -100000, margem: -1.0, compliance: -10 }, feedback: "Operação parada perde margem. Decisão ineficiente." }
        ])
      });
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // Aciona a IA sempre que a fase avança e precisa de uma nova questão
  useEffect(() => {
    if (gameStarted && !isGameOver && !showDRE && !feedback && !promotionPending && !currentBlackSwan && !currentScenario && !isGeneratingScenario) {
      fetchScenarioFromAI();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, currentStage, isGameOver, showDRE, feedback, promotionPending, currentBlackSwan, currentScenario, isGeneratingScenario]);


  // --- CONTROLE DE AUTENTICAÇÃO ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanEmail || !cleanPassword) { setAuthError("Preencha todos os campos obrigatórios."); return; }
    if (authMode === 'register' && (!nome.trim() || !telefone.trim())) {
      setAuthError("Preencha Nome e Telefone para concluir o cadastro."); return;
    }

    setIsAuthenticating(true);
    setAuthError("");

    try {
      const docRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(docRef);

      if (authMode === 'login') {
        if (docSnap.exists() && docSnap.data().password === cleanPassword) {
          const d = docSnap.data().data;
          setPlayerName(d.playerName); setTelefone(d.phone || "");
          
          if (!d.companyName) {
            setPlayerNameInput(d.playerName || "");
            setNeedsCompanySetup(true);
          } else {
            setCompanyName(d.companyName);
            setXp(d.xp || 0); 
            setCaixa(d.caixa ?? 5000000); setMargem(d.margem ?? 20.0); setCompliance(d.compliance ?? 100);
            setCurrentStage(d.currentStage || 0); 
            setSessionStartStats(d.sessionStartStats || { caixa: d.caixa ?? 5000000, margem: d.margem ?? 20.0 });
            setShowDRE(d.showDRE || false);
            setCurrentScenario(null); // Vai forçar a geração de um cenário novo
            
            if((d.caixa ?? 5000000) <= 0 || (d.compliance ?? 100) <= 0) setIsGameOver(true);
            setGameStarted(true);
          }
        } else {
          setAuthError("E-mail ou senha incorretos.");
        }
      } else {
        // MODO REGISTRO
        if (docSnap.exists()) {
          setAuthError("E-mail já cadastrado na base. Faça login.");
        } else {
          await setDoc(docRef, {
            password: cleanPassword,
            data: { 
              playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail,
              companyName: "", xp: 0, 
              caixa: 5000000, margem: 20.0, compliance: 100, 
              currentStage: 0,
              sessionStartStats: { caixa: 5000000, margem: 20.0 }, showDRE: false
            }
          });
          
          setPlayerName(nome.trim());
          setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
          setCurrentStage(0); 
          setSessionStartStats({ caixa: 5000000, margem: 20.0 });
          
          setPlayerNameInput(nome.trim());
          setNeedsCompanySetup(true);
        }
      }
    } catch (e) {
      console.error(e);
      setAuthError("Falha de conexão com o banco de dados em nuvem.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameInput.trim() || !playerNameInput.trim()) return;
    
    setCompanyName(companyNameInput.trim());
    setPlayerName(playerNameInput.trim());
    setNeedsCompanySetup(false);
    setCurrentScenario(null);
    setTimeLeft(60); 
    setGameStarted(true); 
    setIsGameOver(false); 
    setShowDRE(false);
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false);
    setEmail(""); setPassword(""); setAuthError(""); setNome(""); setTelefone("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false); setShowDRE(false); setCurrentBlackSwan(null); setCurrentScenario(null);
  };

  const handleManualSave = async () => {
    await saveToDB(); setSaveStatus("DADOS AUDITADOS NA NUVEM"); setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetCareer = () => {
    if (confirm("Confirma a liquidação da empresa? Seu histórico no Cloud Database será reiniciado.")) {
      setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null);
      setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setFeedback(null); setPromotionPending(false); setIsGameOver(false); setLastImpacts(null); setShowDRE(false); setCurrentBlackSwan(null);
      setGameStarted(false);
      setCompanyNameInput("");
      setPlayerNameInput(playerName);
      setNeedsCompanySetup(true);
    }
  };

  // --- MECÂNICA DE TEMPO ---
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || showDRE || currentBlackSwan || !currentScenario || isGeneratingScenario || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, showDRE, currentBlackSwan, currentScenario, isGeneratingScenario, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && !showDRE && !currentBlackSwan && currentScenario && gameStarted && currentLevel.hasTimer) {
      const timeoutImpacts = { caixa: -500000, margem: -1.5, compliance: -10 };
      handleChoice(-15, "TEMPO ESGOTADO. Hesitação corporativa sob fogo inimigo destrói liquidez e afasta investidores.", true, timeoutImpacts);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentBlackSwan, currentScenario, gameStarted, currentLevel.hasTimer]);

  // --- MENTORIA IA (CHAT INTEGRADO) ---
  const handleConsultoriaIA = async () => {
    if (caixa < 50000 || isProcessing || isGameOver || !currentScenario) return;
    setIsProcessing(true);
    
    // Identifica qual é a opção correta para pontuar e aplicar o impacto
    const correctOption = currentScenario.options.reduce((prev: any, curr: any) => (prev.xp > curr.xp) ? prev : curr);
    
    const combinedImpacts = {
      caixa: (correctOption.impacts?.caixa || 0) - 50000, // Custo da consultoria debitado
      margem: correctOption.impacts?.margem || 0,
      compliance: correctOption.impacts?.compliance || 0,
    };

    try {
      const prompt = `Você é Pedro Monte, Estrategista de Negócios. O jogador pagou R$ 50.000 virtuais pela sua consultoria no jogo 'Código Azul'.
      Cenário: ${currentScenario.context}
      Opção Correta que o jogador deve tomar: ${correctOption.text}
      Feedback que você deve elaborar em cima: ${correctOption.feedback}
      Sua missão: Escreva um conselho curto, de 'Dono para Dono', dando um choque de realidade técnico e financeiro. Diga claramente ao jogador o que ele deve fazer, referenciando a opção correta de forma indireta e termine com "CÓDIGO AZUL."`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8 }
        })
      });

      if (!response.ok) throw new Error("Falha na API da IA");

      const data = await response.json();
      const aiFeedback = data.candidates[0].content.parts[0].text;

      handleChoice(correctOption.xp, `🤖 MENTORIA PEDRO MONTE (R$ 50k debitados via IA):\n\n${aiFeedback}`, false, combinedImpacts);

    } catch (error) {
      console.error(error);
      handleChoice(correctOption.xp, `💡 PARECER TÉCNICO (Fallback Seguro - R$ 50k): ${correctOption.feedback}`, false, combinedImpacts);
    }
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
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA EXTREMA. O nível de compliance atingiu margens inaceitáveis. O acúmulo de infrações na matriz SoD e violações fiscais desencadearam bloqueio cautelar das contas."); return;
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
    setLastXpChange(null); setTimeBonus(0); setLastImpacts(null);
    setIsProcessing(false);
    setCurrentScenario(null); // Define como nulo para forçar a IA a gerar um novo

    if (currentStage < 9) { // 10 rodadas por bateria (0 a 9)
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
    setCurrentStage(0);
    setCurrentScenario(null); // Força a IA a gerar novos cenários para o novo ciclo
  };

  const caixaBarFill = Math.min(100, (caixa / 15000000) * 100);
  const margemBarFill = Math.min(100, Math.max(0, (margem / 40.0) * 100));

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">Sincronizando Terminal Corporativo...</div>;

  // --- TELA DE ONBOARDING: CRIAÇÃO DO CNPJ E CRACHÁ ---
  if (needsCompanySetup) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-10 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-cyan-950/50 border border-cyan-500/50 flex items-center justify-center">
             <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Abertura de Empresa</h2>
          <h1 className="text-2xl font-light text-slate-100 mb-8 tracking-wide">Assinatura de <span className="font-semibold text-cyan-400">Posse</span></h1>
          
          <form onSubmit={handleCompanySubmit} className="space-y-5">
            <div className="space-y-1 text-left">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Nome da Corporação</label>
              <input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} placeholder="Ex: Nexus Corp, Indústria Alfa..." className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome no Crachá</label>
              <input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} placeholder="Ex: Pedro Monte, Sr. Diretor..." className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono tracking-widest py-4 px-4 rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] uppercase mt-4">
              Iniciar Operação
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE LOGIN / REGISTRO ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/70 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl max-w-md w-full relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-cyan-500/40 bg-slate-900 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h1 className="text-2xl font-light text-slate-200 tracking-[0.2em] uppercase">Código <span className="font-semibold text-cyan-400">Azul</span></h1>
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Motor Adaptativo por IA</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('login'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
            <button onClick={() => { setAuthMode('register'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}>Criar Conta</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Nome Completo</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome real" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">WhatsApp</label>
                  <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(DD) 90000-0000" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">E-mail Corporativo</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ceo@empresa.com" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono flex justify-between">
                <span>Senha Segura</span>
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required />
            </div>
            
            {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}

            <button disabled={isAuthenticating} type="submit" className={`w-full text-cyan-400 text-xs font-mono tracking-widest py-3.5 px-4 rounded-lg transition-all mt-4 ${isAuthenticating ? 'bg-cyan-950/20 border border-cyan-900 opacity-50 cursor-not-allowed' : 'bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'}`}>
              {isAuthenticating ? 'CONECTANDO NUVEM...' : authMode === 'login' ? 'ACESSAR TERMINAL' : 'FINALIZAR CADASTRO'}
            </button>
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

  // --- TELA DE CARREGAMENTO (GERAÇÃO DE IA) ---
  if (isGeneratingScenario || !currentScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Sintetizando Cenário Técnico via Inteligência Artificial...</h2>
        <p className="text-slate-600 font-mono text-[9px] tracking-widest mt-2 uppercase">Ajustando dificuldade para: {currentLevel.title}</p>
      </div>
    );
  }

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

        {/* PAINEL DE OPERAÇÕES PRINCIPAL GERADO PELA IA */}
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
                  <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold">{currentScenario.sector}</span>
                  <span className="hidden md:inline text-slate-600 font-mono text-[9px]">•</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${currentScenario.criticality === 'Extrema' ? 'border-red-500/40 text-red-400 bg-red-950/20' : currentScenario.criticality === 'Alta' ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' : currentScenario.criticality === 'Média' ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' : 'border-slate-600/40 text-slate-400 bg-slate-900/30'}`}>
                    Risco: {currentScenario.criticality}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
              </div>
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border border-slate-700/50 bg-[#020617]/50 px-3 py-1.5 rounded-md whitespace-nowrap">
                Fase {currentStage + 1}/10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5">
                <h3 className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> Marco Normativo / Teoria</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>
              <div className="bg-[#020617]/40 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                <h3 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2 relative z-10"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Contexto Corporativo (Field)</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify relative z-10">{currentScenario.context}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-3 text-center">Definição do C-Level ({currentScenario.character})</h3>
              {currentScenario.options.map((option: any, index: number) => (
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

              <div className="pt-6 border-t border-white/5 mt-6">
                <button
                  disabled={isProcessing || caixa < 50000}
                  onClick={handleConsultoriaIA}
                  className={`w-full text-center p-4 rounded-xl border transition-all font-mono text-[10px] tracking-[0.2em] uppercase flex justify-center items-center gap-2 ${isProcessing || caixa < 50000 ? 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-amber-950/20 border-amber-800/50 text-amber-500 hover:bg-amber-900/40 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'}`}
                >
                  {isProcessing ? '🤖 PROCESSANDO PARECER TÉCNICO...' : '🤖 ACIONAR IA MENTORIA PEDRO MONTE (DEBITA R$ 50K)'}
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

            <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-2xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">Feedback Consolidado:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={handleNextStageOrPromotion} className="bg-transparent border border-slate-600 hover:border-cyan-400 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono tracking-[0.3em] py-3.5 px-10 rounded-xl transition-all uppercase hover:bg-cyan-950/20">
              {promotionPending ? "Acessar Avaliação de Patente" : "Proceder ao Próximo Arquivo"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleManualSave} className="text-[9px] text-cyan-600/60 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">{saveStatus || "Gravar Data Center (Nuvem)"}</button>
          <span className="text-slate-800">/</span><button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Desconectar (Logout)</button>
          <span className="text-slate-800">/</span><button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Liquidacao Total (Reset)</button>
        </div>

      </div>
    </div>
  );
}