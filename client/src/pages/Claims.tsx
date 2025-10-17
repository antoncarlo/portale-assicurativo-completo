import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { getNavItemsForRole } from "@/components/Navigation";
import { useAuth } from "@/_core/hooks/useAuth";
import { Notifications } from "@/components/Notifications";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { exportToExcel } from "@/utils/export";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  reported: { label: "Segnalato", variant: "secondary" },
  under_review: { label: "In Revisione", variant: "outline" },
  approved: { label: "Approvato", variant: "default" },
  rejected: { label: "Rifiutato", variant: "destructive" },
  paid: { label: "Pagato", variant: "default" },
  closed: { label: "Chiuso", variant: "secondary" },
};

export default function Claims() {
  const { user: currentUser } = useAuth();
  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");
  const { data, isLoading } = trpc.claims.list.useQuery();

  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Sinistri" />
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
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-900">Gestione Sinistri</h2>
            <Link href="/claims/new">
              <Button>+ Nuovo Sinistro</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista Sinistri</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : data?.claims.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nessun sinistro registrato</p>
                  <Link href="/claims/new">
                    <Button>Registra il primo sinistro</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero Sinistro</TableHead>
                      <TableHead>Polizza</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrizione</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Importo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.claims.map((claim) => (
                      <TableRow 
                        key={claim.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setLocation(`/claims/${claim.id}`)}
                      >
                        <TableCell className="font-medium">
                          {claim.claimNumber}
                        </TableCell>
                        <TableCell>
                          {claim.policy?.policyNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {new Date(claim.claimDate).toLocaleDateString("it-IT")}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {claim.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusMap[claim.status]?.variant || "outline"}>
                            {statusMap[claim.status]?.label || claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {claim.claimAmount
                            ? `€${parseFloat(claim.claimAmount).toLocaleString("it-IT")}`
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

