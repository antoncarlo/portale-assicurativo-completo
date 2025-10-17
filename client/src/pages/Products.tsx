import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getNavItemsForRole } from "@/components/Navigation";
import { useAuth } from "@/_core/hooks/useAuth";
import { Notifications } from "@/components/Notifications";
import Header from "@/components/Header";
import { productIconsMap, productColorsMap } from "@/utils/productIcons";

export default function Products() {
  const { user: currentUser } = useAuth();
  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const [location] = useLocation();

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Prodotti" />
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
                  {item.iconImage && (<img src={item.iconImage} alt={item.name} className="w-5 h-5 object-contain opacity-70" />)} {item.name}
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
                <CardHeader className="flex flex-col items-center">
                  <img 
                    src={productIconsMap[product.icon || ""] || "/icone/prodotti.png"} 
                    alt={product.name} 
                    className="w-32 h-32 object-contain mb-4"
                  />
                  <CardTitle className="text-xl font-bold text-center">{product.name}</CardTitle>
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

