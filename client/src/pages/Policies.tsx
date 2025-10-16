import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getNavItemsForRole } from "@/components/Navigation";
import { useAuth } from "@/_core/hooks/useAuth";
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
  const { user: currentUser } = useAuth();
  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");
  const { data, isLoading } = trpc.policies.list.useQuery();

  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-blue-600">
                🏢 Portale Assicurativo - Demo
              </span>
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    location === item.path
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
}

