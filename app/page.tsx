"use client";

import { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { questionBank } from "./questions"; 

// --- CONFIGURAÇÃO FIREBASE ---
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

const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// --- CURVA LENTA E ÁRDUA DE PROGRESSÃO ---
const levels = [
  { title: "Apagador de Incêndios", minXp: 0, maxTier: 1 },
  { title: "Sobrevivente do Mês", minXp: 50, maxTier: 1 },
  { title: "Gestor Operacional", minXp: 120, maxTier: 2 },
  { title: "Líder de Caixa", minXp: 220, maxTier: 2 },
  { title: "Dono de Negócio", minXp: 350, maxTier: 3 },
  { title: "Estrategista", minXp: 550, maxTier: 3 },
  { title: "Diretor Executivo", minXp: 850, maxTier: 4 },
  { title: "Mestre do Capital", minXp: 1300, maxTier: 4 }
];

export default function CodigoAzulMaster() {
  const [isMounted, setIsMounted] = useState(false);
  
  // --- FUNIL DE LEAD (AUTH) ---
  const [gameStarted, setGameStarted] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // --- SINAIS VITAIS DO NEGÓCIO ---
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(15000); 
  const [receita, setReceita] = useState(30000); 
  const [compliance, setCompliance] = useState(100); 

  // --- CONTROLES DA DRE ---
  const [dreProLabore, setDreProLabore] = useState(3000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreCustosInuteis, setDreCustosInuteis] = useState(2500);

  // --- MOTOR DE JOGO ---
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [decisionsThisMonth, setDecisionsThisMonth] = useState(0); // Volta para ciclo de 4
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>(null);
  const [showDRE, setShowDRE] = useState(false);
  const [isConsultingUsed, setIsConsultingUsed] = useState(false);
  const [gameOver, setGameOver] = useState<{is: boolean, reason: string}>({is: false, reason: ""});
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState("Salvar Progresso");

  useEffect(() => { setIsMounted(true); }, []);

  // --- SALVAMENTO MANUAL E AUTOMÁTICO ---
  const saveProgress = async () => {
    if (!email) return;
    setIsSaving(true);
    setSaveStatusText("Salvando...");
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password,
        data: { nome, telefone, companyName, xp, caixa, receita, compliance, answeredQuestions, decisionsThisMonth, dreProLabore, dreMarketing, dreCustosInuteis }
      });
      setSaveStatusText("Dados Sincronizados");
      setTimeout(() => setSaveStatusText("Salvar Progresso"), 3000);
    } catch (e) { 
      console.error("Erro no save:", e); 
      setSaveStatusText("Erro ao Salvar");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver.is && !showDRE) {
        setDoc(doc(db, "users", email.toLowerCase()), {
            password, data: { nome, telefone, companyName, xp, caixa, receita, compliance, answeredQuestions, decisionsThisMonth, dreProLabore, dreMarketing, dreCustosInuteis }
          }).catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, receita, compliance, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressPct = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // --- SORTEIO DE QUESTÕES ---
  const pullNextEvent = useCallback(() => {
    setFeedbackState(null);
    setIsConsultingUsed(false);
    
    // A CADA 4 DECISÕES, CHAMA A DRE
    if (decisionsThisMonth >= 4) {
      setShowDRE(true);
      return;
    }

    const available = questionBank.filter(q => q.tier <= currentLevel.maxTier && !answeredQuestions.includes(q.id));
    
    if (available.length > 0) {
      setCurrentQuestion(available[Math.floor(Math.random() * available.length)]);
    } else {
      setCurrentQuestion(questionBank[Math.floor(Math.random() * questionBank.length)]);
    }
  }, [currentLevel.maxTier, answeredQuestions, decisionsThisMonth]);

  useEffect(() => {
    if (gameStarted && !currentQuestion && !showDRE && !gameOver.is) pullNextEvent();
  }, [gameStarted, currentQuestion, showDRE, gameOver, pullNextEvent]);

  // --- AÇÃO E IMPACTO ---
  const handleAnswer = (option: any) => {
    let finalXp = option.xp;
    // XP cortado se pedir ajuda
    if (isConsultingUsed && option.isBest && finalXp > 0) finalXp = Math.max(1, Math.floor(finalXp / 2));
    
    setXp(prev => Math.max(0, prev + finalXp));
    setCaixa(prev => prev + (option.impacts.caixa || 0));
    setReceita(prev => Math.max(5000, prev + (option.impacts.receita || 0)));
    setCompliance(prev => Math.max(0, Math.min(100, prev + (option.impacts.compliance || 0))));
    
    if (currentQuestion.id) setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
    setDecisionsThisMonth(prev => prev + 1);
    
    setFeedbackState({ option, earnedXp: finalXp });
  };

  // --- PROCESSAR DRE E VIRAR O MÊS ---
  const processDRE = () => {
    const custoFixoOperacional = receita * 0.40;
    const totalDespesas = custoFixoOperacional + dreProLabore + dreMarketing + dreCustosInuteis;
    const lucroLiquido = receita - totalDespesas;
    
    let novaReceita = receita;
    if (dreMarketing > receita * 0.08) novaReceita = receita * 1.12; 
    else if (dreMarketing < receita * 0.02) novaReceita = receita * 0.90;

    setCaixa(prev => prev + lucroLiquido);
    setReceita(novaReceita);
    setDecisionsThisMonth(0);
    setShowDRE(false);

    if (caixa + lucroLiquido <= -5000) {
      setGameOver({is: true, reason: "Insolvência Operacional. A empresa ficou sem capital de giro e os credores bloquearam as contas."});
    } else {
      pullNextEvent();
    }
  };

  // --- AUTH E CAPTURA DE LEAD ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return setAuthError("Preencha os campos obrigatórios.");
    setIsAuthenticating(true); setAuthError("");

    try {
      const docRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(docRef);

      if (authMode === 'login') {
        if (docSnap.exists() && docSnap.data().password === password) {
          const d = docSnap.data().data;
          setNome(d.nome); setTelefone(d.telefone); setCompanyName(d.companyName);
          setXp(d.xp || 0); setCaixa(d.caixa ?? 15000); setReceita(d.receita ?? 30000); setCompliance(d.compliance ?? 100);
          setAnsweredQuestions(d.answeredQuestions || []); setDecisionsThisMonth(d.decisionsThisMonth || 0);
          setDreProLabore(d.dreProLabore ?? 3000); setDreMarketing(d.dreMarketing ?? 1000); setDreCustosInuteis(d.dreCustosInuteis ?? 2500);
          setGameStarted(true);
        } else { setAuthError("Credenciais inválidas."); }
      } else {
        if (!nome || !telefone || !companyName) return setAuthError("Preencha todos os dados da empresa.");
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado."); } 
        else {
          await setDoc(docRef, { password, data: { nome, telefone, companyName, email: cleanEmail, xp: 0, caixa: 15000, receita: 30000, compliance: 100, answeredQuestions: [], decisionsThisMonth: 0, dreProLabore: 3000, dreMarketing: 1000, dreCustosInuteis: 2500 } });
          setGameStarted(true);
        }
      }
    } catch (e) { setAuthError("Falha na conexão com servidor."); } 
    finally { setIsAuthenticating(false); }
  };

  // --- RESET TOTAL ---
  const handleReset = () => {
    if (confirm("LIQUIDAR CNPJ? AVISO: Isso apagará seu histórico irreversivelmente.")) {
      setXp(0); setCaixa(15000); setReceita(30000); setCompliance(100);
      setDreProLabore(3000); setDreMarketing(1000); setDreCustosInuteis(2500);
      setAnsweredQuestions([]); setDecisionsThisMonth(0); setFeedbackState(null); setShowDRE(false);
      setGameOver({is: false, reason: ""});
      saveProgress();
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-500 tracking-widest text-sm">INICIALIZANDO TERMINAL...</div>;

  // ==========================================
  // TELA 1: CAPTURA DE LEAD (VISUAL FINTECH)
  // ==========================================
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/60 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(6,182,212,0.1)] max-w-sm w-full relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-slate-100 tracking-[0.2em] uppercase">
              Código <span className="font-semibold text-cyan-400">Azul</span>
            </h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] mt-2 uppercase font-mono">Terminal Executivo PME</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('register'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Criar CNPJ</button>
            <button onClick={() => { setAuthMode('login'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Autenticar</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div><input type="text" placeholder="Nome Completo" value={nome} onChange={e=>setNome(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required /></div>
                <div><input type="tel" placeholder="WhatsApp (Para Mentoria)" value={telefone} onChange={e=>setTelefone(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required /></div>
                <div><input type="text" placeholder="Nome da Empresa" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required /></div>
              </>
            )}
            <div><input type="email" placeholder="E-mail Corporativo" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required /></div>
            <div><input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 font-mono transition-all" required /></div>
            
            {authError && <div className="text-amber-400 text-[11px] font-mono text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">{authError}</div>}
            
            <button disabled={isAuthenticating} type="submit" className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 text-xs font-mono tracking-widest py-4 rounded-lg transition-all mt-2 uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              {isAuthenticating ? 'CONECTANDO...' : authMode === 'login' ? 'ACESSAR TERMINAL' : 'ESTABELECER EMPRESA'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 2: GAME OVER (FALÊNCIA)
  // ==========================================
  if (gameOver.is) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#0f172a]/90 backdrop-blur-xl p-10 md:p-14 rounded-2xl border border-red-900/50 shadow-[0_0_50px_rgba(239,68,68,0.1)] max-w-lg w-full text-center">
          <div className="text-5xl mb-6">📉</div>
          <h1 className="text-3xl font-light text-red-500 mb-4 tracking-widest uppercase">Falência Decretada</h1>
          <p className="text-slate-300 text-sm font-light leading-relaxed mb-8 font-mono">{gameOver.reason}</p>
          <button onClick={handleReset} className="w-full bg-transparent border border-red-900 hover:border-red-500 text-red-500 hover:text-red-400 text-xs font-mono tracking-widest py-4 rounded-lg transition-all uppercase">
            Liquidar CNPJ e Reiniciar
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 3: DRE INTERATIVA (FECHAMENTO)
  // ==========================================
  if (showDRE) {
    const custoFixoOperacional = receita * 0.40;
    const totalDespesas = custoFixoOperacional + dreProLabore + dreMarketing + dreCustosInuteis;
    const lucro = receita - totalDespesas;

    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl max-w-2xl w-full relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-slate-100 tracking-widest uppercase">Painel de <span className="font-semibold text-cyan-400">Controladoria</span></h1>
            <p className="text-slate-500 text-[10px] tracking-[0.2em] mt-2 uppercase font-mono">DRE: Defina as alavancas do próximo mês</p>
          </div>
          
          <div className="bg-[#020617]/60 p-6 rounded-xl border border-slate-800/80 font-mono text-sm space-y-5 mb-8 shadow-inner">
            <div className="flex justify-between text-cyan-400 font-bold text-base border-b border-slate-800/80 pb-3">
              <span>RECEITA FATURADA</span><span>{formatBRL(receita)}</span>
            </div>
            
            <div className="text-slate-500 text-[10px] tracking-widest uppercase">(-) Custo Fixo Base (40%) = {formatBRL(custoFixoOperacional)}</div>
            
            <div className="space-y-6 pt-2">
              <div>
                <label className="flex justify-between text-emerald-400/90 text-xs mb-3"><span>Pró-labore Sócio</span><span>{formatBRL(dreProLabore)}</span></label>
                <input type="range" min="1412" max={receita * 0.5} step="500" value={dreProLabore} onChange={(e)=>setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="flex justify-between text-blue-400/90 text-xs mb-3"><span>Budget Tráfego/Ads</span><span>{formatBRL(dreMarketing)}</span></label>
                <input type="range" min="0" max={receita * 0.3} step="250" value={dreMarketing} onChange={(e)=>setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="flex justify-between text-amber-400/90 text-xs mb-3"><span>Desperdícios/Juros</span><span>{formatBRL(dreCustosInuteis)}</span></label>
                <input type="range" min="500" max={5000} step="250" value={dreCustosInuteis} onChange={(e)=>setDreCustosInuteis(Number(e.target.value))} className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>

            <div className={`flex justify-between pt-5 border-t border-slate-800/80 font-bold text-lg ${lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="uppercase text-xs tracking-widest mt-1">Lucro Líquido Real</span><span>{formatBRL(lucro)}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={processDRE} className="flex-1 bg-[#020617] hover:bg-[#050A15] border border-slate-700 text-slate-300 font-mono text-[10px] py-4 rounded-lg uppercase tracking-[0.2em] transition-colors shadow-lg">
              Validar DRE
            </button>
            <a href={`https://wa.me/5521999999999?text=Pedro,%20meu%20CNPJ%20precisa%20de%20ajuda.%20A%20empresa%20${companyName}%20precisa%20de%20mentoria.`} target="_blank" rel="noreferrer" className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-500/30 text-white text-center flex items-center justify-center font-mono text-[10px] py-4 rounded-lg uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Mentoria com Pedro Monte
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 4: DASHBOARD CORPORATIVO (O JOGO)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* HUD HEADER */}
        <header className="bg-[#0f172a]/60 backdrop-blur-2xl p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
          
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-xl font-light text-slate-100 tracking-[0.15em] uppercase mb-1">
              <span className="font-semibold text-cyan-400">{companyName}</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">ID: <span className="text-slate-300">{nome}</span></p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="text-center md:text-right">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Mês Operacional</p>
                <div className="text-sm font-mono text-cyan-400 font-bold">{decisionsThisMonth}/4</div>
             </div>
             <button onClick={saveProgress} disabled={isSaving} className="bg-[#020617]/80 hover:bg-[#020617] border border-cyan-900/50 hover:border-cyan-500/50 text-cyan-400 font-mono text-[9px] uppercase tracking-[0.2em] px-4 py-2.5 rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.05)] w-full md:w-auto">
               {saveStatusText}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SINAIS VITAIS (BARRA LATERAL) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#0f172a]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-5">Visão Executiva</h3>
              
              <div className="bg-[#020617]/50 p-5 rounded-xl border border-slate-800/80 mb-4 shadow-inner">
                <p className="text-[10px] text-slate-500 uppercase font-mono mb-1 tracking-wider">Caixa (Liquidez)</p>
                <p className={`text-2xl font-light font-mono tracking-wider ${caixa < 10000 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatBRL(caixa)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                  <p className="text-[9px] text-slate-500 uppercase font-mono mb-1 tracking-wider">Receita</p>
                  <p className="text-sm font-light font-mono text-blue-400">{formatBRL(receita)}</p>
                </div>
                <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                  <p className="text-[9px] text-slate-500 uppercase font-mono mb-1 tracking-wider">Compliance</p>
                  <p className={`text-sm font-light font-mono ${compliance < 50 ? 'text-red-400' : 'text-purple-400'}`}>{compliance}%</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">{currentLevel.title}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono tracking-widest">
                  <span>XP {xp}</span>
                  <span className="text-cyan-600">META {nextLevel ? nextLevel.minXp : 'MAX'}</span>
                </div>
                <div className="h-1.5 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_#06b6d4]" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            </div>
          </aside>

          {/* ÁREA DE DECISÃO (MAIN PANEL) */}
          <main className="lg:col-span-8">
            {currentQuestion && !feedbackState && (
              <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
                
                <div className="mb-8 border-b border-white/5 pb-6">
                  <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 block">{currentQuestion.sector}</span>
                  <h2 className="text-2xl md:text-3xl font-light text-slate-100 tracking-wide">{currentQuestion.title}</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#020617]/40 p-6 rounded-xl border border-white/5 border-l-2 border-l-slate-700">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2">Relato do {currentQuestion.character}</p>
                    <p className="text-slate-300 text-sm font-light leading-relaxed">{currentQuestion.context}</p>
                  </div>

                  <div className="bg-[#020617]/40 p-6 rounded-xl border border-white/5 border-l-2 border-l-cyan-900">
                    <p className="text-[9px] font-mono text-cyan-700 uppercase tracking-[0.2em] mb-2">Teoria e Fundamentação</p>
                    <p className="text-slate-300 text-sm font-light leading-relaxed">{currentQuestion.theory}</p>
                  </div>

                  {/* BOTÃO CONSULTORIA */}
                  {!isConsultingUsed && currentQuestion.consultoriaHint && (
                    <button onClick={() => setIsConsultingUsed(true)} className="w-full bg-amber-950/10 hover:bg-amber-900/20 border border-amber-900/30 text-amber-500/80 p-4 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex flex-col md:flex-row justify-between items-center gap-2">
                      <span>Solicitar Mentoria Interna</span>
                      <span className="opacity-60">(Custo: 50% XP da Decisão)</span>
                    </button>
                  )}

                  {isConsultingUsed && (
                    <div className="bg-amber-950/20 border-l-2 border-l-amber-600 p-6 rounded-r-xl">
                      <p className="text-[9px] font-mono text-amber-600 uppercase tracking-[0.2em] mb-2">Visão de Pedro Monte:</p>
                      <p className="text-amber-200/90 text-sm font-light leading-relaxed">{currentQuestion.consultoriaHint}</p>
                    </div>
                  )}

                  <div className="pt-6 space-y-4">
                    <h3 className="font-mono text-slate-500 text-[10px] uppercase tracking-[0.3em] text-center mb-4">Executar Ordem</h3>
                    {currentQuestion.options.map((opt: any, i: number) => (
                      <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-6 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group relative overflow-hidden">
                        <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                        <p className="text-slate-300 text-sm font-light group-hover:text-cyan-50 leading-relaxed pl-2">{opt.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {feedbackState && (
               <div className="bg-[#0f172a]/60 backdrop-blur-2xl p-10 md:p-14 rounded-2xl border border-white/5 shadow-2xl relative text-center">
                <div className={`absolute top-0 left-0 w-full h-1 ${feedbackState.option.isBest ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`}></div>
                
                <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-6 mt-4 ${feedbackState.option.isBest ? 'text-emerald-500' : 'text-red-400'}`}>
                  {feedbackState.option.isBest ? 'Decisão Executiva Aprovada' : 'Risco Operacional Sancionado'}
                </h2>
                
                <div className="text-5xl font-light text-slate-100 tracking-wider mb-2 font-mono">
                  {feedbackState.earnedXp > 0 ? '+' : ''}{feedbackState.earnedXp} <span className="text-xl text-slate-600">XP</span>
                </div>
                
                {isConsultingUsed && feedbackState.option.isBest && (
                  <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest mb-8 bg-amber-950/30 inline-block px-3 py-1 rounded-md border border-amber-900/50">
                    Penalidade de XP (Mentoria)
                  </div>
                )}

                <div className="bg-[#020617]/50 p-8 rounded-xl border border-white/5 mb-8 text-left max-w-2xl mx-auto relative">
                  <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">Parecer Técnico:</span>
                  <p className="text-slate-300 text-sm font-light leading-relaxed mt-2">
                    {feedbackState.option.feedback}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10 text-center font-mono max-w-2xl mx-auto">
                  <div className="bg-[#020617]/40 p-4 rounded-xl border border-white/5">
                    <span className="block text-slate-500 text-[9px] uppercase tracking-[0.2em] mb-2">Caixa</span>
                    <span className={`text-lg font-light ${feedbackState.option.impacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {feedbackState.option.impacts.caixa > 0 ? '+' : ''}{formatBRL(feedbackState.option.impacts.caixa)}
                    </span>
                  </div>
                  <div className="bg-[#020617]/40 p-4 rounded-xl border border-white/5">
                    <span className="block text-slate-500 text-[9px] uppercase tracking-[0.2em] mb-2">Receita</span>
                    <span className={`text-lg font-light ${feedbackState.option.impacts.receita >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {feedbackState.option.impacts.receita > 0 ? '+' : ''}{formatBRL(feedbackState.option.impacts.receita)}
                    </span>
                  </div>
                  <div className="bg-[#020617]/40 p-4 rounded-xl border border-white/5">
                    <span className="block text-slate-500 text-[9px] uppercase tracking-[0.2em] mb-2">Compliance</span>
                    <span className={`text-lg font-light ${feedbackState.option.impacts.compliance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {feedbackState.option.impacts.compliance > 0 ? '+' : ''}{feedbackState.option.impacts.compliance}
                    </span>
                  </div>
                </div>

                <button onClick={pullNextEvent} className="bg-transparent border border-slate-600 hover:border-cyan-400 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono tracking-[0.3em] py-4 px-12 rounded-xl transition-all uppercase hover:bg-cyan-950/20">
                  Prosseguir Operação
                </button>
              </div>
            )}
          </main>
        </div>

        {/* FOOTER CORPORATIVO */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-800/50 pb-4">
           <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">CÓDIGO AZUL © 2026</span>
           <button onClick={handleReset} className="text-[9px] font-mono text-slate-600 hover:text-red-500 uppercase tracking-[0.2em] transition-colors">
            Liquidar CNPJ (Resetar Matriz)
           </button>
        </div>
      </div>
    </div>
  );
}