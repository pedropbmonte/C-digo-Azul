"use client";

import { useState, useEffect } from "react";
// IMPORTAÇÕES DO FIREBASE
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- CONFIGURAÇÃO DO FIREBASE ---
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
const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatPct = (value: number) => value.toFixed(1).replace('.', ',') + '%';

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
  { tier: 1, title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Execução metódica de conciliações e rotinas de contas a pagar/receber.", vulnerabilidade: "Sua leitura ainda é de curto prazo (regime de caixa). É preciso absorver o impacto das obrigações futuras." } },
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos, provisões e impacto tributário na precificação." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de impactos macroeconômicos." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPCs complexos, auditoria atuária e proteção cambial estrutural." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal agressiva.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento direto com o conselho e acionistas." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias seculares e crises geopolíticas." } }
];

export default function CodigoAzulGame() {
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

  // --- MOTOR IA DINÂMICO ---
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [customDecisionText, setCustomDecisionText] = useState(""); // Novo estado para texto livre
  const [isEvaluatingCustom, setIsEvaluatingCustom] = useState(false); // Carregamento da decisão livre

  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (gameStarted && !isGameOver) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];

  // --- IA CONTEXTUAL: GERAÇÃO DO PROBLEMA ---
  const fetchScenarioFromAI = async () => {
    setIsGeneratingScenario(true);
    setCurrentScenario(null);
    setFeedback(null);
    setCustomDecisionText("");
    setIsProcessing(false);
    setTimeLeft(60);

    const prompt = `Você é o arquiteto do simulador corporativo 'Código Azul'. Gere um cenário crítico, técnico e único em JSON.
    Contexto ATUAL da empresa do jogador:
    - Empresa: ${companyName}
    - Patente do Jogador: ${currentLevel.title}
    - Caixa Atual: R$ ${caixa} (Se estiver abaixo de R$ 1.000.000, o cenário DEVE ser uma crise de liquidez ou risco de insolvência).
    - Margem Atual: ${margem}% (Se estiver abaixo de 5%, foque em Ebitda corroído, custos ou precificação errada).
    - Compliance Atual: ${compliance}% (Se estiver abaixo de 50%, foque em auditoria CVM, multas trabalhistas ou fraude).

    Sua missão: Crie uma situação corporativa densa e imersiva baseada EXATAMENTE nesses indicadores. O problema deve refletir a dor real do dono de negócio. O texto deve ter jargões de alta gestão (CPCs, IFRS, DRE, fluxo de caixa, covenants, markup).
    
    Crie APENAS 2 opções pré-definidas (uma conservadora e uma arriscada). O usuário também terá a opção de digitar a própria resposta livremente depois.

    Retorne APENAS um JSON válido nesta estrutura, sem formatação markdown:
    {
      "sector": "Setor do Problema",
      "criticality": "Alta/Extrema",
      "title": "Título do Problema",
      "theory": "Embasamento técnico profundo sobre o tema...",
      "context": "O que acabou de explodir na empresa detalhadamente...",
      "character": "Quem está cobrando a decisão (ex: Conselho, Auditoria, Banco)",
      "options": [
        {
          "text": "Ação 1...",
          "xp": 30,
          "impacts": { "caixa": 0, "margem": 0, "compliance": 0 },
          "feedback": "Parecer financeiro da opção 1."
        },
        {
          "text": "Ação 2...",
          "xp": -30,
          "impacts": { "caixa": 0, "margem": 0, "compliance": 0 },
          "feedback": "Parecer financeiro da opção 2."
        }
      ]
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9 } })
      });

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedScenario = JSON.parse(aiText);
      setCurrentScenario(parsedScenario);
    } catch (error) {
      console.error(error);
      // Fallback mínimo para garantir que o jogo não trave
      setCurrentScenario({
        sector: "Riscos Sistêmicos", criticality: "Extrema", title: "Falha de Rede CVM",
        theory: "Risco de continuidade de negócios.", context: "A API do sistema financeiro falhou. Tome uma ação de contigência.",
        character: "Diretoria de TI",
        options: [
          { text: "Acionar backup redundante", xp: 10, impacts: { caixa: -50000, margem: 0, compliance: 5 }, feedback: "Restabelecido com custo." }
        ]
      });
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !showDRE && !feedback && !promotionPending && !currentScenario && !isGeneratingScenario) {
      fetchScenarioFromAI();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, currentStage, isGameOver, showDRE, feedback, promotionPending, currentScenario, isGeneratingScenario]);


  // --- IA AVALIADORA: DECISÃO ABERTA DO USUÁRIO ---
  const handleCustomActionSubmit = async () => {
    if (!customDecisionText.trim() || isEvaluatingCustom || isGameOver) return;
    setIsEvaluatingCustom(true);

    const prompt = `Você atua como Pedro Monte, o estrategista rigoroso do simulador 'Código Azul'. O jogador (CEO) se deparou com a seguinte crise:
    Contexto da Crise: ${currentScenario.context}
    
    Em vez de escolher uma opção padrão, o jogador DIGITOU A PRÓPRIA ESTRATÉGIA:
    "${customDecisionText}"
    
    Status atual da empresa: Caixa R$ ${caixa}, Margem ${margem}%, Compliance ${compliance}%.

    Sua missão: Avalie a decisão do jogador. Foi um pensamento estratégico de dono ou uma loucura irresponsável? 
    1) Se for uma boa ideia (corte de custos inteligente, renegociação, injeção de capital sustentável), dê XP positivo e impactos favoráveis.
    2) Se for irresponsável, mágica fiscal, ou ilegal, dê XP negativo e puna severamente o caixa ou compliance.

    Retorne APENAS um JSON válido nesta estrutura, sem formatação markdown:
    {
      "xp": [número entre -50 e +50],
      "impacts": {
        "caixa": [valor financeiro real de impacto, positivo ou negativo. Ex: -500000 ou 1000000],
        "margem": [variação em pontos percentuais. Ex: -2.5 ou 1.0],
        "compliance": [pontos de compliance perdidos ou ganhos. Ex: -20 ou 5]
      },
      "feedback": "Seu parecer textual denso, como Pedro Monte, explicando para o jogador o impacto real no mercado da decisão que ele acabou de digitar. Termine com 'CÓDIGO AZUL'."
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
      });

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedResult = JSON.parse(aiText);
      
      handleChoice(parsedResult.xp, `🧠 AVALIAÇÃO DA SUA ESTRATÉGIA LIVRE:\n\n${parsedResult.feedback}`, false, parsedResult.impacts);

    } catch (error) {
      console.error(error);
      alert("A auditoria do mercado (IA) não conseguiu processar seu texto. Tente novamente ou use uma ação padrão.");
    } finally {
      setIsEvaluatingCustom(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanEmail || !cleanPassword) { setAuthError("Preencha todos os campos obrigatórios."); return; }
    if (authMode === 'register' && (!nome.trim() || !telefone.trim())) { setAuthError("Preencha Nome e Telefone."); return; }

    setIsAuthenticating(true); setAuthError("");

    try {
      const docRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(docRef);

      if (authMode === 'login') {
        if (docSnap.exists() && docSnap.data().password === cleanPassword) {
          const d = docSnap.data().data;
          setPlayerName(d.playerName); setTelefone(d.phone || "");
          
          if (!d.companyName) {
            setPlayerNameInput(d.playerName || ""); setNeedsCompanySetup(true);
          } else {
            setCompanyName(d.companyName); setXp(d.xp || 0); 
            setCaixa(d.caixa ?? 5000000); setMargem(d.margem ?? 20.0); setCompliance(d.compliance ?? 100);
            setCurrentStage(d.currentStage || 0); 
            setSessionStartStats(d.sessionStartStats || { caixa: d.caixa ?? 5000000, margem: d.margem ?? 20.0 });
            setShowDRE(d.showDRE || false);
            setCurrentScenario(null); 
            
            if((d.caixa ?? 5000000) <= 0 || (d.compliance ?? 100) <= 0) setIsGameOver(true);
            setGameStarted(true);
          }
        } else { setAuthError("E-mail ou senha incorretos."); }
      } else {
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado na base. Faça login."); } 
        else {
          await setDoc(docRef, {
            password: cleanPassword,
            data: { 
              playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail,
              companyName: "", xp: 0, caixa: 5000000, margem: 20.0, compliance: 100, 
              currentStage: 0, sessionStartStats: { caixa: 5000000, margem: 20.0 }, showDRE: false
            }
          });
          setPlayerName(nome.trim()); setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
          setCurrentStage(0); setSessionStartStats({ caixa: 5000000, margem: 20.0 });
          setPlayerNameInput(nome.trim()); setNeedsCompanySetup(true);
        }
      }
    } catch (e) {
      setAuthError("Falha de conexão com o banco de dados em nuvem.");
    } finally { setIsAuthenticating(false); }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameInput.trim() || !playerNameInput.trim()) return;
    setCompanyName(companyNameInput.trim()); setPlayerName(playerNameInput.trim());
    setNeedsCompanySetup(false); setCurrentScenario(null); setTimeLeft(60); 
    setGameStarted(true); setIsGameOver(false); setShowDRE(false);
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false);
    setEmail(""); setPassword(""); setAuthError(""); setNome(""); setTelefone("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false); setShowDRE(false); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Confirma a liquidação da empresa? Seu histórico no Cloud Database será reiniciado.")) {
      setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setFeedback(null); setPromotionPending(false); setIsGameOver(false); setLastImpacts(null); setShowDRE(false); 
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
    }
  };

  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || showDRE || !currentScenario || isGeneratingScenario || isEvaluatingCustom || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, showDRE, currentScenario, isGeneratingScenario, isEvaluatingCustom, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && !showDRE && currentScenario && gameStarted && currentLevel.hasTimer && !isEvaluatingCustom) {
      handleChoice(-15, "TEMPO ESGOTADO. O mercado não espera. A indecisão custou caixa operacional e oportunidade.", true, { caixa: -500000, margem: -1.5, compliance: -10 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentScenario, gameStarted, currentLevel.hasTimer, isEvaluatingCustom]);

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
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA EXTREMA. O nível de compliance atingiu margens inaceitáveis. Bloqueio cautelar das contas."); return;
    }

    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true); setPromotedLevel(newCalculatedLevel);
    }

    setFeedback(feedbackText);
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) { setFeedback(null); playPromotionSound(); setIsProcessing(false); return; }
    setPromotionPending(false); setPromotedLevel(null); setFeedback(null); setLastXpChange(null); setTimeBonus(0); setLastImpacts(null);
    setIsProcessing(false); setCurrentScenario(null); 

    if (currentStage < 9) { setCurrentStage(prev => prev + 1); } 
    else { setShowDRE(true); }
  };

  const handleStartNewQuarter = () => {
    setShowDRE(false); setSessionStartStats({ caixa, margem }); setCurrentStage(0); setCurrentScenario(null);
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
              <input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} placeholder="Ex: Nexus Corp..." className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all" required />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome no Crachá</label>
              <input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} placeholder="Ex: Pedro Monte..." className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all" required />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono tracking-widest py-4 px-4 rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] uppercase mt-4">
              Iniciar Simulação IA
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

  // --- TELA DE GAME OVER E DRE ---
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

  if (showDRE) {
    const deltaCaixa = caixa - sessionStartStats.caixa;
    const deltaMargem = margem - sessionStartStats.margem;
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/90 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">DRE Sintético Gerencial</h2>
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 tracking-wide uppercase">Fechamento do <span className="font-semibold text-cyan-400">Trimestre</span></h1>
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left space-y-4 font-mono">
            <div className="flex justify-between border-b border-slate-800/80 pb-2"><span className="text-slate-500 text-xs">Caixa Inicial:</span><span className="text-slate-300 text-xs">{formatBRL(sessionStartStats.caixa)}</span></div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2"><span className="text-slate-500 text-xs">Caixa Final:</span><span className="text-slate-300 text-xs">{formatBRL(caixa)}</span></div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 bg-slate-900/30 p-2 rounded"><span className="text-slate-400 text-xs font-bold">Fluxo de Caixa Livre (FCF):</span><span className={`text-sm font-bold ${deltaCaixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{deltaCaixa >= 0 ? '+' : ''}{formatBRL(deltaCaixa)}</span></div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2 pt-2"><span className="text-slate-500 text-xs">Variação EBITDA Margin:</span><span className={`text-xs font-bold ${deltaMargem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{deltaMargem >= 0 ? '+' : ''}{formatPct(deltaMargem)}</span></div>
            <div className="flex justify-between pt-2"><span className="text-slate-500 text-xs">XP Executivo:</span><span className="text-cyan-400 text-xs font-bold">{xp} Pontos</span></div>
          </div>
          <button onClick={handleStartNewQuarter} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-4 px-10 rounded-xl transition-all uppercase">Assinar Balanço & Iniciar Novo Ciclo</button>
        </div>
      </div>
    );
  }

  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Comitê de Governança</h2>
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 tracking-wide uppercase">Ascensão <span className="font-semibold text-cyan-400">Homologada</span></h1>
          <div className="bg-[#020617]/50 p-6 md:p-8 rounded-xl border border-slate-800 mb-8 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500"></div>
            <div className="flex justify-between items-end border-b border-slate-800/80 pb-4 mb-4"><span className="text-slate-500 uppercase text-[10px] tracking-[0.2em] font-mono">Nova Patente Adquirida</span><span className="text-xl md:text-2xl font-semibold text-cyan-400">{promotedLevel?.title}</span></div>
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

  // --- TELA DE CARREGAMENTO IA ---
  if (isGeneratingScenario || !currentScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">A IA Está Analisando Seus Indicadores...</h2>
        <p className="text-slate-600 font-mono text-[9px] tracking-widest mt-2 uppercase">Caixa: {formatBRL(caixa)} | Risco Nível: {currentLevel.title}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        {/* HUD FINANCEIRO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5 shadow-lg">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Caixa Operacional</span><span className={`text-xs font-bold font-mono ${caixa > 2000000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-emerald-900/30"><div className={`h-full transition-all duration-700 ease-out ${caixa > 2500000 ? 'bg-emerald-500' : caixa > 1000000 ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Margem EBITDA</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-blue-900/30"><div className={`h-full transition-all duration-700 ease-out ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Compliance Matriz</span><span className={`text-xs font-bold font-mono ${compliance >= 80 ? 'text-purple-400' : 'text-amber-400'}`}>{compliance}%</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden border border-purple-900/30"><div className={`h-full transition-all duration-700 ease-out ${compliance > 60 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${compliance}%` }}></div></div></div>
        </div>

        {/* HEADER */}
        <header className="bg-[#0f172a]/50 backdrop-blur-xl p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 tracking-[0.15em] uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Estrategista: <span className="Você tem toda a razão. Ficar em dilemas teóricos e perguntas de múltipla escolha é perda de tempo para quem vive o campo de batalha. Chega de "arroz com feijão". Vamos dar um choque de realidade e testar, na prática, o que separa as empresas que crescem daquelas que estão apenas adiando a falência. 

A partir de agora, o motor do jogo muda. O algoritmo não vai avaliar "conceitos", vai analisar a robustez estratégica das suas decisões de sobrevivência e crescimento.

Aqui está o seu painel de controle. Os sinais vitais estão apitando. É um **CÓDIGO AZUL**.

### O Cenário: A Sangria do "Falso Crescimento"

Você acaba de ser chamado para intervir em uma rede local varejista. O dono está comemorando porque o faturamento bateu recorde e subiu 45% nos últimos 90 dias. Ele acha que encontrou a mina de ouro, mas a verdade nua e crua é que o caixa secou e a operação está em modo de sobrevivência. 

O diagnóstico dos sinais vitais mostra o seguinte:

*   **Ciclo Financeiro Estrangulado:** Para bater a meta de faturamento, a equipe comercial afrouxou as regras e o Prazo Médio de Recebimento (PMR) saltou de 30 para 65 dias. 
*   **Fornecedores no Gargalo:** Devido ao alto volume repentino de pedidos, o principal fornecedor dos produtos de "Curva A" (responsáveis por 60% do giro) reduziu o Prazo Médio de Pagamento (PMP) de 28 para 10 dias.
*   **A Bomba-Relógio:** Faltam exatos 12 dias para fechar a folha de pagamento e quitar os impostos em atraso. O buraco projetado no caixa para o dia 5 é de R$ 145.000,00.
*   **A Armadilha:** O gerente do banco está na linha agora. Ele já deixou um contrato pronto oferecendo um empréstimo de capital de giro de R$ 150.000,00 a uma taxa letal de 4,9% ao mês, exigindo alienação do veículo do dono como garantia. 

### A Decisão (De Dono para Dono)

O dono atual está em pânico absoluto, com o "tempo fechando", e quer assinar o empréstimo em 1 hora para conseguir dormir à noite. 

Como o estrategista assumindo o controle dessa operação, como você desarma essa bomba-relógio nas próximas 48 horas de forma cirúrgica? Qual é a sequência exata de alavancas que você puxa para salvar a operação sem jogar a empresa em um buraco de dívidas impagável?