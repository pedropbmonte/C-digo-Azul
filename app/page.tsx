"use client";

import { useState, useEffect, useCallback } from "react";
// IMPORTANTE: Conectando o seu banco de questões!
import { questionBank } from "./questions"; 

// --- GERADORES DINÂMICOS ---
const companyPrefixes = ["Indústria", "Varejo", "Tech", "Distribuidora", "Logística", "Holdings"];
const companySuffixes = ["Alfa", "Ômega", "Titan", "Vértice", "Nexus", "Prime"];
const generateCompanyName = () => {
  return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
};

// --- CISNES NEGROS (Eventos Aleatórios do Mercado) ---
const blackSwans = [
  { title: "Processo Trabalhista Antigo", text: "Um ex-funcionário ganhou uma causa que você nem lembrava. Bloqueio judicial imediato nas contas.", impact: { caixa: -8000, margem: 0, compliance: -10 } },
  { title: "Rali do Dólar", text: "O câmbio disparou de madrugada. Seus custos de insumos importados subiram drasticamente.", impact: { caixa: -3000, margem: -3.0, compliance: 0 } },
  { title: "Viralizou Positivamente", text: "Um influenciador elogiou seu serviço organicamente. Chuva de vendas inesperadas no final de semana!", impact: { caixa: 12000, margem: 2.0, compliance: 0 } },
  { title: "Fiscalização Surpresa", text: "Fiscais bateram na porta. Como sua casa estava arrumada, você não levou multa, apenas uma taxa de renovação.", impact: { caixa: -1000, margem: 0, compliance: 15 } }
];

// --- CURVA DE PROGRESSÃO (Níveis atrelados aos Tiers de Perguntas) ---
const levels = [
  { title: "Estagiário", minXp: 0, maxTier: 1 },
  { title: "Assistente Financeiro", minXp: 100, maxTier: 1 },
  { title: "Analista Financeiro Jr.", minXp: 250, maxTier: 2 },
  { title: "Analista Financeiro Pleno", minXp: 450, maxTier: 2 },
  { title: "Coordenador / Gerente", minXp: 700, maxTier: 3 },
  { title: "Controller", minXp: 1000, maxTier: 3 },
  { title: "CFO (Diretor)", minXp: 1500, maxTier: 4 },
  { title: "Estrategista Master", minXp: 2200, maxTier: 4 }
];

export default function CodigoAzulEngine() {
  const [isMounted, setIsMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Perfil do Jogador
  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // Sinais Vitais do Negócio
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(25000); // Começa com R$ 25k
  const [margem, setMargem] = useState(15.0); // Começa com 15%
  const [compliance, setCompliance] = useState(100); // Saúde regulatória

  // Motor do Jogo
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [inventory, setInventory] = useState<{type: 'reward'|'scar', text: string}[]>([]);
  
  // Estado da Tela Atual
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>(null);
  const [randomEvent, setRandomEvent] = useState<any>(null);
  const [gameOver, setGameOver] = useState<{isGameOver: boolean, reason: string}>({isGameOver: false, reason: ""});

  // Evita erro de hidratação do Next.js
  useEffect(() => { setIsMounted(true); }, []);

  // LOAD DO SAVE GAME
  useEffect(() => {
    if (isMounted) {
      const saved = localStorage.getItem('codigoAzul_EngineV3');
      if (saved) {
        const data = JSON.parse(saved);
        setPlayerName(data.playerName);
        setCompanyName(data.companyName);
        setXp(data.xp);
        setCaixa(data.caixa);
        setMargem(data.margem);
        setCompliance(data.compliance);
        setAnsweredQuestions(data.answeredQuestions || []);
        setInventory(data.inventory || []);
        setGameStarted(true);
      }
    }
  }, [isMounted]);

  // SAVE AUTOMÁTICO
  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem('codigoAzul_EngineV3', JSON.stringify({
        playerName, companyName, xp, caixa, margem, compliance, answeredQuestions, inventory
      }));
    }
  }, [xp, caixa, margem, compliance, answeredQuestions, inventory, gameStarted, playerName, companyName]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // VERIFICA SE O JOGADOR FALIU
  useEffect(() => {
    if (gameStarted && !feedbackState) {
      if (caixa < -10000) setGameOver({isGameOver: true, reason: "FALÊNCIA DE CAIXA: Sua liquidez secou. O banco cortou suas linhas e os fornecedores pararam de entregar."});
      else if (margem <= 0) setGameOver({isGameOver: true, reason: "RUÍNA OPERACIONAL: Sua margem ficou negativa. Você quebrou trabalhando de graça."});
      else if (compliance <= 0) setGameOver({isGameOver: true, reason: "INTERDIÇÃO ESTATAL: A justiça travou seus bens e cassou seu CNPJ por fraudes cumulativas."});
    }
  }, [caixa, margem, compliance, gameStarted, feedbackState]);

  // SORTEADOR DE PRÓXIMA FASE
  const pullNextEvent = useCallback(() => {
    setFeedbackState(null);
    setRandomEvent(null);

    // 15% de chance de um Cisne Negro (Apenas para quem já passou do nível 1)
    if (currentLevel.maxTier > 1 && Math.random() < 0.15) {
      const event = blackSwans[Math.floor(Math.random() * blackSwans.length)];
      setRandomEvent(event);
      setCaixa(prev => prev + event.impact.caixa);
      setMargem(prev => prev + event.impact.margem);
      setCompliance(prev => prev + event.impact.compliance);
      return;
    }

    // Filtra perguntas: Tier autorizado E não respondidas
    const availableQuestions = questionBank.filter(q => 
      q.tier <= currentLevel.maxTier && !answeredQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      alert("MÁXIMO RESPEITO! Você zerou o banco de dados da sua patente atual. A aguardar expansões.");
      return;
    }

    // Sorteia uma pergunta
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  }, [currentLevel.maxTier, answeredQuestions]);

  // INICIA SE NÃO TIVER PERGUNTA CARREGADA
  useEffect(() => {
    if (gameStarted && !currentQuestion && !randomEvent && !gameOver.isGameOver && !feedbackState) {
      pullNextEvent();
    }
  }, [gameStarted, currentQuestion, randomEvent, gameOver, feedbackState, pullNextEvent]);

  // AÇÃO DE RESPONDER
  const handleAnswer = (option: any) => {
    // 1. Aplica impactos nos sinais vitais
    setXp(prev => Math.max(0, prev + option.xp));
    setCaixa(prev => prev + option.impacts.caixa);
    setMargem(prev => prev + option.impacts.margem);
    setCompliance(prev => prev + option.impacts.compliance);
    
    // 2. Registra que a pergunta foi respondida
    setAnsweredQuestions(prev => [...prev, currentQuestion.id]);

    // 3. Gerencia o Inventário
    let addedItem = null;
    if (option.isBest && option.reward) {
      const newItem = { type: 'reward' as const, text: option.reward };
      setInventory(prev => [newItem, ...prev].slice(0, 5)); // Guarda os 5 últimos
      addedItem = newItem;
    } else if (!option.isBest && option.lesson) {
      const newItem = { type: 'scar' as const, text: option.lesson };
      setInventory(prev => [newItem, ...prev].slice(0, 5));
      addedItem = newItem;
    }

    // 4. Mostra o Feedback
    setFeedbackState({
      option,
      addedItem
    });
  };

  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() === "") return;
    if (!companyName) setCompanyName(generateCompanyName());
    setGameStarted(true);
  };

  const resetGame = () => {
    if(confirm("Deseja DECRETAR FALÊNCIA e recomeçar do zero? Todos os dados serão perdidos.")) {
      localStorage.removeItem('codigoAzul_EngineV3');
      window.location.reload();
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-mono text-xl">Inicializando Motor...</div>;

  // --- TELA DE ONBOARDING ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        
        <div className="z-10 bg-slate-900/80 backdrop-blur-xl p-10 rounded-2xl border border-slate-700/50 shadow-2xl max-w-lg w-full">
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              Código <span className="text-blue-500">Azul</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">O Simulador da Alta Gestão</p>
          </div>

          <form onSubmit={startGame} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome do Estrategista</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ex: Pedro Monte"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-transform active:scale-95 uppercase tracking-widest text-sm"
            >
              Assumir Controle da Empresa
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE GAME OVER ---
  if (gameOver.isGameOver) {
    return (
      <div className="min-h-screen bg-red-950/20 flex flex-col items-center justify-center p-8 text-center border-t-8 border-red-600">
        <h1 className="text-6xl font-black text-red-500 mb-4">FALÊNCIA DECRETADA</h1>
        <p className="text-xl text-slate-300 max-w-2xl bg-slate-900 p-8 rounded-xl border border-red-900 shadow-2xl">
          {gameOver.reason}
        </p>
        <button onClick={resetGame} className="mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-colors border border-slate-600">
          Reiniciar Trajetória
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: PAINEL DE CONTROLE (SINAIS VITAIS) */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Header de Patente */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-blue-900/50 shadow-lg">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate">{companyName}</h2>
            <p className="text-blue-400 text-sm font-medium mb-4">CEO: {playerName}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                <span>{currentLevel.title}</span>
                <span className="text-blue-500">{xp} XP</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
          </div>

          {/* Sinais Vitais */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Painel de Controle</h3>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Caixa Livre (Liquidez)</p>
              <p className={`text-2xl font-black font-mono ${caixa < 5000 ? 'text-red-400' : 'text-emerald-400'}`}>
                R$ {caixa.toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-slate-400">Margem</p>
                <p className={`text-xl font-bold font-mono ${margem < 10 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {margem.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Compliance</p>
                <p className={`text-xl font-bold font-mono ${compliance < 50 ? 'text-red-400' : 'text-blue-400'}`}>
                  {compliance}/100
                </p>
              </div>
            </div>
          </div>

          {/* Inventário */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Histórico Recente</h3>
            {inventory.length === 0 ? (
              <p className="text-sm text-slate-600 italic">Nenhum evento registrado ainda.</p>
            ) : (
              <ul className="space-y-3">
                {inventory.map((item, idx) => (
                  <li key={idx} className={`p-3 rounded-lg text-xs font-medium border ${item.type === 'reward' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300' : 'bg-red-950/30 border-red-900/50 text-red-300'}`}>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* COLUNA DIREITA: TELA DE OPERAÇÕES */}
        <main className="lg:col-span-2 relative">
          
          {/* EVENTO: CISNE NEGRO */}
          {randomEvent && !feedbackState && (
            <div className="bg-orange-950/40 border border-orange-500/50 p-8 rounded-2xl shadow-2xl animate-fade-in-up">
              <div className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>⚠️ ALERTA DE MERCADO (CISNE NEGRO)</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-4">{randomEvent.title}</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">{randomEvent.text}</p>
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-8 font-mono text-sm">
                <p>Impacto no Caixa: <span className={randomEvent.impact.caixa > 0 ? 'text-emerald-400' : 'text-red-400'}>{randomEvent.impact.caixa > 0 ? '+' : ''}{randomEvent.impact.caixa}</span></p>
                <p>Impacto na Margem: <span className={randomEvent.impact.margem > 0 ? 'text-emerald-400' : 'text-red-400'}>{randomEvent.impact.margem}%</span></p>
              </div>

              <button onClick={pullNextEvent} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all">
                Absorver o Impacto e Seguir
              </button>
            </div>
          )}

          {/* EVENTO: PERGUNTA NORMAL */}
          {currentQuestion && !randomEvent && !feedbackState && (
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in-up">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">{currentQuestion.sector} • TIER {currentQuestion.tier}</span>
                  <h2 className="text-2xl font-black text-white mt-1">{currentQuestion.title}</h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                  <p className="text-sm font-bold text-slate-400 mb-2 uppercase">{currentQuestion.character} relata:</p>
                  <p className="text-slate-200 leading-relaxed">{currentQuestion.context}</p>
                </div>

                <div className="bg-blue-950/20 p-5 rounded-xl border border-blue-900/30">
                  <p className="text-sm font-bold text-blue-500 mb-2 uppercase">Fundamentação Técnica:</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{currentQuestion.theory}</p>
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest text-center mb-4">Qual a sua decisão executiva?</h3>
                  {currentQuestion.options.map((option: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 hover:border-blue-500 group"
                    >
                      <p className="text-slate-200 text-sm group-hover:text-white">{option.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELA DE FEEDBACK */}
          {feedbackState && (
             <div className={`p-8 rounded-2xl border animate-fade-in-up shadow-2xl ${
              feedbackState.option.isBest 
                ? 'bg-emerald-950/30 border-emerald-500/30' 
                : 'bg-red-950/30 border-red-500/30'
            }`}>
              
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${feedbackState.option.isBest ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedbackState.option.isBest ? 'Decisão Aprovada' : 'Erro de Gestão'}
                </h2>
                <div className="text-4xl font-black text-white font-mono">
                  {feedbackState.option.xp > 0 ? '+' : ''}{feedbackState.option.xp} XP
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 mb-6">
                <p className="text-slate-200 leading-relaxed text-lg">
                  "{feedbackState.option.feedback}"
                </p>
              </div>

              {/* Impactos Mostrados */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center font-mono text-sm">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="block text-slate-500 text-xs mb-1">CAIXA</span>
                  <span className={feedbackState.option.impacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {feedbackState.option.impacts.caixa > 0 ? '+' : ''}{feedbackState.option.impacts.caixa}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="block text-slate-500 text-xs mb-1">MARGEM</span>
                  <span className={feedbackState.option.impacts.margem >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {feedbackState.option.impacts.margem > 0 ? '+' : ''}{feedbackState.option.impacts.margem}%
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="block text-slate-500 text-xs mb-1">COMPLIANCE</span>
                  <span className={feedbackState.option.impacts.compliance >= 0 ? 'text-blue-400' : 'text-red-400'}>
                    {feedbackState.option.impacts.compliance > 0 ? '+' : ''}{feedbackState.option.impacts.compliance}
                  </span>
                </div>
              </div>

              <button
                onClick={pullNextEvent}
                className="w-full bg-slate-100 hover:bg-white text-slate-900 font-black py-4 rounded-xl transition-transform active:scale-95"
              >
                AVANÇAR PARA PRÓXIMO MÊS
              </button>
            </div>
          )}
        </main>
      </div>

      <div className="max-w-6xl mx-auto mt-12 text-center">
        <button onClick={resetGame} className="text-xs text-slate-700 hover:text-red-500 transition-colors font-bold uppercase tracking-widest">
          Resetar Sistema
        </button>
      </div>
    </div>
  );
}