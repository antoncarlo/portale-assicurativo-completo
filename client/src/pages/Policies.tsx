import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
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

  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Prodotti", icon: "📦" },
    { path: "/policies", label: "Polizze", icon: "📋" },
    { path: "/claims", label: "Sinistri", icon: "⚠️" },
    { path: "/questionari", label: "Questionari", icon: "📄" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
            <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Portale Broker</h1>
                <p className="text-blue-200 text-xs">Gestione Polizze Assicurative</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">Admin Broker</p>
                <p className="text-blue-200 text-xs">admin@broker.it</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                AB
              </div>
            </div>
          </div>
        </div>
      </nav>
            <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                    location === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg mr-2">{item.icon}</span>
                  {item.label}
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

