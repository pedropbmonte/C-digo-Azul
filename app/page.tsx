"use client";

import { useState, useEffect } from "react";

// --- GERADORES DINÂMICOS ---
const companyPrefixes = ["Indústria", "Varejo", "Tech", "Distribuidora", "Logística", "Holdings", "Construtora", "Laboratório"];
const companySuffixes = ["Alfa", "Ômega", "Titan", "Vértice", "Nexus", "Prime", "Quantum", "Horizonte"];
const generateCompanyName = () => {
  return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
};

// --- BANCO DE DADOS DE CENÁRIOS (FUNDAMENTAÇÃO REGULATÓRIA) ---
const scenarios = [
  {
    id: 1,
    title: "O Efeito Tesoura e o CPC 03",
    theory: "Segundo o CFC (Conselho Federal de Contabilidade) e o CPC 03 (Demonstração dos Fluxos de Caixa), lucro não é liquidez. O Ciclo Financeiro dita a solvência do negócio. Normativas de crédito do BCB (Banco Central) alertam que financiar clientes sem lastro de caixa leva ao Overtrading (Efeito Tesoura).",
    context: "Vendas subiram 40%, com lucro contábil de 15%. Porém, a conta bancária amanheceu no vermelho e há risco de calote na folha de pagamento amanhã. O PMP (fornecedores) é de 15 dias, e o PMR (clientes) é de 60 dias.",
    character: "🧑‍💼 Auditor Sênior (CFC)",
    options: [
      {
        text: "A) Emitir debêntures ou captar empréstimo no BCB para manter a tração das vendas de 40%.",
        xp: -200,
        feedback: "REPROVADO. Usar dívida cara para financiar ineficiência de ciclo financeiro fere princípios básicos de solvência. Você quebrou a empresa."
      },
      {
        text: "B) Antecipar recebíveis (travar hemorragia), renegociar passivo para 45 dias e alinhar prazos comerciais.",
        xp: 200,
        feedback: "DECISÃO CIRÚRGICA. Em conformidade com a gestão de risco de liquidez exigida pelo CMN (Conselho Monetário Nacional). Estancou a sangria e corrigiu o processo."
      }
    ]
  },
  {
    id: 2,
    title: "Custeio ABC e o Parasita Invisível",
    theory: "Sob a ótica do CPC 16 (Estoques) e normas do CFC, o rateio por absorção pode mascarar perdas operacionais. O Custeio Baseado em Atividades (ABC) rastreia o consumo real de recursos. Precificar sem ABC em ambientes de alta complexidade gera subsídio cruzado fatal.",
    context: "A empresa produz a Peça A (padrão) e a Peça B (sob medida). O rateio contábil tradicional indica lucro de 20% em ambas. Porém, o caixa secou. A auditoria prova que a Peça B consome 5x mais tempo de máquina e controle de qualidade.",
    character: "👩‍💻 Controller de Fábrica",
    options: [
      {
        text: "A) Aplicar aumento linear de 15% na tabela de preços aprovada pela diretoria comercial.",
        xp: -100,
        feedback: "ALERTA DE RISCO. Aumento linear pune o produto rentável (A) e mantém o parasita (B) drenando o OPEX. Decisão sem embasamento em custos."
      },
      {
        text: "B) Implantar Custeio ABC, isolar despesas indiretas, reprecificar a Peça B para cima e direcionar comissionamento para a Peça A.",
        xp: 200,
        feedback: "APROVADO COM LOUVOR. Você aplicou contabilidade gerencial pura. O relatório agora reflete o consumo real, alinhado às melhores práticas de Controladoria."
      }
    ]
  },
  {
    id: 3,
    title: "ROE Anabolizado e Instruções CVM",
    theory: "Balanços não mentem para quem sabe ler. A ANBIMA e a CVM exigem transparência sobre alavancagem. O Modelo DuPont desconstrói o ROE (Retorno sobre Patrimônio Líquido). Um ROE inflado puramente pelo Multiplicador de Alavancagem (Dívida) é fraude gerencial.",
    context: "O ROE saltou de 15% para 35%. Os sócios exigem distribuição de lucros. O modelo DuPont revela: Margem Líquida despencou, Giro do Ativo estagnou, e o passivo circulante explodiu via dívida bancária de curto prazo.",
    character: "👔 Conselheiro Fiscal (CVM)",
    options: [
      {
        text: "A) Aprovar a distribuição de dividendos com base no ROE de 35% registrado no balanço.",
        xp: -200,
        feedback: "INFRAÇÃO GERENCIAL. Distribuir lucro baseado em ROE anabolizado por dívida descapitaliza o caixa e flerta com a insolvência e crime contra credores."
      },
      {
        text: "B) Reter dividendos (travar caixa), alongar o perfil da dívida e aprovar plano de choque na recuperação da margem líquida.",
        xp: 200,
        feedback: "AÇÃO ESTRATÉGICA. Você protegeu o balanço. Segundo as regras de compliance e CVM, a prioridade é a saúde financeira da operação (Going Concern), não a vaidade dos sócios."
      }
    ]
  },
  {
    id: 4,
    title: "Governança e Teste de Estresse (Sensibilidade)",
    theory: "O CMN (Conselho Monetário Nacional) e a SUSEP (para seguradoras e provisões) exigem testes de estresse em modelos de negócio. O planejamento orçamentário não pode ser pautado apenas no 'Cenário Base'. A análise de sensibilidade detecta o risco de ruína.",
    context: "Novo megacontrato vai dobrar a empresa, projetando 30% de margem. Mas exige triplicar custo fixo (CLT e servidores). Cláusula de risco: o cliente pode cancelar em 60 dias sem multa. O departamento de risco reprovou a operação no modelo tradicional.",
    character: "🕵️ Analista de Risco (SUSEP/CMN)",
    options: [
      {
        text: "A) Assinar o contrato e ignorar o departamento de risco. A margem projetada absorve o impacto.",
        xp: -300,
        feedback: "RUÍNA DECLARADA. Você apostou a empresa. Sem um plano de contingência (Teste de Estresse), o cancelamento no dia 60 leva à insolvência imediata. Irresponsabilidade fiduciária."
      },
      {
        text: "B) Assinar com mitigação de risco: terceirizar a infraestrutura (SaaS sob demanda) e transformar o custo fixo trabalhista em variável durante o período de carência contratual.",
        xp: 300,
        feedback: "EXCELÊNCIA EM GOVERNANÇA. Você aplicou modelagem de risco real. Transformou a fragilidade em opcionalidade. O caixa está blindado contra choques externos."
      }
    ]
  },
  {
    id: 5,
    title: "Valuation, LBO e Estrutura de Capital (WACC)",
    theory: "A PREVIC (Fundos de Pensão) e a CVM avaliam ativos com base no custo médio ponderado de capital (WACC). No processo de Fusões (M&A), o Leveraged Buyout (LBO) permite adquirir empresas usando dívida estruturada. Capital próprio custa caro; capital de terceiros gera escudo fiscal.",
    context: "Você vai comprar um concorrente precificado em R$ 1,5 milhão. Sua holding tem R$ 1,5 milhão em caixa livre. O banco oferece financiamento a 10% a.a. (8% real com escudo fiscal do IRPJ). Os sócios exigem retorno (Ke) de 20%.",
    character: "🏦 Diretor de M&A (Banco de Investimento)",
    options: [
      {
        text: "A) Pagar à vista com capital próprio. Dívida zero significa lucro 100% retido na matriz.",
        xp: -300,
        feedback: "INCOMPETÊNCIA DE ALOCAÇÃO. O capital dos sócios é o mais caro (20%). Você queimou o fundo de reserva da holding, aumentou o WACC e não aproveitou o escudo fiscal. O retorno (ROE) despencará."
      },
      {
        text: "B) Estruturar LBO: 20% de entrada (caixa próprio) e 80% financiado, usando o fluxo de caixa da adquirida para amortizar a dívida bancária barata (8%).",
        xp: 400,
        feedback: "ENGENHARIA FINANCEIRA DE ELITE. Reduziu o WACC, maximizou o ROE dos sócios, criou escudo fiscal perante a Receita e manteve a liquidez da holding intacta. CFO de respeito."
      }
    ]
  }
];

// Curva de carreira atualizada (Alto rigor corporativo)
const levels = [
  { title: "Estagiário", minXp: 0 },
  { title: "Assistente Financeiro", minXp: 100 },
  { title: "Analista Financeiro Jr.", minXp: 300 },
  { title: "Analista Financeiro Pleno", minXp: 500 },
  { title: "Analista Sênior / Coordenador", minXp: 800 },
  { title: "Controller", minXp: 1100 },
  { title: "CFO (Diretor Financeiro)", minXp: 1500 },
  { title: "CEO / Estrategista Master", minXp: 2000 }
];

export default function CodigoAzulGame() {
  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [xp, setXp] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sistema de Save/Load
  useEffect(() => {
    const savedData = localStorage.getItem('codigoAzulSave_v2');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPlayerName(parsedData.playerName);
      setCompanyName(parsedData.companyName);
      setXp(parsedData.xp);
      setCurrentStage(parsedData.currentStage);
      setGameStarted(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem('codigoAzulSave_v2', JSON.stringify({
        playerName,
        companyName,
        xp,
        currentStage
      }));
    }
  }, [xp, currentStage, gameStarted, playerName, companyName]);

  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() === "") return;
    setCompanyName(generateCompanyName());
    setGameStarted(true);
  };

  const resetGame = () => {
    if(confirm("Tem certeza que deseja apagar seu progresso e reiniciar?")) {
      localStorage.removeItem('codigoAzulSave_v2');
      setGameStarted(false);
      setXp(0);
      setCurrentStage(0);
      setPlayerName("");
      setFeedback(null);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Carregando Sistema...</div>;

  // --- TELA DE LOGIN (ONBOARDING) ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Efeitos de Fundo Tecnológico */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.04] bg-[length:32px_32px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>

        <div className="z-10 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-tighter mb-2">
              Projeto Código Azul
            </h1>
            <p className="text-slate-400 text-sm">Simulador de Alta Gestão Financeira e Regulatória</p>
          </div>

          <form onSubmit={startGame} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Identificação do Estrategista</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Digite seu nome..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Iniciar Operação
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DO JOGO ---
  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;
  
  const handleChoice = (xpGained: number, feedbackText: string) => {
    setXp(prev => Math.max(0, prev + xpGained));
    setLastXpChange(xpGained);
    setFeedback(feedbackText);
  };

  const nextStage = () => {
    setFeedback(null);
    setLastXpChange(null);
    if (currentStage < scenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      alert("Avaliação do Conselho Concluída! Você chegou ao limite da simulação atual.");
    }
  };

  const scenario = scenarios[currentStage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans transition-all">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER TÁTICO */}
        <header className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-blue-500/20 shadow-xl shadow-blue-900/10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="z-10 w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-wider mb-1">
              {companyName}
            </h1>
            <p className="text-slate-400 text-sm font-medium">Gestor(a): <span className="text-white">{playerName}</span></p>
          </div>
          
          <div className="z-10 w-full md:w-1/3 text-left md:text-right">
            <div className="flex justify-between md:justify-end md:space-x-4 items-baseline mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest">Patente CVM</p>
              <p className="text-lg font-bold text-emerald-400">{currentLevel.title}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{xp} XP</span>
                <span>{nextLevel ? `PRÓXIMO: ${nextLevel.minXp} XP` : 'MAESTRIA'}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-1000 ease-out" 
                  style={{ width: `${progressToNext}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE OPERAÇÕES */}
        {!feedback ? (
          <main className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-200">
                <span className="text-blue-500 mr-2">Fase {currentStage + 1}:</span> 
                {scenario.title}
              </h2>
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-mono border border-slate-700">
                REGULAÇÃO ATIVA
              </span>
            </div>

            <div className="space-y-6">
              {/* Box Teoria Regulatória */}
              <div className="bg-blue-950/30 p-5 rounded-xl border border-blue-900/50 flex gap-4 items-start">
                <div className="text-2xl mt-1">📚</div>
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase mb-1">Fundamentação Técnica</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{scenario.theory}</p>
                </div>
              </div>

              {/* Box Situação */}
              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex gap-4 items-start">
                <div className="text-2xl mt-1">📊</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-1">Contexto da Operação ({companyName})</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">{scenario.context}</p>
                </div>
              </div>

              {/* Opções */}
              <div className="pt-4 space-y-3">
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest text-center mb-4">Comando de Diretoria - Selecione uma ação</h3>
                {scenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(option.xp, option.feedback)}
                    className="w-full text-left p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 hover:border-blue-500 group shadow-md hover:shadow-blue-900/20"
                  >
                    <p className="text-slate-200 text-sm group-hover:text-white transition-colors">{option.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </main>
        ) : (
          /* TELA DE FEEDBACK DO CONSELHO */
          <div className={`p-8 rounded-2xl border backdrop-blur-xl animate-fade-in-up shadow-2xl ${
            lastXpChange && lastXpChange > 0 
              ? 'bg-emerald-950/40 border-emerald-500/30 shadow-emerald-900/20' 
              : 'bg-red-950/40 border-red-500/30 shadow-red-900/20'
          }`}>
            
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="text-4xl">
                {lastXpChange && lastXpChange > 0 ? '📈' : '📉'}
              </div>
              <div>
                <h2 className={`text-2xl font-black uppercase tracking-widest ${lastXpChange && lastXpChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {lastXpChange && lastXpChange > 0 ? 'Auditoria Aprovada' : 'Alerta de Compliance'}
                </h2>
                <div className="text-4xl font-black text-white font-mono mt-2">
                  {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} XP
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 mb-8 relative">
              <div className="absolute -top-4 left-6 bg-slate-800 px-4 py-1 rounded-full border border-slate-700 text-sm font-bold text-slate-300 shadow-lg">
                {scenario.character}
              </div>
              <p className="text-slate-200 mt-2 text-sm leading-relaxed">
                "{feedback}"
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={nextStage}
                className="bg-slate-100 hover:bg-white text-slate-900 font-black py-4 px-10 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                PROSSEGUIR PARA PRÓXIMO RELATÓRIO
              </button>
            </div>
          </div>
        )}

        {/* Rodapé Tático */}
        <div className="text-center pb-8">
          <button onClick={resetGame} className="text-xs text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest">
            Zerar Banco de Dados (Reset)
          </button>
        </div>

      </div>
    </div>
  );
}