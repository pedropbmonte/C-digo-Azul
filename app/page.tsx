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

// --- BANCO DE DADOS MASSIVO DE ALTA PROFUNDIDADE (Sem IA) ---
const questionBank = [
  // TIER 1 - A BASE DA SOBREVIVÊNCIA E CAIXA
  {
    id: "t1_caixa_01", tier: 1, sector: "Sobrevivência Financeira", title: "A Sangria Silenciosa",
    theory: "O maior mito do pequeno negócio é achar que 'o que sobra no banco dia 30 é o lucro'. Misturar contas PF e PJ mascara seu Ponto de Equilíbrio. Se a empresa paga a conta de luz da sua casa e o colégio dos filhos direto no CNPJ, você não sabe se o seu negócio dá lucro ou se você é apenas um funcionário caro da sua própria desorganização.",
    context: "Sexta-feira, 16h. O caixa da PJ tem R$ 4.000. O vale semanal dos funcionários amanhã soma R$ 6.000. Ao checar o extrato, você constata que passou R$ 3.500 no cartão corporativo para pagar compras de supermercado e lazer da sua família nesta semana.",
    character: "O Extrato Implacável",
    consultoriaHint: "Dono que assalta a própria empresa vira refém de banco. Devolva o capital para a PJ hoje. Pague sua equipe. O seu luxo na Pessoa Física precisa ser cortado até a empresa ter Margem de Contribuição real para te pagar.",
    options: [
      { id: "A", text: "Injetar dinheiro do próprio bolso (PF) na PJ hoje, pagar a equipe amanhã e instituir uma retirada de pró-labore fixa e austera a partir de segunda-feira.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Você separou os bolsos, honrou o acordo com a equipe e travou o sangramento.", reward: "🏆 Trava de Retirada: Seu sistema agora impede o pagamento de boletos de CPF dentro da conta PJ.", lesson: "" },
      { id: "B", text: "Acionar o limite rotativo (cheque especial) da conta PJ para cobrir a equipe, sem precisar cortar seus gastos pessoais no fim de semana.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -2.5, compliance: -10 }, feedback: "A ILUSÃO. Você acabou de tomar dívida cara na PJ para financiar um luxo insustentável na PF.", reward: "", lesson: "A dívida da empresa não existe para sustentar o ego do dono." },
      { id: "C", text: "Atrasar o vale da equipe dizendo que 'o mercado está retraído essa semana' e pedir compreensão.", xp: -40, isBest: false, impacts: { caixa: -2000, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL. Sua equipe sabe a verdade. Um time com fome não atende cliente com sorriso.", reward: "", lesson: "A desmotivação da base é o primeiro sintoma da quebra." }
    ]
  },
  {
    id: "t1_maq_02", tier: 1, sector: "Capital de Giro", title: "A Ilusão da Venda Esculpida",
    theory: "Vender não é receber. Antecipar recebíveis de maquininha não é gerar caixa, é agiotagem legalizada. Se a sua Margem de Contribuição é de 15% e você paga 5% ao mês de taxa de antecipação, você está entregando um terço do seu esforço apenas para ter o próprio dinheiro mais cedo.",
    context: "Você acaba de comemorar uma venda de R$ 15.000 parcelada em 10x sem juros para um ótimo cliente. Porém, o boleto do fornecedor dessa mesma mercadoria vence na segunda-feira e seu saldo atual é zero.",
    character: "O Custo Financeiro",
    consultoriaHint: "Nunca antecipe para cobrir furo. Antecipação é remédio amargo, não vitamina diária. Ligue para o fornecedor, alongue o prazo dele e crie uma campanha PIX relâmpago hoje.",
    options: [
      { id: "A", text: "Ser transparente com o fornecedor para renegociar o boleto para 15 dias e lançar uma promoção relâmpago via PIX na sua base para levantar liquidez.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA DE CAIXA. Você preservou a margem da grande venda e esticou o seu passivo de forma honesta.", reward: "🏆 Visão de Liquidez: Você aprendeu a fazer injeção de caixa rápido sem depender dos bancos.", lesson: "" },
      { id: "B", text: "Apertar o botão de antecipação no app da maquininha, pagando 6% de taxa total para ter o dinheiro na segunda-feira de manhã.", xp: -5, isBest: false, impacts: { caixa: 0, margem: -3.0, compliance: 0 }, feedback: "A ARMADILHA DO CONFORTO. Você resolveu o problema de segunda-feira, mas rasgou o lucro da semana inteira.", reward: "", lesson: "O botão de antecipar é o botão de autodestruição da margem." },
      { id: "C", text: "Pagar o fornecedor com o cartão de crédito corporativo, somando os juros do cartão com o custo do produto.", xp: -45, isBest: false, impacts: { caixa: -3000, margem: -5.0, compliance: -20 }, feedback: "BOLA DE NEVE FATAL. Custo financeiro sobre custo financeiro.", reward: "", lesson: "Pegar fogo para apagar incêndio só gera cinzas." }
    ]
  },
  {
    id: "t1_preco_03", tier: 1, sector: "Precificação Cega", title: "O Teto de Vidro do Vizinho",
    theory: "A fórmula da falência: Preço de Venda = Preço do Concorrente. O seu concorrente pode ter aluguel mais barato, sonegar impostos ou simplesmente estar quebrando. Se você baliza seu preço pelo dele sem conhecer seu próprio Custo Fixo e Variável (Markup real), você está pagando para o cliente levar seu produto.",
    context: "O seu produto mais vendido custa R$ 80. O fornecedor enviou e-mail avisando que o custo de reposição sobe 15% amanhã. A loja vizinha vende o mesmo produto por R$ 75. Você tem pavor de reajustar e perder a clientela.",
    character: "O Medo da Precificação",
    consultoriaHint: "Quem atrai por preço, por preço perde. Não absorva inflação. Repasse o aumento amanhã de manhã. Deixe os clientes 'sugadores de desconto' irem afundar a margem do seu concorrente.",
    options: [
      { id: "A", text: "Repassar o aumento imediatamente para a tabela, treinar o time para justificar com qualidade de entrega e aceitar a perda dos clientes focados apenas em preço.", xp: 35, isBest: true, impacts: { caixa: 3000, margem: 2.5, compliance: 10 }, feedback: "MATURIDADE COMERCIAL. Faturamento é ego; Margem é oxigênio. Você limpou sua carteira.", reward: "🏆 Filtro de Posicionamento: Sua marca agora atrai o cliente que busca valor, não o caçador de esmolas.", lesson: "" },
      { id: "B", text: "Absorver o custo de 15% temporariamente 'até ver se o mercado vai aceitar' e manter a tabela congelada.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -3.0, compliance: 0 }, feedback: "SANGRAMENTO VOLUNTÁRIO. Você decidiu tirar dinheiro do próprio bolso por medo de vender.", reward: "", lesson: "O medo de perder uma venda é o que mais fecha empresas no Brasil." },
      { id: "C", text: "Baixar o seu preço para R$ 70 na tentativa agressiva de quebrar o vizinho, apostando que vai 'ganhar no giro'.", xp: -50, isBest: false, impacts: { caixa: -8000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO MATEMÁTICO. Vender volume com margem de contribuição negativa acelera sua quebra.", reward: "", lesson: "Volume não conserta precificação podre." }
    ]
  },
  {
    id: "t1_rh_04", tier: 1, sector: "Gestão de Pessoas", title: "O Custo Oculto da Pena",
    theory: "Empresa não é ONG e o CNPJ não tem coração, tem DRE. Manter um funcionário incompetente porque 'ele é uma boa pessoa' ou 'precisa do emprego' destrói o moral da equipe inteira. Os bons profissionais percebem a injustiça quando carregam o peso do colaborador ineficiente nas costas.",
    context: "Você tem um atendente que é muito simpático, amigo da sua família, mas que chega atrasado dia sim, dia não. Hoje, por desorganização dele, um pedido importante foi enviado errado e o cliente cancelou uma compra de R$ 3.000.",
    character: "O Clima Organizacional",
    consultoriaHint: "Pessoas boas de coração, mas ruins de execução, quebram empresas de dentro para fora. Seja rápido na demissão. Respeito é dar o feedback e liberar ele para o mercado.",
    options: [
      { id: "A", text: "Chamar para o desligamento hoje. Pagar as rescisões corretamente, assumir a perda e contratar alguém focado em performance.", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 1.5, compliance: 15 }, feedback: "POSTURA DE LÍDER. Cortou o membro infeccionado antes de perder o braço.", reward: "🏆 Cultura de Performance: O resto da equipe percebeu que o amadorismo não tem mais espaço.", lesson: "" },
      { id: "B", text: "Dar uma bronca severa, mas mantê-lo na equipe porque 'demitir agora custa caro em rescisão'.", xp: -10, isBest: false, impacts: { caixa: -1000, margem: -1.0, compliance: -5 }, feedback: "COVARDIA FINANCEIRA. O custo invisível do erro dele é muito maior que a rescisão.", reward: "", lesson: "O problema que você ignora é o limite do seu crescimento." },
      { id: "C", text: "Descontar o valor da venda perdida (R$ 3.000) do salário dele no fim do mês como punição.", xp: -45, isBest: false, impacts: { caixa: 1000, margem: -2.0, compliance: -30 }, feedback: "PASSIVO TRABALHISTA GERADO. Punição ilegal que vai render um processo muito mais caro.", reward: "", lesson: "Justiça não se faz com as próprias mãos no RH." }
    ]
  },
  
  // TIER 2 - ORGANIZAÇÃO, PROCESSOS E ESTOQUE
  {
    id: "t2_estoque_01", tier: 2, sector: "Gestão de Estoque", title: "O Dinheiro Congelado na Prateleira",
    theory: "O Representante de Vendas trabalha para a comissão dele, não para o seu fluxo de caixa. O canto da sereia do 'desconto de volume' leva PMEs a comprarem mercadoria para 6 meses. Estoque que não gira (Curva C) é dinheiro no ralo da inflação e da obsolescência.",
    context: "Você tem R$ 20.000 de capital totalmente imobilizado em mercadorias de giro lento no fundo da loja. O aluguel vence amanhã (R$ 6.000) e a conta bancária tem apenas R$ 1.500.",
    character: "O Boleto do Ponto",
    consultoriaHint: "Lucro no papel não paga boleto. Mercadoria encalhada é erro do passado cobrando a conta hoje. Queime esse estoque a preço de custo. Converta pó em dinheiro.",
    options: [
      { id: "A", text: "Rodar uma 'Queima de Estoque' agressiva pelo WhatsApp hoje. Vender a preço de custo (zero lucro) para transformar as caixas em R$ 6.000 de liquidez.", xp: 35, isBest: true, impacts: { caixa: 7000, margem: -1.0, compliance: 10 }, feedback: "DOR DA APRENDIZAGEM. Você engoliu o ego, assumiu a compra mal feita e salvou o aluguel.", reward: "🏆 Oxigênio de Caixa: Você entendeu a mecânica de liquidar ativos parados.", lesson: "" },
      { id: "B", text: "Manter o preço cheio, torcer para o cliente aparecer e pagar o aluguel utilizando o limite do cheque especial.", xp: -15, isBest: false, impacts: { caixa: -2500, margem: -1.5, compliance: -5 }, feedback: "ILUSÃO CONTÁBIL. Trocou um problema de estoque por uma dívida de banco a 8% ao mês.", reward: "", lesson: "A esperança não é uma estratégia de negócios válida." },
      { id: "C", text: "Acionar o fornecedor e comprar mais mercadorias (Curve A) no boleto parcelado, tentando criar um combo para 'desovar' o estoque velho.", xp: -40, isBest: false, impacts: { caixa: -12000, margem: -4.0, compliance: -15 }, feedback: "O ABISMO. Tentou curar um envenenamento tomando mais veneno.", reward: "", lesson: "Não se resolve falta de caixa gerando novos passivos de curto prazo." }
    ]
  },
  {
    id: "t2_inadimp_02", tier: 2, sector: "Inadimplência", title: "O Fiado do 'Parceiro' Fiel",
    theory: "Dono de negócio não é banco sem juros. O medo de cobrar o 'cliente parceiro' destrói o capital de giro da PME. Se o cliente sempre compra muito, mas nunca paga no prazo, ele te encontrou como fonte de financiamento gratuito para a operação dele.",
    context: "Um dos seus clientes mais frequentes está devendo R$ 9.000 há 40 dias. Você não cobrou para 'não ficar chato'. Hoje ele enviou uma mensagem pedindo uma remessa urgente de mais R$ 5.000 para amanhã de manhã.",
    character: "O Calote Disfarçado",
    consultoriaHint: "Trave a esteira imediatamente. Passivo não é cliente. Não existe venda nova com título antigo em aberto. Aproxime-se do atrito.",
    options: [
      { id: "A", text: "Responder cordialmente mas com firmeza: 'Parceiro, a liberação de crédito para nova remessa está travada no sistema até a baixa do título anterior'.", xp: 35, isBest: true, impacts: { caixa: 6000, margem: 1.0, compliance: 15 }, feedback: "POSTURA EXECUTIVA. Você cortou a sangria e expôs o blefe do devedor.", reward: "🏆 A Régua Implacável: Instituída a política de tolerância zero para liberação sem quitação.", lesson: "" },
      { id: "B", text: "Entregar o novo pedido de R$ 5.000 e enviar um áudio pedindo 'pelo amor de Deus' para ele tentar depositar uma parte da dívida semana que vem.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -1.5, compliance: -10 }, feedback: "SUBMISSÃO TÁTICA. Você acabou de validar que na sua empresa não há regras ou respeito.", reward: "", lesson: "Quem tem pena do devedor, acorda devendo." },
      { id: "C", text: "Entregar o pedido e, em segredo, descontar uma duplicata no banco (tomando juros no seu CNPJ) para cobrir o buraco de R$ 9.000.", xp: -45, isBest: false, impacts: { caixa: -9000, margem: -4.0, compliance: -20 }, feedback: "O CAMINHO DA RUÍNA. Transferiu a dívida do cliente irresponsável para o seu nome.", reward: "", lesson: "O banco nunca esquece de cobrar. O seu cliente, sim." }
    ]
  },
  {
    id: "t2_processo_03", tier: 2, sector: "Processos e Software", title: "O Sistema Milagroso",
    theory: "Software não organiza bagunça, ele digitaliza a bagunça. Muitos pequenos empresários gastam rios de dinheiro contratando ERPs complexos achando que a ferramenta fará o trabalho de gestão por eles.",
    context: "Sua empresa paga R$ 900 mensais em um ERP completo, cheio de gráficos. Porém, você descobre que há 3 meses a equipe só anota as vendas num caderno porque acham o sistema 'difícil de lançar na pressa'.",
    character: "A Falsa Automação",
    consultoriaHint: "Processo vem antes da ferramenta. Cancele o supérfluo, defina a regra básica (vendeu, lançou) e só pague por sistemas quando a equipe tiver a disciplina engrenada.",
    options: [
      { id: "A", text: "Cancelar o plano premium. Fazer o 'downgrade' para o básico e treinar exaustivamente a equipe. Se não lançar, a venda não comissiona.", xp: 30, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 10 }, feedback: "RACIONALIDADE DIRETA. Você não brigou com o papel, alinhou os incentivos da equipe.", reward: "🏆 Gestão à Vista: A cultura de dados começa no hábito, não no preço do software.", lesson: "" },
      { id: "B", text: "Manter pagando o sistema 'para não perder o histórico' e pedir paciência até a equipe se acostumar naturalmente.", xp: -10, isBest: false, impacts: { caixa: -900, margem: -0.5, compliance: -5 }, feedback: "DESPERDÍCIO PASSIVO. Eles nunca vão 'se acostumar' se não houver cobrança do dono.", reward: "", lesson: "Omissão de gestão custa o preço de uma mensalidade." },
      { id: "C", text: "Jogar o sistema fora e voltar 100% para o caderno de papel para evitar o estresse no balcão.", xp: -35, isBest: false, impacts: { caixa: -2500, margem: -1.0, compliance: -15 }, feedback: "O RETROCESSO. Aceitou a cegueira financeira porque a equipe não quer digitar.", reward: "", lesson: "Empresa sem dados é um navio na tempestade sem radar." }
    ]
  },
  {
    id: "t2_tesoura_04", tier: 2, sector: "Fluxo de Caixa", title: "O Efeito Tesoura",
    theory: "É aqui que a empresa que mais vende quebra. O 'Efeito Tesoura' ocorre quando o seu Prazo Médio de Recebimento (vender em 10x) é muito maior que o seu Prazo Médio de Pagamento (comprar do fornecedor em 30 dias). O crescimento drena sua liquidez.",
    context: "O mês foi histórico! R$ 60.000 em vendas. Tudo parcelado em 6x sem juros. Mas a fatura de reposição de estoque chega amanhã e custa R$ 25.000. O caixa está negativo.",
    character: "O Paradoxo do Crescimento",
    consultoriaHint: "Inverta o ciclo. Encurte os prazos do cliente oferecendo vantagens para capital à vista, e negocie alongamento com fornecedores. Freie a venda a prazo longa.",
    options: [
      { id: "A", text: "Criar imediatamente 'Desconto Assoalho' para pagamentos PIX/Débito, limitar novas vendas a 3x e pedir carência para o fornecedor este mês.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 1.0, compliance: 10 }, feedback: "CONTROLE DE ROTAÇÃO. Você freou as vendas tóxicas e chamou dinheiro rápido pra base.", reward: "🏆 O Ciclo Positivo: O dinheiro agora entra antes da conta de reposição chegar.", lesson: "" },
      { id: "B", text: "Comemorar o recorde de vendas e pegar Capital de Giro no banco para cobrir o buraco das parcelas a receber.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -3.0, compliance: -10 }, feedback: "A ARMADILHA CLÁSSICA. Pagou juros caros porque vendeu muito. O banco agradece seu esforço.", reward: "", lesson: "Vender a prazo com o dinheiro do banco não é vender, é repassar juros." },
      { id: "C", text: "Deixar de pagar o fornecedor, alegando que 'ele tem que entender que o comércio tá difícil', esperando as faturas dos clientes caírem.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -2.0, compliance: -25 }, feedback: "QUEIMA DE CRÉDITO. Seu CNPJ negativado impede compras futuras. A roda travou de vez.", reward: "", lesson: "O crédito na praça é o maior ativo invisível do empreendedor." }
    ]
  },

  // TIER 3 - GESTÃO DO TEMPO, ESCALA E CUSTOS INVISÍVEIS
  {
    id: "t3_gargalo_01", tier: 3, sector: "Custo de Oportunidade", title: "A Prisão do 'Ninguém faz como eu'",
    theory: "O teto de crescimento da sua empresa é o tamanho da sua agenda. Dono que varre o chão, embala pedido e envia boleto está cobrando R$ 300/hora de si mesmo para fazer o serviço de R$ 15/hora. O medo de delegar e errar garante que você continue pequeno para sempre.",
    context: "Sua receita empacou. A jornada é de 14h. O WhatsApp comercial acumula 50 mensagens não lidas porque você passou a tarde arrumando planilhas de cobrança e atendendo balcão.",
    character: "O Teto de Vidro",
    consultoriaHint: "Assuma o aumento de Custo Fixo e terceirize/delegue o operacional. A sua energia livre será revertida em alianças comerciais, prospecção e visão de lucro.",
    options: [
      { id: "A", text: "Contratar imediatamente um assistente operacional. Desenhar o processo básico, aceitar que ele fará 80% tão bem quanto você, e focar em Vendas.", xp: 40, isBest: true, impacts: { caixa: -2500, margem: 3.5, compliance: 10 }, feedback: "A CORAGEM DA ESCALA. O Custo Fixo subiu hoje, mas a receita vai multiplicar porque o CEO voltou ao jogo.", reward: "🏆 Tempo de Dono: Você destravou sua agenda para olhar o painel de controle do negócio.", lesson: "" },
      { id: "B", text: "Contratar um 'freelancer estagiário' muito barato apenas para apagar os incêndios de noite, sem compromisso.", xp: -5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "A MEIA SOLUÇÃO. O estagiário sem treinamento só piorou o serviço. O gargalo diurno continua.", reward: "", lesson: "Mão de obra barata sem processo custa o dobro em refação." },
      { id: "C", text: "Continuar na mesma rotina, alegando que 'mão de obra tá difícil' e simplesmente fechar a loja mais cedo para conseguir dormir.", xp: -40, isBest: false, impacts: { caixa: -6000, margem: -4.0, compliance: -10 }, feedback: "O SUICÍDIO LENTO. Você aceitou o limite máximo da sua empresa. Os concorrentes agradecem.", reward: "", lesson: "O orgulho de ser o 'melhor peão' da própria empresa destrói o CNPJ." }
    ]
  },
  {
    id: "t3_refem_02", tier: 3, sector: "Gestão de Riscos (RH)", title: "O Sequestro da Operação",
    theory: "O Risco Chave. Dependência absoluta de um único fornecedor, cliente ou funcionário é a morte anunciada. Quando um 'colaborador estrela' percebe que detém o conhecimento exclusivo de processos vitais, o balanço de poder inverte. Ele passa a ser o dono da empresa sem assumir os riscos.",
    context: "Seu principal vendedor gerencia sozinho 50% das grandes contas. Hoje ele pediu uma reunião de emergência: 'Ou tenho 40% de aumento no meu fixo amanhã, ou vou aceitar a proposta do concorrente da outra rua'.",
    character: "O Ultimato Interno",
    consultoriaHint: "O terrorista não quer dinheiro, quer o controle. Conceda bônus variável para ganhar 30 dias de paz, sugue as informações dele para o papel e contrate dois juniors para fracionar a carteira. Pulverize o monstro.",
    options: [
      { id: "A", text: "Negar o aumento fixo, mas oferecer agressivo bônus em cima de metas reais. Imediatamente documentar os acessos e iniciar a seleção de novos executivos.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 1.0, compliance: 20 }, feedback: "MANOBRA EXECUTIVA. Você não cedeu à chantagem estrutural, blindou seu passivo trabalhista e iniciou a pulverização.", reward: "🏆 Empresa Despersonalizada: Os processos da sua empresa agora valem mais do que o CPF que os executa.", lesson: "" },
      { id: "B", text: "Conceder o aumento de 40% imediatamente, engolindo o orgulho, pelo pavor absurdo de perder a receita que ele traz.", xp: -25, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: -15 }, feedback: "SEQUESTRO BEM SUCEDIDO. Você acabou de transferir a propriedade da sua empresa para ele.", reward: "", lesson: "Quem cede ao terrorismo de um, perde o respeito dos outros nove." },
      { id: "C", text: "Demiti-lo aos gritos no meio do salão para mostrar quem manda e tentar ligar para os 50 clientes pessoalmente no dia seguinte.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -5.0, compliance: -20 }, feedback: "A BURRICE DO EGO. Atitude emocional que gerou um rombo de 50% na receita e um processo de assédio moral.", reward: "", lesson: "Um líder ofendido é a criatura mais cara da face da terra." }
    ]
  },
  {
    id: "t3_crise_03", tier: 3, sector: "Reputação e Vendas", title: "A Crise Silenciosa (Google)",
    theory: "O boca a boca mudou. Se a sua pontuação online cai abaixo de 4.0, a conversão de novos clientes desaba silenciosamente e você não sabe o porquê. Reputação online não é vaidade, é conversão pura na Margem Final.",
    context: "Você não acompanhava o Google Meu Negócio. Um ex-funcionário revoltado criou 15 perfis fakes na madrugada e detonou as avaliações da sua empresa chamando o produto de lixo. A nota caiu de 4.8 para 2.4.",
    character: "O Algoritmo de Busca",
    consultoriaHint: "Controle os danos. Não brigue na internet. Faça relatórios no Google pedindo a remoção, mas ative uma campanha massiva com os seus 100 melhores clientes atuais pedindo reviews de 5 estrelas urgentes para soterrar o ataque.",
    options: [
      { id: "A", text: "Denunciar ao Google as avaliações fakes, emitir respostas neutras e cordiais, e pedir suporte emergencial aos clientes fiéis para avaliarem a marca hoje.", xp: 35, isBest: true, impacts: { caixa: 2500, margem: 1.5, compliance: 15 }, feedback: "CONTROLE DE DANOS PERFEITO. A maturidade vence o troll. O exército de clientes bons anulou o ataque.", reward: "🏆 A Muralha Digital: Sua autoridade comercial foi testada e saiu muito mais forte.", lesson: "" },
      { id: "B", text: "Entrar em cada avaliação falsa e xingar o autor, acusando-o criminalmente no fórum público do Google.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: -10 }, feedback: "A LAMA. O cliente potencial não sabe o que aconteceu, ele apenas viu o dono da empresa desequilibrado xingando online.", reward: "", lesson: "Nunca lute com um porco na lama. Você se suja e o porco adora." },
      { id: "C", text: "Deletar todo o perfil do Google Meu Negócio para 'sumir com o problema de uma vez por todas'.", xp: -50, isBest: false, impacts: { caixa: -12000, margem: -4.0, compliance: -20 }, feedback: "O APAGÃO COMERCIAL. Você deletou a fachada digital da sua loja. Ninguém te acha mais.", reward: "", lesson: "Sumir do mapa não resolve o problema, só elimina as soluções." }
    ]
  },
  {
    id: "t3_inflacao_04", tier: 3, sector: "Custos Invisíveis", title: "A Cegueira do Custo Fixo",
    theory: "A inflação é como o cupim: corrói a casa por dentro sem você ver. Energia, aluguel (IGPM/IPCA), dissídio sindical e gasolina aumentaram. Se a sua tabela de preços e serviços tem a mesma 'cara' há 2 anos, a sua margem foi devorada e o lucro líquido virou pó.",
    context: "O fechamento dos últimos 3 meses mostrou lucro R$ 0,00 (empate), mesmo com as vendas normais. O contador avisou que os custos de operação da empresa (Custo Fixo) subiram 18% nos últimos 12 meses. Você não reajustou a tabela.",
    character: "O Desgaste da Margem",
    consultoriaHint: "O preço é o único pilar que joga dinheiro PARA DENTRO da DRE. O resto todo joga para fora. Seus clientes vão chiaram? Sim. Mas perder venda ruim é melhor que vender muito dando prejuízo. Reajuste hoje.",
    options: [
      { id: "A", text: "Convocar a equipe comercial, reajustar a tabela imediatamente em 18%, treinar as objeções focando na excelência da entrega e aceitar a perda dos 'clientes de preço'.", xp: 40, isBest: true, impacts: { caixa: 6000, margem: 3.5, compliance: 10 }, feedback: "A CORAGEM DA ESCALA. Você protegeu a entidade que alimenta todos vocês. Vender valor, e não preço, salva o jogo.", reward: "🏆 Reposicionamento de Valor: O cliente ruim saiu, o cliente bom ficou e o lucro voltou a respirar.", lesson: "" },
      { id: "B", text: "Diminuir drasticamente a qualidade dos materiais entregues ao cliente (comprar fornecedor C) para economizar 18% e manter a mesma tabela de sempre.", xp: -25, isBest: false, impacts: { caixa: 0, margem: -2.0, compliance: -15 }, feedback: "A DESTRUIÇÃO DO SEU NOME. Você resolveu a margem por 2 meses sacrificando o boca a boca do serviço.", reward: "", lesson: "O cliente pode perdoar o preço alto, mas jamais perdoa a queda de qualidade." },
      { id: "C", text: "Ignorar os custos fixos, manter a tabela velha e dobrar agressivamente os gastos em tráfego pago (Ads) para tentar fechar a conta empurrando volume de vendas.", xp: -45, isBest: false, impacts: { caixa: -15000, margem: -5.0, compliance: -10 }, feedback: "O VOO DO PATO. Escalar venda de um modelo que sangra é sangrar mais rápido. Queimou caixa em Ads à toa.", reward: "", lesson: "Crescer dando prejuízo em cada unidade só aproxima você do penhasco." }
    ]
  },

  // TIER 4 - DIRETORES, ESTRATÉGIA TRIBUTÁRIA E B2B
  {
    id: "t4_tributos_01", tier: 4, sector: "Estratégia Tributária", title: "A Trava do Simples Nacional",
    theory: "O maior gargalo do país não é a política, é a mente escassa do empreendedor. Congelar as vendas no fim do ano, ou pior, emitir nota meia-boca por medo de 'pular de faixa' no limite de faturamento é a receita certa para jogar na série B para sempre.",
    context: "Chegou o fim de novembro. Sua empresa faturou R$ 4.750.000,00 no ano, encostando no teto limite do Simples Nacional (R$ 4.8M). O comercial fechou 3 grandes contratos na B2B (R$ 600k totais) que estouram a faixa e jogam você no Lucro Presumido para o ano que vem.",
    character: "O Salto do Faturamento",
    consultoriaHint: "Qual é a sua escolha? Ficar pequeno para sempre ou crescer, pagar a alíquota pesada e construir um império? Desenquadre com honra. Abrace o Lucro Presumido, mude a estrutura de preços do ano que vem e vá pra cima.",
    options: [
      { id: "A", text: "Assinar os contratos, avisar o contador para iniciar o processo de migração para o Lucro Presumido, reformular a planilha de Mark-up com a nova carga e acelerar o comercial.", xp: 40, isBest: true, impacts: { caixa: 25000, margem: 1.5, compliance: 30 }, feedback: "A MUDANÇA DE SÉRIE. Você aceitou a dor do crescimento e deixou o parquinho. Pagou imposto, mas levou toneladas de lucro para casa.", reward: "🏆 A Carteira B2B Validada: Grandes empresas respeitam quem roda em compliance total. Bem-vindo aos grandes.", lesson: "" },
      { id: "B", text: "Pedir aos 3 grandes clientes para atrasarem o faturamento do serviço para o 'ano que vem' para não estourar o limite de dezembro.", xp: -20, isBest: false, impacts: { caixa: -15000, margem: -2.0, compliance: 0 }, feedback: "A ESCASSEZ EMPRESARIAL. O mercado corporativo tem pressa. Você tentou dar o 'jeitinho' e dois contratos foram cancelados na mesa.", reward: "", lesson: "O cliente sério não financia o seu medo tributário." },
      { id: "C", text: "Fechar os contratos normalmente, receber o dinheiro, mas combinar de não emitir nota fiscal de 600 mil reais para mascarar a receita e não sair do Simples.", xp: -50, isBest: false, impacts: { caixa: 30000, margem: -5.0, compliance: -60 }, feedback: "O CRIME FISCAL. Cruzamento da Receita na DIRF B2B acusou discrepância de caixa. Multa de 150%, exclusão do Simples por ofício e inquérito criminal contra os sócios.", reward: "", lesson: "Sonegar imposto B2B não é erro, é assinatura de atestado de falência." }
    ]
  },
  {
    id: "t4_ego_02", tier: 4, sector: "Gestão do Ego", title: "A Ilusão do Crescimento (A SUV Blindada)",
    theory: "O ego destrói mais Caixas Livres do que as crises econômicas. Pico sazonal de 3 meses não é consolidação. Alavancar passivos fixos (salas suntuosas, carros na PJ) usando o fluxo de caixa de uma empresa em amadurecimento remove o fôlego necessário para os meses sombrios.",
    context: "A empresa cravou lucro histórico por três meses. Há R$ 60.000 limpos na conta. Os vendedores estão voando. O gerente do banco ofereceu a linha de crédito CNPJ para a compra da caminhonete importada (parcelas de R$ 6k) que você sempre sonhou para mostrar que a 'empresa deu certo'.",
    character: "O Status Social",
    consultoriaHint: "Dinheiro livre no CNPJ recém chegado precisa virar investimento em 'Fundo de Guerra' com liquidez diária. A vaidade do carro não sustenta o inverno. A SUV importada não vai vender mais para os seus clientes, apenas tirar liquidez da sua operação.",
    options: [
      { id: "A", text: "Agradecer o banco, declinar a oferta e transferir 80% do valor livre (R$ 48k) para um CDI de Liquidez como Reserva de Emergência para tempos difíceis.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.0, compliance: 20 }, feedback: "O VERDADEIRO DIRETOR EXECUTIVO. Em tempos de vacas gordas, estoca-se feno. O carro pode esperar, a segurança da sua equipe não.", reward: "🏆 Blindagem de Capital: O sono tranquilo de um dono que sabe que sobrevive a 6 meses sem vender 1 centavo.", lesson: "" },
      { id: "B", text: "Resolver fazer uma reforma estética imediata e luxuosa na loja inteira à vista, drenando os 60 mil do caixa, 'porque a marca precisa de requinte'.", xp: -25, isBest: false, impacts: { caixa: -60000, margem: 0, compliance: -10 }, feedback: "A BELEZA VULNERÁVEL. Loja de primeiro mundo com caixa de terceiro mundo. Qualquer tropeço de vendas mês que vem vai atrasar a folha.", reward: "", lesson: "Gesso e porcelanato não pagam funcionário." },
      { id: "C", text: "Assinar o contrato de financiamento da SUV pelo CNPJ, dar os R$ 60k de entrada e assumir o passivo longo prazo com alegria.", xp: -50, isBest: false, impacts: { caixa: -60000, margem: -6.0, compliance: -25 }, feedback: "O CANCRO NO FLUXO. Além de zerar o caixa, adicionou 6 mil de saída engessada, juros pesados, IPVA e seguro na conta da empresa.", reward: "", lesson: "A vaidade do dono asfixiou o pulmão da máquina que gera riqueza." }
    ]
  },
  {
    id: "t4_sucessao_03", tier: 4, sector: "Governança (Sucessão)", title: "A Paralisia do Rei",
    theory: "O valor de uma empresa não é o que ela vende hoje, mas como ela roda sem o dono. Se a operação para porque o sócio não assinou um papel ou não transferiu a senha do banco, o modelo de negócios ainda é um 'eu-empreendedor' glorificado.",
    context: "Você viajou para uma feira no exterior (sem sinal de rede no voo por 14h). O dia 5 de pagamento calhou nessa data. O financeiro liga desesperado: há apenas uma chave de aprovação dupla no banco e, sem sua digital/token, 15 funcionários ficarão sem salário amanhã e 3 fornecedores quebrarão contrato.",
    character: "O Processo de Alçada",
    consultoriaHint: "Antecipar cenários e descentralizar com segurança. A empresa de Elite precisa de limites de alçada, contas aprovadoras de dupla checagem com o gerente geral ou contador de confiança. O negócio não pode morrer na poltrona 14B de um avião.",
    options: [
      { id: "A", text: "Mês passado (prevenção): Você havia estabelecido um processo de Alçada no Banco, onde 2 gerentes juntos ou gerente+contador, podem aprovar arquivos CNAB até o limite da folha e impostos. Eles operaram sozinhos no dia 5.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 2.0, compliance: 30 }, feedback: "A MATRIZ CULTURAL DA GOVERNANÇA. O avião decolou e a empresa não sentiu o impacto. Você não é mais o teto da operação.", reward: "🏆 A Empresa Despersonalizada: O negócio opera no trilho dos processos, não na dependência do CPF.", lesson: "" },
      { id: "B", text: "Pagar juros de roaming na conexão satelital, logar correndo do avião, atrasar aprovações por queda de sinal e liberar tudo com meia hora de atraso gerando panico interno.", xp: -15, isBest: false, impacts: { caixa: -500, margem: -1.0, compliance: -10 }, feedback: "O SALVADOR DA PÁTRIA (QUE FALHOU). Resolveu no limite do estresse. Mas o aviso foi dado: sua empresa é uma ilha que afunda sem o farol.", reward: "", lesson: "O microgerenciamento cobra com taquicardia o que não delegou." },
      { id: "C", text: "Deixar senhas completas anotadas num Post-it colado no monitor para a secretária pagar. E o pior: o token físico solto na gaveta.", xp: -50, isBest: false, impacts: { caixa: -35000, margem: -5.0, compliance: -50 }, feedback: "A ROLETA RUSSA JURÍDICA. A falta de proteção estrutural abriu precedente gravíssimo de desvio e quebra de sigilo fiscal.", reward: "", lesson: "A linha entre a informalidade e a ruína mede exatamente 6 dígitos de senha num Post-it." }
    ]
  },
  {
    id: "t4_dividendo_04", tier: 4, sector: "Lucratividade", title: "O Fundo de Guerra vs Distribuição",
    theory: "O lucro contábil é uma ficção se não for gerenciado; a distribuição de dividendos selvagem é o caminho mais rápido para a descapitalização de negócios lucrativos. Extrair todo o lucro no ano bom impede a expansão e o financiamento de teses ousadas no ano seguinte.",
    context: "Você acaba de assinar a DRE anual junto com seu sócio. O Lucro Líquido final pós impostos marcou lindos R$ 250.000. Seu sócio já botou o olho e exige a transferência de R$ 125 mil para cada CPF amanhã para 'colher os frutos do trabalho duro'.",
    character: "O Canto da Distribuição",
    consultoriaHint: "Negócios geniais seguem a regra 30-70. O dono é premiado com 30% do lucro líquido gerado (dividendos saudáveis). Os 70% ficam ancorados no caixa (holding/aplicação) garantindo P&D, novas contratações agressivas e blindagem do ano seguinte sem precisar pisar no banco.",
    options: [
      { id: "A", text: "Bater o pé na governança 30/70. Distribuir 30% (75k) como prêmio justo do ano e alocar 70% (175k) travados no fundo de reserva/investimento para injeções sem depender de CDI alto do Itaú.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.5, compliance: 20 }, feedback: "ALINHAMENTO COM EQUITY. O prêmio no CPF aconteceu, mas o corpo principal (CNPJ) virou uma usina geradora capaz de financiar a si mesmo.", reward: "🏆 Equity Sólido: A empresa cresce com o dinheiro mais barato do mercado: o próprio lucro.", lesson: "" },
      { id: "B", text: "Ceder à pressa do sócio e distribuir os 100% (250k). 'Ano que vem a gente vende mais e faz caixa de novo, o importante é desfrutar'.", xp: -30, isBest: false, impacts: { caixa: -250000, margem: -3.0, compliance: -15 }, feedback: "SECAGEM DE POÇO (DESCAPITALIZAÇÃO). Vocês sangraram o próprio paciente saudável. Março será terrível.", reward: "", lesson: "A fome de consumo do sócio é o Custo Fixo mais caro de administrar." },
      { id: "C", text: "Decidir não distribuir nenhum dividendo e tentar aplicar os 250k na 'Bolsa de Valores e Cripto' direto pelo CNPJ na ilusão de 'lucro rápido e especulativo'.", xp: -50, isBest: false, impacts: { caixa: -120000, margem: -5.0, compliance: -40 }, feedback: "DESVIO DE FINALIDADE. A empresa não é Asset Management. Fuga de objeto social com queima de capital real.", reward: "", lesson: "Muitos quebram tentando ser traders com o dinheiro do próprio pão." }
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
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  const [phaseReward, setPhaseReward] = useState<string | null>(null);
  
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); // 0 a 9 (Fases)
  
  const [showConsultoriaHint, setShowConsultoriaHint] = useState(false);
  const [dreMode, setDreMode] = useState<'none' | 'mid-month' | 'end-month'>('none');
  
  const [dreProLabore, setDreProLabore] = useState(5000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreTaxas, setDreTaxas] = useState(1900); 

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

  // --- NÚCLEO DO GAME: PREVENÇÃO DE REPETIÇÃO TOTAL ---
  const loadNextQuestion = () => {
    setFeedback(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    // Busca na base apenas questões do nível atual (ou menor) que NÃO estão nos IDs usados.
    let available = questionBank.filter(q => q.tier <= currentLevel.tier && !usedQuestionIds.includes(q.id));
    
    // Fallback: Se o jogador jogou meses o suficiente para esgotar as 40 perguntas do banco, reinicia a memória dele.
    if (available.length === 0) {
      setUsedQuestionIds([]);
      available = questionBank.filter(q => q.tier <= currentLevel.tier);
    }
    
    const selected = available[Math.floor(Math.random() * available.length)];
    const shuffledOptions = shuffleArray([...selected.options]);
    setCurrentScenario({ ...selected, options: shuffledOptions });
  };

  useEffect(() => {
    if (gameStarted && !isGameOver && !currentScenario && !feedback && dreMode === 'none') {
      loadNextQuestion();
    }
  }, [gameStarted, currentScenario, feedback, dreMode]);

  const handleConsultoria = () => {
    if (caixa >= 3500) {
      setCaixa(prev => prev - 3500);
      setXp(prev => prev + 25);
      setShowConsultoriaHint(true);
    } else {
      alert("Caixa insuficiente para acionar a Visão do Mentor.");
    }
  };

  const handleOptionSelect = (selectedOption: any) => {
    if (isEvaluatingChoice || isGameOver) return;
    setIsEvaluatingChoice(true);

    const finalXp = selectedOption.xp;
    const finalImpacts = { ...selectedOption.impacts };

    // Grava o ID pra nunca mais cair na mesma jornada do empreendedor
    setUsedQuestionIds(prev => [...prev, currentScenario.id]);
    setFeedback(`${selectedOption.feedback}`);
    
    if (selectedOption.isBest) {
      setPhaseReward(selectedOption.reward || "🏆 Atitude de Dono validada.");
    } else {
      setPhaseReward(`❌ Lição Paga: ${selectedOption.lesson || "O Mercado cobra caro."}`);
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

  // --- DRE DINÂMICA (Conectada ao Front-end) ---
  const dreReceita = 45000 + (xp * 15); 
  const dreMargemReal = (margem / 100); 
  const dreMargemContribuicao = dreReceita * dreMargemReal;
  const dreCustosVariaveis = dreReceita - dreMargemContribuicao; 
  const dreCustoFixoBase = 8850; 
  const dreTotalDespesasFixas = dreCustoFixoBase + dreProLabore + dreMarketing + dreTaxas;
  const dreLucroLiquido = dreMargemContribuicao - dreTotalDespesasFixas;

  const handleSalvarDREMidMonth = () => { setDreMode('none'); };

  const handleInjetarLucroEndMonth = () => {
    setCaixa(prev => prev + dreLucroLiquido);
    setDreMode('none');
    setCurrentStage(0); 
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
            setDreMode(d.dreMode || 'none');
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
            data: { playerName: nome.trim(), phone: telefone.trim(), email: cleanEmail, companyName: "", xp: 0, caixa: 45000, margem: 18.0, compliance: 100, currentStage: 0, usedQuestionIds: [], dreMode: 'none' }
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
    setGameStarted(true); setIsGameOver(false); setDreMode('none');
  };

  const handleLogout = async () => {
    if(gameStarted && !isGameOver) await saveToDB();
    setGameStarted(false); setNeedsCompanySetup(false); setEmail(""); setPassword(""); setAuthError(""); setAuthSuccess(""); setNome(""); setTelefone("");
    setFeedback(null); setIsGameOver(false); setDreMode('none'); setCurrentScenario(null);
  };

  const handleResetCareer = () => {
    if (confirm("Você vai zerar seu CNPJ e reiniciar do zero. Confirma?")) {
      setXp(0); setCaixa(45000); setMargem(18.0); setCompliance(100);
      setCurrentStage(0); setCurrentScenario(null); setUsedQuestionIds([]);
      setFeedback(null); setIsGameOver(false); setLastImpacts(null); setPhaseReward(null);
      setGameStarted(false); setCompanyNameInput(""); setPlayerNameInput(playerName); setNeedsCompanySetup(true);
      setDreProLabore(5000); setDreMarketing(1000); setDreTaxas(1900); setDreMode('none');
    }
  };

  const caixaBarFill = Math.min(100, (caixa / 150000) * 100);
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
            <p className="text-slate-500 text-[9px] tracking-[0.3em] mt-1 uppercase font-mono">Simulador de Estratégia de Negócios</p>
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
               
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-1 rounded"><span>(-) Seu Pró-labore (Salário do Dono)</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-1 rounded"><span>(-) Marketing (Máquina de Vendas)</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-1 rounded"><span>(-) Taxas do Banco (Agiotagem)</span><span>{formatBRL(dreTaxas)}</span></div>
               
               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${dreLucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">5. LUCRO LÍQUIDO (Gerador de Caixa)</span><span>{dreLucroLiquido >= 0 ? '+' : ''}{formatBRL(dreLucroLiquido)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6 mb-8 bg-[#020617]/30 p-5 rounded-xl border border-white/5">
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-emerald-400">Regular o seu Pró-Labore</span><span className="text-slate-400">{formatBRL(dreProLabore)}</span></div>
               <input type="range" min="0" max="20000" step="500" value={dreProLabore} onChange={(e) => setDreProLabore(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
               <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono">Retiradas altas secam o caixa da PJ. Retiradas muito baixas fazem o dono sofrer na PF.</p>
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-blue-400">Verba de Crescimento (Tráfego Pago)</span><span className="text-slate-400">{formatBRL(dreMarketing)}</span></div>
               <input type="range" min="0" max="10000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Antecipações e Juros Bancários</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="8000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
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
                💎 Consultar Pedro Monte (R$ 3.500)
              </button>
            </div>

            {showConsultoriaHint && (
              <div className="mb-6 bg-amber-950/20 border-l-2 border-amber-500 p-5 rounded-r-lg shadow-inner">
                <p className="text-amber-400 text-[11px] font-mono uppercase mb-2 flex items-center gap-2"><span>👁️</span> Mentoria Estratégica Injetada (+20 XP):</p>
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