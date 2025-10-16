import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { data: stats, isLoading } = trpc.policies.stats.useQuery();
  const { data: claimsData } = trpc.claims.list.useQuery();
  
  const claimsCount = claimsData?.claims.length || 0;
  const openClaims = claimsData?.claims.filter(c => c.status === "reported" || c.status === "under_review").length || 0;

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
      {/* Navbar */}
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

      {/* Tabs Navigation */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Polizze Stats */}
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

          {/* Sinistri Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sinistri Totali
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {claimsCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sinistri Aperti
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {openClaims}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuzione Polizze per Stato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.by_status && Object.entries(stats.by_status).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {status.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prodotti Attivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-blue-600">7</div>
                <p className="text-sm text-gray-600 mt-2">Prodotti assicurativi disponibili</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasso Conversione</span>
                  <span className="font-semibold text-green-600">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tempo Medio Quotazione</span>
                  <span className="font-semibold">2.5 giorni</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Soddisfazione Cliente</span>
                  <span className="font-semibold text-green-600">4.8/5</span>
                </div>
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
      </main>
    </div>
  );
}

