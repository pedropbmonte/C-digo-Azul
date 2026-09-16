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
  }

  // --- COLE O LOTE 3 AQUI ABAIXO DESTA LINHA ---

];