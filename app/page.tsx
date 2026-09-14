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

// --- CHAVE DE API DO GOOGLE GEMINI ---
const GEMINI_API_KEY = "AQ.Ab8RN6IlD5wf8Me0nDtLf1TJ_krl6vU760sU0yjFpfiSu3bMyw";

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

const playPromotionSound = () => {
  try {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch (err) {}
};

// --- CURVA DE MATURIDADE (Dono para Dono) ---
const levels = [
  { tier: 1, title: "Apagador de Incêndios", minXp: 0, hasTimer: false, feedback: null },
  { tier: 1, title: "Sobrevivente do Mês", minXp: 120, hasTimer: false, feedback: { forca: "Você tem garra e a empresa gira.", vulnerabilidade: "Mas a empresa não roda um dia sem você e o dinheiro some rápido." } },
  { tier: 2, title: "Chefe de Equipe", minXp: 280, hasTimer: false, feedback: { forca: "Começou a entender que faturamento não é lucro no bolso.", vulnerabilidade: "Ainda confunde a conta da Pessoa Física com a Jurídica (PF x PJ)." } },
  { tier: 2, title: "Gestor de Sobrevivência", minXp: 500, hasTimer: true, feedback: { forca: "O caixa parou de sangrar por besteira e o preço está mais real.", vulnerabilidade: "Falta capital de giro estruturado para parar de antecipar maquininha." } },
  { tier: 3, title: "Dono de Negócio", minXp: 800, hasTimer: true, feedback: { forca: "Você finalmente saiu do balcão e olha para o painel de controle.", vulnerabilidade: "Dependência perigosa de poucos clientes ou processos não documentados." } },
  { tier: 3, title: "Estrategista de Caixa", minXp: 1200, hasTimer: true, feedback: { forca: "Entende o Efeito Tesoura, domina prazos e tem fôlego financeiro.", vulnerabilidade: "A transição tributária pode comer a sua margem se não repassar." } },
  { tier: 4, title: "Diretor Executivo", minXp: 1800, hasTimer: true, feedback: { forca: "A empresa gera caixa livre, tem reserva e processos delegados.", vulnerabilidade: "O ego do crescimento rápido pode estourar o custo fixo de forma irreversível." } },
  { tier: 4, title: "Empresário de Elite", minXp: 2600, hasTimer: true, feedback: { forca: "O negócio é um ativo. O dinheiro trabalha e a equipe roda sozinha.", vulnerabilidade: "Manter a inovação e a disciplina financeira blindada." } }
];

// --- BANCO DE DADOS BLINDADO: AS 10 FASES DO PEQUENO NEGÓCIO ---
// Se a IA falhar (sem internet ou limite de API), o jogo carrega estas fases em ordem.
const fallbackScenarios = [
  {
    sector: "Sobrevivência Financeira", criticality: "Extrema", title: "A Síndrome do Caixa Único",
    theory: "O choque de realidade: Vender não é receber, e o saldo do banco hoje não é seu lucro. Misturar Pessoa Física (PF) e Pessoa Jurídica (PJ) mascara o custo fixo real. Se a empresa paga a escola do filho ou a parcela do seu carro, o CNPJ está sangrando e você não vê.",
    context: "Sexta-feira. A conta da empresa tem R$ 4.000, mas o vale dos funcionários amanhã soma R$ 6.000. Ao olhar o extrato, você percebe que passou R$ 3.500 no cartão da empresa com compras de supermercado e farmácia para sua casa nesta semana.",
    character: "Painel de Sinais Vitais",
    options: [
      { id: "A", text: "Injetar dinheiro pessoal de volta na empresa hoje, pagar os funcionários e definir um pró-labore austero a partir de agora.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou os bolsos, honrou a equipe e cortou o câncer financeiro." },
      { id: "B", text: "Pegar o limite rotativo da empresa (cheque especial) para cobrir o vale da equipe e não mexer no seu padrão de vida pessoal.", xp: -10, isBest: false, impacts: { caixa: 0, margem: -2.5, compliance: -10 }, feedback: "ILUSÃO. Você contraiu uma dívida cara na PJ para bancar um luxo na PF." },
      { id: "C", text: "Atrasar o pagamento da equipe justificando que 'as vendas da semana foram fracas'.", xp: -40, isBest: false, impacts: { caixa: -5000, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL E OPERACIONAL. Equipe desmotivada destrói o atendimento e gera passivo." }
    ]
  },
  {
    sector: "Capital de Giro", criticality: "Alta", title: "O Vício da Maquininha",
    theory: "Antecipar recebíveis não é fluxo de caixa, é agiotagem legalizada se não for precificada. Pagar 4% a 8% ao mês para ter o SEU dinheiro amanhã destrói completamente a Margem de Contribuição. Você trabalha só para enriquecer o banco.",
    context: "Você fechou uma venda de R$ 15.000 parcelada em 10x sem juros para um cliente. O boleto do fornecedor dessa mesma mercadoria vence na segunda-feira. Você não tem caixa livre.",
    character: "O Fluxo de Caixa",
    options: [
      { id: "A", text: "Ligar para o fornecedor, renegociar o prazo com sinceridade e lançar uma promoção relâmpago de outro produto via PIX à vista para levantar caixa.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA. Você preservou a margem da venda e esticou o prazo do seu passivo." },
      { id: "B", text: "Apertar o botão de antecipação da maquininha de cartão pagando 6% de taxa para ter o dinheiro na segunda.", xp: 0, isBest: false, impacts: { caixa: -1000, margem: -3.0, compliance: 0 }, feedback: "PALIATIVO CARO. O problema de sexta foi resolvido, mas a margem do mês foi pro ralo." },
      { id: "C", text: "Pagar o fornecedor com o limite do cartão de crédito da empresa, somando a taxa da maquininha com o juros do cartão.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -5.0, compliance: -20 }, feedback: "EFEITO BOLA DE NEVE. Dívida sobre dívida sem geração de valor." }
    ]
  },
  {
    sector: "Precificação e Custos", criticality: "Extrema", title: "O Preço do 'Achismo'",
    theory: "Copiar o preço do concorrente sem saber seu próprio custo fixo é como dirigir vendado. Se você vende por R$ 100 achando que ganha 50, mas esquece o imposto, a taxa do cartão, a embalagem e o frete grátis, você está pagando para o cliente levar o produto.",
    context: "O seu produto mais vendido custa R$ 80. O fornecedor avisou que amanhã o custo de compra sobe 15%. O seu vizinho (concorrente) vende o mesmo produto por R$ 75 e você tem medo de aumentar o preço e perder a clientela.",
    character: "O Seu Contador",
    options: [
      { id: "A", text: "Repassar o aumento para o preço final imediatamente, treinar a equipe para focar no valor (atendimento) e deixar os 'caçadores de preço' irem para o vizinho.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 2.0, compliance: 10 }, feedback: "VISÃO DE LUCRO. Faturamento é vaidade, lucro é sanidade. Melhor vender menos com margem do que muito com prejuízo." },
      { id: "B", text: "Manter o preço antigo absorvendo o custo temporariamente até ver se o mercado 'aceita' o aumento do concorrente.", xp: 5, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: 0 }, feedback: "MIOPIA. Você sangrou sua empresa por medo da reação do mercado." },
      { id: "C", text: "Baixar o preço para R$ 70 para quebrar o vizinho, apostando que vai 'ganhar no volume'.", xp: -50, isBest: false, impacts: { caixa: -15000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO FINANCEIRO. Vender com margem negativa em volume acelera a falência de forma irreversível." }
    ]
  },
  {
    sector: "Cobrança e Inadimplência", criticality: "Média", title: "O 'Fiado' do Cliente Parceiro",
    theory: "O pequeno empresário não é banco de quem não tem crédito. O medo de cobrar e 'ficar chato' transforma o lucro no papel em perda real. Se o cliente levou e não pagou no prazo, ele te usou como linha de crédito gratuita.",
    context: "Um dos seus clientes mais antigos, que sempre comprou muito, está devendo R$ 8.000 há 35 dias. Hoje ele ligou querendo fazer um novo pedido de R$ 5.000 para entregar na sexta-feira.",
    character: "O Calote",
    options: [
      { id: "A", text: "Travar o pedido com firmeza: 'Parceiro, preciso da quitação do título em aberto para faturar a nova remessa'. Assumir o risco de perder a venda.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 1.0, compliance: 15 }, feedback: "POSTURA DE DONO. Cliente que não paga não é cliente, é passivo. Você botou ordem na casa." },
      { id: "B", text: "Entregar o novo pedido e pedir 'pelo amor de Deus' para ele tentar depositar pelo menos uma parte da dívida antiga semana que vem.", xp: -5, isBest: false, impacts: { caixa: -5000, margem: -1.0, compliance: -10 }, feedback: "FRAQUEZA. Você ensinou ao cliente que ele pode te fazer de bobo." },
      { id: "C", text: "Descontar uma duplicata no banco para cobrir o buraco que ele deixou e entregar o novo pedido para não perder a amizade.", xp: -35, isBest: false, impacts: { caixa: -10000, margem: -3.0, compliance: -20 }, feedback: "A RECEITA DA QUEBRA. Tomou dívida com juros no seu nome para cobrir a inadimplência de um terceiro." }
    ]
  },
  {
    sector: "Gestão de Estoque", criticality: "Alta", title: "O Cemitério na Prateleira",
    theory: "Lucro no papel é ilusão; caixa é realidade. Dinheiro imobilizado em estoque que não gira (curva C) é capital de giro que apodrece. O 'desconto de volume' que o fornecedor deu só valeria a pena se você tivesse velocidade de venda.",
    context: "Você tem R$ 20.000 congelados no fundo da loja com uma mercadoria que comprou de impulso há 4 meses. Faltam R$ 6.000 para pagar o aluguel amanhã.",
    character: "O Boletim de Caixa",
    options: [
      { id: "A", text: "Fazer uma ação relâmpago queimando esse estoque a preço de custo (zero margem) para transformar papelão em dinheiro vivo hoje.", xp: 35, isBest: true, impacts: { caixa: 15000, margem: -0.5, compliance: 10 }, feedback: "ESTRATEGISTA. Você assumiu o erro da compra, engoliu o orgulho e salvou o fluxo de caixa." },
      { id: "B", text: "Manter o preço cheio, esperando o produto valorizar, e pegar dinheiro do seu bolso (PF) para pagar o aluguel da loja.", xp: 0, isBest: false, impacts: { caixa: -6000, margem: 0, compliance: -5 }, feedback: "A ILUSÃO. Sangrou o próprio patrimônio para sustentar um erro operacional." },
      { id: "C", text: "Comprar mais mercadoria nova usando o limite do cheque especial, para ver se atrai clientes que comprem a velha junto.", xp: -45, isBest: false, impacts: { caixa: -12000, margem: -4.0, compliance: -15 }, feedback: "FALÊNCIA. Estoque não paga aluguel. A dívida multiplicou e a prateleira continua cheia." }
    ]
  },
  {
    sector: "Estrutura Operacional", criticality: "Alta", title: "O Teto do Eu-preendedor",
    theory: "Se a sua empresa depende de você para atender o telefone, empacotar e cobrar, você não tem uma empresa, tem um emprego mal remunerado. Recusar-se a aumentar o custo fixo para contratar ajuda é o que trava a receita nos 50k.",
    context: "Sua receita estagnou. Você trabalha 14h por dia e está exausto. O WhatsApp da empresa demora 4 horas para ser respondido porque você está limpando a loja, resultando na perda de 10 clientes quentes por dia.",
    character: "A Balança de Crescimento",
    options: [
      { id: "A", text: "Assumir o risco: Contratar imediatamente um assistente, treinar por 15 dias e se liberar para focar apenas em estratégia e fechamento de vendas.", xp: 35, isBest: true, impacts: { caixa: -2500, margem: 2.5, compliance: 10 }, feedback: "SALTO DE MATURIDADE. O custo fixo subiu um pouco, mas sua receita vai decolar porque o dono voltou a liderar." },
      { id: "B", text: "Contratar um 'freelancer' barato e sem compromisso para responder mensagens só de noite, mantendo o controle total de dia.", xp: 5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "MEIA SOLUÇÃO. Não aliviou sua carga horária e a qualidade do atendimento despencou à noite." },
      { id: "C", text: "Continuar sozinho dizendo 'ninguém faz melhor que eu' e desligar o WhatsApp depois das 18h para conseguir dormir.", xp: -35, isBest: false, impacts: { caixa: -8000, margem: -3.0, compliance: 0 }, feedback: "A ESTAGNAÇÃO. Você aceitou que sua empresa nunca vai crescer além do seu cansaço físico." }
    ]
  },
  {
    sector: "Gestão de Vaidade", criticality: "Extrema", title: "A Ilusão do Crescimento",
    theory: "Pico de faturamento não é consolidação. Aumentar a despesa fixa estrutural (aluguel caro, carros) baseado em um trimestre bom é o atalho número um para a morte de pequenas empresas quando a sazonalidade ataca.",
    context: "A empresa teve lucro recorde por três meses consecutivos. Sobraram R$ 35.000 no caixa. Você sempre sonhou em reformar a fachada e comprar uma caminhonete pelo CNPJ para 'passar mais credibilidade'.",
    character: "O Seu Próprio Ego",
    options: [
      { id: "A", text: "Travar o ego: Pegar R$ 25.000 e aplicar em liquidez diária como Fundo de Reserva, usando o resto apenas para marketing digital testado.", xp: 40, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 20 }, feedback: "CABEÇA DE CEO. Você entendeu que caixa forte é a única proteção contra crises futuras. O ego ficou para depois." },
      { id: "B", text: "Gastar os R$ 35.000 na reforma da fachada à vista e adiar a formação da reserva de emergência para o ano que vem.", xp: -10, isBest: false, impacts: { caixa: -30000, margem: 0, compliance: -5 }, feedback: "PERIGO. A loja ficou linda, mas a empresa ficou completamente descapitalizada para o mês fraco." },
      { id: "C", text: "Dar R$ 35.000 de entrada em uma caminhonete de luxo assumindo 48 parcelas fixas altas em nome do CNPJ.", xp: -50, isBest: false, impacts: { caixa: -35000, margem: -4.0, compliance: -20 }, feedback: "O ABISMO. Trocou capital de giro vital por um passivo depreciável que consome manutenção e sufoca o fluxo mensal." }
    ]
  },
  {
    sector: "Estratégia Tributária", criticality: "Alta", title: "O Nocaute do IVA Dual (B2B)",
    theory: "A Reforma Tributária atinge em cheio o pequeno que fornece para os grandes. Se você está no Simples e não repassa os créditos do novo IVA (CBS/IBS), seu produto fica matematicamente mais caro para a indústria, que vai preferir comprar de empresas do Lucro Real.",
    context: "O seu maior cliente empresarial, que representa 30% do faturamento, envia um aviso: 'Com as regras do IVA, precisamos que você recolha o imposto por fora do Simples para nos repassar o crédito, senão encerramos o contrato.'",
    character: "Setor de Suprimentos do Cliente",
    options: [
      { id: "A", text: "Chamar o contador hoje. Optar pelo recolhimento por fora, repassar o crédito ao cliente e fazer uma renegociação leve do contrato para ajustar a margem.", xp: 40, isBest: true, impacts: { caixa: 10000, margem: 1.0, compliance: 20 }, feedback: "VISÃO DE MERCADO. Você não brigou com a lei, se adaptou a ela e manteve seu principal ativo (o contrato)." },
      { id: "B", text: "Para não complicar a contabilidade, dar 10% de desconto no preço final tentando convencer o cliente a ficar sem o repasse do crédito.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: 0 }, feedback: "TIRO NO PÉ. O desconto saiu direto do seu lucro limpo. Você pagou para trabalhar." },
      { id: "C", text: "Ignorar a exigência achando que 'o Simples protege a pequena empresa' e que o cliente está apenas blefando.", xp: -50, isBest: false, impacts: { caixa: -18000, margem: -5.0, compliance: -15 }, feedback: "A QUEDA. O cliente cumpriu a promessa e foi embora. Sua receita despencou 30% da noite para o dia." }
    ]
  },
  {
    sector: "Precificação e Custos", criticality: "Média", title: "A Cegueira do Custo Fixo",
    theory: "Muitos empreendedores têm medo de reajustar preços. Enquanto a inflação aumenta aluguel, energia, dissídio e combustível silenciosamente, o preço congelado espreme o lucro até ele desaparecer completamente.",
    context: "Seus custos fixos aumentaram 18% nos últimos 12 meses. Seu cardápio/tabela de serviços é o mesmo do ano passado. O balanço do mês fechou no zero a zero pelo segundo mês seguido.",
    character: "Sinal de Alerta da Margem",
    options: [
      { id: "A", text: "Mapear todos os custos, repassar o reajuste imediato de 15% na tabela, melhorar a apresentação do serviço e focar em clientes menos sensíveis a preço.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 2.5, compliance: 10 }, feedback: "CORAGEM DE DONO. Reajustar é proteger a vida da empresa. Melhor faturar o mesmo com clientes que pagam mais." },
      { id: "B", text: "Fazer cortes drásticos na qualidade dos insumos (comprar mais barato) para tentar manter o preço de venda antigo e não assustar ninguém.", xp: -15, isBest: false, impacts: { caixa: 0, margem: -1.0, compliance: -15 }, feedback: "PERDA DE VALOR. A qualidade caiu, as reclamações aumentaram e os bons clientes foram embora." },
      { id: "C", text: "Ignorar o problema e dobrar o investimento em anúncios (Ads) para tentar vender o dobro no volume e 'compensar' a margem menor.", xp: -40, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -10 }, feedback: "ACELERAR PRO BURACO. Vender mais com margem espremida só aumenta o cansaço e quebra o caixa mais rápido." }
    ]
  },
  {
    sector: "Planejamento Tributário", criticality: "Alta", title: "O Salto Tributário (A Trava do MEI/Simples)",
    theory: "O medo de desenquadrar a empresa de faixa tributária faz o empreendedor se boicotar. Segurar o faturamento ou emitir nota 'fria' para não sair do limite é pensar pequeno e arriscar processo criminal.",
    context: "Novembro. A sua empresa atingiu 98% do limite de faturamento anual do MEI (ou da 1ª faixa do Simples). Há pedidos grandes engatilhados para o fim do ano que fariam a empresa dobrar de tamanho.",
    character: "O Limite da Receita Federal",
    options: [
      { id: "A", text: "Aceitar os pedidos, oficializar o desenquadramento com o contador de cabeça erguida, precificar a nova carga tributária e abraçar o crescimento.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.5, compliance: 25 }, feedback: "O PASSAPORTE DO CRESCIMENTO. Pagar mais imposto sobre muito lucro é infinitamente melhor do que não crescer para economizar trocados." },
      { id: "B", text: "Parar de vender em novembro, dar férias coletivas e só voltar a operar em janeiro para não estourar o limite do ano.", xp: -20, isBest: false, impacts: { caixa: -12000, margem: -2.0, compliance: 0 }, feedback: "MENTALIDADE DE ESCASSEZ. Travou o CNPJ, frustrou clientes e perdeu o melhor mês de vendas do ano." },
      { id: "C", text: "Vender os pedidos grandes aceitando pagamento apenas em dinheiro vivo (sem nota fiscal) para maquiar o faturamento oficial.", xp: -50, isBest: false, impacts: { caixa: 10000, margem: -3.0, compliance: -50 }, feedback: "CRIME DE SONEGAÇÃO FISCAL. Cruzamento de dados bancários acusa a fraude e gera multas que fecham a empresa." }
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
  const [showDRE, setShowDRE] = useState(false);

  // --- MOTOR IA DE DONO PARA DONO ---
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [supplementaryComment, setSupplementaryComment] = useState(""); 
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);

  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(120);
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotedLevel, setPromotedLevel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { playerName, phone: telefone, email: email.toLowerCase(), companyName, xp, caixa, margem, compliance, currentStage, showDRE }
      });
    } catch (e) {
      console.error("Erro no Data Center: ", e);
    }
  };

  useEffect(() => { setIsLoading(false); }, []);
  useEffect(() => { if (gameStarted && !isGameOver) saveToDB(); }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);

  // --- BUSCA DO CENÁRIO FOCADA NAS 10 FASES BLINDADAS ---
  const fetchScenarioFromAI = async (stageNum: number) => {
    setIsGeneratingScenario(true);
    setFeedback(null);
    setSupplementaryComment("");
    setTimeLeft(120);

    const promptText = `Você é Pedro Monte, mentor implacável de pequenos negócios. Gere um Estudo de Caso Prático INÉDITO para a Fase ${stageNum + 1} de 10. A empresa ${companyName} tem Caixa R$ ${caixa}. Nível do aluno: ${currentLevel.title}. 
    MUITO IMPORTANTE: Não use jargões financeiros (sem WACC, IFRS, etc). Fale de fluxo de caixa, estoque, precificação ou mistura de contas (PFxPJ). Dê um 'choque de realidade' no texto teórico.
    Retorne APENAS JSON sem formatação markdown: { "sector": "Problema", "criticality": "Alta", "title": "Título", "theory": "Choque de realidade do mentor (min 5 linhas)...", "context": "Problema tenso na empresa hoje...", "character": "Quem cobra", "options": [ { "id": "A", "text": "Atitude de Dono...", "xp": 35, "isBest": true, "impacts": { "caixa": 5000, "margem": 1.5, "compliance": 10 }, "feedback": "Elogio..." }, { "id": "B", "text": "Ação fraca...", "xp": 5, "isBest": false, "impacts": { "caixa": -1000, "margem": -0.5, "compliance": 0 }, "feedback": "Crítica leve..." }, { "id": "C", "text": "Decisão que acelera a quebra...", "xp": -40, "isBest": false, "impacts": { "caixa": -8000, "margem": -4.0, "compliance": -25 }, "feedback": "Crítica dura..." } ] }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: 0.95 } })
      });

      if (!response.ok) throw new Error("API Limit");

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      
      // EXTRATOR SEGURO
      aiText = aiText.replace(new RegExp("```json", "g"), "").replace(new RegExp("```", "g"), "").trim();
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Sem JSON");
      
      const parsedScenario = JSON.parse(jsonMatch[0]);
      parsedScenario.options = shuffleArray(parsedScenario.options);
      setCurrentScenario(parsedScenario);
      
    } catch (error) {
      console.warn("API Offline. Carregando Fallback Blindado das 10 Dores.");
      // Mapeia o banco fixo para GARANTIR a evolução nas 10 fases sem loop!
      const fallbackIndex = stageNum % fallbackScenarios.length;
      const selectedFallback = JSON.parse(JSON.stringify(fallbackScenarios[fallbackIndex])); 
      selectedFallback.title = `${selectedFallback.title} — Fase ${stageNum + 1}`; 
      selectedFallback.options = shuffleArray(selectedFallback.options);
      setCurrentScenario(selectedFallback);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !showDRE && !currentScenario && !isGeneratingScenario) {
      fetchScenarioFromAI(currentStage);
    }
  }, [gameStarted, currentStage, showDRE]);

  // --- AVALIAÇÃO DO COMENTÁRIO COMPLEMENTAR (MENTORIA) ---
  const handleOptionSelectWithComment = async (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    let finalXp = selectedOption.xp;
    let finalImpacts = { ...selectedOption.impacts };
    let bonusMessage = "";

    if (supplementaryComment.trim()) {
      try {
        const promptEval = "O dono escolheu a ação '" + selectedOption.text + "'. Comentário dele: '" + supplementaryComment + "'. Avalie a postura de dono. Retorne APENAS JSON: { \"isAssertive\": true/false, \"bonusXp\": 15, \"commentEvaluation\": \"Feedback reto de dono para dono.\" }";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptEval }] }], generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        aiText = aiText.replace(new RegExp("```json", "g"), "").replace(new RegExp("```", "g"), "").trim();
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        
        if(jsonMatch){
           const evaluation = JSON.parse(jsonMatch[0]);
           if (evaluation.isAssertive) {
             finalXp += evaluation.bonusXp;
             bonusMessage = `\n\n⭐ BÔNUS DO MENTOR: Visão validada (+${evaluation.bonusXp} XP).\nAnálise: ${evaluation.commentEvaluation}`;
           } else {
             bonusMessage = `\n\n💡 ALERTA DO MENTOR: ${evaluation.commentEvaluation}`;
           }
        }
      } catch (e) {}
    }

    const fullFeedback = `${selectedOption.feedback}${bonusMessage}\n\nCÓDIGO AZUL.`;
    handleChoice(finalXp, fullFeedback, false, finalImpacts);
    setIsEvaluatingChoice(false);
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
            setShowDRE(d.showDRE || false);
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
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 45000, margem: 18.0, compliance: 100, currentStage: 0, showDRE: false }
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
    setNeedsCompanySetup(false); setCurrentScenario(null); setTimeLeft(120); 
    setGameStarted(true); setIsGameOver(false); setShowDRE(false);
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false); setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setPromotionPending(false); setIsGameOver(false); setShowDRE(false); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Você vai zerar seu CNPJ e reiniciar sua jornada. Confirma?")) {
      setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null);
      setFeedback(null); setPromotionPending(false); setIsGameOver(false); setLastImpacts(null); setShowDRE(false); 
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
    }
  };

  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  useEffect(() => {
    if (!gameStarted || feedback || promotionPending || isGameOver || showDRE || !currentScenario || isGeneratingScenario || isEvaluatingChoice || !currentLevel.hasTimer || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, feedback, promotionPending, isGameOver, showDRE, currentScenario, isGeneratingScenario, isEvaluatingChoice, timeLeft, currentLevel.hasTimer]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && !promotionPending && !isGameOver && !showDRE && currentScenario && gameStarted && currentLevel.hasTimer && !isEvaluatingChoice) {
      handleChoice(-15, "TEMPO ESGOTADO. O dia virou e os boletos venceram por falta de decisão sua.", true, { caixa: -2500, margem: -1.5, compliance: -10 });
    }
  }, [timeLeft, feedback, promotionPending, isGameOver, showDRE, currentScenario, gameStarted, currentLevel.hasTimer, isEvaluatingChoice]);

  const handleChoice = (baseXpGained: number, feedbackText: string, isTimeout: boolean = false, impacts: any = null) => {
    if (isEvaluatingChoice || isGameOver) return;

    let bonus = 0;
    if (baseXpGained > 0 && !isTimeout && currentLevel.hasTimer) {
      if (timeLeft >= 80) bonus = 5; else if (timeLeft >= 40) bonus = 2;
    }
    
    const totalXpGained = baseXpGained + bonus;
    const newXp = Math.max(0, xp + totalXpGained);
    
    let newCaixa = caixa; let newMargem = margem; let newCompliance = compliance;
    if (impacts) {
      newCaixa = Math.max(0, caixa + impacts.caixa);
      newMargem = margem + impacts.margem;
      newCompliance = Math.min(100, Math.max(0, compliance + impacts.compliance));
    }

    setCaixa(newCaixa); setMargem(newMargem); setCompliance(newCompliance);
    setXp(newXp); setLastXpChange(totalXpGained); setLastImpacts(impacts);

    if (newCaixa <= 0) { setIsGameOver(true); setFeedback("CNPJ NEGATIVADO. Seu fluxo de caixa zerou completamente. A empresa quebrou."); return; }
    if (newCompliance <= 0) { setIsGameOver(true); setFeedback("FECHAMENTO FISCAL. Problemas tributários e processos paralisaram o negócio."); return; }

    const newCalculatedLevel = [...levels].reverse().find(l => newXp >= l.minXp) || levels[0];
    if (newCalculatedLevel.minXp > currentLevel.minXp) {
      setPromotionPending(true); setPromotedLevel(newCalculatedLevel);
    }
    setFeedback(feedbackText);
  };

  const proceedToNextQuestion = () => {
    setPromotionPending(false); setPromotedLevel(null); setFeedback(null); setLastXpChange(null); setLastImpacts(null); setSupplementaryComment("");
    if (currentStage < 9) { 
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage); 
      setCurrentScenario(null); 
      fetchScenarioFromAI(nextStage);
    } else { setShowDRE(true); }
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) { setFeedback(null); playPromotionSound(); return; }
    proceedToNextQuestion();
  };

  const handleStartNewQuarter = () => { setShowDRE(false); setCurrentStage(0); fetchScenarioFromAI(0); };

  const caixaBarFill = Math.min(100, (caixa / 100000) * 100);
  const margemBarFill = Math.min(100, Math.max(0, (margem / 40.0) * 100));

  if (isLoading) return <div className="min-h-screen bg-[#060c17] flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm">Abrindo o Caixa...</div>;

  if (needsCompanySetup) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="z-10 bg-[#0f172a]/80 backdrop-blur-2xl p-10 rounded-2xl border border-cyan-500/30 max-w-md w-full text-center">
          <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-2">Mentalidade Empreendedora</h2>
          <h1 className="text-2xl font-light text-slate-100 mb-8 tracking-wide">Registro do <span className="font-semibold text-cyan-400">CNPJ</span></h1>
          <form onSubmit={handleCompanySubmit} className="space-y-5">
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Nome do seu Negócio</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome (O Dono)</label><input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
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

            <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Seu E-mail Principal</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
            
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

  if (showDRE) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative font-sans">
        <div className="z-10 bg-[#0f172a]/90 p-8 md:p-12 rounded-3xl border border-white/5 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 uppercase">Fechamento do Mês</h1>
          <div className="bg-[#020617]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left space-y-4 font-mono">
            <div className="flex justify-between border-b border-slate-800/80 pb-2"><span className="text-slate-500 text-xs">Saldo do Caixa:</span><span className="text-slate-300 text-xs">{formatBRL(caixa)}</span></div>
            <div className="flex justify-between pt-2"><span className="text-slate-500 text-xs">Evolução do Dono:</span><span className="text-cyan-400 text-xs font-bold">{xp} Pontos de XP</span></div>
          </div>
          <button onClick={handleStartNewQuarter} className="bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Virar o Mês</button>
        </div>
      </div>
    );
  }

  if (promotionPending && !feedback) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative">
        <div className="z-10 bg-[#0f172a]/80 p-8 md:p-12 rounded-3xl border border-white/5 max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">Maturidade Desbloqueada</h1>
          <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-slate-800 mb-8 text-left">
            <span className="text-cyan-400 text-xl font-semibold">🏆 {promotedLevel?.title}</span>
            {promotedLevel?.feedback && (
               <div className="mt-4 border-t border-slate-700/50 pt-4">
                 <p className="text-emerald-400 text-[10px] uppercase font-mono mb-1">Evolução de Gestão:</p>
                 <p className="text-slate-300 text-xs mb-3">{promotedLevel.feedback.forca}</p>
                 <p className="text-amber-400 text-[10px] uppercase font-mono mb-1">Atenção no Radar:</p>
                 <p className="text-slate-300 text-xs">{promotedLevel.feedback.vulnerabilidade}</p>
               </div>
            )}
          </div>
          <button onClick={proceedToNextQuestion} className="bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-mono py-3.5 px-10 rounded-xl uppercase">Continuar Operando</button>
        </div>
      </div>
    );
  }

  if (isGeneratingScenario || !currentScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative">
        <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Analisando as finanças da {companyName}...</h2>
      </div>
    );
  }

  const timerColor = timeLeft > 60 ? 'bg-cyan-500' : timeLeft > 30 ? 'bg-amber-500' : 'bg-red-500';

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
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">O Dono: <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">{currentLevel.title} — Desafio {currentStage + 1}/10</p></div>
            <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500" style={{ width: `${progressToNext}%` }}></div></div>
          </div>
        </header>

        {!feedback ? (
          <main className="bg-[#0f172a]/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            {currentLevel.hasTimer && (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#020617] rounded-t-2xl"><div className={`h-full ${timerColor} transition-all`} style={{ width: `${(timeLeft / 120) * 100}%` }}></div></div>
            )}

            <div className="mb-6 border-b border-white/5 pb-4 mt-2">
              <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold block mb-1">{currentScenario.sector}</span>
              <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. O Choque de Realidade (Mentoria)
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

            <div className="mb-6 bg-[#020617]/30 p-5 rounded-xl border border-slate-800">
              <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                ⭐ Mentoria (Opcional) — Justifique sua atitude de dono e ganhe BÔNUS se a tese for boa:
              </label>
              <textarea
                disabled={isEvaluatingChoice}
                value={supplementaryComment}
                onChange={(e) => setSupplementaryComment(e.target.value)}
                placeholder="Qual o seu racional para resolver isso?..."
                className="w-full bg-[#020617]/70 border border-slate-700/60 rounded-lg p-3 text-xs text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans transition-all resize-none h-20"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Tome uma decisão agora:</h3>
              {currentScenario.options.map((option: any, index: number) => (
                <button
                  key={index}
                  disabled={isEvaluatingChoice}
                  onClick={() => handleOptionSelectWithComment(option)}
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

            <button onClick={handleNextStageOrPromotion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              {promotionPending ? "Avançar sua Maturidade Empreendedora" : "Encarar Próximo Desafio"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Sair do Jogo</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Resetar CNPJ</button>
        </div>

      </div>
    </div>
  );
}