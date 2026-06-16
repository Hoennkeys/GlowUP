/** Registro central de clientes do portal — liga auth, leads, propostas e faturas. */
export type ClientRecord = {
  clientId: string;
  tenantId: string;
  nome: string;
  empresa: string;
  email: string;
  cnpj: string;
};

export const CLIENT_REGISTRY: ClientRecord[] = [
  {
    clientId: "client-001",
    tenantId: "tenant-demo",
    nome: "João Cliente",
    empresa: "João Cliente ME",
    email: "cliente@demo.com",
    cnpj: "12.345.678/0001-90",
  },
  {
    clientId: "client-acme-001",
    tenantId: "tenant-acme",
    nome: "Ana Acme",
    empresa: "Acme Indústria",
    email: "cliente@acme.com",
    cnpj: "98.765.432/0001-10",
  },
];

export function findClientById(clientId: string): ClientRecord | undefined {
  return CLIENT_REGISTRY.find((c) => c.clientId === clientId);
}

export function resolveClientId(input: {
  tenantId: string;
  cliente: string;
  email?: string;
  cnpj?: string;
}): string {
  const normalizedCliente = input.cliente.trim().toLowerCase();
  const normalizedEmail = input.email?.trim().toLowerCase();

  const match = CLIENT_REGISTRY.find((c) => {
    if (c.tenantId !== input.tenantId) return false;
    if (normalizedEmail && c.email.toLowerCase() === normalizedEmail) return true;
    if (input.cnpj && c.cnpj === input.cnpj) return true;
    if (c.nome.toLowerCase() === normalizedCliente) return true;
    if (c.empresa.toLowerCase() === normalizedCliente) return true;
    if (normalizedCliente.includes(c.nome.toLowerCase())) return true;
    return false;
  });

  return match?.clientId ?? "";
}

export function clientDisplayName(clientId: string): string {
  return findClientById(clientId)?.nome ?? clientId;
}
