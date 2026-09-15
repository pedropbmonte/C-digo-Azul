// ARQUIVO: app/questions.ts

export const questionBank = [
  // --- TIER 1: SOBREVIVÊNCIA E CAIXA ---
  {
    id: "q_pf_pj_01", tier: 1, sector: "Sobrevivência Financeira", title: "A Sangria Silenciosa",
    theory: "Misturar contas PF e PJ mascara seu Ponto de Equilíbrio. Se a empresa paga a conta de luz da sua casa direto no CNPJ, você não sabe se o seu negócio dá lucro ou se você é apenas um funcionário caro da sua própria desorganização.",
    context: "Sexta-feira. A conta PJ tem R$ 4.000. O vale semanal da equipe amanhã soma R$ 6.000. Ao checar o extrato, você constata que passou R$ 3.500 no cartão corporativo para pagar compras de supermercado da sua família nesta semana.",
    character: "O Extrato Implacável",
    consultoriaHint: "Dono que assalta a própria empresa vira refém de banco. Devolva o capital para a PJ hoje. Pague sua equipe. O seu luxo na Pessoa Física precisa ser cortado até a empresa dar lucro real.",
    options: [
      { id: "A", text: "Injetar dinheiro do próprio bolso (PF) na PJ hoje, pagar a equipe e instituir uma retirada fixa e austera a partir de segunda.", xp: 35, isBest: true, impacts: { caixa: 5000, margem: 1.0, compliance: 15 }, feedback: "ATITUDE DE DONO. Separou os bolsos e travou o sangramento.", reward: "🏆 Trava de Retirada: O sistema impede pagamentos de CPF na conta PJ.", lesson: "" },
      { id: "B", text: "Acionar o cheque especial da conta PJ para cobrir a equipe, sem precisar cortar seus gastos pessoais no fim de semana.", xp: -10, isBest: false, impacts: { caixa: -500, margem: -2.5, compliance: -10 }, feedback: "A ILUSÃO. Você tomou dívida cara na PJ para financiar luxo na PF.", reward: "", lesson: "A dívida da empresa não sustenta o ego do dono." },
      { id: "C", text: "Atrasar o vale da equipe dizendo que 'o mercado está retraído' e pedir compreensão.", xp: -40, isBest: false, impacts: { caixa: -2000, margem: -5.0, compliance: -30 }, feedback: "FALÊNCIA MORAL. Sua equipe sabe a verdade.", reward: "", lesson: "A desmotivação da base é o primeiro sintoma da quebra." }
    ]
  },
  {
    id: "q_maq_01", tier: 1, sector: "Capital de Giro", title: "A Ilusão da Venda Esculpida",
    theory: "Antecipar recebíveis não é gerar caixa, é agiotagem legalizada. Se a sua Margem é de 15% e você paga 5% ao mês de taxa, você entrega um terço do seu esforço só para ter o dinheiro amanhã.",
    context: "Você acaba de comemorar uma venda de R$ 15.000 parcelada em 10x sem juros. Porém, o boleto do fornecedor dessa mesma mercadoria vence amanhã e seu saldo atual é zero.",
    character: "O Custo Financeiro",
    consultoriaHint: "Nunca antecipe para cobrir furo. Ligue para o fornecedor, alongue o prazo dele e crie uma campanha PIX relâmpago hoje para fazer caixa barato.",
    options: [
      { id: "A", text: "Renegociar o boleto para 15 dias e lançar uma promoção relâmpago via PIX na sua base para levantar liquidez.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: 1.5, compliance: 10 }, feedback: "ESTRATEGISTA DE CAIXA. Preservou a margem da grande venda.", reward: "🏆 Visão de Liquidez: Você injeitou caixa sem depender de bancos.", lesson: "" },
      { id: "B", text: "Apertar o botão de antecipação no app da maquininha, pagando 6% de taxa total para ter o dinheiro de manhã.", xp: -5, isBest: false, impacts: { caixa: 0, margem: -3.0, compliance: 0 }, feedback: "A ARMADILHA. Resolveu segunda-feira, mas rasgou o lucro da semana.", reward: "", lesson: "O botão de antecipar é o botão de autodestruição da margem." },
      { id: "C", text: "Pagar o fornecedor com o cartão de crédito corporativo, somando os juros do cartão.", xp: -45, isBest: false, impacts: { caixa: -3000, margem: -5.0, compliance: -20 }, feedback: "BOLA DE NEVE FATAL. Custo financeiro sobre custo financeiro.", reward: "", lesson: "Pegar fogo para apagar incêndio só gera cinzas." }
    ]
  },
  {
    id: "q_preco_01", tier: 1, sector: "Precificação Cega", title: "O Teto de Vidro do Vizinho",
    theory: "Preço de Venda = Preço do Concorrente é a fórmula da falência. O vizinho pode ter aluguel mais barato, sonegar impostos ou estar quebrando. Balizar seu preço pelo dele é pagar para trabalhar.",
    context: "Seu produto carro-chefe custa R$ 80. O custo de reposição subiu 15%. A loja vizinha vende por R$ 75. Você tem pavor de reajustar e perder clientela.",
    character: "O Medo da Precificação",
    consultoriaHint: "Quem atrai por preço, por preço perde. Repasse o aumento amanhã. Deixe os 'sugadores de desconto' afundarem a margem do concorrente.",
    options: [
      { id: "A", text: "Repassar o aumento para a tabela, treinar o time em objeções e aceitar a perda dos clientes de preço.", xp: 35, isBest: true, impacts: { caixa: 3000, margem: 2.5, compliance: 10 }, feedback: "MATURIDADE COMERCIAL. Você limpou sua carteira.", reward: "🏆 Filtro de Posicionamento: Sua marca atrai valor, não esmolas.", lesson: "" },
      { id: "B", text: "Absorver o custo de 15% 'até ver se o mercado vai aceitar' e manter a tabela congelada.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -3.0, compliance: 0 }, feedback: "SANGRAMENTO VOLUNTÁRIO. Tirou dinheiro do bolso por medo.", reward: "", lesson: "O medo de perder uma venda é o que mais fecha empresas." },
      { id: "C", text: "Baixar o seu preço para R$ 70 na tentativa agressiva de quebrar o vizinho no volume.", xp: -50, isBest: false, impacts: { caixa: -8000, margem: -6.0, compliance: -10 }, feedback: "SUICÍDIO MATEMÁTICO. Vender volume com margem negativa.", reward: "", lesson: "Volume não conserta precificação podre." }
    ]
  },
  {
    id: "q_rh_01", tier: 1, sector: "Gestão de Pessoas", title: "O Custo Oculto da Pena",
    theory: "Empresa não é ONG e CNPJ tem DRE, não coração. Manter um funcionário incompetente porque 'precisa do emprego' destrói o moral dos bons que carregam o peso.",
    context: "Um atendente, amigo da família, chega atrasado dia sim, dia não. Hoje, por desorganização dele, um pedido grande foi enviado errado e o cliente cancelou R$ 3.000.",
    character: "O Clima Organizacional",
    consultoriaHint: "Pessoas boas de coração, mas ruins de execução, quebram empresas por dentro. Demita rápido. O respeito é liberar para o mercado.",
    options: [
      { id: "A", text: "Desligar hoje. Pagar rescisão, assumir a perda e contratar alguém focado em performance.", xp: 35, isBest: true, impacts: { caixa: -1500, margem: 1.5, compliance: 15 }, feedback: "POSTURA DE LÍDER. Cortou o membro infeccionado.", reward: "🏆 Cultura de Performance: O amadorismo não tem mais espaço.", lesson: "" },
      { id: "B", text: "Dar uma bronca severa, mas manter na equipe porque 'demitir agora custa caro em rescisão'.", xp: -10, isBest: false, impacts: { caixa: -1000, margem: -1.0, compliance: -5 }, feedback: "COVARDIA FINANCEIRA. O erro dele é mais caro que a rescisão.", reward: "", lesson: "O problema ignorado é o teto do seu crescimento." },
      { id: "C", text: "Descontar os R$ 3.000 do salário dele no fim do mês como punição.", xp: -45, isBest: false, impacts: { caixa: 1000, margem: -2.0, compliance: -30 }, feedback: "PASSIVO TRABALHISTA. Punição ilegal que vai render processo.", reward: "", lesson: "Justiça não se faz com as próprias mãos no RH." }
    ]
  },
  {
    id: "q_reserva_01", tier: 1, sector: "Reservas", title: "A Surpresa de Dezembro",
    theory: "Falta de provisão (13º, férias) transforma compromissos matemáticos anuais em surpresas fatais que sugam o lucro do fim do ano.",
    context: "Chegou o dia 20 de novembro. O 13º da equipe dá R$ 12.000 e você não provisionou 1/12 avos durante o ano. O caixa não tem esse valor solto.",
    character: "A Folha de Pagamento",
    consultoriaHint: "O erro foi no passado. Resolva o presente queimando algo parado (estoque) para fazer liquidez rápida. Não financie folha de pagamento.",
    options: [
      { id: "A", text: "Fazer um saldão agressivo do estoque antigo, levantar os R$ 12k à vista e criar a rotina de provisão para o ano que vem.", xp: 35, isBest: true, impacts: { caixa: 4000, margem: -1.0, compliance: 15 }, feedback: "APRENDIZADO NA DOR. Pagou a conta sem juros.", reward: "🏆 Provisão Ativada: Agora a empresa guarda 1/12 por mês.", lesson: "" },
      { id: "B", text: "Pegar um empréstimo rápido em 24x no banco para pagar o 13º.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -2.0, compliance: -5 }, feedback: "O CUSTO DO ERRO. Vai pagar o banco o ano todo.", reward: "", lesson: "Tomar dívida longa para despesa de curto prazo esmaga o caixa." },
      { id: "C", text: "Parcelar o 13º da equipe em 4 vezes e avisar no dia do pagamento.", xp: -45, isBest: false, impacts: { caixa: -5000, margem: -3.0, compliance: -30 }, feedback: "QUEBRA DE CONFIANÇA.", reward: "", lesson: "A equipe perde o respeito e o risco de denúncia trabalhista é imediato." }
    ]
  },

  // --- TIER 2: ORGANIZAÇÃO, PROCESSOS E ESTOQUE ---
  {
    id: "t2_estoque_01", tier: 2, sector: "Gestão de Estoque", title: "O Dinheiro Congelado na Prateleira",
    theory: "Estoque que não gira (Curva C) é dinheiro no ralo. O 'desconto de volume' que o fornecedor deu só vale a pena se você tem velocidade de venda.",
    context: "Você tem R$ 20.000 de capital imobilizado em mercadorias lentas. O aluguel vence amanhã (R$ 6.000) e o caixa tem R$ 1.500.",
    character: "O Boleto do Ponto",
    consultoriaHint: "Lucro no papel não paga boleto. Queime esse estoque a preço de custo hoje. Converta pó em dinheiro líquido.",
    options: [
      { id: "A", text: "Rodar 'Queima de Estoque' pelo WhatsApp a preço de custo (zero lucro) para levantar R$ 6.000 hoje.", xp: 35, isBest: true, impacts: { caixa: 7000, margem: -1.0, compliance: 10 }, feedback: "DOR DA APRENDIZAGEM. Engoliu o ego e salvou o aluguel.", reward: "🏆 Oxigênio de Caixa: Você dominou a arte de liquidar ativos.", lesson: "" },
      { id: "B", text: "Manter o preço cheio, torcer para o cliente aparecer e pagar o aluguel usando cheque especial.", xp: -15, isBest: false, impacts: { caixa: -2500, margem: -1.5, compliance: -5 }, feedback: "ILUSÃO CONTÁBIL. Trocou problema por dívida a 8% a.m.", reward: "", lesson: "A esperança não é estratégia de negócios." },
      { id: "C", text: "Comprar mais mercadorias no boleto para criar um combo e 'desovar' o estoque velho.", xp: -40, isBest: false, impacts: { caixa: -12000, margem: -4.0, compliance: -15 }, feedback: "O ABISMO. Tentou curar envenenamento com mais veneno.", reward: "", lesson: "Não se resolve falta de caixa gerando novos passivos." }
    ]
  },
  {
    id: "t2_inadimp_01", tier: 2, sector: "Inadimplência", title: "O Fiado do 'Parceiro' Fiel",
    theory: "O medo de cobrar o 'cliente parceiro' destrói o capital de giro. Se ele compra muito, mas nunca paga no prazo, ele te usa como linha de crédito gratuita.",
    context: "Um cliente antigo deve R$ 9.000 há 40 dias. Hoje enviou mensagem pedindo uma remessa urgente de R$ 5.000.",
    character: "O Calote Disfarçado",
    consultoriaHint: "Trave a esteira. Passivo não é cliente. Não existe venda nova com título antigo em aberto.",
    options: [
      { id: "A", text: "Travar: 'Parceiro, a liberação de crédito para nova remessa exige a baixa do título anterior'.", xp: 35, isBest: true, impacts: { caixa: 6000, margem: 1.0, compliance: 15 }, feedback: "POSTURA EXECUTIVA. Cortou a sangria e expôs o blefe.", reward: "🏆 A Régua Implacável: Tolerância zero estabelecida.", lesson: "" },
      { id: "B", text: "Entregar e pedir 'pelo amor de Deus' para depositar uma parte semana que vem.", xp: -15, isBest: false, impacts: { caixa: -4000, margem: -1.5, compliance: -10 }, feedback: "SUBMISSÃO TÁTICA. Validou que não há regras na empresa.", reward: "", lesson: "Quem tem pena do devedor, acorda devendo." },
      { id: "C", text: "Entregar e descontar uma duplicata no banco para cobrir o buraco de R$ 9.000.", xp: -45, isBest: false, impacts: { caixa: -9000, margem: -4.0, compliance: -20 }, feedback: "CAMINHO DA RUÍNA. Transferiu a dívida para o seu nome.", reward: "", lesson: "O banco nunca esquece de cobrar. Seu cliente, sim." }
    ]
  },
  {
    id: "t2_processos_01", tier: 2, sector: "Processos", title: "A Falsa Automação",
    theory: "Software não organiza bagunça, digitaliza a bagunça. Gastar em ERPs complexos sem processo é ilusão de gestão.",
    context: "Paga R$ 900/mês em ERP. Há 3 meses a equipe só anota vendas num caderno por achar o sistema 'difícil na pressa'.",
    character: "O Custo Inútil",
    consultoriaHint: "Processo antes da ferramenta. Volte pro básico, faça a equipe registrar tudo. Só evolua a ferramenta quando o hábito existir.",
    options: [
      { id: "A", text: "Cancelar ERP premium, usar versão básica e treinar exaustivamente: sem lançamento, sem comissão.", xp: 30, isBest: true, impacts: { caixa: 1500, margem: 1.0, compliance: 10 }, feedback: "RACIONALIDADE DIRETA. Alinhou os incentivos.", reward: "🏆 Gestão à Vista", lesson: "" },
      { id: "B", text: "Manter pagando 'para não perder histórico' e esperar a equipe se acostumar.", xp: -10, isBest: false, impacts: { caixa: -900, margem: -0.5, compliance: -5 }, feedback: "DESPERDÍCIO PASSIVO.", reward: "", lesson: "Omissão de gestão custa caro." },
      { id: "C", text: "Abolir o sistema, ficar só no caderno para não estressar a equipe.", xp: -35, isBest: false, impacts: { caixa: -2500, margem: -1.0, compliance: -15 }, feedback: "O RETROCESSO. Aceitou a cegueira financeira.", reward: "", lesson: "Empresa sem dados é navio sem radar." }
    ]
  },
  {
    id: "t2_mkt_01", tier: 2, sector: "Marketing", title: "A Métrica de Vaidade",
    theory: "Curtidas e Seguidores não pagam DARF. Focar em branding antes de ter uma máquina de vendas (ROAS) é falir sendo famoso.",
    context: "Sua agência comemora que seu post teve 5.000 likes. Você gastou R$ 2.000 em impulsionamento, mas o caixa registrou apenas 3 vendas.",
    character: "A Agência de Ego",
    consultoriaHint: "Corte o topo de funil vazio. Tráfego pago para PME tem que ter CTA direto pro WhatsApp e focar em fundo de funil (conversão).",
    options: [
      { id: "A", text: "Trocar a meta da agência: pausar campanhas de 'alcance' e focar 100% em campanhas de mensagens para o WhatsApp (Lead).", xp: 35, isBest: true, impacts: { caixa: 2000, margem: 1.5, compliance: 10 }, feedback: "FOCO NO CAIXA. Conversão virou a métrica rainha.", reward: "🏆 Máquina de Leads Ativada", lesson: "" },
      { id: "B", text: "Comemorar os likes achando que 'a marca está ficando forte para o longo prazo'.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: 0 }, feedback: "CEGUEIRA DE MARCA.", reward: "", lesson: "Até chegar o 'longo prazo', seu caixa quebra." },
      { id: "C", text: "Dobrar o orçamento de alcance para virar referência na região.", xp: -40, isBest: false, impacts: { caixa: -4000, margem: -3.0, compliance: -5 }, feedback: "QUEIMA ACELERADA. Falindo de forma muito popular.", reward: "", lesson: "Popularidade sem conversão é caridade pro Mark Zuckerberg." }
    ]
  },
  {
    id: "t2_tesoura_01", tier: 2, sector: "Fluxo de Caixa", title: "O Efeito Tesoura",
    theory: "Onde a empresa que mais vende quebra. Se seu Prazo de Recebimento (vender em 10x) é maior que o Prazo de Pagamento (fornecedor 30d), crescer drena liquidez.",
    context: "Mês histórico: R$ 60k vendidos em 6x s/ juros. Mas a fatura do estoque novo chega amanhã: R$ 25.000. Caixa negativo.",
    character: "O Paradoxo do Crescimento",
    consultoriaHint: "Inverta o ciclo. Encurte os prazos do cliente oferecendo vantagens à vista, e negocie alongamento com fornecedores.",
    options: [
      { id: "A", text: "Criar 'Desconto Assoalho' PIX, limitar vendas a 3x e pedir carência ao fornecedor este mês.", xp: 35, isBest: true, impacts: { caixa: 8000, margem: 1.0, compliance: 10 }, feedback: "CONTROLE DE ROTAÇÃO. Freou vendas tóxicas e trouxe dinheiro rápido.", reward: "🏆 O Ciclo Positivo (Caixa Livre)", lesson: "" },
      { id: "B", text: "Pegar Capital de Giro no banco para cobrir o buraco do crescimento.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -3.0, compliance: -10 }, feedback: "ARMADILHA CLÁSSICA. Pagou juros porque vendeu muito.", reward: "", lesson: "Vender a prazo com dinheiro do banco é repassar juros." },
      { id: "C", text: "Deixar de pagar o fornecedor esperando os cartões caírem.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -2.0, compliance: -25 }, feedback: "QUEIMA DE CRÉDITO. Seu CNPJ negativou.", reward: "", lesson: "O crédito na praça é seu maior ativo." }
    ]
  },

  // --- TIER 3: GESTÃO DO TEMPO, ESCALA E CUSTOS ---
  {
    id: "t3_gargalo_01", tier: 3, sector: "Custo de Oportunidade", title: "A Prisão do 'Ninguém faz como eu'",
    theory: "O teto de crescimento da empresa é sua agenda. Dono que empacota pedido cobra R$ 300/hora para fazer serviço de R$ 15/hora. O medo de delegar trava o CNPJ.",
    context: "Sua receita empacou. A jornada é de 14h. O WhatsApp tem 50 mensagens não lidas porque você passou a tarde no balcão.",
    character: "O Teto de Vidro",
    consultoriaHint: "Assuma o Custo Fixo. Terceirize o básico. Sua energia livre será revertida em alianças e visão de lucro.",
    options: [
      { id: "A", text: "Contratar assistente. Aceitar que fará 80% bem, desenhar processo básico e focar em Vendas.", xp: 40, isBest: true, impacts: { caixa: -2500, margem: 3.5, compliance: 10 }, feedback: "CORAGEM DA ESCALA. O CEO voltou ao jogo.", reward: "🏆 Tempo de Dono: Você destravou sua agenda.", lesson: "" },
      { id: "B", text: "Contratar freelancer barato só para a noite, sem processo.", xp: -5, isBest: false, impacts: { caixa: -500, margem: 0.5, compliance: -5 }, feedback: "MEIA SOLUÇÃO. O gargalo diurno continua.", reward: "", lesson: "Mão de obra sem processo é refação pura." },
      { id: "C", text: "Continuar na mesma rotina e fechar a loja mais cedo pra dormir.", xp: -40, isBest: false, impacts: { caixa: -6000, margem: -4.0, compliance: -10 }, feedback: "SUICÍDIO LENTO. Você aceitou o limite máximo da empresa.", reward: "", lesson: "O orgulho de ser o 'peão' destrói o CNPJ." }
    ]
  },
  {
    id: "t3_refem_01", tier: 3, sector: "Gestão de Riscos (RH)", title: "O Sequestro da Operação",
    theory: "Dependência absoluta de um funcionário inverte o poder. Ele vira dono da empresa sem assumir riscos.",
    context: "Seu principal vendedor (50% da receita) pede 40% de aumento fixo hoje, ou vai pro concorrente.",
    character: "O Ultimato Interno",
    consultoriaHint: "Nunca negocie com reféns. Dê bônus variável para ganhar tempo, sugue os processos dele e contrate júniors.",
    options: [
      { id: "A", text: "Negar fixo, oferecer agressivo bônus meta. Documentar processos e iniciar seleção silenciosa.", xp: 40, isBest: true, impacts: { caixa: 2000, margem: 1.0, compliance: 20 }, feedback: "MANOBRA EXECUTIVA. Blindou o negócio e iniciou pulverização.", reward: "🏆 Empresa Despersonalizada", lesson: "" },
      { id: "B", text: "Conceder o aumento pelo pavor de perder receita.", xp: -25, isBest: false, impacts: { caixa: -4000, margem: -4.0, compliance: -15 }, feedback: "SEQUESTRO. Ele é o dono da empresa agora.", reward: "", lesson: "Quem cede ao terrorismo de um, perde o respeito dos outros." },
      { id: "C", text: "Demiti-lo aos gritos e tentar cobrir os clientes dele sozinho.", xp: -45, isBest: false, impacts: { caixa: -10000, margem: -5.0, compliance: -20 }, feedback: "BURRICE DO EGO. Rombo de 50% na receita.", reward: "", lesson: "Decisão emocional quebra caixa." }
    ]
  },
  {
    id: "t3_crise_01", tier: 3, sector: "Reputação", title: "A Crise Silenciosa (Google)",
    theory: "A conversão desaba silenciosamente se sua nota cai de 4.0 online. Reputação é Margem.",
    context: "Ex-funcionário criou fakes e abaixou sua nota no Google para 2.4. Vendas caíram 40%.",
    character: "O Algoritmo",
    consultoriaHint: "Controle danos. Peça suporte massivo aos clientes fiéis para avaliarem com 5 estrelas e soterrar o ataque.",
    options: [
      { id: "A", text: "Denunciar fakes ao Google e fazer campanha com clientes reais pedindo reviews urgentes.", xp: 35, isBest: true, impacts: { caixa: 2500, margem: 1.5, compliance: 15 }, feedback: "GESTÃO DE CRISE. A maturidade vence o troll.", reward: "🏆 Muralha Digital", lesson: "" },
      { id: "B", text: "Bater boca online xingando o autor das fakes.", xp: -20, isBest: false, impacts: { caixa: -3000, margem: -1.0, compliance: -10 }, feedback: "A LAMA. Potenciais clientes fugiram do barraco.", reward: "", lesson: "Não lute com um porco na lama." },
      { id: "C", text: "Deletar o perfil do Google Meu Negócio.", xp: -50, isBest: false, impacts: { caixa: -12000, margem: -4.0, compliance: -20 }, feedback: "APAGÃO COMERCIAL. Ninguém acha mais a empresa.", reward: "", lesson: "Sumir do mapa elimina as soluções." }
    ]
  },
  {
    id: "t3_inflacao_01", tier: 3, sector: "Custos", title: "A Cegueira do Custo Fixo",
    theory: "A inflação é como cupim. Se a sua tabela tem a mesma 'cara' há 2 anos, seu lucro virou pó.",
    context: "Lucro R$ 0 por 3 meses. Custos fixos subiram 18%. Você não reajustou a tabela.",
    character: "O Desgaste da Margem",
    consultoriaHint: "O preço é o único pilar que traz dinheiro pra dentro. Reajuste hoje. Perder venda ruim é melhor que empatar.",
    options: [
      { id: "A", text: "Reajustar 18% imediatamente, focar na excelência e aceitar perder clientes sensíveis a preço.", xp: 40, isBest: true, impacts: { caixa: 6000, margem: 3.5, compliance: 10 }, feedback: "CORAGEM DE ESCALA. Protegeu a entidade que alimenta todos.", reward: "🏆 Reposicionamento de Valor", lesson: "" },
      { id: "B", text: "Diminuir drasticamente a qualidade dos insumos para economizar os 18%.", xp: -25, isBest: false, impacts: { caixa: 0, margem: -2.0, compliance: -15 }, feedback: "DESTRUIÇÃO DA MARCA. Boca a boca negativo ativado.", reward: "", lesson: "O cliente jamais perdoa a queda de qualidade." },
      { id: "C", text: "Dobrar gastos em Ads para tentar empurrar volume e compensar a margem ruim.", xp: -45, isBest: false, impacts: { caixa: -15000, margem: -5.0, compliance: -10 }, feedback: "O VOO DO PATO. Escalar modelo que sangra é fatal.", reward: "", lesson: "Crescer dando prejuízo aproxima você do penhasco." }
    ]
  },
  {
    id: "t3_concorrencia_01", tier: 3, sector: "Competição", title: "O Sonegador Vizinho",
    theory: "Guerra de preços com quem não emite nota é lutar contra a matemática.",
    context: "Três concorrentes informais derrubaram o preço do mercado em 30%. Você é Simples Nacional 100% limpo.",
    character: "O Mercado Canibalizado",
    consultoriaHint: "Pivote. Saia do Oceano Vermelho. Foque em clientes B2B que exigem nota e valorizam garantia.",
    options: [
      { id: "A", text: "Mudar foco comercial para clientes corporativos (B2B) que exigem NF-e e pagam mais caro pela segurança.", xp: 40, isBest: true, impacts: { caixa: 12000, margem: 2.0, compliance: 20 }, feedback: "PIVÔ INTELIGENTE.", reward: "🏆 Oceano Azul (B2B Ativado)", lesson: "" },
      { id: "B", text: "Reclamar na internet sobre a 'concorrência desleal' para o público ter pena.", xp: -15, isBest: false, impacts: { caixa: -2000, margem: -1.0, compliance: 0 }, feedback: "CHORO PERDEDOR.", reward: "", lesson: "O cliente quer o problema dele resolvido, não o seu." },
      { id: "C", text: "Parar de emitir nota fiscal para conseguir competir de igual para igual.", xp: -50, isBest: false, impacts: { caixa: 20000, margem: -5.0, compliance: -50 }, feedback: "CRIME FISCAL.", reward: "", lesson: "Autuação estadual vai lacrar a sua porta." }
    ]
  },

  // --- TIER 4: ELITE, DIREÇÃO E B2B ---
  {
    id: "t4_tributos_01", tier: 4, sector: "Tributos", title: "A Trava do Simples Nacional",
    theory: "Congelar vendas por medo de estourar a faixa tributária é a receita certa para jogar na série B para sempre.",
    context: "Novembro. Faturamento em R$ 4.750.000,00. Três contratos grandes (600k) te jogarão no Lucro Presumido.",
    character: "O Teto da Receita",
    consultoriaHint: "Crescer dói. Desenquadre com honra, pague o imposto e construa um império.",
    options: [
      { id: "A", text: "Assinar contratos, avisar contador da migração para Lucro Presumido e reformular o Mark-up.", xp: 40, isBest: true, impacts: { caixa: 25000, margem: 1.5, compliance: 30 }, feedback: "A MUDANÇA DE SÉRIE. Levou lucro pra casa com segurança jurídica.", reward: "🏆 Elite Corporativa (Compliance)", lesson: "" },
      { id: "B", text: "Pedir aos clientes para faturarem no ano que vem para não estourar o limite.", xp: -20, isBest: false, impacts: { caixa: -15000, margem: -2.0, compliance: 0 }, feedback: "ESCASSEZ. O mercado corporativo não tem tempo para o seu medo.", reward: "", lesson: "O cliente sério não financia esquema tributário." },
      { id: "C", text: "Fechar contrato sem nota fiscal para maquiar a receita do teto.", xp: -50, isBest: false, impacts: { caixa: 30000, margem: -5.0, compliance: -60 }, feedback: "CRIME FISCAL. DIRF acusou fraude cruzada.", reward: "", lesson: "Sonegar B2B é atestado de óbito garantido." }
    ]
  },
  {
    id: "t4_ego_01", tier: 4, sector: "Gestão do Ego", title: "A Ilusão do Crescimento",
    theory: "Pico sazonal de 3 meses não é consolidação. Alavancar passivos usando fluxo recém-criado sufoca a empresa.",
    context: "Três meses de lucro recorde. R$ 60k livres. O banco oferece financiar uma SUV de R$ 300k no CNPJ.",
    character: "O Status Social",
    consultoriaHint: "Dinheiro livre recém-chegado vira Fundo de Guerra. SUV não vende para você, apenas tira liquidez da operação.",
    options: [
      { id: "A", text: "Declinar o banco e transferir 80% do lucro para CDI de Liquidez Diária como Reserva.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.0, compliance: 20 }, feedback: "O DIRETOR EXECUTIVO. Estocou feno pro inverno.", reward: "🏆 Blindagem de Capital", lesson: "" },
      { id: "B", text: "Fazer uma reforma luxuosa na loja inteira à vista, zerando o caixa livre.", xp: -25, isBest: false, impacts: { caixa: -60000, margem: 0, compliance: -10 }, feedback: "BELEZA VULNERÁVEL. Qualquer tropeço mês que vem atrasa a folha.", reward: "", lesson: "Porcelanato não paga boleto." },
      { id: "C", text: "Assinar a SUV de luxo assumindo parcelas fixas altas no CNPJ.", xp: -50, isBest: false, impacts: { caixa: -60000, margem: -6.0, compliance: -25 }, feedback: "O CANCRO NO FLUXO. Custo fixo desnecessário e pesado.", reward: "", lesson: "Vaidade asfixiou o pulmão do negócio." }
    ]
  },
  {
    id: "t4_sucessao_01", tier: 4, sector: "Governança", title: "A Paralisia do Rei",
    theory: "O valor da empresa é como ela roda sem o dono. Se a operação para sem sua digital no banco, você é escravo.",
    context: "Você viaja para o exterior. Sem sinal. Dia 5 chegou. Sem sua digital, 15 funcionários ficarão sem salário.",
    character: "O Processo de Alçada",
    consultoriaHint: "Descentralize com segurança. Crie limites de alçada bancária para gerentes + contador.",
    options: [
      { id: "A", text: "Prevenção ativada: Você havia estabelecido limites de Alçada no banco para os gerentes aprovarem a folha.", xp: 40, isBest: true, impacts: { caixa: 0, margem: 2.0, compliance: 30 }, feedback: "MATRIZ CULTURAL. A empresa sobrevive sem você presente.", reward: "🏆 Negócio Despersonalizado", lesson: "" },
      { id: "B", text: "Logar do avião pagando roaming caríssimo e atrasar aprovações gerando pânico interno.", xp: -15, isBest: false, impacts: { caixa: -500, margem: -1.0, compliance: -10 }, feedback: "O SALVADOR ESTRESSADO.", reward: "", lesson: "Microgerenciamento cobra juros e taquicardia." },
      { id: "C", text: "Deixar a senha Master no Post-it com a secretária e o Token solto na gaveta.", xp: -50, isBest: false, impacts: { caixa: -35000, margem: -5.0, compliance: -50 }, feedback: "ROLETA RUSSA. Falha gravíssima de compliance.", reward: "", lesson: "A ruína mede 6 dígitos de senha num papel." }
    ]
  },
  {
    id: "t4_dividendos_01", tier: 4, sector: "Lucratividade", title: "A Distribuição Selvagem",
    theory: "Lucro é ficção sem gestão. Extrair todo o lucro no ano bom impede a expansão e o Fundo de Guerra do ano seguinte.",
    context: "Lucro líquido do ano: R$ 250.000 limpos. O sócio exige sacar os 100% amanhã para 'colher frutos'.",
    character: "A Divisão de Dividendos",
    consultoriaHint: "Negócios geniais seguem 30/70. 30% pros sócios, 70% travado no caixa da empresa para reinvestimento e proteção.",
    options: [
      { id: "A", text: "Bater o pé no 30/70. Distribuir 30% e alocar 70% na holding da empresa para expansão livre de bancos.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 1.5, compliance: 20 }, feedback: "EQUITY. O CNPJ virou usina geradora de si mesmo.", reward: "🏆 Máquina de Capital", lesson: "" },
      { id: "B", text: "Ceder ao sócio e distribuir os 100%.", xp: -30, isBest: false, impacts: { caixa: -250000, margem: -3.0, compliance: -15 }, feedback: "DESCAPITALIZAÇÃO. Sangraram o paciente saudável.", reward: "", lesson: "Fome de consumo do sócio quebra a empresa." },
      { id: "C", text: "Tentar aplicar o lucro todo em 'Day Trade/Cripto' pelo CNPJ para ganho rápido.", xp: -50, isBest: false, impacts: { caixa: -120000, margem: -5.0, compliance: -40 }, feedback: "DESVIO DE FINALIDADE. Perdeu metade na volatilidade.", reward: "", lesson: "A empresa não é cassino nem corretora." }
    ]
  },
  {
    id: "t4_b2b_01", tier: 4, sector: "B2B", title: "O Contrato 'Lobo'",
    theory: "Multinacionais usam pequenas empresas para se financiar. Exclusividade com margem zero é escravidão corporativa.",
    context: "Rede gigante exige exclusividade, mas impõe 120 dias para pagar e uma margem líquida de 5%.",
    character: "A Multinacional",
    consultoriaHint: "Não seja o banco do seu cliente. Embute juros de factoring no longo prazo ou recuse a exclusividade.",
    options: [
      { id: "A", text: "Recusar a exclusividade e aceitar prazo de 30 dias com volume menor para blindar a margem mínima.", xp: 40, isBest: true, impacts: { caixa: 15000, margem: 2.0, compliance: 20 }, feedback: "NEGOCIAÇÃO DE IGUAL.", reward: "🏆 Margem B2B Blindada", lesson: "" },
      { id: "B", text: "Aceitar a exclusividade e antecipar os 120 dias no banco.", xp: -25, isBest: false, impacts: { caixa: -10000, margem: -4.0, compliance: -10 }, feedback: "ARMADILHA. Você virou terceirizado que paga juros.", reward: "", lesson: "Você financiou a multinacional com seu crédito." },
      { id: "C", text: "Aceitar as regras abusivas só para colocar o logo do gigante no seu site.", xp: -50, isBest: false, impacts: { caixa: -30000, margem: -6.0, compliance: -20 }, feedback: "DESTRUIÇÃO TÁTICA.", reward: "", lesson: "Faturou 1 milhão e faliu por falta de liquidez." }
    ]
  }
];