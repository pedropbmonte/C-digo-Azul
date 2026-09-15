"use client";

import { useState, useEffect } from "react";
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
  { tier: 1, title: "Apagador de Incêndios", minXp: 0 },
  { tier: 1, title: "Sobrevivente do Mês", minXp: 120 },
  { tier: 2, title: "Chefe de Equipe", minXp: 280 },
  { tier: 2, title: "Gestor de Sobrevivência", minXp: 500 },
  { tier: 3, title: "Dono de Negócio", minXp: 800 },
  { tier: 3, title: "Estrategista de Caixa", minXp: 1200 },
  { tier: 4, title: "Diretor Executivo", minXp: 1800 },
  { tier: 4, title: "Empresário de Elite", minXp: 2600 }
];

// --- BANCO DE DADOS MASSIVO DE ALTA PROFUNDIDADE (Ajustado para Faturamento até 50k/mês) ---
const questionBank = [
  // TIER 1 - A BASE DA SOBREVIVÊNCIA E CAIXA
  {
    id: "t1_caixa_01", tier: 1, sector: "Sobrevivência Financeira", title: "A Sangria Silenciosa",
    theory: "O maior mito do pequeno negócio é achar que 'o que sobra no banco dia 30 é o lucro'. Misturar contas PF e PJ mascara seu Ponto de Equilíbrio. Se a empresa paga a conta de luz da sua casa e o mercado direto no CNPJ, você não sabe se o seu negócio dá lucro ou se você é apenas um funcionário caro.",
    context: "Sexta-feira. A conta PJ tem R$ 2.500. O vale semanal da equipe (2 pessoas) amanhã soma R$ 1.800. Ao checar o extrato, você constata que passou R$ 1.200 no cartão corporativo no supermercado da sua casa nesta semana.",
    character: "O Extrato Implacável",
    consultoriaHint: "Dono que assalta a própria empresa vira refém de banco. Devolva o capital para a PJ hoje. Pague sua equipe. O seu luxo na Pessoa Física precisa ser cortado até a empresa ter Margem de Contribuição real.",
    options: [
      { id: "A", text: "Injetar dinheiro do próprio bolso (PF) na PJ hoje, pagar a equipe e instituir uma retirada de pró-labore fixa e austera.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou os bolsos, honrou o acordo e travou o sangramento.", reward: "🏆 Trava de Retirada: Seu sistema agora impede o pagamento de boletos de CPF dentro da conta PJ.", lesson: "" },
      { id: "B", text: "Acionar o limite do cheque especial da conta PJ para cobrir a equipe, sem precisar cortar gastos pessoais.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -2.5, compliance: -10 }, feedback: "A ILUSÃO. Você tomou dívida cara na PJ para financiar luxo na PF.", reward: "", lesson: "A dívida da empresa não existe para sustentar o ego do dono." },
      { id: "C", text: "Atrasar o vale da equipe dizendo que 'o mercado está retraído essa semana' e pedir compreensão.", xp: -40, isBest: false, impacts: { caixa: -1200, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL. Um time com fome não atende cliente com sorriso.", reward: "", lesson: "A desmotivação da base é o primeiro sintoma da quebra." }
    ]
  },
  {
    id: "t1_maq_02", tier: 1, sector: "Capital de Giro", title: "A Ilusão da Venda Esculpida",
    theory: "Vender não é receber. Antecipar recebíveis de maquininha não é gerar caixa, é agiotagem legalizada. Se a sua Margem é de 15% e você paga 5% de taxa de antecipação, você entrega um terço do lucro só para ter o dinheiro mais cedo.",
    context: "Você comemorou uma venda de R$ 5.000 parcelada em 10x sem juros para um cliente. Mas o boleto de reposição dessa mercadoria (R$ 2.800) vence segunda-feira e seu saldo atual é zero.",
    character: "O Custo Financeiro",
    consultoriaHint: "Nunca antecipe para cobrir furo. Ligue para o fornecedor, alongue o prazo dele e crie uma campanha PIX relâmpago hoje para pequenos produtos que estão parados.",
    options: [
      { id: "A", text: "Ser transparente com o fornecedor, renegociar o boleto para 15 dias e lançar uma promoção relâmpago via PIX para levantar liquidez.", xp: 35, isBest: true, impacts: { caixa: 1200, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA DE CAIXA. Preservou a margem da grande venda e esticou o passivo honestamente.", reward: "🏆 Visão de Liquidez: Aprendeu injeção de caixa sem depender dos bancos.", lesson: "" },
      { id: "B", text: "Apertar o botão de antecipação no app da maquininha, pagando 6% de taxa total para ter o dinheiro na segunda.", xp: -5, isBest: false, impacts: { caixa: 0, margem: -3.0, compliance: 0 }, feedback: "A ARMADILHA DO CONFORTO. Resolveu segunda-feira, mas rasgou parte do lucro.", reward: "", lesson: "O botão de antecipar é o botão de autodestruição da margem." },
      { id: "C", text: "Pagar o fornecedor com o cartão de crédito corporativo, somando os juros do cartão com o custo do produto.", xp: -45, isBest: false, impacts: { caixa: -1500, margem: -5.0, compliance: -20 }, feedback: "BOLA DE NEVE FATAL. Custo financeiro sobre custo financeiro.", reward: "", lesson: "Pegar fogo para apagar incêndio só gera cinzas." }
    ]
  },
  {
    id: "t1_preco_03", tier: 1, sector: "Precificação Cega", title: "O Teto de Vidro do Vizinho",
    theory: "Preço de Venda = Preço do Concorrente. Eis a fórmula da falência. Seu concorrente pode ter aluguel mais barato, sonegar impostos ou estar quebrando. Balizar seu preço pelo dele sem conhecer seu Markup real é pagar para trabalhar.",
    context: "Seu serviço/produto principal custa R$ 120. Os insumos subiram 15% amanhã. A loja vizinha faz por R$ 110. Você tem pavor de reajustar e perder a clientela mensal.",
    character: "O Medo da Precificação",
    consultoriaHint: "Quem atrai por preço, por preço perde. Não absorva inflação. Repasse o aumento. Deixe os clientes 'sugadores de desconto' irem afundar a margem do seu concorrente.",
    options: [
      { id: "A", text: "Repassar o aumento para a tabela (R$ 138), focar no atendimento e aceitar a perda dos clientes focados apenas em preço baixo.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 2.5, compliance: 10 }, feedback: "MATURIDADE COMERCIAL. Faturamento é ego; Margem é oxigênio.", reward: "🏆 Filtro de Posicionamento: Sua marca atrai valor, não esmolas.", lesson: "" },
      { id: "B", text: "Absorver o custo de 15% 'até ver se o mercado aceita' e manter a tabela congelada em R$ 120.", xp: -15, isBest: false, impacts: { caixa: -800, margem: -3.0, compliance: 0 }, feedback: "SANGRAMENTO VOLUNTÁRIO. Tirou dinheiro do bolso por medo de vender.", reward: "", lesson: "O medo de perder uma venda é o que mais fecha pequenas empresas." },
      { id: "C", text: "Baixar o preço para R$ 100 para quebrar o vizinho, apostando que vai 'ganhar no giro'.", xp: -50, isBest: false, impacts: { caixa: -3000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO MATEMÁTICO. Vender volume com margem negativa acelera a quebra.", reward: "", lesson: "Volume não conserta precificação podre." }
    ]
  },
  {
    id: "t1_rh_04", tier: 1, sector: "Gestão de Pessoas", title: "O Custo Oculto da Pena",
    theory: "O CNPJ tem DRE, não coração. Manter um funcionário incompetente porque 'precisa do emprego' destrói o moral da equipe enxuta. O cara bom desmotiva ao carregar o cara ruim nas costas.",
    context: "Você tem um entregador/atendente que é amigo da família, mas que falha frequentemente. Hoje, por preguiça dele, um pedido de R$ 800 estragou/foi cancelado pelo cliente.",
    character: "O Clima Organizacional",
    consultoriaHint: "Pessoas boas de coração, mas ruins de execução, quebram PMEs de dentro para fora. Seja rápido na demissão. Respeito é dar o feedback e liberar pro mercado.",
    options: [
      { id: "A", text: "Chamar para o desligamento hoje. Pagar rescisão, assumir a perda do caixa e buscar alguém focado em performance.", xp: 35, isBest: true, impacts: { caixa: -1200, margem: 1.5, compliance: 15 }, feedback: "POSTURA DE LÍDER. Cortou o membro infeccionado antes de perder o braço.", reward: "🏆 Cultura de Performance: A equipe percebeu que amadorismo não tem espaço.", lesson: "" },
      { id: "B", text: "Dar bronca severa, mas manter na equipe porque 'demitir e contratar alguém novo dá muito trabalho'.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -1.0, compliance: -5 }, feedback: "COVARDIA FINANCEIRA. O custo invisível do erro é maior que a rescisão.", reward: "", lesson: "O problema que você ignora dita o limite do seu crescimento." },
      { id: "C", text: "Descontar os R$ 800 do salário de R$ 1.800 dele no fim do mês como punição severa.", xp: -45, isBest: false, impacts: { caixa: 400, margem: -2.0, compliance: -30 }, feedback: "PASSIVO TRABALHISTA GERADO. Punição ilegal que vai render processo caro.", reward: "", lesson: "Justiça não se faz com as próprias mãos no RH." }
    ]
  },
  
  // TIER 2 - ORGANIZAÇÃO, PROCESSOS E ESTOQUE
  {
    id: "t2_estoque_01", tier: 2, sector: "Gestão de Estoque", title: "O Dinheiro Congelado na Prateleira",
    theory: "O Representante trabalha pela comissão dele, não pelo seu caixa. O 'desconto de volume' leva donos de PME a comprarem mercadoria para 6 meses. Estoque que não gira é dinheiro apodrecendo na inflação.",
    context: "A empresa fatura seus 35k/mês. Porém, você tem R$ 12.000 de capital imobilizado em mercadorias paradas há 4 meses. O aluguel vence amanhã (R$ 3.500) e a conta bancária tem R$ 900.",
    character: "O Boleto do Ponto",
    consultoriaHint: "Lucro de papel não paga boleto. Mercadoria encalhada é erro do passado. Queime esse estoque a preço de custo no WhatsApp agora. Converta caixa de papelão em Pix.",
    options: [
      { id: "A", text: "Rodar 'Queima de Estoque' agressiva hoje. Vender a preço de custo (zero lucro) para transformar produto parado nos R$ 3.500 do aluguel.", xp: 35, isBest: true, impacts: { caixa: 3500, margem: -1.0, compliance: 10 }, feedback: "DOR DA APRENDIZAGEM. Engoliu o ego, assumiu a compra errada e salvou o mês.", reward: "🏆 Oxigênio de Caixa: Você dominou a técnica de liquidar curva C.", lesson: "" },
      { id: "B", text: "Manter o preço cheio, torcer pro cliente aparecer e pagar o aluguel utilizando cheque especial do banco.", xp: -15, isBest: false, impacts: { caixa: -1000, margem: -1.5, compliance: -5 }, feedback: "ILUSÃO CONTÁBIL. Trocou um problema de prateleira por dívida a 8% a.m.", reward: "", lesson: "Esperança não é estratégia comercial." },
      { id: "C", text: "Acionar fornecedor e comprar mais mercadorias no boleto parcelado, tentando criar um combo para 'desovar' o velho.", xp: -40, isBest: false, impacts: { caixa: -6000, margem: -4.0, compliance: -15 }, feedback: "O ABISMO. Curou envenenamento com mais veneno.", reward: "", lesson: "Não se resolve falta de caixa gerando novos boletos." }
    ]
  },
  {
    id: "t2_inadimp_02", tier: 2, sector: "Inadimplência", title: "O Fiado do 'Parceiro' Fiel",
    theory: "Dono de pequeno negócio não é banco sem juros. O medo de cobrar o 'cliente parceiro' destrói seu giro. Se ele compra muito e nunca paga no prazo, ele te encontrou como financiamento grátis.",
    context: "Um cliente antigo deve R$ 3.500 há 40 dias. Você não cobrou para 'não ficar chato'. Hoje ele pediu uma remessa urgente de mais R$ 1.500 para amanhã cedo.",
    character: "O Calote Disfarçado",
    consultoriaHint: "Trave a esteira. Passivo não é cliente. Não existe venda nova com título antigo em aberto. Aproxime-se do atrito.",
    options: [
      { id: "A", text: "Responder com firmeza: 'A liberação de crédito para nova remessa está travada no sistema até a baixa dos R$ 3.500'.", xp: 35, isBest: true, impacts: { caixa: 3500, margem: 1.0, compliance: 15 }, feedback: "POSTURA EXECUTIVA. Você cortou a sangria e expôs o blefe.", reward: "🏆 A Régua Implacável: Tolerância zero para liberação sem quitação.", lesson: "" },
      { id: "B", text: "Entregar o pedido novo e pedir 'pelo amor de Deus' para ele depositar uma parte da dívida antiga na semana que vem.", xp: -15, isBest: false, impacts: { caixa: -1500, margem: -1.5, compliance: -10 }, feedback: "SUBMISSÃO TÁTICA. Validou que não há regras na sua gestão.", reward: "", lesson: "Quem tem pena do devedor, acorda devendo." },
      { id: "C", text: "Entregar o pedido e, em segredo, descontar duplicatas ou antecipar cartão (tomando juros) para cobrir o buraco que ele deixou.", xp: -45, isBest: false, impacts: { caixa: -2500, margem: -4.0, compliance: -20 }, feedback: "O CAMINHO DA RUÍNA. Transferiu a dívida dele para o seu colo.", reward: "", lesson: "O banco nunca esquece de te cobrar. Seu cliente, sim." }
    ]
  },
  {
    id: "t2_tesoura_04", tier: 2, sector: "Fluxo de Caixa", title: "O Efeito Tesoura",
    theory: "É aqui que a empresa que fatura 50k quebra. O 'Efeito Tesoura' é quando seu Prazo de Recebimento (cliente paga em 6x) é maior que o Prazo de Pagamento (fornecedor em 30d). O crescimento engole o caixa.",
    context: "Recorde! Vendeu R$ 48.000 no mês. Tudo parcelado no cartão de crédito. Mas a fatura de reposição de estoque vence amanhã e custa R$ 20.000. O caixa físico está negativo.",
    character: "O Paradoxo do Crescimento",
    consultoriaHint: "Inverta o ciclo. Encurte prazos de venda dando Desconto Assoalho para PIX, e alongue com fornecedores. Freie a maquininha.",
    options: [
      { id: "A", text: "Ligar pro fornecedor pedindo prorrogação. E amanhã: limitar parcelas a 3x e criar desconto forte pra PIX à vista.", xp: 35, isBest: true, impacts: { caixa: 6000, margem: 1.0, compliance: 10 }, feedback: "CONTROLE DE ROTAÇÃO. Você freou as vendas tóxicas e chamou liquidez.", reward: "🏆 O Ciclo Positivo: Fôlego retomado antes do boleto vencer.", lesson: "" },
      { id: "B", text: "Comemorar o recorde e pegar empréstimo Capital de Giro no banco para cobrir os R$ 20k até as parcelas caírem.", xp: -20, isBest: false, impacts: { caixa: -2000, margem: -3.0, compliance: -10 }, feedback: "A ARMADILHA CLÁSSICA. Pagou juros caros porque vendeu muito.", reward: "", lesson: "Vender a prazo com o dinheiro do banco não é vender, é repassar juros." },
      { id: "C", text: "Deixar de pagar o fornecedor alegando que 'ele tem que entender', esperando os cartões caírem.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -2.0, compliance: -25 }, feedback: "QUEIMA DE CRÉDITO. Seu CNPJ foi pro Serasa. A roda travou.", reward: "", lesson: "O crédito na praça é o maior ativo do pequeno comércio." }
    ]
  },
  {
    id: "t2_mkt_05", tier: 2, sector: "Marketing", title: "A Métrica de Vaidade",
    theory: "Para quem fatura até 50k, Curtidas não pagam DAS. Focar em branding e topo de funil antes de ter uma esteira de conversão (ROAS) no WhatsApp é brincar de ser famoso enquanto o caixa seca.",
    context: "Sua 'agência' comemora que seu Reels teve 10.000 views. Você gastou R$ 800 impulsionando. Mas no fim do dia, o WhatsApp da loja só tocou 2 vezes com curiosos.",
    character: "O Tráfego Pago Jogado Fora",
    consultoriaHint: "Dinheiro de PME na internet tem que voltar rápido. Pause campanhas de 'Alcance'. O foco é campanha de Mensagem direta para o WhatsApp com oferta irresistível.",
    options: [
      { id: "A", text: "Trocar o foco da agência: zerar verba de 'brand' e jogar os R$ 800 100% em campanhas de mensagens (Leads) focadas na região.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 1.5, compliance: 10 }, feedback: "FOCO NA CONVERSÃO. View não enche carrinho, mensagem sim.", reward: "🏆 Máquina de Vendas: Cada real gasto agora busca um CPF para fechar negócio.", lesson: "" },
      { id: "B", text: "Comemorar as visualizações acreditando que 'aos poucos a marca vai ficando forte na mente do povo'.", xp: -15, isBest: false, impacts: { caixa: -800, margem: -1.0, compliance: 0 }, feedback: "CEGUEIRA DE EGO.", reward: "", lesson: "Até o longo prazo chegar, seu fluxo de caixa despenca." },
      { id: "C", text: "Ficar frustrado, mas dobrar a verba de alcance para R$ 1.600 achando que faltou botar mais dinheiro no Instagram.", xp: -40, isBest: false, impacts: { caixa: -2500, margem: -3.0, compliance: -5 }, feedback: "QUEIMA ACELERADA. Falindo de forma muito popular.", reward: "", lesson: "Popularidade sem esteira de vendas é caridade para o Mark Zuckerberg." }
    ]
  },

  // TIER 3 - GESTÃO DO TEMPO, ESCALA E CUSTOS INVISÍVEIS
  {
    id: "t3_gargalo_01", tier: 3, sector: "Custo de Oportunidade", title: "A Prisão do 'Ninguém faz como eu'",
    theory: "O teto de crescimento de uma empresa de R$ 40k é a agenda do dono. Se você varre o chão, embala pedido e envia boleto, cobra de si mesmo R$ 150/hora por um serviço braçal. O medo de delegar e errar garante que você não cresça.",
    context: "Sua receita empacou. A jornada é de 14h. O WhatsApp de vendas tem 30 mensagens não lidas porque você passou a tarde conferindo se a funcionária limpou o estoque direito.",
    character: "O Teto de Vidro",
    consultoriaHint: "Assuma o aumento de Custo Fixo e delegue o operacional. A sua energia livre será revertida em alianças comerciais e vendas de fechamento. Treine e libere.",
    options: [
      { id: "A", text: "Contratar um assistente operacional. Desenhar o processo básico, aceitar que ele fará 80% tão bem quanto você, e focar em Vender.", xp: 40, isBest: true, impacts: { caixa: -1800, margem: 3.5, compliance: 10 }, feedback: "A CORAGEM DA ESCALA. O Custo Fixo subiu hoje, mas a receita destrava porque o CEO voltou ao jogo.", reward: "🏆 Tempo de Dono: Você saiu da operação para olhar o painel de controle.", lesson: "" },
      { id: "B", text: "Contratar um 'freelancer' muito barato apenas para apagar incêndios à noite, sem compromisso.", xp: -5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "A MEIA SOLUÇÃO. Mão de obra barata sem processo é refação. O caos continua.", reward: "", lesson: "Economizar em mão de obra de base custa o seu cérebro estratégico." },
      { id: "C", text: "Continuar na mesma rotina, alegando que 'mão de obra tá difícil' e apenas desligar o celular mais cedo.", xp: -40, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: -10 }, feedback: "O SUICÍDIO LENTO. Você aceitou o limite máximo da sua empresa. A concorrência agradece.", reward: "", lesson: "O orgulho de ser o 'melhor peão' da própria empresa mata o CNPJ." }
    ]
  },
  {
    id: "t3_refem_02", tier: 3, sector: "Gestão de Riscos (RH)", title: "O Sequestro da Operação",
    theory: "O Risco Chave: Dependência de 1 funcionário. Quando o vendedor 'estrela' percebe que detém os processos vitais da pequena empresa, o poder inverte. Ele vira o dono sem assumir o risco de pagar a folha.",
    context: "Seu único vendedor sênior pediu uma reunião: 'Estou sendo assediado. Ou meu fixo sobe 40% hoje (mais R$ 1.500/mês), ou vou pro concorrente e os clientes vão comigo'.",
    character: "O Ultimato Interno",
    consultoriaHint: "Nunca negocie com reféns. O terrorista quer o controle. Conceda um bônus por meta (variável) para ganhar 30 dias. Sugue as informações dele, faça um CRM básico e contrate estagiários. Pulverize o risco.",
    options: [
      { id: "A", text: "Negar fixo, oferecer agressivo bônus em cima de metas (variável). Documentar processos e iniciar seleção silenciosa na mesma noite.", xp: 40, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 20 }, feedback: "MANOBRA EXECUTIVA. Não cedeu à chantagem, blindou a base e iniciou a pulverização.", reward: "🏆 Empresa Despersonalizada: Os processos agora valem mais do que o CPF que executa.", lesson: "" },
      { id: "B", text: "Conceder o aumento fixo de 40% engolindo a raiva, pelo pavor de perder os clientes que ele atende.", xp: -25, isBest: false, impacts: { caixa: -2500, margem: -4.0, compliance: -15 }, feedback: "SEQUESTRO VALIDADO. Você acabou de transferir o controle da sua empresa para ele.", reward: "", lesson: "Quem cede ao terrorismo interno de um, perde a liderança dos outros." },
      { id: "C", text: "Demitir aos gritos para 'mostrar quem manda' e tentar você mesmo ligar pros clientes no dia seguinte.", xp: -45, isBest: false, impacts: { caixa: -6000, margem: -5.0, compliance: -20 }, feedback: "A BURRICE DO EGO. A raiva gerou um rombo comercial imediato e risco de assédio.", reward: "", lesson: "Um líder ofendido toma as decisões mais caras do mundo." }
    ]
  },
  {
    id: "t3_inflacao_04", tier: 3, sector: "Custos Invisíveis", title: "A Cegueira do Custo Fixo",
    theory: "A inflação age como cupim num negócio que fatura 30k, 40k. A conta de luz, o aluguel, a gasolina e o dissídio subiram. Se sua tabela de preços é a mesma de 1 ano atrás, a sua margem já evaporou.",
    context: "O balanço fechou empatado. R$ 0,00 de lucro. O contador mostrou que seus custos operacionais subiram 15% nos últimos 12 meses. A tabela de preços não foi tocada.",
    character: "A Fome da Margem",
    consultoriaHint: "Preço é a única coisa que joga oxigênio para dentro da DRE. O cliente vai chiar? Vai. Mas vender muito dando prejuízo é a pior tortura. Reajuste e assuma a perda de volume barato.",
    options: [
      { id: "A", text: "Reajustar a tabela imediatamente em 15%, treinar o time em objeções baseadas na qualidade e dispensar os clientes que brigam por centavos.", xp: 40, isBest: true, impacts: { caixa: 4500, margem: 3.5, compliance: 10 }, feedback: "A CORAGEM DA ESCALA. Protegeu a entidade que paga todos vocês. Vender valor, não preço.", reward: "🏆 O Reposicionamento: O cliente tóxico saiu, o cliente bom pagou mais.", lesson: "" },
      { id: "B", text: "Trocar de fornecedor de insumos para opções mais baratas, forçando uma queda na qualidade da entrega para segurar o preço velho.", xp: -25, isBest: false, impacts: { caixa: 0, margem: -2.0, compliance: -15 }, feedback: "A DESTRUIÇÃO DO NOME. Resolveu por 2 meses sacrificando o boca-a-boca pra sempre.", reward: "", lesson: "O mercado pode perdoar o preço alto, mas não perdoa a queda de qualidade." },
      { id: "C", text: "Ignorar o aumento do custo fixo e dobrar os anúncios para vender no 'volume' e fechar a conta do mês.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -5.0, compliance: -10 }, feedback: "O VOO DO PATO. Escalar venda sangrando margem é pedir falência acelerada.", reward: "", lesson: "Não se escala um modelo de negócios que está dando prejuízo unitário." }
    ]
  },

  // TIER 4 - DIRETORES DE PME, TRIBUTOS E SUCESSÃO
  {
    id: "t4_tributos_01", tier: 4, sector: "Estratégia Tributária", title: "O Degrau do Simples Nacional",
    theory: "Congelar as vendas porque o contador avisou que você vai pular para uma faixa de imposto maior (de 6% para 11%, por exemplo) é o cúmulo da mentalidade de escassez.",
    context: "Novembro. A sua pequena empresa está batendo R$ 50 mil de média/mês. O contador ligou: 'Se faturarmos os próximos R$ 20.000, pulamos de faixa no Simples Nacional e o imposto sobe muito'.",
    character: "O Medo do Leão",
    consultoriaHint: "Crescimento custa imposto. Segurar faturamento é matar o comercial da empresa. Pule de faixa, emita a nota, pague os 11% e reajuste a precificação para o ano que vem.",
    options: [
      { id: "A", text: "Faturar os pedidos totais, pular de faixa tributária com orgulho e ajustar a planilha de Markup com o novo imposto para os próximos orçamentos.", xp: 40, isBest: true, impacts: { caixa: 6000, margem: 1.5, compliance: 30 }, feedback: "A MUDANÇA DE SÉRIE. Você aceitou a dor do crescimento e deixou a mentalidade escassa.", reward: "🏆 Limite Rompido: A empresa faturou mais, pagou imposto certo e lucrou muito mais.", lesson: "" },
      { id: "B", text: "Travar as vendas em novembro, dispensar clientes novos e só faturar em janeiro para 'proteger a alíquota'.", xp: -20, isBest: false, impacts: { caixa: -8000, margem: -2.0, compliance: 0 }, feedback: "ESCASSEZ. O mercado não vai esperar seu medo tributário. Frustrou a clientela inteira.", reward: "", lesson: "Empresa que escolhe não vender escolhe morrer." },
      { id: "C", text: "Fazer as vendas de R$ 20.000 no dinheiro vivo/Pix CPF sem emitir nota fiscal para fraudar o teto da Receita.", xp: -50, isBest: false, impacts: { caixa: 15000, margem: -5.0, compliance: -60 }, feedback: "O CRIME FISCAL. O banco cruzou seu CPF com o Pix CNPJ. A autuação estadual chegou dobrada.", reward: "", lesson: "A ilusão da sonegação no Simples é a morte súbita da PME." }
    ]
  },
  {
    id: "t4_ego_02", tier: 4, sector: "Gestão do Ego", title: "A Ilusão da Caminhonete",
    theory: "O ego do pequeno empreendedor que acabou de fazer caixa destrói mais CNPJs que o próprio mercado. Pico de 3 meses não é consolidação. Alavancar passivos fixos (carrão na PJ) remove o oxigênio essencial para crises.",
    context: "Você teve 3 meses excelentes. O caixa acumulou R$ 25.000 livres. O vendedor da concessionária aprovou um financiamento no seu CNPJ para uma SUV. Parcela: R$ 3.500 mensais.",
    character: "O Status Social",
    consultoriaHint: "Não estrangule seu fluxo de caixa na largada. Carro zero financiado no CNPJ não vende para o seu cliente, apenas enriquece a financeira. Faça uma Reserva de Emergência.",
    options: [
      { id: "A", text: "Agradecer o banco, declinar o carro e aplicar 80% desse valor (R$ 20k) num CDB Diário como Reserva de Guerra da empresa.", xp: 40, isBest: true, impacts: { caixa: 8000, margem: 1.0, compliance: 20 }, feedback: "O VERDADEIRO DIRETOR EXECUTIVO. Estocou feno pro inverno. A vaidade espera.", reward: "🏆 Blindagem de Capital: Sono tranquilo sabendo que a empresa sobrevive meses sem vender.", lesson: "" },
      { id: "B", text: "Torrar os R$ 25.000 numa grande reforma visual da loja à vista, porque 'ambiente luxuoso atrai rico'.", xp: -25, isBest: false, impacts: { caixa: -25000, margem: 0, compliance: -10 }, feedback: "BELEZA VULNERÁVEL. Loja de primeiro mundo com caixa de terceiro mundo. Atrasou folha mês que vem.", reward: "", lesson: "Gesso, pintura e arandelas não pagam funcionário." },
      { id: "C", text: "Assinar o financiamento da SUV, dando R$ 10k de entrada e assumindo o boleto de R$ 3.500 todos os meses.", xp: -50, isBest: false, impacts: { caixa: -10000, margem: -6.0, compliance: -25 }, feedback: "O CANCRO NO FLUXO. Custo fixo desnecessário enforcou a operação. O IPVA e Seguro vêm aí.", reward: "", lesson: "A vaidade sufocou o pulmão do negócio recém-saudável." }
    ]
  },
  {
    id: "t4_dividendo_04", tier: 4, sector: "Lucratividade", title: "A Retirada Selvagem",
    theory: "O lucro de uma PME não deve ir 100% para a piscina do dono. Distribuição selvagem é o caminho rápido para a descapitalização de um negócio de 50k. O lucro de hoje financia o giro de amanhã sem banco.",
    context: "Fechamento do ano: O lucro limpo acumulado da operação foi de exatos R$ 90.000 (R$ 7,5k/mês). Você e seu sócio estão tentados a zerar a conta corporativa e transferir tudo 50/50 para a Pessoa Física.",
    character: "A Distribuição de Lucros",
    consultoriaHint: "Regra de ouro 30/70. Prêmio para o sócio é 30% do lucro gerado. Os outros 70% ficam travados na empresa para compra de estoque à vista, marketing e expansão. Não sangre o CNPJ.",
    options: [
      { id: "A", text: "Aplicar governança financeira: Distribuir 30% (27k) como prêmio justo e deixar 70% (63k) guardados em liquidez no CNPJ.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.5, compliance: 20 }, feedback: "ALINHAMENTO COM EQUITY. Prêmio no CPF, mas a empresa virou uma usina que se financia.", reward: "🏆 Equity Sólido: A empresa roda e cresce com o dinheiro mais barato que existe.", lesson: "" },
      { id: "B", text: "Ceder à pressa do momento e transferir os R$ 90.000 para vocês. 'Ano que vem a gente vende e faz mais'.", xp: -30, isBest: false, impacts: { caixa: -90000, margem: -3.0, compliance: -15 }, feedback: "SECAGEM DE POÇO. Sangraram o paciente. Em fevereiro precisarão de empréstimo comercial.", reward: "", lesson: "Fome de consumo irresponsável é o Custo Fixo mais caro que existe." },
      { id: "C", text: "Não distribuir e colocar os 90k em apostas online (Bets/Trade) 'pela empresa' para tentar dobrar o lucro rapidamente.", xp: -50, isBest: false, impacts: { caixa: -90000, margem: -5.0, compliance: -40 }, feedback: "DESVIO DE FINALIDADE INSANO. Queimou o caixa suado num mercado de alto risco.", reward: "", lesson: "A sua empresa faz serviços/produtos, não é Asset Management de Wall Street." }
    ]
  },
  {
    id: "t4_b2b_06", tier: 4, sector: "Contratos", title: "O Cliente 'Lobo'",
    theory: "Multinacionais amam usar PMEs como banco. Exclusividade e volume alto em troca de pagamento em 120 dias com margem de 5% é escravidão corporativa, não parceria.",
    context: "Você fez um piloto para uma grande rede de varejo. Eles adoraram e querem contrato anual (R$ 20.000/mês). Mas impõem: você não pode atender concorrentes e o pagamento é sempre com 90 dias após a nota.",
    character: "O Cliente Gigante",
    consultoriaHint: "Se vai pagar em 90 dias, o preço é outro (embute taxa de antecipação). Não dê exclusividade para quem paga pouco e demorado. Você quebra por asfixia financeira.",
    options: [
      { id: "A", text: "Recusar a exclusividade e só aceitar os 90 dias se a tabela de preços deles for reajustada com a taxa de juros do período.", xp: 40, isBest: true, impacts: { caixa: 8000, margem: 2.0, compliance: 20 }, feedback: "NEGOCIAÇÃO DE IGUAL. Blindou sua liquidez contra abusos de empresas gigantes.", reward: "🏆 Contrato Blindado: Venda B2B com margem real e giro protegido.", lesson: "" },
      { id: "B", text: "Aceitar as regras deles e tentar correr nos bancos para antecipar essas notas de 90 dias.", xp: -25, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: -10 }, feedback: "A ARMADILHA. Você virou um funcionário terceirizado que paga juros pro cliente crescer.", reward: "", lesson: "Você financiou uma multinacional com o seu CNPJ frágil." },
      { id: "C", text: "Aceitar a exclusividade sem questionar só para poder colocar a logomarca do cliente grandão no seu site/Instagram.", xp: -50, isBest: false, impacts: { caixa: -12000, margem: -6.0, compliance: -20 }, feedback: "DESTRUIÇÃO TÁTICA. O ego falou mais alto. Faturou muito, faliu sem ver a cor do dinheiro.", reward: "", lesson: "Trabalhou 3 meses usando dinheiro próprio para manter o serviço do bilionário." }
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
  const [caixa, setCaixa] = useState(25000); // Caixa ajustado para PME realista
  const [margem, setMargem] = useState(18.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  const [phaseReward, setPhaseReward] = useState<string | null>(null);
  
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); 
  
  const [showConsultoriaHint, setShowConsultoriaHint] = useState(false);
  const [dreMode, setDreMode] = useState<'none' | 'mid-month' | 'end-month'>('none');
  
  const [dreProLabore, setDreProLabore] = useState(3000);
  const [dreMarketing, setDreMarketing] = useState(800);
  const [dreTaxas, setDreTaxas] = useState(900); 

  const saveToDB = async () => {
    if (!email) return;
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        password: password,
        data: { playerName, phone: telefone, email: email.toLowerCase(), companyName, xp, caixa, margem, compliance, currentStage, usedQuestionIds, dreMode }
      });
    } catch (e) {}
  };

  useEffect(() => { if (gameStarted && !isGameOver) saveToDB(); }, [xp, caixa, margem, compliance, currentStage, gameStarted, isGameOver, usedQuestionIds, dreMode]);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;
  const monthProgress = ((currentStage) / 10) * 100;

  // --- MOTOR BLINDADO DE INEDITISMO ABSOLUTO ---
  const loadNextQuestion = () => {
    setFeedback(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    let unplayedQuestions = questionBank.filter(q => !usedQuestionIds.includes(q.id));
    
    if (unplayedQuestions.length === 0) {
      setUsedQuestionIds([]);
      unplayedQuestions = [...questionBank];
      alert("🏆 MÁXIMO RESPEITO: Você zerou todos os desafios do simulador. O mercado vai reiniciar os ciclos comerciais agora.");
    }
    
    let availableInTier = unplayedQuestions.filter(q => q.tier <= currentLevel.tier);
    
    if (availableInTier.length === 0) {
      availableInTier = unplayedQuestions; 
    }
    
    const selected = availableInTier[Math.floor(Math.random() * availableInTier.length)];
    const shuffledOptions = shuffleArray([...selected.options]);
    setCurrentScenario({ ...selected, options: shuffledOptions });
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !currentScenario && !feedback && dreMode === 'none') {
      loadNextQuestion();
    }
  }, [gameStarted, currentScenario, feedback, dreMode]);

  const handleConsultoria = () => {
    if (caixa >= 1500) { // Consultoria reduzida para realidade PME
      setCaixa(prev => prev - 1500);
      setXp(prev => prev + 25);
      setShowConsultoriaHint(true);
    } else {
      alert("Caixa insuficiente para acionar a Visão do Mentor Pedro Monte (Custo: R$ 1.500).");
    }
  };

  const handleOptionSelect = (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    const finalXp = selectedOption.xp;
    const finalImpacts = { ...selectedOption.impacts };

    setUsedQuestionIds(prev => [...prev, currentScenario.id]);
    setFeedback(`${selectedOption.feedback}`);
    
    if (selectedOption.isBest) {
      setPhaseReward(selectedOption.reward || "🏆 Atitude de Dono validada.");
    } else {
      setPhaseReward(`❌ Lição Paga: ${selectedOption.lesson || "O Mercado cobra caro pelo ego."}`);
    }

    setCaixa(prev => {
        const next = Math.max(0, prev + finalImpacts.caixa);
        if (next <= 0) setIsGameOver(true);
        return next;
    });
    setMargem(prev => prev + finalImpacts.margem);
    setCompliance(prev => {
        const next = Math.min(100, Math.max(0, prev + finalImpacts.compliance));
        if (next <= 0) setIsGameOver(true);
        return next;
    });
    setXp(prev => Math.max(0, prev + finalXp));

    setLastXpChange(finalXp); 
    setLastImpacts(finalImpacts);
    setIsEvaluatingChoice(false);
  };

  const proceedToNextQuestion = () => {
    setFeedback(null);
    setLastXpChange(null);
    setLastImpacts(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    const nextStage = currentStage + 1;
    
    if (nextStage < 10) {
      setCurrentStage(nextStage);
      setCurrentScenario(null); 
    } else { 
      setDreMode('end-month'); 
    }
  };

  // --- DRE DINÂMICA LIGADA AO XP PARA FAIXA ATÉ 50K ---
  // Faturamento base 20k. Aumenta sutilmente com XP, travando perto dos 50k.
  const dreReceita = Math.min(50000, 20000 + (xp * 10)); 
  const dreMargemReal = (margem / 100); 
  const dreMargemContribuicao = dreReceita * dreMargemReal;
  const dreCustosVariaveis = dreReceita - dreMargemContribuicao; 
  const dreCustoFixoBase = 4500; // Base menor
  const dreTotalDespesasFixas = dreCustoFixoBase + dreProLabore + dreMarketing + dreTaxas;
  const dreLucroLiquido = dreMargemContribuicao - dreTotalDespesasFixas;

  const handleSalvarDREMidMonth = () => { setDreMode('none'); };

  const handleInjetarLucroEndMonth = () => {
    setCaixa(prev => prev + dreLucroLiquido);
    setDreMode('none');
    setCurrentStage(0); 
    setCurrentScenario(null); 
  };
  
  const dreNovaMargem = dreReceita > 0 ? (dreLucroLiquido / dreReceita) * 100 : 0;

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
            setCaixa(d.caixa ?? 25000); setMargem(d.margem ?? 18.0); setCompliance(d.compliance ?? 100);
            setCurrentStage(d.currentStage || 0); 
            setUsedQuestionIds(d.usedQuestionIds || []);
            setDreMode(d.dreMode || 'none');
            setCurrentScenario(null); 
            if((d.caixa ?? 25000) <= 0 || (d.compliance ?? 100) <= 0) setIsGameOver(true);
            setGameStarted(true);
          }
        } else { setAuthError("E-mail ou senha incorretos."); }
      } else if (authMode === 'register') {
        if (!nome.trim() || !telefone.trim()) { setAuthError("Preencha Nome e WhatsApp."); setIsAuthenticating(false); return; }
        if (docSnap.exists()) { setAuthError("E-mail já cadastrado."); } 
        else {
          await setDoc(docRef, {
            password: cleanPassword,
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 25000, margem: 18.0, compliance: 100, currentStage: 0, usedQuestionIds: [], dreMode: 'none' }
          });
          setPlayerName(nome.trim()); setXp(0); setCaixa(25000); setMargem(18.0); setCompliance(100);
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
    setGameStarted(true); setIsGameOver(false); setDreMode('none');
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false); setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setIsGameOver(false); setDreMode('none'); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Você vai zerar seu CNPJ e reiniciar do zero. Confirma?")) {
      setXp(0); setCaixa(25000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setUsedQuestionIds([]);
      setFeedback(null); setIsGameOver(false); setLastImpacts(null); setPhaseReward(null);
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
      setDreProLabore(3000); setDreMarketing(800); setDreTaxas(900); setDreMode('none');
    }
  };

  const caixaBarFill = Math.min(100, (caixa / 80000) * 100);
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
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">A sua Marca</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Seu Nome (Dono/Dona)</label><input type="text" value={playerNameInput} onChange={(e) => setPlayerNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
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
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador de Estratégia PME</p>
          </div>

          <div className="flex bg-[#020617]/50 rounded-lg p-1 mb-6 border border-white/5">
            <button onClick={() => { setAuthMode('login'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'login' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Acessar</button>
            <button onClick={() => { setAuthMode('register'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'register' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Criar Conta</button>
            <button onClick={() => { setAuthMode('forgot'); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-md transition-all ${authMode === 'forgot' ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>Redefinir</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <><div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">Nome Completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
              <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">WhatsApp (Comercial)</label><input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div></>
            )}

            <div className="space-y-1"><label className="text-[10px] text-slate-400 uppercase font-mono">E-mail Corporativo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50" required /></div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] text-slate-400 uppercase font-mono flex justify-between"><span>{authMode === 'forgot' ? 'Nova Senha Segura' : 'Senha de Acesso'}</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-cyan-50 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-500 hover:text-cyan-300 uppercase tracking-widest">{showPassword ? "Ocultar" : "Mostrar"}</button>
              </div>
            </div>

            {authError && <div className="text-red-400 text-[10px] font-mono text-center p-2 rounded bg-red-500/10 border border-red-500/20">{authError}</div>}
            {authSuccess && <div className="text-emerald-400 text-[10px] font-mono text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">{authSuccess}</div>}

            <button disabled={isAuthenticating} type="submit" className={`w-full text-xs font-mono py-3.5 rounded-lg mt-4 transition-all uppercase tracking-widest ${isAuthenticating ? 'opacity-50' : authMode === 'forgot' ? 'bg-amber-950/40 border border-amber-800 text-amber-400 hover:bg-amber-900/60' : 'bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60'}`}>
              {isAuthenticating ? 'PROCESSANDO...' : authMode === 'login' ? 'INICIAR ESTRATÉGIA' : authMode === 'register' ? 'REGISTRAR EMPRESA' : 'REDEFINIR ACESSO'}
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
          <h1 className="text-2xl md:text-4xl font-light text-slate-100 mb-8 uppercase">{caixa <= 0 ? "FALÊNCIA DECRETADA" : "CAOS TRIBUTÁRIO INSTALADO"}</h1>
          <p className="text-slate-300 text-sm md:text-base font-light text-justify border-l-2 border-red-500 pl-4 mb-8">{feedback}</p>
          <button onClick={handleResetCareer} className="bg-red-950/50 border border-red-800 text-red-400 text-xs font-mono py-4 px-10 rounded-xl uppercase">Recomeçar e Mudar a Gestão</button>
        </div>
      </div>
    );
  }

  // --- TELA DA DRE VIVA ---
  if (dreMode !== 'none') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative font-sans overflow-y-auto">
        <div className="z-10 bg-[#0f172a]/95 p-6 md:p-10 rounded-3xl border border-cyan-900/50 max-w-3xl w-full shadow-2xl my-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-slate-100 uppercase tracking-widest">Painel de <span className="font-semibold text-cyan-400">Controle DRE</span></h1>
            <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase">Visão do Dono. Ajuste as despesas. {dreMode === 'end-month' && "O mês virou, o lucro será injetado HOJE!"}</p>
          </div>

          <div className="bg-[#020617]/50 rounded-xl border border-slate-800 overflow-hidden mb-6">
            <div className="grid grid-cols-2 text-[10px] font-mono uppercase text-slate-500 bg-slate-900/50 p-3 border-b border-slate-800"><div>Estrutura Baseada na sua Gestão</div><div className="text-right">Projeção do Ciclo (R$)</div></div>
            <div className="p-4 space-y-3 font-mono text-xs text-slate-300">
               <div className="flex justify-between items-center"><span className="text-cyan-400 font-bold">1. RECEITA BRUTA (Vendas Reais)</span><span className="font-bold">{formatBRL(dreReceita)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) Impostos & CMV</span><span>{formatBRL(dreCustosVariaveis)}</span></div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-800/50 text-amber-400 font-semibold"><span>3. MARGEM DE CONTRIBUIÇÃO ({formatPct(margem)})</span><span>{formatBRL(dreMargemContribuicao)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500 mt-2"><span>(-) Custos Fixos Base (Aluguel, Luz)</span><span>{formatBRL(dreCustoFixoBase)}</span></div>
               
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-1 rounded"><span>(-) Seu Pró-labore (Retirada Fixa)</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-1 rounded"><span>(-) Marketing (Tráfego Pago)</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-1 rounded"><span>(-) Taxas Maquininha/Empréstimo</span><span>{formatBRL(dreTaxas)}</span></div>
               
               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${dreLucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">5. LUCRO LÍQUIDO (Gerador de Caixa)</span><span>{dreLucroLiquido >= 0 ? '+' : ''}{formatBRL(dreLucroLiquido)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8 bg-[#020617]/30 p-5 rounded-xl border border-white/5">
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-emerald-400">Regular o seu Pró-Labore</span><span className="text-slate-400">{formatBRL(dreProLabore)}</span></div>
               <input type="range" min="0" max="15000" step="500" value={dreProLabore} onChange={(e) => setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
               <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono">Retiradas muito altas para PME secam o caixa da PJ antes do tempo.</p>
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-blue-400">Verba de Crescimento (Tráfego Pago)</span><span className="text-slate-400">{formatBRL(dreMarketing)}</span></div>
               <input type="range" min="0" max="5000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Taxas Bancárias (Pare de antecipar!)</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="4000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </div>
          
          {dreMode === 'end-month' ? (
             <button onClick={handleInjetarLucroEndMonth} className="w-full bg-emerald-900/50 border border-emerald-800 text-emerald-400 hover:bg-emerald-800/60 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Injetar Lucro Real e Iniciar Novo Ciclo</button>
          ) : (
             <button onClick={handleSalvarDREMidMonth} className="w-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/50 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Salvar Estrutura e Voltar para a Operação</button>
          )}
        </div>
      </div>
    );
  }

  if (!currentScenario) return <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4"><div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div><h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Lendo as Dores do seu Mercado...</h2></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Caixa Líquido (Fôlego)</span><span className={`text-xs font-bold font-mono ${caixa > 30000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${caixa > 20000 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Margem (Lucratividade)</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Maturidade do Dono</span><span className="text-xs font-bold font-mono text-purple-400">{currentLevel.title}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${progressToNext}%` }}></div></div></div>
        </div>

        <header className="bg-[#0f172a]/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">Dono(a) do Negócio: <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">Ciclo Financeiro — Decisão {currentStage + 1}/10</p></div>
            <div className="h-1 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${monthProgress}%` }}></div></div>
          </div>
        </header>

        {!feedback ? (
          <main className="bg-[#0f172a]/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 mt-2 gap-4">
              <div>
                <span className="text-cyan-600 font-mono text-[10px] uppercase font-semibold block mb-1">{currentScenario.sector}</span>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide">{currentScenario.title}</h2>
              </div>
              <button onClick={handleConsultoria} disabled={showConsultoriaHint} className="bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/60 text-amber-500 text-[10px] font-mono tracking-widest uppercase py-3 px-5 rounded-lg transition-all disabled:opacity-50 shadow-lg whitespace-nowrap">
                💎 Pedro Monte (R$ 1.500)
              </button>
            </div>

            {showConsultoriaHint && (
              <div className="mb-6 bg-amber-950/20 border-l-2 border-amber-500 p-5 rounded-r-lg shadow-inner">
                <p className="text-amber-400 text-[11px] font-mono uppercase mb-2 flex items-center gap-2"><span>👁️</span> Mentoria Estratégica Injetada (+25 XP):</p>
                <p className="text-slate-300 text-sm font-light italic leading-relaxed">"{currentScenario.consultoriaHint}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. Choque de Gestão (A Teoria)</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/40">
                <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 2. O Estouro na Mesa (A Prática)</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify">{currentScenario.context}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">Risco de Borda: <span className="text-slate-400">{currentScenario.character}</span></p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Execute a Visão do Dono(a):</h3>
              {currentScenario.options.map((option: any, index: number) => (
                <button key={index} disabled={isEvaluatingChoice} onClick={() => handleOptionSelect(option)} className="w-full text-left p-5 rounded-xl bg-[#020617]/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-[#081229] transition-all group relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                  <p className="text-slate-300 text-[13px] font-light group-hover:text-cyan-50 transition-colors leading-relaxed pl-2 text-justify">{option.text}</p>
                </button>
              ))}
            </div>
          </main>
        ) : (
          <div className="bg-[#0f172a]/60 p-8 md:p-12 rounded-2xl border border-white/5 text-center shadow-2xl">
            <h2 className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-4 mt-2 ${lastXpChange && lastXpChange > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'Maturidade Comprovada' : 'Falta de Visão Cobrou o Preço'}
            </h2>
            <div className="text-4xl md:text-5xl font-light text-slate-100 mb-6 font-mono">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} <span className="text-xl text-slate-600">XP</span>
            </div>

            {lastImpacts && (
              <div className="flex justify-center gap-8 mb-8 border-y border-white/5 py-6 bg-[#020617]/30">
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto Caixa Real</p><p className={`font-mono text-lg font-bold ${lastImpacts.caixa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{lastImpacts.caixa >= 0 ? '+' : ''}{formatBRL(lastImpacts.caixa)}</p></div>
                 <div><p className="text-[9px] uppercase font-mono text-slate-500 mb-1">Impacto na Margem</p><p className={`font-mono text-lg font-bold ${lastImpacts.margem >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{lastImpacts.margem >= 0 ? '+' : ''}{formatPct(lastImpacts.margem)}</p></div>
              </div>
            )}

            {phaseReward && (
              <div className={`mb-8 p-6 rounded-xl border text-left max-w-2xl mx-auto ${phaseReward.includes("🏆") ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-red-950/20 border-red-800/50'}`}>
                 <h3 className={`text-[11px] font-mono uppercase tracking-widest mb-2 ${phaseReward.includes("🏆") ? 'text-emerald-400' : 'text-red-400'}`}>
                   {phaseReward.includes("🏆") ? 'Ouro Desbloqueado na Empresa:' : 'Alerta do Mentor Pedro Monte:'}
                 </h3>
                 <p className="text-slate-200 text-sm font-light leading-relaxed">{phaseReward}</p>
              </div>
            )}

            <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-3xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-cyan-400 font-mono border border-slate-700/50 rounded-md">Feedback Operacional:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={proceedToNextQuestion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              {currentStage === 9 ? "Consolidar DRE e Virar o Mês" : "Prosseguir na Operação"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={() => setDreMode('mid-month')} className="text-[9px] text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] font-bold">📊 Ajustar Custo Fixo (DRE Livre)</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Sair da Ferramenta</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Zerar Histórico</button>
        </div>

      </div>
    </div>
  );
}