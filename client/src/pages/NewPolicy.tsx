import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function NewPolicy() {
  const [, params] = useRoute("/products/:productId/new");
  const [, setLocation] = useLocation();
  const productId = params?.productId;

  const { data: products } = trpc.products.list.useQuery();
  const product = products?.find((p) => p.id === productId);

  const createPolicy = trpc.policies.create.useMutation({
    onSuccess: () => {
      toast.success("Richiesta inviata con successo!");
      setLocation("/policies");
    },
    onError: (error) => {
      toast.error("Errore durante l'invio: " + error.message);
    },
  });

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      toast.error("Prodotto non selezionato");
      return;
    }

    createPolicy.mutate({
      productTypeId: productId,
      ...formData,
    });
  };

  const [location] = useLocation();
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Prodotti", icon: "📦" },
    { path: "/policies", label: "Polizze", icon: "📋" },
  ];

  if (!product) {
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
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Prodotto non trovato</p>
              <Link href="/products">
                <Button className="mt-4">Torna ai Prodotti</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="outline" size="sm">
              ← Torna ai Prodotti
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Nuova Richiesta: {product.name}
            </CardTitle>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dati Cliente</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome / Ragione Sociale *</Label>
                  <Input
                    id="clientName"
                    required
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Es: Mario Rossi o Azienda S.r.l."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clientEmail: e.target.value })
                    }
                    placeholder="email@esempio.it"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Telefono *</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, clientPhone: e.target.value })
                    }
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Note / Richieste Particolari</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Inserisci eventuali note o richieste specifiche..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️ Nota:</strong> Questa è una richiesta di quotazione. 
                  Dopo l'invio, il nostro team ti contatterà per completare il questionario 
                  dettagliato del prodotto "{product.name}" e fornirti un preventivo personalizzato.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/products" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Annulla
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createPolicy.isPending}
                >
                  {createPolicy.isPending ? "Invio in corso..." : "Invia Richiesta"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

