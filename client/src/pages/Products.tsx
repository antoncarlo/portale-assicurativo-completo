import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

const iconMap: Record<string, string> = {
  Construction: "🏗️",
  SolarPower: "☀️",
  Engineering: "⚙️",
  Store: "🏪",
  Pets: "🐾",
  Home: "🏠",
  Gavel: "⚖️",
};

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

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
          <h2 className="text-3xl font-semibold text-gray-900">Prodotti Assicurativi</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}/new`}>
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                    <span className="text-2xl">
                      {iconMap[product.icon || ""] || "📦"}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}

