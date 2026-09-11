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

// --- CURVA DE CARREIRA ---
const levels = [
  { tier: 1, title: "Estagiário", minXp: 0, hasTimer: false, feedback: null },
  { tier: 1, title: "Assistente Financeiro", minXp: 120, hasTimer: false, feedback: { forca: "Execução metódica de conciliações e rotinas de contas a pagar/receber.", vulnerabilidade: "Sua leitura ainda é de curto prazo (regime de caixa). É preciso absorver o impacto das obrigações futuras." } },
  { tier: 2, title: "Analista Financeiro Jr.", minXp: 280, hasTimer: false, feedback: { forca: "Domínio dos fluxos de tesouraria e identificação ágil de descasamentos.", vulnerabilidade: "Falta visão de estrutura de custos indiretos, provisões e impacto tributário na precificação." } },
  { tier: 2, title: "Analista Financeiro Pleno", minXp: 500, hasTimer: true, feedback: { forca: "Análise consistente de margem de contribuição, Custeio ABC e sensibilidade de caixa.", vulnerabilidade: "Planejamento orçamentário plurianual e projeção de impactos macroeconômicos." } },
  { tier: 3, title: "Business Partner / Analista Sr.", minXp: 800, hasTimer: true, feedback: { forca: "Ponte estratégica entre comercial, RH corporativo e diretoria financeira.", vulnerabilidade: "Conhecimento avançado de CPCs complexos, auditoria atuária e proteção cambial estrutural." } },
  { tier: 3, title: "Controller", minXp: 1200, hasTimer: true, feedback: { forca: "Blindagem de compliance, controle interno (SoD), auditoria externa e mitigação fiscal agressiva.", vulnerabilidade: "Alocação de capital em M&A e otimização de custo médio ponderado de capital (WACC)." } },
  { tier: 4, title: "CFO", minXp: 1800, hasTimer: true, feedback: { forca: "Engenharia de capital de elite, escudos fiscais, gestão de covenants e funding estruturado.", vulnerabilidade: "Governança executiva máxima, política sucessória e relacionamento direto com o conselho e acionistas." } },
  { tier: 4, title: "CEO / Board Member", minXp: 2600, hasTimer: true, feedback: { forca: "Visão sistêmica institucional plena e liderança sobre o valor de mercado (Market Cap).", vulnerabilidade: "O desafio é a perpetuidade institucional diante de transformações regulatórias seculares e crises geopolíticas." } }
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
  const [caixa, setCaixa] = useState(5000000);
  const [margem, setMargem] = useState(20.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  const [showDRE, setShowDRE] = useState(false);
  const [sessionStartStats, setSessionStartStats] = useState({ caixa: 5000000, margem: 20.0 });

  // --- MOTOR IA ESCOLA DE ESTRATEGISTAS ---
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
        data: { 
          playerName, phone: telefone, email: email.toLowerCase(),
          companyName, xp, caixa, margem, compliance, 
          currentStage, sessionStartStats, showDRE 
        }
      });
    } catch (e) {
      console.error("Erro no Data Center: ", e);
    }
  };

  useEffect(() => { setIsLoading(false); }, []);

  useEffect(() => {
    if (gameStarted && !isGameOver) saveToDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, showDRE]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);

  // --- FUNÇÃO DE BUSCA EXPLÍCITA DE CASOS PRÁTICOS ---
  const fetchScenarioFromAI = async (stageNum: number) => {
    setIsGeneratingScenario(true);
    setFeedback(null);
    setSupplementaryComment("");
    setTimeLeft(120);

    const prompt = `Você é o reitor sênior da escola de negócios 'Código Azul'. Gere um Estudo de Caso Prático inédito (Fase ${stageNum + 1} de 10) com PROFUNDIDADE TEÓRICA EXTREMA, rigor acadêmico implacável e formatação em JSON estrito.
    Nível do aluno: ${currentLevel.title} (Tier ${currentLevel.tier}).
    Indicadores da empresa (${companyName}): Caixa R$ ${caixa}, Margem EBITDA ${margem}%, Compliance ${compliance}%.
    
    DIRETRIZ DE CONTEÚDO:
    - O campo 'theory' deve conter um ensinamento corporativo denso, estruturado, citando explicitamente CPCs, IFRS, normas do BACEN, CVM ou leis da Reforma Tributária (EC 132/IVA Dual). Explique o conceito contábil, o impacto patrimonial e o efeito estrutural no FCF. Mínimo de 6 linhas.
    - O campo 'context' deve apresentar uma situação real e tensa no CNPJ, com números detalhados e prazos.
    - Crie 3 opções de respostas objetivas de altíssimo nível (uma ótima/estratégica, uma mediana e uma desastrosa).

    Retorne APENAS um JSON válido nesta estrutura exata, sem formatação markdown:
    {
      "sector": "Setor do Desafio",
      "criticality": "Alta",
      "title": "Título Imponente do Caso Prático",
      "theory": "Texto longo, robusto e acadêmico explicando a norma, o princípio contábil e a mecânica financeira...",
      "context": "Descrição cirúrgica de um problema financeiro ou contábil real estourando na empresa...",
      "character": "Autoridade executiva cobrando a tomada de decisão",
      "options": [
        {
          "id": "A",
          "text": "Estratégia objetiva de alta gestão...",
          "xp": 35,
          "isBest": true,
          "impacts": { "caixa": 1000000, "margem": 1.5, "compliance": 10 },
          "feedback": "Parecer técnico aprofundado explicando por que esta decisão garantiu blindagem patrimonial."
        },
        {
          "id": "B",
          "text": "Estratégia intermediária ou paliativa...",
          "xp": 10,
          "isBest": false,
          "impacts": { "caixa": 0, "margem": -0.5, "compliance": 0 },
          "feedback": "Parecer técnico explicando que a medida foi superficial e apenas adiou a insolvência."
        },
        {
          "id": "C",
          "text": "Estratégia desastrosa ou maquiagem contábil...",
          "xp": -40,
          "isBest": false,
          "impacts": { "caixa": -2000000, "margem": -4.0, "compliance": -25 },
          "feedback": "Parecer técnico explicando a violação normativa cometida e o colapso gerado."
        }
      ]
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.95 } })
      });

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedScenario = JSON.parse(aiText);
      parsedScenario.options = shuffleArray(parsedScenario.options);
      
      setCurrentScenario(parsedScenario);
    } catch (error) {
      console.error("Erro ao gerar cenário da IA:", error);
      setCurrentScenario({
        sector: "Controladoria & Solvência",
        criticality: "Extrema",
        title: `Gestão Estratégica de Caixa — Módulo ${stageNum + 1}`,
        theory: "O Ciclo de Conversão de Caixa (CCC) regula a solvência patrimonial conforme o CPC 00. Descasamentos de prazos exigem capital de giro estressado que corrói o FCF livre.",
        context: `Na fase ${stageNum + 1}, sua empresa apresentou desalinhamento nas contas a pagar e receber, exigindo intervenção direta do CFO.`,
        character: "Comitê de Tesouraria",
        options: shuffleArray([
          { id: "A", text: "Travar crédito e antecipar recebíveis seletivos.", xp: 35, isBest: true, impacts: { caixa: 1000000, margem: 1.0, compliance: 10 }, feedback: "Correto. Protegeu a liquidez com inteligência de spread." },
          { id: "B", text: "Cobrir com cheque especial rotativo caro.", xp: 10, isBest: false, impacts: { caixa: 1000000, margem: -2.0, compliance: 0 }, feedback: "Paliativo caro que corroeu a margem." },
          { id: "C", text: "Ignorar o buraco e vender mais a prazo.", xp: -40, isBest: false, impacts: { caixa: -2000000, margem: -5.0, compliance: -20 }, feedback: "Desastroso. Acelerou a falência." }
        ])
      });
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // Disparo inicial único quando o jogo arranca
  useEffect(() => {
    if (gameStarted && !isGameOver && !showDRE && !currentScenario && !isGeneratingScenario) {
      fetchScenarioFromAI(currentStage);
    }
  }, [gameStarted]);


  // --- AVALIAÇÃO DE BÔNUS DO COMENTÁRIO COMPLEMENTAR ---
  const handleOptionSelectWithComment = async (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    let finalXp = selectedOption.xp;
    let finalImpacts = { ...selectedOption.impacts };
    let bonusMessage = "";

    if (supplementaryComment.trim()) {
      try {
        const prompt = `Você é o reitor do 'Código Azul'. O aluno escolheu a opção "${selectedOption.text}" para o caso: "${currentScenario.context}".
        Comentário complementar redigido pelo aluno: "${supplementaryComment}"
        Avalie se este comentário é tecnicamente ASSERTIVO, profundo e demonstra visão de CFO.
        Retorne APENAS um JSON estrito:
        {
          "isAssertive": [true/false],
          "bonusXp": [número entre 10 e 20 se true, 0 se false],
          "commentEvaluation": "Feedback de 1 parágrafo avaliando criticamente o argumento."
        }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json/g, "").replace(/