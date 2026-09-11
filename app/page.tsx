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
  { tier: 1, title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Execução metódica de conciliações e rotinas de contas a pagar/receber.", vulnerabilidade: "Sua leitura ainda é de curto prazo (regime de caixa). É preciso absorver o impacto das obrigações futuras." } },
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos, provisões e impacto tributário na precificação." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de impactos macroeconômicos." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPCs complexos, auditoria atuária e proteção cambial estrutural." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal agressiva.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento direto com o conselho e acionistas." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias seculares e crises geopolíticas." } }
];

export default function CodigoAzulGame() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
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

  // --- MOTOR IA ESCOLA DE ESTRATEGISTAS ---
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [supplementaryComment, setSupplementaryComment] = useState(""); // Novo campo de comentário complementar
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);

  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(90);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => { setIsLoading(false); }, []);

  useEffect(() => {
    if (gameStarted && !isGameOver) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);

  // --- GERAÇÃO DE CASO DE ENSINO COM ALEATORIEDADE EXTREMA PELA IA ---
  const fetchScenarioFromAI = async () => {
    setIsGeneratingScenario(true);
    setCurrentScenario(null);
    setFeedback(null);
    setSupplementaryComment("");
    setIsProcessing(false);
    setTimeLeft(90);

    const prompt = `Você é o reitor da escola de negócios 'Código Azul'. Gere um Estudo de Caso Prático altamente técnico, aleatório e complexo em formato JSON estrito.
    Nível do aluno: ${currentLevel.title} (Tier ${currentLevel.tier}).
    Indicadores da empresa (${companyName}): Caixa R$ ${caixa}, Margem ${margem}%, Compliance ${compliance}%.

    Requisitos obrigatórios:
    1. A teoria deve ser profunda, densa, citando normas específicas (CPC 00, CPC 16, IFRS 9, IFRS 15, Reforma Tributária EC 132/IVA Dual, Governança COSO).
    2. Crie 3 opções de respostas objetivas estratégicas muito bem fundamentadas (uma correta/ótima, uma neutra/mediana e uma armadilha desastrosa).
    3. Garanta aleatoriedade absoluta nos temas (varie entre tesouraria, contabilidade societária, compliance fiscal, M&A ou precificação baseada em custos).

    Retorne APENAS um JSON válido nesta estrutura exata, sem formatação markdown:
    {
      "sector": "Setor do Desafio",
      "criticality": "Alta",
      "title": "Título do Caso Prático",
      "theory": "Fundamentação teórica rigorosa, explicando conceitos normativos e a lógica contábil envolvida...",
      "context": "Situação simulando o dia a dia real no CNPJ, detalhando a pressão e os números...",
      "character": "Autoridade cobrando a decisão (ex: Auditoria Externa, Conselho de Administração)",
      "options": [
        {
          "id": "A",
          "text": "Estratégia objetiva de alta gestão número 1...",
          "xp": 35,
          "isBest": true,
          "impacts": { "caixa": 1200000, "margem": 2.0, "compliance": 15 },
          "feedback": "Parecer técnico explicando o acerto sob a ótica da alta gestão."
        },
        {
          "id": "B",
          "text": "Estratégia objetiva intermediária número 2...",
          "xp": 10,
          "isBest": false,
          "impacts": { "caixa": 0, "margem": -0.5, "compliance": 0 },
          "feedback": "Parecer técnico explicando que a medida foi paliativa e ineficiente."
        },
        {
          "id": "C",
          "text": "Estratégia desastrosa número 3...",
          "xp": -40,
          "isBest": false,
          "impacts": { "caixa": -2000000, "margem": -4.0, "compliance": -25 },
          "feedback": "Parecer técnico explicando a ruína financeira gerada por essa escolha."
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
      // Embaralha as opções para que a resposta certa nunca fique na mesma posição (aleatoriedade total)
      parsedScenario.options = shuffleArray(parsedScenario.options);
      
      setCurrentScenario(parsedScenario);
    } catch (error) {
      console.error(error);
      setCurrentScenario({
        sector: "Tesouraria Operacional", criticality: "Alta", title: "Descasamento de Fluxo de Caixa",
        theory: "O descasamento entre o Ciclo Operacional e o Ciclo de Caixa pressiona a necessidade de capital de giro.",
        context: "Os recebíveis estão demorando 60 dias, mas os fornecedores exigem pagamento à vista.",
        character: "Diretoria Financeira",
        options: shuffleArray([
          { id: "A", text: "Travar crédito comercial e antecipar recebíveis com trava de spread.", xp: 30, isBest: true, impacts: { caixa: 800000, margem: -0.5, compliance: 10 }, feedback: "Correto. Protegeu a liquidez com baixo custo." },
          { id: "B", text: "Cobrir o buraco com cheque especial rotativo de curto prazo.", xp: -20, isBest: false, impacts: { caixa: 500000, margem: -3.0, compliance: -5 }, feedback: "Incorreto. Juros compostos altos corroerão a margem." },
          { id: "C", text: "Ignorar o alerta e aguardar os clientes pagarem espontaneamente.", xp: -40, isBest: false, impacts: { caixa: -1000000, margem: -5.0, compliance: -20 }, feedback: "Desastroso. Levou a insolvência de curto prazo." }
        ])
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


  // --- AVALIAÇÃO DO COMENTÁRIO COMPLEMENTAR PELA IA ---
  const handleOptionSelectWithComment = async (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    let finalXp = selectedOption.xp;
    let finalImpacts = { ...selectedOption.impacts };
    let bonusMessage = "";

    // Se o usuário digitou um comentário complementar, a IA audita se é assertivo para dar bônus
    if (supplementaryComment.trim()) {
      try {
        const prompt = `Você é o reitor do 'Código Azul'. O aluno escolheu a opção estratégica "${selectedOption.text}" para o caso: "${currentScenario.context}".
        Além disso, o aluno escreveu o seguinte COMENTÁRIO COMPLEMENTAR DE DEFESA DA TESE:
        "${supplementaryComment}"

        Avalie se este comentário é tecnicamente ASSERTIVO, profundo e traz uma visão complementar de alto valor (como CFO ou estrategista sênior).
        Retorne APENAS um JSON estrito no formato:
        {
          "isAssertive": [true/false],
          "bonusXp": [número entre 10 e 20 se for true, ou 0 se for false],
          "commentEvaluation": "Feedback de 1 parágrafo elogiando ou corrigindo o argumento complementar do aluno."
        }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        const evaluation = JSON.parse(aiText);

        if (evaluation.isAssertive) {
          finalXp += evaluation.bonusXp;
          bonusMessage = `\n\n⭐ BÔNUS DO ESTRATEGISTA: Sua argumentação complementar foi auditada e julgada ALTAMENTE ASSERTIVA pela banca (+${evaluation.bonusXp} XP).\nAnálise da Tese: ${evaluation.commentEvaluation}`;
        } else {
          bonusMessage = `\n\n💡 NOTA DA BANCA SOBRE SEU COMENTÁRIO: ${evaluation.commentEvaluation}`;
        }
      } catch (e) {
        console.error("Erro ao avaliar comentário:", e);
      }
    }

    const fullFeedback = `${selectedOption.feedback}${bonusMessage}\n\nCÓDIGO AZUL.`;
    handleChoice(finalXp, fullFeedback, false, finalImpacts);
    setIsEvaluatingChoice(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanEmail || !cleanPassword) { setAuthError("Preencha todos os campos."); return; }
    
    setIsAuthenticating(true); setAuthError(""); setAuthSuccess("");

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
      } else if (authMode === 'register') {
        if (!nome.trim() || !telefone.trim()) { setAuthError("Preencha Nome e WhatsApp."); setIsAuthenticating(false); return; }
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado. Faça login."); } 
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
      } else if (authMode === 'forgot') {
        if (docSnap.exists()) {
          await setDoc(docRef, { password: cleanPassword }, { merge: true });
          setAuthSuccess("Senha redefinida com sucesso! Alterne para a aba Acessar.");
        } else {
          setAuthError("E-mail não encontrado na base de dados.");
        }
      }
    } catch (e) {
      setAuthError("Falha de conexão com a nuvem.");
    } finally { setIsAuthenticating(false); }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameInput.trim() || !playerNameInput.trim()) return;
    setCompanyName(companyNameInput.trim()); setPlayerName(playerNameInput.trim());
    setNeedsCompanySetup(false); setCurrentScenario(null); setTimeLeft(90); 
    setGameStarted(true); setIsGameOver(false); setShowDRE(false);
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false);
    setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false); setShowDRE(false); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Confirma a liquidação da empresa? O histórico será reiniciado.")) {
      setXp(0); setCaixa(5000000); setMargem(20.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setSessionStartStats({ caixa: 5000000, margem: 20.0 });
      setFeedback(null); setPromotionPending(false); setIsGameOver(false); setLastImpacts(null); setShowDRE(false); 
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
    }
  };

  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || showDRE || !currentScenario || isGeneratingScenario || isEvaluatingChoice || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, showDRE, currentScenario, isGeneratingScenario, isEvaluatingChoice, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && !showDRE && currentScenario && gameStarted && currentLevel.hasTimer && !isEvaluatingChoice) {
      handleChoice(-15, "TEMPO ESGOTADO. O conselho rejeitou a inércia por falta de decisão no prazo.", true, { caixa: -500000, margem: -1.5, compliance: -10 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentScenario, gameStarted, currentLevel.hasTimer, isEvaluatingChoice]);

  const handleChoice = (baseXpGained: number, feedbackText: string, isTimeout: boolean = false, impacts: any = null) => {
    if (isProcessing || isGameOver) return;
    setIsProcessing(true);

    let bonus = 0;
    if (baseXpGained > 0 && !isTimeout && currentLevel.hasTimer) {
      if (timeLeft >= 60) bonus = 5; else if (timeLeft >= 30) bonus = 2;
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
    setXp(newXp); setLastXpChange(totalXpGained); setLastImpacts(impacts);

    if (newCaixa <= 0) {
      setIsGameOver(true); setFeedback("FALÊNCIA DECRETADA. O caixa da companhia foi exaurido sem cobertura."); return;
    }
    if (newCompliance <= 0) {
      setIsGameOver(true); setFeedback("INTERVENÇÃO REGULATÓRIA EXTREMA. Bloqueio cautelar de compliance acionado."); return;
    }

    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true); setPromotedLevel(newCalculatedLevel);
    }

    setFeedback(feedbackText);
  };

  const proceedToNextQuestion = () => {
    setPromotionPending(false); setPromotedLevel(null); setFeedback(null); 
    setLastXpChange(null); setLastImpacts(null); setIsProcessing(false); setCurrentScenario(null); 
    if (currentStage < 9) { setCurrentStage(prev => prev + 1); } else { setShowDRE(true); }
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) { setFeedback(null); playPromotionSound(); setIsProcessing(false); return; }
    proceedToNextQuestion();
  };

  const handleStartNewQuarter = () => {
    setShowDRE(false); setSessionStartStats({ caixa, margem }); setCurrentStage(0); setCurrentScenario(null);
  };

  const caixaBarFill = Math.min(100, (caixa / 15000000) * 100);
  const margemBarFill = Math.min(100, Math.max(0, (margem / 40.0) * 100));

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">Sincronizando Escola...</div>;

  // --- TELA DE ONBOARDING ---
  if (needsCompanySetup) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-10 rounded-2xl border border-cyan-500/30 max-w-md w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Escola de Estrategistas</h2>
          <h1 className="text-2xl font-light text-slate-100 mb-8 tracking-wide">Registro de <span className="font-semibold text-cyan-400">Posse</span></h1>
          <form onSubmit={handleCompanySubmit} className="space-y-5">
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Nome da Corporação</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome no Crachá</label><input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono tracking-widest py-4 px-4 rounded-lg transition-all uppercase mt-4">Iniciar Jornada Prática</button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE LOGIN / REGISTRO / REDEFINIÇÃO DE SENHA ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/70 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl max-w-md w-full relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-slate-200 tracking-[0.2em] uppercase">Código <span className="font-semibold text-cyan-400">Azul</span></h1>
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Escola de Contabilidade & Finanças</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('login'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
            <button onClick={() => { setAuthMode('register'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Criar Conta</button>
            <button onClick={() => { setAuthMode('forgot'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'forgot' ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>Redefinir</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <><div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Nome Completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
              <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">WhatsApp</label><input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div></>
            )}

            <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">E-mail Corporativo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] text-slate-400 uppercase font-mono flex justify-between">
                <span>{authMode === 'forgot' ? 'Nova Senha Segura' : 'Senha Segura'}</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50 pr-12" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-500 hover:text-cyan-300 uppercase tracking-widest"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}
            {authSuccess && <div className="text-emerald-400 text-[10px] font-mono text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">{authSuccess}</div>}

            <button disabled={isAuthenticating} type="submit" className={`w-full text-xs font-mono py-3.5 rounded-lg mt-4 transition-all uppercase tracking-widest ${isAuthenticating ? 'opacity-50' : authMode === 'forgot' ? 'bg-amber-950/40 border border-amber-800 text-amber-400 hover:bg-amber-900/60' : 'bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60'}`}>
              {isAuthenticating ? 'PROCESSANDO...' : authMode === 'login' ? 'ACESSAR ESCOLA' : authMode === 'register' ? 'CADASTRAR E INICIAR' : 'ATUALIZAR SENHA DIRETO NA TELA'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELAS DE GAME OVER, DRE, PROMOÇÃO, LOADING ---
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#170f0f]/80 p-8 md:p-12 rounded-3xl border border-red-900/50 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">{caixa <= 0 ? "FALÊNCIA DECRETADA" : "INTERVENÇÃO REGULATÓRIA"}</h1>
          <p className="text-slate-300 text-sm md:text-base font-light text-justify border-l-2 border-red-500 pl-4 mb-8">{feedback}</p>
          <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 text-red-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Liquidar CNPJ e Reiniciar Aprendizado</button>
        </div>
      </div>
    );
  }

  if (showDRE) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#0f172a]/90 p-8 md:p-12 rounded-3xl border border-white/5 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 uppercase">Fechamento do Módulo Executivo</h1>
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left space-y-4 font-mono">
            <div className="flex justify-between border-b border-slate-800/80 pb-2"><span className="text-slate-500 text-xs">Caixa Final:</span><span className="text-slate-300 text-xs">{formatBRL(caixa)}</span></div>
            <div className="flex justify-between pt-2"><span className="text-slate-500 text-xs">XP Acumulado na Escola:</span><span className="text-cyan-400 text-xs font-bold">{xp} Pontos</span></div>
          </div>
          <button onClick={handleStartNewQuarter} className="bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Avançar para Próximo Módulo de Ensino</button>
        </div>
      </div>
    );
  }

  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative">
        <div className="z-10 bg-[#0f172a]/80 p-8 md:p-12 rounded-3xl border border-white/5 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">Promoção Acadêmica Homologada</h1>
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left"><span className="text-cyan-400 text-xl font-semibold">{promotedLevel?.title}</span></div>
          <button onClick={proceedToNextQuestion} className="bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-mono py-3.5 px-10 rounded-xl uppercase">Continuar Jornada</button>
        </div>
      </div>
    );
  }

  if (isGeneratingScenario || !currentScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative">
        <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">A Banca da Escola Está Elaborando Seu Estudo de Caso...</h2>
      </div>
    );
  }

  const timerColor = timeLeft > 45 ? 'bg-cyan-500' : timeLeft > 20 ? 'bg-amber-500' : 'bg-red-500';

  // --- PAINEL PRINCIPAL DA ESCOLA (OPÇÕES OBJETIVAS + COMENTÁRIO COMPLEMENTAR COM BÔNUS) ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        {/* HUD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Caixa Operacional</span><span className={`text-xs font-bold font-mono ${caixa > 2000000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${caixa > 1000000 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Margem EBITDA</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Compliance</span><span className={`text-xs font-bold font-mono ${compliance >= 80 ? 'text-purple-400' : 'text-amber-400'}`}>{compliance}%</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${compliance > 60 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${compliance}%` }}></div></div></div>
        </div>

        {/* HEADER */}
        <header className="bg-[#0f172a]/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">Estudante / CFO: <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">{currentLevel.title}</p></div>
            <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500" style={{ width: `${progressToNext}%` }}></div></div>
          </div>
        </header>

        {/* ÁREA DE ENSINO E CASO PRÁTICO */}
        {!feedback ? (
          <main className="bg-[#0f172a]/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            {currentLevel.hasTimer && (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#020617] rounded-t-2xl"><div className={`h-full ${timerColor} transition-all`} style={{ width: `${(timeLeft / 90) * 100}%` }}></div></div>
            )}

            <div className="mb-6 border-b border-white/5 pb-4 mt-2">
              <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold block mb-1">{currentScenario.sector} | Módulo Prático</span>
              <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
            </div>

            {/* DUPLO BLOCO: TEORIA PROFUNDA + REALIDADE DO DIA A DIA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. Fundamentação Teórica & Normativa
                </h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>

              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/40">
                <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 2. Estudo de Caso (Realidade no CNPJ)
                </h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify">{currentScenario.context}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">Cobrança Direta: <span className="text-slate-400">{currentScenario.character}</span></p>
              </div>
            </div>

            {/* QUADRO DE COMENTÁRIO COMPLEMENTAR (OPCIONAL PARA BÔNUS) */}
            <div className="mb-6 bg-[#020617]/30 p-5 rounded-xl border border-slate-800">
              <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                ⭐ Quadro de Comentário Complementar (Opcional — Justifique sua tese e ganhe BÔNUS em XP se a banca julgar assertivo):
              </label>
              <textarea
                disabled={isEvaluatingChoice}
                value={supplementaryComment}
                onChange={(e) => setSupplementaryComment(e.target.value)}
                placeholder="Adicione sua justificativa técnica ou observação gerencial sobre a escolha que vai fazer..."
                className="w-full bg-[#020617]/70 border border-slate-700/60 rounded-lg p-3 text-xs text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans transition-all resize-none h-20"
              />
            </div>

            {/* OPÇÕES OBJETIVAS DE RESPOSTA (ALEATÓRIAS) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Selecione a Alternativa Estratégica Adequada:</h3>
              {currentScenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  disabled={isEvaluatingChoice}
                  onClick={() => handleOptionSelectWithComment(option)}
                  className="w-full text-left p-5 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2 text-justify">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          /* FEEDBACK PEDAGÓGICO DA TESE E BÔNUS */
          <div className="bg-[#0f172a]/60 p-8 md:p-12 rounded-2xl border border-white/5 text-center shadow-2xl">
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Parecer Acadêmico Aprovado' : 'Reprovação Parcial de Tese'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {lastImpacts && (
              <div className="flex justify-center gap-8 mb-8 border-y border-white/5 py-6 bg-[#020617]/30">
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto no Caixa</p><p className={`font-mono text-lg font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p></div>
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto na Margem</p><p className={`font-mono text-lg font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p></div>
              </div>
            )}

            <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-3xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-cyan-400 font-mono border border-slate-700/50 rounded-md">Feedback da Banca Examinadora:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={handleNextStageOrPromotion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              {promotionPending ? "Acessar Promoção Acadêmica" : "Avançar para Próximo Caso Prático"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Desconectar (Logout)</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Reiniciar Escola (Reset)</button>
        </div>

      </div>
    </div>
  );
}