/**
 * Minimal demo snapshot for migration testing — avoids circular imports from mock-data.
 */
import type { TenantCrmSnapshot } from "../../src/lib/db/types";

export const DEMO_SNAPSHOT: TenantCrmSnapshot = {
  leads: [
    {
      id: "lead-demo-jc-ativo",
      cliente: "João Cliente ME",
      contato: "João Cliente",
      email: "cliente@demo.com",
      telefone: "(11) 98765-4321",
      valor: 15000,
      etapa: "Proposta Enviada",
      prioridade: "Alta",
      responsavelId: "user-operacional",
      criadoEm: "2026-05-01T11:00:00.000Z",
      clientId: "client-001",
      timeline: [],
    },
    {
      id: "lead-demo-sem-contato",
      cliente: "Prospect Novo",
      contato: "Maria Prospect",
      email: "maria@prospect.com",
      telefone: "(11) 90000-0000",
      valor: 5000,
      etapa: "Sem Contato",
      prioridade: "Baixa",
      responsavelId: "user-operacional",
      criadoEm: "2026-06-01T09:00:00.000Z",
      timeline: [],
    },
  ],
  tarefas: [
    {
      id: "tarefa-demo-001",
      titulo: "Revisar proposta com João",
      responsavelId: "user-operacional",
      prazo: "2026-06-18T17:00:00.000Z",
      prioridade: "Alta",
      concluida: false,
      leadId: "lead-demo-jc-ativo",
    },
  ],
  emails: [],
  conversas: [],
  propostas: [
    {
      id: "prop-demo-001",
      tenantId: "tenant-demo",
      clientId: "client-001",
      numero: "PROP-2026-002",
      cliente: "João Cliente ME",
      cnpj: "12.345.678/0001-90",
      valor: 8500,
      criadaEm: "2026-05-15T14:00:00.000Z",
      validade: "2026-07-01",
      status: "Aceita",
      responsavelId: "user-operacional",
      itens: [{ descricao: "Implementação CRM", qtd: 1, valorUnit: 8500 }],
      condicoes: "Pagamento em 2x",
      observacoes: "",
      leadId: "lead-demo-jc-ativo",
    },
  ],
  chamados: [],
  faturas: [
    {
      id: "fatura-demo-001",
      tenantId: "tenant-demo",
      clientId: "client-001",
      numero: "FAT-2026-001",
      descricao: "Parcela 1 — Implementação CRM",
      valor: 4250,
      vencimento: "2026-06-15",
      status: "Paga",
      emitidaEm: "2026-05-20T10:00:00.000Z",
    },
  ],
  pipelineItems: [],
  usuarios: [],
};
