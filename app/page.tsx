"use client";

import { useState, useEffect } from "react";
// IMPORTAÇÕES DO FIREBASE
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

// --- CURVA DE MATURIDADE (Dono para Dono) ---
const levels = [
  { tier: 1, title: "Apagador de Incêndios", minXp: 0, hasTimer: false, feedback: null },
  { tier: 1, title: "Sobrevivente do Mês", minXp: 120, hasTimer: false, feedback: { forca: "A empresa não morre, você tem garra.", vulnerabilidade: "Mas a empresa não roda um dia sem você. O dinheiro some rápido." } },
  { tier: 2, title: "Chefe de Equipe", minXp: 280, hasTimer: false, feedback: { forca: "Começou a entender que faturamento não é lucro no bolso.", vulnerabilidade: "Ainda confunde a conta da Pessoa Física com a Jurídica (PF x PJ)." } },
  { tier: 2, title: "Gestor de Sobrevivência", minXp: 500, hasTimer: true, feedback: { forca: "O caixa parou de sangrar por besteira e o preço está real.", vulnerabilidade: "Falta capital de giro estruturado para parar de antecipar maquininha." } },
  { tier: 3, title: "Dono de Negócio", minXp: 800, hasTimer: true, feedback: { forca: "Você finalmente saiu do balcão e olha para o painel de controle.", vulnerabilidade: "Dependência de clientes grandes e gargalos na gestão de pessoas." } },
  { tier: 3, title: "Estrategista de Caixa", minXp: 1200, hasTimer: true, feedback: { forca: "Entende o Efeito Tesoura, domina prazos e tem fôlego.", vulnerabilidade: "A transição tributária pode comer a sua margem se não agir." } },
  { tier: 4, title: "Diretor Executivo", minXp: 1800, hasTimer: true, feedback: { forca: "A empresa gera caixa livre, tem reserva e a equipe performa.", vulnerabilidade: "O ego do crescimento rápido pode estourar o custo fixo." } },
  { tier: 4, title: "Empresário de Elite", minXp: 2600, hasTimer: true, feedback: { forca: "O negócio é um ativo. O dinheiro trabalha e a equipe roda sozinha.", vulnerabilidade: "Manter a inovação e a disciplina financeira blindada." } }
];

// --- BANCO DE DADOS LOCAL E BLINDADO (Sistema de Randomização de Alta Performance) ---
const questionBank = [
  {
    id: "q_pf_pj_01",
    tier: 1,
    sector: "Sobrevivência Financeira", 
    title: "A Síndrome do Caixa Único",
    theory: "O choque de realidade: Vender não é receber, e o saldo do banco hoje não é seu lucro. Misturar Pessoa Física (PF) e Pessoa Jurídica (PJ) mascara o custo fixo real. Se a empresa paga a escola do filho, o CNPJ está sangrando e você não vê.",
    context: "A conta da empresa tem R$ 4.000. O vale da equipe amanhã soma R$ 6.000. Ao olhar o extrato, você viu que passou R$ 3.500 no cartão da empresa com compras de supermercado para sua casa nesta semana.",
    character: "Painel de Sinais Vitais",
    consultoriaHint: "Mentor Pedro Monte diz: 'Dono que assalta a própria empresa vira funcionário de banco. Devolva o dinheiro para a PJ hoje. Pague a equipe. Corte o seu lazer na PF até a empresa respirar. Não pegue empréstimo para pagar supermercado.'",
    options: [
      { id: "A", text: "Injetar dinheiro pessoal de volta na empresa hoje, pagar a equipe e definir um pró-labore fixo e austero.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou os bolsos, honrou a equipe e cortou o câncer financeiro." },
      { id: "B", text: "Pegar limite rotativo da empresa (cheque especial) para cobrir a equipe e não mexer na PF.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -2.5, compliance: -10 }, feedback: "ILUSÃO. Você contraiu dívida cara na PJ para bancar um luxo na PF." },
      { id: "C", text: "Atrasar a equipe justificando que 'as vendas foram fracas'.", xp: -40, isBest: false, impacts: { caixa: -2000, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL. A equipe desmotivada vai destruir seu atendimento." }
    ]
  },
  {
    id: "q_maq_01",
    tier: 1,
    sector: "Capital de Giro", 
    title: "O Vício da Maquininha",
    theory: "Antecipar recebíveis não é fluxo de caixa, é agiotagem legalizada se não for precificada. Pagar 5% ao mês para ter o SEU dinheiro amanhã destrói completamente a Margem de Contribuição. Você trabalha só para o banco.",
    context: "Você fechou uma venda de R$ 15.000 parcelada em 10x sem juros. O boleto do fornecedor dessa mercadoria vence amanhã. Você não tem caixa livre.",
    character: "O Fluxo de Caixa",
    consultoriaHint: "Mentor Pedro Monte diz: 'Se antecipar, você não teve lucro nessa venda. Ligue para o fornecedor. Seja homem/mulher de negócios. Estique o boleto dele e crie uma oferta PIX relâmpago hoje para levantar capital barato.'",
    options: [
      { id: "A", text: "Renegociar o prazo com o fornecedor e lançar uma promoção relâmpago via PIX à vista para levantar caixa.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA. Você preservou a margem da venda e esticou o passivo." },
      { id: "B", text: "Apertar o botão de antecipação da maquininha pagando 6% para ter o dinheiro na hora.", xp: 5, isBest: false, impacts: { caixa: 0, margem: -3.0, compliance: 0 }, feedback: "PALIATIVO. Salvou a sexta-feira, mas a margem foi pro ralo." },
      { id: "C", text: "Pagar o fornecedor com o cartão de crédito da empresa (somando taxa de maquininha + juros).", xp: -45, isBest: false, impacts: { caixa: -3000, margem: -5.0, compliance: -20 }, feedback: "BOLA DE NEVE. Dívida sobre dívida." }
    ]
  },
  {
    id: "q_rh_01",
    tier: 2,
    sector: "Gestão de Pessoas", 
    title: "O Câncer da 'Ajuda' Familiar",
    theory: "O choque de realidade: Empresa não é ONG de parente. Contratar familiar só porque 'ele tá precisando' sem exigir meta ou perfil técnico destrói a cultura da empresa. Os bons funcionários percebem a injustiça e o rendimento geral cai.",
    context: "Seu cunhado está desempregado e pediu 'uma força'. Você o colocou no atendimento ao cliente. Ele chega atrasado, atende mal no WhatsApp e você perdeu duas vendas grandes hoje por lentidão dele.",
    character: "A Cultura da Empresa",
    consultoriaHint: "Mentor Pedro Monte diz: 'Demitir parente custa a paz no almoço de domingo, mas manter parente ruim custa a sua empresa. Tire ele da linha de frente hoje. Pague o aviso e preserve a cultura de resultado.'",
    options: [
      { id: "A", text: "Chamar para uma reunião de feedback duro, estabelecer metas claras e demitir se não cumprir em 10 dias.", xp: 30, isBest: true, impacts: { caixa: 1000, margem: 2.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou CPF de CNPJ na gestão de pessoas." },
      { id: "B", text: "Dar uma bronca leve e tirar ele do WhatsApp, colocando para organizar o estoque onde 'dá menos problema'.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -1.0, compliance: -5 }, feedback: "COVARDIA. Você manteve um custo fixo inútil escondido no estoque." },
      { id: "C", text: "Ignorar o problema e você mesmo passar a responder o WhatsApp para não causar confusão em família.", xp: -40, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: -20 }, feedback: "O GARGALO VOLTOU. Você voltou pro operacional para cobrir erro alheio." }
    ]
  },
  {
    id: "q_preco_01",
    tier: 1,
    sector: "Precificação e Custos", 
    title: "O Preço do 'Achismo'",
    theory: "Copiar o preço do concorrente sem saber seu próprio custo fixo é como dirigir vendado. Se você vende por R$ 100 achando que ganha 50, mas esquece o imposto e a taxa do cartão, você está pagando para trabalhar.",
    context: "O seu produto mais vendido custa R$ 80. O fornecedor avisou que amanhã o custo sobe 15%. O concorrente vende por R$ 75 e você tem medo de aumentar e perder clientes.",
    character: "O Seu Contador",
    consultoriaHint: "Mentor Pedro Monte diz: 'Quem foca em preço atrai cliente infiel. Suba a tabela e use esse filtro natural para perder os clientes caçadores de desconto e ficar com quem valoriza a sua entrega.'",
    options: [
      { id: "A", text: "Repassar o aumento para o preço final, focar na qualidade e deixar os 'caçadores de preço' irem para o vizinho.", xp: 35, isBest: true, impacts: { caixa: 3000, margem: 2.5, compliance: 10 }, feedback: "VISÃO DE LUCRO. Faturamento é vaidade, lucro é sanidade." },
      { id: "B", text: "Absorver o custo temporariamente até ver se o mercado 'aceita' o aumento.", xp: -10, isBest: false, impacts: { caixa: -2000, margem: -3.0, compliance: 0 }, feedback: "MIOPIA. Você sangrou a empresa por medo da reação do mercado." },
      { id: "C", text: "Baixar o preço para R$ 70 para quebrar o vizinho, apostando no volume.", xp: -50, isBest: false, impacts: { caixa: -8000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO FINANCEIRO. Volume sem margem só acelera a falência." }
    ]
  },
  {
    id: "q_calote_01",
    tier: 2,
    sector: "Cobrança e Inadimplência", 
    title: "O Fiado do Cliente Parceiro",
    theory: "O pequeno empresário não é banco. O medo de cobrar e 'ficar chato' transforma o lucro no papel em perda real. Se o cliente levou e não pagou, ele te usou como linha de crédito gratuita.",
    context: "Um cliente antigo está devendo R$ 8.000 há 35 dias. Hoje ele ligou querendo fazer um novo pedido de R$ 5.000 para sexta-feira.",
    character: "O Calote Invisível",
    consultoriaHint: "Mentor Pedro Monte diz: 'Dono, passivo não é cliente. Trave a esteira. Mande uma mensagem firme, porém profissional: Nova liberação de crédito só acontece mediante baixa do título anterior. Sem exceção.'",
    options: [
      { id: "A", text: "Travar o pedido: 'Parceiro, preciso da quitação do título em aberto para faturar a nova remessa'.", xp: 35, isBest: true, impacts: { caixa: 6000, margem: 1.0, compliance: 15 }, feedback: "POSTURA DE DONO. Você botou ordem na casa e evitou um calote duplo." },
      { id: "B", text: "Entregar o novo pedido e pedir para ele depositar 'qualquer parte' da dívida antiga semana que vem.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -1.5, compliance: -10 }, feedback: "FRAQUEZA. Você ensinou ao cliente que as regras não existem." },
      { id: "C", text: "Descontar uma duplicata no banco para cobrir o buraco e entregar o pedido para não perder a amizade.", xp: -40, isBest: false, impacts: { caixa: -7000, margem: -4.0, compliance: -20 }, feedback: "A QUEBRA. Tomou dívida com juros no seu nome para cobrir o calote de terceiro." }
    ]
  },
  {
    id: "q_estoque_01",
    tier: 2,
    sector: "Gestão de Estoque", 
    title: "O Cemitério na Prateleira",
    theory: "Dinheiro imobilizado em estoque que não gira (curva C) é capital de giro apodrecendo. O 'desconto de volume' que o fornecedor deu só vale a pena se houver velocidade de venda.",
    context: "Você tem R$ 20.000 congelados no fundo da loja em um produto que não vende há 4 meses. Faltam R$ 6.000 para pagar o aluguel amanhã.",
    character: "O Boletim de Caixa",
    consultoriaHint: "Mentor Pedro Monte diz: 'Estoque não gira sozinho e não paga aluguel. Faça um saldão agressivo a preço de custo HOJE. Engula o orgulho, transforme a caixa de papelão em dinheiro líquido e pague sua despesa.'",
    options: [
      { id: "A", text: "Fazer ação relâmpago queimando esse estoque a preço de custo para transformar papelão em dinheiro vivo hoje.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: -1.0, compliance: 10 }, feedback: "ESTRATEGISTA. Assumiu o erro da compra e salvou o fluxo de caixa." },
      { id: "B", text: "Manter o preço cheio esperando o produto valorizar, e pegar dinheiro do seu bolso (PF) para o aluguel.", xp: -10, isBest: false, impacts: { caixa: -4000, margem: 0, compliance: -5 }, feedback: "ILUSÃO. Sangrou o próprio patrimônio." },
      { id: "C", text: "Comprar mais mercadoria nova usando o cheque especial para tentar atrair clientes.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -15 }, feedback: "FALÊNCIA. A dívida multiplicou e a prateleira continua cheia." }
    ]
  },
  {
    id: "q_operacional_01",
    tier: 3,
    sector: "Estrutura Operacional", 
    title: "O Teto do Eu-preendedor",
    theory: "Se a empresa depende de você para atender o telefone, empacotar e cobrar, você não tem empresa, tem um emprego ruim. O medo de aumentar o custo fixo trava a receita da companhia.",
    context: "Sua receita estagnou. Você trabalha 14h por dia e está exausto. O WhatsApp demora 4 horas para ser respondido porque você está limpando o chão.",
    character: "A Balança de Crescimento",
    consultoriaHint: "Mentor Pedro Monte diz: 'O seu tempo de dono vale R$ 300 a hora. Você está fazendo um trabalho de R$ 15 a hora. Contrate urgente. O custo fixo sobe, mas sua energia volta para VENDAS e ESTRATÉGIA.'",
    options: [
      { id: "A", text: "Contratar imediatamente um assistente, treinar e se liberar para focar apenas em estratégia e fechamento de vendas.", xp: 35, isBest: true, impacts: { caixa: -2500, margem: 3.5, compliance: 10 }, feedback: "SALTO DE MATURIDADE. A receita vai decolar porque o dono voltou a liderar." },
      { id: "B", text: "Contratar um freelancer barato só para a noite, mantendo o controle total de dia.", xp: 5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "MEIA SOLUÇÃO. Não aliviou o gargalo diurno." },
      { id: "C", text: "Continuar sozinho dizendo 'ninguém faz melhor que eu' e não atender mais cliente à tarde.", xp: -35, isBest: false, impacts: { caixa: -6000, margem: -3.0, compliance: 0 }, feedback: "ESTAGNAÇÃO. Você aceitou que o negócio morreu." }
    ]
  },
  {
    id: "q_rh_02",
    tier: 3,
    sector: "Gestão de Pessoas", 
    title: "O Refém do Funcionário Estrela",
    theory: "O pior risco de um pequeno negócio é a dependência técnica de um único funcionário. Quando um colaborador percebe que é insubstituível, ele passa a ditar as regras da sua empresa.",
    context: "Seu melhor vendedor (traz 50% da receita) bateu na sua mesa. Pediu 40% de aumento no salário fixo, dizendo que a concorrência o chamou. Se ele sair hoje, as vendas despencam amanhã.",
    character: "O Funcionário 'Sócio'",
    consultoriaHint: "Mentor Pedro Monte diz: 'Nunca negocie com reféns. Dê um prêmio de retenção atrelado a meta (variável) para ganhar 30 dias. Nesse meio tempo, documente o processo dele e contrate dois estagiários para pulverizar a dependência.'",
    options: [
      { id: "A", text: "Negar o aumento no fixo, oferecer um bônus por meta alcançada (variável) e iniciar imediatamente a contratação de novos vendedores.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 1.0, compliance: 20 }, feedback: "GOVERNANÇA. Você quebrou o monopólio interno e protegeu o caixa fixo." },
      { id: "B", text: "Dar o aumento de 40% no fixo porque você está desesperado com medo dele levar os clientes.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -4.0, compliance: -15 }, feedback: "VOCÊ FOI ENQUADRADO. O funcionário virou dono da sua empresa." },
      { id: "C", text: "Mandar ele embora na mesma hora por desaforo e tentar atender sozinho os clientes dele.", xp: -30, isBest: false, impacts: { caixa: -8000, margem: -5.0, compliance: -10 }, feedback: "EGO INFLADO. Agir por emoção gerou um rombo imediato na receita." }
    ]
  },
  {
    id: "q_tributos_01",
    tier: 4,
    sector: "Estratégia Tributária", 
    title: "O Salto do Simples Nacional",
    theory: "O medo de desenquadrar a empresa de faixa tributária faz o empreendedor se boicotar. Segurar o faturamento ou emitir nota 'fria' para não sair do limite é pensar pequeno e arriscar processo criminal.",
    context: "Novembro. A sua empresa atingiu 98% do limite de faturamento anual da sua faixa do Simples. Há pedidos grandes engatilhados para o fim do ano que fariam a empresa dobrar.",
    character: "O Limite da Receita Federal",
    consultoriaHint: "Mentor Pedro Monte diz: 'Crescer dói. Não limite suas vendas. Fature, oficialize o desenquadramento, pague a nova alíquota e seja bem-vindo ao jogo de quem é grande de verdade.'",
    options: [
      { id: "A", text: "Aceitar os pedidos, oficializar o desenquadramento com o contador, precificar a nova carga tributária e abraçar o crescimento.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.5, compliance: 25 }, feedback: "PASSAPORTE DO CRESCIMENTO. Pagar mais imposto sobre lucro é a única via." },
      { id: "B", text: "Parar de vender em novembro, dar férias coletivas e só voltar em janeiro.", xp: -25, isBest: false, impacts: { caixa: -10000, margem: -2.0, compliance: 0 }, feedback: "MENTALIDADE DE ESCASSEZ. Travou o CNPJ e frustrou os clientes." },
      { id: "C", text: "Vender aceitando apenas dinheiro vivo (sem nota) para maquiar o faturamento.", xp: -50, isBest: false, impacts: { caixa: 10000, margem: -3.0, compliance: -50 }, feedback: "CRIME FISCAL. O cruzamento de dados da Receita vai fechar o seu negócio." }
    ]
  }
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
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  
  // --- ESTADOS DO MOTOR LOCAL ---
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); 
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  
  // --- NOVOS RECURSOS ---
  const [showConsultoriaHint, setShowConsultoriaHint] = useState(false);
  const [isDREOpen, setIsDREOpen] = useState(false);
  
  // --- SLIDERS DRE ---
  const [dreProLabore, setDreProLabore] = useState(5000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreTaxas, setDreTaxas] = useState(1900); // Maquininha

  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { playerName, phone: telefone, email: email.toLowerCase(), companyName, xp, caixa, margem, compliance, currentStage, usedQuestionIds }
      });
    } catch (e) {
      console.error("Erro no Data Center: ", e);
    }
  };

  useEffect(() => { if (gameStarted && !isGameOver) saveToDB(); }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, usedQuestionIds]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  // --- O MOTOR BLINDADO DE QUESTÕES ---
  const loadNextQuestion = () => {
    setFeedback(null);
    setShowConsultoriaHint(false);
    
    let available = questionBank.filter(q => q.tier <= currentLevel.tier && !usedQuestionIds.includes(q.id));
    
    if (available.length === 0) {
      setUsedQuestionIds([]);
      available = questionBank.filter(q => q.tier <= currentLevel.tier);
    }
    
    const selected = available[Math.floor(Math.random() * available.length)];
    const shuffledOptions = shuffleArray([...selected.options]);
    setCurrentScenario({ ...selected, options: shuffledOptions });
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !currentScenario && !feedback) {
      loadNextQuestion();
    }
  }, [gameStarted, currentScenario, feedback]);

  // --- AÇÃO DA CONSULTORIA ---
  const handleConsultoria = () => {
    if (caixa >= 3500) {
      setCaixa(prev => prev - 3500);
      setXp(prev => prev + 25);
      setShowConsultoriaHint(true);
    } else {
      alert("Caixa insuficiente para acionar a Consultoria do Pedro Monte.");
    }
  };

  // --- AVALIAÇÃO DA ESCOLHA ---
  const handleOptionSelect = (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    let finalXp = selectedOption.xp;
    let finalImpacts = { ...selectedOption.impacts };

    setUsedQuestionIds(prev => [...prev, currentScenario.id]);

    const fullFeedback = `${selectedOption.feedback}\n\nCÓDIGO AZUL.`;
    
    let newCaixa = Math.max(0, caixa + finalImpacts.caixa);
    let newMargem = margem + finalImpacts.margem;
    let newCompliance = Math.min(100, Math.max(0, compliance + finalImpacts.compliance));
    let newXp = Math.max(0, xp + finalXp);

    setCaixa(newCaixa); 
    setMargem(newMargem); 
    setCompliance(newCompliance);
    setXp(newXp); 
    setLastXpChange(finalXp); 
    setLastImpacts(finalImpacts);

    if (newCaixa <= 0) { setIsGameOver(true); setFeedback("FALÊNCIA DECRETADA. Seu fluxo de caixa zerou."); setIsEvaluatingChoice(false); return; }
    if (newCompliance <= 0) { setIsGameOver(true); setFeedback("FECHAMENTO FISCAL. Problemas tributários paralisaram a empresa."); setIsEvaluatingChoice(false); return; }

    setFeedback(fullFeedback);
    setIsEvaluatingChoice(false);
  };

  const proceedToNextQuestion = () => {
    setFeedback(null);
    setLastXpChange(null);
    setLastImpacts(null);
    setShowConsultoriaHint(false);
    
    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);
    
    if (nextStage % 5 === 0) {
      setIsDREOpen(true);
    } else {
      setCurrentScenario(null); 
    }
  };

  // --- SISTEMA DRE INTERATIVO (Lógica PME Real) ---
  const dreReceita = 50000;
  const dreImpostos = 3800; // 7.6%
  const dreCMV = 18000; // 36%
  const dreCustoFixoBase = 8850; 
  const dreTotalDespesas = dreImpostos + dreCMV + dreCustoFixoBase + dreProLabore + dreMarketing + dreTaxas;
  const dreLucroLiquido = dreReceita - dreTotalDespesas;
  const dreNovaMargem = (dreLucroLiquido / dreReceita) * 100;

  const handleAplicarDRE = () => {
    setCaixa(prev => prev + dreLucroLiquido);
    setMargem(dreNovaMargem);
    setIsDREOpen(false);
    setCurrentScenario(null); 
  };

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
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 45000, margem: 18.0, compliance: 100, currentStage: 0, usedQuestionIds: [] }
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
    setGameStarted(true); setIsGameOver(false); setIsDREOpen(false);
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false); setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setIsGameOver(false); setIsDREOpen(false); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Você vai zerar seu CNPJ e reiniciar sua jornada. Confirma?")) {
      setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setUsedQuestionIds([]);
      setFeedback(null); setIsGameOver(false); setLastImpacts(null); setIsDREOpen(false); 
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
      setDreProLabore(5000); setDreMarketing(1000); setDreTaxas(1900);
    }
  };

  const caixaBarFill = Math.min(100, (caixa / 100000) * 100);
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
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Nome do seu Negócio</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome</label><input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
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
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Mentoria & Simulador de Negócios</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('login'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
            <button onClick={() => { setAuthMode('register'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Criar Conta</button>
            <button onClick={() => { setAuthMode('forgot'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'forgot' ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>Redefinir</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <><div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Nome Completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
              <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">WhatsApp</label><input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div></>
            )}

            <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">E-mail Principal</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] text-slate-400 uppercase font-mono flex justify-between">
                <span>{authMode === 'forgot' ? 'Nova Senha Segura' : 'Senha de Acesso'}</span>
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-500 hover:text-cyan-300 uppercase tracking-widest">{showPassword ? "Ocultar" : "Mostrar"}</button>
              </div>
            </div>

            {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}
            {authSuccess && <div className="text-emerald-400 text-[10px] font-mono text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">{authSuccess}</div>}

            <button disabled={isAuthenticating} type="submit" className={`w-full text-xs font-mono py-3.5 rounded-lg mt-4 transition-all uppercase tracking-widest ${isAuthenticating ? 'opacity-50' : authMode === 'forgot' ? 'bg-amber-950/40 border border-amber-800 text-amber-400 hover:bg-amber-900/60' : 'bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60'}`}>
              {isAuthenticating ? 'PROCESSANDO...' : authMode === 'login' ? 'ACESSAR MENTORIA' : authMode === 'register' ? 'CADASTRAR CNPJ' : 'REDEFINIR ACESSO'}
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
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">{caixa <= 0 ? "O SEU CAIXA ZEROU" : "PROBLEMAS FISCAIS GRAVES"}</h1>
          <p className="text-slate-300 text-sm md:text-base font-light text-justify border-l-2 border-red-500 pl-4 mb-8">{feedback}</p>
          <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 text-red-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Recomeçar do Zero e Aprender</button>
        </div>
      </div>
    );
  }

  if (isDREOpen) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative font-sans overflow-y-auto">
        <div className="z-10 bg-[#0f172a]/95 p-6 md:p-10 rounded-3xl border border-cyan-900/50 max-w-3xl w-full shadow-2xl my-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-slate-100 uppercase tracking-widest">Painel de <span className="font-semibold text-cyan-400">Controle DRE</span></h1>
            <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase">Ajuste os botões da sua empresa e veja o impacto financeiro real da sua gestão.</p>
          </div>

          <div className="bg-[#020617]/50 rounded-xl border border-slate-800 overflow-hidden mb-6">
            <div className="grid grid-cols-2 text-[10px] font-mono uppercase text-slate-500 bg-slate-900/50 p-3 border-b border-slate-800">
               <div>Estrutura Financeira Mensal</div>
               <div className="text-right">Valor (R$)</div>
            </div>
            <div className="p-4 space-y-3 font-mono text-xs text-slate-300">
               <div className="flex justify-between items-center"><span className="text-cyan-400 font-bold">1. RECEITA BRUTA (Faturamento)</span><span className="font-bold">{formatBRL(dreReceita)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) Impostos (Simples Nacional)</span><span>{formatBRL(dreImpostos)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) CMV (Custo da Mercadoria)</span><span>{formatBRL(dreCMV)}</span></div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-800/50 text-amber-400 font-semibold"><span>3. MARGEM DE CONTRIBUIÇÃO</span><span>{formatBRL(dreReceita - dreImpostos - dreCMV)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500 mt-2"><span>(-) Custos Fixos Base (Aluguel, Luz)</span><span>{formatBRL(dreCustoFixoBase)}</span></div>
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-1 rounded"><span>(-) Seu Pró-labore</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-1 rounded"><span>(-) Marketing (Anúncios)</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-1 rounded"><span>(-) Taxas Bancárias / Maquininha</span><span>{formatBRL(dreTaxas)}</span></div>
               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${dreLucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">5. LUCRO LÍQUIDO (Caixa Gerado)</span>
                 <span>{dreLucroLiquido >= 0 ? '+' : ''}{formatBRL(dreLucroLiquido)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8 bg-[#020617]/30 p-5 rounded-xl border border-white/5">
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-emerald-400">Cortar/Aumentar Pró-Labore</span><span className="text-slate-400">{formatBRL(dreProLabore)}</span></div>
               <input type="range" min="0" max="15000" step="500" value={dreProLabore} onChange={(e) => setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-blue-400">Verba de Marketing (Ads)</span><span className="text-slate-400">{formatBRL(dreMarketing)}</span></div>
               <input type="range" min="0" max="5000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Taxas e Antecipação Bancária</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="4000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </div>
          <button onClick={handleAplicarDRE} className="w-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Aplicar DRE no Caixa e Voltar</button>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative"><div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div><h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Buscando dores do mercado...</h2></div>;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Caixa (Oxigênio)</span><span className={`text-xs font-bold font-mono ${caixa > 30000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${caixa > 20000 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Margem Real</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Saúde do CNPJ</span><span className={`text-xs font-bold font-mono ${compliance >= 80 ? 'text-purple-400' : 'text-amber-400'}`}>{compliance}%</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${compliance > 60 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${compliance}%` }}></div></div></div>
        </div>

        <header className="bg-[#0f172a]/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">Dono(a): <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">{currentLevel.title} — Fase de Mentoria</p></div>
            <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500" style={{ width: `${progressToNext}%` }}></div></div>
          </div>
        </header>

        {!feedback ? (
          <main className="bg-[#0f172a]/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4 mt-2">
              <div>
                <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold block mb-1">{currentScenario.sector}</span>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
              </div>
              <button onClick={handleConsultoria} disabled={showConsultoriaHint} className="bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/60 text-amber-500 text-[10px] font-mono tracking-widest uppercase py-2 px-4 rounded-lg transition-all disabled:opacity-50">
                💎 Consultoria com Pedro Monte (R$ 3.500)
              </button>
            </div>

            {showConsultoriaHint && (
              <div className="mb-6 bg-amber-950/20 border-l-2 border-amber-500 p-4 rounded-r-lg">
                <p className="text-amber-400 text-[11px] font-mono uppercase mb-1">Visão do Mentor (+25 XP):</p>
                <p className="text-slate-300 text-sm italic">"{currentScenario.consultoriaHint}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. O Choque de Realidade (Teoria)
                </h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>

              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/40">
                <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 2. O Problema na sua Mesa (A Prática)
                </h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify">{currentScenario.context}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">Quem tá te cobrando: <span className="text-slate-400">{currentScenario.character}</span></p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Tome uma decisão como Dono(a) agora:</h3>
              {currentScenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  disabled={isEvaluatingChoice}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left p-5 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2 text-justify">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          <div className="bg-[#0f172a]/60 p-8 md:p-12 rounded-2xl border border-white/5 text-center shadow-2xl">
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Boa Visão de Negócio' : 'Decisão Errada que Custou Caro'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {lastImpacts && (
              <div className="flex justify-center gap-8 mb-8 border-y border-white/5 py-6 bg-[#020617]/30">
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto no Caixa</p><p className={`font-mono text-lg font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p></div>
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto na Margem</p><p className={`font-mono text-lg font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p></div>
              </div>
            )}

            <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-3xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-cyan-400 font-mono border border-slate-700/50 rounded-md">Parecer do Mentor:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={proceedToNextQuestion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              Avançar para o Próximo Desafio
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={() => setIsDREOpen(true)} className="text-[9px] text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] font-bold">📊 Ajustar a DRE (Painel de Controle)</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Sair do Jogo</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Resetar CNPJ</button>
        </div>

      </div>
    </div>
  );
}