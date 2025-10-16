import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Attiva", variant: "default" },
  issued: { label: "Emessa", variant: "default" },
  quote_requested: { label: "Richiesta Quotazione", variant: "secondary" },
  in_quotation: { label: "In Quotazione", variant: "outline" },
  quoted: { label: "Quotata", variant: "secondary" },
  expired: { label: "Scaduta", variant: "destructive" },
  cancelled: { label: "Annullata", variant: "destructive" },
};

export default function Policies() {
  const { data, isLoading } = trpc.policies.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Polizze</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista Polizze</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numero Polizza</TableHead>
                    <TableHead>Prodotto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="text-right">Premio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">
                        {policy.policyNumber}
                      </TableCell>
                      <TableCell>{policy.productType.name}</TableCell>
                      <TableCell>{policy.clientName}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[policy.status]?.variant || "outline"}>
                          {statusMap[policy.status]?.label || policy.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {policy.premiumAmount
                          ? `€${parseFloat(policy.premiumAmount).toLocaleString("it-IT")}`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

