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
    audio.volume = 0.6;
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
  { id: 1, sector: "Tesouraria / CMN", title: "O Efeito Tesoura e a Liquidez", theory: "O Ciclo Financeiro dita a solvência. Normativas de crédito do Banco Central alertam que financiar clientes sem lastro de caixa leva ao Overtrading (Efeito Tesoura). Lucro não paga boleto, caixa sim.", context: "Vendas subiram 40%, com lucro contábil de 15%. Porém, a conta bancária amanheceu no vermelho e a folha vence amanhã. PMP (fornecedores) é de 15 dias, PMR (clientes) é de 60 dias.", character: "🏦 Diretor de Tesouraria", options: [ { text: "A) Captar empréstimo para capital de giro e manter o crescimento de 40%.", xp: -200, feedback: "REPROVADO. Usar dívida cara para financiar ineficiência de ciclo financeiro quebra a empresa por asfixia de juros." }, { text: "B) Antecipar recebíveis (travar hemorragia), renegociar passivo para 45 dias e alinhar prazos comerciais.", xp: 200, feedback: "DECISÃO CIRÚRGICA. Estancou a sangria e corrigiu o descompasso de prazos, alinhando a operação à gestão de risco de liquidez." } ] },
  { id: 2, sector: "Controladoria / CPC 16", title: "Custeio ABC e o Parasita Invisível", theory: "O rateio por absorção mascara perdas. O Custeio Baseado em Atividades (ABC) rastreia o consumo real de recursos. Precificar sem ABC gera subsídio cruzado, onde o produto bom paga a conta do ruim.", context: "Peça A (padrão) e Peça B (sob medida) dão 'lucro' de 20% no relatório antigo, mas o caixa secou. A Controladoria prova que a Peça B consome 5x mais tempo de máquina e inspeção.", character: "👩‍💻 Controller de Fábrica", options: [ { text: "A) Aplicar aumento linear de 15% na tabela de preços geral.", xp: -100, feedback: "ALERTA DE RISCO. Aumento linear pune o produto rentável (A) e mantém o parasita (B) drenando o OPEX." }, { text: "B) Implantar Custeio ABC, reprecificar a Peça B para cima e focar comissões na Peça A.", xp: 200, feedback: "APROVADO COM LOUVOR. O relatório agora reflete o consumo real, destravando a margem de contribuição da fábrica." } ] },
  { id: 3, sector: "FP&A / Orçamento", title: "A Faca na Carne: Orçamento Base Zero (OBZ)", theory: "O orçamento tradicional perpetua o desperdício histórico. O OBZ destrói essa lógica: cada centro de custo começa em R$ 0,00 e cada despesa precisa provar seu valor para as metas do novo ano.", context: "O faturamento cresce, mas a margem cai. A diretoria propõe um aumento linear de 8% nos custos gerais baseado no ano anterior, justificando como 'reajuste inflacionário seguro'.", character: "📈 Gerente de FP&A", options: [ { text: "A) Rejeitar a proposta e impor um corte linear de 15% em todos os departamentos.", xp: -200, feedback: "ERRO DE GESTÃO. Cortes lineares são cegos. Você corre o risco de cortar marketing (receita) e manter assinaturas inúteis (desperdício)." }, { text: "B) Vetar o orçamento histórico e aplicar o OBZ. Exigir que os gerentes construam e justifiquem as planilhas do zero.", xp: 300, feedback: "DECISÃO ESTRATÉGICA. Você arrancou os custos zumbis pela raiz e realocou capital apenas naquilo que gera tração." } ] },
  { id: 4, sector: "Contas a Receber / Risco", title: "A Bomba da Inadimplência (PDD)", theory: "Venda só é venda quando o dinheiro entra. Políticas de crédito frouxas inflam o faturamento, mas explodem a Provisão para Devedores Duvidosos (PDD), destruindo o Ebitda e o fluxo de caixa.", context: "A equipe comercial bateu a meta em 150% oferecendo vendas no boleto em 12x sem análise rigorosa de crédito. A inadimplência na carteira saltou de 3% para 12%. O bônus dos vendedores já foi pago.", character: "🛡️ Analista de Crédito e Cobrança", options: [ { text: "A) Contratar uma assessoria de cobrança terceirizada agressiva e manter a política de vendas para não desmotivar o comercial.", xp: -200, feedback: "ERRO DE ORIGINAÇÃO. Cobrança não resolve crédito mal concedido. Você continuará originando recebíveis podres." }, { text: "B) Travar vendas a prazo para novos clientes, atrelar o bônus comercial ao recebimento (e não ao faturamento) e implementar Credit Score rigoroso.", xp: 300, feedback: "GOVERNANÇA ATIVADA. Você alinhou os incentivos. O vendedor agora é co-responsável pela saúde da carteira e a origem do risco foi blindada." } ] },
  { id: 5, sector: "Auditoria Interna / Compliance", title: "Segregação de Funções (SoD)", theory: "Princípio basilar de Auditoria Interna (IIA): quem aprova a despesa não pode ser o mesmo que realiza o pagamento e concilia o banco. Falhas no SoD (Segregation of Duties) são a principal causa de fraudes corporativas.", context: "Você descobre que o Coordenador Financeiro cadastra novos fornecedores no ERP, aprova os boletos e ele mesmo libera o token de pagamento no banco, pois a empresa 'precisa de agilidade'.", character: "🕵️ Auditor Chefe (CFC)", options: [ { text: "A) Manter o processo por agilidade, mas exigir que ele envie um relatório mensal em Excel com todos os pagamentos para a diretoria revisar.", xp: -300, feedback: "RISCO DE FRAUDE GRAVE. Revisar Excel não tem validade de auditoria, pois planilhas são adulteráveis. A empresa está totalmente vulnerável a desvios." }, { text: "B) Bloquear o sistema imediatamente. Suprimentos cadastra, Gestor aprova a despesa, e a Tesouraria apenas opera o pagamento. Conciliação fica com a Contabilidade.", xp: 400, feedback: "BLINDAGEM CORPORATIVA. Você implementou a Matriz de Segregação de Funções (SoD). Fechou a porta para fraudes e preparou a empresa para auditorias externas." } ] },
  { id: 6, sector: "Contas a Pagar / Planejamento", title: "O Custo de Oportunidade e o Fornecedor", theory: "O gestor de Contas a Pagar não é um 'pagador de boletos', é um alocador de capital. O desconto financeiro por antecipação de pagamento só vale a pena se for superior ao custo de capital (taxa de aplicação) da empresa no mesmo período.", context: "Seu maior fornecedor oferece 3% de desconto para pagamento à vista (hoje), ao invés do prazo padrão de 30 dias. Sua empresa tem caixa aplicado rendendo 1% ao mês.", character: "💼 Especialista em Contas a Pagar", options: [ { text: "A) Recusar o desconto. É melhor manter o dinheiro aplicado no banco rendendo 1% e pagar só daqui a 30 dias para não perder a liquidez.", xp: -150, feedback: "ERRO MATEMÁTICO. Ao deixar de ganhar 3% de desconto para ganhar 1% no banco, você destruiu 2% de rentabilidade livre de risco no mês (quase 27% ao ano)." }, { text: "B) Resgatar a aplicação e pagar à vista. O desconto de 3% ao mês representa um ganho financeiro muito superior à taxa de rendimento do caixa.", xp: 250, feedback: "INTELIGÊNCIA FINANCEIRA. Você usou a matemática a seu favor. O setor de AP gerou lucro para a empresa através do spread positivo." } ] },
  { id: 7, sector: "Tributário / Fiscal", title: "A Armadilha do Regime Tributário", theory: "No Brasil, o enquadramento fiscal dita a sobrevivência. Lucro Presumido tributa a receita; Lucro Real tributa a margem. Empresas com margens apertadas ou prejuízo no Presumido pagam impostos sobre um dinheiro que não existe.", context: "Indústria no Lucro Presumido faturou R$ 10 Milhões, mas devido à alta dos insumos, fechou o ano no zero a zero (sem lucro real). Mesmo assim, gerou uma guia milionária de IRPJ/CSLL para pagar.", character: "🏛️ Consultor Tributário", options: [ { text: "A) Fazer um parcelamento na Receita Federal em 60 meses para não descapitalizar, mas manter a empresa no Lucro Presumido por ser mais 'fácil' de apurar.", xp: -250, feedback: "SUICÍDIO FISCAL. Você vai pagar imposto sobre um lucro inexistente e ainda adicionar juros de parcelamento. A facilidade contábil está quebrando o negócio." }, { text: "B) Migrar imediatamente para o Lucro Real. Como a margem está comprimida, a empresa pagará IRPJ/CSLL apenas sobre o lucro efetivo (que é zero), gerando economia drástica.", xp: 350, feedback: "ELISÃO FISCAL CIRÚRGICA. Você usou a inteligência tributária (dentro da lei) para salvar o caixa. O regime tributário deve ser modelado ano a ano." } ] },
  { id: 8, sector: "M&A / CVM", title: "Leveraged Buyout (LBO) e WACC", theory: "O LBO (Leveraged Buyout) permite adquirir empresas usando dívida. Capital próprio custa caro; capital de terceiros gera escudo fiscal e derruba o Custo Médio Ponderado de Capital (WACC).", context: "Você vai comprar um concorrente por R$ 1,5 milhão. A matriz tem o dinheiro em caixa. O banco oferece financiamento a 10% a.a. Os sócios exigem retorno (Ke) de 20%.", character: "👔 Diretor de M&A", options: [ { text: "A) Pagar à vista com o capital da matriz para não ter dívidas e reter todo o lucro futuro.", xp: -300, feedback: "ERRO DE ALOCAÇÃO. Ao torrar o caixa da matriz com o dinheiro mais caro (dos sócios a 20%), você aumentou o WACC e não aproveitou o escudo fiscal." }, { text: "B) Estruturar LBO: 20% de entrada e 80% financiado pelo banco a 10%, usando o fluxo da empresa comprada para pagar a própria dívida.", xp: 400, feedback: "JOGADA MASTER. Reduziu o WACC, maximizou o ROE dos sócios, criou escudo fiscal e manteve a liquidez da matriz. CFO de elite." } ] }
];

export default function CodigoAzulGame() {
  // Login States
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Game States
  const [playerName, setPlayerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [xp, setXp] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [sessionScenarios, setSessionScenarios] = useState<any[]>([]);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeBonus, setTimeBonus] = useState(0);

  // Promotion State
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);

  // Manual Save State
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // --- SISTEMA DE BANCO DE DADOS LOCAL (MULTIUSUÁRIO) ---
  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_DB_v7') || '{}');
    
    // Atualiza apenas os dados da sessão (mantém a senha intacta)
    if(db[nickname]) {
      db[nickname].data = {
        playerName,
        companyName,
        xp,
        currentStage,
        sessionScenarios
      };
      localStorage.setItem('codigoAzul_DB_v7', JSON.stringify(db));
    }
  };

  // Auto-Save a cada mudança de estado crítico
  useEffect(() => {
    if (gameStarted && sessionScenarios.length > 0) {
      saveToDB();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, currentStage, gameStarted, sessionScenarios]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nickname.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    if (!cleanNickname || !cleanPassword) {
      setLoginError("Preencha Identificação e Senha.");
      return;
    }

    const db = JSON.parse(localStorage.getItem('codigoAzul_DB_v7') || '{}');

    if (db[cleanNickname]) {
      // Usuário Existe - Checar Senha
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
        setLoginError("Acesso Negado. Senha incorreta.");
      }
    } else {
      // Novo Usuário - Criar Conta e Iniciar
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
      
      localStorage.setItem('codigoAzul_DB_v7', JSON.stringify(db));
      
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
    setSaveStatus("💾 DADOS SINCRONIZADOS!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleLogout = () => {
    saveToDB(); // Salva antes de sair
    setGameStarted(false);
    setNickname("");
    setPassword("");
    setLoginError("");
    setFeedback(null);
    setPromotionPending(false);
  };

  const handleResetCareer = () => {
    if(confirm("ATENÇÃO: Isso vai zerar seu XP e gerar uma nova empresa. Deseja recomeçar sua carreira do zero?")) {
      const newCompany = generateCompanyName();
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 8);
      
      setCompanyName(newCompany);
      setXp(0);
      setCurrentStage(0);
      setSessionScenarios(randomizedJourney);
      setFeedback(null);
      setPromotionPending(false);
      setTimeLeft(60);
      // O useEffect do Auto-Save cuidará de gravar isso no banco
    }
  };

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // Lógica do Cronômetro
  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || !currentLevel.hasTimer || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, timeLeft, currentLevel.hasTimer]);

  // Disparo automático do tempo
  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && gameStarted && currentLevel.hasTimer) {
      handleChoice(-100, "TEMPO ESGOTADO! A indecisão destruiu o caixa. Em níveis executivos, atrasar uma decisão é tão letal quanto tomar a decisão errada.", true);
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
      alert(`Avaliação de Diretoria Concluída! XP Final: ${xp}. Patente: ${currentLevel.title}. Zere sua carreira para uma nova simulação.`);
    }
  };

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
              Código Azul ERP
            </h1>
            <p className="text-slate-400 text-sm">Autenticação de Alta Gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ID do Estrategista (Nickname)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: pedro.monte"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-red-400 text-sm text-center font-bold bg-red-950/50 p-2 rounded border border-red-900/50">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              Acessar Painel / Criar Conta
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Se o ID não existir, uma nova conta será criada automaticamente.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE PROMOÇÃO CONQUISTADA ---
  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.04] bg-[length:32px_32px]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl opacity-50 animate-ping"></div>

        <div className="z-10 bg-slate-900/90 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-emerald-500/50 shadow-2xl max-w-2xl w-full text-center animate-fade-in-up">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Comitê de Avaliação</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8">
            PROMOÇÃO APROVADA
          </h1>
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8 space-y-6 text-left">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-slate-400 uppercase text-sm font-bold">Novo Cargo Assumido:</span>
              <span className="text-2xl font-black text-blue-400">{promotedLevel?.title}</span>
            </div>
            
            <div>
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-2">Força Estratégica (Potencial)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{promotedLevel?.feedback?.forca}</p>
            </div>

            <div>
              <h3 className="text-amber-400 font-bold uppercase text-xs tracking-widest mb-2">Ponto Cego (Vulnerabilidade)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{promotedLevel?.feedback?.vulnerabilidade}</p>
            </div>
          </div>

          <button
            onClick={proceedToNextQuestion}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-12 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-900/50"
          >
            ASSUMIR PAINEL DE CONTROLE
          </button>
        </div>
      </div>
    );
  }

  const scenario = sessionScenarios[currentStage];
  if (!scenario) return null;

  const timerColor = timeLeft > 30 ? 'bg-emerald-500' : timeLeft > 15 ? 'bg-amber-500' : 'bg-red-500 animate-pulse';

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
            <p className="text-slate-400 text-sm font-medium">Conta Logada: <span className="text-white uppercase">{playerName}</span></p>
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
            
            {/* BARRA DE PRESSÃO (CRONÔMETRO) */}
            {currentLevel.hasTimer ? (
              <div className="mb-6 bg-slate-950 rounded-full h-3 w-full border border-slate-800 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${timerColor}`} 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference">
                  {timeLeft} SEGUNDOS RESTANTES
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-slate-950 rounded-full h-8 w-full border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Cronômetro Desativado (Fase de Treinamento)
              </div>
            )}

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
                <div className="text-5xl font-black text-white font-mono mt-2">
                  {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} XP
                </div>
                {timeBonus > 0 && (
                  <div className="mt-2 text-sm font-bold text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full inline-block border border-amber-700/50">
                    ⚡ Bônus de Agilidade: +{timeBonus} XP
                  </div>
                )}
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
                onClick={handleNextStageOrPromotion}
                className="bg-slate-100 hover:bg-white text-slate-900 font-black py-4 px-10 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                {promotionPending ? "VER RELATÓRIO DE DESEMPENHO" : "PROSSEGUIR"}
              </button>
            </div>
          </div>
        )}

        {/* RODAPÉ E PAINEL DE CONTROLE DE SESSÃO */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pb-8 pt-4">
          <button 
            onClick={handleManualSave} 
            className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            {saveStatus ? saveStatus : "💾 Forçar Backup"}
          </button>
          
          <span className="hidden md:inline text-slate-700">|</span>
          
          <button 
            onClick={handleLogout} 
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            🚪 Fazer Logout
          </button>

          <span className="hidden md:inline text-slate-700">|</span>

          <button 
            onClick={handleResetCareer} 
            className="text-xs font-bold text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            ❌ Resetar Minha Carreira
          </button>
        </div>

      </div>
    </div>
  );
}