# Plano: CRM de Vendas SaaS (PT-BR) — Refinado

SaaS de CRM completo em PT-BR, frontend-only, com dados mock realistas, Dark/Light mode e foco em demonstração comercial. Inclui agora os refinamentos de alto valor para apresentações.

## Stack e fundações

- TanStack Start + React + Tailwind v4 + shadcn/ui (já no projeto)
- `@dnd-kit/core` — Kanban arrastável
- `recharts` — gráficos do Painel
- `date-fns` (locale `pt-BR`) — datas
- `jspdf` + `jspdf-autotable` — PDF de propostas
- `next-themes` — Dark/Light
- Estado global de demo via Context + `localStorage` (persistência entre navegações e refresh)

## Design system

- Tokens `oklch` em `src/styles.css` (`:root` e `.dark`)
- Paleta: primária azul-índigo, sucesso verde (Ganho/Aceita), vermelho (Perdido/Vencida), âmbar (Pendente)
- Tipografia Inter via `<link>` no `__root.tsx`
- Shell com `SidebarProvider` (shadcn sidebar) colapsável + header com busca, toggle de tema e avatar

## Estrutura de rotas

```
src/routes/
  __root.tsx          -> shell Sidebar + Header + Outlet
  index.tsx           -> redireciona para /painel
  painel.tsx          -> Dashboard
  funil.tsx           -> Kanban
  chats.tsx           -> Central de Chats
  emails.tsx          -> Central de E-mails
  agenda.tsx          -> Agenda e Tarefas
  propostas.tsx       -> Gerador de Propostas
  configuracoes.tsx   -> Configurações e Canais
```

Sidebar: Painel · Funil de Vendas · Chats · E-mails · Agenda · Propostas · Configurações.

## Estado e persistência (demo)

`src/lib/crm-store.tsx` — Provider único exposto em `__root.tsx` que mantém:
- `leads`, `tarefas`, `emails`, `conversas`, `propostas`, `usuarios`, `filtroVendedor`
- Hidrata de `localStorage` no mount; salva via `useEffect` em qualquer mudança
- Hooks: `useCrm()` e seletores derivados (`useLeadsPorEtapa`, `useMetricasPainel(vendedorId)`)
- Garante que mover cards do Kanban, marcar tarefas, enviar e-mails, criar propostas e oportunidades persistam suavemente entre módulos

## Módulos

### 1. Painel (Dashboard) — com filtro por vendedor
- **Top bar de filtros**: `Select` "Vendedor" com opções `Todos`, `Mariana Costa`, `Rafael Almeida`, `Juliana Souza`, `Pedro Henrique`. Seleção controlada pelo store (`filtroVendedor`) — todos os KPIs e gráficos reagem.
- KPIs: Faturamento do Mês (R$), Valor Total do Pipeline, Taxa de Conversão, Meta da Equipe (progresso)
- Gráficos (recharts):
  - Linha: faturamento últimos 6 meses
  - Barras: vendas por vendedor (destaca o selecionado)
  - Pizza/donut: leads por etapa do funil
- Feed de "Atividades Recentes" filtrado pelo vendedor
- Formatação `Intl.NumberFormat('pt-BR', { currency: 'BRL' })`

### 2. Funil de Vendas (Kanban)
- 5 colunas exatas: **Sem Contato · Em Atendimento · Proposta Enviada · Ganho · Perdido**
- Drag-and-drop entre colunas e reordenação via `@dnd-kit`
- Card: cliente, valor R$, data de criação (`dd/MM/yyyy`), tag de prioridade (Alta/Média/Baixa)
- Clique → `Dialog` com perfil do lead, responsável, valor, etapa e **timeline unificada** (ligações, e-mails, mensagens, anotações)
- Botão "Novo Lead"
- Movimentações persistidas no store

### 3. Central de Chats (simulação WhatsApp) — com ações de conversão
- Layout 3 colunas: lista de conversas | thread de mensagens | **painel do contato**
- Mensagens em bolhas estilo WhatsApp, horário, status de leitura, campo de envio
- Badge multi-agente (vendedor responsável)
- **Painel do contato (3ª coluna)** com:
  - Dados do contato e tags
  - **Botão "Criar Oportunidade no Funil"** → abre confirmação rápida (etapa inicial + valor estimado) e insere novo lead em "Sem Contato" no Kanban (store compartilhado)
  - **Botão "Salvar Histórico no CRM"** → anexa as mensagens da conversa atual à timeline do lead vinculado (ou cria um novo se não houver), com toast "Histórico salvo no CRM"

### 4. Central de E-mails — com modelos prontos
- Layout estilo Gmail/Outlook: pastas (Caixa de Entrada, Enviados, Rascunhos, Lixeira) | lista | leitor
- Modal **"Escrever"** com campos Para, Assunto, Corpo
- **Dropdown "Modelos de E-mail"** dentro do modal (`Select`), com auto-preenchimento de Assunto + Corpo:
  - Apresentação
  - Follow-up
  - Envio de Proposta
  - Agradecimento pós-venda
  - Reengajamento de lead frio
- Modelos em `src/lib/email-templates.ts` (texto PT-BR com placeholders {{cliente}}, {{vendedor}})
- Enviar move o e-mail para "Enviados" no store

### 5. Agenda e Tarefas
- Abas: **Tarefas** e **Calendário**
- Tarefas: lista com checkbox Pendente/Concluída, prioridade, prazo, lead vinculado (ex.: "Ligar para cliente Marcos Silva", "Enviar proposta para Loja Verão")
- Calendário mensal com eventos (reuniões, ligações)
- Status persistido no store

### 6. Gerador de Propostas — com tabela de propostas recentes
- Formulário: cliente, CNPJ, itens (descrição, qtd, valor unit.), validade, condições de pagamento, observações
- Pré-visualização ao vivo
- Ações: **"Gerar link compartilhável"** (copia URL mock) e **"Baixar PDF"** (jsPDF: logo, totais em R$, rodapé)
- Ao salvar, a proposta entra no store
- **Tabela "Propostas Recentes"** abaixo do formulário (`Table` shadcn) com colunas: Nº · Cliente · Valor · Data · **Status** (badge: `Pendente` âmbar, `Aceita` verde, `Vencida` vermelho) · Ações (ver / baixar / mudar status)
- Mock inicial com 6–8 propostas de empresas brasileiras

### 7. Configurações e Canais
- Abas: **Usuários e Permissões · WhatsApp · E-mail (SMTP/IMAP) · Geral**
- Usuários: tabela com nome, e-mail, papel (**Administrador** / **Vendedor**), status; adicionar/editar
- WhatsApp: card com **QR Code simulado** (SVG) + instruções
- E-mail: campos SMTP (host, porta, usuário, senha, SSL) e IMAP equivalentes
- Geral: nome da empresa, fuso horário, moeda

## Dados mock (PT-BR realista)

`src/lib/mock-data.ts` — empresas (Padaria São João, Auto Peças Brasil, Construtora Horizonte, Loja Verão, Tech Solutions BR…), vendedores (Mariana Costa, Rafael Almeida, Juliana Souza, Pedro Henrique), telefones (+55 11 9xxxx-xxxx), valores em R$, datas recentes. Tudo cruzando entre Kanban, Chats, E-mails, Agenda e Propostas.

## Tema Dark/Light

- Toggle sol/lua no header via `next-themes`
- Tokens semânticos em todos os componentes (sem cores hardcoded)
- Verificação visual em todas as telas

## Entrega

App navegável, polido, com dados que parecem reais e interações que persistem entre módulos — pronto para pitch a clientes brasileiros.
