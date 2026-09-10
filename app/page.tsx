"use client";

import { useState } from "react";

// --- BANCO DE DADOS DE CENÁRIOS (CÓDIGO AZUL) ---
const scenarios = [
  {
    id: 1,
    title: "A Ilusão do Lucro e a Tração Fatal",
    theory: "Lucro é uma opinião contábil; caixa é um fato inquestionável. O Ciclo Financeiro dita a sobrevivência. Quando uma empresa cresce financiando clientes e pagando fornecedores à vista, ocorre o Efeito Tesoura (Overtrading): a necessidade de capital de giro asfixia a operação, mesmo com lucro.",
    context: "Distribuidora Vértice: Vendas subiram 40%. Lucro de 15% na DRE. Porém, o caixa amanheceu negativo e não há dinheiro para a folha de sexta. Prazos: Pagam fornecedores em 15 dias, estoque gira em 30, e recebem de clientes em 60 dias.",
    options: [
      {
        text: "A) Captar empréstimo bancário para capital de giro e manter o crescimento de 40%.",
        xp: -200,
        feedback: "ERRO FATAL. Pegar dívida para financiar um ciclo financeiro invertido (receber em 60, pagar em 15) é jogar gasolina no incêndio. Você vai pagar juros para sustentar o buraco e a empresa vai quebrar afogada em dívidas."
      },
      {
        text: "B) Antecipar recebíveis para cobrir a folha, renegociar fornecedores para 45 dias e travar vendas a prazo.",
        xp: 200,
        feedback: "DECISÃO CIRÚRGICA. Primeiro você estanca a hemorragia (salva a folha com antecipação). Depois, corrige o processo (alinha prazo de pagamento com recebimento). É gestão de caixa na veia."
      },
      {
        text: "C) Cortar 20% do OPEX e demitir equipe para aumentar margem de lucro para 25%.",
        xp: -100,
        feedback: "ERRO ESTRATÉGICO. Demitir não gera caixa imediato. O problema não é a margem de lucro, mas sim o descasamento de prazos no capital de giro."
      }
    ]
  },
  {
    id: 2,
    title: "O Parasita Invisível e o Custeio ABC",
    theory: "No rateio por absorção (tradicional), o custo fixo da empresa é dividido por volume, camuflando a realidade. O Custeio ABC (Activity-Based Costing) rastreia quem consome o esforço. Sem o ABC, o seu produto de giro rápido paga a conta do seu produto 'premium' que suga a operação.",
    context: "Indústria Titan. Produz dois itens: Peça A (Padrão, alto volume) e Peça B (Sob medida, baixo volume). O rateio tradicional mostra que ambas dão 20% de lucro. A equipe de vendas focou na Peça B por ser mais cara, mas o caixa secou. O Raio-X revela: a Peça B exige 5x mais reconfiguração de máquinas, suporte e controle de qualidade.",
    options: [
      {
        text: "A) Aumentar o preço de ambos os produtos em 15% de forma linear para recompor a margem geral.",
        xp: -100,
        feedback: "ERRO ESTRATÉGICO. Aumento linear pune o produto que já é bom. Você vai encarecer a Peça A (que subsidia a B), perdendo vendas nela, enquanto a Peça B continuará parasitando seus recursos."
      },
      {
        text: "B) Implementar Custeio ABC para isolar os custos. Reprecificar a Peça B para cima e focar as comissões na Peça A.",
        xp: 200,
        feedback: "DECISÃO CIRÚRGICA. Você usou a contabilidade avançada para ver o que ninguém via. Reprecificar quem dá trabalho e escalar quem tem processo enxuto é o que destrava a alavancagem de um negócio."
      },
      {
        text: "C) Cortar pela metade o tempo de engenharia e qualidade da Peça B para forçar o custo a baixar.",
        xp: -200,
        feedback: "ERRO FATAL. Reduzir qualidade de um produto sob medida vai gerar devoluções e queima de marca. O erro estava na precificação, não na engenharia."
      }
    ]
  },
  {
    id: 3,
    title: "A Ilusão do Crescimento e o Modelo DuPont",
    theory: "O ROE (Retorno sobre Patrimônio Líquido) isolado é cego. O Modelo DuPont quebra o ROE em três motores: Margem Líquida (eficiência operacional), Giro do Ativo (eficiência de vendas) e Alavancagem (uso de dívida). Um ROE alto movido puramente a dívida é uma bomba relógio.",
    context: "Distribuidora de Aços Forte. O ROE saltou de 15% para 35% no último ano. Os sócios estão eufóricos e querem distribuir dividendos recordes. Aplicando o Modelo DuPont, você descobre a verdade: a Margem Líquida caiu de 10% para 6% (perderam eficiência), o Giro do Ativo estagnou, mas o passivo explodiu com empréstimos caros de curto prazo para bancar novas filiais.",
    options: [
      {
        text: "A) Aprovar a distribuição de dividendos recordes. Afinal, um ROE de 35% justifica premiar os sócios pelo crescimento acelerado.",
        xp: -200,
        feedback: "ERRO FATAL. Você acabou de descapitalizar uma empresa altamente endividada. O ROE cresceu por anabolizante financeiro (dívida), não por competência operacional. Em poucos meses, faltará caixa para pagar os juros e os sócios terão que injetar o dinheiro de volta."
      },
      {
        text: "B) Travar os dividendos, reestruturar a dívida de curto para longo prazo e iniciar um plano agressivo de recuperação da Margem Líquida.",
        xp: 200,
        feedback: "DECISÃO CIRÚRGICA. Você destruiu a ilusão da métrica de vaidade. Como estrategista, você protegeu o caixa (travando dividendos), alongou o perfil da dívida para não sufocar a operação e atacou a raiz do problema: a ineficiência operacional que derrubou a margem."
      },
      {
        text: "C) Vender imediatamente as filiais recém-abertas para pagar as dívidas de curto prazo e manter a distribuição de dividendos.",
        xp: -100,
        feedback: "ERRO ESTRATÉGICO. Vender ativos operacionais de forma afobada para pagar dividendos é destruir o potencial futuro do negócio. O foco deveria ser ajustar a estrutura de capital (alongar dívida) e não desmembrar a empresa."
      }
    ]
  },
  {
    id: 4,
    title: "O Descompasso do Relógio Financeiro e o Ciclo de Caixa",
    theory: "O Ciclo de Conversão de Caixa (CCC) é o tempo em dias que a empresa leva para transformar o pagamento do fornecedor no recebimento do cliente. Um CCC positivo significa que a empresa financia a operação; um CCC negativo significa que os fornecedores financiam a empresa. O segredo da tração sem custo é esticar contas a pagar, espremer estoques e antecipar recebimentos.",
    context: "Comercial de Alimentos Ômega. O faturamento está estável, mas a necessidade de capital de giro (NCG) explodiu. O dono sente o tempo fechar no caixa todo fim de mês. O raio-X mostra: o prazo médio de pagamento (PMP) é de 20 dias, o estoque gira em 40 dias e o prazo de recebimento (PMR) é de 30 dias. O Ciclo de Caixa está em alarmantes 50 dias. O negócio está asfixiado financiando clientes e estocando dinheiro morto.",
    options: [
      {
        text: "A) Buscar uma linha de crédito rotativo no banco para ter fôlego todo fim de mês e garantir que os fornecedores sejam pagos em dia, mantendo a reputação.",
        xp: -300,
        feedback: "ERRO FATAL. Você usou dívida cara para cobrir um erro de operação. O banco vai enriquecer às custas do seu descasamento de prazos. Em poucos meses, os juros do rotativo vão comer toda a margem de lucro e o negócio entrará em modo sobrevivência irreversível."
      },
      {
        text: "B) Aumentar o nível de estoque para 60 dias aproveitando descontos de volume dos fornecedores e parcelar as vendas em 12x sem juros para atrair mais clientes.",
        xp: -400,
        feedback: "ERRO ESTRATÉGICO GRAVE. Desconto de volume não paga buraco de caixa. Ao aumentar o estoque para 60 dias e esticar recebimentos, você piorou o Ciclo de Caixa de 50 para mais de 100 dias. A empresa quebrará com prateleiras cheias e recebíveis presos."
      },
      {
        text: "C) Implantar o 'Código Azul': Renegociar boletos com fornecedores para 45 dias, liquidar o estoque de giro lento com ofertas à vista e travar parcelamentos de clientes para no máximo 30 dias.",
        xp: 300,
        feedback: "DECISÃO CIRÚRGICA. De Dono para Dono, você assumiu o painel de controle. Esticou o prazo de pagamento, acelerou a rotação do estoque e antecipou o dinheiro que entra. Você espremeu o Ciclo de Caixa, liberando dinheiro preso na operação para o bolso da empresa sem pagar 1 centavo de juros."
      }
    ]
  },
  {
    id: 5,
    title: "A Fogueira das Vaidades: CAC, LTV e o Churn Fatal",
    theory: "Crescimento não é sobre o volume de clientes que entram, mas sobre o custo de cada entrada (CAC) e o lucro que eles geram no longo prazo (LTV). A regra de ouro das finanças dita que o LTV deve ser pelo menos 3x maior que o CAC. Se o cliente vai embora rápido demais (Churn alto), a empresa não recupera o investimento de aquisição (Payback) e sangra até a morte financiando o próprio 'crescimento'.",
    context: "Plataforma de software 'Gestão Integrada'. A equipe de marketing comemora um mês recorde de captação de clientes via tráfego pago agressivo. Você analisa os sinais vitais: O Custo de Aquisição (CAC) é de R$ 600 por cliente. A mensalidade do software é R$ 150. No entanto, o nível de cancelamento (Churn) é brutal, e o cliente médio vai embora no 3º mês. O LTV atual é de apenas R$ 450 (3 meses x R$ 150). A empresa paga R$ 600 para receber R$ 450 ao longo de 90 dias.",
    options: [
      {
        text: "A) Dobrar a verba de tráfego pago. Já que os clientes estão saindo rápido, a única forma de manter a receita alta e não fechar no vermelho no fim do ano é socar mais clientes novos para dentro do funil.",
        xp: -400,
        feedback: "ERRO FATAL. Você acabou de pisar no acelerador em direção ao abismo. Se a cada cliente você tem um prejuízo real de R$ 150 (CAC de 600 - LTV de 450), escalar essa operação significa multiplicar o seu prejuízo e acelerar a falência matemática do negócio."
      },
      {
        text: "B) Zerar todo o orçamento de marketing e demitir a equipe de vendas. A empresa deve focar 100% no boca a boca e crescimento orgânico lento até o produto ficar perfeito.",
        xp: -200,
        feedback: "ERRO ESTRATÉGICO. Parar a máquina de vendas abruptamente vai secar a entrada de caixa por completo, impedindo a empresa de pagar os custos fixos atuais. Cortar o oxigênio não cura a doença."
      },
      {
        text: "C) Implantar o 'Código Azul': Pausar temporariamente a escala do tráfego. Focar energia em um processo de Onboarding (integração) agressivo e Sucesso do Cliente para esticar a retenção de 3 para 10 meses (Elevando o LTV para R$ 1.500) antes de voltar a acelerar a aquisição.",
        xp: 400,
        feedback: "DECISÃO CIRÚRGICA. Você assumiu o painel de controle de dono para dono. O problema não era a aquisição, era a retenção (Churn). Ao focar em reter o cliente, você transformou um LTV de R$ 450 em R$ 1.500. Agora, pagar R$ 600 de CAC se tornou um investimento altamente lucrativo."
      }
    ]
  },
  {
    id: 6,
    title: "O Salto do Tubarão: Valuation e Leveraged Buyout (LBO)",
    theory: "O LBO (Leveraged Buyout) é a arte de comprar uma empresa usando o mínimo do seu dinheiro e o máximo de dívida bancária, garantida pelos ativos e pelo caixa da própria empresa adquirida. O Valuation correto impede que você pague por otimismo. O segredo é comprar um negócio mal gerido (descontado), aplicar sua gestão estratégica e usar o lucro destravado para pagar a dívida da compra.",
    context: "Você mapeou um concorrente direto: a 'Logística Alfa'. Eles têm boa carteira de clientes, mas o dono está exausto e a gestão é caótica. O Valuation por múltiplos aponta valor de R$ 2 milhões. Para fechar rápido, ele aceita vender por R$ 1,5 milhão. Sua empresa matriz tem R$ 1,5 milhão em caixa livre (seu fundo de guerra de segurança). Você quer a carteira da Alfa, mas sabe que a operação deles precisará de capital de giro logo no mês um.",
    options: [
      {
        text: "A) Pagar os R$ 1,5 milhão à vista usando todo o seu fundo de guerra. Afinal, comprar com desconto e sem dívidas garante que todo o lucro futuro seja seu sem pagar juros ao banco.",
        xp: -300,
        feedback: "ERRO DE ALOCAÇÃO. Descapitalizar seu caixa principal para comprar uma empresa caótica te deixa vulnerável. Ao colocar todo seu fundo de segurança na compra, quando a Alfa precisar de injeção de capital de giro no mês seguinte, sua matriz corre o risco de quebrar junto."
      },
      {
        text: "B) Oferecer R$ 1 milhão, mas propor uma fusão (troca de ações). O dono da Alfa continua no negócio com 30% das cotas, e vocês unem as marcas e operações.",
        xp: -200,
        feedback: "ERRO DE CULTURA E CONTROLE. Trazer um gestor caótico, exausto e com vícios operacionais para ser seu sócio minoritário é comprar uma briga societária que vai drenar sua energia. Fusão exige alinhamento cultural, não apenas financeiro."
      },
      {
        text: "C) Estruturar um LBO: Pagar R$ 300 mil (20%) de entrada do seu caixa. Financiar os outros R$ 1,2 milhão no banco a longo prazo, estruturando para que o próprio lucro futuro da Alfa pague as parcelas da dívida.",
        xp: 500,
        feedback: "JOGADA DE MESTRE. Você manteve R$ 1,2 milhão seguros na sua matriz e usou a alavancagem bancária a seu favor. O ativo que você comprou vai pagar a própria dívida. Você comprou um concorrente por uma fração do preço e multiplicou o ROE (Retorno sobre o Patrimônio Líquido)."
      }
    ]
  },
  {
    id: 7,
    title: "A Engenharia do Capital: WACC e o Escudo Fiscal",
    theory: "Na alta gestão, fugir de dívidas a qualquer custo é um erro amador. O Capital de Terceiros (banco) é geralmente mais barato que o Capital Próprio (sócios), e os juros pagos abatem o Imposto de Renda (Escudo Fiscal). O segredo é encontrar a Estrutura Ótima de Capital: misturar dívida e capital próprio para atingir o menor Custo Médio Ponderado de Capital (WACC) possível, sem cruzar a linha do risco de ruína.",
    context: "Holding 'Expansão Ômega'. O conselho aprovou um projeto de R$ 5 milhões que vai gerar R$ 1,5 milhão de caixa livre ao ano. Os sócios exigem um retorno de 20% a.a. (Custo de Capital Próprio). O banco oferece os R$ 5 milhões a 12% a.a. (que cai para 8% após o desconto do Imposto de Renda). A empresa hoje tem zero dívidas e fluxo de caixa altamente previsível.",
    options: [
      {
        text: "A) Fazer a chamada de capital e usar 100% do dinheiro dos sócios. Empresa boa é empresa sem dívida. Assim o lucro do projeto fica todo na casa, sem pagar juros ao banco.",
        xp: -300,
        feedback: "ERRO DE ALOCAÇÃO. O dinheiro dos sócios é o mais caro (20%). Ao fugir do banco por preciosismo, você aumentou drasticamente o custo de capital (WACC) do projeto e abriu mão do benefício fiscal. A rentabilidade sobre o patrimônio (ROE) será medíocre."
      },
      {
        text: "B) Financiar 100% do projeto com o banco. Já que o custo da dívida real é de apenas 8% e o projeto gera muito caixa, usar apenas o dinheiro do banco maximiza o retorno infinito dos sócios.",
        xp: -400,
        feedback: "ERRO DE FRAGILIDADE. Financiamento de 100% (alavancagem extrema) maximiza o retorno teórico, mas eleva drasticamente o risco de ruína. Qualquer oscilação de mercado ou atraso no projeto deixará a empresa sem caixa para pagar as parcelas, levando à execução das garantias."
      },
      {
        text: "C) Estruturar um mix (ex: 60% Banco e 40% Sócios). Usar a dívida de 8% para baratear o custo médio da operação (WACC) e aproveitar o escudo fiscal, mas manter uma base sólida de capital próprio para amortecer riscos.",
        xp: 600,
        feedback: "DECISÃO CIRÚRGICA DE CFO. Você otimizou a Estrutura de Capital. Ao misturar o dinheiro barato do banco com o dinheiro dos sócios, você derrubou o WACC, turbinou o ROE e manteve a margem de segurança intacta. Isso é engenharia financeira de elite."
      }
    ]
  },
  {
    id: 8,
    title: "A Teoria das Restrições e o Gargalo de Fluxo",
    theory: "O princípio de Eliyahu Goldratt decreta que todo negócio é uma corrente, sendo tão forte quanto o seu elo mais fraco (a Restrição/Gargalo). Qualquer investimento para melhorar um setor que não é o gargalo é desperdício. O sistema inteiro deve ser subordinado à velocidade do gargalo até que ele seja quebrado.",
    context: "Indústria de Móveis 'Corte Fino'. As vendas estão explodindo, mas a entrega está atrasada, gerando devoluções e queima de marca. O Raio-X operacional revela as capacidades máximas por mês: O Comercial vende 120 móveis. A Marcenaria (corte e montagem) processa apenas 80. O Acabamento tem capacidade para 150. O dono quer comprar máquinas novas para o Acabamento porque os funcionários lá estão 'ociosos parte do dia'.",
    options: [
      {
        text: "A) Comprar os equipamentos para o setor de Acabamento (elevando para 180 móveis/mês), garantindo que a equipe não fique ociosa e pague seus salários com produtividade máxima.",
        xp: -300,
        feedback: "ERRO CLÁSSICO DE GESTÃO. Você investiu caixa para melhorar um setor que não é a restrição. Não importa se o Acabamento faz 150 ou 180; eles só vão receber 80 móveis da Marcenaria. A produção final continuará sendo 80, e você destruiu o fluxo de caixa."
      },
      {
        text: "B) Demitir 30% da equipe comercial para forçar as vendas a caírem para 80 móveis por mês, equilibrando a empresa e acabando com a ociosidade do Acabamento.",
        xp: -200,
        feedback: "ERRO ESTRATÉGICO GRAVE. Atrofiar o faturamento (vendas) para consertar um processo fabril é punir a empresa pela própria ineficiência. Cortar a entrada de receita é o caminho mais rápido para a estagnação e irrelevância no mercado."
      },
      {
        text: "C) Mapear a Marcenaria como o gargalo absoluto. Deslocar os funcionários 'ociosos' do Acabamento para ajudar no corte e focar 100% dos investimentos (máquinas e processos) exclusivamente na Marcenaria até destravar a produção.",
        xp: 600,
        feedback: "VISÃO SISTÊMICA DE ELITE. Você identificou a Restrição (TOC) e subordinou o negócio a ela. Não se investe um centavo ou esforço fora do gargalo. Você alocou capacidade ociosa onde o sistema estava travado, destravando o fluxo de caixa da empresa inteira sem aumentar despesas."
      }
    ]
  },
  {
    id: 9,
    title: "A Faca na Carne: Orçamento Base Zero (OBZ)",
    theory: "O orçamento tradicional pega o custo do ano passado e adiciona a inflação, perpetuando o desperdício histórico. O Orçamento Base Zero (OBZ) destrói essa lógica. Todo ano, cada centro de custo começa em R$ 0,00. Nenhuma despesa é garantida pelo histórico; cada centavo precisa ser defendido e justificado do zero, atrelando os gastos exclusivamente às metas estratégicas do novo ano.",
    context: "Clínica Médica Vital. O faturamento cresce, mas a margem de lucro cai assustadoramente. A diretoria apresenta o orçamento para o próximo ano: um aumento linear de 8% em todas as linhas (softwares, marketing, materiais e folha) baseado no realizado do ano anterior, argumentando que é um 'reajuste seguro pela inflação'.",
    options: [
      {
        text: "A) Aprovar o reajuste linear de 8%. Seguir o custo histórico atrelado à inflação é a forma mais segura de não paralisar a operação com cortes drásticos e manter a equipe motivada.",
        xp: -300,
        feedback: "ERRO FATAL. Você acabou de garantir que todo o desperdício e ineficiência do ano passado sejam mantidos e premiados com 8% de aumento. O custo histórico é a zona de conforto da gestão medíocre."
      },
      {
        text: "B) Rejeitar a proposta e impor um corte linear de 15% em todos os departamentos. Se a margem está caindo, é preciso forçar a eficiência espremendo os custos de todos os gerentes de forma igualitária.",
        xp: -400,
        feedback: "ERRO ESTRATÉGICO. Cortes lineares são cegos. Você corre o risco de cortar 15% do marketing que traz os pacientes (destruindo a receita) e manter 85% de uma assinatura de software inútil. Você pune os eficientes junto com os ineficientes."
      },
      {
        text: "C) Vetar o orçamento histórico e aplicar o OBZ. Exigir que os gerentes construam as planilhas do zero. Cada despesa — seja folha, software ou material — deve ser justificada de acordo com as metas deste ano, caso contrário, será sumariamente cortada.",
        xp: 500,
        feedback: "DECISÃO CIRÚRGICA. Você aplicou o remédio amargo que salva empresas. O OBZ arranca os custos zumbis pela raiz e obriga a equipe a pensar como donos, realocando o capital apenas naquilo que efetivamente gera tração ou garante a operação."
      }
    ]
  },
  {
    id: 10,
    title: "A Roleta Russa do Planejamento: Análise de Sensibilidade",
    theory: "Uma planilha aceita qualquer número. A Análise de Sensibilidade (Estresse de Cenários) testa os limites do modelo de negócio contra choques externos. Ao identificar as 'variáveis críticas', o gestor não foge do risco, mas estrutura a operação para que, mesmo no pior cenário, o caixa consiga absorver o impacto sem quebrar a empresa.",
    context: "Agência de Tecnologia 'Byte Seguro'. Você acaba de fechar um mega contrato que vai dobrar o faturamento da empresa. O cenário base projeta 30% de margem líquida. Porém, para atender a demanda, você precisará triplicar os custos de servidores e contratar 10 novos desenvolvedores seniores. O detalhe oculto no contrato: o cliente tem uma cláusula que permite o cancelamento em 60 dias sem pagamento de multa.",
    options: [
      {
        text: "A) Assinar o contrato e executar o plano base (contratar via CLT e comprar servidores). A margem de 30% é alta o suficiente para absorver qualquer risco e não se pode recusar clientes gigantes.",
        xp: -400,
        feedback: "ERRO DE FRAGILIDADE. Você apostou a empresa em um cenário ideal. Se a variável crítica estourar (o cliente cancelar no dia 60), você fica com a folha de 10 devs e servidores ociosos travados em contratos longos, quebrando em 3 meses."
      },
      {
        text: "B) Recusar o contrato imediatamente. O risco de ruína é muito alto para um pequeno negócio assumir uma expansão que depende de um único cliente com cláusula de saída tão fácil.",
        xp: -200,
        feedback: "ERRO DE ESTAGNAÇÃO. O medo paralisou o crescimento. O estrategista de alto nível não foge do risco, ele o precifica e constrói estruturas para mitigá-lo. Recusar grandes jogadas te mantém para sempre no nível tático."
      },
      {
        text: "C) Assinar o contrato aplicando mitigação de risco: alugar a infraestrutura de servidores em nuvem sob demanda (pagar apenas pelo que usar) e contratar os devs temporariamente via squads terceirizados, trocando custo fixo por variável.",
        xp: 700,
        feedback: "JOGADA MASTER. Você estressou o modelo matemático para o 'pior cenário' e transformou a fragilidade em flexibilidade. Se o cliente ficar, você lucra. Se ele sair no dia 60, você desmobiliza a operação imediatamente sem sangrar o caixa da matriz."
      }
    ]
  }
];

// Curva de carreira atualizada (Alto rigor corporativo)
const levels = [
  { title: "Estagiário", minXp: 0 },
  { title: "Assistente Financeiro", minXp: 1000 },
  { title: "Analista Financeiro Jr.", minXp: 2500 },
  { title: "Analista Financeiro Pleno", minXp: 4500 },
  { title: "Analista Sênior / Coordenador", minXp: 7500 },
  { title: "Controller", minXp: 12000 },
  { title: "CFO (Diretor Financeiro)", minXp: 18000 },
  { title: "CEO / Estrategista Master", minXp: 30000 }
];

export default function CodigoAzulGame() {
  const [xp, setXp] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastXpChange, setLastXpChange] = useState<number | null>(null);

  const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];
  const nextLevel = levels.find(l => l.minXp > xp);
  const progressToNext = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  const handleChoice = (xpGained: number, feedbackText: string) => {
    setXp(prev => Math.max(0, prev + xpGained));
    setLastXpChange(xpGained);
    setFeedback(feedbackText);
  };

  const nextStage = () => {
    setFeedback(null);
    setLastXpChange(null);
    if (currentStage < scenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      alert("Módulo 1 de Maestria Concluído com Sucesso! Prepare-se para a Expansão.");
    }
  };

  const scenario = scenarios[currentStage];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-900/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Projeto Código Azul</h1>
              <p className="text-blue-400">Jogador: Pedro Monte</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm text-slate-400">Patente Atual</p>
              <p className="text-xl font-bold text-emerald-400">{currentLevel.title}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{xp} XP</span>
              <span>{nextLevel ? `Meta: ${nextLevel.title} (${nextLevel.minXp} XP)` : 'Nível Máximo!'}</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
        </header>

        {!feedback ? (
          <main className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 space-y-6">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Fase {currentStage + 1}: {scenario.title}</h2>
              <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500 text-sm md:text-base text-slate-300">
                <p><strong className="text-white">A Teoria:</strong> {scenario.theory}</p>
              </div>
            </div>

            <div className="bg-slate-700/30 p-6 rounded-lg">
              <h3 className="font-bold text-white mb-3">Situação Real (O Campo de Batalha):</h3>
              <p className="text-slate-200">{scenario.context}</p>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-400 text-sm uppercase">Sua Decisão Estratégica:</h3>
              {scenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.xp, option.feedback)}
                  className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-blue-600 transition-colors border border-slate-600 hover:border-blue-400"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </main>
        ) : (
          <div className={`p-8 rounded-xl border ${lastXpChange && lastXpChange > 0 ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'} text-center space-y-6`}>
            <h2 className={`text-3xl font-bold ${lastXpChange && lastXpChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {lastXpChange && lastXpChange > 0 ? 'ACERTO CIRÚRGICO' : 'ALERTA DE RISCO'}
            </h2>
            <div className="text-5xl font-black text-white">
              {lastXpChange && lastXpChange > 0 ? '+' : ''}{lastXpChange} XP
            </div>
            <p className="text-lg text-slate-200 bg-slate-900/50 p-6 rounded-lg text-left">
              {feedback}
            </p>
            <button
              onClick={nextStage}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-transform active:scale-95"
            >
              Avançar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}