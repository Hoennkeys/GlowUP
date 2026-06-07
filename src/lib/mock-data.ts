import type { Lead, Tarefa, EmailMsg, Conversa, Proposta, Usuario, Etapa } from "./types";

export const vendedoresMock: Usuario[] = [
  { id: "u1", nome: "Mariana Costa", email: "mariana@vendapro.com.br", papel: "Administrador", ativo: true },
  { id: "u2", nome: "Rafael Almeida", email: "rafael@vendapro.com.br", papel: "Vendedor", ativo: true },
  { id: "u3", nome: "Juliana Souza", email: "juliana@vendapro.com.br", papel: "Vendedor", ativo: true },
  { id: "u4", nome: "Pedro Henrique", email: "pedro@vendapro.com.br", papel: "Vendedor", ativo: false },
];

const hoje = new Date();
const diasAtras = (n: number) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const diasAFrente = (n: number) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const etapas: Etapa[] = [
  "Sem Contato",
  "Em Atendimento",
  "Proposta Enviada",
  "Ganho",
  "Perdido",
];

export const leadsMock: Lead[] = [
  {
    id: "l1", cliente: "Padaria São João", contato: "Marcos Silva", email: "marcos@padariasaojoao.com.br",
    telefone: "+55 11 98765-1122", valor: 12400, etapa: "Em Atendimento", prioridade: "Alta",
    responsavelId: "u1", criadoEm: diasAtras(3),
    timeline: [
      { tipo: "anotacao", em: diasAtras(3), texto: "Lead vindo do site." },
      { tipo: "ligacao", em: diasAtras(2), texto: "Ligação inicial — interessado em plano mensal." },
    ],
  },
  {
    id: "l2", cliente: "Auto Peças Brasil", contato: "Carla Mendes", email: "carla@autopecasbr.com.br",
    telefone: "+55 11 99821-3344", valor: 28700, etapa: "Proposta Enviada", prioridade: "Alta",
    responsavelId: "u2", criadoEm: diasAtras(7),
    timeline: [
      { tipo: "email", em: diasAtras(5), texto: "Enviada apresentação institucional." },
      { tipo: "email", em: diasAtras(1), texto: "Proposta comercial enviada." },
    ],
  },
  {
    id: "l3", cliente: "Construtora Horizonte", contato: "André Lopes", email: "andre@horizonte.com.br",
    telefone: "+55 21 99654-7788", valor: 84500, etapa: "Em Atendimento", prioridade: "Média",
    responsavelId: "u1", criadoEm: diasAtras(10),
    timeline: [{ tipo: "mensagem", em: diasAtras(9), texto: "Cliente solicitou portfólio." }],
  },
  {
    id: "l4", cliente: "Loja Verão", contato: "Patrícia Rocha", email: "patricia@lojaverao.com.br",
    telefone: "+55 11 98123-4455", valor: 9800, etapa: "Sem Contato", prioridade: "Baixa",
    responsavelId: "u3", criadoEm: diasAtras(1), timeline: [],
  },
  {
    id: "l5", cliente: "Tech Solutions BR", contato: "Eduardo Lima", email: "eduardo@techsolbr.com",
    telefone: "+55 11 97766-2200", valor: 156000, etapa: "Ganho", prioridade: "Alta",
    responsavelId: "u1", criadoEm: diasAtras(20),
    timeline: [{ tipo: "anotacao", em: diasAtras(2), texto: "Contrato assinado!" }],
  },
  {
    id: "l6", cliente: "Restaurante Sabor & Arte", contato: "Beatriz Nunes", email: "bia@saborearte.com.br",
    telefone: "+55 11 99887-1010", valor: 7200, etapa: "Perdido", prioridade: "Média",
    responsavelId: "u2", criadoEm: diasAtras(25),
    timeline: [{ tipo: "anotacao", em: diasAtras(4), texto: "Optou por concorrente." }],
  },
  {
    id: "l7", cliente: "Floricultura Bem-Me-Quer", contato: "Renata Dias", email: "renata@bemmequer.com.br",
    telefone: "+55 11 96543-2211", valor: 4300, etapa: "Sem Contato", prioridade: "Baixa",
    responsavelId: "u3", criadoEm: diasAtras(0), timeline: [],
  },
  {
    id: "l8", cliente: "Clínica Vida Plena", contato: "Dr. Felipe Tavares", email: "felipe@vidaplena.com.br",
    telefone: "+55 11 99001-7755", valor: 36900, etapa: "Em Atendimento", prioridade: "Alta",
    responsavelId: "u2", criadoEm: diasAtras(5),
    timeline: [{ tipo: "ligacao", em: diasAtras(4), texto: "Reunião de descoberta agendada." }],
  },
  {
    id: "l9", cliente: "Escola Saber Mais", contato: "Vanessa Prado", email: "vanessa@sabermais.com.br",
    telefone: "+55 11 98876-5544", valor: 22500, etapa: "Proposta Enviada", prioridade: "Média",
    responsavelId: "u1", criadoEm: diasAtras(12),
    timeline: [{ tipo: "email", em: diasAtras(2), texto: "Proposta enviada — aguardando retorno." }],
  },
  {
    id: "l10", cliente: "Hotel Mar Azul", contato: "Roberto Maia", email: "roberto@marazul.com.br",
    telefone: "+55 11 97654-9988", valor: 67000, etapa: "Ganho", prioridade: "Alta",
    responsavelId: "u2", criadoEm: diasAtras(45),
    timeline: [{ tipo: "anotacao", em: diasAtras(10), texto: "Renovação anual fechada." }],
  },
];

export const tarefasMock: Tarefa[] = [
  { id: "t1", titulo: "Ligar para cliente Marcos Silva", responsavelId: "u1", prazo: diasAFrente(0), prioridade: "Alta", concluida: false, leadId: "l1" },
  { id: "t2", titulo: "Enviar proposta para Loja Verão", responsavelId: "u3", prazo: diasAFrente(1), prioridade: "Média", concluida: false, leadId: "l4" },
  { id: "t3", titulo: "Reunião com Construtora Horizonte", responsavelId: "u1", prazo: diasAFrente(2), prioridade: "Alta", concluida: false, leadId: "l3" },
  { id: "t4", titulo: "Follow-up Auto Peças Brasil", responsavelId: "u2", prazo: diasAFrente(0), prioridade: "Alta", concluida: false, leadId: "l2" },
  { id: "t5", titulo: "Atualizar pipeline semanal", responsavelId: "u1", prazo: diasAtras(1), prioridade: "Baixa", concluida: true },
  { id: "t6", titulo: "Enviar contrato Tech Solutions BR", responsavelId: "u1", prazo: diasAtras(2), prioridade: "Alta", concluida: true, leadId: "l5" },
  { id: "t7", titulo: "Apresentação para Clínica Vida Plena", responsavelId: "u2", prazo: diasAFrente(3), prioridade: "Média", concluida: false, leadId: "l8" },
];

export const emailsMock: EmailMsg[] = [
  { id: "e1", de: "carla@autopecasbr.com.br", para: "mariana@vendapro.com.br", assunto: "Re: Proposta comercial", corpo: "Mariana, recebemos a proposta e vamos analisar internamente. Retorno até sexta.", em: diasAtras(0), pasta: "Caixa de Entrada", lida: false },
  { id: "e2", de: "andre@horizonte.com.br", para: "mariana@vendapro.com.br", assunto: "Solicitação de portfólio", corpo: "Olá, podemos receber o portfólio com cases similares ao nosso?", em: diasAtras(1), pasta: "Caixa de Entrada", lida: false },
  { id: "e3", de: "marcos@padariasaojoao.com.br", para: "mariana@vendapro.com.br", assunto: "Dúvidas sobre o plano", corpo: "Boa tarde! Gostaria de entender melhor as diferenças entre os planos.", em: diasAtras(2), pasta: "Caixa de Entrada", lida: true },
  { id: "e4", de: "mariana@vendapro.com.br", para: "carla@autopecasbr.com.br", assunto: "Proposta comercial — Auto Peças Brasil", corpo: "Olá Carla, segue em anexo a proposta conforme alinhamos.", em: diasAtras(3), pasta: "Enviados", lida: true },
  { id: "e5", de: "mariana@vendapro.com.br", para: "andre@horizonte.com.br", assunto: "Apresentação institucional", corpo: "André, segue nossa apresentação. Qualquer dúvida me chame.", em: diasAtras(6), pasta: "Enviados", lida: true },
  { id: "e6", de: "mariana@vendapro.com.br", para: "patricia@lojaverao.com.br", assunto: "Rascunho — Loja Verão", corpo: "Olá Patrícia, ...", em: diasAtras(0), pasta: "Rascunhos", lida: true },
];

export const conversasMock: Conversa[] = [
  {
    id: "c1", contatoNome: "Marcos Silva", contatoEmpresa: "Padaria São João", telefone: "+55 11 98765-1122",
    leadId: "l1", agenteId: "u1", naoLidas: 2,
    mensagens: [
      { id: "m1", autor: "cliente", texto: "Boa tarde, vi o anúncio de vocês.", em: diasAtras(0), lida: true },
      { id: "m2", autor: "agente", texto: "Olá Marcos! Tudo bem? Posso te ajudar com mais informações?", em: diasAtras(0), lida: true },
      { id: "m3", autor: "cliente", texto: "Sim! Quanto custa o plano mensal?", em: diasAtras(0), lida: false },
      { id: "m4", autor: "cliente", texto: "E tem desconto pra pagamento anual?", em: diasAtras(0), lida: false },
    ],
  },
  {
    id: "c2", contatoNome: "Carla Mendes", contatoEmpresa: "Auto Peças Brasil", telefone: "+55 11 99821-3344",
    leadId: "l2", agenteId: "u2", naoLidas: 0,
    mensagens: [
      { id: "m5", autor: "cliente", texto: "Recebi a proposta, obrigada!", em: diasAtras(1), lida: true },
      { id: "m6", autor: "agente", texto: "Maravilha Carla! Fico no aguardo do retorno.", em: diasAtras(1), lida: true },
    ],
  },
  {
    id: "c3", contatoNome: "Beatriz Nunes", contatoEmpresa: "Restaurante Sabor & Arte", telefone: "+55 11 99887-1010",
    leadId: undefined, agenteId: "u3", naoLidas: 1,
    mensagens: [
      { id: "m7", autor: "cliente", texto: "Oi, vocês atendem restaurantes pequenos?", em: diasAtras(0), lida: false },
    ],
  },
  {
    id: "c4", contatoNome: "Renata Dias", contatoEmpresa: "Floricultura Bem-Me-Quer", telefone: "+55 11 96543-2211",
    leadId: "l7", agenteId: "u3", naoLidas: 0,
    mensagens: [
      { id: "m8", autor: "agente", texto: "Olá Renata, segue o material que combinamos.", em: diasAtras(1), lida: true },
      { id: "m9", autor: "cliente", texto: "Recebi, obrigada!", em: diasAtras(1), lida: true },
    ],
  },
];

export const propostasMock: Proposta[] = [
  { id: "p1", numero: "PROP-2025-001", cliente: "Auto Peças Brasil", cnpj: "12.345.678/0001-90", valor: 28700, criadaEm: diasAtras(3), validade: diasAFrente(12), status: "Pendente", responsavelId: "u2", itens: [{ descricao: "Plano Pro Anual", qtd: 1, valorUnit: 28700 }], condicoes: "Pagamento em até 12x sem juros.", observacoes: "Inclui treinamento de equipe." },
  { id: "p2", numero: "PROP-2025-002", cliente: "Tech Solutions BR", cnpj: "23.456.789/0001-12", valor: 156000, criadaEm: diasAtras(20), validade: diasAFrente(0), status: "Aceita", responsavelId: "u1", itens: [{ descricao: "Plano Enterprise + Onboarding", qtd: 1, valorUnit: 156000 }], condicoes: "À vista com 10% de desconto.", observacoes: "" },
  { id: "p3", numero: "PROP-2025-003", cliente: "Hotel Mar Azul", cnpj: "34.567.890/0001-34", valor: 67000, criadaEm: diasAtras(45), validade: diasAtras(15), status: "Aceita", responsavelId: "u2", itens: [{ descricao: "Renovação anual", qtd: 1, valorUnit: 67000 }], condicoes: "12x sem juros.", observacoes: "" },
  { id: "p4", numero: "PROP-2025-004", cliente: "Restaurante Sabor & Arte", cnpj: "45.678.901/0001-56", valor: 7200, criadaEm: diasAtras(40), validade: diasAtras(10), status: "Vencida", responsavelId: "u2", itens: [{ descricao: "Plano Starter", qtd: 1, valorUnit: 7200 }], condicoes: "Boleto mensal.", observacoes: "" },
  { id: "p5", numero: "PROP-2025-005", cliente: "Escola Saber Mais", cnpj: "56.789.012/0001-78", valor: 22500, criadaEm: diasAtras(2), validade: diasAFrente(13), status: "Pendente", responsavelId: "u1", itens: [{ descricao: "Plano Pro Trimestral", qtd: 3, valorUnit: 7500 }], condicoes: "Pagamento trimestral.", observacoes: "" },
  { id: "p6", numero: "PROP-2025-006", cliente: "Clínica Vida Plena", cnpj: "67.890.123/0001-90", valor: 36900, criadaEm: diasAtras(6), validade: diasAFrente(9), status: "Pendente", responsavelId: "u2", itens: [{ descricao: "Plano Pro Anual", qtd: 1, valorUnit: 36900 }], condicoes: "10x sem juros.", observacoes: "" },
];

export const faturamentoMensalMock = [
  { mes: "Jan", faturamento: 78000 },
  { mes: "Fev", faturamento: 92000 },
  { mes: "Mar", faturamento: 110500 },
  { mes: "Abr", faturamento: 134200 },
  { mes: "Mai", faturamento: 121800 },
  { mes: "Jun", faturamento: 168400 },
];

export const atividadesRecentesMock = [
  { id: "a1", em: diasAtras(0), texto: "Mariana fechou negócio com Tech Solutions BR — R$ 156.000", vendedorId: "u1" },
  { id: "a2", em: diasAtras(0), texto: "Rafael enviou proposta para Auto Peças Brasil", vendedorId: "u2" },
  { id: "a3", em: diasAtras(1), texto: "Juliana criou novo lead: Floricultura Bem-Me-Quer", vendedorId: "u3" },
  { id: "a4", em: diasAtras(1), texto: "Mariana agendou reunião com Construtora Horizonte", vendedorId: "u1" },
  { id: "a5", em: diasAtras(2), texto: "Rafael moveu Clínica Vida Plena para Em Atendimento", vendedorId: "u2" },
];