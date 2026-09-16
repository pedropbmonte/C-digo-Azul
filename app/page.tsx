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
const GEMINI_API_KEY = "SUA_CHAVE_AQUI"; // Certifique-se de preencher a chave

const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// --- CURVA ARDUA DE PROGRESSÃO ---
const levels = [
  { title: "Apagador de Incêndios", minXp: 0, maxTier: 1 },
  { title: "Sobrevivente do Mês", minXp: 50, maxTier: 1 },
  { title: "Chefe de Equipe", minXp: 120, maxTier: 2 },
  { title: "Gestor de Caixa", minXp: 220, maxTier: 2 },
  { title: "Dono de Negócio", minXp: 350, maxTier: 3 },
  { title: "Estrategista", minXp: 550, maxTier: 3 },
  { title: "C-Level (Diretor)", minXp: 850, maxTier: 4 },
  { title: "Estrategista Master", minXp: 1300, maxTier: 4 }
];

export default function CodigoAzulPME() {
  const [isMounted, setIsMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // --- SINAIS VITAIS DINÂMICOS PME ---
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(15000); // Realidade PME: Caixa inicial baixo
  const [receitaMensal, setReceitaMensal] = useState(30000); // Faturamento inicial de microempresa
  const [compliance, setCompliance] = useState(80); 
  
  // --- DRE CONTROL (ALAVANCAS) ---
  const [cmv, setCmv] = useState(12000); // Custo da Mercadoria
  const [proLabore, setProLabore] = useState(3000); // Retirada do dono
  const [marketing, setMarketing] = useState(1000); // Ads
  const [despesasFixas, setDespesasFixas] = useState(6000); // Aluguel, contabilidade, sistemas

  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [decisionsThisMonth, setDecisionsThisMonth] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>(null);
  const [showDRE, setShowDRE] = useState(false);
  const [gameOver, setGameOver] = useState<{is: boolean, reason: string}>({is: false, reason: ""});
  
  const [isConsultingUsed, setIsConsultingUsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingInfinitely, setIsGeneratingInfinitely] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // --- SAVE GAME SYSTEM ---
  const saveProgress = async () => {
    if (!email) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password,
        data: { 
          playerName, companyName, xp, caixa, receitaMensal, compliance, 
          cmv, proLabore, marketing, despesasFixas, answeredQuestions, decisionsThisMonth 
        }
      });
      setTimeout(() => setIsSaving(false), 1000);
    } catch (e) { console.error(e); setIsSaving(false); }
  };

  useEffect(() => {
    if (gameStarted && !gameOver.is) {
      // Auto-save silently at every major change
      setDoc(doc(db, "users", email.toLowerCase()), {
        password, data: { playerName, companyName, xp, caixa, receitaMensal, compliance, cmv, proLabore, marketing, despesasFixas, answeredQuestions, decisionsThisMonth }
      }).catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, receitaMensal, compliance, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];

  // --- ENGINE DE SORTEIO E JOGO INFINITO ---
  const pullNextEvent = useCallback(async () => {
    setFeedbackState(null);
    setIsConsultingUsed(false);
    
    if (decisionsThisMonth >= 4) { // 4 decisões por mês
      setShowDRE(true);
      return;
    }

    const available = questionBank.filter(q => q.tier <= currentLevel.maxTier && !answeredQuestions.includes(q.id));

    if (available.length > 0) {
      setCurrentQuestion(available[Math.floor(Math.random() * available.length)]);
    } else {
      // JOGO INFINITO: Chama a IA para gerar cenário PME com base no Sebrae/Bacen
      setIsGeneratingInfinitely(true);
      const prompt = `Gere um cenário de decisão de negócios estrito em JSON. 
      Realidade: Micro/Pequena Empresa faturando até R$ ${receitaMensal}/mês. 
      Contexto: Desafios reais apontados pelo Sebrae e Bacen (capital de giro, Simples Nacional, MEI, mistura de contas PF/PJ, inadimplência, rescisão trabalhista).
      Retorne JSON: { "sector": "string", "title": "string", "character": "string", "context": "string", "theory": "string", "consultoriaHint": "Dica direta do Pedro Monte", "options": [ { "text": "string", "xp": número (5 a 15), "isBest": boolean, "impacts": {"caixa": num, "receita": num, "compliance": num}, "feedback": "string" } ] } (3 opções)`;
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
        const generated = JSON.parse(aiText);
        setCurrentQuestion({...generated, id: `ai_${Date.now()}`});
      } catch (e) {
        // Fallback genérico caso IA falhe
        setCurrentQuestion(questionBank[0]); 
      }
      setIsGeneratingInfinitely(false);
    }
  }, [currentLevel.maxTier, answeredQuestions, decisionsThisMonth, receitaMensal]);

  useEffect(() => {
    if (gameStarted && !currentQuestion && !showDRE && !gameOver.is && !isGeneratingInfinitely) pullNextEvent();
  }, [gameStarted, currentQuestion, showDRE, gameOver, pullNextEvent, isGeneratingInfinitely]);

  // --- IMPACTOS DA DECISÃO ---
  const handleAnswer = (option: any) => {
    // Evolução lenta: penaliza XP se usou consultoria
    let earnedXp = option.xp;
    if (isConsultingUsed && option.isBest) earnedXp = Math.floor(earnedXp / 2); // Corta XP pela metade se pediu ajuda

    setXp(prev => Math.max(0, prev + earnedXp));
    setCaixa(prev => prev + (option.impacts.caixa || 0));
    setReceitaMensal(prev => Math.max(5000, prev + (option.impacts.receita || 0))); // Novo: Decisões impactam a Receita
    setCompliance(prev => Math.max(0, Math.min(100, prev + (option.impacts.compliance || 0))));
    
    if (currentQuestion.id) setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
    setDecisionsThisMonth(prev => prev + 1);
    
    setFeedbackState({ option, earnedXp });
  };

  // --- FECHAMENTO E IMPACTO REAL DA DRE ---
  const processDRE = () => {
    const totalDespesas = cmv + proLabore + marketing + despesasFixas;
    const lucroLiquido = receitaMensal - totalDespesas;
    
    // IMPACTOS REAIS DAS ALAVANCAS NO FUTURO:
    let novaReceita = receitaMensal;
    let novoCompliance = compliance;

    // Se investiu mais de 10% da receita em Marketing, a receita futura sobe. Se investiu menos de 2%, a receita cai (abandono de marca).
    if (marketing > receitaMensal * 0.10) novaReceita *= 1.15;
    else if (marketing < receitaMensal * 0.02) novaReceita *= 0.90;

    // Se o CMV está muito baixo (< 25% da receita), significa produto ruim. Perde receita no longo prazo por churn.
    if (cmv < receitaMensal * 0.25) novaReceita *= 0.95;

    // Se o Pró-labore está acima de 25% do faturamento de uma empresa de 30k, ele está sangrando o negócio.
    if (proLabore > receitaMensal * 0.25) novoCompliance -= 5;

    setCaixa(prev => prev + lucroLiquido);
    setReceitaMensal(novaReceita);
    setCompliance(novoCompliance);
    
    setDecisionsThisMonth(0);
    setShowDRE(false);

    // Checa Game Over após DRE
    if (caixa + lucroLiquido <= -10000) setGameOver({is: true, reason: "Insolvência. O balanço sugou sua liquidez. Cheque especial estourado."});
    else pullNextEvent();
  };

  // --- RENDERIZAÇÕES (Onboarding simplificado para o código caber) ---
  if (!isMounted) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-cyan-500">Iniciando Motor...</div>;

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
         {/* ... (Mantenha o seu formulário de Login / Lead Capture do Firebase aqui) ... */}
         <div className="bg-[#0f172a] p-8 rounded-xl max-w-sm w-full border border-cyan-900 text-center">
            <h1 className="text-2xl font-light text-white mb-6 uppercase tracking-widest">Código <span className="font-bold text-cyan-500">Azul</span></h1>
            <input type="text" placeholder="Nome" value={playerName} onChange={e=>setPlayerName(e.target.value)} className="w-full mb-3 p-3 bg-slate-900 text-white rounded outline-none border border-slate-700" />
            <input type="email" placeholder="E-mail Corporativo" value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-3 p-3 bg-slate-900 text-white rounded outline-none border border-slate-700" />
            <button onClick={() => setGameStarted(true)} className="w-full p-4 bg-cyan-700 text-white uppercase tracking-widest text-xs font-bold rounded mt-4">Iniciar Operação PME</button>
         </div>
      </div>
    );
  }

  // --- TELA DRE INTERATIVA ---
  if (showDRE) {
    const totalDespesas = cmv + proLabore + marketing + despesasFixas;
    const lucro = receitaMensal - totalDespesas;
    return (
      <div className="min-h-screen bg-[#020617] p-4 flex items-center justify-center font-sans">
        <div className="bg-[#0f172a] p-8 rounded-2xl border border-cyan-900/50 max-w-xl w-full shadow-2xl">
          <h2 className="text-xl text-white uppercase tracking-widest mb-2">Painel de Controladoria (DRE)</h2>
          <p className="text-slate-400 text-xs mb-6 font-mono">Suas alavancas aqui ditam a saúde do próximo mês.</p>
          
          <div className="bg-slate-900 p-4 rounded border border-slate-800 font-mono text-sm space-y-3 mb-6">
            <div className="flex justify-between text-cyan-400 font-bold"><span>Receita Faturada</span><span>{formatBRL(receitaMensal)}</span></div>
            
            <div className="border-t border-slate-800 pt-3">
              <label className="flex justify-between text-slate-300 text-xs mb-1">Custo Direto (CMV/Fornecedores) - {formatBRL(cmv)}</label>
              <input type="range" min="1000" max={receitaMensal} step="500" value={cmv} onChange={(e)=>setCmv(Number(e.target.value))} className="w-full accent-slate-500" />
            </div>
            
            <div>
              <label className="flex justify-between text-emerald-400 text-xs mb-1">Pró-labore (Retirada Sócio) - {formatBRL(proLabore)}</label>
              <input type="range" min="1412" max={receitaMensal} step="500" value={proLabore} onChange={(e)=>setProLabore(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>

            <div>
              <label className="flex justify-between text-blue-400 text-xs mb-1">Orçamento Marketing / Tráfego - {formatBRL(marketing)}</label>
              <input type="range" min="0" max="10000" step="250" value={marketing} onChange={(e)=>setMarketing(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>

            <div>
              <label className="flex justify-between text-orange-400 text-xs mb-1">Despesas Administrativas Fixas - {formatBRL(despesasFixas)}</label>
              <input type="range" min="2000" max="20000" step="500" value={despesasFixas} onChange={(e)=>setDespesasFixas(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>

            <div className={`flex justify-between pt-4 border-t border-slate-800 font-bold ${lucro >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <span>Lucro Líquido Gerado</span><span>{formatBRL(lucro)}</span>
            </div>
          </div>

          <div className="flex gap-4 flex-col md:flex-row">
            <button onClick={processDRE} className="flex-1 bg-cyan-700 text-white font-mono text-xs py-4 rounded uppercase tracking-widest">Aprovar DRE e Seguir</button>
            <a href="https://wa.me/5521999999999?text=Pedro,%20meu%20CNPJ%20precisa%20de%20ajuda.%20Gostaria%20de%20um%20orçamento%20de%20mentoria." target="_blank" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center flex items-center justify-center font-mono text-xs py-4 rounded uppercase tracking-widest transition-colors">Solicitar Mentoria Real</a>
          </div>
        </div>
      </div>
    );
  }

  // --- GAME UI ---
  return (
    <div className="min-h-screen bg-[#020617] p-4 text-slate-300 font-sans">
      {/* HEADER CONTROLS */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div className="font-mono text-xs text-slate-400 uppercase tracking-widest">Mês Operacional: <span className="text-cyan-400">{decisionsThisMonth}/4</span></div>
        <button onClick={saveProgress} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-[10px] font-mono text-slate-300 uppercase hover:text-white transition-colors">
          {isSaving ? 'Salvando...' : 'Salvar Progresso'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-light text-white uppercase">{playerName}</h2>
            <p className="text-[10px] font-mono text-cyan-500 uppercase mt-1">{currentLevel.title} ({xp} XP)</p>
          </div>
          
          <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-sm">
            <div><p className="text-[10px] text-slate-500 uppercase">Caixa Disponível</p><p className={`text-xl ${caixa < 5000 ? 'text-red-400' : 'text-emerald-400'}`}>{formatBRL(caixa)}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase">Receita Atualizada</p><p className="text-lg text-blue-400">{formatBRL(receitaMensal)}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase">Compliance</p><p className="text-lg text-purple-400">{compliance}%</p></div>
          </div>
        </aside>

        <main className="lg:col-span-2">
          {isGeneratingInfinitely ? (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-[#0f172a] rounded-xl border border-slate-800">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">O Mercado está gerando um novo cenário real...</p>
            </div>
          ) : currentQuestion && !feedbackState && (
            <div className="bg-[#0f172a] p-8 rounded-xl border border-slate-800 shadow-xl">
              <span className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">{currentQuestion.sector}</span>
              <h2 className="text-2xl font-light text-white mt-1 mb-6">{currentQuestion.title}</h2>
              
              <div className="bg-slate-900 p-5 rounded border border-slate-800 mb-6 text-sm text-slate-300 leading-relaxed text-justify">
                {currentQuestion.context}
              </div>

              {/* BOTÃO CONSULTORIA */}
              {!isConsultingUsed && currentQuestion.consultoriaHint && (
                <button onClick={() => setIsConsultingUsed(true)} className="w-full border border-amber-600 text-amber-500 bg-amber-950/20 p-3 rounded mb-6 text-[10px] font-mono uppercase tracking-widest hover:bg-amber-900/30 transition-all flex justify-between items-center">
                  <span>Acionar Consultoria Especializada</span>
                  <span>(Custa 50% do XP da resposta)</span>
                </button>
              )}

               {isConsultingUsed && (
                <div className="bg-amber-950/30 border-l-4 border-amber-500 p-4 mb-6">
                  <p className="text-[10px] font-mono text-amber-500 uppercase mb-1">Dica do Mentor (Pedro Monte):</p>
                  <p className="text-xs text-amber-200">{currentQuestion.consultoriaHint}</p>
                </div>
              )}

              <div className="space-y-3">
                {currentQuestion.options.map((opt: any, i: number) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all rounded text-sm text-slate-200 leading-relaxed">
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {feedbackState && (
            <div className={`p-8 rounded-xl border ${feedbackState.option.isBest ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
              <h2 className={`text-xl font-light uppercase tracking-widest mb-4 ${feedbackState.option.isBest ? 'text-emerald-400' : 'text-red-400'}`}>
                {feedbackState.option.isBest ? 'Tática Aprovada' : 'Gestão Amadora'}
              </h2>
              <div className="text-3xl font-mono text-white mb-6">+{feedbackState.earnedXp} XP</div>
              <p className="text-sm text-slate-300 mb-8 leading-relaxed">"{feedbackState.option.feedback}"</p>
              
              <button onClick={pullNextEvent} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs py-4 rounded uppercase tracking-widest transition-all">
                Continuar Gestão
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}