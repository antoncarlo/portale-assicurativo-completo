import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <DashboardLayout>
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
              <Card
                key={product.id}
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

