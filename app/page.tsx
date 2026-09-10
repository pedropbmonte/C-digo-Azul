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

// --- EFEITOS SONOROS ---
const playPromotionSound = () => {
  try {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Áudio bloqueado", e));
  } catch (err) {}
};

// --- CURVA DE CARREIRA E FEEDBACK DE PERFORMANCE ---
const levels = [
  { title: "Estagiário / Trainee", minXp: 0, hasTimer: false, feedback: null },
  { title: "Assistente Financeiro", minXp: 150, hasTimer: false, feedback: { forca: "Compreensão da mecânica básica de entradas e saídas e disciplina operacional.", vulnerabilidade: "Você ainda enxerga números isolados. Precisa entender o impacto das operações na DRE e no fluxo de caixa futuro." } },
  { title: "Analista Financeiro Jr.", minXp: 400, hasTimer: false, feedback: { forca: "Domínio das rotinas diárias e identificação de anomalias no caixa.", vulnerabilidade: "Falta visão de ciclo de capital de giro (Prazos Médios). Seu foco agora é entender como o estoque e os fornecedores financiam o negócio." } },
  { title: "Analista Financeiro Pleno", minXp: 750, hasTimer: true, feedback: { forca: "Capacidade analítica e resolução de problemas estruturais sem supervisão constante.", vulnerabilidade: "Visão estratégica de custos. Para subir, você precisará dominar Custeio ABC, formação de preço e margem de contribuição real." } },
  { title: "Analista Sênior / Business Partner", minXp: 1200, hasTimer: true, feedback: { forca: "Atuação como parceiro de negócios, conectando as finanças às decisões comerciais.", vulnerabilidade: "Gestão de risco e planejamento de longo prazo. O próximo nível exige domínio em Orçamento Base Zero (OBZ) e Modelagem de Cenários." } },
  { title: "Controller", minXp: 1700, hasTimer: true, feedback: { forca: "Controle absoluto de compliance, controladoria, PDD e mitigação de riscos fiscais.", vulnerabilidade: "Engenharia de capital. Um Controller protege o caixa; o próximo passo (CFO) exige saber como captar dinheiro barato e otimizar alavancagem." } },
  { title: "CFO (Diretor Financeiro)", minXp: 2300, hasTimer: true, feedback: { forca: "Otimização da Estrutura de Capital, uso de escudo fiscal e redução do WACC.", vulnerabilidade: "Crescimento inorgânico. Para dominar a mesa do conselho, você precisa dominar Valuation por Múltiplos e Estruturação de Fusões (LBO)." } },
  { title: "CEO / Conselheiro de Administração", minXp: 3000, hasTimer: true, feedback: { forca: "Visão corporativa total, alocação master de capital e governança estratégica.", vulnerabilidade: "Você atingiu o ápice técnico. O desafio agora não é mais financeiro, é humano: sucessão, cultura organizacional e expansão de mercado." } }
];

// --- BANCO DE DADOS GLOBAL DE CENÁRIOS ---
const allScenarios = [
  { id: 1, sector: "Tesouraria / CMN", title: "O Efeito Tesoura e a Liquidez", theory: "O Ciclo Financeiro dita a solvência. Normativas de crédito do Banco Central alertam que financiar clientes sem lastro de caixa leva ao Overtrading (Efeito Tesoura). Lucro não paga boleto, caixa sim.", context: "Vendas subiram 40%, com lucro contábil de 15%. Porém, a conta bancária amanheceu no vermelho e a folha vence amanhã. PMP (fornecedores) é de 15 dias, PMR (clientes) é de 60 dias.", character: "Diretoria de Tesouraria", options: [ { text: "Captar empréstimo para capital de giro e manter o crescimento de 40%.", xp: -200, feedback: "REPROVADO. Usar dívida cara para financiar ineficiência de ciclo financeiro quebra a empresa por asfixia de juros." }, { text: "Antecipar recebíveis (travar hemorragia), renegociar passivo para 45 dias e alinhar prazos comerciais.", xp: 200, feedback: "DECISÃO CIRÚRGICA. Estancou a sangria e corrigiu o descompasso de prazos, alinhando a operação à gestão de risco de liquidez." } ] },
  { id: 2, sector: "Controladoria / CPC 16", title: "Custeio ABC e o Parasita Invisível", theory: "O rateio por absorção mascara perdas. O Custeio Baseado em Atividades (ABC) rastreia o consumo real de recursos. Precificar sem ABC gera subsídio cruzado, onde o produto bom paga a conta do ruim.", context: "Peça A (padrão) e Peça B (sob medida) dão 'lucro' de 20% no relatório antigo, mas o caixa secou. A Controladoria prova que a Peça B consome 5x mais tempo de máquina e inspeção.", character: "Controladoria de Fábrica", options: [ { text: "Aplicar aumento linear de 15% na tabela de preços geral.", xp: -100, feedback: "ALERTA DE RISCO. Aumento linear pune o produto rentável (A) e mantém o parasita (B) drenando o OPEX." }, { text: "Implantar Custeio ABC, reprecificar a Peça B para cima e focar comissões na Peça A.", xp: 200, feedback: "APROVADO COM LOUVOR. O relatório agora reflete o consumo real, destravando a margem de contribuição da fábrica." } ] },
  { id: 3, sector: "FP&A / Orçamento", title: "A Faca na Carne: Orçamento Base Zero (OBZ)", theory: "O orçamento tradicional perpetua o desperdício histórico. O OBZ destrói essa lógica: cada centro de custo começa em R$ 0,00 e cada despesa precisa provar seu valor para as metas do novo ano.", context: "O faturamento cresce, mas a margem cai. A diretoria propõe um aumento linear de 8% nos custos gerais baseado no ano anterior, justificando como 'reajuste inflacionário seguro'.", character: "Gerência de FP&A", options: [ { text: "Rejeitar a proposta e impor um corte linear de 15% em todos os departamentos.", xp: -200, feedback: "ERRO DE GESTÃO. Cortes lineares são cegos. Você corre o risco de cortar marketing (receita) e manter assinaturas inúteis (desperdício)." }, { text: "Vetar o orçamento histórico e aplicar o OBZ. Exigir que os gerentes construam e justifiquem as planilhas do zero.", xp: 300, feedback: "DECISÃO ESTRATÉGICA. Você arrancou os custos zumbis pela raiz e realocou capital apenas naquilo que gera tração." } ] },
  { id: 4, sector: "Contas a Receber / Risco", title: "A Bomba da Inadimplência (PDD)", theory: "Venda só é venda quando o dinheiro entra. Políticas de crédito frouxas inflam o faturamento, mas explodem a Provisão para Devedores Duvidosos (PDD), destruindo o Ebitda e o fluxo de caixa.", context: "A equipe comercial bateu a meta em 150% oferecendo vendas no boleto em 12x sem análise rigorosa de crédito. A inadimplência na carteira saltou de 3% para 12%. O bônus dos vendedores já foi pago.", character: "Comitê de Risco e Crédito", options: [ { text: "Contratar uma assessoria de cobrança terceirizada agressiva e manter a política de vendas para não desmotivar o comercial.", xp: -200, feedback: "ERRO DE ORIGINAÇÃO. Cobrança não resolve crédito mal concedido. Você continuará originando recebíveis podres." }, { text: "Travar vendas a prazo para novos clientes, atrelar o bônus comercial ao recebimento e implementar Credit Score.", xp: 300, feedback: "GOVERNANÇA ATIVADA. Você alinhou os incentivos. O vendedor agora é co-responsável pela saúde da carteira e a origem do risco foi blindada." } ] },
  { id: 5, sector: "Auditoria / Compliance", title: "Segregação de Funções (SoD)", theory: "Princípio basilar de Auditoria Interna (IIA): quem aprova a despesa não pode ser o mesmo que realiza o pagamento e concilia o banco. Falhas no SoD (Segregation of Duties) são a principal causa de fraudes corporativas.", context: "Você descobre que o Coordenador Financeiro cadastra novos fornecedores no ERP, aprova os boletos e ele mesmo libera o token de pagamento no banco, pois a empresa 'precisa de agilidade'.", character: "Auditoria Independente", options: [ { text: "Manter o processo por agilidade, mas exigir que ele envie um relatório mensal em Excel com todos os pagamentos.", xp: -300, feedback: "RISCO DE FRAUDE GRAVE. Revisar Excel não tem validade de auditoria, pois planilhas são adulteráveis. A empresa está vulnerável." }, { text: "Bloquear o sistema. Suprimentos cadastra, Gestor aprova a despesa, e a Tesouraria apenas opera o pagamento.", xp: 400, feedback: "BLINDAGEM CORPORATIVA. Você implementou a Matriz de Segregação de Funções (SoD). Fechou a porta para fraudes e preparou a empresa para auditorias externas." } ] },
  { id: 6, sector: "Contas a Pagar / CaPex", title: "O Custo de Oportunidade", theory: "O gestor de Contas a Pagar não é um 'pagador de boletos', é um alocador de capital. O desconto financeiro por antecipação de pagamento só vale a pena se for superior ao custo de capital (taxa de aplicação) da empresa no mesmo período.", context: "Seu maior fornecedor oferece 3% de desconto para pagamento à vista (hoje), ao invés do prazo padrão de 30 dias. Sua empresa tem caixa aplicado rendendo 1% ao mês.", character: "Mesa de Operações (AP)", options: [ { text: "Recusar o desconto. É melhor manter o dinheiro aplicado no banco rendendo 1% e pagar só daqui a 30 dias.", xp: -150, feedback: "ERRO MATEMÁTICO. Ao deixar de ganhar 3% de desconto para ganhar 1% no banco, você destruiu 2% de rentabilidade livre de risco no mês." }, { text: "Resgatar a aplicação e pagar à vista. O desconto de 3% ao mês representa um ganho financeiro muito superior.", xp: 250, feedback: "INTELIGÊNCIA FINANCEIRA. Você usou a matemática a seu favor. O setor de AP gerou lucro para a empresa através do spread positivo." } ] },
  { id: 7, sector: "Tributário / Fiscal", title: "A Armadilha do Regime Tributário", theory: "No Brasil, o enquadramento fiscal dita a sobrevivência. Lucro Presumido tributa a receita; Lucro Real tributa a margem. Empresas com margens apertadas ou prejuízo no Presumido pagam impostos sobre um dinheiro que não existe.", context: "Indústria no Lucro Presumido faturou R$ 10 Milhões, mas devido à alta dos insumos, fechou o ano no zero a zero (sem lucro real). Mesmo assim, gerou uma guia milionária de IRPJ/CSLL para pagar.", character: "Consultoria Tributária", options: [ { text: "Fazer um parcelamento na Receita Federal em 60 meses para não descapitalizar, mas manter a empresa no Lucro Presumido.", xp: -250, feedback: "SUICÍDIO FISCAL. Você vai pagar imposto sobre um lucro inexistente e ainda adicionar juros de parcelamento. A facilidade contábil está quebrando o negócio." }, { text: "Migrar imediatamente para o Lucro Real. Como a margem está comprimida, a empresa pagará IRPJ/CSLL apenas sobre o lucro efetivo.", xp: 350, feedback: "ELISÃO FISCAL CIRÚRGICA. Você usou a inteligência tributária (dentro da lei) para salvar o caixa. O regime tributário deve ser modelado ano a ano." } ] },
  { id: 8, sector: "M&A / CVM", title: "Leveraged Buyout (LBO) e WACC", theory: "O LBO (Leveraged Buyout) permite adquirir empresas usando dívida. Capital próprio custa caro; capital de terceiros gera escudo fiscal e derruba o Custo Médio Ponderado de Capital (WACC).", context: "Você vai comprar um concorrente por R$ 1,5 milhão. A matriz tem o dinheiro em caixa. O banco oferece financiamento a 10% a.a. Os sócios exigem retorno (Ke) de 20%.", character: "Banco de Investimento (IB)", options: [ { text: "Pagar à vista com o capital da matriz para não ter dívidas e reter todo o lucro futuro.", xp: -300, feedback: "ERRO DE ALOCAÇÃO. Ao torrar o caixa da matriz com o dinheiro mais caro (dos sócios a 20%), você aumentou o WACC e não aproveitou o escudo fiscal." }, { text: "Estruturar LBO: 20% de entrada e 80% financiado pelo banco a 10%, usando o fluxo da empresa comprada para pagar a própria dívida.", xp: 400, feedback: "JOGADA MASTER. Reduziu o WACC, maximizou o ROE dos sócios, criou escudo fiscal e manteve a liquidez da matriz. CFO de elite." } ] }
];

export default function CodigoAzulGame() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [xp, setXp] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [sessionScenarios, setSessionScenarios] = useState<any[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);

  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v1') || '{}');
    if(db[nickname]) {
      db[nickname].data = { playerName, companyName, xp, currentStage, sessionScenarios };
      localStorage.setItem('codigoAzul_Corp_v1', JSON.stringify(db));
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('codigoAzul_Corp_v1');
    if (savedData) {
      // Logic for persistent login can be added here if needed
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameStarted && sessionScenarios.length > 0) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, currentStage, gameStarted, sessionScenarios]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nickname.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanNickname || !cleanPassword) {
      setLoginError("Credenciais inválidas.");
      return;
    }

    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v1') || '{}');

    if (db[cleanNickname]) {
      if (db[cleanNickname].password === cleanPassword) {
        const savedData = db[cleanNickname].data;
        setPlayerName(savedData.playerName);
        setCompanyName(savedData.companyName);
        setXp(savedData.xp);
        setCurrentStage(savedData.currentStage);
        setSessionScenarios(savedData.sessionScenarios);
        setLoginError("");
        setGameStarted(true);
      } else {
        setLoginError("Acesso Negado. Credenciais incorretas.");
      }
    } else {
      const newCompany = generateCompanyName();
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 8);
      
      db[cleanNickname] = {
        password: cleanPassword,
        data: {
          playerName: cleanNickname,
          companyName: newCompany,
          xp: 0,
          currentStage: 0,
          sessionScenarios: randomizedJourney
        }
      };
      
      localStorage.setItem('codigoAzul_Corp_v1', JSON.stringify(db));
      
      setPlayerName(cleanNickname);
      setCompanyName(newCompany);
      setXp(0);
      setCurrentStage(0);
      setSessionScenarios(randomizedJourney);
      setLoginError("");
      setTimeLeft(60);
      setGameStarted(true);
    }
  };

  const handleManualSave = () => {
    saveToDB();
    setSaveStatus("DADOS SINCRONIZADOS");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleLogout = () => {
    saveToDB();
    setGameStarted(false);
    setNickname("");
    setPassword("");
    setLoginError("");
    setFeedback(null);
    setPromotionPending(false);
  };

  const handleResetCareer = () => {
    if(confirm("ATENÇÃO: Operação irreversível. Deseja liquidar a empresa atual e reiniciar sua carreira?")) {
      const newCompany = generateCompanyName();
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 8);
      setCompanyName(newCompany);
      setXp(0);
      setCurrentStage(0);
      setSessionScenarios(randomizedJourney);
      setFeedback(null);
      setPromotionPending(false);
      setTimeLeft(60);
    }
  };

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && gameStarted && currentLevel.hasTimer) {
      handleChoice(-100, "TEMPO ESGOTADO. O mercado precificou sua indecisão. Operação abortada por falta de agilidade diretiva.", true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, gameStarted, currentLevel.hasTimer]);

  const handleChoice = (baseXpGained: number, feedbackText: string, isTimeout: boolean = false) => {
    let bonus = 0;
    if (baseXpGained > 0 && !isTimeout && currentLevel.hasTimer) {
      if (timeLeft >= 45) bonus = 50; 
      else if (timeLeft >= 30) bonus = 20; 
    }

    const totalXpGained = baseXpGained + bonus;
    const newXp = Math.max(0, xp + totalXpGained);
    
    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true);
      setPromotedLevel(newCalculatedLevel);
    }

    setXp(newXp);
    setLastXpChange(totalXpGained);
    setTimeBonus(bonus);
    setFeedback(feedbackText);
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) {
      setFeedback(null);
      playPromotionSound();
      return; 
    }
    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    setPromotionPending(false);
    setPromotedLevel(null);
    setFeedback(null);
    setLastXpChange(null);
    setTimeBonus(0);
    setTimeLeft(60);
    
    if (currentStage < sessionScenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      alert(`Auditoria Concluída! Performance Final: ${xp} XP. Cargo Retido: ${currentLevel.title}. O sistema será reiniciado.`);
      handleResetCareer();
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">INICIALIZANDO TERMINAL CVM...</div>;

  // --- TELA DE LOGIN (ESTÉTICA CORPORATIVA FINTECH) ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Grid Corporativa */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Reflexos e Luzes de Gráfico (Cyan e Gold/Amber) */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 -left-32 w-[600px] h-[400px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="z-10 bg-[#0B1221]/90 backdrop-blur-2xl p-10 rounded-xl border border-slate-700/50 shadow-[0_0_50px_rgba(6,182,212,0.05)] max-w-sm w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h1 className="text-2xl font-light text-white tracking-wide">
              CÓDIGO <span className="font-bold text-cyan-400">AZUL</span>
            </h1>
            <p className="text-slate-500 text-xs tracking-widest mt-2 uppercase">Terminal de Alta Gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">ID Operacional</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="nome.sobrenome"
                className="w-full bg-[#050A15] border border-slate-700/60 rounded-md px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Chave de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050A15] border border-slate-700/60 rounded-md px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-amber-400 text-xs text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold tracking-wide py-3 px-4 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all mt-4"
            >
              AUTENTICAR SESSÃO
            </button>
            <p className="text-center text-[10px] text-slate-600 mt-6 uppercase tracking-wider">
              Acesso restrito a diretoria registrada
            </p>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE PROMOÇÃO (ESTÉTICA CORPORATIVA) ---
  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>

        <div className="z-10 bg-[#0B1221]/95 backdrop-blur-2xl p-10 md:p-14 rounded-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)] max-w-2xl w-full text-center">
          <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.3em] mb-4">Comitê de Avaliação Corporativa</h2>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-10 tracking-wide">
            PROMOÇÃO <span className="font-bold">HOMOLOGADA</span>
          </h1>
          
          <div className="bg-[#050A15] p-8 rounded-lg border border-slate-800 mb-10 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500"></div>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800/80 pb-5 mb-5">
              <span className="text-slate-500 uppercase text-xs tracking-widest font-semibold">Nova Patente Executiva</span>
              <span className="text-2xl font-bold text-cyan-400 mt-2 md:mt-0">{promotedLevel?.title}</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-cyan-500/80 font-semibold uppercase text-[10px] tracking-widest mb-1">Mapeamento de Força Técnica</h3>
                <p className="text-slate-300 text-sm font-light leading-relaxed">{promotedLevel?.feedback?.forca}</p>
              </div>
              <div>
                <h3 className="text-amber-500/80 font-semibold uppercase text-[10px] tracking-widest mb-1">Foco de Desenvolvimento (Ponto Cego)</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{promotedLevel?.feedback?.vulnerabilidade}</p>
              </div>
            </div>
          </div>

          <button
            onClick={proceedToNextQuestion}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold tracking-widest py-4 px-10 rounded-md shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all uppercase"
          >
            Assumir Novo Comando
          </button>
        </div>
      </div>
    );
  }

  const scenario = sessionScenarios[currentStage];
  if (!scenario) return null;

  const timerColor = timeLeft > 30 ? 'bg-cyan-500' : timeLeft > 15 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-[#050A15] text-slate-200 p-4 md:p-8 font-sans transition-all relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER CORPORATIVO */}
        <header className="bg-[#0B1221]/90 backdrop-blur-xl p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center shadow-lg">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-lg font-light text-slate-300 tracking-wide uppercase mb-1">
              <span className="font-bold text-cyan-400">{companyName}</span>
            </h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-widest">ID Logado: <span className="text-slate-300">{playerName}</span></p>
          </div>
          
          <div className="w-full md:w-1/3 text-left md:text-right">
            <div className="flex justify-between md:justify-end md:space-x-4 items-baseline mb-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{currentLevel.title}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                <span>XP Atual: {xp}</span>
                <span>Meta: {nextLevel ? nextLevel.minXp : 'MAX'}</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                  style={{ width: `${progressToNext}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE OPERAÇÕES */}
        {!feedback ? (
          <main className="bg-[#0B1221] p-6 md:p-10 rounded-xl border border-slate-800 shadow-2xl">
            
            {currentLevel.hasTimer ? (
              <div className="mb-8 bg-[#050A15] h-1.5 w-full overflow-hidden border-b border-slate-800">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${timerColor} shadow-[0_0_8px_currentColor]`} 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
            ) : (
              <div className="mb-8 border-b border-slate-800/50 pb-2 flex justify-end">
                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-mono">Timer Inativo (Nível Base)</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-800/50 pb-6">
              <div>
                <span className="text-cyan-500 text-[10px] uppercase tracking-widest font-bold block mb-2">{scenario.sector}</span>
                <h2 className="text-xl md:text-2xl font-light text-white tracking-wide">
                  {scenario.title}
                </h2>
              </div>
              <span className="text-slate-500 text-xs font-mono uppercase border border-slate-700 px-3 py-1 rounded">Situação {currentStage + 1}/8</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#050A15] p-6 rounded-lg border border-slate-800/80">
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block"></span> 
                  Diretriz Regulatória
                </h3>
                <p className="text-slate-300 text-sm font-light leading-relaxed">{scenario.theory}</p>
              </div>

              <div className="bg-[#050A15] p-6 rounded-lg border border-slate-800/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> 
                  Contexto Operacional
                </h3>
                <p className="text-slate-200 text-sm font-light leading-relaxed">{scenario.context}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 text-center">Decisão Estratégica</h3>
              {scenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.xp, option.feedback)}
                  className="w-full text-left p-5 rounded-lg bg-[#080D1A] border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#0C1529] transition-all group hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                >
                  <p className="text-slate-300 text-sm font-light group-hover:text-cyan-50 transition-colors leading-relaxed">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          /* TELA DE FEEDBACK DO RELATÓRIO */
          <div className="bg-[#0B1221] p-10 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden text-center">
            <div className={`absolute top-0 left-0 w-full h-1 ${lastXpChange && lastXpChange > 0 ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'}`}></div>
            
            <h2 className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 mt-4 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-500' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Parecer Aprovado' : 'Alerta Crítico'}
            </h2>
            
            <div className="text-4xl font-light text-white font-mono tracking-widest mb-2">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-500">XP</span>
            </div>
            
            {timeBonus > 0 && (
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-8">
                + Bônus de Resposta Rápida ({timeBonus} XP)
              </div>
            )}

            <div className="bg-[#050A15] p-8 rounded-lg border border-slate-800/80 mb-10 text-left max-w-2xl mx-auto">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-2 block">{scenario.character}</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed border-l-2 border-slate-700 pl-4">
                {feedback}
              </p>
            </div>

            <button
              onClick={handleNextStageOrPromotion}
              className="bg-transparent border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 text-xs font-bold tracking-[0.2em] py-3 px-10 rounded transition-all uppercase"
            >
              {promotionPending ? "Acessar Relatório de Promoção" : "Próximo Arquivo"}
            </button>
          </div>
        )}

        {/* RODAPÉ OPERACIONAL */}
        <div className="flex flex-wrap items-center justify-center gap-6 pb-8 pt-4">
          <button onClick={handleManualSave} className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-semibold flex items-center gap-2">
            {saveStatus ? <span className="text-cyan-500">{saveStatus}</span> : "Sincronizar Dados"}
          </button>
          <span className="text-slate-800">|</span>
          <button onClick={handleLogout} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-semibold">
            Logout
          </button>
          <span className="text-slate-800">|</span>
          <button onClick={handleResetCareer} className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest font-semibold">
            Liquidar Operação (Reset)
          </button>
        </div>

      </div>
    </div>
  );
}