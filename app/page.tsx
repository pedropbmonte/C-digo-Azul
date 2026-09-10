"use client";

import { useState, useEffect } from "react";

// --- GERADORES DINÂMICOS ---
const companyPrefixes = ["Indústria", "Varejo", "Tech", "Distribuidora", "Logística", "Holdings", "Construtora", "Laboratório", "Clínica", "Agronegócio"];
const companySuffixes = ["Alfa", "Ômega", "Titan", "Vértice", "Nexus", "Prime", "Quantum", "Horizonte", "Global", "Meridiano"];
const generateCompanyName = () => {
  return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
};

// --- MOTOR DE RANDOMIZAÇÃO ---
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- BANCO DE DADOS GLOBAL DE CENÁRIOS (TODAS AS ÁREAS) ---
const allScenarios = [
  // ÁREA: TESOURARIA E CAPITAL DE GIRO
  {
    id: 1,
    sector: "Tesouraria / CMN",
    title: "O Efeito Tesoura e a Liquidez",
    theory: "O Ciclo Financeiro dita a solvência. Normativas de crédito do Banco Central alertam que financiar clientes sem lastro de caixa leva ao Overtrading (Efeito Tesoura). Lucro não paga boleto, caixa sim.",
    context: "Vendas subiram 40%, com lucro contábil de 15%. Porém, a conta bancária amanheceu no vermelho e a folha vence amanhã. PMP (fornecedores) é de 15 dias, PMR (clientes) é de 60 dias.",
    character: "🏦 Diretor de Tesouraria",
    options: [
      {
        text: "A) Captar empréstimo para capital de giro e manter o crescimento de 40%.",
        xp: -200,
        feedback: "REPROVADO. Usar dívida cara para financiar ineficiência de ciclo financeiro quebra a empresa por asfixia de juros."
      },
      {
        text: "B) Antecipar recebíveis (travar hemorragia), renegociar passivo para 45 dias e alinhar prazos comerciais.",
        xp: 200,
        feedback: "DECISÃO CIRÚRGICA. Estancou a sangria e corrigiu o descompasso de prazos, alinhando a operação à gestão de risco de liquidez."
      }
    ]
  },
  // ÁREA: CONTROLADORIA E CUSTOS
  {
    id: 2,
    sector: "Controladoria / CPC 16",
    title: "Custeio ABC e o Parasita Invisível",
    theory: "O rateio por absorção mascara perdas. O Custeio Baseado em Atividades (ABC) rastreia o consumo real de recursos. Precificar sem ABC gera subsídio cruzado, onde o produto bom paga a conta do ruim.",
    context: "Peça A (padrão) e Peça B (sob medida) dão 'lucro' de 20% no relatório antigo, mas o caixa secou. A Controladoria prova que a Peça B consome 5x mais tempo de máquina e inspeção.",
    character: "👩‍💻 Controller de Fábrica",
    options: [
      {
        text: "A) Aplicar aumento linear de 15% na tabela de preços geral.",
        xp: -100,
        feedback: "ALERTA DE RISCO. Aumento linear pune o produto rentável (A) e mantém o parasita (B) drenando o OPEX."
      },
      {
        text: "B) Implantar Custeio ABC, reprecificar a Peça B para cima e focar comissões na Peça A.",
        xp: 200,
        feedback: "APROVADO COM LOUVOR. O relatório agora reflete o consumo real, destravando a margem de contribuição da fábrica."
      }
    ]
  },
  // ÁREA: FP&A E ORÇAMENTO
  {
    id: 3,
    sector: "FP&A / Orçamento",
    title: "A Faca na Carne: Orçamento Base Zero (OBZ)",
    theory: "O orçamento tradicional perpetua o desperdício histórico. O OBZ destrói essa lógica: cada centro de custo começa em R$ 0,00 e cada despesa precisa provar seu valor para as metas do novo ano.",
    context: "O faturamento cresce, mas a margem cai. A diretoria propõe um aumento linear de 8% nos custos gerais baseado no ano anterior, justificando como 'reajuste inflacionário seguro'.",
    character: "📈 Gerente de FP&A",
    options: [
      {
        text: "A) Rejeitar a proposta e impor um corte linear de 15% em todos os departamentos.",
        xp: -200,
        feedback: "ERRO DE GESTÃO. Cortes lineares são cegos. Você corre o risco de cortar marketing (receita) e manter assinaturas inúteis (desperdício)."
      },
      {
        text: "B) Vetar o orçamento histórico e aplicar o OBZ. Exigir que os gerentes construam e justifiquem as planilhas do zero.",
        xp: 300,
        feedback: "DECISÃO ESTRATÉGICA. Você arrancou os custos zumbis pela raiz e realocou capital apenas naquilo que gera tração."
      }
    ]
  },
  // ÁREA: CONTAS A RECEBER (AR) E RISCO
  {
    id: 4,
    sector: "Contas a Receber / Risco",
    title: "A Bomba da Inadimplência (PDD)",
    theory: "Venda só é venda quando o dinheiro entra. Políticas de crédito frouxas inflam o faturamento, mas explodem a Provisão para Devedores Duvidosos (PDD), destruindo o Ebitda e o fluxo de caixa.",
    context: "A equipe comercial bateu a meta em 150% oferecendo vendas no boleto em 12x sem análise rigorosa de crédito. A inadimplência na carteira saltou de 3% para 12%. O bônus dos vendedores já foi pago.",
    character: "🛡️ Analista de Crédito e Cobrança",
    options: [
      {
        text: "A) Contratar uma assessoria de cobrança terceirizada agressiva e manter a política de vendas para não desmotivar o comercial.",
        xp: -200,
        feedback: "ERRO DE ORIGINAÇÃO. Cobrança não resolve crédito mal concedido. Você continuará originando recebíveis podres."
      },
      {
        text: "B) Travar vendas a prazo para novos clientes, atrelar o bônus comercial ao recebimento (e não ao faturamento) e implementar Credit Score rigoroso.",
        xp: 300,
        feedback: "GOVERNANÇA ATIVADA. Você alinhou os incentivos. O vendedor agora é co-responsável pela saúde da carteira e a origem do risco foi blindada."
      }
    ]
  },
  // ÁREA: AUDITORIA E COMPLIANCE
  {
    id: 5,
    sector: "Auditoria Interna / Compliance",
    title: "Segregação de Funções (SoD)",
    theory: "Princípio basilar de Auditoria Interna (IIA): quem aprova a despesa não pode ser o mesmo que realiza o pagamento e concilia o banco. Falhas no SoD (Segregation of Duties) são a principal causa de fraudes corporativas.",
    context: "Você descobre que o Coordenador Financeiro cadastra novos fornecedores no ERP, aprova os boletos e ele mesmo libera o token de pagamento no banco, pois a empresa 'precisa de agilidade'.",
    character: "🕵️ Auditor Chefe (CFC)",
    options: [
      {
        text: "A) Manter o processo por agilidade, mas exigir que ele envie um relatório mensal em Excel com todos os pagamentos para a diretoria revisar.",
        xp: -300,
        feedback: "RISCO DE FRAUDE GRAVE. Revisar Excel não tem validade de auditoria, pois planilhas são adulteráveis. A empresa está totalmente vulnerável a desvios."
      },
      {
        text: "B) Bloquear o sistema imediatamente. Suprimentos cadastra, Gestor aprova a despesa, e a Tesouraria apenas opera o pagamento. Conciliação fica com a Contabilidade.",
        xp: 400,
        feedback: "BLINDAGEM CORPORATIVA. Você implementou a Matriz de Segregação de Funções (SoD). Fechou a porta para fraudes e preparou a empresa para auditorias externas (Big 4)."
      }
    ]
  },
  // ÁREA: CONTAS A PAGAR (AP) E PLANEJAMENTO
  {
    id: 6,
    sector: "Contas a Pagar / Planejamento",
    title: "O Custo de Oportunidade e o Fornecedor",
    theory: "O gestor de Contas a Pagar não é um 'pagador de boletos', é um alocador de capital. O desconto financeiro por antecipação de pagamento só vale a pena se for superior ao custo de capital (taxa de aplicação) da empresa no mesmo período.",
    context: "Seu maior fornecedor oferece 3% de desconto para pagamento à vista (hoje), ao invés do prazo padrão de 30 dias. Sua empresa tem caixa aplicado rendendo 1% ao mês.",
    character: "💼 Especialista em Contas a Pagar",
    options: [
      {
        text: "A) Recusar o desconto. É melhor manter o dinheiro aplicado no banco rendendo 1% e pagar só daqui a 30 dias para não perder a liquidez.",
        xp: -150,
        feedback: "ERRO MATEMÁTICO. Ao deixar de ganhar 3% de desconto para ganhar 1% no banco, você destruiu 2% de rentabilidade livre de risco no mês (quase 27% ao ano)."
      },
      {
        text: "B) Resgatar a aplicação e pagar à vista. O desconto de 3% ao mês representa um ganho financeiro muito superior à taxa de rendimento do caixa.",
        xp: 250,
        feedback: "INTELIGÊNCIA FINANCEIRA. Você usou a matemática a seu favor. O setor de AP gerou lucro para a empresa através do spread positivo entre o custo de oportunidade e o desconto."
      }
    ]
  },
  // ÁREA: PLANEJAMENTO TRIBUTÁRIO
  {
    id: 7,
    sector: "Tributário / Fiscal",
    title: "A Armadilha do Regime Tributário",
    theory: "No Brasil, o enquadramento fiscal dita a sobrevivência. Lucro Presumido tributa a receita; Lucro Real tributa a margem. Empresas com margens apertadas ou prejuízo no Presumido pagam impostos sobre um dinheiro que não existe.",
    context: "Indústria no Lucro Presumido faturou R$ 10 Milhões, mas devido à alta dos insumos, fechou o ano no zero a zero (sem lucro real). Mesmo assim, gerou uma guia milionária de IRPJ/CSLL para pagar.",
    character: "🏛️ Consultor Tributário",
    options: [
      {
        text: "A) Fazer um parcelamento na Receita Federal em 60 meses para não descapitalizar, mas manter a empresa no Lucro Presumido por ser mais 'fácil' de apurar.",
        xp: -250,
        feedback: "SUICÍDIO FISCAL. Você vai pagar imposto sobre um lucro inexistente e ainda adicionar juros de parcelamento. A facilidade contábil está quebrando o negócio."
      },
      {
        text: "B) Migrar imediatamente para o Lucro Real. Como a margem está comprimida, a empresa pagará IRPJ/CSLL apenas sobre o lucro efetivo (que é zero), gerando economia drástica.",
        xp: 350,
        feedback: "ELISÃO FISCAL CIRÚRGICA. Você usou a inteligência tributária (dentro da lei) para salvar o caixa. O regime tributário deve ser modelado ano a ano."
      }
    ]
  },
  // ÁREA: M&A E ESTRUTURA DE CAPITAL
  {
    id: 8,
    sector: "M&A / CVM",
    title: "Leveraged Buyout (LBO) e WACC",
    theory: "O LBO (Leveraged Buyout) permite adquirir empresas usando dívida. Capital próprio custa caro; capital de terceiros gera escudo fiscal e derruba o Custo Médio Ponderado de Capital (WACC).",
    context: "Você vai comprar um concorrente por R$ 1,5 milhão. A matriz tem o dinheiro em caixa. O banco oferece financiamento a 10% a.a. Os sócios exigem retorno (Ke) de 20%.",
    character: "👔 Diretor de M&A",
    options: [
      {
        text: "A) Pagar à vista com o capital da matriz para não ter dívidas e reter todo o lucro futuro.",
        xp: -300,
        feedback: "ERRO DE ALOCAÇÃO. Ao torrar o caixa da matriz com o dinheiro mais caro (dos sócios a 20%), você aumentou o WACC e não aproveitou o escudo fiscal."
      },
      {
        text: "B) Estruturar LBO: 20% de entrada e 80% financiado pelo banco a 10%, usando o fluxo da empresa comprada para pagar a própria dívida.",
        xp: 400,
        feedback: "JOGADA MASTER. Reduziu o WACC, maximizou o ROE dos sócios, criou escudo fiscal e manteve a liquidez da matriz. CFO de elite."
      }
    ]
  }
];

// Curva de carreira atualizada
const levels = [
  { title: "Estagiário / Trainee", minXp: 0 },
  { title: "Assistente Financeiro", minXp: 150 },
  { title: "Analista Financeiro Jr.", minXp: 400 },
  { title: "Analista Financeiro Pleno", minXp: 750 },
  { title: "Analista Sênior / Business Partner", minXp: 1200 },
  { title: "Controller", minXp: 1700 },
  { title: "CFO (Diretor Financeiro)", minXp: 2300 },
  { title: "CEO / Conselheiro de Administração", minXp: 3000 }
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
  const [sessionScenarios, setSessionScenarios] = useState<any[]>([]);

  // Sistema de Save/Load Avançado
  useEffect(() => {
    const savedData = localStorage.getItem('codigoAzulSave_v3');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPlayerName(parsedData.playerName);
      setCompanyName(parsedData.companyName);
      setXp(parsedData.xp);
      setCurrentStage(parsedData.currentStage);
      setSessionScenarios(parsedData.sessionScenarios);
      setGameStarted(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameStarted && sessionScenarios.length > 0) {
      localStorage.setItem('codigoAzulSave_v3', JSON.stringify({
        playerName,
        companyName,
        xp,
        currentStage,
        sessionScenarios
      }));
    }
  }, [xp, currentStage, gameStarted, playerName, companyName, sessionScenarios]);

  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() === "") return;
    setCompanyName(generateCompanyName());
    
    // Motor de Aleatoriedade: Sorteia as fases para a sessão atual
    const randomizedJourney = shuffleArray(allScenarios).slice(0, 10);
    setSessionScenarios(randomizedJourney);
    
    setGameStarted(true);
  };

  const resetGame = () => {
    if(confirm("Tem certeza que deseja apagar seu progresso e reiniciar sua jornada corporativa?")) {
      localStorage.removeItem('codigoAzulSave_v3');
      setGameStarted(false);
      setXp(0);
      setCurrentStage(0);
      setPlayerName("");
      setFeedback(null);
      setSessionScenarios([]);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-mono">Inicializando Sistemas ERP...</div>;

  // --- TELA DE LOGIN (ONBOARDING) ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.04] bg-[length:32px_32px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>

        <div className="z-10 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-tighter mb-2">
              Projeto Código Azul
            </h1>
            <p className="text-slate-400 text-sm">Simulador Dinâmico de Alta Gestão</p>
          </div>

          <form onSubmit={startGame} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Identificação do Estrategista</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nome do Jogador..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Iniciar Nova Jornada
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
    if (currentStage < sessionScenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      alert(`Avaliação Concluída! XP Final: ${xp}. Patente: ${currentLevel.title}. Zere o jogo para uma nova simulação randômica.`);
    }
  };

  const scenario = sessionScenarios[currentStage];

  if (!scenario) return null; // Prevenção de renderização antes do sorteio

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
              <p className="text-xs text-slate-400 uppercase tracking-widest">Patente Corporativa</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-200 leading-tight">
                <span className="text-blue-500 mr-2">Situação {currentStage + 1}:</span> 
                {scenario.title}
              </h2>
              <span className="bg-slate-800/80 text-blue-300 text-xs px-3 py-1.5 rounded-full font-mono border border-blue-900/50 whitespace-nowrap">
                {scenario.sector}
              </span>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-950/30 p-5 rounded-xl border border-blue-900/50 flex gap-4 items-start">
                <div className="text-2xl mt-1">📚</div>
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase mb-1">Fundamentação Técnica</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{scenario.theory}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex gap-4 items-start">
                <div className="text-2xl mt-1">📊</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-1">Contexto da Operação ({companyName})</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">{scenario.context}</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest text-center mb-4">Comando de Diretoria - Selecione uma ação</h3>
                {scenario.options.map((option: any, index: number) => (
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
                {lastXpChange && lastXpChange > 0 ? '✅' : '🚨'}
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
                PROSSEGUIR
              </button>
            </div>
          </div>
        )}

        <div className="text-center pb-8">
          <button onClick={resetGame} className="text-xs text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest">
            Encerrar Sessão e Reiniciar
          </button>
        </div>

      </div>
    </div>
  );
}