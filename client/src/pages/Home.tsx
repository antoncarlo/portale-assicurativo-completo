import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: stats, isLoading } = trpc.policies.stats.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Totale Polizze
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {isLoading ? "..." : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Polizze Attive
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {isLoading ? "..." : stats?.active || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                In Quotazione
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {isLoading ? "..." : stats?.by_status?.in_quotation || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Premi Totali
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                €{isLoading ? "..." : (stats?.total_premium || 0).toLocaleString("it-IT")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Benvenuto nel Portale Assicurativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Questo è il tuo portale completo per la gestione delle polizze assicurative.
            </p>
            <div>
              <p className="font-semibold mb-3">Funzionalità principali:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✅</span>
                  <span><strong>Dashboard:</strong> Visualizza statistiche e KPI in tempo reale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✅</span>
                  <span><strong>Prodotti:</strong> 7 prodotti assicurativi specializzati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✅</span>
                  <span><strong>Polizze:</strong> Gestione completa del ciclo di vita</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✅</span>
                  <span><strong>Questionari:</strong> 315+ campi dinamici configurabili</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✅</span>
                  <span><strong>Gestione Documenti:</strong> Upload e archiviazione</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

