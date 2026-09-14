"use client";

import { useState, useEffect, useRef } from "react";
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
  { tier: 3, title: "Dono de Negócio", minXp: 800, hasTimer: true, feedback: { forca: "Você finalmente saiu do balcão e olha para o painel de controle.", vulnerabilidade: "Dependência perigosa de poucos clientes grandes." } },
  { tier: 3, title: "Estrategista de Caixa", minXp: 1200, hasTimer: true, feedback: { forca: "Entende o Efeito Tesoura, domina prazos e tem fôlego financeiro.", vulnerabilidade: "A transição tributária pode comer a sua margem se não repassar." } },
  { tier: 4, title: "Diretor Executivo", minXp: 1800, hasTimer: true, feedback: { forca: "A empresa gera caixa livre, tem reserva e processos delegados.", vulnerabilidade: "O ego do crescimento rápido pode estourar o custo fixo." } },
  { tier: 4, title: "Empresário de Elite", minXp: 2600, hasTimer: true, feedback: { forca: "O negócio é um ativo. O dinheiro trabalha e a equipe roda sozinha.", vulnerabilidade: "Manter a inovação e a disciplina financeira blindada." } }
];

// --- AS 40 DORES DO CAMPO DE BATALHA ---
const businessPains: Record<number, string[]> = {
  1: [
    "O Assalto ao Próprio Caixa: Pagar escola do filho e mercado na conta PJ.",
    "O Preço do Achismo: Copiar o preço do vizinho esquecendo taxa de maquininha e imposto.",
    "A Ilusão do Desconto: Dar 15% de desconto por medo de perder a venda e trabalhar de graça.",
    "O Fornecedor Amigão: Comprar o dobro do que precisa só pelo prazo longo.",
    "O Salário de Sobras: Tirar o que sobra no fim do mês sem ter pró-labore definido.",
    "O Vício de Antecipar: Apertar o botão da maquininha sexta-feira e pagar 4% ao mês.",
    "O Cliente Sanguessuga: O cliente que compra pouco, chora preço e gasta todo seu tempo.",
    "A Dívida da Sexta: Esquecer de provisionar dinheiro para folha, férias ou 13º.",
    "Frete Grátis Cego: Oferecer entrega grátis sem calcular custo do motoboy ou correios.",
    "Desorganização Básica: Pagar multas de boletos (luz, imposto) só porque perdeu o vencimento."
  ],
  2: [
    "A Síndrome de Robin Hood: Vergonha de cobrar cliente amigo que atrasou o fiado/boleto.",
    "O Cemitério na Prateleira: Dinheiro imobilizado em estoque que não gira há 90 dias.",
    "O Efeito Tesoura: Vender em 6x para o cliente, mas pagar o fornecedor à vista.",
    "Contratação por Desespero: Colocar um parente sem treino no atendimento e perder vendas.",
    "A Batalha dos Centavos: Entrar em guerra de preço com loja gigante em vez de focar em valor.",
    "O Dinheiro Invisível: Não fazer conciliação para checar se o cartão realmente pagou.",
    "Risco Trabalhista Ingênuo: Ter funcionário sem contrato cumprindo horário fixo.",
    "Falsa Ferramenta Milagrosa: Pagar software caro que a equipe não usa e não alimenta.",
    "O Blefe do Representante: Comprar lançamento sem validar se o seu público quer.",
    "Demissão de Cliente: Falta de coragem de cortar um cliente que dá lucro zero."
  ],
  3: [
    "O Teto de Vidro do Dono: Recusar aumentar custo fixo para contratar ajuda, travando o negócio.",
    "Cegueira do Custo Fixo: Aluguel e luz sobem, mas o preço de venda não é reajustado.",
    "Risco de Concentração: Descobrir que 40% da receita depende de um único cliente.",
    "A Trava do Simples/MEI: Medo de vender mais para não pular de faixa tributária.",
    "Armadilha do Ponto Físico: Gastar o caixa em reforma antes de ter reserva de emergência.",
    "O Funcionário Estrela: Vendedor pede aumento irreal ameaçando levar os clientes.",
    "A Máquina Quebrada: Falta de fundo de depreciação para repor equipamento vital.",
    "Crise de Reputação: Uma avaliação mentirosa no Google que começa a espantar clientes.",
    "Fuga de Inteligência: Braço direito pede demissão para abrir concorrência na mesma rua.",
    "Antecipação Estratégica: Usar caixa forte para comprar à vista com bom desconto."
  ],
  4: [
    "O Nocaute da Reforma Tributária: Cliente grande exige repasse de crédito de IVA, senão cancela contrato.",
    "A Armadilha do Ego: Faturar bem 3 meses e querer financiar um SUV de luxo no CNPJ.",
    "A Concorrência Sonegadora: Vizinho não paga imposto e afunda preço. Como reagir sem sonegar?",
    "O Canto da Sereia da Filial: Querer abrir a loja 2 antes da loja 1 rodar sem você.",
    "O Contrato Lobo/Cordeiro: Multinacional exige exclusividade mas zera sua margem.",
    "O Fundo de Guerra: Lucro acumulado: distribuir como dividendo ou investir em expansão segura?",
    "A Sucessão Silenciosa: Você sofre um acidente leve e fica 20 dias fora. Quem assina os cheques?",
    "Guerra de Talentos: Como usar PLR e metas para reter gerente sem ter que dar sociedade.",
    "Risco do Crescimento a Prazo: Vender R$ 80k parcelado e asfixiar a necessidade de capital de giro.",
    "O Salto Tributário Real: Hora de calcular se o Simples ainda compensa vs Lucro Presumido."
  ]
};

// Fallback de segurança simplificado e focado
const safetyFallback = {
  sector: "Sinais Vitais", criticality: "Extrema", title: "O Apagão no Caixa",
  theory: "O choque de realidade: Vender não é receber, e faturamento não é lucro. A falta de acompanhamento diário do fluxo de caixa transforma qualquer imprevisto em ameaça de falência imediata no pequeno negócio.",
  context: "Sexta-feira, 16h. O fornecedor avisou que só descarrega a mercadoria mediante PIX à vista, mas o dinheiro da conta foi usado ontem para pagar contas pessoais do dono.",
  character: "A Realidade do Banco",
  options: [
    { id: "A", text: "Devolver o dinheiro pessoal para a PJ hoje, pagar o fornecedor e blindar a conta empresa.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou os bolsos e manteve a roda girando." },
    { id: "B", text: "Pegar limite rotativo do cheque especial para cobrir o fornecedor.", xp: -10, isBest: false, impacts: { caixa: 0, margem: -2.5, compliance: -10 }, feedback: "MIOPIA. Dívida cara para pagar despesa pessoal disfarçada." },
    { id: "C", text: "Cancelar a entrega da mercadoria e ficar sem produto para vender no fim de semana.", xp: -40, isBest: false, impacts: { caixa: -8000, margem: -5.0, compliance: -20 }, feedback: "DESASTRE. Você quebrou a esteira de vendas do fim de semana." }
  ]
};

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
  
  // Controle de dores já sorteadas para não repetir
  const [usedPains, setUsedPains] = useState<string[]>([]);

  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { playerName, phone: telefone, email: email.toLowerCase(), companyName, xp, caixa, margem, compliance, currentStage, showDRE, usedPains }
      });
    } catch (e) {
      console.error("Erro no Data Center: ", e);
    }
  };

  useEffect(() => { setIsLoading(false); }, []);
  useEffect(() => { if (gameStarted && !isGameOver) saveToDB(); }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE, usedPains]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);

  // --- BUSCA DO CENÁRIO FOCADA NAS 40 DORES ---
  const fetchScenarioFromAI = async () => {
    if (isGeneratingScenario) return;
    setIsGeneratingScenario(true);
    setFeedback(null);
    setSupplementaryComment("");
    setTimeLeft(120);

    // 1. Identificar o tier atual (1 a 4)
    const tier = currentLevel.tier as 1 | 2 | 3 | 4;
    
    // 2. Pegar a lista de dores desse tier
    const availablePains = businessPains[tier].filter(pain => !usedPains.includes(pain));
    
    // Se esgotar as 10 do tier atual, reseta o histórico (dificilmente ocorre em 10 rodadas)
    let selectedPain = "";
    if (availablePains.length === 0) {
      selectedPain = businessPains[tier][Math.floor(Math.random() * businessPains[tier].length)];
    } else {
      selectedPain = availablePains[Math.floor(Math.random() * availablePains.length)];
      setUsedPains(prev => [...prev, selectedPain]);
    }

    const promptText = `Você é Pedro Monte, mentor implacável de donos de pequenos negócios. Gere um Estudo de Caso Prático inédito para o aluno (Empresa: ${companyName}, Nível atual: ${currentLevel.title}, Caixa: R$ ${caixa}).
    REGRA DE OURO (Obrigatório): O cenário DEVE ser exclusivamente sobre a seguinte dor: "${selectedPain}".
    DIRETRIZES DE ESTILO: Zero jargões corporativos (sem "WACC", "IFRS", etc). Use linguagem de 'dono para dono', dando um choque de realidade. 
    Retorne APENAS um JSON estrito, sem markdown, com esta estrutura:
    { "sector": "Tema do Problema", "criticality": "Alta/Extrema", "title": "Título de Impacto", "theory": "Explicação do erro/conceito que quebra a empresa nessa dor (mínimo 5 linhas de choque de realidade)...", "context": "O problema estourando hoje na mesa do dono...", "character": "Quem cobra a atitude (Fornecedor, Contador, Cliente, O Próprio Caixa)", "options": [ { "id": "A", "text": "Atitude de Dono que resolve a raiz...", "xp": 35, "isBest": true, "impacts": { "caixa": 5000, "margem": 1.5, "compliance": 10 }, "feedback": "Parecer do mentor (elogio à atitude de dono)..." }, { "id": "B", "text": "Decisão paliativa ou fraca...", "xp": 5, "isBest": false, "impacts": { "caixa": -1000, "margem": -0.5, "compliance": 0 }, "feedback": "Parecer do mentor (crítica à falta de postura)..." }, { "id": "C", "text": "Decisão que acelera a quebra...", "xp": -40, "isBest": false, "impacts": { "caixa": -8000, "margem": -4.0, "compliance": -25 }, "feedback": "Parecer do mentor (sinalizando a falência próxima)..." } ] }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: 0.85 } })
      });

      if (!response.ok) throw new Error("API Limit");

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Sem JSON válido.");
      
      const parsedScenario = JSON.parse(jsonMatch[0]);
      parsedScenario.options = shuffleArray(parsedScenario.options);
      
      setCurrentScenario(parsedScenario);
    } catch (error) {
      console.warn("API Offline. Fallback carregado.");
      let fallback = JSON.parse(JSON.stringify(safetyFallback));
      fallback.options = shuffleArray(fallback.options);
      setCurrentScenario(fallback);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !showDRE && !currentScenario && !isGeneratingScenario) {
      fetchScenarioFromAI();
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
        const promptEval = `Você é Pedro Monte, mentor de negócios. O dono escolheu a ação '${selectedOption.text}'. Comentário/Tese dele: '${supplementaryComment}'. Avalie a visão de dono dele. Retorne APENAS JSON: { "isAssertive": true/false, "bonusXp": 15, "commentEvaluation": "Feedback reto e direto ao ponto." }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptEval }] }], generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if(jsonMatch){
           const evaluation = JSON.parse(jsonMatch[0]);
           if (evaluation.isAssertive) {
             finalXp += evaluation.bonusXp;
             bonusMessage = `\n\n⭐ BÔNUS DO MENTOR: Visão de dono validada (+${evaluation.bonusXp} XP).\nAnálise: ${evaluation.commentEvaluation}`;
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
            setUsedPains(d.usedPains || []);
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
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 45000, margem: 18.0, compliance: 100, currentStage: 0, showDRE: false, usedPains: [] }
          });
          setPlayerName(nome.trim()); setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
          setCurrentStage(0); setUsedPains([]);
          setPlayerNameInput(nome.trim()); setNeedsCompanySetup(true);
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
    if (confirm("Você vai zerar seu CNPJ e reiniciar sua jornada empreendedora. Confirma?")) {
      setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setUsedPains([]);
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
      setCurrentStage(prev => prev + 1); 
      setCurrentScenario(null); 
    } else { setShowDRE(true); }
  };

  const handleNextStageOrPromotion = () => {
    if (promotionPending) { setFeedback(null); playPromotionSound(); return; }
    proceedToNextQuestion();
  };

  const handleStartNewQuarter = () => { setShowDRE(false); setCurrentStage(0); setCurrentScenario(null); };

  // Barras HUD base 100k
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
                 <p className="text-emerald-400 text-[10px] uppercase font-mono mb-1">Avanço:</p>
                 <p className="text-slate-300 text-xs mb-3">{promotedLevel.feedback.forca}</p>
                 <p className="text-amber-400 text-[10px] uppercase font-mono mb-1">Ponto de Atenção:</p>
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