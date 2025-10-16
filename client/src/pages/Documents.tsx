import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categoryMap: Record<string, { label: string; color: string }> = {
  policy: { label: "Polizza", color: "bg-blue-100 text-blue-800" },
  claim: { label: "Sinistro", color: "bg-red-100 text-red-800" },
  quote: { label: "Preventivo", color: "bg-green-100 text-green-800" },
  other: { label: "Altro", color: "bg-gray-100 text-gray-800" },
};

export default function Documents() {
  const { data: documents, isLoading } = trpc.documents.list.useQuery({});

  const [location] = useLocation();
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Prodotti", icon: "📦" },
    { path: "/policies", label: "Polizze", icon: "📋" },
    { path: "/claims", label: "Sinistri", icon: "⚠️" },
    { path: "/documents", label: "Documenti", icon: "📄" },
  ];

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
                  {item.icon} {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-900">Gestione Documenti</h2>
            <Button>+ Carica Documento</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Archivio Documenti</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : !documents || documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500 mb-4">Nessun documento caricato</p>
                  <Button>Carica il primo documento</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome File</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Dimensione</TableHead>
                      <TableHead>Data Caricamento</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>📎</span>
                            {doc.fileName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryMap[doc.category]?.color}`}>
                            {categoryMap[doc.category]?.label || doc.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          {doc.fileSize ? `${(parseInt(doc.fileSize) / 1024).toFixed(2)} KB` : "-"}
                        </TableCell>
                        <TableCell>
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("it-IT") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Scarica
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">💡 Funzionalità Upload Documenti</h3>
              <p className="text-sm text-gray-700">
                La funzionalità di upload documenti con drag & drop e integrazione S3 
                sarà implementata nel prossimo aggiornamento. Per ora puoi visualizzare 
                i documenti già caricati nel sistema.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

