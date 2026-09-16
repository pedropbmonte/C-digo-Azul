// ARQUIVO: app/questions.ts

export const questionBank = [
  // --- TIER 1: A BASE DA SOBREVIVÊNCIA E CAIXA ---
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
  
  // --- TIER 2: ORGANIZAÇÃO, PROCESSOS E ESTOQUE ---
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

  // --- TIER 3: GESTÃO DO TEMPO, ESCALA E CUSTOS INVISÍVEIS ---
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

  // --- TIER 4: DIRETORES DE PME, TRIBUTOS E SUCESSÃO ---
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
  },

  // --- LOTE 1: EXPANSÃO DE ARSENAL (CÓDIGO AZUL) ---
  {
    id: "t1_vendas_02", tier: 1, sector: "Vendas", title: "O Cliente Sanguessuga",
    theory: "Todo CNPJ tem o 'Cliente 80/20 invertido': aquele que traz 20% do faturamento, mas suga 80% da energia, tempo de suporte e paciência da equipe. Atender quem não respeita seu processo é um Custo de Oportunidade altíssimo, pois impede sua equipe de prospectar clientes bons.",
    context: "Um cliente que compra R$ 1.500 todo mês exige atendimento VIP fora do horário, pede refação de serviço o tempo todo e trata sua equipe mal. Hoje, ele exigiu uma entrega no domingo, ou ameaçou 'cancelar tudo'.",
    character: "O Limite do Atendimento",
    consultoriaHint: "Demitir cliente ruim é o primeiro passo para o lucro. O faturamento dele não paga o custo psicológico da sua equipe. Corte o cordão umbilical, assuma o buraco e preencha com prospecção.",
    options: [
      { id: "A", text: "Demitir o cliente com educação formal. Cancelar o contrato, assumir a perda dos R$ 1.500 e focar a equipe em prospectar dois clientes novos que respeitem o processo.", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 2.0, compliance: 15 }, feedback: "POSTURA DE DONO. A equipe respirou aliviada e a produtividade dobrou.", reward: "🏆 Higiene de Carteira: Sua empresa não é refém de maluco.", lesson: "" },
      { id: "B", text: "Engolir o sapo, fazer a equipe trabalhar no domingo e dar um desconto para acalmar o cliente, afinal 'R$ 1.500 faz falta no caixa'.", xp: -15, isBest: false, impacts: { caixa: 1500, margem: -2.0, compliance: -10 }, feedback: "SÍNDROME DE ESTOCOLMO. Você acabou de ensinar à sua equipe que eles não têm valor.", reward: "", lesson: "O cliente tóxico só piora quando você cede." },
      { id: "C", text: "Xingar o cliente no WhatsApp, mandar ele procurar o concorrente e bloquear o número sem nenhum aviso formal.", xp: -45, isBest: false, impacts: { caixa: -1500, margem: -1.0, compliance: -25 }, feedback: "A RAIVA CUSTA CARO. O cliente expôs os prints na internet e abriu um processo no Procon.", reward: "", lesson: "Não perca a razão, mesmo quando o cliente não tem nenhuma." }
    ]
  },
  {
    id: "t2_compras_02", tier: 2, sector: "Compras", title: "O Falso Desconto à Vista",
    theory: "O caixa é o rei. Descapitalizar a empresa para ganhar '5% de desconto à vista' em compras grandes é um erro clássico de quem não entende o custo do dinheiro no tempo. Se você gira o produto em 60 dias, pagar à vista asfixia a operação.",
    context: "O fornecedor ofereceu um lote de matéria-prima por R$ 20.000 parcelado em 3x sem juros (30/60/90). Porém, se você pagar no PIX hoje, ele dá 5% de desconto (R$ 19.000). O seu caixa atual tem R$ 25.000 livres.",
    character: "O Custo do Dinheiro",
    consultoriaHint: "Guarde sua liquidez. Desconto de 5% não compensa secar o caixa de um pequeno negócio. Fique com o dinheiro, use o prazo do fornecedor para vender a mercadoria e pagar a parcela com o próprio lucro.",
    options: [
      { id: "A", text: "Recusar o desconto e pegar o parcelamento em 3x de R$ 6.666. Manter os R$ 25.000 seguros no caixa da empresa para proteger o giro do mês.", xp: 35, isBest: true, impacts: { caixa: 0, margem: 1.0, compliance: 10 }, feedback: "ENGENHARIA FINANCEIRA. Você usou o dinheiro do fornecedor para financiar sua operação e manteve seu colchão de segurança.", reward: "🏆 Caixa Blindado: Liquidez é vida.", lesson: "" },
      { id: "B", text: "Fazer o PIX de R$ 19.000 na hora para 'economizar mil reais' e aproveitar a oportunidade de ouro.", xp: -20, isBest: false, impacts: { caixa: -19000, margem: -2.0, compliance: -5 }, feedback: "SECAGEM DE POÇO. O caixa caiu para perigosos R$ 6.000. Semana que vem o aluguel bate e a conta não fecha.", reward: "", lesson: "Economizar na compra e quebrar no fluxo não é ser inteligente." },
      { id: "C", text: "Fazer o PIX usando o limite do Cheque Especial da empresa para não mexer no saldo livre.", xp: -45, isBest: false, impacts: { caixa: 0, margem: -4.0, compliance: -15 }, feedback: "BOLA DE NEVE. Ganhou 5% do fornecedor e pagou 8% pro banco.", reward: "", lesson: "Tomar crédito caro para pagar à vista é um crime matemático." }
    ]
  },
  {
    id: "t3_sociedade_01", tier: 3, sector: "Sociedade", title: "O Sócio Encostado",
    theory: "Sociedade 50/50 sem acordo de cotistas e sem definição de escopo vira um casamento falido onde o divórcio quebra a empresa. Se um sócio trabalha 12h por dia e o outro passa na loja 2 vezes por semana, o 'pró-labore igual' é um roubo institucionalizado.",
    context: "Você toca a operação de segunda a sábado. Seu sócio aparece às terças e quintas, tira o mesmo pró-labore de R$ 5.000 que você e ainda reclama que 'as vendas estão fracas'.",
    character: "O Peso Societário",
    consultoriaHint: "Pró-labore remunera trabalho. Lucro remunera cota. Quem trabalha menos, ganha menos no fim do mês. Chame pro embate formal antes que o ressentimento destrua a operação.",
    options: [
      { id: "A", text: "Chamar uma reunião de conselho. Redefinir os pró-labores com base em valor de mercado (horas trabalhadas) e deixar a divisão igualitária APENAS para a distribuição de lucros semestral.", xp: 40, isBest: true, impacts: { caixa: 2500, margem: 2.0, compliance: 20 }, feedback: "MATURIDADE INSTITUCIONAL. O acordo foi tenso, mas cortou a sangria injusta do caixa mensal.", reward: "🏆 Governança Real: O CNPJ está acima dos CPFs.", lesson: "" },
      { id: "B", text: "Não falar nada para 'evitar briga', engolir o cansaço e continuar trabalhando por dois, alimentando a mágoa dia após dia.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: -10 }, feedback: "A BOMBA RELÓGIO. O ressentimento está corroendo a sua vontade de crescer.", reward: "", lesson: "O problema que o dono não enfrenta, a empresa paga." },
      { id: "C", text: "Começar a pegar dinheiro do caixa da loja 'por fora' para compensar o seu esforço a mais, já que 'é justo e você que faz a roda girar'.", xp: -50, isBest: false, impacts: { caixa: -5000, margem: -5.0, compliance: -40 }, feedback: "O GOLPE DE ESTADO FRAUDULENTO. Você destruiu a própria empresa de dentro para fora.", reward: "", lesson: "Desviar caixa para corrigir sociedade é assinar a própria ruína moral." }
    ]
  },
  {
    id: "t4_expansao_01", tier: 4, sector: "Expansão", title: "A Filial da Vaidade",
    theory: "Abrir uma filial quando a matriz ainda depende 100% da sua presença física não é expansão, é dividir seu tempo pela metade e dobrar seu Custo Fixo. Se o processo não está redondo e automatizado, a filial vira um dreno que suga a matriz até a morte.",
    context: "A loja atual dá um bom lucro. O corretor te ofereceu um ponto excelente no bairro vizinho por um aluguel de R$ 8.000. O ego quer ver a placa brilhando na outra rua, mas você ainda é quem aprova os pagamentos e faz as vendas difíceis na matriz.",
    character: "O Deslumbramento",
    consultoriaHint: "Cópia de processo imperfeito gera caos em dobro. Trave a expansão física, crie manuais operacionais e automatize o que você tem hoje. A matriz precisa rodar no piloto automático antes de nascer o filho número dois.",
    options: [
      { id: "A", text: "Recusar o ponto, direcionar o foco para padronizar os processos atuais da matriz e testar a expansão apenas através de vendas online (delivery/e-commerce) para validar a região nova sem Custo Fixo pesado.", xp: 40, isBest: true, impacts: { caixa: 10000, margem: 2.5, compliance: 15 }, feedback: "CRESCIMENTO CALCULADO. Você dominou a vaidade e escalou de forma inteligente, validando demanda com baixo risco.", reward: "🏆 A Expansão Blindada: Mais mercado, zero passivo oculto.", lesson: "" },
      { id: "B", text: "Pegar o novo ponto para 'não perder a oportunidade', dividindo a equipe ao meio e correndo de carro entre as duas lojas três vezes por dia.", xp: -25, isBest: false, impacts: { caixa: -15000, margem: -4.0, compliance: -10 }, feedback: "O CAOS LOGÍSTICO. A filial não decolou e a qualidade da matriz despencou. O caixa está sangrando nos dois lados.", reward: "", lesson: "Dois negócios mal geridos dão muito menos lucro que um bem feito." },
      { id: "C", text: "Assinar o aluguel e financiar R$ 80.000 no banco para fazer a maior e mais luxuosa loja do bairro, contando com um faturamento que ainda não existe.", xp: -50, isBest: false, impacts: { caixa: -80000, margem: -6.0, compliance: -30 }, feedback: "O VOO DO ÍCARO. Alavancagem mortal. O Custo Fixo engoliu a reserva das duas lojas no primeiro trimestre.", reward: "", lesson: "A esperança de venda futura não paga os boletos da vaidade presente." }
    ]
  },

  // --- LOTE 2: ESCALADA OPERACIONAL (CÓDIGO AZUL) ---
  {
    id: "t1_rh_05", tier: 1, sector: "Recursos Humanos", title: "O Cabide de Empregos",
    theory: "CNPJ não é instituição de caridade para parentes. Contratar o 'sobrinho que cobra barato' para cuidar de uma área vital custa o dobro: você perde dinheiro pela incompetência e perde a relação familiar na hora da demissão.",
    context: "Você precisa de um atendente para responder o WhatsApp de vendas. Sua cunhada pede para você dar uma chance pro filho dela, de 19 anos, que 'fica o dia todo no celular e precisa de um rumo'. Ele aceita ganhar menos que o piso.",
    character: "O Vínculo Tóxico",
    consultoriaHint: "Misturar sangue e CNPJ sem processo seletivo rígido é suicídio. Agradeça, diga que a vaga exige experiência em vendas comprovada e contrate um profissional com fome de comissão.",
    options: [
      { id: "A", text: "Recusar educadamente, assumir o custo real de um profissional e contratar alguém testado e focado em metas.", xp: 35, isBest: true, impacts: { caixa: -500, margem: 1.5, compliance: 15 }, feedback: "BLINDAGEM FAMILIAR. Você pagou mais caro no salário, mas protegeu a esteira de vendas e a paz no domingo.", reward: "🏆 RH Profissionalizado: Parentesco não substitui competência.", lesson: "" },
      { id: "B", text: "Contratar o sobrinho para 'testar um mês', já que o custo fixo vai ficar baixo e ajuda a família.", xp: -20, isBest: false, impacts: { caixa: -800, margem: -2.0, compliance: -10 }, feedback: "A ECONOMIA BURRA. Ele atendeu mal, você perdeu vendas e não tem coragem de demitir.", reward: "", lesson: "O funcionário barato custa os clientes que ele afugenta." },
      { id: "C", text: "Contratar por fora, sem carteira assinada, pagando no PIX para não gerar vínculo e 'facilitar as coisas'.", xp: -50, isBest: false, impacts: { caixa: 1000, margem: -4.0, compliance: -40 }, feedback: "ROLETA RUSSA TRABALHISTA. A família brigou e o sobrinho vai te processar com juros.", reward: "", lesson: "Na justiça do trabalho, laço sanguíneo não anula fraude." }
    ]
  },
  {
    id: "t2_mkt_06", tier: 2, sector: "Marketing e Tráfego", title: "O Especialista de Palco",
    theory: "Gestor de tráfego que promete 'dobrar seu faturamento' sem auditar sua esteira de atendimento é fraude. Tráfego não faz milagre, só joga holofote. Se o seu comercial é ruim, o tráfego pago só acelera a queima do seu caixa.",
    context: "Uma agência promete 500 leads/mês cobrando R$ 1.500 de honorários + R$ 1.000 de anúncios. O problema: seu time de vendas hoje demora 4 horas para responder um cliente no WhatsApp e não segue nenhum roteiro de vendas.",
    character: "O Balde Furado",
    consultoriaHint: "Não jogue água num balde furado. Arrume a casa primeiro. Treine o atendimento, defina um SLA (tempo de resposta de 5 min) e só depois coloque dinheiro na máquina do Mark Zuckerberg.",
    options: [
      { id: "A", text: "Pausar a contratação da agência. Focar os próximos 15 dias em criar um script de vendas e treinar a equipe para responder em menos de 10 minutos.", xp: 35, isBest: true, impacts: { caixa: 2500, margem: 2.0, compliance: 10 }, feedback: "FOCO NO PROCESSO. Você tapou os furos do balde antes de abrir a torneira.", reward: "🏆 Esteira de Vendas: A base está pronta para escalar.", lesson: "" },
      { id: "B", text: "Fechar com a agência acreditando que o grande volume de pessoas chamando vai 'forçar' a equipe a vender mais.", xp: -20, isBest: false, impacts: { caixa: -2500, margem: -2.5, compliance: 0 }, feedback: "QUEIMA DE LEADS. Choveram curiosos, a equipe surtou, a demora aumentou e ninguém comprou.", reward: "", lesson: "Volume expõe a incompetência da operação." },
      { id: "C", text: "Pegar o limite do cartão da empresa para investir o dobro em Ads (R$ 5.000) porque 'só ganha quem aposta alto'.", xp: -50, isBest: false, impacts: { caixa: -5000, margem: -5.0, compliance: -10 }, feedback: "O DELÍRIO DO TRÁFEGO. Gastou o que não tinha para atrair clientes que não foram atendidos.", reward: "", lesson: "Tráfego pago potencializa o que você já é. Se você é ruim, passará vergonha em escala." }
    ]
  },
  {
    id: "t1_caixa_05", tier: 1, sector: "Fluxo de Caixa", title: "O Canto da Sereia Bancária",
    theory: "Bancos amam PMEs desorganizadas. O gerente que liga oferecendo um 'limite pré-aprovado imperdível' não é seu parceiro, ele bate meta vendendo dinheiro caro para cobrir os buracos da sua falta de gestão.",
    context: "Dia 20 do mês. O caixa está apertado para pagar os fornecedores da próxima semana. O gerente do banco liga oferecendo um Capital de Giro fácil de R$ 20.000, 'pré-aprovado na tela', com taxa de 3,5% ao mês.",
    character: "O Dinheiro Fácil",
    consultoriaHint: "Crédito sem destinação de expansão (ex: comprar uma máquina que se paga) vira despesa corrente. Você usará os 20k para boletos, e no mês que vem terá os mesmos boletos MAIS a parcela do banco.",
    options: [
      { id: "A", text: "Agradecer o gerente, desligar e fazer uma ação agressiva de vendas na sua própria base de clientes inativos para levantar os R$ 5.000 que faltam.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.5, compliance: 10 }, feedback: "BLINDAGEM. Você resolveu o problema de caixa usando vendas, a única fonte de dinheiro limpo.", reward: "🏆 Independência Bancária: Você manda no seu fluxo.", lesson: "" },
      { id: "B", text: "Pegar apenas R$ 10.000 para 'ficar garantido' e deixar o dinheiro parado na conta para dar paz de espírito.", xp: -20, isBest: false, impacts: { caixa: -1000, margem: -2.0, compliance: -5 }, feedback: "CUSTO DO MEDO. Dinheiro parado na conta pagando 3,5% ao mês. Você está financiando sua ansiedade.", reward: "", lesson: "Dinheiro de banco só serve se gerar mais dinheiro que os juros dele." },
      { id: "C", text: "Pegar os R$ 20.000 totais e usar uma parte para reformar a fachada da loja, que estava precisando.", xp: -45, isBest: false, impacts: { caixa: -5000, margem: -5.0, compliance: -15 }, feedback: "ERRO DE ALOCAÇÃO. Tomou dívida de curto prazo para imobilizar no gesso da fachada. O caixa afogou.", reward: "", lesson: "Nunca se financia melhorias estéticas com crédito de curtíssimo prazo." }
    ]
  },
  {
    id: "t2_operacao_03", tier: 2, sector: "Processos", title: "O Padrão Oculto",
    theory: "Se a receita de como sua empresa roda está apenas na sua cabeça, você não tem um negócio, tem uma prisão. Processo bom é processo escrito e treinável, a ponto de um estagiário assumir o básico em 7 dias.",
    context: "Você pegou uma virose forte e precisou de 3 dias de repouso absoluto. A equipe travou. Ninguém sabia aprovar o desconto especial, acessar o emissor de notas ou onde estava a chave do estoque reserva. O faturamento zerou nos 3 dias.",
    character: "A Centralização Absoluta",
    consultoriaHint: "Não culpe a equipe pela sua vaidade centralizadora. Volte, tire 2 horas por dia para documentar o básico num Playbook (Manual) e distribua limites de alçadas de decisão.",
    options: [
      { id: "A", text: "Assumir o erro. Desenhar um 'Manual de Sobrevivência' com senhas restritas, limites pré-aprovados de desconto e processos em vídeo para a equipe rodar sem você.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 1.0, compliance: 20 }, feedback: "DESCENTRALIZAÇÃO. A empresa deu o primeiro passo para não depender do seu CPF.", reward: "🏆 Operação Autônoma: O líder ensina, a equipe executa.", lesson: "" },
      { id: "B", text: "Voltar irritado e dar uma bronca geral na equipe alegando que faltou 'iniciativa e sangue no olho' enquanto você estava doente.", xp: -15, isBest: false, impacts: { caixa: -1000, margem: -1.0, compliance: -5 }, feedback: "A CULPA É DO ESPELHO. Você puniu a equipe por um segredo que você guardava.", reward: "", lesson: "Nenhum funcionário tem a obrigação de ler a mente do dono." },
      { id: "C", text: "Aceitar que 'ninguém faz como você', cancelar as férias programadas do fim do ano e prometer não adoecer mais.", xp: -40, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: -10 }, feedback: "A PRISÃO VOLUNTÁRIA. Você acabou de decretar que o teto da empresa é a sua estafa mental.", reward: "", lesson: "Se a empresa para sem você, ela não tem valor de mercado nenhum." }
    ]
  },
  {
    id: "t3_preco_05", tier: 3, sector: "Precificação e Custos", title: "O Contrato Kamikaze",
    theory: "No mundo B2B (empresas vendendo para empresas), o volume seduz o ego. Mas fechar um contrato gigantesco com margem quase zero, sob a justificativa de que 'ajuda a pagar os custos fixos', é a rota expressa para a descapitalização brutal.",
    context: "Uma construtora quer fechar um pedido mensal que vai dobrar o volume de produção da sua pequena indústria/distribuidora. Porém, a exigência de desconto deles espremeu sua Margem de Contribuição para meros 2%.",
    character: "O Canto da Vaidade B2B",
    consultoriaHint: "Volume sem margem é trabalho escravo com CNPJ. Qualquer soluço logístico, atraso de pagamento ou aumento na matéria-prima vai jogar a operação inteira no negativo. Rejeite com classe.",
    options: [
      { id: "A", text: "Recusar a proposta ou fazer uma contraproposta travando a margem mínima de segurança de 15%, mesmo sabendo que eles vão recusar.", xp: 40, isBest: true, impacts: { caixa: 1500, margem: 2.0, compliance: 15 }, feedback: "LUCIDEZ FINANCEIRA. Você protegeu o caixa e a capacidade de atendimento dos clientes bons.", reward: "🏆 Defesa de Margem: O ego não dita as regras.", lesson: "" },
      { id: "B", text: "Aceitar o contrato para 'fazer nome no mercado' e colocar a logomarca da construtora no seu site, apostando no longo prazo.", xp: -30, isBest: false, impacts: { caixa: -6000, margem: -5.0, compliance: -10 }, feedback: "ILUSÃO DO PORTFÓLIO. O volume entrou, os custos operacionais explodiram e o lucro sumiu.", reward: "", lesson: "Ter logomarca de cliente famoso no site não paga a folha na sexta-feira." },
      { id: "C", text: "Aceitar e, como o volume é gigante, pegar um empréstimo para comprar mais máquinas para dar conta do pedido no prazo.", xp: -50, isBest: false, impacts: { caixa: -15000, margem: -8.0, compliance: -20 }, feedback: "A TEMPESTADE PERFEITA. Margem de 2% não paga nem os juros da máquina que você financiou.", reward: "", lesson: "Você apostou a empresa inteira em um cliente que não te dá lucro." }
    ]
  },
  // --- COLE O LOTE 3 AQUI ABAIXO DESTA LINHA ---
// --- LOTE 3: AS ARMADILHAS OCULTAS (CÓDIGO AZUL) ---
    {
    id: "t1_caixa_06", tier: 1, sector: "Caixa e Adiantamentos", title: "A Ilusão do Pix Antecipado",
    theory: "Dinheiro na conta antes do serviço entregue não é receita, é PASSIVO. O cliente te deu um adiantamento, mas você ainda 'deve' a execução a ele. Torrar esse dinheiro no mês 1 significa trabalhar de graça nos meses 2 e 3.",
    context: "Você fechou um ótimo contrato de R$ 12.000 para uma entrega dividida em 3 meses. O cliente pagou 100% antecipado via PIX. Você vê o saldo gordo e sente a tentação de trocar os computadores da equipe.",
    character: "O Passivo Disfarçado",
    consultoriaHint: "Trave o ego. Provisione. O dinheiro só é seu depois que o custo da execução é pago. Divida esse saldo mentalmente por 3 e libere apenas a fatia do mês para a operação.",
    options: [
      { id: "A", text: "Travar R$ 8.000 numa conta rendimento e liberar apenas R$ 4.000 para o fluxo de caixa deste mês, garantindo o custo operacional dos próximos 60 dias.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.5, compliance: 15 }, feedback: "MATURIDADE DE CAIXA. Você blindou o fluxo futuro. A entrega está garantida sem sufoco.", reward: "🏆 Receita Diferida: Dinheiro do futuro não paga conta do passado.", lesson: "" },
      { id: "B", text: "Gastar os R$ 12.000 em melhorias para o escritório agora, afinal o dinheiro já entrou e vai motivar a equipe a entregar o projeto.", xp: -20, isBest: false, impacts: { caixa: -12000, margem: -2.0, compliance: -10 }, feedback: "A MIRAGEM. Nos meses 2 e 3 você terá custos com o projeto, mas não terá receita nova. O caixa vai negativar.", reward: "", lesson: "Gastar adiantamento é escravizar o seu 'eu' do futuro." },
      { id: "C", text: "Pegar os R$ 12.000 e distribuir como lucro/prêmio imediato entre os sócios para comemorar a grande venda.", xp: -45, isBest: false, impacts: { caixa: -12000, margem: -5.0, compliance: -25 }, feedback: "SAQUE CRIMINOSO. A empresa assumiu o risco do serviço, mas os sócios levaram o dinheiro. A ruína é iminente.", reward: "", lesson: "Lucro só existe após o Custo da Mercadoria/Serviço Vendido ser pago." }
    ]
  },
  {
    id: "t2_vendas_03", tier: 2, sector: "Vendas e Promoções", title: "A Roleta da Black Friday",
    theory: "PME não brinca de Black Friday dando 50% de desconto linear igual gigante do varejo. O gigante ganha no volume absurdo e tem poder de barganha com a fábrica. O pequeno empresário que corta a própria margem pela metade só acelera a falência trabalhando em dobro.",
    context: "Novembro chegou. Seu concorrente maior anunciou 'Tudo com 40% OFF'. Sua margem líquida normal é de 20%. A equipe de vendas está em pânico exigindo que você cubra a oferta.",
    character: "A Guerra de Preços",
    consultoriaHint: "Fuja da briga de foice. PME ganha Black Friday agregando valor, não destruindo preço. Crie combos, ofereça bônus de serviço ou queime APENAS o estoque parado (Curva C).",
    options: [
      { id: "A", text: "Manter o preço dos produtos 'Curva A' (os que mais vendem), criar um combo agregando produtos parados e focar no atendimento consultivo.", xp: 40, isBest: true, impacts: { caixa: 3500, margem: 2.0, compliance: 10 }, feedback: "POSICIONAMENTO DE VALOR. Você não entrou no leilão de centavos e limpou o estoque morto com lucro.", reward: "🏆 Lucro Oculto: Agregar valor é mais barato que dar desconto.", lesson: "" },
      { id: "B", text: "Ceder à pressão da equipe e dar 30% de desconto na loja toda para 'não ficar para trás e perder os clientes'.", xp: -25, isBest: false, impacts: { caixa: -1000, margem: -4.0, compliance: -5 }, feedback: "O EFEITO BOOMERANGUE. Vendeu o dobro, mas a margem ficou negativa. Você pagou para os clientes levarem seus produtos.", reward: "", lesson: "Vender com prejuízo cansa a equipe e destrói a DRE." },
      { id: "C", text: "Dar os mesmos 40% do concorrente, mas reduzir a qualidade da entrega/embalagem para tentar compensar o buraco financeiro.", xp: -50, isBest: false, impacts: { caixa: -4000, margem: -6.0, compliance: -20 }, feedback: "QUEIMA DE MARCA. Você atraiu o cliente pelo preço e o decepcionou pela qualidade. Ele nunca mais volta.", reward: "", lesson: "O cliente esquece o desconto rápido, mas lembra da entrega ruim para sempre." }
    ]
  },
  {
    id: "t3_rh_06", tier: 3, sector: "Gestão de Pessoas", title: "O Vendedor Promovido",
    theory: "O maior erro de RH em vendas é pegar o melhor vendedor da empresa e promovê-lo a Gerente Comercial só para 'dar um plano de carreira'. Vender exige lobo solitário; gerenciar exige empatia e processo. Você perde seu melhor atacante e ganha um técnico ruim.",
    context: "O João é uma máquina, traz 40% das vendas da empresa. Você o promoveu a Gerente Comercial para liderar os outros 3 vendedores. Em dois meses, as vendas caíram 30% e a equipe ameaça pedir as contas porque o João é grosseiro e centralizador.",
    character: "O Prêmio Invertido",
    consultoriaHint: "Bata de frente e desfaça o erro rápido. Remunere os tops de vendas com comissões maiores, bônus e títulos (Ex: Key Account), mas não os coloque para gerir pessoas se eles não têm o perfil de liderança.",
    options: [
      { id: "A", text: "Chamar o João, admitir o erro de gestão. Voltar ele para vendas como 'Executivo Sênior', criar um bônus por produtividade só dele, e contratar um gestor de verdade.", xp: 40, isBest: true, impacts: { caixa: 3000, margem: 1.5, compliance: 15 }, feedback: "A CORREÇÃO CIRÚRGICA. O ego do João doeu, mas o bolso dele (e o seu) vão agradecer. A equipe respirou.", reward: "🏆 Liderança Real: Cargo não é prêmio de consolação.", lesson: "" },
      { id: "B", text: "Deixar como está. Pagar um curso de 'Liderança' online para o João e torcer para ele aprender a lidar com pessoas nos próximos 6 meses.", xp: -20, isBest: false, impacts: { caixa: -3500, margem: -2.0, compliance: -10 }, feedback: "OMISSÃO TÁTICA. Em 6 meses a equipe vai toda embora e o João vai desanimar pelas metas não batidas.", reward: "", lesson: "Esperança não conserta erro de alocação de talentos." },
      { id: "C", text: "Demitir os vendedores que estão reclamando, afinal o João é a estrela e quem não se adaptar ao estilo 'agressivo' dele tem que sair.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -4.0, compliance: -25 }, feedback: "O TIRO DE CANHÃO. Você endossou a toxicidade. O João parou de vender (porque é gerente) e você expulsou quem vendia.", reward: "", lesson: "Proteger um líder tóxico é declarar guerra ao próprio caixa." }
    ]
  },
  {
    id: "t4_tributos_02", tier: 4, sector: "Riscos e Tributos", title: "O Fornecedor Fantasma",
    theory: "Comprar 'Sem Nota' (meia nota) é roleta russa com o Leão. Pode dar margem hoje, mas cria um passivo criminal impagável. A inteligência do Fisco é digital. Se você passa cartão/PIX sem emitir nota, o sistema cruza os dados e a autuação vem em bloco (retroativa a 5 anos).",
    context: "Um novo fornecedor oferece um lote de mercadorias que você vende muito por R$ 30.000. Se for 'Sem Nota', sai por R$ 22.000. Você está precisando de margem urgentemente para cobrir o buraco de uma má gestão anterior.",
    character: "O Canto da Sonegação",
    consultoriaHint: "O barato sai com multa de 150%. Jogue o jogo dos adultos. Compre com Nota Fiscal, aproveite o crédito do imposto (se for o caso) e melhore sua gestão interna para não depender de crime para ter lucro.",
    options: [
      { id: "A", text: "Recusar a proposta criminosa. Comprar com Nota Fiscal pelos R$ 30.000 e ajustar a operação para que a empresa dê lucro dentro da legalidade absoluta.", xp: 40, isBest: true, impacts: { caixa: -1000, margem: 1.0, compliance: 30 }, feedback: "SONO TRANQUILO. A margem apertou, mas o CNPJ está blindado. Você escolheu a dificuldade do estrategista.", reward: "🏆 Compliance Ativado: Sua empresa vale mais quando não tem esqueletos no armário.", lesson: "" },
      { id: "B", text: "Comprar metade com Nota e metade 'Sem Nota' para diluir o risco e tentar melhorar a margem de fininho.", xp: -25, isBest: false, impacts: { caixa: 4000, margem: -1.0, compliance: -30 }, feedback: "O MEIO CRIME. Você assumiu o risco da autuação e bagunçou totalmente seu controle de estoque.", reward: "", lesson: "Não existe meia sonegação para a Receita Federal." },
      { id: "C", text: "Comprar 100% 'Sem Nota' e vender no Pix sem emitir nota para o cliente final, gerando um lucro 'limpo e invisível'.", xp: -50, isBest: false, impacts: { caixa: 8000, margem: -5.0, compliance: -60 }, feedback: "O ASSASSINATO DO CNPJ. A fiscalização cruzou a movimentação bancária. A multa veio no CPF dos sócios.", reward: "", lesson: "O 'jeitinho' é a forma mais rápida de perder a empresa e o patrimônio pessoal." }
    ]
  },
  {
    id: "t2_operacao_04", tier: 2, sector: "Processos e Clientes", title: "A Dependência do 'Vip'",
    theory: "Ter 60% do seu faturamento concentrado em um único cliente (O 'Gorila') não é sinal de força comercial, é sinal de risco máximo. Se ele atrasa, você atrasa a folha. Se ele cancela, você quebra.",
    context: "Sua empresa fatura 50k. Destes, a Empresa Ômega compra sozinha R$ 30.000/mês. Hoje eles ligaram pedindo uma redução de 15% na tabela de preços deles 'ou vão fechar com a concorrência na segunda-feira'.",
    character: "A Concentração Kamikaze",
    consultoriaHint: "O risco de concentração explodiu na sua cara. Você não pode perder R$ 30k hoje, mas não pode ceder a margem e virar escravo amanhã. Negocie prazo e invista agressivamente para diluir essa carteira nos próximos 90 dias.",
    options: [
      { id: "A", text: "Conceder temporariamente 8% mediante assinatura de contrato de fidelidade de 6 meses. No mesmo dia, dobrar os esforços em prospecção para atrair 10 clientes de 3k.", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 1.0, compliance: 15 }, feedback: "MANOBRA DE SOBREVIVÊNCIA. Você conteve a perda imediata, ganhou tempo e começou a diluição da carteira.", reward: "🏆 Pulverização Ativada: O comercial acordou para o risco do cliente gorila.", lesson: "" },
      { id: "B", text: "Aceitar a redução de 15% sem exigir nada em troca pelo medo de quebrar na próxima semana.", xp: -20, isBest: false, impacts: { caixa: -4500, margem: -3.5, compliance: -5 }, feedback: "A RENDIÇÃO. Eles descobriram que mandam na sua empresa. Mês que vem o pedido será de mais desconto.", reward: "", lesson: "Quem tem apenas um grande cliente, não é empresário, é funcionário terceirizado." },
      { id: "C", text: "Recusar a proposta agressivamente. 'Não dou desconto para ninguém'. Perder o cliente e tentar repor os 30k com urgência no mês seguinte.", xp: -45, isBest: false, impacts: { caixa: -30000, margem: -6.0, compliance: -10 }, feedback: "O CHOQUE DE REALIDADE. O ego falou, o caixa sangrou. A folha de pagamento estourou no dia 05.", reward: "", lesson: "Ter princípios comerciais é excelente, mas não ter caixa de transição é fatal." }
    ]
  },  
  // --- C// --- LOTE 4: OS CUSTOS INVISÍVEIS E O COMPORTAMENTO (CÓDIGO AZUL) ---
  
  {
    id: "t2_preco_06", tier: 2, sector: "Precificação e Posicionamento", title: "O Leilão do Desespero",
    theory: "Preço é posicionamento. Quando você entra em um leilão de centavos com o cliente, desvaloriza seu serviço e educa o mercado de que sua margem original era um roubo. Desconto dado sem contrapartida é dinheiro tirado direto do seu lucro líquido.",
    context: "Um cliente grande coloca a sua proposta na mesa junto com a de um concorrente de baixíssima qualidade e diz: 'Ele faz por 30% a menos. Se você cobrir, fechamos agora.'",
    character: "O Cliente Leiloeiro",
    consultoriaHint: "Quem vem por preço, por preço vai embora. Se você cobre orçamento de empresa ruim, você nivela o seu serviço por baixo e paga para trabalhar. Peça uma contrapartida (ex: volume, pagamento à vista) ou levante da mesa.",
    options: [
      { id: "A", text: "Recusar o desconto linear. Oferecer manter o preço, mas agregar um serviço de baixo custo para você e alto valor para ele, ou retirar itens da proposta para justificar a queda de preço.", xp: 35, isBest: true, impacts: { caixa: 0, margem: 1.5, compliance: 15 }, feedback: "NEGOCIAÇÃO ASSIMÉTRICA. Você defendeu sua margem e mostrou que seu serviço tem valor inegociável.", reward: "🏆 Posicionamento Blindado: Você não é a opção mais barata, é a melhor.", lesson: "" },
      { id: "B", text: "Dar os 30% de desconto para 'não perder o cliente' e tentar tirar a diferença cobrando mais caro nos próximos negócios que ele fechar com você.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -3.5, compliance: -5 }, feedback: "A CORRIDA PARA O FUNDO DO POÇO. O cliente percebeu seu desespero e nunca mais vai aceitar pagar seu preço cheio.", reward: "", lesson: "Desconto sem justificativa técnica é confissão de margem abusiva." },
      { id: "C", text: "Dar 35% de desconto só para 'quebrar o concorrente' e roubar o cliente, assumindo o prejuízo como investimento em marketing.", xp: -45, isBest: false, impacts: { caixa: -5000, margem: -5.0, compliance: -10 }, feedback: "SUICÍDIO COMERCIAL. Você pagou para tirar um cliente ruim do seu concorrente. O concorrente agradece.", reward: "", lesson: "Roubar prejuízo dos outros não enriquece sua empresa." }
    ]
  },
  {
    id: "t3_cultura_01", tier: 3, sector: "Cultura Organizacional", title: "A Estrela Tóxica",
    theory: "Cultura não é o que está escrito na parede, é o comportamento que você tolera. Manter um funcionário que bate metas, mas destrói o clima e desrespeita as regras, ensina aos outros que o caráter é secundário ao resultado financeiro.",
    context: "Sua melhor vendedora bateu a meta do trimestre sozinha, mas humilhou o estoquista na frente de todos e se recusa a preencher o CRM, dizendo na frente da equipe que 'quem vende não precisa de burocracia'.",
    character: "A Insubordinação Lucrativa",
    consultoriaHint: "A estrela tóxica destrói a produtividade de todo o resto da base. Ninguém é insubstituível num sistema de vendas bem construído. Dê o choque de realidade em particular; se ela não alinhar, corte na carne.",
    options: [
      { id: "A", text: "Chamá-la para uma reunião fechada. Aplicar advertência formal pela insubordinação e deixar claro que metas não compram o direito de destruir o clima. Preparar um substituto.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 1.0, compliance: 25 }, feedback: "LIDERANÇA INABALÁVEL. A equipe viu que as regras valem para todos. A moral do time subiu e a vendedora entendeu seu lugar.", reward: "🏆 A Lei de Ferro: O CNPJ é maior que a vaidade de qualquer CPF.", lesson: "" },
      { id: "B", text: "Fingir que não viu a humilhação para não correr o risco de ela pedir as contas e você perder o faturamento que ela traz.", xp: -25, isBest: false, impacts: { caixa: -1000, margem: -2.0, compliance: -20 }, feedback: "A FALÊNCIA DO LÍDER. Você perdeu o respeito do resto da equipe. O estoquista pediu demissão e o CRM foi abandonado por todos.", reward: "", lesson: "O resultado financeiro não cobre o custo de um ambiente apodrecido." },
      { id: "C", text: "Dar razão a ela na frente de todos, demitir o estoquista por ter 'atrapalhado a vendedora estrela' e liberar ela de usar o CRM.", xp: -50, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: -40 }, feedback: "O CAOS INSTALADO. Você virou refém. Ela agora é a verdadeira dona da sua empresa e vai ditar as regras até te falir.", reward: "", lesson: "O líder que escolhe a estrela tóxica, destrói a constelação inteira." }
    ]
  },
  {
    id: "t3_fin_05", tier: 3, sector: "Decisões Financeiras", title: "A Falácia do Custo Afundado",
    theory: "O Custo Afundado é o dinheiro que já foi gasto e não pode ser recuperado. Donos de PME quebram empresas inteiras tentando 'fazer dar certo' um projeto falido apenas porque já investiram muito nele. Aceitar o erro rápido preserva o caixa futuro.",
    context: "Você gastou R$ 15.000 desenvolvendo um novo serviço que o mercado rejeitou completamente. Para consertar os erros e tentar lançar de novo, vai custar mais R$ 10.000. O caixa está no limite de segurança.",
    character: "O Apego ao Prejuízo",
    consultoriaHint: "O mercado não tem pena do seu esforço. Se a validação provou que não há demanda, não jogue dinheiro bom em cima de dinheiro ruim. Engula o choro, mate o projeto e volte para o arroz com feijão que paga as contas.",
    options: [
      { id: "A", text: "Matar o projeto hoje. Assumir a perda dos R$ 15.000 como custo de aprendizado, focar na operação que já dá lucro e preservar os R$ 10.000 no caixa.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 1.5, compliance: 15 }, feedback: "RACIONALIDADE FRIA. Você cortou a perna para salvar o paciente. A empresa manteve liquidez para operar o núcleo.", reward: "🏆 Desapego Estratégico: O erro custou caro, mas a teimosia teria custado a empresa.", lesson: "" },
      { id: "B", text: "Gastar os últimos R$ 10.000 do caixa de segurança para tentar relançar o serviço, alegando que 'não pode jogar R$ 15 mil no lixo'.", xp: -30, isBest: false, impacts: { caixa: -10000, margem: -3.0, compliance: -10 }, feedback: "O JOGADOR VICIADO. O serviço falhou de novo. Agora você tem um produto inútil e não tem caixa para pagar a folha.", reward: "", lesson: "Tentar recuperar dinheiro perdido te faz perder o que sobrou." },
      { id: "C", text: "Pegar um empréstimo bancário de R$ 30.000 para forçar o marketing desse produto rejeitado 'guela abaixo' do cliente.", xp: -50, isBest: false, impacts: { caixa: -30000, margem: -6.0, compliance: -20 }, feedback: "A ALAVANCAGEM MORTAL. O cliente não quer o produto. Você agora tem dívida bancária, juros e um estoque de frustração.", reward: "", lesson: "O marketing não salva um produto que não resolve um problema." }
    ]
  },
  {
    id: "t2_parceria_01", tier: 2, sector: "Parcerias Comerciais", title: "A Permuta Venenosa",
    theory: "Permuta só faz sentido se o serviço recebido substitui uma despesa vital que sairia do seu fluxo de caixa. Trocar o seu produto (que tem custo de mercadoria vendida, ICMS, embalagem) por algo que a empresa não precisa é o mesmo que jogar dinheiro no esgoto.",
    context: "Um 'influenciador' com 100 mil seguidores pede R$ 3.000 em serviços/produtos da sua empresa em troca de 3 stories no Instagram. O público dele é adolescente, e você vende consultoria e software para empresas (B2B).",
    character: "O Ego Digital",
    consultoriaHint: "Audiência que não tem dinheiro para comprar o seu produto não é lead, é enfeite. Diga não para métricas de vaidade. Troque permuta apenas por serviços essenciais: contador, sistema de gestão ou marketing focado.",
    options: [
      { id: "A", text: "Recusar a permuta educadamente, explicando que a verba de marketing do semestre está direcionada para canais B2B (empresariais).", xp: 35, isBest: true, impacts: { caixa: 0, margem: 1.0, compliance: 10 }, feedback: "MIRA LASER. Você preservou R$ 3.000 de CMV (Custo de Mercadoria Vendida) que seriam torrados para aparecer para quem não compra.", reward: "🏆 Filtro de Vaidade: Likes não pagam boletos.", lesson: "" },
      { id: "B", text: "Aceitar a permuta porque a equipe achou 'uma vitrine super legal para a marca ficar famosa na cidade'.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -2.0, compliance: -5 }, feedback: "O INVESTIMENTO CEGO. Foram milhares de curtidas no post, mas NENHUMA venda realizada. O público não tinha poder aquisitivo.", reward: "", lesson: "Visibilidade burra é o marketing mais caro que existe." },
      { id: "C", text: "Além de dar os produtos, pagar um cachê de R$ 2.000 'por fora' para garantir que ele fale bem da empresa no feed.", xp: -45, isBest: false, impacts: { caixa: -5000, margem: -4.0, compliance: -20 }, feedback: "A SANGRAMENTO DUPLO. Descapitalizou, fraudou o caixa (sem nota) e não obteve retorno em vendas.", reward: "", lesson: "Ajoelhar no milho por audiência desalinhada é desespero." }
    ]
  },
  {
    id: "t4_escala_02", tier: 4, sector: "Operações e Escala", title: "O Gargalo do Marketing Viral",
    theory: "Vender mais do que se pode entregar não é sucesso corporativo, é fraude culposa. O gargalo da sua empresa dita o ritmo do seu fluxo de caixa. Tracionar o marketing sem antes alinhar e blindar a capacidade operacional gera cancelamentos, processos e queima de marca.",
    context: "Uma campanha de marketing sua estourou! Entraram 150 pedidos pagos à vista num fim de semana. Mas o seu 'Raio-X' operacional mostra que a equipe consegue produzir e entregar no máximo 50 por semana. Clientes começaram a ligar irritados.",
    character: "O Colapso do Crescimento",
    consultoriaHint: "Desligue a torneira antes de consertar o ralo. Pause os anúncios agora. Alugue capacidade excedente, faça turnos extras, peça desculpas com transparência absoluta e não prometa o que não tem na mão.",
    options: [
      { id: "A", text: "Pausar o marketing imediatamente. Enviar um comunicado transparente de 'Sucesso Absoluto de Vendas', pedir extensão de prazo aos 100 excedentes e contratar freelancers urgentes para turno extra.", xp: 40, isBest: true, impacts: { caixa: -1500, margem: -1.0, compliance: 20 }, feedback: "GESTÃO DE CRISE. Você gastou caixa com freelancers, mas salvou os contratos, estancou a raiva dos clientes e protegeu a marca.", reward: "🏆 Tração Controlada: A operação dita a velocidade do marketing.", lesson: "" },
      { id: "B", text: "Deixar a campanha rodando 'aproveitando o hype', colocar o dinheiro no bolso e instruir a equipe a dar respostas vagas dizendo que 'já está nos correios'.", xp: -35, isBest: false, impacts: { caixa: 5000, margem: -3.0, compliance: -30 }, feedback: "O ESTELIONATO CULPOSO. Mentir para o cliente gera Chargeback (estorno). O dinheiro entrou na sexta e o banco bloqueou na terça.", reward: "", lesson: "Nunca subestime a capacidade de um cliente furioso destruir sua reputação online." },
      { id: "C", text: "Se desesperar e cancelar / devolver o dinheiro dos 100 pedidos excedentes no mesmo dia, sem tentar expandir a produção ou renegociar prazos.", xp: -25, isBest: false, impacts: { caixa: -10000, margem: -2.0, compliance: -5 }, feedback: "O MEDO DA ESCALA. Você evitou o caos, mas demonstrou que sua empresa não está pronta para o próximo nível.", reward: "", lesson: "Devolver dinheiro por incompetência operacional é financiar o concorrente." }
    ]
  },

  // // --- LOTE 5: GOVERNANÇA, FRAUDES E M&A (CÓDIGO AZUL) ---
  
  {
    id: "t3_fraude_01", tier: 3, sector: "Controladoria e Fraude", title: "O Funcionario 'De Confiança'",
    theory: "Onde não há Segregação de Funções (SoD), a fraude não é uma possibilidade, é uma questão de tempo. Se a mesma pessoa que aprova o fornecedor é a que emite o pagamento no banco e concilia o extrato, você criou a tempestade perfeita para o desvio de caixa.",
    context: "Sua gerente financeira está com você há 8 anos. É 'da família'. Numa auditoria rápida, você percebe três transferências atípicas (R$ 8.500 no total) para um CNPJ desconhecido. Ela diz que foi 'um erro do sistema bancário' e que vai estornar amanhã.",
    character: "O Rombo Silencioso",
    consultoriaHint: "Confiança não é controle. Quem frauda uma vez, frauda mil. Isole os acessos bancários imediatamente, não faça escândalo sem provas robustas e inicie uma auditoria forense nos últimos 24 meses.",
    options: [
      { id: "A", text: "Retirar os tokens e senhas bancárias dela no mesmo dia sob o pretexto de 'atualização de rotina', afastar com licença remunerada e contratar uma auditoria externa imediata.", xp: 40, isBest: true, impacts: { caixa: -2000, margem: 1.0, compliance: 30 }, feedback: "SANGUE FRIO EXECUTIVO. Você agiu com governança. Blindou o caixa, evitou passivo por assédio moral e vai descobrir o tamanho real do rombo.", reward: "🏆 Compliance Implacável: Na sua empresa, processo vale mais que amizade.", lesson: "" },
      { id: "B", text: "Acreditar na desculpa do 'erro de sistema' porque ela é de extrema confiança e esperar ela resolver o estorno na próxima semana.", xp: -30, isBest: false, impacts: { caixa: -8500, margem: -2.0, compliance: -30 }, feedback: "A CEGUEIRA DELIBERADA. Ela não vai estornar. Ela usou a semana para apagar rastros e limpar o caixa antes de sumir.", reward: "", lesson: "O maior roubo sempre vem da pessoa que você menos desconfia." },
      { id: "C", text: "Gritar com ela no meio do escritório, acusá-la de roubo na frente da equipe e demiti-la por justa causa na mesma hora sem juntar documentos.", xp: -50, isBest: false, impacts: { caixa: -15000, margem: -3.0, compliance: -50 }, feedback: "O JUSTICEIRO PROCESSADO. Faltou prova, sobrou testemunha. Ela reverteu a justa causa e ganhou uma bolada por danos morais.", reward: "", lesson: "A raiva custa os honorários do advogado dela." }
    ]
  },
  {
    id: "t3_sucessao_02", tier: 3, sector: "Sucessão Familiar", title: "O Herdeiro Incompetente",
    theory: "A transição da 1ª para a 2ª geração quebra 70% das empresas familiares. O motivo? Confundir herança de patrimônio com herança de cargo. O filho tem direito aos lucros das cotas, mas a cadeira de Diretor precisa ser conquistada com competência técnica.",
    context: "Seu filho recém-formado exige ser o novo Diretor Comercial da empresa, substituindo o executivo atual que entrega resultados constantes, mas com quem ele 'não se dá bem'. A equipe já demonstra desconforto com a arrogância do garoto.",
    character: "O Colapso Familiar",
    consultoriaHint: "O CNPJ é o hospedeiro que alimenta toda a família. Se você colocar um parasita no coração da empresa, todos morrem de fome. Herdeiro precisa começar de baixo ou atuar apenas no Conselho.",
    options: [
      { id: "A", text: "Negar a diretoria. Oferecer a ele uma vaga de analista júnior ou pagar para ele ser trainee em OUTRA empresa do setor para ganhar maturidade antes de voltar.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 2.0, compliance: 20 }, feedback: "O GUARDIÃO DA EMPRESA. Houve choro no domingo em família, mas a empresa amanheceu forte na segunda-feira.", reward: "🏆 Meritocracia Blindada: O sobrenome não substitui o currículo.", lesson: "" },
      { id: "B", text: "Criar uma diretoria 'paralela' (Diretoria de Inovação) só para abrigar o filho com um salário alto, sem mexer no Diretor Comercial atual.", xp: -25, isBest: false, impacts: { caixa: -8000, margem: -3.0, compliance: -10 }, feedback: "A VÁLVULA DE EGO. Você criou um custo fixo inútil e uma disputa de poder nos bastidores. O clima azedou.", reward: "", lesson: "Criar cargos fantasmas para a família é o primeiro passo da falência." },
      { id: "C", text: "Ceder à chantagem emocional, demitir o Diretor Comercial experiente e entregar as chaves das vendas na mão do filho sem experiência.", xp: -50, isBest: false, impacts: { caixa: -25000, margem: -6.0, compliance: -30 }, feedback: "O FIM DE UMA ERA. O mercado não respeitou o garoto. Os melhores clientes seguiram o antigo diretor para a concorrência.", reward: "", lesson: "O afeto do pai acabou de quebrar a obra da sua vida." }
    ]
  },
  {
    id: "t4_ma_01", tier: 4, sector: "Fusões e Aquisições (M&A)", title: "O Canto da Sereia Bilionária",
    theory: "Em M&A, o diabo mora nas entrelinhas. Uma proposta de compra milionária atrelada a cláusulas de 'Earn-out' (pagamento futuro baseado em metas impossíveis) é um truque para assumir o controle da sua empresa de graça e te escravizar no seu próprio negócio.",
    context: "Um fundo de investimento quer comprar sua empresa por absurdos R$ 10 Milhões. Mas a estrutura é: 1 Milhão à vista, você continua como CEO por 3 anos, e os 9 Milhões serão pagos se você triplicar o faturamento nesse período.",
    character: "O Cheque de Borracha",
    consultoriaHint: "Earn-out agressivo é ilusão. O fundo assume o controle agora, muda a diretoria, trava seus investimentos e você nunca atinge a meta. Negocie a maior parte em dinheiro vivo (Cash-out) ou levante da mesa.",
    options: [
      { id: "A", text: "Recusar a estrutura de Earn-out agressiva. Fazer uma contraproposta exigindo 7 Milhões em Cash-out imediato e 3 Milhões baseados na retenção da carteira atual, não em crescimento irreal.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 1.0, compliance: 25 }, feedback: "VALUATION REALISTA. Você não caiu no truque da Faria Lima. O fundo respeitou sua inteligência executiva e aceitou renegociar.", reward: "🏆 Equity Defendido: Papel não vale dinheiro, só caixa livre.", lesson: "" },
      { id: "B", text: "Aceitar a proposta cego pelos '10 Milhões' nominais do contrato, acreditando que você 'dá um jeito' de bater as metas impossíveis.", xp: -35, isBest: false, impacts: { caixa: 1000000, margem: -3.0, compliance: -20 }, feedback: "A GAIOLA DE OURO. O fundo assumiu o conselho, vetou suas estratégias de venda e você perdeu o direito aos 9 milhões.", reward: "", lesson: "Você virou um funcionário frustrado da empresa que você fundou." },
      { id: "C", text: "Aceitar a proposta e já comprometer os 10 milhões comprando imóveis na Pessoa Física através de financiamento, confiando no contrato futuro.", xp: -50, isBest: false, impacts: { caixa: -1000000, margem: -5.0, compliance: -40 }, feedback: "A RUÍNA PESSOAL. O Earn-out falhou. A empresa é do fundo e as dívidas milionárias da Pessoa Física impagáveis são suas.", reward: "", lesson: "Nunca comprometa patrimônio pessoal contando com o bônus futuro do M&A." }
    ]
  },
  {
    id: "t4_duediligence_02", tier: 4, sector: "Auditoria e Due Diligence", title: "Os Esqueletos no Armário",
    theory: "O Valuation (valor da empresa) derrete na Due Diligence (auditoria de compra) se houver passivo oculto. Para cada R$ 1 de sonegação ou risco trabalhista encontrado pelos auditores do comprador, R$ 5 são cortados do preço da sua empresa.",
    context: "Sua empresa está sendo vendida. Os auditores do comprador encontram um histórico de 3 anos de horas extras não pagas e algumas mercadorias vendidas 'sem nota' que somam R$ 100 mil de impostos sonegados.",
    character: "O Pente Fino",
    consultoriaHint: "Nunca minta para um auditor de Big 4. A mentira quebra o 'Deal'. Abra o jogo, ofereça reter uma parte do pagamento em uma conta Escrow (garantia) e absorva o passivo de cabeça erguida.",
    options: [
      { id: "A", text: "Agir com transparência radical. Assumir o erro do passado, retificar as declarações, parcelar o imposto devido e aceitar o desconto do passivo no valor final da venda.", xp: 40, isBest: true, impacts: { caixa: -15000, margem: 1.0, compliance: 40 }, feedback: "A HONRA DO DEAL. Houve desgaste e dor no bolso, mas a transparência salvou a venda milionária.", reward: "🏆 Transparência Tática: A verdade sai mais barata que a quebra de confiança.", lesson: "" },
      { id: "B", text: "Esconder a documentação complementar e tentar 'convencer' o contador interno a mentir para os auditores dizendo que não existem mais passivos.", xp: -30, isBest: false, impacts: { caixa: 0, margem: -2.0, compliance: -30 }, feedback: "A DESTRUIÇÃO DO ACORDO. Eles descobriram a ocultação. O comprador abandonou a mesa alegando má-fé sistêmica.", reward: "", lesson: "Auditoria descobre tudo. A omissão é um crime pior que o erro." },
      { id: "C", text: "Oferecer um 'por fora' (suborno) ao auditor júnior que descobriu os furos para ele tirar essas páginas do relatório final.", xp: -50, isBest: false, impacts: { caixa: -10000, margem: -5.0, compliance: -60 }, feedback: "CRIME DE CORRUPÇÃO. O auditor denunciou. A venda foi cancelada e a Polícia Federal foi acionada.", reward: "", lesson: "O suborno é o atestado de óbito moral e legal de um empresário." }
    ]
  },
  {
    id: "t4_escala_03", tier: 4, sector: "Estratégia Corporativa", title: "A Âncora Operacional (Spin-off)",
    theory: "O 'Spin-off' ou corte de segmento é vital quando uma empresa carrega dois negócios: um que é o futuro (margem alta, pouca equipe) e outro que é uma âncora (legado, receita alta mas lucro negativo). O ego de olhar pro faturamento bruto impede o dono de amputar o membro doente.",
    context: "Sua empresa fatura 200k. 150k vêm do varejo físico tradicional (que dá R$ 5k de prejuízo ao mês). 50k vêm do seu novo software/serviço online (que dá R$ 25k de lucro limpo ao mês). A operação online está estagnada porque toda sua energia vai para resolver os incêndios da loja física.",
    character: "O Peso do Passado",
    consultoriaHint: "Pare de subsidiar o fracasso com o dinheiro do sucesso. A loja física cumpriu seu papel na sua história, mas hoje é uma âncora. Venda o ponto ou feche, e escale o que realmente gera valor e lucro.",
    options: [
      { id: "A", text: "Iniciar o desinvestimento imediato da loja física. Vender o ponto/estoque para concorrentes, liquidar passivos e injetar o caixa 100% na escala do produto online.", xp: 40, isBest: true, impacts: { caixa: 50000, margem: 5.0, compliance: 10 }, feedback: "VISÃO DE FUTURO CORTANTE. O faturamento despencou, mas o LUCRO disparou. A empresa ficou enxuta, bilionária em margem e leve.", reward: "🏆 Foco em Margem: Cortar faturamento burro é a melhor forma de enriquecer.", lesson: "" },
      { id: "B", text: "Pegar os R$ 25k de lucro do setor online todos os meses para investir na loja física na esperança de 'reerguer' a operação tradicional.", xp: -25, isBest: false, impacts: { caixa: -20000, margem: -4.0, compliance: -5 }, feedback: "O RALIZAMENTO DO LUCRO. O setor online perdeu tração e a loja física engoliu seu único gerador de caixa livre.", reward: "", lesson: "Nunca penalize sua melhor operação para salvar um paciente terminal." },
      { id: "C", text: "Pegar um empréstimo gigantesco para abrir mais 3 lojas físicas iguais, achando que o problema era 'falta de volume' no varejo.", xp: -50, isBest: false, impacts: { caixa: -60000, margem: -6.0, compliance: -20 }, feedback: "A MULTIPLICAÇÃO DO PREJUÍZO. Você escalou uma operação deficitária. O colapso agora é inevitável.", reward: "", lesson: "Se a unidade de negócio dá prejuízo, abrir mais unidades acelera a falência." }
    ]
  },

  // --- LOTE 6: CISNES NEGROS E CRISES EXTREMAS (CÓDIGO AZUL) ---
  
  {
    id: "t2_logistica_01", tier: 2, sector: "Logística e Contingência", title: "A Greve dos Caminhoneiros",
    theory: "O modelo 'Just-in-Time' (trabalhar sem estoque) é lindo na planilha, mas suicida em um país com infraestrutura volátil. Não ter um Plano de Contingência (Redundância de Fornecedores Locais) paralisa a sua empresa no primeiro choque externo.",
    context: "Uma greve geral paralisou as rodovias. Seu insumo principal, comprado mais barato em outro estado, está travado num bloqueio a 500km. A sua produção zera em 24h e seu principal cliente exige a entrega na sexta-feira.",
    character: "A Cadeia Quebrada",
    consultoriaHint: "Na crise aguda, você não briga por lucro, você briga pela vida e pela marca. Pague mais caro para acionar o plano B local. Engula o prejuízo unitário, mas entregue a carga para não perder o contrato do ano.",
    options: [
      { id: "A", text: "Acionar um fornecedor local (30% mais caro) para garantir o mínimo vital da operação. Ligar para o cliente com transparência e garantir a entrega de forma fracionada no prazo.", xp: 40, isBest: true, impacts: { caixa: -3000, margem: -2.0, compliance: 15 }, feedback: "CONTROLE DE DANOS. A margem dessa remessa foi pro buraco, mas você salvou o contrato e a reputação da empresa.", reward: "🏆 Redundância Validada: A confiança do seu cliente no seu CNPJ dobrou.", lesson: "" },
      { id: "B", text: "Enviar um e-mail padrão avisando o cliente que 'devido à greve, a culpa não é nossa' e cruzar os braços esperando a rodovia liberar.", xp: -25, isBest: false, impacts: { caixa: -5000, margem: 0, compliance: -15 }, feedback: "SÍNDROME DE VÍTIMA. Você até pode ter razão na justiça, mas na prática o cliente foi para o concorrente que tinha estoque local.", reward: "", lesson: "O cliente paga pelo seu produto, não pelas suas desculpas logísticas." },
      { id: "C", text: "Pagar o triplo num frete aéreo 'clandestino' adiantado no desespero para tentar fazer a carga original chegar amanhã.", xp: -50, isBest: false, impacts: { caixa: -12000, margem: -6.0, compliance: -20 }, feedback: "O DELÍRIO. Você caiu num golpe logístico e descapitalizou de forma letal. A carga nunca chegou.", reward: "", lesson: "O desespero financeiro é o melhor cliente do golpista." }
    ]
  },
  {
    id: "t3_risco_02", tier: 3, sector: "Risco de Crédito", title: "A Queda do Gigante",
    theory: "O Risco de Concentração: Se um cliente representa mais de 30% do seu faturamento, ele não é seu cliente, é o seu verdadeiro dono. O Efeito Dominó ocorre quando o 'gigante' quebra e arrasta toda a rede de pequenos fornecedores para o buraco.",
    context: "Notícia no jornal: A maior rede de varejo do país (que compra 40% da sua produção) entrou em Recuperação Judicial (RJ). Eles te devem R$ 150 mil por mercadorias já entregues, com os boletos vencendo amanhã. O pagamento foi congelado pelo juiz.",
    character: "O Efeito Dominó",
    consultoriaHint: "Esqueça esse dinheiro no curto prazo. Ele evaporou. Lance como Perda Esperada (PDD). Corte custos cirurgicamente hoje para o seu caixa não sangrar amanhã, e jogue a equipe inteira na rua para pulverizar a carteira.",
    options: [
      { id: "A", text: "Lançar os 150k como perda (PDD). Iniciar cortes cirúrgicos de custo fixo na mesma tarde e pivotar a equipe comercial 100% para captar novos clientes médios e diluir o rombo.", xp: 40, isBest: true, impacts: { caixa: 0, margem: -5.0, compliance: 20 }, feedback: "RESILIÊNCIA EXECUTIVA. Você aceitou o golpe, estancou as despesas rapidamente e focou na pulverização urgente. A empresa balançou, mas não caiu.", reward: "🏆 Sobrevivência Brutal: Você desarmou a bomba atômica antes que ela implodisse o CNPJ.", lesson: "" },
      { id: "B", text: "Pegar R$ 150k de empréstimo no banco para 'cobrir o buraco' apostando que a rede de varejo vai pagar você nos próximos meses pelo plano da RJ.", xp: -35, isBest: false, impacts: { caixa: -5000, margem: -3.0, compliance: -10 }, feedback: "A ARMADILHA DA NEGAÇÃO. Na RJ, fornecedor é o último da fila. Você assumiu uma dívida bancária com juros para cobrir um dinheiro que só verá em 5 anos.", reward: "", lesson: "Tentar cobrir inadimplência insolvente com dívida bancária é morte dupla." },
      { id: "C", text: "Parar toda a sua empresa e ir com seus funcionários para a porta da sede do cliente protestar e exigir o pagamento imediato do boleto.", xp: -50, isBest: false, impacts: { caixa: -15000, margem: -4.0, compliance: -25 }, feedback: "O ATAQUE DE FÚRIA. O juiz já travou as contas deles. Seu barraco parou a sua própria operação, queimou sua marca e gerou demissões.", reward: "", lesson: "Leis de Recuperação Judicial não se importam com o tamanho do seu barraco." }
    ]
  },
  {
    id: "t3_crise_03", tier: 3, sector: "Gestão de Liquidez", title: "O Decreto (Lockdown)",
    theory: "Em cenários de Calamidade ou Fechamento Extremo, a métrica que importa não é o Lucro, é o 'Runway' (sua pista de decolagem): quantos meses o seu caixa paga a folha com a receita em zero. Aqui, a Preservação de Caixa é lei marcial.",
    context: "O Governo decretou Lockdown ou há uma catástrofe natural na sua cidade. Seu comércio/fábrica foi fechado por tempo indeterminado. A folha de pagamento cai na semana que vem. O fluxo de vendas da rua zerou de uma hora para a outra.",
    character: "O Zero Absoluto",
    consultoriaHint: "Hora de aplicar o torniquete. Acione o Governo (MP para folha), pare aluguéis amigavelmente (diferimento) e migre para o delivery/online o que puder na mesma noite.",
    options: [
      { id: "A", text: "Acionar medidas de governo (suspensão/redução de jornada), negociar o diferimento do aluguel (jogar parcelas para o ano que vem) e pivotar o estoque imediato para o digital/delivery.", xp: 40, isBest: true, impacts: { caixa: 8000, margem: -1.0, compliance: 15 }, feedback: "COMANDO DE GUERRA. Você protegeu as pessoas usando os mecanismos legais, esticou seu 'Runway' (oxigênio) e não paralisou a mente comercial.", reward: "🏆 Cash Preservation: O mestre do caixa prova seu valor na calamidade.", lesson: "" },
      { id: "B", text: "Gastar todo o caixa de segurança para pagar aluguel e equipe 100% integral para 'ser um bom patrão', achando que o fechamento só vai durar 15 dias.", xp: -30, isBest: false, impacts: { caixa: -25000, margem: -2.0, compliance: 0 }, feedback: "O HERÓI INCONSEQUENTE. A restrição durou 3 meses. No mês 2 você faliu e todo mundo foi pra rua de qualquer jeito, sem receber a rescisão.", reward: "", lesson: "Bondade com o dinheiro da empresa em crise aguda gera falência." },
      { id: "C", text: "Desligar os telefones, demitir todos pelo WhatsApp sem pagar as verbas rescisórias justificando 'força maior' e tentar fugir com o estoque.", xp: -50, isBest: false, impacts: { caixa: -10000, margem: -5.0, compliance: -60 }, feedback: "O VILÃO DO COLAPSO. A Justiça do Trabalho congelou todos os seus bens pessoais e da sua família. A covardia custou a sua vida financeira.", reward: "", lesson: "Catástrofes não anulam a responsabilidade do CPF do dono." }
    ]
  },
  {
    id: "t4_ciber_04", tier: 4, sector: "Cibersegurança e Dados", title: "O Sequestro do ERP (Ransomware)",
    theory: "O Ransomware paralisa a veia jugular de uma empresa (o faturamento) e expõe dados vitais à LGPD. Pagar o resgate financia o crime e não garante a chave. A proteção real está num plano de continuidade de negócios (BCP) e backup off-grid.",
    context: "Um estagiário clicou em um anexo falso. Todo o seu ERP, sistema financeiro e os dados de clientes foram bloqueados com criptografia pesada. A tela preta dos hackers exige 1.5 Bitcoins (R$ 500k) de resgate. Os caminhões de entrega pararam.",
    character: "O Blecaute Digital",
    consultoriaHint: "Não pague os terroristas. O Ministério Público pune a empresa. Isole a rede corrompida, rode operação manual (papel, nota fiscal de contingência) e restaure do último backup com a TI.",
    options: [
      { id: "A", text: "Não negociar com hackers. Desligar a rede interna, acionar notas manuais (contingência fiscal), notificar o vazamento à ANPD com transparência e restaurar o backup em nuvem isolado (D-1).", xp: 40, isBest: true, impacts: { caixa: -5000, margem: -1.0, compliance: 35 }, feedback: "PROTOCOLO DE INCIDENTES (BCP). O dia foi caótico, mas a empresa seguiu as regras da LGPD e a operação voltou à vida 24h depois.", reward: "🏆 Contingência Validada: Backup testado na fogueira salva o CNPJ.", lesson: "" },
      { id: "B", text: "Ocultar o sequestro. Tentar mentir para a equipe e pros clientes dizendo que é uma 'atualização de rotina que travou o sistema', até a TI achar uma saída.", xp: -35, isBest: false, impacts: { caixa: -12000, margem: -3.0, compliance: -40 }, feedback: "CRIME DE OMISSÃO (LGPD). Os clientes vazados descobriram pela Dark Web. Multas federais brutais e quebra violenta de confiança.", reward: "", lesson: "A mentira num incidente de dados é o acelerador de falência reputacional." },
      { id: "C", text: "Correr numa corretora, comprar os Bitcoins e pagar o resgate imediatamente para 'resolver a dor de cabeça hoje' e voltar a faturar.", xp: -50, isBest: false, impacts: { caixa: -50000, margem: -5.0, compliance: -30 }, feedback: "FINANCIAMENTO DO CRIME. Você pagou a bolada, eles mandaram uma chave falsa e pediram o dobro. Você quebrou a empresa de vez.", reward: "", lesson: "Hackers veem empresas que pagam resgate como caixas eletrônicos recorrentes." }
    ]
  },
  {
    id: "t4_macro_05", tier: 4, sector: "Hedge e Macroeconomia", title: "O Dólar Explodiu",
    theory: "Importar insumos sem proteção cambial (Trava/Hedge) não é empreender, é fazer apostas arriscadas (day-trade) com o fluxo de caixa da empresa. Choques macroeconômicos e geopolíticos globais destroem margens em poucas horas.",
    context: "Sua matéria-prima principal vem importada. Uma guerra estourou de madrugada do outro lado do mundo. O dólar abriu com alta de 15%. Você tem 2 contêineres chegando no porto semana que vem, com faturas atreladas ao dólar do dia.",
    character: "O Choque Cambial",
    consultoriaHint: "A conta chegou. Aceite a dor. Pague, repasse imediatamente o que der pro preço final sem quebrar a demanda, e daqui pra frente feche NDFs (Termos de Moeda) para cravar o custo do seu CMV no momento da compra.",
    options: [
      { id: "A", text: "Assumir a pancada dos 15% agora. Pagar o frete, repassar parte do custo pra tabela nova e chamar a tesouraria para instituir, de hoje em diante, proteção cambial (Hedge/NDF) obrigatória para o CNPJ.", xp: 40, isBest: true, impacts: { caixa: -15000, margem: -2.0, compliance: 20 }, feedback: "RESILIÊNCIA E APRENDIZAGEM. Você tomou a facada, mas a empresa evoluiu. A partir de hoje, vocês não apostam mais na roleta do câmbio.", reward: "🏆 Controle Macro: O lucro agora é protegido de sustos da política mundial.", lesson: "" },
      { id: "B", text: "Postergar o pagamento no porto e deixar a carga lá parada pagando estadia, 'esperando o dólar dar uma recuada na semana que vem'.", xp: -35, isBest: false, impacts: { caixa: -10000, margem: -3.0, compliance: -10 }, feedback: "O APOSTADOR. O dólar subiu mais 5%. O porto cobrou taxas milionárias de armazenagem. O custo da mercadoria triplicou.", reward: "", lesson: "Esperar a moeda cair é jogar no cassino. Custos de porto devoram o balanço." },
      { id: "C", text: "Romper o contrato com o fornecedor asiático, abandonar a carga atracada no porto para não ter que pagar os 15% a mais e tentar usar similares de baixa qualidade locais.", xp: -50, isBest: false, impacts: { caixa: -35000, margem: -6.0, compliance: -40 }, feedback: "QUEBRA DE CONTRATOS E PROCESSOS. Seu CNPJ foi barrado em compras internacionais, a Receita multou pelo abandono e o produto local era horrível.", reward: "", lesson: "Fugir das regras de importação condena a empresa ao ostracismo comercial." }
    ]
  },

  // -// --- LOTE 7: IMPACTOS REGULATÓRIOS E COMPLIANCE TRABALHISTA (CÓDIGO AZUL) ---
  
  {
    id: "t3_pjtizacao_01", tier: 3, sector: "Compliance Trabalhista", title: "A Falsa Economia da Pejotização",
    theory: "Contratar via MEI para burlar a CLT exigindo horário fixo, subordinação e não-eventualidade é fraude trabalhista. A 'economia' de 40% em encargos hoje é a semente de um processo milionário que quebra a empresa em 3 anos.",
    context: "Sua empresa está tracionando e você precisa de 5 novos vendedores internos. Para não pagar impostos trabalhistas, seu contador antigo sugere mandar todos abrirem um MEI (CNPJ) para emitirem nota, mas eles terão horário fixo, computador da empresa e metas cobradas diariamente por você.",
    character: "A Bomba Relógio Trabalhista",
    consultoriaHint: "Subordinação e horário definem vínculo. Se a empresa não tem caixa para contratar via CLT, ela não tem caixa para expandir. Fraudar a lei para crescer gera um Passivo Oculto que destrói o Valuation (valor) do seu negócio no futuro.",
    options: [
      { id: "A", text: "Assumir a realidade financeira. Contratar apenas 3 vendedores via CLT com comissionamento agressivo, diluindo as metas, para crescer dentro da lei e proteger o CNPJ.", xp: 40, isBest: true, impacts: { caixa: -1500, margem: 1.0, compliance: 35 }, feedback: "CRESCIMENTO BLINDADO. O avanço foi um pouco mais lento, mas você dorme sem medo da Justiça do Trabalho. O Valuation da empresa se mantém limpo.", reward: "🏆 Risco Zero Trabalhista: A fundação de cimento que a concorrência não tem.", lesson: "" },
      { id: "B", text: "Aceitar a ideia do contador, contratar os 5 como MEI e tentar ser 'amigo' deles para que não processem a empresa quando saírem.", xp: -35, isBest: false, impacts: { caixa: 4000, margem: -2.0, compliance: -40 }, feedback: "A ECONOMIA BURRA. A 'amizade' acabou na demissão. Dois deles entraram na justiça, comprovaram o vínculo e a multa engoliu todo o lucro do ano.", reward: "", lesson: "Na Justiça do Trabalho, aperto de mão e acordo verbal não anulam fraude." },
      { id: "C", text: "Para evitar o problema do MEI, contratar todo mundo 'sem carteira assinada', pagando em dinheiro vivo para não deixar rastros.", xp: -50, isBest: false, impacts: { caixa: 5000, margem: -4.0, compliance: -60 }, feedback: "O SUICÍDIO INSTITUCIONAL. Você cometeu infrações criminais, tributárias e trabalhistas. A fiscalização do Ministério do Trabalho bloqueou as contas da empresa.", reward: "", lesson: "Quem vive na clandestinidade nunca atinge escala profissional." }
    ]
  },
  {
    id: "t4_fap_02", tier: 4, sector: "Custo Regulatório (INSS)", title: "O Boleto do Acidente de Trabalho",
    theory: "O Fator Acidentário de Prevenção (FAP) multiplica o seu imposto sobre a folha. Um funcionário machucado não custa só o atestado; ele dobra o encargo previdenciário de TODOS os seus funcionários pelos próximos anos. Segurança do trabalho é gestão financeira.",
    context: "Um funcionário da expedição lesionou as costas levantando caixas além do peso limite, pois você adiou a compra de uma empilhadeira manual (R$ 4.000). Ele foi afastado pelo INSS. Se a Comunicação de Acidente de Trabalho (CAT) for emitida, seu FAP vai subir.",
    character: "O Encargo Multiplicado",
    consultoriaHint: "Omitir acidente é infração pesada. O custo oculto da falta de EPI e ergonomia sempre se manifesta em impostos punitivos e processos. Regularize a situação, pague a multa e compre o equipamento hoje.",
    options: [
      { id: "A", text: "Emitir a CAT imediatamente, prestar assistência ao funcionário, assumir o aumento do imposto (FAP) e comprar a empilhadeira hoje para travar futuros acidentes.", xp: 40, isBest: true, impacts: { caixa: -6000, margem: 1.0, compliance: 30 }, feedback: "CHOQUE DE COMPLIANCE. A ineficiência antiga custou caro, mas você corrigiu a raiz do problema. A sua expedição ficou mais rápida e segura.", reward: "🏆 Governança Operacional: Segurança do trabalho não é custo, é escudo.", lesson: "" },
      { id: "B", text: "Não emitir a CAT para 'não sujar o indicador no INSS' e pagar o salário dele por fora enquanto ele se recupera em casa sem registro oficial.", xp: -40, isBest: false, impacts: { caixa: -8000, margem: -2.0, compliance: -40 }, feedback: "A OBTENÇÃO DE PASSIVO. Ele não melhorou, a família denunciou ao sindicato e o Ministério Público do Trabalho autuou a empresa por ocultação de acidente.", reward: "", lesson: "Omitir acidente do Estado é transformar um problema operacional num inquérito." },
      { id: "C", text: "Demitir o funcionário no mesmo dia alegando 'baixo rendimento' para que ele vá procurar tratamento fora da responsabilidade da empresa.", xp: -50, isBest: false, impacts: { caixa: -15000, margem: -5.0, compliance: -50 }, feedback: "A DEMISSÃO ILEGAL. Funcionário acidentado tem estabilidade. O juiz determinou a reintegração com pagamento de multa moral altíssima e dobrou o FAP.", reward: "", lesson: "A lei protege a parte mais fraca. A arrogância pune a empresa." }
    ]
  },
  {
    id: "t4_prev_03", tier: 4, sector: "Planejamento Patrimonial", title: "O CEO Sem Aposentadoria",
    theory: "O dono que tira Pró-Labore de apenas 'um salário mínimo' (para não pagar os 11% de INSS e o IRRF) e retira 100% do resto como Lucro Isento se acha esperto. Mas o Déficit Atuarial não perdoa. Sem recolhimento justo e sem previdência privada, se você sofrer um AVC, a sua família ganha 1 salário mínimo de benefício.",
    context: "Você tem 45 anos. A empresa está muito rentável. O contador pergunta se você não quer revisar seu Pró-Labore, que hoje é de 1 salário mínimo (R$ 1.412). Todo seu padrão de vida (R$ 15.000/mês) vem da Distribuição de Lucros. Você não tem seguro de vida.",
    character: "A Fragilidade do Dono",
    consultoriaHint: "O CNPJ não pode ser o único fundo de emergência do CPF. Adeque seu Pró-labore para o teto do INSS (proteção por invalidez/pensão) e comece a diversificar o lucro em investimentos fora da empresa. Proteja a si mesmo para proteger o negócio.",
    options: [
      { id: "A", text: "Aceitar a dor do imposto. Elevar o Pró-Labore para o teto do INSS, garantir o benefício máximo de risco, e começar a alocar parte dos lucros em uma previdência privada robusta e seguro de vida.", xp: 40, isBest: true, impacts: { caixa: -2500, margem: 1.5, compliance: 25 }, feedback: "BLINDAGEM DO SÓCIO. Você parou de contar com a sorte e organizou a estrutura sucessória e protetiva da sua família. Você é um executivo.", reward: "🏆 Hedge Patrimonial: A sua vida agora independe das oscilações do CNPJ.", lesson: "" },
      { id: "B", text: "Manter o Pró-Labore num salário mínimo para fugir do IRRF, e apostar que 'a empresa é a minha aposentadoria, quando eu ficar velho eu a vendo'.", xp: -30, isBest: false, impacts: { caixa: 1500, margem: -1.0, compliance: -15 }, feedback: "A ROLETA RUSSA. Você adoeceu, não pôde trabalhar, e o lucro da empresa despencou. O INSS te pagou R$ 1.412 por mês. Sua família faliu.", reward: "", lesson: "A empresa vale muito hoje. Amanhã, o mercado pode engoli-la. Diversifique." },
      { id: "C", text: "Tirar 100% da sua renda por fora 'em caixa 2', não pagar sequer 1 centavo de INSS e usar o dinheiro para financiar uma casa de praia de luxo.", xp: -50, isBest: false, impacts: { caixa: 5000, margem: -4.0, compliance: -50 }, feedback: "A SONARIDADE LETAL. O cruzamento da Receita Federal (e-Financeira x IRPF) identificou evolução patrimonial sem lastro e autuou o CPF.", reward: "", lesson: "A ostentação na Pessoa Física baseada em fraude PJ é o caminho mais rápido para a cadeia." }
    ]
  },
  {
    id: "t3_alvara_04", tier: 3, sector: "Risco Regulatório e Alvarás", title: "O Lacre de Fogo",
    theory: "Economizar no projeto de incêndio (AVCB) ou em licenças operacionais pode paralisar a produção da noite para o dia. A fiscalização não liga para suas metas de faturamento. Lacre fiscal significa Receita Zero e Custos Fixos Correndo.",
    context: "Sua nova filial/galpão foi inaugurada com pressa. Para economizar R$ 18.000, você não instalou o sistema anti-incêndio exigido. O fiscal dos bombeiros bateu hoje, lacrou o local e ameaçou cassar o alvará. Amanhã há 40 entregas agendadas.",
    character: "O Atalho que Custa a Pista",
    consultoriaHint: "Assuma a culpa. Paralisar por conta própria e corrigir com urgência custa o preço da obra. Tentar driblar o lacre é arriscar um incêndio com vítimas, onde o dono responde criminalmente (homicídio culposo).",
    options: [
      { id: "A", text: "Assinar o Termo de Ajustamento (TAC). Paralisar a operação por 3 dias, direcionar as entregas para a matriz, pagar a multa e executar a obra anti-incêndio em caráter de urgência.", xp: 40, isBest: true, impacts: { caixa: -25000, margem: -2.0, compliance: 40 }, feedback: "GESTÃO DE CRISE RADICAL. O caixa tomou um tiro de canhão, a logística sofreu, mas o CNPJ evitou a suspensão sumária e riscos de prisão.", reward: "🏆 Compliance Físico: Sem estrutura de segurança legal, não há empresa.", lesson: "" },
      { id: "B", text: "Procurar um 'despachante influente' que pede R$ 8.000 de propina para 'quebrar um galho' com o fiscal e desinterditar o prédio provisoriamente.", xp: -45, isBest: false, impacts: { caixa: -8000, margem: -4.0, compliance: -50 }, feedback: "O PACTO COM O DIABO. Corrupção ativa. Uma semana depois, ocorreu um princípio de incêndio, o seguro negou o pagamento por falta de AVCB e a empresa foi fechada pelo MP.", reward: "", lesson: "O atalho corrupto sempre cobra o preço em chamas e sangue." },
      { id: "C", text: "Romper o lacre de madrugada, esconder o maquinário principal e forçar a equipe a trabalhar a portas fechadas 'só até entregar os pedidos do dia'.", xp: -50, isBest: false, impacts: { caixa: -5000, margem: -6.0, compliance: -60 }, feedback: "A DESOBEDIÊNCIA CÍVICA E CRIMINAL. A fiscalização voltou no dia seguinte com a polícia. Prisão em flagrante por rompimento de lacre e desobediência.", reward: "", lesson: "O Estado tem o monopólio da força. Não tente blefar com um fiscal ofendido." }
    ]
  },
  {
    id: "t2_horaextra_05", tier: 2, sector: "Processos de RH", title: "O Banco de Horas Fantasma",
    theory: "O 'combinado de boca' não existe na Justiça Trabalhista. Fazer a equipe ficar além do horário sem um sistema de ponto rigoroso e um acordo sindical homologado anula a previsibilidade do seu custo de folha. A conta sempre chega na rescisão.",
    context: "Dezembro. O pico de vendas fez a equipe inteira trabalhar 40 horas a mais no mês. Você não tem relógio de ponto formal e propôs de boca dar um 'bônus por fora' e umas folgas em janeiro. Uma semana depois, o melhor funcionário pede as contas e exige o pagamento legal das horas extras (com 50% de acréscimo).",
    character: "A Informalidade Desgastante",
    consultoriaHint: "As horas foram trabalhadas. Pague a rescisão com todos os adicionais previstos na lei para blindar o CPF dele no momento do distrato. No dia seguinte, profissionalize o sistema e só permita hora extra com aprovação prévia do gerente.",
    options: [
      { id: "A", text: "Pagar as 40 horas rigorosamente com 50% de acréscimo na rescisão. Aproveitar o choque para contratar um relógio de ponto online para todos e redigir regras rígidas de hora extra.", xp: 35, isBest: true, impacts: { caixa: -2500, margem: 1.0, compliance: 25 }, feedback: "AJUSTE FINO. Você pagou caro pela desorganização passada, mas comprou a paz jurídica e blindou o caixa contra horas abusivas no futuro.", reward: "🏆 Régua Trabalhista: Controle de ponto virou cultura na empresa.", lesson: "" },
      { id: "B", text: "Negar o pagamento legal, dizendo que ele 'concordou verbalmente com as folgas' e mandar ele procurar os direitos se não estiver satisfeito.", xp: -35, isBest: false, impacts: { caixa: 0, margem: -2.0, compliance: -30 }, feedback: "A ARROGÂNCIA PROCESSUAL. Ele procurou um advogado. Sem controle de ponto (ônus da empresa), o juiz deferiu não apenas as 40h, mas tudo o que ele pediu retroativo a 2 anos.", reward: "", lesson: "Quem não tem prova documental das horas (ponto), perde a presunção na Justiça." },
      { id: "C", text: "Negociar e pagar as horas extras em dinheiro vivo direto no bolso dele para não incidir FGTS, INSS e férias no cálculo rescisório.", xp: -45, isBest: false, impacts: { caixa: -1800, margem: -3.0, compliance: -40 }, feedback: "A MAQUILAGEM PERIGOSA. Ele pegou o dinheiro por fora e depois processou a empresa dizendo que o pagamento foi comissões não declaradas. Você pagará duas vezes.", reward: "", lesson: "Recibo em guardanapo ou Pix oculto não têm validade para o Tribunal." }
    ]
  },

 // --- LOTE 8: MARKETING, VENDAS E GROWTH HACKING (CÓDIGO AZUL) ---
  
  {
    id: "t2_mkt_01", tier: 2, sector: "Marketing e Tráfego", title: "O Terreno Alugado (Dependência de Algoritmo)",
    theory: "Construir sua máquina de vendas dependendo exclusivamente do Instagram é construir um castelo em terreno alugado. Se a plataforma mudar as regras, você quebra. O verdadeiro valor do marketing é tirar o cliente da rede social e trazê-lo para um canal próprio (CRM, E-mail, Lista de WhatsApp).",
    context: "O Instagram atualizou o algoritmo de madrugada. Seu engajamento orgânico caiu 70% e o telefone, que tocava 10 vezes por dia com pedidos, não tocou nenhuma vez hoje. O desespero bateu.",
    character: "O Feed Silencioso",
    consultoriaHint: "Pare de tentar adivinhar algoritmo. Rede social é vitrine, não é balcão. Você precisa minerar a base que já comprou de você no WhatsApp e criar uma oferta direta hoje para pagar as contas da semana.",
    options: [
      { id: "A", text: "Parar de focar só em posts, extrair a lista de clientes antigos do WhatsApp/Sistema e fazer uma oferta direta e exclusiva de 'recompra' para eles.", xp: 15, isBest: true, impacts: { caixa: 4500, receita: 1500, compliance: 5 }, feedback: "ESTRATÉGIA DE RETENÇÃO (LTV). Você parou de depender da sorte da rede social, usou seus próprios dados e gerou caixa imediato com custo de aquisição zero." },
      { id: "B", text: "Fazer uma promoção relâmpago agressiva (50% OFF) nos stories torcendo para que alguém veja e compre.", xp: 5, isBest: false, impacts: { caixa: 1000, receita: -500, compliance: 0 }, feedback: "SANGRAMENTO DE MARGEM. Entraram algumas vendas, mas o desconto corroeu todo o seu lucro. Você trabalhou de graça para a plataforma." },
      { id: "C", text: "Gastar R$ 2.000 do caixa em impulsionamento de posts no desespero para tentar recuperar os likes e as visualizações.", xp: -15, isBest: false, impacts: { caixa: -2000, receita: 0, compliance: -5 }, feedback: "O RALO DO TRÁFEGO CEGO. Impulsionar sem funil de vendas é rasgar dinheiro. O engajamento subiu, mas nenhuma venda foi concretizada." }
    ]
  },
  {
    id: "t2_vendas_02", tier: 2, sector: "Vendas e Margem", title: "A Armadilha do 'Cobrindo a Oferta'",
    theory: "Vender dando descontos absurdos apenas para bater meta de faturamento é a ilusão do 'vendedor amador'. Volume sem margem de contribuição acelera a falência. O cliente que vem apenas por preço, vai embora por preço.",
    context: "Um cliente prospect (que pode trazer um bom faturamento) avisa que o seu concorrente fez o mesmo serviço 25% mais barato. Ele diz: 'Se você cobrir, eu fecho com você agora'. Cobrir essa oferta zera completamente o seu lucro.",
    character: "O Cliente Leiloeiro",
    consultoriaHint: "Deixe esse cliente ir para a concorrência e quebrar a empresa deles. Quem foca em preço não é cliente parceiro, é mercenário. Defenda o valor da sua entrega, não o preço da etiqueta.",
    options: [
      { id: "A", text: "Manter sua tabela de preços, reforçar os diferenciais técnicos, o prazo e a segurança do seu CNPJ, e estar disposto a perder o negócio se ele insistir no desconto.", xp: 10, isBest: true, impacts: { caixa: 0, receita: 0, compliance: 10 }, feedback: "POSICIONAMENTO DE MARCA. Você perdeu a venda, mas protegeu a saúde financeira da empresa e a sua autoridade. Filtro natural de clientes ruins." },
      { id: "B", text: "Oferecer 10% de desconto e 'tirar' algum benefício ou serviço extra da proposta para tentar chegar num meio termo.", xp: 5, isBest: false, impacts: { caixa: 500, receita: 500, compliance: 0 }, feedback: "O EMPATE TÉCNICO. Fechou, mas o cliente já entrou sentindo que perdeu benefícios. A relação começou desgastada." },
      { id: "C", text: "Cobrir os 25% de desconto sorrindo, só para 'roubar' o cliente da concorrência e faturar a nota.", xp: -10, isBest: false, impacts: { caixa: -1500, receita: 3000, compliance: -10 }, feedback: "TRABALHO ESCRAVO. A receita subiu, a vaidade inflou, mas o custo operacional engoliu o caixa. Você pagou para trabalhar." }
    ]
  },
  {
    id: "t3_growth_03", tier: 3, sector: "Growth Hacking (CAC)", title: "O Ralo do Tráfego Pago",
    theory: "Marketing não é despesa, é investimento. Mas investimento exige métrica. Se você não sabe o seu Custo de Aquisição de Cliente (CAC) e o Retorno sobre Investimento (ROI), você não está fazendo marketing, está apostando num cassino.",
    context: "Você colocou R$ 3.000 em campanhas de Ads no último mês. Entraram muitos 'curtidas', dezenas de mensagens de curiosos no WhatsApp, mas apenas 4 vendas pequenas que geraram R$ 800 de lucro total. O cartão de crédito da empresa vence amanhã.",
    character: "A Fatura do Zuckerberg",
    consultoriaHint: "Pause as campanhas agora. Tráfego pago potencializa o que já funciona. Se o seu processo de vendas (funil e atendimento) é ruim, pagar por anúncios só acelera o seu prejuízo.",
    options: [
      { id: "A", text: "Pausar as campanhas imediatamente, auditar o funil de atendimento do WhatsApp e treinar a equipe para converter os curiosos que já entraram antes de colocar mais dinheiro.", xp: 12, isBest: true, impacts: { caixa: 0, receita: 1000, compliance: 5 }, feedback: "EFICIÊNCIA OPERACIONAL. Você estancou a sangria, corrigiu o gargalo interno (conversão) e otimizou o lead que já estava na base." },
      { id: "B", text: "Manter a verba, mas trocar a agência de marketing ou o gestor de tráfego, culpando eles pelos leads 'desqualificados'.", xp: -5, isBest: false, impacts: { caixa: -3000, receita: 0, compliance: 0 }, feedback: "TERCEIRIZAÇÃO DA CULPA. O problema era o seu processo de fechamento, não os leads. O dinheiro continuou indo pro ralo." },
      { id: "C", text: "Dobrar o orçamento de anúncios para R$ 6.000, acreditando que 'é só uma questão de volume' para as vendas começarem a sair.", xp: -15, isBest: false, impacts: { caixa: -6000, receita: -500, compliance: -10 }, feedback: "O VÍCIO NA ESCALA QUEBRADA. Escalar um processo ineficiente apenas multiplica a sua velocidade em direção à parede." }
    ]
  },
  {
    id: "t3_retencao_04", tier: 3, sector: "Retenção (LTV)", title: "A Mina de Ouro Esquecida",
    theory: "Custa 5 a 7 vezes mais caro atrair um cliente novo (CAC) do que vender novamente para quem já confia na sua marca. O Lifetime Value (LTV) — quanto o cliente gasta com você ao longo dos anos — é a verdadeira métrica de enriquecimento do CNPJ.",
    context: "Você precisa aumentar o faturamento deste mês em R$ 15.000, mas o seu orçamento de marketing acabou. Analisando o sistema, você percebe que tem 800 clientes que compraram no ano passado e nunca mais receberam um 'bom dia' da sua empresa.",
    character: "A Lista Empoeirada",
    consultoriaHint: "O dinheiro mais barato do mundo está na sua base inativa. Crie um 'Clube VIP' ou uma condição de atualização de produto, pegue o telefone e ligue. Sem intermediários.",
    options: [
      { id: "A", text: "Criar uma oferta especial de renovação ou 'Clube VIP' e colocar a equipe para ligar (ou mandar áudio) um a um para os melhores clientes dessa lista.", xp: 15, isBest: true, impacts: { caixa: 8000, receita: 5000, compliance: 10 }, feedback: "MINERAÇÃO DE ATIVOS. A taxa de conversão de clientes antigos é altíssima. Você gerou receita líquida pesada com R$ 0,00 de investimento em anúncios." },
      { id: "B", text: "Disparar uma automação de e-mail em massa e genérica com um cupom de 5% de desconto para todos da base.", xp: 5, isBest: false, impacts: { caixa: 500, receita: 500, compliance: 0 }, feedback: "O FRIO E DISTANTE. Quase ninguém abriu o e-mail genérico e a conversão foi pífia. Faltou relacionamento e exclusividade." },
      { id: "C", text: "Ignorar a lista antiga por achar que eles 'já compraram o que precisavam' e pegar um microcrédito no banco para voltar a fazer anúncios.", xp: -10, isBest: false, impacts: { caixa: -2000, receita: -1000, compliance: -5 }, feedback: "A CEGUEIRA DO CUSTO. Assumiu dívida para buscar desconhecidos, enquanto o ouro estava dormindo na gaveta do seu escritório." }
    ]
  },
  {
    id: "t4_escala_05", tier: 4, sector: "Vendas e Outbound", title: "A Esperança Não É Estratégia",
    theory: "O 'boca a boca' é maravilhoso como bônus, mas letal como única estratégia de aquisição. Uma empresa madura não pode terceirizar seu crescimento para a vontade dos outros. Sem um processo ativo de prospecção (Outbound), a receita fica refém da sorte.",
    context: "Quando perguntam qual a sua estratégia de captação, você enche o peito e diz: 'Meu serviço é tão bom que vem tudo por indicação'. Porém, a economia do país esfriou, as indicações pararam há 3 semanas, e a receita despencou.",
    character: "O Telefone Mudo",
    consultoriaHint: "Esperança não bate meta. Levante dessa cadeira. Mapeie 50 clientes ideais no LinkedIn ou no Google, estruture um pitch comercial agressivo focado na dor deles e vá caçar a sua receita.",
    options: [
      { id: "A", text: "Assumir a falha processual. Estruturar imediatamente uma rotina diária de prospecção ativa (Outbound/Cold Calling), definindo metas de ligações para a equipe de vendas e para você.", xp: 15, isBest: true, impacts: { caixa: 0, receita: 4000, compliance: 10 }, feedback: "PROTAGONISMO COMERCIAL. Você tomou as rédeas do crescimento. A prospecção ativa é dura, mas é previsível e escalável. O CNPJ acordou." },
      { id: "B", text: "Mandar mensagens no WhatsApp pedindo pelo amor de Deus para os clientes antigos indicarem novos amigos em troca de brindes.", xp: 5, isBest: false, impacts: { caixa: 0, receita: 500, compliance: 0 }, feedback: "MENDICÂNCIA COMERCIAL. Entraram alguns pingados, mas sua marca perdeu força ao transparecer desespero." },
      { id: "C", text: "Cruzar os braços, culpar a crise do governo e dizer para a equipe: 'Vamos manter a qualidade que uma hora o mercado reconhece e volta a comprar'.", xp: -15, isBest: false, impacts: { caixa: -4000, receita: -3000, compliance: -10 }, feedback: "A PASSIVIDADE FATAL. O mercado não tem obrigação de te reconhecer. A inércia corroeu o caixa até o osso enquanto você esperava um milagre." }
    ]
  } // --- COLE O LOTE 8 AQUI ABAIXO DESTA LINHA ----- COLE O LOTE 7 AQUI ABAIXO DESTA LINHA ---// --- COLE O LOTE 6 AQUI ABAIXO DESTA LINHA ------ COLE O LOTE 5 AQUI ABAIXO DESTA LINHA ---OLE O LOTE 4 AQUI ABAIXO DESTA LINHA ---
];