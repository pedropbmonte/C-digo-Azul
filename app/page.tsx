"use client";

import { useState, useEffect, useCallback } from "react";
// IMPORTAÇÕES DO FIREBASE
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// IMPORTANTE: Conectando o seu banco de questões!
import { questionBank } from "./questions"; 

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

// --- FORMATADORES FINANCEIROS ---
const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatPct = (value: number) => value.toFixed(1).replace('.', ',') + '%';

// --- CISNES NEGROS (Eventos Aleatórios do Mercado) ---
const blackSwans = [
  { title: "Processo Trabalhista Antigo", text: "Um ex-funcionário ganhou uma causa que você negligenciou. Bloqueio judicial (Bacenjud) imediato nas contas.", impact: { caixa: -8000, margem: 0, compliance: -15 } },
  { title: "Rali do Dólar", text: "O câmbio disparou de madrugada. Seus custos de insumos subiram drasticamente. O caixa foi espremido.", impact: { caixa: -3500, margem: -3.0, compliance: 0 } },
  { title: "Viralizou Positivamente", text: "Um cliente influente elogiou seu serviço organicamente. Chuva de vendas inesperadas à vista!", impact: { caixa: 12000, margem: 2.0, compliance: 0 } },
  { title: "Quebra de Fornecedor", text: "Seu principal fornecedor pediu recuperação judicial. Você teve que comprar de outro de última hora, pagando mais caro.", impact: { caixa: -4000, margem: -2.5, compliance: 0 } }
];

// --- CURVA DE PROGRESSÃO DE MATURIDADE ---
const levels = [
  { title: "Apagador de Incêndios", minXp: 0, maxTier: 1 },
  { title: "Sobrevivente do Mês", minXp: 100, maxTier: 1 },
  { title: "Chefe de Equipe", minXp: 250, maxTier: 2 },
  { title: "Gestor de Sobrevivência", minXp: 450, maxTier: 2 },
  { title: "Dono de Negócio", minXp: 700, maxTier: 3 },
  { title: "Estrategista de Caixa", minXp: 1000, maxTier: 3 },
  { title: "Diretor Executivo", minXp: 1500, maxTier: 4 },
  { title: "Estrategista Master", minXp: 2200, maxTier: 4 }
];

export default function CodigoAzulMaster() {
  const [isMounted, setIsMounted] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  
  // Perfil do Jogador
  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // Sinais Vitais do Negócio
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(35000); 
  const [margem, setMargem] = useState(15.0); 
  const [compliance, setCompliance] = useState(100); 

  // Motor do Jogo
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [inventory, setInventory] = useState<{type: 'reward'|'scar', text: string}[]>([]);
  const [decisionsThisMonth, setDecisionsThisMonth] = useState(0); // A cada 3 decisões, abre o DRE
  
  // Estado da Tela Atual
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>(null);
  const [randomEvent, setRandomEvent] = useState<any>(null);
  const [showDRE, setShowDRE] = useState(false);
  const [gameOver, setGameOver] = useState<{isGameOver: boolean, reason: string}>({isGameOver: false, reason: ""});

  // Estados do DRE
  const [dreProLabore, setDreProLabore] = useState(4000);
  const [dreMarketing, setDreMarketing] = useState(1500);
  const [dreTaxas, setDreTaxas] = useState(1200);

  useEffect(() => { setIsMounted(true); }, []);

  // --- SINCRONIZAÇÃO COM NUVEM (FIREBASE) ---
  const saveToDB = async () => {
    if (!email || !gameStarted) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password,
        data: { playerName, companyName, xp, caixa, margem, compliance, answeredQuestions, inventory, decisionsThisMonth }
      });
    } catch (e) { console.error("Erro ao salvar:", e); }
  };

  useEffect(() => {
    if (gameStarted && !gameOver.isGameOver) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, answeredQuestions, inventory, decisionsThisMonth, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // VERIFICA SE O JOGADOR FALIU
  useEffect(() => {
    if (gameStarted && !feedbackState && !showDRE) {
      if (caixa <= 0) setGameOver({isGameOver: true, reason: "FALÊNCIA DE CAIXA: Sua liquidez secou. Sem oxigênio, a operação infartou."});
      else if (compliance <= 0) setGameOver({isGameOver: true, reason: "INTERDIÇÃO ESTATAL: Passivo oculto, fraudes e processos fecharam suas portas."});
    }
  }, [caixa, compliance, gameStarted, feedbackState, showDRE]);

  // SORTEADOR DE PRÓXIMA FASE
  const pullNextEvent = useCallback(() => {
    setFeedbackState(null);
    setRandomEvent(null);
    
    // Check DRE
    if (decisionsThisMonth >= 3) {
      setShowDRE(true);
      return;
    }

    // 15% de chance de um Cisne Negro 
    if (currentLevel.maxTier > 1 && Math.random() < 0.15) {
      const event = blackSwans[Math.floor(Math.random() * blackSwans.length)];
      setRandomEvent(event);
      return;
    }

    // Filtra perguntas: Tier autorizado E não respondidas
    const availableQuestions = questionBank.filter(q => q.tier <= currentLevel.maxTier && !answeredQuestions.includes(q.id));

    if (availableQuestions.length === 0) {
      alert("MAESTRIA ATINGIDA! Você esgotou os cenários do seu nível atual.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  }, [currentLevel.maxTier, answeredQuestions, decisionsThisMonth]);

  useEffect(() => {
    if (gameStarted && !currentQuestion && !randomEvent && !gameOver.isGameOver && !feedbackState && !showDRE) {
      pullNextEvent();
    }
  }, [gameStarted, currentQuestion, randomEvent, gameOver, feedbackState, showDRE, pullNextEvent]);

  // AÇÃO DE RESPONDER
  const handleAnswer = (option: any) => {
    setXp(prev => Math.max(0, prev + option.xp));
    setCaixa(prev => prev + option.impacts.caixa);
    setMargem(prev => prev + option.impacts.margem);
    setCompliance(prev => prev + Math.max(-100, Math.min(100, option.impacts.compliance)));
    
    setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
    setDecisionsThisMonth(prev => prev + 1);

    let addedItem = null;
    if (option.isBest && option.reward) {
      const newItem = { type: 'reward' as const, text: option.reward };
      setInventory(prev => [newItem, ...prev].slice(0, 4)); 
      addedItem = newItem;
    } else if (!option.isBest && option.lesson) {
      const newItem = { type: 'scar' as const, text: option.lesson };
      setInventory(prev => [newItem, ...prev].slice(0, 4));
      addedItem = newItem;
    }

    setFeedbackState({ option, addedItem });
  };

  const handleBlackSwanAccept = () => {
    setCaixa(prev => prev + randomEvent.impact.caixa);
    setMargem(prev => prev + randomEvent.impact.margem);
    setCompliance(prev => prev + randomEvent.impact.compliance);
    setDecisionsThisMonth(prev => prev + 1);
    setRandomEvent(null);
    pullNextEvent();
  };

  // FECHAMENTO DRE
  const handleAplicarDRE = () => {
    const receita = 60000;
    const custosBase = 22000;
    const totalDespesas = custosBase + dreProLabore + dreMarketing + dreTaxas;
    const lucroLiquido = receita - totalDespesas;
    
    setCaixa(prev => prev + lucroLiquido);
    setMargem((lucroLiquido / receita) * 100);
    setDecisionsThisMonth(0);
    setShowDRE(false);
    pullNextEvent();
  };

  // AUTH
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) return setAuthError("Preencha todos os campos.");
    setIsAuthenticating(true); setAuthError("");

    try {
      const docRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(docRef);

      if (authMode === 'login') {
        if (docSnap.exists() && docSnap.data().password === cleanPassword) {
          const d = docSnap.data().data;
          setPlayerName(d.playerName || "");
          if (!d.companyName) { setNeedsSetup(true); } 
          else {
            setCompanyName(d.companyName); setXp(d.xp || 0); setCaixa(d.caixa ?? 35000); 
            setMargem(d.margem ?? 15.0); setCompliance(d.compliance ?? 100);
            setAnsweredQuestions(d.answeredQuestions || []); setInventory(d.inventory || []);
            setDecisionsThisMonth(d.decisionsThisMonth || 0);
            setGameStarted(true);
          }
        } else { setAuthError("Credenciais inválidas."); }
      } else {
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado."); } 
        else {
          await setDoc(docRef, { password: cleanPassword, data: { playerName: "", companyName: "", xp: 0, caixa: 35000, margem: 15.0, compliance: 100, answeredQuestions: [], inventory: [], decisionsThisMonth: 0 } });
          setNeedsSetup(true);
        }
      }
    } catch (e) { setAuthError("Falha de conexão com a matriz."); } 
    finally { setIsAuthenticating(false); }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !playerName.trim()) return;
    setNeedsSetup(false); setGameStarted(true);
  };

  const handleResetCareer = () => {
    if (confirm("LIQUIDAR CNPJ? Todos os seus dados serão apagados permanentemente.")) {
      setXp(0); setCaixa(35000); setMargem(15.0); setCompliance(100);
      setAnsweredQuestions([]); setInventory([]); setDecisionsThisMonth(0);
      setFeedbackState(null); setRandomEvent(null); setShowDRE(false); setGameOver({isGameOver: false, reason: ""});
      setNeedsSetup(true); setGameStarted(false); setCompanyName("");
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm uppercase">Carregando Painel Executivo...</div>;

  // --- TELA DE ONBOARDING / LOGIN ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-10 rounded-2xl border border-cyan-900/50 shadow-2xl max-w-md w-full relative">
          
          {needsSetup ? (
            <form onSubmit={handleSetupSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Fundação da Empresa</h2>
                <h1 className="text-2xl font-light text-slate-100 tracking-wide">Registro de <span className="font-semibold text-cyan-400">CNPJ</span></h1>
              </div>
              <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Nome da Empresa</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 outline-none" required /></div>
              <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Nome do Dono</label><input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 outline-none" required /></div>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono tracking-widest py-4 rounded-lg uppercase mt-4 transition-all">Assumir o Controle</button>
            </form>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-slate-200 tracking-[0.2em] uppercase">Código <span className="font-bold text-cyan-400">Azul</span></h1>
                <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-2 uppercase font-mono">Simulador de Alta Gestão</p>
              </div>
              <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
                <button onClick={() => { setAuthMode('login'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500'}`}>Acessar</button>
                <button onClick={() => { setAuthMode('register'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500'}`}>Novo CNPJ</button>
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">E-mail Corporativo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 outline-none focus:border-cyan-500" required /></div>
                <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Senha de Acesso</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 outline-none focus:border-cyan-500" required /></div>
                {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}
                <button disabled={isAuthenticating} type="submit" className="w-full bg-cyan-950/40 border border-cyan-800 hover:bg-cyan-900/60 text-cyan-400 text-xs font-mono py-4 rounded-lg uppercase tracking-widest transition-all mt-4">
                  {isAuthenticating ? 'Autenticando...' : authMode === 'login' ? 'Entrar no Painel' : 'Abrir Empresa'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- TELA DE GAME OVER ---
  if (gameOver.isGameOver) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#170f0f]/90 p-8 md:p-12 rounded-3xl border border-red-900/50 max-w-2xl w-full text-center shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-light text-red-500 mb-6 uppercase tracking-widest">Falência Decretada</h1>
          <p className="text-slate-300 text-sm md:text-base font-light text-justify border-l-4 border-red-600 pl-6 mb-10 leading-relaxed bg-red-950/20 py-4 rounded-r-lg">
            {gameOver.reason}
          </p>
          <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 hover:bg-red-900/50 text-red-400 text-xs font-mono py-4 px-10 rounded-xl uppercase tracking-widest transition-all">
            Liquidar CNPJ e Recomeçar
          </button>
        </div>
      </div>
    );
  }

  // --- TELA DO DRE INTERATIVO (FECHAMENTO DO MÊS) ---
  if (showDRE) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="z-10 bg-[#0f172a]/95 p-8 md:p-10 rounded-3xl border border-cyan-900/50 max-w-2xl w-full shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-slate-100 uppercase tracking-widest">Fechamento do <span className="font-semibold text-cyan-400">Mês</span></h1>
            <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase">Ajuste as alavancas operacionais para sobreviver.</p>
          </div>

          <div className="bg-[#020617]/50 rounded-xl border border-slate-800 overflow-hidden mb-8">
            <div className="p-5 space-y-4 font-mono text-xs text-slate-300">
               <div className="flex justify-between items-center"><span className="text-cyan-400 font-bold">RECEITA BRUTA ESPERADA</span><span className="font-bold">{formatBRL(60000)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) Custos Fixos e Impostos Base</span><span>{formatBRL(22000)}</span></div>
               
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-2 rounded"><span>(-) Seu Pró-labore (Retirada)</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-2 rounded"><span>(-) Verba de Marketing</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-2 rounded"><span>(-) Taxas (Antecipação/Juros)</span><span>{formatBRL(dreTaxas)}</span></div>

               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${60000 - 22000 - dreProLabore - dreMarketing - dreTaxas >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">LUCRO LÍQUIDO NO CAIXA</span>
                 <span>{formatBRL(60000 - 22000 - dreProLabore - dreMarketing - dreTaxas)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-emerald-400">Cortar/Aumentar Pró-Labore</span><span className="text-slate-400">{formatBRL(dreProLabore)}</span></div>
               <input type="range" min="0" max="15000" step="500" value={dreProLabore} onChange={(e) => setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-blue-400">Verba de Marketing (Ads)</span><span className="text-slate-400">{formatBRL(dreMarketing)}</span></div>
               <input type="range" min="0" max="5000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Custo Bancário (Desperdício)</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="4000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </div>

          <button onClick={handleAplicarDRE} className="w-full bg-cyan-950/50 border border-cyan-800 hover:bg-cyan-900/70 text-cyan-400 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">
            Virar o Mês e Assumir o Caixa
          </button>
        </div>
      </div>
    );
  }

  // --- PAINEL PRINCIPAL (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* COLUNA ESQUERDA: SINAIS VITAIS */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-xl font-light text-white uppercase tracking-wider truncate mb-1">{companyName}</h2>
            <p className="text-slate-500 text-[10px] font-mono uppercase mb-5">Dono: <span className="text-cyan-400">{playerName}</span></p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-[10px] font-mono uppercase text-slate-400">
                <span>{currentLevel.title}</span>
                <span className="text-cyan-400 font-bold">{xp} XP</span>
              </div>
              <div className="h-1 bg-[#020617] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl space-y-5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Painel de Controle</h3>
            
            <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-mono mb-1">Caixa (Oxigênio)</p>
              <p className={`text-2xl font-light font-mono tracking-wider ${caixa < 10000 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatBRL(caixa)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-mono mb-1">Margem</p>
                <p className={`text-xl font-light font-mono ${margem < 10 ? 'text-amber-400' : 'text-blue-400'}`}>{formatPct(margem)}</p>
              </div>
              <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-mono mb-1">Compliance</p>
                <p className={`text-xl font-light font-mono ${compliance < 50 ? 'text-red-400' : 'text-purple-400'}`}>{compliance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex justify-between">
              <span>Histórico de Gestão</span>
              <span>{decisionsThisMonth}/3 p/ DRE</span>
            </h3>
            {inventory.length === 0 ? (
              <p className="text-[10px] font-mono text-slate-600 uppercase">A mesa está limpa.</p>
            ) : (
              <ul className="space-y-2">
                {inventory.map((item, idx) => (
                  <li key={idx} className={`p-3 rounded-lg text-[10px] font-mono uppercase tracking-wide border ${item.type === 'reward' ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-red-950/20 border-red-900/30 text-red-400'}`}>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* COLUNA DIREITA: TELA DE OPERAÇÕES */}
        <main className="lg:col-span-8 relative">
          
          {/* CISNE NEGRO */}
          {randomEvent && !feedbackState && (
            <div className="bg-amber-950/20 border border-amber-900/50 p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up h-full flex flex-col justify-center">
              <span className="text-amber-500 text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-4">⚠️ Alerta de Mercado (Cisne Negro)</span>
              <h2 className="text-3xl font-light text-slate-100 mb-6">{randomEvent.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">{randomEvent.text}</p>
              
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/30 mb-8 flex gap-8 font-mono text-sm">
                <div><span className="block text-[9px] text-slate-500 uppercase mb-1">Impacto Caixa</span><span className={randomEvent.impact.caixa > 0 ? 'text-emerald-400' : 'text-red-400'}>{formatBRL(randomEvent.impact.caixa)}</span></div>
                <div><span className="block text-[9px] text-slate-500 uppercase mb-1">Margem</span><span className={randomEvent.impact.margem > 0 ? 'text-emerald-400' : 'text-red-400'}>{randomEvent.impact.margem}%</span></div>
              </div>

              <button onClick={handleBlackSwanAccept} className="w-full bg-amber-900/40 hover:bg-amber-800/60 border border-amber-800 text-amber-400 font-mono text-xs py-5 rounded-xl transition-all uppercase tracking-widest">
                Absorver o Choque e Seguir
              </button>
            </div>
          )}

          {/* PERGUNTA NORMAL */}
          {currentQuestion && !randomEvent && !feedbackState && (
            <div className="bg-[#0f172a]/60 border border-white/5 p-6 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up">
              <div className="mb-8 border-b border-white/5 pb-6">
                <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold tracking-widest block mb-2">{currentQuestion.sector}</span>
                <h2 className="text-2xl md:text-3xl font-light text-slate-100 tracking-wide">{currentQuestion.title}</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/20">
                  <p className="text-[10px] font-mono font-bold text-amber-500 mb-3 uppercase tracking-widest">{currentQuestion.character} relata:</p>
                  <p className="text-slate-300 text-sm font-light leading-relaxed text-justify">{currentQuestion.context}</p>
                </div>

                <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/20">
                  <p className="text-[10px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">O Choque de Realidade (Teoria):</p>
                  <p className="text-slate-300 text-sm font-light leading-relaxed text-justify">{currentQuestion.theory}</p>
                </div>

                <div className="pt-6 space-y-4">
                  <h3 className="font-mono text-slate-500 text-[10px] uppercase tracking-[0.3em] text-center mb-4">Tome a Decisão Executiva:</h3>
                  {currentQuestion.options.map((option: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-5 rounded-xl bg-[#020617]/40 hover:bg-[#081229] transition-all border border-slate-800 hover:border-cyan-500/50 group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                      <p className="text-slate-300 text-sm font-light group-hover:text-cyan-50 leading-relaxed pl-2 text-justify">{option.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELA DE FEEDBACK */}
          {feedbackState && (
             <div className={`p-8 md:p-12 rounded-3xl border animate-fade-in-up shadow-2xl h-full flex flex-col justify-center ${feedbackState.option.isBest ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-red-950/10 border-red-900/30'}`}>
              
              <div className="text-center mb-10">
                <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-4 ${feedbackState.option.isBest ? 'text-emerald-500' : 'text-red-500'}`}>
                  {feedbackState.option.isBest ? 'Atitude de Dono Validada' : 'Amadorismo Sancionado'}
                </h2>
                <div className="text-5xl font-light text-slate-100 font-mono">
                  {feedbackState.option.xp > 0 ? '+' : ''}{feedbackState.option.xp} <span className="text-2xl text-slate-600">XP</span>
                </div>
              </div>

              <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-10 text-justify relative">
                 <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">Parecer do Mentor:</span>
                <p className="text-slate-300 text-sm font-light leading-relaxed mt-2">
                  "{feedbackState.option.feedback}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10 text-center font-mono">
                <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800/50">
                  <span className="block text-slate-600 text-[9px] uppercase tracking-widest mb-2">Caixa</span>
                  <span className={`text-lg ${feedbackState.option.impacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.caixa > 0 ? '+' : ''}{formatBRL(feedbackState.option.impacts.caixa)}
                  </span>
                </div>
                <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800/50">
                  <span className="block text-slate-600 text-[9px] uppercase tracking-widest mb-2">Margem</span>
                  <span className={`text-lg ${feedbackState.option.impacts.margem >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.margem > 0 ? '+' : ''}{feedbackState.option.impacts.margem}%
                  </span>
                </div>
                <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800/50">
                  <span className="block text-slate-600 text-[9px] uppercase tracking-widest mb-2">Compliance</span>
                  <span className={`text-lg ${feedbackState.option.impacts.compliance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.compliance > 0 ? '+' : ''}{feedbackState.option.impacts.compliance}
                  </span>
                </div>
              </div>

              <button onClick={pullNextEvent} className="w-full border border-slate-600 hover:border-cyan-500 text-cyan-400 font-mono text-xs py-5 rounded-xl transition-all uppercase tracking-[0.2em]">
                Prosseguir Operação
              </button>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-between items-center px-4">
         <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">Projeto Código Azul © 2026</span>
         <button onClick={handleResetCareer} className="text-[9px] font-mono text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest">
          Liquidar CNPJ (Reset)
        </button>
      </div>
    </div>
  );
}