"use client";

import { useState, useEffect } from "react";

// --- GERADORES DINÂMICOS ---
const companyPrefixes = ["Indústria", "Varejo", "Tech", "Distribuidora", "Logística", "Holdings", "Construtora", "Laboratório", "Clínica", "Agronegócio"];
const companySuffixes = ["Alfa", "Ômega", "Titan", "Vértice", "Nexus", "Prime", "Quantum", "Horizonte", "Global", "Meridiano"];
const generateCompanyName = () => {
  return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
};

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const playPromotionSound = () => {
  try {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch (err) {}
};

// --- CURVA DE CARREIRA E FEEDBACK (PROGRESSÃO LENTA E DENSA) ---
const levels = [
  { title: "Estagiário", minXp: 0, hasTimer: false, feedback: null },
  { title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Compreensão da mecânica básica de fluxo de caixa e organização de contas a pagar/receber.", vulnerabilidade: "Sua visão ainda é puramente de tesouraria de curto prazo. Você precisa aprender como a contabilidade reflete o futuro (Regime de Competência) e não apenas o presente (Regime de Caixa)." } },
  { title: "Analista Financeiro Jr.", minXp: 300, hasTimer: false, feedback: { forca: "Consistência operacional e capacidade de identificar descasamentos no capital de giro.", vulnerabilidade: "Falta profundidade em custos e controle patrimonial. Estude o CPC 16 (Estoques) e entenda a diferença vital entre Despesa, Custo e Investimento." } },
  { title: "Analista Financeiro Pleno", minXp: 550, hasTimer: true, feedback: { forca: "Autonomia na execução analítica e entendimento claro de Margem de Contribuição e Custeio ABC.", vulnerabilidade: "Visão orçamentária e modelagem preditiva. O próximo salto exige que você saiba construir um Orçamento Base Zero (OBZ) e realizar Testes de Sensibilidade." } },
  { title: "Business Partner / Analista Sr.", minXp: 900, hasTimer: true, feedback: { forca: "Capacidade de sentar com os diretores de vendas e operações para atrelar as finanças às metas de negócio.", vulnerabilidade: "Falta domínio das normas complexas de reconhecimento (IFRS 15/CPC 47 e CPC 06). Um BP sênior precisa garantir que o negócio não inflija regras da CVM." } },
  { title: "Controller", minXp: 1400, hasTimer: true, feedback: { forca: "Domínio absoluto do compliance, auditoria (SoD), provisões (CPC 25) e proteção implacável do Ebitda.", vulnerabilidade: "Engenharia e Estrutura de Capital. O Controller protege a empresa; o CFO (seu próximo alvo) levanta capital, estrutura dívidas e reduz o WACC." } },
  { title: "CFO", minXp: 2100, hasTimer: true, feedback: { forca: "Otimização maestral do WACC, uso de Escudo Fiscal, gestão de Hedge e liderança em projetos de M&A (LBO).", vulnerabilidade: "Visão inorgânica, cultura e conselho. O próximo nível exige que você pense não apenas na saúde financeira da empresa atual, mas na tese de investimento global e relações com investidores (RI)." } },
  { title: "CEO / Board Member", minXp: 3000, hasTimer: true, feedback: { forca: "Visão sistêmica absoluta. Capacidade de equilibrar regulação severa com crescimento de altíssima tração.", vulnerabilidade: "Neste nível técnico não há mais pontos cegos operacionais. O desafio torna-se puramente sucessório, político e focado na longevidade da instituição no mercado de capitais." } }
];

// --- BANCO DE DADOS GLOBAL DE ALTA DENSIDADE TÉCNICA ---
const allScenarios = [
  { id: 1, sector: "Tesouraria / Risco de Liquidez", title: "O Efeito Tesoura (Overtrading)", theory: "Segundo as diretrizes de solvência do BCB, lucros contábeis não garantem liquidez. O Ciclo de Conversão de Caixa (CCC) é vital. Crescer vendas financiando clientes em prazos longos enquanto se paga fornecedores à vista consome o capital de giro exponencialmente, gerando o Efeito Tesoura.", context: "O faturamento saltou 40% neste trimestre e a DRE mostra 15% de margem líquida. Contudo, o caixa amanheceu descoberto. Os fornecedores exigem pagamento em 15 dias, mas o setor comercial alongou os recebimentos dos clientes para 60 dias para bater a meta.", character: "Diretoria de Tesouraria", options: [ { text: "Emitir debêntures ou captar linha de crédito de curto prazo para bancar o crescimento sustentado do setor comercial.", xp: -30, feedback: "REPROVADO. Financiar um ciclo financeiro estruturalmente deficitário com dívida bancária gera asfixia por juros. Você mascarou o problema." }, { text: "Travar imediatamente as vendas a prazo para novos clientes, antecipar recebíveis vigentes e renegociar o passivo para 45 dias.", xp: 35, feedback: "CIRÚRGICO. Você estancou a hemorragia de caixa e realinhou o ciclo financeiro à realidade operacional da empresa." } ] },
  { id: 2, sector: "Controladoria / CPC 16", title: "A Ilusão do Rateio por Absorção", theory: "O CPC 16 (Estoques) e a contabilidade gerencial moderna alertam contra o rateio arbitrário de custos fixos por volume. O Custeio Baseado em Atividades (ABC) rastreia o consumo real de recursos (cost drivers). Sem ele, ocorre o 'subsídio cruzado', onde produtos lucrativos pagam a conta de produtos ineficientes.", context: "Sua fábrica produz a Peça A (giro rápido) e a Peça B (sob medida). O rateio tradicional aponta margem de 20% em ambas. Porém, o caixa não reflete isso. Uma análise profunda revela que a Peça B consome 5 vezes mais reconfiguração de máquinas e controle de qualidade.", character: "Controller Industrial", options: [ { text: "Aplicar um aumento linear de 15% nos preços de todos os produtos para recompor a rentabilidade global exigida pelo conselho.", xp: -30, feedback: "ERRO CRÍTICO. O aumento linear encarece o produto que te sustenta (A), fazendo-o perder competitividade, enquanto o parasita (B) continua drenando a operação." }, { text: "Implantar imediatamente o Custeio ABC, reprecificar fortemente a Peça B para cima e focar as comissões da equipe na Peça A.", xp: 40, feedback: "VISÃO ESTRATÉGICA. Você extirpou a ilusão contábil. A reprecificação pelo consumo real de esforço destrava a rentabilidade oculta." } ] },
  { id: 3, sector: "Contabilidade / IFRS 15 (CPC 47)", title: "Reconhecimento de Receita e Compliance", theory: "O CPC 47 (Receita de Contrato com Cliente) estabelece o modelo de 5 etapas. A regra de ouro é: a receita só pode ser reconhecida quando a 'obrigação de desempenho' é satisfeita e o controle do bem/serviço é transferido ao cliente. Reconhecer faturamento apenas pela emissão da nota fiscal antes da entrega é fraude contábil (Window Dressing).", context: "É dia 30 de dezembro. A equipe de vendas fechou um contrato de R$ 5 Milhões para entrega de equipamentos. O cliente já assinou, mas a fábrica só entregará em fevereiro. O Diretor Comercial exige que a nota seja emitida hoje para que o bônus anual da diretoria seja atingido.", character: "Auditoria Externa (CVM)", options: [ { text: "Emitir a nota fiscal e reconhecer a receita no DRE de dezembro, afinal, o contrato está assinado e o compromisso legal foi firmado.", xp: -40, feedback: "FRAUDE CONTÁBIL DETECTADA. A obrigação de desempenho (entrega) não ocorreu. Você inflou os resultados, enganou os acionistas e violou o CPC 47." }, { text: "Vetar o reconhecimento da receita no DRE deste ano. Registrar a assinatura apenas como 'Adiantamento de Clientes' (Passivo) caso haja pagamento prévio.", xp: 45, feedback: "COMPLIANCE MANTIDO. Você protegeu a integridade do balanço contra pressões por bônus baseados em resultados irreais." } ] },
  { id: 4, sector: "Gestão de Risco / PDD", title: "Crescimento Inflado e o Risco de Crédito", theory: "Venda só se concretiza no recebimento. Políticas de crédito excessivamente flexíveis inflam o Ebitda temporariamente, mas geram uma bomba-relógio de Provisão para Devedores Duvidosos (PDD/PECLD), que destrói o resultado econômico nos semestres seguintes.", context: "O faturamento triplicou após o Comercial aprovar vendas parceladas em 24x sem consulta restritiva (SPC/Serasa). Seis meses depois, a inadimplência da carteira atingiu 18%. Os vendedores já receberam comissões gordas pelas 'vendas'.", character: "Comitê de Risco", options: [ { text: "Contratar uma assessoria jurídica agressiva para cobrança e manter a régua de crédito baixa para não travar o ritmo de expansão.", xp: -35, feedback: "FALHA ESTRATÉGICA. Cobrança não conserta crédito tóxico originado na base. Você continuará pagando comissão sobre faturamento que nunca vira caixa." }, { text: "Instituir Credit Score rigoroso, travar novas concessões e atrelar 50% das comissões da equipe comercial ao efetivo recebimento das parcelas.", xp: 40, feedback: "GOVERNANÇA DE ORIGINAÇÃO. O comercial deixou de ser apenas 'tirador de pedido' e tornou-se co-responsável pela saúde financeira da companhia." } ] },
  { id: 5, sector: "Compliance / Auditoria", title: "Matriz SoD (Segregation of Duties)", theory: "No framework do COSO e nas normas do IIA (Institute of Internal Auditors), a Segregação de Funções é inegociável. A mesma pessoa não pode iniciar uma transação, autorizá-la, registrá-la e custodiar os ativos. A agilidade nunca pode se sobrepor à segurança contra fraudes.", context: "Em uma filial recém-inaugurada, o Gerente Financeiro Local está sobrecarregado. Para 'acelerar processos', ele mesmo cadastra os novos fornecedores no sistema ERP, insere as notas fiscais e tem o token master do banco para efetivar as TEDs.", character: "Inspetoria de Compliance", options: [ { text: "Aprovar o modelo por 6 meses para garantir a agilidade da expansão, exigindo apenas que ele assine um termo de responsabilidade.", xp: -45, feedback: "RISCO DE FRAUDE EXTREMO. Assinatura de papel não impede desvios. O cenário atual permite que o gestor crie uma 'empresa fantasma', pague a si mesmo e apague o rastro." }, { text: "Bloquear o processo imediatamente. Separar acessos do ERP: a área de Compras cadastra o fornecedor, o Gerente aprova, e o Backoffice da Matriz efetiva o pagamento.", xp: 50, feedback: "BLINDAGEM SOFISTICADA. Você eliminou a oportunidade de fraude através da matriz SoD. A empresa está pronta para uma due diligence de Série A." } ] },
  { id: 6, sector: "Contabilidade / CPC 01", title: "Teste de Impairment (Recuperabilidade)", theory: "O CPC 01 exige que os ativos não estejam registrados contabilmente por um valor superior àquele passível de recuperação (seja por uso ou venda). Se uma máquina não gera mais caixa suficiente, a empresa é obrigada a reconhecer a perda por 'Impairment', baixando o valor do ativo e impactando o lucro.", context: "A empresa comprou um maquinário hiper-especializado por R$ 2 Milhões. Devido a uma mudança tecnológica no mercado, o produto feito por essa máquina perdeu demanda. O fluxo de caixa futuro projetado para a máquina é de apenas R$ 500 mil. A diretoria quer manter os R$ 2 Milhões no balanço para não 'estragar o lucro do ano'.", character: "Auditoria CVM / Big 4", options: [ { text: "Acatar a diretoria e manter o valor histórico. Afinal, a depreciação padrão continuará sendo feita anualmente até zerar a máquina.", xp: -45, feedback: "BALANÇO INFLADO (FRAUDE). O ativo está superavaliado. Manter 'lixo' no balanço fere o CPC 01 e cria distorções para investidores analisarem o ROA e ROIC." }, { text: "Executar o Teste de Recuperabilidade (Impairment), reconhecendo uma perda imediata de R$ 1,5 Milhão na DRE deste exercício para limpar o ativo.", xp: 50, feedback: "TRANSPARÊNCIA TOTAL. O choque no lucro é doloroso, mas demonstra maturidade de gestão. Você limpou o balanço de ativos irreais e manteve o compliance exigido." } ] },
  { id: 7, sector: "Planejamento Tributário Avançado", title: "JCP vs Dividendos", theory: "A distribuição de Juros sobre Capital Próprio (JCP) é considerada uma despesa financeira dedutível na apuração do Lucro Real (IRPJ e CSLL), gerando benefício fiscal para a empresa (reduzindo a carga em cerca de 34%). Já os dividendos não são dedutíveis, sendo pagos após a tributação. O gestor tributário de alto nível modela a distribuição para maximizar a riqueza global da companhia.", context: "A companhia encerrou o ano com R$ 10 Milhões em Lucro Real antes do imposto. Os acionistas solicitam o pagamento de R$ 2 Milhões em dividendos isentos para eles. O planejamento tributário não rodou otimização de base de cálculo.", character: "Comitê Tributário", options: [ { text: "Distribuir os R$ 2 Milhões integralmente como dividendos, conforme solicitado, mantendo o recebimento isento de IR na pessoa física dos sócios.", xp: -40, feedback: "DESPERDÍCIO DE CAIXA. Ao focar apenas no sócio, você deixou a empresa pagar cerca de 34% de impostos sobre esses R$ 2 milhões. Destruição de valor corporativo." }, { text: "Remodelar a distribuição: pagar o máximo permitido por lei como JCP. A empresa economiza 34% de IRPJ/CSLL, e mesmo com os sócios pagando 15% de IRRF, o ganho global é altíssimo.", xp: 50, feedback: "ELISÃO FISCAL DE ALTO CALIBRE. A inteligência tributária gerou uma economia líquida massiva, aumentando o fluxo de caixa livre (FCF) da companhia dentro da estrita legalidade." } ] },
  { id: 8, sector: "Contabilidade / CPC 25", title: "Provisões e Passivos Contingentes", theory: "O CPC 25 trata das incertezas jurídicas. Se uma perda em processo judicial é avaliada pelos advogados como de risco 'Provável', a empresa é obrigada a provisionar (impactando o lucro). Se for 'Possível', apenas divulga-se em notas explicativas. Se 'Remoto', não se faz nada. Misturar esses conceitos desfigura a realidade do passivo.", context: "A empresa sofreu uma grande ação trabalhista de um ex-diretor. O departamento jurídico emitiu parecer formal classificando o risco de perda (R$ 3 Milhões) como 'Possível'. A gerência, por medo, sugere contabilizar logo a despesa e tirar o dinheiro do resultado.", character: "Controladoria Jurídica", options: [ { text: "Contabilizar a despesa de R$ 3 Milhões imediatamente (Provisão), afinal, conservadorismo financeiro exige prever sempre o pior cenário no balanço.", xp: -35, feedback: "ERRO CONCEITUAL. O CPC 25 proíbe provisionar riscos 'Possíveis'. Ao fazer isso, você achatou artificialmente o lucro do ano e feriu as regras de reporte da CVM." }, { text: "Não contabilizar NENHUMA provisão na DRE. Apenas redigir uma Nota Explicativa detalhada nas demonstrações financeiras informando sobre o litígio.", xp: 40, feedback: "DOMÍNIO TÉCNICO. Você aplicou perfeitamente o critério do CPC 25. O lucro foi preservado enquanto a transparência aos investidores foi garantida via notas explicativas." } ] },
  { id: 9, sector: "Tesouraria / Derivativos (CPC 38)", title: "Exposição Cambial e Hedge", theory: "Empresas com custos em dólar e receitas em reais estão estruturalmente 'vendidas' em câmbio. Não fazer proteção (Hedge) via instrumentos derivativos (como NDF ou Swap) não é ser neutro; é o equivalente a especular direcionalmente a favor do real. A gestão de tesouraria sofisticada protege o orçamento de choques exógenos.", context: "Você acabou de assinar a importação de componentes críticos para a produção dos próximos 12 meses. O valor total é de US$ 5 Milhões, pagáveis no fim do ano. Atualmente o dólar está a R$ 5,00. O CFO anterior proibia contratos de Hedge, dizendo que pagar prêmio ao banco era 'gastar dinheiro à toa'.", character: "Mesa de Operações B3", options: [ { text: "Manter a política antiga. Se o dólar cair, a empresa gastará menos reais. Fazer hedge trava a cotação e impede lucrar com a queda da moeda americana.", xp: -45, feedback: "POSTURA ESPECULADORA. Você deixou a sobrevivência operacional nas mãos de flutuações macroeconômicas. Se houver uma crise e o dólar bater R$ 6,50, o Ebitda será dizimado." }, { text: "Travar imediatamente a cotação via um contrato de Termo (NDF - Non-Deliverable Forward). A empresa sacrifica possíveis ganhos cambiais para garantir a previsibilidade da margem.", xp: 50, feedback: "PROTEÇÃO BLINDADA. A função de uma empresa operacional é lucrar com seu core-business, não operando Forex. Você garantiu a segurança orçamentária do ano inteiro." } ] },
  { id: 10, sector: "M&A / CVM", title: "Estrutura de Capital (WACC) e LBO", theory: "Em finanças corporativas, fugir de dívidas a qualquer custo é ineficiência pura. O capital de terceiros gera escudo fiscal (dedutibilidade dos juros), tornando-o mais barato que o capital dos acionistas (Ke). O Leveraged Buyout (LBO) explora isso ao comprar empresas alavancadas pelas próprias aquisições, maximizando o ROE.", context: "O Conselho aprovou a aquisição de um forte concorrente por R$ 20 Milhões. A sua empresa tem liquidez folgada e poderia pagar à vista sem esforço. A taxa exigida pelos seus acionistas (Custo de Capital Próprio) é de 18% a.a. Um sindicato de bancos oferece financiar a operação a 11% a.a.", character: "Diretoria de Estratégia M&A", options: [ { text: "Liquidar a compra 100% à vista com o caixa próprio, celebrando na imprensa a força financeira da empresa por não precisar de dívidas.", xp: -40, feedback: "MIOPIA DE ALOCAÇÃO. O dinheiro do sócio (18%) é o mais caro. Ao não usar os 11% do banco, você destruiu valor (VPL) e aumentou o custo médio de capital (WACC) da transação." }, { text: "Estruturar o M&A usando dívida (LBO) para financiar 70% da aquisição, preservando o caixa da matriz e usando os juros para reduzir o IRPJ devido.", xp: 50, feedback: "ENGENHARIA ESTRATÉGICA DE CFO. Você reduziu severamente o WACC do projeto, garantiu escudo fiscal e alavancou o retorno sobre o patrimônio (ROE) dos acionistas." } ] },
  { id: 11, sector: "Contabilidade / CPC 06 (IFRS 16)", title: "Arrendamento Mercantil (Leasing)", theory: "A norma IFRS 16 (CPC 06 R2) acabou com a ilusão do 'leasing operacional' que ficava escondido fora do balanço. Agora, se a empresa aluga um imóvel ou frota no longo prazo, precisa reconhecer um Ativo de Direito de Uso e um Passivo de Arrendamento. Isso muda drasticamente o Ebitda e os índices de endividamento da empresa.", context: "A empresa vai alugar a sede administrativa por 10 anos (R$ 500 mil/mês). O gestor da área imobiliária sugere que, por ser apenas um aluguel, o contrato seja lançado apenas mês a mês como despesa de aluguel no DRE, mantendo o balanço 'leve' e livre de dívidas.", character: "Contabilidade Corporativa", options: [ { text: "Acatar a sugestão. Como o imóvel não é de propriedade da empresa e não houve financiamento bancário, ele não deve poluir a linha de passivo (dívidas) no Balanço Patrimonial.", xp: -40, feedback: "DESCOMPLIANCE CVM. Essa regra mudou em 2019. Ao esconder obrigações de longo prazo, os índices de alavancagem ficam falsos e as demonstrações seriam reprovadas pelos auditores." }, { text: "Reconhecer imediatamente o valor presente dos aluguéis futuros como Passivo Financeiro e Ativo de Direito de Uso, alterando a linha do DRE para Depreciação e Juros.", xp: 50, feedback: "ATUALIZAÇÃO NORMATIVA PERFEITA. O IFRS 16 exige transparência das obrigações futuras. Você protegeu a empresa contra ressalvas em relatórios de auditoria." } ] },
  { id: 12, sector: "Finanças Estruturadas", title: "Covenants Financeiros e Risco de Quebra", theory: "Dívidas corporativas sofisticadas possuem cláusulas de proteção (Covenants). A mais comum é a relação 'Dívida Líquida / Ebitda'. Se a empresa ultrapassa o teto estipulado em contrato, ocorre o 'Cross Default', dando ao banco o direito de exigir o pagamento integral da dívida antecipadamente, quebrando o caixa da empresa do dia para a noite.", context: "A empresa possui uma debênture de R$ 50 Milhões atrelada a um Covenant que exige (Dívida Líquida / Ebitda) menor que 2,5x. Hoje o índice está em 2,45x. A área comercial propõe uma grande campanha publicitária imediata, que consumirá o caixa em R$ 3 Milhões, mas promete retornos enormes no longo prazo.", character: "Relações com Investidores (RI)", options: [ { text: "Aprovar a campanha. Retorno de longo prazo justifica investimentos agressivos. É melhor crescer do que ficar estagnado olhando métricas bancárias rígidas.", xp: -50, feedback: "SUICÍDIO INSTITUCIONAL. Ao torrar o caixa em 3 Milhões, a Dívida Líquida subiu, estourando o Covenant de 2,5x. O banco executará a dívida amanhã, falindo a empresa imediatamente." }, { text: "Bloquear a campanha publicitária. Emitir ordens de contenção de OPEX para blindar o Ebitda e reter caixa (aumentar liquidez) até que o índice volte a um nível seguro de 2,0x.", xp: 50, feedback: "DOMÍNIO DE FINANÇAS ESTRUTURADAS. Você tem total controle sobre os gargalos contratuais (Covenants). Proteger a sobrevivência do CNPJ sempre antecede apostas de crescimento." } ] }
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

  // Usa-se V3 para desvincular do save anterior caso ele conflite com novas pontuações
  const saveToDB = () => {
    if (!nickname) return;
    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v3') || '{}');
    if(db[nickname]) {
      db[nickname].data = { playerName, companyName, xp, currentStage, sessionScenarios };
      localStorage.setItem('codigoAzul_Corp_v3', JSON.stringify(db));
    }
  };

  useEffect(() => {
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

    const db = JSON.parse(localStorage.getItem('codigoAzul_Corp_v3') || '{}');

    if (db[cleanNickname]) {
      if (db[cleanNickname].password === cleanPassword) {
        const d = db[cleanNickname].data;
        setPlayerName(d.playerName); setCompanyName(d.companyName);
        setXp(d.xp); setCurrentStage(d.currentStage); setSessionScenarios(d.sessionScenarios);
        setLoginError(""); setGameStarted(true);
      } else {
        setLoginError("Acesso negado. Senha incorreta.");
      }
    } else {
      const newCompany = generateCompanyName();
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 12); // SESSÕES AGORA TÊM 12 FASES
      db[cleanNickname] = { password: cleanPassword, data: { playerName: cleanNickname, companyName: newCompany, xp: 0, currentStage: 0, sessionScenarios: randomizedJourney } };
      localStorage.setItem('codigoAzul_Corp_v3', JSON.stringify(db));
      
      setPlayerName(cleanNickname); setCompanyName(newCompany); setXp(0);
      setCurrentStage(0); setSessionScenarios(randomizedJourney);
      setLoginError(""); setTimeLeft(60); setGameStarted(true);
    }
  };

  const handleLogout = () => {
    saveToDB(); setGameStarted(false); setNickname(""); setPassword("");
    setLoginError(""); setFeedback(null); setPromotionPending(false);
  };

  const handleManualSave = () => {
    saveToDB();
    setSaveStatus("DADOS HOMOLOGADOS NO SERVIDOR");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetCareer = () => {
    if(confirm("Operação irreversível. Liquidar empresa e resetar patentes?")) {
      const newCompany = generateCompanyName();
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 12);
      setCompanyName(newCompany); setXp(0); setCurrentStage(0);
      setSessionScenarios(randomizedJourney); setFeedback(null);
      setPromotionPending(false); setTimeLeft(60);
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
      handleChoice(-40, "TEMPO ESGOTADO. O mercado puniu sua hesitação corporativa severamente.", true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback, promotionPending, gameStarted, currentLevel.hasTimer]);

  const handleChoice = (baseXpGained: number, feedbackText: string, isTimeout: boolean = false) => {
    let bonus = 0;
    // Bônus de tempo mais sutil (10 a 20 pts max)
    if (baseXpGained > 0 && !isTimeout && currentLevel.hasTimer) {
      if (timeLeft >= 45) bonus = 15; else if (timeLeft >= 30) bonus = 5; 
    }
    const totalXpGained = baseXpGained + bonus;
    const newXp = Math.max(0, xp + totalXpGained);
    
    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true); setPromotedLevel(newCalculatedLevel);
    }

    setXp(newXp); setLastXpChange(totalXpGained); setTimeBonus(bonus); setFeedback(feedbackText);
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) { setFeedback(null); playPromotionSound(); return; }
    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    setPromotionPending(false); setPromotedLevel(null); setFeedback(null);
    setLastXpChange(null); setTimeBonus(0); setTimeLeft(60);
    
    if (currentStage < sessionScenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      alert(`Sessão de Auditoria Concluída! Você chegou ao fim deste lote de análises.\n\nSua Patente Consolidada: ${currentLevel.title}\nXP Total Acumulado: ${xp} XP.\n\nO sistema sorteará novos cenários aleatórios para a continuação da sua carreira corporativa.`);
      
      // Reinicia uma NOVA SESSÃO sem perder o XP! (Sustenta a progressão lenta)
      const randomizedJourney = shuffleArray(allScenarios).slice(0, 12);
      setCurrentStage(0);
      setSessionScenarios(randomizedJourney);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">INICIALIZANDO TERMINAL CVM...</div>;

  // --- TELA DE LOGIN ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/60 backdrop-blur-2xl p-10 rounded-2xl border border-white/5 shadow-2xl max-w-sm w-full relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1e293b]/50 border border-white/10 mb-6 shadow-inner">
              <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h1 className="text-2xl font-light text-slate-200 tracking-[0.2em] uppercase">
              Código <span className="font-semibold text-cyan-400">Azul</span>
            </h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] mt-2 uppercase font-mono">Terminal de Alta Gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">ID Operador</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="login.corp" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Senha API</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-cyan-50 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all" required />
            </div>
            
            {loginError && <div className="text-amber-400 text-[11px] font-mono text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">{loginError}</div>}

            <button type="submit" className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 text-xs font-mono tracking-widest py-4 px-4 rounded-lg transition-all mt-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              CONECTAR AO SERVIDOR
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TELA DE PROMOÇÃO ---
  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>

        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-3xl p-10 md:p-16 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-6">Comitê de Avaliação</h2>
          <h1 className="text-3xl md:text-5xl font-light text-slate-100 mb-12 tracking-wide uppercase">
            Promoção <span className="font-semibold text-cyan-400">Homologada</span>
          </h1>
          
          <div className="bg-[#020617]/50 p-8 rounded-xl border border-slate-800 mb-10 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800/80 pb-6 mb-6">
              <span className="text-slate-500 uppercase text-[10px] tracking-[0.2em] font-mono">Status Corporativo Adquirido</span>
              <span className="text-2xl font-semibold text-cyan-400 tracking-wide mt-2 md:mt-0">{promotedLevel?.title}</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-cyan-500/70 font-mono uppercase text-[10px] tracking-widest mb-2">Parecer Técnico Favorável</h3>
                <p className="text-slate-300 text-sm font-light leading-relaxed">{promotedLevel?.feedback?.forca}</p>
              </div>
              <div>
                <h3 className="text-amber-500/70 font-mono uppercase text-[10px] tracking-widest mb-2">Exigência para Novo Ciclo (Alerta Crítico)</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{promotedLevel?.feedback?.vulnerabilidade}</p>
              </div>
            </div>
          </div>

          <button onClick={proceedToNextQuestion} className="bg-cyan-950/50 border border-cyan-800 hover:border-cyan-400 text-cyan-400 text-xs font-mono tracking-[0.2em] py-4 px-12 rounded-xl transition-all uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            Assumir Mesa de Operações
          </button>
        </div>
      </div>
    );
  }

  const scenario = sessionScenarios[currentStage];
  if (!scenario) return null;

  const timerColor = timeLeft > 30 ? 'bg-cyan-500' : timeLeft > 15 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER */}
        <header className="bg-[#0f172a]/60 backdrop-blur-2xl p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
          
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-xl font-light text-slate-100 tracking-[0.15em] uppercase mb-1">
              <span className="font-semibold text-cyan-400">{companyName}</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">ID: <span className="text-slate-300">{playerName}</span></p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="flex justify-between items-baseline mb-3">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{currentLevel.title}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono tracking-widest">
                <span>XP ACUMULADO: {xp}</span>
                <span className="text-cyan-600">META PARA ASCENSÃO: {nextLevel ? nextLevel.minXp : 'N/A'}</span>
              </div>
              <div className="h-1.5 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_#06b6d4]" style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN PANEL */}
        {!feedback ? (
          <main className="bg-[#0f172a]/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            
            {currentLevel.hasTimer ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#020617] overflow-hidden rounded-t-2xl">
                <div className={`h-full transition-all duration-1000 ease-linear ${timerColor} shadow-[0_0_10px_currentColor]`} style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
              </div>
            ) : (
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 overflow-hidden rounded-t-2xl"></div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 mt-2 border-b border-white/5 pb-6">
              <div>
                <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 block">{scenario.sector}</span>
                <h2 className="text-2xl md:text-3xl font-light text-slate-100 tracking-wide">{scenario.title}</h2>
              </div>
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase border border-slate-700/50 bg-[#020617]/50 px-3 py-1.5 rounded-md">
                Ref: {currentStage + 1}/12
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-[#020617]/40 p-6 rounded-xl border border-white/5 hover:border-cyan-900/30 transition-colors">
                <h3 className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> Marco Regulatório / Teoria
                </h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{scenario.theory}</p>
              </div>

              <div className="bg-[#020617]/40 p-6 rounded-xl border border-white/5 hover:border-amber-900/20 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                <h3 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-3 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Dados do Field (Situação)
                </h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify relative z-10">{scenario.context}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">Protocolo de Decisão Estratégica</h3>
              {scenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.xp, option.feedback)}
                  className="w-full text-left p-6 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          /* TELA DE FEEDBACK */
          <div className="bg-[#0f172a]/60 backdrop-blur-2xl p-10 md:p-14 rounded-2xl border border-white/5 shadow-2xl relative text-center">
            <div className={`absolute top-0 left-0 w-full h-1 ${lastXpChange && lastXpChange > 0 ? 'bg-cyan-500 shadow-[0_0_15px_#06b6d4]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`}></div>
            
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-6 mt-4 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-500' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Aprovação Sistêmica' : 'Risco de Ruína Detectado'}
            </h2>
            
            <div className="text-5xl font-light text-slate-100 tracking-wider mb-2 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>
            
            {timeBonus > 0 && (
              <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-8">
                + Bônus Operacional de Agilidade ({timeBonus} XP)
              </div>
            )}

            <div className="bg-[#020617]/50 p-8 rounded-xl border border-white/5 mb-10 text-left max-w-2xl mx-auto relative">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono border border-slate-700/50 rounded-md">
                 Auditoria: {scenario.character}
               </span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">
                {feedback}
              </p>
            </div>

            <button
              onClick={handleNextStageOrPromotion}
              className="bg-transparent border border-slate-600 hover:border-cyan-400 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono tracking-[0.3em] py-4 px-12 rounded-xl transition-all uppercase hover:bg-cyan-950/20"
            >
              {promotionPending ? "Acessar Log de Promoção" : "Avançar Arquivo"}
            </button>
          </div>
        )}

        {/* RODAPÉ */}
        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleManualSave} className="text-[9px] text-cyan-600/50 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">
            {saveStatus ? saveStatus : "Sincronizar Data Center"}
          </button>
          <span className="text-slate-800">/</span>
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">
            Desconectar (Logout)
          </button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">
            Liquidar CNPJ (Reset Global)
          </button>
        </div>

      </div>
    </div>
  );
}