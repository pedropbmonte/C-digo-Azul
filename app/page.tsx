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
  { title: "Sobrevivente do Mês", minXp: 40, maxTier: 1 },
  { title: "Gestor Operacional", minXp: 100, maxTier: 2 },
  { title: "Líder de Caixa", minXp: 200, maxTier: 2 },
  { title: "Dono de Negócio", minXp: 350, maxTier: 3 },
  { title: "Estrategista", minXp: 550, maxTier: 3 },
  { title: "Diretor Executivo", minXp: 850, maxTier: 4 },
  { title: "Mestre do Capital", minXp: 1300, maxTier: 4 }
];

export default function CodigoAzulPremium() {
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

  // --- SINAIS VITAIS DO NEGÓCIO (REALIDADE PME ATÉ 50K) ---
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(12000); 
  const [receita, setReceita] = useState(30000); 
  const [compliance, setCompliance] = useState(100); 

  // --- CONTROLES DA DRE ---
  const [dreProLabore, setDreProLabore] = useState(3000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreCustosInuteis, setDreCustosInuteis] = useState(2500);

  // --- MOTOR DE JOGO ---
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [decisionsThisMonth, setDecisionsThisMonth] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>(null);
  const [showDRE, setShowDRE] = useState(false);
  const [isConsultingUsed, setIsConsultingUsed] = useState(false);
  const [gameOver, setGameOver] = useState<{is: boolean, reason: string}>({is: false, reason: ""});

  useEffect(() => { setIsMounted(true); }, []);

  // --- SALVAMENTO NA NUVEM ---
  const saveProgress = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password,
        data: { nome, telefone, companyName, xp, caixa, receita, compliance, answeredQuestions, decisionsThisMonth, dreProLabore, dreMarketing }
      });
    } catch (e) { console.error("Erro no save:", e); }
  };

  useEffect(() => {
    if (gameStarted && !gameOver.is) saveProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, receita, compliance, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressPct = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // --- SORTEIO DE QUESTÕES ---
  const pullNextEvent = useCallback(() => {
    setFeedbackState(null);
    setIsConsultingUsed(false);
    
    // A cada 3 decisões, fecha o mês e abre a DRE
    if (decisionsThisMonth >= 3) {
      setShowDRE(true);
      return;
    }

    const available = questionBank.filter(q => q.tier <= currentLevel.maxTier && !answeredQuestions.includes(q.id));
    
    if (available.length > 0) {
      setCurrentQuestion(available[Math.floor(Math.random() * available.length)]);
    } else {
      // Loop infinito com fallback
      setCurrentQuestion(questionBank[Math.floor(Math.random() * questionBank.length)]);
    }
  }, [currentLevel.maxTier, answeredQuestions, decisionsThisMonth]);

  useEffect(() => {
    if (gameStarted && !currentQuestion && !showDRE && !gameOver.is) pullNextEvent();
  }, [gameStarted, currentQuestion, showDRE, gameOver, pullNextEvent]);

  // --- AÇÃO E IMPACTO ---
  const handleAnswer = (option: any) => {
    let finalXp = option.xp;
    // Punição de XP se usou a dica do mentor, mas recompensa garantida se acertar
    if (isConsultingUsed && option.isBest) finalXp = Math.max(1, Math.floor(finalXp / 2));
    
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
    const custoFixoOperacional = receita * 0.40; // 40% da receita vai pro ralo básico
    const totalDespesas = custoFixoOperacional + dreProLabore + dreMarketing + dreCustosInuteis;
    const lucroLiquido = receita - totalDespesas;
    
    let novaReceita = receita;
    // Dinamismo: Marketing aumenta receita futura, corte total esfria vendas
    if (dreMarketing > receita * 0.08) novaReceita = receita * 1.12; 
    else if (dreMarketing < receita * 0.02) novaReceita = receita * 0.90;

    setCaixa(prev => prev + lucroLiquido);
    setReceita(novaReceita);
    setDecisionsThisMonth(0);
    setShowDRE(false);

    if (caixa + lucroLiquido <= -5000) {
      setGameOver({is: true, reason: "Insolvência. O balanço sugou sua liquidez e o banco cortou suas linhas de crédito."});
    } else {
      pullNextEvent();
    }
  };

  // --- AUTH E CAPTURA DE LEAD (FIREBASE) ---
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
          setXp(d.xp || 0); setCaixa(d.caixa ?? 12000); setReceita(d.receita ?? 30000); setCompliance(d.compliance ?? 100);
          setAnsweredQuestions(d.answeredQuestions || []); setDecisionsThisMonth(d.decisionsThisMonth || 0);
          setGameStarted(true);
        } else { setAuthError("Credenciais inválidas."); }
      } else {
        if (!nome || !telefone || !companyName) return setAuthError("Preencha todos os dados da empresa.");
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado."); } 
        else {
          await setDoc(docRef, { password, data: { nome, telefone, companyName, email: cleanEmail, xp: 0, caixa: 12000, receita: 30000, compliance: 100, answeredQuestions: [], decisionsThisMonth: 0 } });
          setGameStarted(true);
        }
      }
    } catch (e) { setAuthError("Falha na conexão."); } 
    finally { setIsAuthenticating(false); }
  };

  // --- RESET TOTAL ---
  const handleReset = () => {
    if (confirm("LIQUIDAR CNPJ? Você perderá todo o histórico e começará do zero.")) {
      setXp(0); setCaixa(12000); setReceita(30000); setCompliance(100);
      setAnsweredQuestions([]); setDecisionsThisMonth(0); setFeedbackState(null); setShowDRE(false);
      setGameOver({is: false, reason: ""});
      saveProgress();
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-blue-500">Iniciando Servidor...</div>;

  // ==========================================
  // TELA 1: CAPTURA DE LEAD PREMIUM
  // ==========================================
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative font-sans">
        {/* Efeitos de Fundo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="z-10 bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-tighter mb-1">
              Código Azul
            </h1>
            <p className="text-slate-400 text-[10px] font-mono tracking-[0.2em] uppercase">Simulador de Alta Gestão PME</p>
          </div>

          <div className="flex bg-slate-950 rounded-lg p-1 mb-6 border border-slate-800">
            <button onClick={() => { setAuthMode('register'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-blue-900/40 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Criar CNPJ</button>
            <button onClick={() => { setAuthMode('login'); setAuthError(""); }} className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-blue-900/40 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div><label className="text-[10px] text-slate-400 font-mono uppercase mb-1 block">Seu Nome</label><input type="text" value={nome} onChange={e=>setNome(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" required /></div>
                <div><label className="text-[10px] text-slate-400 font-mono uppercase mb-1 block">WhatsApp (Para Mentoria)</label><input type="tel" value={telefone} onChange={e=>setTelefone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" required /></div>
                <div><label className="text-[10px] text-slate-400 font-mono uppercase mb-1 block">Nome do Negócio</label><input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" required /></div>
              </>
            )}
            <div><label className="text-[10px] text-slate-400 font-mono uppercase mb-1 block">E-mail Corporativo</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" required /></div>
            <div><label className="text-[10px] text-slate-400 font-mono uppercase mb-1 block">Senha Segura</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" required /></div>
            
            {authError && <div className="text-red-400 text-xs font-mono text-center bg-red-900/20 p-2 rounded border border-red-900/50">{authError}</div>}
            
            <button disabled={isAuthenticating} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-lg transition-transform active:scale-95 uppercase tracking-widest text-xs mt-2 shadow-lg shadow-blue-900/50">
              {isAuthenticating ? 'PROCESSANDO...' : authMode === 'login' ? 'ACESSAR PAINEL' : 'FUNDAR EMPRESA E INICIAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 2: GAME OVER
  // ==========================================
  if (gameOver.is) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative text-center">
        <div className="bg-slate-900/90 p-10 rounded-3xl border border-red-900/50 shadow-2xl max-w-lg w-full">
          <div className="text-6xl mb-4">📉</div>
          <h1 className="text-4xl font-black text-red-500 mb-4 uppercase tracking-tighter">Falência Decretada</h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">{gameOver.reason}</p>
          <button onClick={handleReset} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-colors uppercase tracking-widest text-xs w-full">
            Liquidar CNPJ e Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 3: DRE INTERATIVA (FECHAMENTO DO MÊS)
  // ==========================================
  if (showDRE) {
    const custoFixoOperacional = receita * 0.40;
    const totalDespesas = custoFixoOperacional + dreProLabore + dreMarketing + dreCustosInuteis;
    const lucro = receita - totalDespesas;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-3xl border border-blue-900/30 max-w-2xl w-full shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Painel de Controladoria (DRE)</h1>
            <p className="text-slate-400 text-xs font-mono">Suas alavancas de gastos ditam a saúde do próximo mês.</p>
          </div>
          
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-sm space-y-4 mb-8">
            <div className="flex justify-between text-blue-400 font-bold text-base border-b border-slate-800 pb-2">
              <span>RECEITA FATURADA</span><span>{formatBRL(receita)}</span>
            </div>
            
            <div className="text-slate-500 text-xs">(-) Custo Fixo Operacional (40%) = {formatBRL(custoFixoOperacional)}</div>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="flex justify-between text-emerald-400 text-xs mb-2">Seu Pró-labore (Retirada) - {formatBRL(dreProLabore)}</label>
                <input type="range" min="1412" max={receita * 0.5} step="500" value={dreProLabore} onChange={(e)=>setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="flex justify-between text-blue-400 text-xs mb-2">Tráfego e Marketing - {formatBRL(dreMarketing)}</label>
                <input type="range" min="0" max={receita * 0.3} step="250" value={dreMarketing} onChange={(e)=>setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="flex justify-between text-red-400 text-xs mb-2">Desperdícios / Juros Bancários - {formatBRL(dreCustosInuteis)}</label>
                <input type="range" min="500" max={5000} step="250" value={dreCustosInuteis} onChange={(e)=>setDreCustosInuteis(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>

            <div className={`flex justify-between pt-4 border-t border-slate-800 font-bold text-lg ${lucro >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <span className="uppercase">Lucro Líquido Gerado</span><span>{formatBRL(lucro)}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={processDRE} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-colors border border-slate-600">
              Aprovar DRE e Avançar
            </button>
            <a href={`https://wa.me/5521999999999?text=Pedro,%20meu%20CNPJ%20precisa%20de%20ajuda.%20Gostaria%20de%20mentoria%20para%20a%20empresa%20${companyName}.`} target="_blank" rel="noreferrer" className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-center flex items-center justify-center font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-lg shadow-emerald-900/50">
              Solicitar Mentoria Real
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 4: DASHBOARD PRINCIPAL (O JOGO)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      
      {/* HUD HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter truncate max-w-md">{companyName}</h1>
          <p className="text-blue-400 text-xs font-bold uppercase mt-1">{currentLevel.title} • {nome}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            Mês Operacional: <span className="text-blue-400 font-bold">{decisionsThisMonth}/3</span>
          </span>
          <button onClick={handleReset} className="text-[10px] font-mono font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors">
            Resetar Jornada
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: SINAIS VITAIS */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* PAINEL DE CAIXA */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Painel de Controle</h3>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Caixa Disponível (Liquidez)</p>
              <p className={`text-2xl font-bold font-mono tracking-wider ${caixa < 10000 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatBRL(caixa)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Receita / Mês</p>
                <p className="text-lg font-bold font-mono text-blue-400">{formatBRL(receita)}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Compliance</p>
                <p className={`text-lg font-bold font-mono ${compliance < 50 ? 'text-red-400' : 'text-purple-400'}`}>{compliance}%</p>
              </div>
            </div>
          </div>

          {/* BARRA DE XP */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex justify-between items-baseline mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Progresso de Liderança</span>
                <span className="text-xs font-bold text-blue-500">{xp} XP</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
              </div>
          </div>
        </aside>

        {/* COLUNA DIREITA: A MESA DO CEO */}
        <main className="lg:col-span-8">
          
          {currentQuestion && !feedbackState && (
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up">
              <div className="mb-8 border-b border-slate-800 pb-6">
                <span className="text-blue-500 font-mono text-[10px] uppercase font-bold tracking-widest block mb-2">{currentQuestion.sector}</span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{currentQuestion.title}</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] font-mono font-bold text-slate-400 mb-3 uppercase tracking-widest">{currentQuestion.character} relata:</p>
                  <p className="text-slate-200 text-sm leading-relaxed text-justify">{currentQuestion.context}</p>
                </div>

                <div className="bg-blue-950/20 p-6 rounded-2xl border border-blue-900/30">
                  <p className="text-[10px] font-mono font-bold text-blue-500 mb-3 uppercase tracking-widest">Fundamentação Técnica:</p>
                  <p className="text-slate-300 text-sm leading-relaxed text-justify">{currentQuestion.theory}</p>
                </div>

                {/* BOTÃO CONSULTORIA */}
                {!isConsultingUsed && currentQuestion.consultoriaHint && (
                  <button onClick={() => setIsConsultingUsed(true)} className="w-full bg-amber-950/20 hover:bg-amber-900/30 border border-amber-700/50 text-amber-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex flex-col md:flex-row justify-between items-center gap-2">
                    <span>Acionar Mentoria Privada</span>
                    <span className="text-[10px] font-mono opacity-80">(Custa 50% do XP desta decisão)</span>
                  </button>
                )}

                {isConsultingUsed && (
                  <div className="bg-amber-900/20 border-l-4 border-amber-500 p-5 rounded-r-xl">
                    <p className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest mb-2">Visão do Mentor (Pedro Monte):</p>
                    <p className="text-amber-200 text-sm leading-relaxed">{currentQuestion.consultoriaHint}</p>
                  </div>
                )}

                <div className="pt-6 space-y-4">
                  <h3 className="font-mono text-slate-500 text-[10px] uppercase tracking-[0.3em] text-center mb-4">Qual sua ordem executiva?</h3>
                  {currentQuestion.options.map((opt: any, i: number) => (
                    <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 transition-all group relative overflow-hidden shadow-md">
                      <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors"></div>
                      <p className="text-slate-300 text-sm font-medium group-hover:text-white leading-relaxed pl-2 text-justify">{opt.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {feedbackState && (
             <div className={`p-8 md:p-12 rounded-3xl border animate-fade-in-up shadow-2xl ${feedbackState.option.isBest ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              
              <div className="text-center mb-8">
                <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] font-bold mb-4 ${feedbackState.option.isBest ? 'text-emerald-500' : 'text-red-500'}`}>
                  {feedbackState.option.isBest ? 'Decisão Cirúrgica' : 'Amadorismo Sancionado'}
                </h2>
                <div className="text-5xl font-black text-white font-mono mb-2">
                  {feedbackState.earnedXp > 0 ? '+' : ''}{feedbackState.earnedXp} <span className="text-2xl text-slate-600">XP</span>
                </div>
                {isConsultingUsed && feedbackState.option.isBest && (
                  <span className="text-[10px] text-amber-500 font-mono uppercase bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/50">XP Reduzido (Consultoria)</span>
                )}
              </div>

              <div className="bg-slate-950/60 p-6 md:p-8 rounded-2xl border border-slate-800 mb-8 text-justify">
                <p className="text-slate-300 text-sm leading-relaxed">
                  "{feedbackState.option.feedback}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10 text-center font-mono">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Caixa</span>
                  <span className={`text-lg font-bold ${feedbackState.option.impacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.caixa > 0 ? '+' : ''}{formatBRL(feedbackState.option.impacts.caixa)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Receita</span>
                  <span className={`text-lg font-bold ${feedbackState.option.impacts.receita >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.receita > 0 ? '+' : ''}{formatBRL(feedbackState.option.impacts.receita)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Compliance</span>
                  <span className={`text-lg font-bold ${feedbackState.option.impacts.compliance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {feedbackState.option.impacts.compliance > 0 ? '+' : ''}{feedbackState.option.impacts.compliance}
                  </span>
                </div>
              </div>

              <button onClick={pullNextEvent} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-5 rounded-xl uppercase tracking-widest transition-colors border border-slate-600 shadow-lg">
                Prosseguir Operação
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}