"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- A MÁGICA ACONTECE AQUI: IMPORTAÇÃO DO BANCO EXTERNO ---
import { questionBank } from './questions';

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

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- CURVA DE MATURIDADE ---
const levels = [
  { tier: 1, title: "Apagador de Incêndios", minXp: 0 },
  { tier: 1, title: "Sobrevivente do Mês", minXp: 120 },
  { tier: 2, title: "Chefe de Equipe", minXp: 280 },
  { tier: 2, title: "Gestor de Sobrevivência", minXp: 500 },
  { tier: 3, title: "Dono de Negócio", minXp: 800 },
  { tier: 3, title: "Estrategista de Caixa", minXp: 1200 },
  { tier: 4, title: "Diretor Executivo", minXp: 1800 },
  { tier: 4, title: "Empresário de Elite", minXp: 2600 }
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
  const [caixa, setCaixa] = useState(45000); 
  const [margem, setMargem] = useState(18.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  const [phaseReward, setPhaseReward] = useState<string | null>(null);
  
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); 
  
  const [showConsultoriaHint, setShowConsultoriaHint] = useState(false);
  const [dreMode, setDreMode] = useState<'none' | 'mid-month' | 'end-month'>('none');
  
  const [dreProLabore, setDreProLabore] = useState(5000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreTaxas, setDreTaxas] = useState(1900); 

  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { playerName, phone: telefone, email: email.toLowerCase(), companyName, xp, caixa, margem, compliance, currentStage, usedQuestionIds, dreMode }
      });
    } catch (e) {}
  };

  useEffect(() => { if (gameStarted && !isGameOver) saveToDB(); }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, usedQuestionIds, dreMode]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;
  const monthProgress = ((currentStage) / 10) * 100;

  // --- O NOVO MOTOR BLINDADO DE INEDITISMO ABSOLUTO ---
  const loadNextQuestion = () => {
    setFeedback(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    // 1. Filtra as perguntas que nunca foram respondidas
    let unplayedQuestions = questionBank.filter(q => !usedQuestionIds.includes(q.id));
    
    // 2. Se o dono for viciado e esgotar todas as 20, 30, 40 perguntas do banco, aí a gente reseta o histórico
    if (unplayedQuestions.length === 0) {
      setUsedQuestionIds([]);
      unplayedQuestions = [...questionBank];
      alert("🏆 MÁXIMO RESPEITO: Você zerou todos os desafios do simulador. O mercado vai reiniciar ciclos avançados agora.");
    }
    
    // 3. Tenta buscar perguntas dentro da maturidade (Tier) do dono
    let availableInTier = unplayedQuestions.filter(q => q.tier <= currentLevel.tier);
    
    // 4. A TRAVA ANTI-LOOP: Se acabaram as perguntas fáceis do nível 1, ele é obrigado a lidar com questões mais difíceis, em vez de repetir!
    if (availableInTier.length === 0) {
      availableInTier = unplayedQuestions; 
    }
    
    // 5. Sorteia e entrega
    const selected = availableInTier[Math.floor(Math.random() * availableInTier.length)];
    const shuffledOptions = shuffleArray([...selected.options]);
    setCurrentScenario({ ...selected, options: shuffledOptions });
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !currentScenario && !feedback && dreMode === 'none') {
      loadNextQuestion();
    }
  }, [gameStarted, currentScenario, feedback, dreMode]);

  const handleConsultoria = () => {
    if (caixa >= 3500) {
      setCaixa(prev => prev - 3500);
      setXp(prev => prev + 25);
      setShowConsultoriaHint(true);
    } else {
      alert("Caixa insuficiente para acionar a Visão do Mentor Pedro Monte.");
    }
  };

  const handleOptionSelect = (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    const finalXp = selectedOption.xp;
    const finalImpacts = { ...selectedOption.impacts };

    // Grava o ID pra nunca mais repetir
    setUsedQuestionIds(prev => [...prev, currentScenario.id]);
    setFeedback(`${selectedOption.feedback}`);
    
    if (selectedOption.isBest) {
      setPhaseReward(selectedOption.reward || "🏆 Atitude de Dono validada.");
    } else {
      setPhaseReward(`❌ Lição Paga: ${selectedOption.lesson || "O Mercado cobra caro pelo ego."}`);
    }

    setCaixa(prev => {
        const next = Math.max(0, prev + finalImpacts.caixa);
        if (next <= 0) setIsGameOver(true);
        return next;
    });
    setMargem(prev => prev + finalImpacts.margem);
    setCompliance(prev => {
        const next = Math.min(100, Math.max(0, prev + finalImpacts.compliance));
        if (next <= 0) setIsGameOver(true);
        return next;
    });
    setXp(prev => Math.max(0, prev + finalXp));

    setLastXpChange(finalXp); 
    setLastImpacts(finalImpacts);
    setIsEvaluatingChoice(false);
  };

  const proceedToNextQuestion = () => {
    setFeedback(null);
    setLastXpChange(null);
    setLastImpacts(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    const nextStage = currentStage + 1;
    
    if (nextStage < 10) {
      setCurrentStage(nextStage);
      setCurrentScenario(null); 
    } else { 
      setDreMode('end-month'); 
    }
  };

  // --- DRE DINÂMICA LIGADA AO XP ---
  const dreReceita = 45000 + (xp * 15); 
  const dreMargemReal = (margem / 100); 
  const dreMargemContribuicao = dreReceita * dreMargemReal;
  const dreCustosVariaveis = dreReceita - dreMargemContribuicao; 
  const dreCustoFixoBase = 8850; 
  const dreTotalDespesasFixas = dreCustoFixoBase + dreProLabore + dreMarketing + dreTaxas;
  const dreLucroLiquido = dreMargemContribuicao - dreTotalDespesasFixas;

  const handleSalvarDREMidMonth = () => { setDreMode('none'); };

  const handleInjetarLucroEndMonth = () => {
    setCaixa(prev => prev + dreLucroLiquido);
    setMargem(dreNovaMargem); // Mantemos a margem limpa pro novo mês
    setDreMode('none');
    setCurrentStage(0); 
    setCurrentScenario(null); 
  };
  
  const dreNovaMargem = (dreLucroLiquido / dreReceita) * 100;

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
            setCaixa(d.caixa ?? 45000); setMargem(d.margem ?? 18.0); setCompliance(d.compliance ?? 100);
            setCurrentStage(d.currentStage || 0); 
            setUsedQuestionIds(d.usedQuestionIds || []);
            setDreMode(d.dreMode || 'none');
            setCurrentScenario(null); 
            if((d.caixa ?? 45000) <= 0 || (d.compliance ?? 100) <= 0) setIsGameOver(true);
            setGameStarted(true);
          }
        } else { setAuthError("E-mail ou senha incorretos."); }
      } else if (authMode === 'register') {
        if (!nome.trim() || !telefone.trim()) { setAuthError("Preencha Nome e WhatsApp."); setIsAuthenticating(false); return; }
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado."); } 
        else {
          await setDoc(docRef, {
            password: cleanPassword,
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 45000, margem: 18.0, compliance: 100, currentStage: 0, usedQuestionIds: [], dreMode: 'none' }
          });
          setPlayerName(nome.trim()); setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
          setCurrentStage(0); setPlayerNameInput(nome.trim()); setNeedsCompanySetup(true);
        }
      } else if (authMode === 'forgot') {
        if (docSnap.exists()) {
          await setDoc(docRef, { password: cleanPassword }, { merge: true });
          setAuthSuccess("Senha redefinida com sucesso! Alterne para Acessar.");
        } else { setAuthError("E-mail não encontrado."); }
      }
    } catch (e) { setAuthError("Falha de conexão."); } finally { setIsAuthenticating(false); }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameInput.trim() || !playerNameInput.trim()) return;
    setCompanyName(companyNameInput.trim()); setPlayerName(playerNameInput.trim());
    setNeedsCompanySetup(false); setCurrentScenario(null); 
    setGameStarted(true); setIsGameOver(false); setDreMode('none');
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false); setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setIsGameOver(false); setDreMode('none'); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Você vai zerar seu CNPJ e reiniciar do zero. Confirma?")) {
      setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setUsedQuestionIds([]);
      setFeedback(null); setIsGameOver(false); setLastImpacts(null); setPhaseReward(null);
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
      setDreProLabore(5000); setDreMarketing(1000); setDreTaxas(1900); setDreMode('none');
    }
  };

  const caixaBarFill = Math.min(100, (caixa / 150000) * 100);
  const margemBarFill = Math.min(100, Math.max(0, (margem / 40.0) * 100));

  // --- TELAS DO SISTEMA ---

  if (needsCompanySetup) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-10 rounded-2xl border border-cyan-500/30 max-w-md w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Mentalidade Empreendedora</h2>
          <h1 className="text-2xl font-light text-slate-100 mb-8 tracking-wide">Registro do <span className="font-semibold text-cyan-400">CNPJ</span></h1>
          <form onSubmit={handleCompanySubmit} className="space-y-5">
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">A sua Marca</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome (Dono/Dona)</label><input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono tracking-widest py-4 px-4 rounded-lg transition-all uppercase mt-4">Assumir o Controle</button>
          </form>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/70 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl max-w-md w-full relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-slate-200 tracking-[0.2em] uppercase">Código <span className="font-semibold text-cyan-400">Azul</span></h1>
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador de Estratégia de Negócios</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('login'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
            <button onClick={() => { setAuthMode('register'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Criar Conta</button>
            <button onClick={() => { setAuthMode('forgot'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'forgot' ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>Redefinir</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <><div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Nome Completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
              <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">WhatsApp (Comercial)</label><input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div></>
            )}

            <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">E-mail Corporativo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] text-slate-400 uppercase font-mono flex justify-between"><span>{authMode === 'forgot' ? 'Nova Senha Segura' : 'Senha de Acesso'}</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-500 hover:text-cyan-300 uppercase tracking-widest">{showPassword ? "Ocultar" : "Mostrar"}</button>
              </div>
            </div>

            {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}
            {authSuccess && <div className="text-emerald-400 text-[10px] font-mono text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">{authSuccess}</div>}

            <button disabled={isAuthenticating} type="submit" className={`w-full text-xs font-mono py-3.5 rounded-lg mt-4 transition-all uppercase tracking-widest ${isAuthenticating ? 'opacity-50' : authMode === 'forgot' ? 'bg-amber-950/40 border border-amber-800 text-amber-400 hover:bg-amber-900/60' : 'bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60'}`}>
              {isAuthenticating ? 'PROCESSANDO...' : authMode === 'login' ? 'INICIAR ESTRATÉGIA' : authMode === 'register' ? 'REGISTRAR EMPRESA' : 'REDEFINIR ACESSO'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-[#060202] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#170f0f]/80 p-8 md:p-12 rounded-3xl border border-red-900/50 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">{caixa <= 0 ? "FALÊNCIA DECRETADA" : "CAOS TRIBUTÁRIO INSTALADO"}</h1>
          <p className="text-slate-300 text-sm md:text-base font-light text-justify border-l-2 border-red-500 pl-4 mb-8">{feedback}</p>
          <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 text-red-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Recomeçar e Mudar a Gestão</button>
        </div>
      </div>
    );
  }

  if (dreMode !== 'none') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative font-sans overflow-y-auto">
        <div className="z-10 bg-[#0f172a]/95 p-6 md:p-10 rounded-3xl border border-cyan-900/50 max-w-3xl w-full shadow-2xl my-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-slate-100 uppercase tracking-widest">Painel de <span className="font-semibold text-cyan-400">Controle DRE</span></h1>
            <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase">Visão do Dono. Ajuste as despesas. {dreMode === 'end-month' && "O mês virou, o lucro será injetado HOJE!"}</p>
          </div>

          <div className="bg-[#020617]/50 rounded-xl border border-slate-800 overflow-hidden mb-6">
            <div className="grid grid-cols-2 text-[10px] font-mono uppercase text-slate-500 bg-slate-900/50 p-3 border-b border-slate-800"><div>Estrutura Baseada na sua Gestão</div><div className="text-right">Projeção do Ciclo (R$)</div></div>
            <div className="p-4 space-y-3 font-mono text-xs text-slate-300">
               <div className="flex justify-between items-center"><span className="text-cyan-400 font-bold">1. RECEITA BRUTA (Vendas Reais)</span><span className="font-bold">{formatBRL(dreReceita)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) Impostos & CMV</span><span>{formatBRL(dreCustosVariaveis)}</span></div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-800/50 text-amber-400 font-semibold"><span>3. MARGEM DE CONTRIBUIÇÃO ({formatPct(margem)})</span><span>{formatBRL(dreMargemContribuicao)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500 mt-2"><span>(-) Custos Fixos Base (Aluguel, Luz)</span><span>{formatBRL(dreCustoFixoBase)}</span></div>
               
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-1 rounded"><span>(-) Seu Pró-labore (Salário do Dono)</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-1 rounded"><span>(-) Marketing (Máquina de Vendas)</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-1 rounded"><span>(-) Taxas do Banco (Agiotagem)</span><span>{formatBRL(dreTaxas)}</span></div>
               
               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${dreLucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">5. LUCRO LÍQUIDO (Gerador de Caixa)</span><span>{dreLucroLiquido >= 0 ? '+' : ''}{formatBRL(dreLucroLiquido)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8 bg-[#020617]/30 p-5 rounded-xl border border-white/5">
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-emerald-400">Regular o seu Pró-Labore</span><span className="text-slate-400">{formatBRL(dreProLabore)}</span></div>
               <input type="range" min="0" max="20000" step="500" value={dreProLabore} onChange={(e) => setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
               <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono">Retiradas altas secam o caixa da PJ. Retiradas baixas fazem o dono sofrer na PF.</p>
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-blue-400">Verba de Crescimento (Tráfego Pago)</span><span className="text-slate-400">{formatBRL(dreMarketing)}</span></div>
               <input type="range" min="0" max="10000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Taxas Bancárias (Pare de antecipar!)</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="8000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </div>
          
          {dreMode === 'end-month' ? (
             <button onClick={handleInjetarLucroEndMonth} className="w-full bg-emerald-900/50 border border-emerald-800 text-emerald-400 hover:bg-emerald-800/60 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Injetar Lucro Real e Iniciar Novo Ciclo</button>
          ) : (
             <button onClick={handleSalvarDREMidMonth} className="w-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/50 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Salvar Estrutura e Voltar para a Operação</button>
          )}
        </div>
      </div>
    );
  }

  if (!currentScenario) return <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4"><div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div><h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Lendo as Dores do seu Mercado...</h2></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Caixa Líquido (Fôlego)</span><span className={`text-xs font-bold font-mono ${caixa > 30000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${caixa > 20000 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Margem (Lucratividade)</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Maturidade do Dono</span><span className="text-xs font-bold font-mono text-purple-400">{currentLevel.title}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${progressToNext}%` }}></div></div></div>
        </div>

        <header className="bg-[#0f172a]/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">Dono(a) do Negócio: <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">Ciclo Financeiro — Decisão {currentStage + 1}/10</p></div>
            <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${monthProgress}%` }}></div></div>
          </div>
        </header>

        {!feedback ? (
          <main className="bg-[#0f172a]/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 mt-2 gap-4">
              <div>
                <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold block mb-1">{currentScenario.sector}</span>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
              </div>
              <button onClick={handleConsultoria} disabled={showConsultoriaHint} className="bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/60 text-amber-500 text-[10px] font-mono tracking-widest uppercase py-3 px-5 rounded-lg transition-all disabled:opacity-50 shadow-lg whitespace-nowrap">
                💎 Consultar Pedro Monte (R$ 3.500)
              </button>
            </div>

            {showConsultoriaHint && (
              <div className="mb-6 bg-amber-950/20 border-l-2 border-amber-500 p-5 rounded-r-lg shadow-inner">
                <p className="text-amber-400 text-[11px] font-mono uppercase mb-2 flex items-center gap-2"><span>👁️</span> Mentoria Estratégica Injetada (+25 XP):</p>
                <p className="text-slate-300 text-sm font-light italic leading-relaxed">"{currentScenario.consultoriaHint}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. Choque de Gestão (A Teoria)</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/40">
                <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 2. O Estouro na Mesa (A Prática)</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify">{currentScenario.context}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">Risco de Borda: <span className="text-slate-400">{currentScenario.character}</span></p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Execute a Visão do Dono(a):</h3>
              {currentScenario.options.map((option: any, index: number) => (
                <button key={index} disabled={isEvaluatingChoice} onClick={() => handleOptionSelect(option)} className="w-full text-left p-5 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2 text-justify">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          <div className="bg-[#0f172a]/60 p-8 md:p-12 rounded-2xl border border-white/5 text-center shadow-2xl">
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Maturidade Comprovada' : 'Falta de Visão Cobrou o Preço'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {lastImpacts && (
              <div className="flex justify-center gap-8 mb-8 border-y border-white/5 py-6 bg-[#020617]/30">
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Caixa Real</p><p className={`font-mono text-lg font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p></div>
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto na Margem</p><p className={`font-mono text-lg font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p></div>
              </div>
            )}

            {phaseReward && (
              <div className={`mb-8 p-6 rounded-xl border text-left max-w-2xl mx-auto ${phaseReward.includes("🏆") ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-red-950/20 border-red-800/50'}`}>
                 <h3 className={`text-[11px] font-mono uppercase tracking-widest mb-2 ${phaseReward.includes("🏆") ? 'text-emerald-400' : 'text-red-400'}`}>
                   {phaseReward.includes("🏆") ? 'Ouro Desbloqueado na Empresa:' : 'Alerta do Mentor Pedro Monte:'}
                 </h3>
                 <p className="text-slate-200 text-sm font-light leading-relaxed">{phaseReward}</p>
              </div>
            )}

            <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-3xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-cyan-400 font-mono border border-slate-700/50 rounded-md">Feedback Operacional:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={proceedToNextQuestion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              {currentStage === 9 ? "Consolidar DRE e Virar o Mês" : "Prosseguir na Operação"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={() => setDreMode('mid-month')} className="text-[9px] text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] font-bold">📊 Ajustar Custo Fixo (DRE Livre)</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Sair da Ferramenta</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Zerar Histórico</button>
        </div>

      </div>
    </div>
  );
}