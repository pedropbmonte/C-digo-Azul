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

// --- CURVA DE MATURIDADE ---
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

// --- BANCO DE DADOS LOCAL (40 Questões - 10 por Nível) ---
const questionBank = [
  // TIER 1 (10 Questões: Sobrevivência)
  { id: "t1_01", tier: 1, sector: "Sobrevivência Financeira", title: "A Síndrome do Caixa Único", theory: "Misturar PF e PJ mascara o custo fixo. Se a empresa paga a escola do filho, o CNPJ sangra.", context: "A conta PJ tem R$ 4.000. O vale da equipe é R$ 6.000 amanhã. Você gastou R$ 3.500 no cartão PJ no supermercado da sua casa ontem.", character: "Extrato Bancário", consultoriaHint: "Devolva o dinheiro para a PJ. Pague a equipe. Corte seu padrão na PF até a empresa respirar.", options: [ { id: "A", text: "Injetar dinheiro da PF na PJ, pagar a equipe e definir pró-labore austero.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Separou os bolsos.", reward: "🏆 Trava PFxPJ", lesson: "" }, { id: "B", text: "Pegar cheque especial na PJ para não mexer na PF.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -2.5, compliance: -10 }, feedback: "ILUSÃO. Dívida cara para luxo.", reward: "", lesson: "A dívida não sustenta o ego." }, { id: "C", text: "Atrasar a equipe dizendo que 'o mercado tá ruim'.", xp: -40, isBest: false, impacts: { caixa: -2000, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL.", reward: "", lesson: "Equipe com fome atende mal." }] },
  { id: "t1_02", tier: 1, sector: "Capital de Giro", title: "O Vício da Maquininha", theory: "Antecipar é agiotagem legalizada. Pagar 5% ao mês destrói a margem.", context: "Venda de R$ 15.000 em 10x. Boleto do fornecedor vence amanhã e o caixa tá zerado.", character: "Fornecedor", consultoriaHint: "Renegocie prazo com fornecedor. Faça PIX relâmpago no WhatsApp.", options: [ { id: "A", text: "Renegociar prazo e lançar oferta relâmpago via PIX.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA.", reward: "🏆 Acelerador de Caixa", lesson: "" }, { id: "B", text: "Antecipar na maquininha pagando 6%.", xp: -5, isBest: false, impacts: { caixa: -1000, margem: -3.0, compliance: 0 }, feedback: "PALIATIVO.", reward: "", lesson: "O botão da maquininha destrói a margem." }, { id: "C", text: "Pagar o fornecedor com cartão de crédito da PJ.", xp: -45, isBest: false, impacts: { caixa: -3000, margem: -5.0, compliance: -20 }, feedback: "BOLA DE NEVE.", reward: "", lesson: "Fogo não apaga incêndio." }] },
  { id: "t1_03", tier: 1, sector: "Precificação", title: "O Preço do Achismo", theory: "Copiar o preço do vizinho sem saber seus custos é pagar para trabalhar.", context: "Custo subiu 15%. Vizinho vende por R$ 75. Você tem medo de subir o preço.", character: "Concorrente", consultoriaHint: "Quem foca em preço atrai cliente infiel. Suba a tabela e filtre a base.", options: [ { id: "A", text: "Repassar o aumento e focar na qualidade do serviço.", xp: 35, isBest: true, impacts: { caixa: 3000, margem: 2.5, compliance: 10 }, feedback: "VISÃO DE LUCRO.", reward: "🏆 Filtro de Clientes", lesson: "" }, { id: "B", text: "Absorver o custo temporariamente.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -3.0, compliance: 0 }, feedback: "MIOPIA.", reward: "", lesson: "O medo de perder venda quebra a empresa." }, { id: "C", text: "Baixar para R$ 70 para quebrar o vizinho.", xp: -50, isBest: false, impacts: { caixa: -8000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO FINANCEIRO.", reward: "", lesson: "Volume sem margem é fatal." }] },
  { id: "t1_04", tier: 1, sector: "Caixa", title: "O Salário de Sobras", theory: "Tirar 'o que sobra' mata o capital de giro da empresa.", context: "Sobrou R$ 8.000 no caixa. Suas contas pessoais estão apertadas.", character: "Boleto Pessoal", consultoriaHint: "Defina um limite. Se raspar o tacho, a empresa não gira mês que vem.", options: [ { id: "A", text: "Tirar pró-labore de R$ 4.000 e deixar o resto como fundo.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.0, compliance: 10 }, feedback: "DISCIPLINA.", reward: "🏆 Fundo de Guerra 1.0", lesson: "" }, { id: "B", text: "Tirar R$ 6.000 prometendo devolver.", xp: -10, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: -5 }, feedback: "DESORGANIZAÇÃO.", reward: "", lesson: "Promessa não paga conta." }, { id: "C", text: "Raspar os R$ 8.000.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -3.0, compliance: -15 }, feedback: "VAMPIRO DO CNPJ.", reward: "", lesson: "Matou a galinha dos ovos de ouro." }] },
  { id: "t1_05", tier: 1, sector: "Operação", title: "O Desconto de Desespero", theory: "Dar desconto pra não perder venda treina o cliente a nunca pagar o preço cheio.", context: "Cliente grande exige 20% de desconto para fechar, senão vai pro concorrente. Sua margem já é apertada.", character: "Cliente 'Sugador'", consultoriaHint: "Deixe ir. Cliente de preço não fideliza. Agregue um bônus que custe pouco para você, mas não mexa no preço.", options: [ { id: "A", text: "Manter o preço, mas oferecer frete grátis ou um serviço extra de baixo custo.", xp: 35, isBest: true, impacts: { caixa: 2000, margem: 2.0, compliance: 10 }, feedback: "ANCORAGEM.", reward: "🏆 Tática do Bônus", lesson: "" }, { id: "B", text: "Dar 10% para fechar o negócio.", xp: -15, isBest: false, impacts: { caixa: -1000, margem: -2.5, compliance: 0 }, feedback: "ENGOLIDO.", reward: "", lesson: "Destruiu metade do lucro." }, { id: "C", text: "Dar os 20% porque 'pelo menos entra dinheiro'.", xp: -40, isBest: false, impacts: { caixa: -4000, margem: -5.0, compliance: -10 }, feedback: "TRABALHO ESCRAVO.", reward: "", lesson: "Pagou para o cliente levar o produto." }] },
  { id: "t1_06", tier: 1, sector: "Passivos", title: "A Multa Invisível", theory: "Pagar juros de boleto de luz e imposto por desorganização é rasgar dinheiro.", context: "Atrasou a DAS (Simples) e a conta de luz porque esqueceu no e-mail. R$ 350 de multa.", character: "Boleto Vencido", consultoriaHint: "Dinheiro não aceita desaforo. Automatize os pagamentos fixos via DDA no banco amanhã.", options: [ { id: "A", text: "Pagar agora, habilitar o DDA no banco e agendar contas semanalmente.", xp: 30, isBest: true, impacts: { caixa: -350, margem: 0.5, compliance: 15 }, feedback: "PROCESSO CRIADO.", reward: "🏆 Radar Financeiro", lesson: "" }, { id: "B", text: "Pagar e 'tentar lembrar' mês que vem.", xp: -5, isBest: false, impacts: { caixa: -350, margem: -0.5, compliance: -5 }, feedback: "MEMÓRIA FALHA.", reward: "", lesson: "A mente do dono deve focar em estratégia, não em lembrar boletos." }, { id: "C", text: "Deixar para pagar mês que vem acumulado.", xp: -35, isBest: false, impacts: { caixa: -700, margem: -1.0, compliance: -20 }, feedback: "BOLA DE NEVE FISCAL.", reward: "", lesson: "A Receita Federal não tem pena de desorganizado." }] },
  { id: "t1_07", tier: 1, sector: "Estoque", title: "O Canto da Sereia", theory: "Comprar mais porque o prazo é longo é a armadilha do estoque mico.", context: "Representante oferece o dobro da mercadoria com 90 dias de prazo para pagar. Você não precisa desse volume.", character: "O Vendedor Esperto", consultoriaHint: "Compre só o que vende. Prazo longo em estoque que não gira vira dívida certa.", options: [ { id: "A", text: "Recusar a oferta e comprar o volume normal para 30 dias.", xp: 30, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 10 }, feedback: "FOCO NO GIRO.", reward: "🏆 Curva ABC", lesson: "" }, { id: "B", text: "Comprar 50% a mais só pelo prazo.", xp: -10, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: 0 }, feedback: "TENTAÇÃO.", reward: "", lesson: "Começou a imobilizar capital." }, { id: "C", text: "Aceitar a oferta inteira porque '90 dias é muito tempo'.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -3.0, compliance: -10 }, feedback: "ENFORCADO.", reward: "", lesson: "Em 90 dias o boleto chega e o produto ainda estará na prateleira." }] },
  { id: "t1_08", tier: 1, sector: "Logística", title: "O Frete Grátis Cego", theory: "Oferecer frete grátis sem calcular a logística reversa ou taxa de envio aniquila a margem.", context: "Todos os concorrentes oferecem frete grátis. Você colocou também, mas o frete comeu 30% do seu lucro.", character: "A Transportadora", consultoriaHint: "Embuta no preço ou crie pedido mínimo. Dar frete grátis do bolso é suicídio.", options: [ { id: "A", text: "Cortar frete grátis geral, liberando apenas para compras acima de R$ 300.", xp: 35, isBest: true, impacts: { caixa: 2500, margem: 2.0, compliance: 10 }, feedback: "TICKET MÉDIO.", reward: "🏆 Alavanca de Ticket", lesson: "" }, { id: "B", text: "Dividir o custo do frete 50/50 com o cliente.", xp: -5, isBest: false, impacts: { caixa: -500, margem: -1.0, compliance: 0 }, feedback: "MEIO TERMO.", reward: "", lesson: "Ainda está subsidiando a operação do cliente." }, { id: "C", text: "Manter frete grátis em tudo para não perder do concorrente.", xp: -40, isBest: false, impacts: { caixa: -5000, margem: -4.0, compliance: -10 }, feedback: "PREJUÍZO LOGÍSTICO.", reward: "", lesson: "Trabalhando para a transportadora." }] },
  { id: "t1_09", tier: 1, sector: "RH", title: "A Falsa 'PJ'", theory: "Ter funcionário batendo ponto, com uniforme, pagando via PJ é passivo trabalhista certo.", context: "Você tem 2 atendentes fixos que trabalham 8h por dia, mas não quer assinar carteira para economizar.", character: "O Risco Trabalhista", consultoriaHint: "O barato sai caro. Um processo trabalhista fecha pequenas empresas. Assine a CLT ou mude o formato do contrato real.", options: [ { id: "A", text: "Reestruturar custos e assinar a CLT ou mudar para um contrato real de terceirização (BPO).", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 0, compliance: 40 }, feedback: "BLINDAGEM.", reward: "🏆 Risco Zero", lesson: "" }, { id: "B", text: "Fazer um 'contrato de gaveta' com eles achando que protege.", xp: -20, isBest: false, impacts: { caixa: 0, margem: 0, compliance: -20 }, feedback: "INGENUIDADE.", reward: "", lesson: "Contrato de gaveta não vale nada na Justiça." }, { id: "C", text: "Seguir igual e ainda descontar faltas na nota fiscal deles.", xp: -50, isBest: false, impacts: { caixa: -10000, margem: 0, compliance: -50 }, feedback: "PROCESSO A CAMINHO.", reward: "", lesson: "A bomba relógio foi armada." }] },
  { id: "t1_10", tier: 1, sector: "Reservas", title: "A Sexta-feira 13", theory: "Falta de provisão (13º, férias) transforma compromissos anuais em surpresas fatais.", context: "Chegou dia 20 de novembro. O 13º da equipe dá R$ 7.000 e você não guardou um centavo o ano todo.", character: "A Folha de Pagamento", consultoriaHint: "Provisione 1/12 avos todo mês. Para agora, faça um saldão ou antecipe recebíveis futuros com o menor custo.", options: [ { id: "A", text: "Fazer caixa com estoque parado, pagar o 13º e criar a conta de provisão para o ano que vem.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: -1.0, compliance: 15 }, feedback: "APRENDIZADO NA DOR.", reward: "🏆 Provisão Ativada", lesson: "" }, { id: "B", text: "Pegar um empréstimo em 24x no banco.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: -5 }, feedback: "CUSTO DO ERRO.", reward: "", lesson: "Vai pagar três 13º pro banco." }, { id: "C", text: "Parcelar o 13º da equipe em 5 vezes sem avisar antes.", xp: -45, isBest: false, impacts: { caixa: -5000, margem: -3.0, compliance: -30 }, feedback: "QUEBRA DE CONFIANÇA.", reward: "", lesson: "Equipe destruída e risco de fiscalização." }] },

  // TIER 2 (10 Questões: Organização)
  { id: "t2_01", tier: 2, sector: "Cobrança", title: "O Fiado do Parceiro", theory: "O medo de cobrar transforma lucro em perda real. Cliente não é seu amigo.", context: "Cliente antigo deve R$ 8.000 há 35 dias. Hoje quer fazer novo pedido de R$ 5.000.", character: "O Calote", consultoriaHint: "Trave a esteira. Liberação de crédito novo só mediante baixa do título anterior.", options: [ { id: "A", text: "Travar o pedido exigindo quitação do título em aberto.", xp: 35, isBest: true, impacts: { caixa: 6000, margem: 1.0, compliance: 15 }, feedback: "POSTURA.", reward: "🏆 Régua de Cobrança", lesson: "" }, { id: "B", text: "Entregar e pedir um 'sinal'.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -1.5, compliance: -10 }, feedback: "FRAQUEZA.", reward: "", lesson: "Regras não existem na sua empresa." }, { id: "C", text: "Entregar normal para 'não perder a amizade'.", xp: -40, isBest: false, impacts: { caixa: -7000, margem: -4.0, compliance: -20 }, feedback: "QUEBRA.", reward: "", lesson: "Você financiou o calote." }] },
  { id: "t2_02", tier: 2, sector: "RH", title: "A Ajuda Familiar", theory: "Contratar parente por pena destrói a cultura de resultados.", context: "Cunhado atende mal, perdeu duas vendas e chega atrasado.", character: "Cultura", consultoriaHint: "Corte o mal pela raiz. Preserve a equipe que dá resultado.", options: [ { id: "A", text: "Feedback duro e demissão se não cumprir meta em 10 dias.", xp: 30, isBest: true, impacts: { caixa: 1500, margem: 1.5, compliance: 10 }, feedback: "LÍDER.", reward: "🏆 Escudo do RH", lesson: "" }, { id: "B", text: "Esconder ele no estoque.", xp: -10, isBest: false, impacts: { caixa: -1000, margem: -1.0, compliance: -5 }, feedback: "COVARDIA.", reward: "", lesson: "O custo fixo continuou." }, { id: "C", text: "Você assumir a função dele.", xp: -35, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: -10 }, feedback: "GARGALO.", reward: "", lesson: "Voltou pro operacional." }] },
  { id: "t2_03", tier: 2, sector: "Estoque", title: "O Cemitério na Prateleira", theory: "Estoque sem giro é dinheiro podre.", context: "R$ 20.000 parados há 4 meses. Faltam R$ 6.000 para o aluguel amanhã.", character: "Boleto do Aluguel", consultoriaHint: "Faça saldão agressivo a preço de custo HOJE.", options: [ { id: "A", text: "Ação relâmpago: queimar estoque a custo.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: -0.5, compliance: 10 }, feedback: "ESTRATEGISTA.", reward: "🏆 Giro Rápido", lesson: "" }, { id: "B", text: "Pagar aluguel com limite do banco.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: -5 }, feedback: "ILUSÃO.", reward: "", lesson: "Dívida em cima de mercadoria parada." }, { id: "C", text: "Comprar mais estoque novo no limite.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -15 }, feedback: "FALÊNCIA.", reward: "", lesson: "Multiplicou a dor." }] },
  { id: "t2_04", tier: 2, sector: "Fluxo", title: "O Efeito Tesoura", theory: "Vender parcelado longo e comprar do fornecedor à vista estrangula o caixa.", context: "Vendas subiram 30% (tudo em 10x). Você tem que pagar os fornecedores em 15 dias. O caixa secou.", character: "Descaminho Financeiro", consultoriaHint: "Inverta o ciclo. Encurte o prazo de venda e alongue o de compra.", options: [ { id: "A", text: "Dar bônus para compras à vista e renegociar fornecedores para 45 dias.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 10 }, feedback: "VISÃO DE CAIXA.", reward: "🏆 Ciclo Positivo", lesson: "" }, { id: "B", text: "Pegar capital de giro no banco.", xp: -10, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: -5 }, feedback: "BANDAID.", reward: "", lesson: "Pagou para o banco resolver o seu prazo." }, { id: "C", text: "Atrasar fornecedores até os clientes pagarem.", xp: -40, isBest: false, impacts: { caixa: -6000, margem: -2.0, compliance: -20 }, feedback: "CALOTEIRO.", reward: "", lesson: "Sujou o CNPJ na praça." }] },
  { id: "t2_05", tier: 2, sector: "Software", title: "A Falsa Ferramenta Milagrosa", theory: "Comprar software caro sem processo definido é jogar dinheiro fora.", context: "Pagando R$ 800/mês em um ERP completo, mas a equipe anota tudo no caderninho.", character: "O Custo Fixo Ocioso", consultoriaHint: "Ferramenta não cria processo. Cancele o sistema complexo, volte para o básico, crie o hábito, depois avance.", options: [ { id: "A", text: "Cancelar o software, instituir um controle simples validado e treinar a equipe.", xp: 30, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 10 }, feedback: "RACIONALIDADE.", reward: "🏆 Processo Limpo", lesson: "" }, { id: "B", text: "Manter pagando 'para quando a equipe se acostumar'.", xp: -10, isBest: false, impacts: { caixa: -800, margem: -0.5, compliance: 0 }, feedback: "DESPERDÍCIO.", reward: "", lesson: "Eles nunca vão se acostumar sozinhos." }, { id: "C", text: "Obrigar o uso sob ameaça de demissão, travando a operação da loja.", xp: -35, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: -10 }, feedback: "CAOS.", reward: "", lesson: "Impor tecnologia sem treino gera sabotagem." }] },
  { id: "t2_06", tier: 2, sector: "Concorrência", title: "A Batalha dos Centavos", theory: "Tentar brigar por preço com o gigante que compra em contêiner é lutar contra a matemática.", context: "A megastore da esquina botou seu produto carro-chefe 20% mais barato.", character: "A Megastore", consultoriaHint: "Fugir do preço. Venda atendimento, combo, experiência. O gigante não sorri pro cliente.", options: [ { id: "A", text: "Mudar o foco para atendimento premium e criar combos que o gigante não tem.", xp: 35, isBest: true, impacts: { caixa: 3000, margem: 2.0, compliance: 10 }, feedback: "ESTRATÉGIA LATERAL.", reward: "🏆 Nicho Protegido", lesson: "" }, { id: "B", text: "Igualar o preço do gigante cortando a própria margem.", xp: -20, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: 0 }, feedback: "SUICÍDIO.", reward: "", lesson: "Você não tem o pulmão do gigante." }, { id: "C", text: "Falar mal do produto do concorrente no Instagram.", xp: -45, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: -15 }, feedback: "DESESPERO E PROCESSO.", reward: "", lesson: "Expôs a marca ao ridículo e ao jurídico." }] },
  { id: "t2_07", tier: 2, sector: "Dados", title: "O Dinheiro Invisível", theory: "Acreditar no sistema de vendas sem conciliar o banco é pedir para ser roubado por taxas e fraudes.", context: "O sistema diz que você vendeu R$ 30k. O banco diz que tem R$ 26k. Você não sabe onde está a diferença.", character: "A Diferença de Caixa", consultoriaHint: "Quem não controla as taxas, paga por elas duas vezes. Faça conciliação bancária cega amanhã cedo.", options: [ { id: "A", text: "Implementar rotina de conciliação bancária diária para auditar taxas e quebras.", xp: 35, isBest: true, impacts: { caixa: 2000, margem: 1.5, compliance: 15 }, feedback: "CONTROLE.", reward: "🏆 Raio-X do Caixa", lesson: "" }, { id: "B", text: "Assumir que foi 'taxa do banco' e deixar pra lá.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -2.0, compliance: -5 }, feedback: "CEGUEIRA.", reward: "", lesson: "A margem está escorrendo pelo ralo." }, { id: "C", text: "Descontar dos funcionários achando que é roubo do caixa físico sem provas.", xp: -50, isBest: false, impacts: { caixa: -5000, margem: -2.0, compliance: -30 }, feedback: "TIRANIA.", reward: "", lesson: "Acusar sem prova gera processo assédio moral." }] },
  { id: "t2_08", tier: 2, sector: "Clientes", title: "A Demissão do Cliente Ruim", theory: "O Princípio de Pareto: 20% dos clientes geram 80% do estresse e zero lucro.", context: "Um cliente chato consome 5 horas do seu suporte, chora todo preço e exige entrega grátis fora do horário.", character: "O Cliente Tóxico", consultoriaHint: "Demitir cliente dá lucro. Libere seu tempo para os clientes bons.", options: [ { id: "A", text: "Encerrar o contrato de forma educada e focar no atendimento dos melhores clientes.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 2.0, compliance: 10 }, feedback: "LIMPEZA.", reward: "🏆 Foco VIP", lesson: "" }, { id: "B", text: "Tentar aumentar o preço dele para 'ver se ele sai sozinho'.", xp: 5, isBest: false, impacts: { caixa: 0, margem: 0.5, compliance: 0 }, feedback: "OMISSÃO.", reward: "", lesson: "Se ele aceitar, o inferno continua mais caro." }, { id: "C", text: "Dar os descontos e favores porque 'o importante é manter a venda'.", xp: -30, isBest: false, impacts: { caixa: -2500, margem: -3.0, compliance: -10 }, feedback: "REFÉM.", reward: "", lesson: "Você virou escravo da vaidade de faturar." }] },
  { id: "t2_09", tier: 2, sector: "MKT", title: "O Impulso do Tráfego Pago", theory: "Colocar dinheiro em anúncio sem ter o processo de vendas afiado é queimar nota de R$ 100.", context: "Colocou R$ 1.500 no botão 'Impulsionar'. Vieram 100 mensagens. Sua equipe não respondeu ninguém a tempo.", character: "O Meta Ads", consultoriaHint: "Tráfego pago potencializa o que já existe. Se seu atendimento é ruim, ele escala a frustração.", options: [ { id: "A", text: "Pausar campanhas, criar um script de vendas e treinar o tempo de resposta antes de religar.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 1.5, compliance: 10 }, feedback: "ARRUMANDO A CASA.", reward: "🏆 Máquina de Vendas", lesson: "" }, { id: "B", text: "Colocar mais dinheiro achando que os leads vieram 'frios'.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -2.0, compliance: 0 }, feedback: "QUEIMA DE CAIXA.", reward: "", lesson: "O lead esfriou porque você demorou." }, { id: "C", text: "Deixar rodar e botar a culpa no 'algoritmo do Instagram'.", xp: -40, isBest: false, impacts: { caixa: -4500, margem: -3.0, compliance: -5 }, feedback: "NEGAÇÃO.", reward: "", lesson: "A ignorância custa caro." }] },
  { id: "t2_10", tier: 2, sector: "Infra", title: "A Máquina Remendada", theory: "Manutenção preventiva é barata. Parada corretiva paralisa o negócio.", context: "O principal equipamento da empresa faz barulho há meses. A manutenção custa R$ 1.500. Hoje ela quebrou de vez e a peça nova é R$ 8.000 + 3 dias parados.", character: "A Engrenagem", consultoriaHint: "Crie fundo de depreciação. Pague pelo conserto e institua a parada preventiva mensal obrigatória.", options: [ { id: "A", text: "Arrumar com urgência e instituir um processo mensal e fundo de manutenção.", xp: 35, isBest: true, impacts: { caixa: -8000, margem: 1.0, compliance: 15 }, feedback: "DOR DO APRENDIZADO.", reward: "🏆 Depreciação Ativa", lesson: "" }, { id: "B", text: "Fazer uma 'gambiarra' barata para voltar a rodar rápido.", xp: -15, isBest: false, impacts: { caixa: -1000, margem: -1.0, compliance: -10 }, feedback: "BOMBA RELÓGIO.", reward: "", lesson: "A gambiarra é a mãe do acidente de trabalho." }, { id: "C", text: "Fechar a empresa por 3 dias e dispensar a equipe sem pagar as horas.", xp: -45, isBest: false, impacts: { caixa: -15000, margem: -5.0, compliance: -30 }, feedback: "DESTRUIÇÃO.", reward: "", lesson: "Perdeu cliente, margem e respeito do time." }] },

  // TIER 3 (10 Questões: Estratégia)
  { id: "t3_01", tier: 3, sector: "Estrutura Operacional", title: "O Teto do Eu-preendedor", theory: "Medo de contratar trava a receita da companhia.", context: "Trabalha 14h/dia. O WhatsApp demora 4h. Receita estagnada.", character: "O Gargalo", consultoriaHint: "Contrate urgente. O custo fixo sobe, energia volta para vendas.", options: [ { id: "A", text: "Contratar assistente e focar em estratégia.", xp: 35, isBest: true, impacts: { caixa: -2500, margem: 3.5, compliance: 10 }, feedback: "LIDERANÇA.", reward: "🏆 Tempo de Dono", lesson: "" }, { id: "B", text: "Freelancer barato à noite.", xp: 5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "MEIA SOLUÇÃO.", reward: "", lesson: "Caos de dia." }, { id: "C", text: "Continuar sozinho.", xp: -35, isBest: false, impacts: { caixa: -5000, margem: -3.0, compliance: -10 }, feedback: "ESTAGNAÇÃO.", reward: "", lesson: "Empresa morreu." }] },
  { id: "t3_02", tier: 3, sector: "RH", title: "O Refém do Estrela", theory: "Dependência de um único funcionário é letal.", context: "Vendedor traz 50% da receita. Pede 40% de aumento no fixo ou sai.", character: "O Terrorismo", consultoriaHint: "Dê bônus variável para ganhar tempo, documente processo e contrate novos.", options: [ { id: "A", text: "Negar fixo. Dar bônus (meta). Contratar novos para pulverizar a carteira.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 1.0, compliance: 20 }, feedback: "GOVERNANÇA.", reward: "🏆 Blindagem", lesson: "" }, { id: "B", text: "Dar aumento de 40% no fixo.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -4.0, compliance: -15 }, feedback: "ENQUADRADO.", reward: "", lesson: "Ele é o dono agora." }, { id: "C", text: "Demitir na hora.", xp: -35, isBest: false, impacts: { caixa: -7000, margem: -5.0, compliance: -10 }, feedback: "EGO INFLADO.", reward: "", lesson: "Rombo fatal na receita." }] },
  { id: "t3_03", tier: 3, sector: "Custos", title: "A Cegueira do Custo Fixo", theory: "Preço congelado por medo de cliente espreme lucro a zero.", context: "Custos subiram 18% no ano. Preço é o mesmo. Balanço zerado.", character: "A Margem", consultoriaHint: "Reajuste a tabela. Quem foge por centavos não é cliente.", options: [ { id: "A", text: "Repassar reajuste e assumir perda de volume barato.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 3.0, compliance: 10 }, feedback: "CORAGEM.", reward: "🏆 Régua de Valor", lesson: "" }, { id: "B", text: "Cortar qualidade para manter preço.", xp: -20, isBest: false, impacts: { caixa: 0, margem: -1.0, compliance: -15 }, feedback: "DESTRUIÇÃO.", reward: "", lesson: "Atalho para irrelevância." }, { id: "C", text: "Dobrar anúncios pra vender volume.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -4.0, compliance: -10 }, feedback: "QUEBRA.", reward: "", lesson: "Escalar sem margem mata." }] },
  { id: "t3_04", tier: 3, sector: "Risco", title: "O Risco da Concentração", theory: "Ter um cliente que representa mais de 30% da receita é não ter uma empresa, é ser empregado dele.", context: "Você descobriu que 45% do seu faturamento mensal vem de um único contrato.", character: "O Falso Conforto", consultoriaHint: "Use o lucro desse contrato para prospectar novos clientes furiosamente. Pulverize o risco.", options: [ { id: "A", text: "Aumentar investimento comercial para captar novos clientes e reduzir a dependência percentual.", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 1.5, compliance: 15 }, feedback: "ESTRATÉGIA.", reward: "🏆 Carteira Pulverizada", lesson: "" }, { id: "B", text: "Oferecer descontos para esse clienteão amarrar ele mais ainda.", xp: -15, isBest: false, impacts: { caixa: -3000, margem: -3.0, compliance: -5 }, feedback: "SUBMISSÃO.", reward: "", lesson: "Prendeu a corda no próprio pescoço." }, { id: "C", text: "Relaxar as vendas e aproveitar o dinheiro garantido.", xp: -40, isBest: false, impacts: { caixa: -6000, margem: -2.0, compliance: -10 }, feedback: "ZONA DE MORTE.", reward: "", lesson: "Um e-mail de cancelamento quebra você." }] },
  { id: "t3_05", tier: 3, sector: "Marca", title: "A Crise Online", theory: "Ignorar o Google Meu Negócio / Reclame Aqui destrói a conversão de novos clientes silenciosamente.", context: "Um ex-funcionário revoltado criou perfis falsos e abaixou sua nota do Google para 2.0. As vendas de balcão caíram 40%.", character: "O Algoritmo", consultoriaHint: "Reputação é caixa. Acione advogado para remoção cautelar e incentive ativamente seus melhores clientes a avaliarem com 5 estrelas.", options: [ { id: "A", text: "Notificação extrajudicial, resposta profissional na rede e campanha de avaliação interna com clientes reais.", xp: 35, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 20 }, feedback: "GESTÃO DE CRISE.", reward: "🏆 Autoridade Blindada", lesson: "" }, { id: "B", text: "Bater boca nas avaliações respondendo com raiva.", xp: -25, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: -15 }, feedback: "DESCONTROLE.", reward: "", lesson: "O cliente novo viu sua falta de inteligência emocional." }, { id: "C", text: "Apagar o perfil do Google para 'esconder' a nota.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -3.0, compliance: -10 }, feedback: "APAGÃO.", reward: "", lesson: "Você se apagou do mapa comercial." }] },
  { id: "t3_06", tier: 3, sector: "Expansão", title: "A Armadilha do Ponto Físico", theory: "Fazer obra de embelezamento com dinheiro do fluxo de caixa e não de fundo de reserva trava a operação.", context: "Caixa tem 25k. A fachada da loja está velha. O orçamento da obra deu 22k.", character: "A Vaidade do Ponto", consultoriaHint: "Nunca raspe o tacho para tijolo e tinta. Pinte o básico agora e crie fundo para reforma ano que vem.", options: [ { id: "A", text: "Adiar a obra pesada, fazer um retrofit básico de R$ 3k e guardar o restante para giro.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.0, compliance: 10 }, feedback: "LUCIDEZ.", reward: "🏆 Caixa Preservado", lesson: "" }, { id: "B", text: "Fazer a obra inteira porque 'loja bonita vende mais'.", xp: -20, isBest: false, impacts: { caixa: -22000, margem: 0.5, compliance: -5 }, feedback: "RISCO DE LIQUIDEZ.", reward: "", lesson: "Qualquer imprevisto quebra a empresa mês que vem." }, { id: "C", text: "Fazer a obra e botar R$ 22k no cheque especial para não mexer no caixa.", xp: -50, isBest: false, impacts: { caixa: -22000, margem: -4.0, compliance: -15 }, feedback: "DESASTRE.", reward: "", lesson: "Tomou juros de 8% ao mês para pintar parede." }] },
  { id: "t3_07", tier: 3, sector: "Fornecedores", title: "O Monopólio Oculto", theory: "Ter só 1 bom fornecedor é a versão B2B de ter só 1 bom cliente. Você é refém.", context: "Seu único fornecedor do insumo principal avisou que a máquina deles quebrou. 15 dias sem entrega.", character: "A Falta de Insumo", consultoriaHint: "Custo de segurança: desenvolva pelo menos 2 fornecedores extras, mesmo que pague 5% a mais neles.", options: [ { id: "A", text: "Homologar 2 novos fornecedores de emergência e começar a dividir as compras ativamente.", xp: 35, isBest: true, impacts: { caixa: 2000, margem: -0.5, compliance: 15 }, feedback: "MITIGAÇÃO DE RISCO.", reward: "🏆 Supply Chain Seguro", lesson: "" }, { id: "B", text: "Esperar 15 dias porque 'só eles tem a qualidade perfeita'.", xp: -20, isBest: false, impacts: { caixa: -8000, margem: -2.0, compliance: -5 }, feedback: "OPERAÇÃO PARADA.", reward: "", lesson: "Qualidade perfeita não vende se não tem entrega." }, { id: "C", text: "Comprar produto pirata ou falsificado no mercado cinza para cobrir o buraco.", xp: -50, isBest: false, impacts: { caixa: -5000, margem: -1.0, compliance: -40 }, feedback: "CRIME E PROCESSO.", reward: "", lesson: "Você destruiu o nome da empresa na praça." }] },
  { id: "t3_08", tier: 3, sector: "MKT", title: "O Lançamento Milagroso", theory: "Apostar todo o caixa livre num único produto não testado é apostar no cassino.", context: "Uma agência convenceu você a investir os R$ 20.000 livres em um super evento de lançamento de um produto novo.", character: "A Promessa de MKT", consultoriaHint: "Valide pequeno antes de escalar. Gaste R$ 2.000 num MVP. Se vender, escale.", options: [ { id: "A", text: "Recusar a agência. Fazer um teste (MVP) gastando 10% do valor para validar a demanda real.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 10 }, feedback: "MÉTODO ÁGIL.", reward: "🏆 Validador de Risco", lesson: "" }, { id: "B", text: "Negociar com a agência para pagar apenas após o resultado (eles recusam).", xp: 5, isBest: false, impacts: { caixa: 0, margem: 0, compliance: 0 }, feedback: "NEUTRO.", reward: "", lesson: "Nem ganhou, nem perdeu, mas perdeu tempo." }, { id: "C", text: "Pagar os 20k porque 'quem não arrisca não petisca'.", xp: -40, isBest: false, impacts: { caixa: -20000, margem: -2.0, compliance: -10 }, feedback: "CASSINO.", reward: "", lesson: "O produto flopou e a agência já embolsou o seu dinheiro." }] },
  { id: "t3_09", tier: 3, sector: "Sucessão", title: "A Fuga de Inteligência", theory: "O braço direito sem perspectiva vira o pior concorrente.", context: "Seu melhor gerente comercial chamou você. Ele vai pedir as contas para abrir um negócio igual ao seu na mesma avenida.", character: "A Concorrência Interna", consultoriaHint: "Dê a ele um plano de sociedade por performance (Vesting). É melhor ter 80% de um negócio gigante do que 100% de nada.", options: [ { id: "A", text: "Apresentar um plano de sociedade (Vesting/Partnership) atrelado a metas pesadas de expansão para a loja 2.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 2.0, compliance: 20 }, feedback: "VISÃO DE BOARD.", reward: "🏆 Retenção de Elite (Partnership)", lesson: "" }, { id: "B", text: "Oferecer aumento de salário apenas para ele ficar mais um pouco.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: 0 }, feedback: "ILUSÃO.", reward: "", lesson: "O empreendedor não quer salário, quer equity." }, { id: "C", text: "Mandar embora aos gritos, bloquear ele no sistema e processar (sem base legal).", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -25 }, feedback: "GUERRA DECLARADA.", reward: "", lesson: "Ele saiu com sangue nos olhos e vai roubar sua base de clientes amanhã." }] },
  { id: "t3_10", tier: 3, sector: "Finanças", title: "A Antecipação Estratégica", theory: "Quem tem caixa é rei. Pagar à vista com grande desconto bate o CDI em dobro.", context: "O fornecedor está precisando de caixa e te ligou: 15% de desconto no pedido principal de amanhã se pagar HOJE em PIX.", character: "A Oportunidade do Caixa", consultoriaHint: "Use o seu fundo de guerra. Ganhar 15% limpo numa compra gira sua margem do mês lá pro alto.", options: [ { id: "A", text: "Usar o Fundo de Reserva, fazer o PIX, garantir o desconto e recompor o fundo mês que vem.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 3.5, compliance: 10 }, feedback: "EFICIÊNCIA.", reward: "🏆 Giro com Deságio", lesson: "" }, { id: "B", text: "Pegar empréstimo no banco a 3% para ganhar os 15% do fornecedor.", xp: 10, isBest: false, impacts: { caixa: 2000, margem: 1.0, compliance: -5 }, feedback: "ARBITRAGEM ARRISCADA.", reward: "", lesson: "Assumiu risco bancário desnecessário." }, { id: "C", text: "Recusar porque 'é melhor deixar o dinheiro na poupança'.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -1.5, compliance: 0 }, feedback: "MIOPIA DE RENTABILIDADE.", reward: "", lesson: "Perdeu a melhor operação financeira do ano (15% no dia)." }] },

  // TIER 4 (10 Questões: Elite e B2B)
  { id: "t4_01", tier: 4, sector: "Estratégia Tributária", title: "O Nocaute do IVA Dual", theory: "Ficar no Simples pode custar contratos grandes. A Reforma Tributária exige repasse de créditos B2B.", context: "Cliente grande (30% da receita) exige recolhimento de imposto por fora para gerar crédito para eles. Senão cancelam.", character: "O Contrato Gigante", consultoriaHint: "Pague imposto por fora, repasse o crédito e renegocie a tabela com eles.", options: [ { id: "A", text: "Recolher por fora e renegociar a tabela com a indústria.", xp: 40, isBest: true, impacts: { caixa: 12000, margem: 1.0, compliance: 25 }, feedback: "MERCADO.", reward: "🏆 Tributação Inteligente", lesson: "" }, { id: "B", text: "Dar 10% de desconto implorando para ficar.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: -5 }, feedback: "TIRO NO PÉ.", reward: "", lesson: "Pagou do bolso." }, { id: "C", text: "Ignorar.", xp: -50, isBest: false, impacts: { caixa: -18000, margem: -5.0, compliance: -20 }, feedback: "NOCAUTE.", reward: "", lesson: "Cliente cancelou." }] },
  { id: "t4_02", tier: 4, sector: "Vaidade", title: "A Ilusão do Crescimento", theory: "Aumentar despesa fixa baseado em 3 meses bons é o atalho pro abismo.", context: "Caixa com R$ 40.000 livres. Quer dar entrada num carrão SUV importado no CNPJ.", character: "Ego", consultoriaHint: "Trave o ego. Aplique numa reserva rendendo CDI.", options: [ { id: "A", text: "Aplicar R$ 30k em Reserva de Guerra e deixar o ego de lado.", xp: 40, isBest: true, impacts: { caixa: 8000, margem: 1.5, compliance: 20 }, feedback: "CABEÇA DE CEO.", reward: "🏆 Caixa Blindado", lesson: "" }, { id: "B", text: "Reformar a loja toda de vez.", xp: -10, isBest: false, impacts: { caixa: -35000, margem: 0, compliance: -5 }, feedback: "RISCO.", reward: "", lesson: "Descapitalizou." }, { id: "C", text: "Dar entrada na SUV assumindo 48x na PJ.", xp: -50, isBest: false, impacts: { caixa: -40000, margem: -5.0, compliance: -20 }, feedback: "ABISMO.", reward: "", lesson: "Sufocou o caixa." }] },
  { id: "t4_03", tier: 4, sector: "Limites", title: "A Trava do Crescimento", theory: "Segurar nota pra não estourar faixa do MEI/Simples é burrice empresarial e crime.", context: "Atingiu 98% do limite anual do Simples. Pedidos grandes engatilhados.", character: "Fisco", consultoriaHint: "Crescer custa impostos. Desenquadre com orgulho.", options: [ { id: "A", text: "Faturar os pedidos, desenquadrar e abraçar o lucro.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.0, compliance: 25 }, feedback: "PASSAPORTE.", reward: "🏆 Limite Rompido", lesson: "" }, { id: "B", text: "Parar de vender em novembro.", xp: -25, isBest: false, impacts: { caixa: -12000, margem: -2.0, compliance: 0 }, feedback: "ESCASSEZ.", reward: "", lesson: "Empresa que para morre." }, { id: "C", text: "Vender sem nota no dinheiro.", xp: -50, isBest: false, impacts: { caixa: 10000, margem: -3.0, compliance: -50 }, feedback: "CRIME.", reward: "", lesson: "Fisco bloqueou contas." }] },
  { id: "t4_04", tier: 4, sector: "Lucratividade", title: "O Fundo de Guerra vs Distribuição", theory: "Distribuir 100% do lucro é descapitalizar o motor que gera a riqueza.", context: "A empresa finalizou o ano com R$ 100.000 de lucro limpo na conta. O desejo é distribuir para você e seu sócio.", character: "A Divisão de Dividendos", consultoriaHint: "A regra de ouro: 30% pro bolso (prêmio), 70% pro caixa (reinvenção e guerra).", options: [ { id: "A", text: "Distribuir 30% como bônus aos sócios e reter 70% na holding/fundo para expansão e CDI.", xp: 40, isBest: true, impacts: { caixa: 10000, margem: 1.0, compliance: 20 }, feedback: "MÁQUINA DE CAPITAL.", reward: "🏆 Equity Sólido", lesson: "" }, { id: "B", text: "Distribuir 100% como dividendos 'pois a empresa é saudável'.", xp: -20, isBest: false, impacts: { caixa: -100000, margem: -2.0, compliance: -10 }, feedback: "SECAGEM DE POÇO.", reward: "", lesson: "Se houver crise em janeiro, vão pegar dinheiro caro no banco." }, { id: "C", text: "Torrar tudo em uma nova máquina que não precisava 'para não pagar imposto de renda'.", xp: -45, isBest: false, impacts: { caixa: -100000, margem: -4.0, compliance: -20 }, feedback: "MIOPIA TRIBUTÁRIA.", reward: "", lesson: "Gastou R$ 100 pra economizar R$ 15 e imobilizou o giro." }] },
  { id: "t4_05", tier: 4, sector: "Governança", title: "A Sucessão Silenciosa", theory: "Empresa que para quando o dono adoece não é ativa, é CPF mascarado.", context: "Você sofreu um pequeno acidente. Tem que ficar 30 dias sem olhar para a tela do PC. Não há assinaturas eletrônicas delegadas.", character: "O Leito Médico", consultoriaHint: "Crie processos de alçada. Delegue procuração com limites financeiros e senhas de view para contabilidade. A empresa tem que operar.", options: [ { id: "A", text: "Instituir regras de alçada bancária com aprovação dupla da equipe de confiança e contador remoto.", xp: 40, isBest: true, impacts: { caixa: -2000, margem: 1.0, compliance: 30 }, feedback: "GOVERNANÇA ATIVADA.", reward: "🏆 O Negócio Sem o Dono", lesson: "" }, { id: "B", text: "Tentar aprovar os pagamentos do celular da cama do hospital de hora em hora.", xp: -15, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: -10 }, feedback: "STRESS TOTAL.", reward: "", lesson: "Boleto atrasou, fornecedor cobrou juros." }, { id: "C", text: "Deixar as senhas master anotadas num papel para o gerente fazer o que quiser.", xp: -50, isBest: false, impacts: { caixa: -25000, margem: -5.0, compliance: -40 }, feedback: "ROULETTE RUSSA.", reward: "", lesson: "Risco absurdo de fraude e desvio irreversível." }] },
  { id: "t4_06", tier: 4, sector: "B2B", title: "O Contrato 'Lobo'", theory: "Multinacionais usam pequenas empresas para se financiar. Exclusividade com margem espremida é escravidão corporativa.", context: "Rede gigante quer exclusividade da sua entrega na região, mas exige prazo de pagamento de 120 dias e impõe margem de 5%.", character: "O Cliente Gigante", consultoriaHint: "Negócios são via de mão dupla. Se o prazo for longo, embute juros de factoring. Não dê exclusividade sem compensação gorda de volume.", options: [ { id: "A", text: "Recusar a exclusividade, aceitar prazo de 30 dias com volume menor e blindar a margem mínima de 15%.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 2.0, compliance: 20 }, feedback: "NEGOCIAÇÃO DE IGUAL.", reward: "🏆 Margem Intacta", lesson: "" }, { id: "B", text: "Aceitar a exclusividade, mas tentar antecipar os 120 dias no banco.", xp: -25, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -10 }, feedback: "A ARMADILHA.", reward: "", lesson: "Você virou funcionário terceirizado pagando juros." }, { id: "C", text: "Aceitar os 120 dias e os 5% só para colocar o logo deles no seu site.", xp: -50, isBest: false, impacts: { caixa: -30000, margem: -6.0, compliance: -20 }, feedback: "DESTRUIÇÃO TÁTICA.", reward: "", lesson: "Faturou 1 milhão e faliu por falta de liquidez." }] },
  { id: "t4_07", tier: 4, sector: "Expansão", title: "O Canto da Sereia da Filial", theory: "Copiar um processo ruim gera o dobro de problema. Abra a loja 2 só quando a loja 1 não precisar de você.", context: "Um ponto comercial incrível abriu na cidade vizinha. O corretor está te apressando. Sua loja matriz ainda depende de você no balcão.", character: "A Oportunidade Aparente", consultoriaHint: "Não multiplique o caos. Sistematize a matriz. Filial prematura queima o caixa das duas unidades.", options: [ { id: "A", text: "Recusar a filial. Pagar o bônus do seu gerente para assumir 100% da matriz nos próximos 6 meses como teste.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 2.0, compliance: 15 }, feedback: "VISÃO DE ESCALA.", reward: "🏆 Franqueador de Si Mesmo", lesson: "" }, { id: "B", text: "Pegar o ponto e você mesmo se dividir (meio dia em cada loja).", xp: -20, isBest: false, impacts: { caixa: -15000, margem: -2.5, compliance: -10 }, feedback: "ESQUIZOFRENIA CORPORATIVA.", reward: "", lesson: "As duas lojas ficaram sem dono e a qualidade desabou." }, { id: "C", text: "Abrir a filial pegando um sócio investidor para o qual você não definiu o contrato social.", xp: -45, isBest: false, impacts: { caixa: -25000, margem: -4.0, compliance: -30 }, feedback: "CAOS JURÍDICO.", reward: "", lesson: "Casamento sem namoro e briga por dinheiro em 3 meses." }] },
  { id: "t4_08", tier: 4, sector: "RH e Retenção", title: "A Guerra de Talentos (PLR)", theory: "Chega de dar cestas básicas ou pizza. Para reter elite, pague como elite atrelando aos lucros (EBITDA).", context: "Sua camada de 3 gerentes seniores está sendo assediada pela concorrência. Eles querem mais participação financeira no ano.", character: "Os Comandantes", consultoriaHint: "Institua a PLR atrelada ao Lucro Líquido Real e metas de redução de custo. Alinhe o bolso deles com o seu.", options: [ { id: "A", text: "Desenhar um plano de PLR baseado na melhoria do Lucro Líquido e metas individuais claras.", xp: 40, isBest: true, impacts: { caixa: -5000, margem: 3.5, compliance: 25 }, feedback: "ALINHAMENTO DE INTERESSES.", reward: "🏆 Equity Mental (Eles pensam como donos)", lesson: "" }, { id: "B", text: "Aumentar em 15% o salário fixo de todo mundo e rezar para darem resultado.", xp: -20, isBest: false, impacts: { caixa: -10000, margem: -3.0, compliance: -5 }, feedback: "AUMENTO DE PASSIVO.", reward: "", lesson: "Aumentou o custo da empresa sem garantia de produção extra." }, { id: "C", text: "Fazer discurso motivacional dizendo que 'a empresa é uma família' e negar grana.", xp: -40, isBest: false, impacts: { caixa: -15000, margem: -4.0, compliance: -15 }, feedback: "DEMISSÃO EM MASSA.", reward: "", lesson: "Família não paga as contas no fim do mês. Eles foram embora." }] },
  { id: "t4_09", tier: 4, sector: "Competição", title: "A Concorrência Sonegadora", theory: "Guerra de preços com quem não paga imposto é lutar contra uma parede de concreto.", context: "Três concorrentes regionais que vendem sem nota fiscal derrubaram o preço do mercado em 30%. Você trabalha no Simples Nacional e com nota.", character: "A Praça Canibalizada", consultoriaHint: "Bypass. Saia do mercado sangrento (Oceano Vermelho). Pivote seu público-alvo para B2B e tickets mais altos que exigem NF obrigatoriamente.", options: [ { id: "A", text: "Mudar a estratégia: Focar 80% do comercial em clientes B2B grandes que exigem NF-e e valorizam garantia jurídica.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 2.0, compliance: 20 }, feedback: "PIVÔ INTELIGENTE.", reward: "🏆 Oceano Azul", lesson: "" }, { id: "B", text: "Reclamar no Instagram sobre os sonegadores e esperar o cliente ter pena.", xp: -15, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: 0 }, feedback: "CHORO PERDEDOR.", reward: "", lesson: "Cliente não liga para seus impostos, liga para o problema dele." }, { id: "C", text: "Parar de emitir nota também para 'conseguir competir de igual para igual'.", xp: -50, isBest: false, impacts: { caixa: 20000, margem: -5.0, compliance: -60 }, feedback: "CRIME.", reward: "", lesson: "Autuação da SEFAZ, bloqueio de conta bancária e risco criminal." }] },
  { id: "t4_10", tier: 4, sector: "Fluxo", title: "O Crescimento a Prazo (Asfixia)", theory: "A pior falência é a falência da empresa que mais vende (crescimento asfixiante). Muita venda parcelada exigindo recomprar de insumo à vista zera sua liquidez.", context: "Recorde: R$ 150k vendidos neste mês. Mas 90% em 12x no cartão. O giro do estoque exige que você compre R$ 80k amanhã à vista para repor.", character: "O Boom Invertido", consultoriaHint: "Trave as vendas parceladas e crie o 'Desconto Assoalho' para pagamento à vista. Diminua a velocidade para respirar.", options: [ { id: "A", text: "Limitar o parcelamento a 3x para novas vendas e forçar campanha agressiva de injeção PIX.", xp: 40, isBest: true, impacts: { caixa: 25000, margem: 1.0, compliance: 15 }, feedback: "PISANDO NO FREIO ESTRATÉGICO.", reward: "🏆 Conversão de Ciclo", lesson: "" }, { id: "B", text: "Antecipar os 150k inteiros no banco pagando as taxas de 12x (quase 20%).", xp: -25, isBest: false, impacts: { caixa: -30000, margem: -6.0, compliance: -5 }, feedback: "TRANSFERÊNCIA DE RIQUEZA.", reward: "", lesson: "Você bateu recorde só para enriquecer o gerente do banco." }, { id: "C", text: "Continuar vendendo em 12x, não repor estoque e deixar cliente esperando 40 dias o produto.", xp: -45, isBest: false, impacts: { caixa: -20000, margem: -5.0, compliance: -20 }, feedback: "CALOTE DE PRAZO.", reward: "", lesson: "Procon, cancelamentos massivos (chargeback) e destruição do CNPJ." }] }
];

export default function CodigoAzulGame() {
  // Configurações e estados (Autenticação)
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
  
  // Game HUD
  const [xp, setXp] = useState(0);
  const [caixa, setCaixa] = useState(45000); 
  const [margem, setMargem] = useState(18.0);
  const [compliance, setCompliance] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Feedbacks
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);
  const [lastImpacts, setLastImpacts] = useState<any>(null);
  const [phaseReward, setPhaseReward] = useState<string | null>(null);
  
  // Motor Local (10 Fases Cíclicas)
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isEvaluatingChoice, setIsEvaluatingChoice] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); // De 0 a 9 (Fase 1 a 10)
  
  // UX Features
  const [showConsultoriaHint, setShowConsultoriaHint] = useState(false);
  
  // DRE Vivo
  const [dreMode, setDreMode] = useState<'none' | 'mid-month' | 'end-month'>('none');
  const [dreProLabore, setDreProLabore] = useState(5000);
  const [dreMarketing, setDreMarketing] = useState(1000);
  const [dreTaxas, setDreTaxas] = useState(1900); 

  // Salvar no BD
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

  // Cálculos de Nível
  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;
  const monthProgress = ((currentStage) / 10) * 100;

  // Carregamento Cíclico de Questões
  const loadNextQuestion = () => {
    setFeedback(null);
    setPhaseReward(null);
    setShowConsultoriaHint(false);
    
    let available = questionBank.filter(q => q.tier <= currentLevel.tier && !usedQuestionIds.includes(q.id));
    
    // Auto-reciclagem segura
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

  // Consultoria Premium
  const handleConsultoria = () => {
    if (caixa >= 3500) {
      setCaixa(prev => prev - 3500);
      setXp(prev => prev + 20); // XP imediato
      setShowConsultoriaHint(true);
    } else {
      alert("Caixa insuficiente para acionar o Pedro Monte.");
    }
  };

  // Avaliação de Decisões (Prevenção de Race Conditions)
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
      setPhaseReward(`❌ ${selectedOption.lesson || "Decisão fraca custa o seu fluxo."}`);
    }

    // Updates funcionais para não ocorrer bugs com cliques rápidos
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

  // Avanço Cíclico
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
      // Bateu 10 decisões: Fechamento de Mês Real!
      setDreMode('end-month'); 
    }
  };

  // --- DRE DINÂMICA LIGADA AO XP E MARGEM DO JOGADOR ---
  // O Faturamento base começa em 50k, mas ganha força com seu XP.
  const dreReceita = 45000 + (xp * 15); 
  // A margem de contribuição reflete EXATAMENTE o % que você defende no jogo.
  const dreMargemReal = (margem / 100); 
  const dreMargemContribuicao = dreReceita * dreMargemReal;
  
  // Impostos + CMV somados = Receita Bruta - Margem de Contribuição
  const dreCustosVariaveis = dreReceita - dreMargemContribuicao; 
  
  // Custos Fixos (Inflexíveis + Alavancas do Jogador)
  const dreCustoFixoBase = 8850; 
  const dreTotalDespesasFixas = dreCustoFixoBase + dreProLabore + dreMarketing + dreTaxas;
  
  const dreLucroLiquido = dreMargemContribuicao - dreTotalDespesasFixas;

  // Lógica dos Botões da DRE
  const handleSalvarDREMidMonth = () => {
    // Apenas salva a projeção, não injeta dinheiro e não vira fase.
    setDreMode('none');
  };

  const handleInjetarLucroEndMonth = () => {
    // Final de mês: Injeta lucro no caixa da PJ
    setCaixa(prev => prev + dreLucroLiquido);
    setDreMode('none');
    setCurrentStage(0); // Vira para o Mês Seguinte
    setCurrentScenario(null); 
  };

  // --- AUTH e Reset ---
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
            <div className="space-y-1 text-left"><label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono pl-1">Nome do seu Negócio</label><input type="text" value={companyNameInput} onChange={(e) => setCompanyNameInput(e.target.value)} className="w-full bg-[#020617]/50 border border-cyan-800/50 rounded-lg px-4 py-3 text-sm text-cyan-50 focus:border-cyan-500 transition-all" required /></div>
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
              <label className="text-[10px] text-slate-400 uppercase font-mono flex justify-between"><span>{authMode === 'forgot' ? 'Nova Senha Segura' : 'Senha de Acesso'}</span></label>
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

  // --- TELA DRE INTERATIVA (Dono pro Painel) ---
  if (dreMode !== 'none') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative font-sans overflow-y-auto">
        <div className="z-10 bg-[#0f172a]/95 p-6 md:p-10 rounded-3xl border border-cyan-900/50 max-w-3xl w-full shadow-2xl my-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-slate-100 uppercase tracking-widest">Painel de <span className="font-semibold text-cyan-400">Controle DRE</span></h1>
            <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase">Ajuste os botões para planejar sua empresa. {dreMode === 'end-month' && "O lucro será injetado agora!"}</p>
          </div>

          <div className="bg-[#020617]/50 rounded-xl border border-slate-800 overflow-hidden mb-6">
            <div className="grid grid-cols-2 text-[10px] font-mono uppercase text-slate-500 bg-slate-900/50 p-3 border-b border-slate-800"><div>Métricas Vivas do Jogo</div><div className="text-right">Projeção Mensal (R$)</div></div>
            <div className="p-4 space-y-3 font-mono text-xs text-slate-300">
               <div className="flex justify-between items-center"><span className="text-cyan-400 font-bold">1. RECEITA BRUTA PROJETADA</span><span className="font-bold">{formatBRL(dreReceita)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500"><span>(-) Impostos & CMV</span><span>{formatBRL(dreCustosVariaveis)}</span></div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-800/50 text-amber-400 font-semibold"><span>3. MARGEM DE CONTRIBUIÇÃO ({formatPct(margem)})</span><span>{formatBRL(dreMargemContribuicao)}</span></div>
               <div className="flex justify-between items-center pl-4 text-slate-500 mt-2"><span>(-) Custos Fixos Base (Aluguel, Luz)</span><span>{formatBRL(dreCustoFixoBase)}</span></div>
               <div className="flex justify-between items-center pl-4 text-emerald-400/80 bg-emerald-900/10 p-1 rounded"><span>(-) Seu Pró-labore</span><span>{formatBRL(dreProLabore)}</span></div>
               <div className="flex justify-between items-center pl-4 text-blue-400/80 bg-blue-900/10 p-1 rounded"><span>(-) Marketing (Anúncios)</span><span>{formatBRL(dreMarketing)}</span></div>
               <div className="flex justify-between items-center pl-4 text-red-400/80 bg-red-900/10 p-1 rounded"><span>(-) Taxas Bancárias / Maquininha</span><span>{formatBRL(dreTaxas)}</span></div>
               <div className={`flex justify-between items-center pt-4 border-t border-slate-700 text-sm font-bold ${dreLucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                 <span className="uppercase">5. LUCRO LÍQUIDO PROJETADO</span><span>{dreLucroLiquido >= 0 ? '+' : ''}{formatBRL(dreLucroLiquido)}</span>
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
               <input type="range" min="0" max="10000" step="100" value={dreMarketing} onChange={(e) => setDreMarketing(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] font-mono uppercase mb-2"><span className="text-red-400">Taxas Bancárias (Pare de antecipar!)</span><span className="text-slate-400">{formatBRL(dreTaxas)}</span></div>
               <input type="range" min="0" max="4000" step="100" value={dreTaxas} onChange={(e) => setDreTaxas(Number(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </div>
          
          {dreMode === 'end-month' ? (
             <button onClick={handleInjetarLucroEndMonth} className="w-full bg-emerald-900/50 border border-emerald-800 text-emerald-400 hover:bg-emerald-800/60 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Injetar Lucro Real e Iniciar Novo Mês</button>
          ) : (
             <button onClick={handleSalvarDREMidMonth} className="w-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/50 text-xs font-mono py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg">Salvar Projeção e Voltar ao Jogo</button>
          )}
        </div>
      </div>
    );
  }

  if (!currentScenario) return <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4"><div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div><h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Monitorando o Mercado...</h2></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[#0f172a]/80 backdrop-blur-md p-5 rounded-xl border border-white/5">
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Caixa (Oxigênio)</span><span className={`text-xs font-bold font-mono ${caixa > 30000 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatBRL(caixa)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${caixa > 20000 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${caixaBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Margem Real</span><span className={`text-xs font-bold font-mono ${margem >= 15 ? 'text-blue-400' : 'text-amber-400'}`}>{formatPct(margem)}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className={`h-full ${margem > 10 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${margemBarFill}%` }}></div></div></div>
          <div className="flex flex-col"><div className="flex justify-between items-baseline mb-1"><span className="text-[10px] font-mono uppercase text-slate-400">Maturidade do Dono</span><span className="text-xs font-bold font-mono text-purple-400">{currentLevel.title}</span></div><div className="h-1.5 w-full bg-[#020617] rounded-sm overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${progressToNext}%` }}></div></div></div>
        </div>

        <header className="bg-[#0f172a]/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div><h1 className="text-base font-light text-slate-100 uppercase"><span className="font-semibold text-cyan-400">{companyName}</span></h1><p className="text-slate-500 text-[10px] font-mono uppercase">Dono(a): <span className="text-slate-300">{playerName}</span></p></div>
          </div>
          <div className="w-full md:w-80">
            <div className="flex justify-between items-baseline mb-2"><p className="text-[10px] font-mono text-slate-400 uppercase">Projeção Mensal — Decisão {currentStage + 1}/10</p></div>
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
                💎 Pedro Monte (R$ 3.500)
              </button>
            </div>

            {showConsultoriaHint && (
              <div className="mb-6 bg-amber-950/20 border-l-2 border-amber-500 p-5 rounded-r-lg shadow-inner">
                <p className="text-amber-400 text-[11px] font-mono uppercase mb-2 flex items-center gap-2"><span>👁️</span> Visão Estratégica Injetada:</p>
                <p className="text-slate-300 text-sm font-light italic leading-relaxed">"{currentScenario.consultoriaHint}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-cyan-900/40">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> 1. O Choque de Realidade (Teoria)</h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed text-justify">{currentScenario.theory}</p>
              </div>
              <div className="bg-[#020617]/50 p-6 rounded-xl border border-amber-900/40">
                <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 2. O Problema (Prática)</h3>
                <p className="text-slate-200 text-[13px] font-light leading-relaxed text-justify">{currentScenario.context}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">No seu encalço: <span className="text-slate-400">{currentScenario.character}</span></p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Tome uma decisão como Dono(a):</h3>
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

            {/* CAIXA DE RECOMPENSA OU LIÇÃO */}
            {phaseReward && (
              <div className={`mb-8 p-6 rounded-xl border text-left max-w-2xl mx-auto ${phaseReward.includes("🏆") ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-red-950/20 border-red-800/50'}`}>
                 <h3 className={`text-[11px] font-mono uppercase tracking-widest mb-2 ${phaseReward.includes("🏆") ? 'text-emerald-400' : 'text-red-400'}`}>
                   {phaseReward.includes("🏆") ? 'Recompensa do Mentor:' : 'Alerta do Mentor:'}
                 </h3>
                 <p className="text-slate-200 text-sm font-light leading-relaxed">{phaseReward}</p>
              </div>
            )}

            <div className="bg-[#020617]/60 p-6 md:p-8 rounded-xl border border-white/5 mb-8 text-left max-w-3xl mx-auto relative whitespace-pre-wrap">
               <span className="absolute -top-3 left-6 bg-[#0f172a] px-3 py-1 text-[9px] uppercase tracking-widest text-cyan-400 font-mono border border-slate-700/50 rounded-md">Parecer do Mercado:</span>
              <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 text-justify">{feedback}</p>
            </div>

            <button onClick={proceedToNextQuestion} className="border border-slate-600 hover:border-cyan-400 text-cyan-400 text-[10px] font-mono tracking-[0.2em] py-3.5 px-10 rounded-xl transition-all uppercase">
              {currentStage === 9 ? "Encerrar Mês e Abrir DRE" : "Avançar para o Próximo Desafio"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 pt-2 font-mono">
          <button onClick={() => setDreMode('mid-month')} className="text-[9px] text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] font-bold">📊 Ajustar DRE Parcial</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleLogout} className="text-[9px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]">Sair do Jogo</button>
          <span className="text-slate-800">/</span>
          <button onClick={handleResetCareer} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Resetar CNPJ</button>
        </div>

      </div>
    </div>
  );
}