import { GlowBadge, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreator } from "../store/creator-context";

const STATUS_LABEL = {
  prospect: "Prospect",
  active: "Ativo",
  inactive: "Inativo",
} as const;

export function SponsorsPage() {
  const { sponsors } = useCreator();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="glowup-heading">Sponsors</h1>
        <p className="glowup-subheading">
          Marcas patrocinadoras e budgets disponíveis para campanhas.
        </p>
      </div>

      <GlowCard>
        <GlowCardHeader>
          <h2 className="font-semibold text-base">Marcas patrocinadoras</h2>
        </GlowCardHeader>
        <GlowCardContent>
          {sponsors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum sponsor cadastrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Indústria</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.industry}</TableCell>
                    <TableCell>{s.budgetRange}</TableCell>
                    <TableCell className="text-muted-foreground">{s.contactEmail}</TableCell>
                    <TableCell>
                      <GlowBadge variant="outline">{STATUS_LABEL[s.status]}</GlowBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
