import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const questionari = [
  {
    id: "car-decennale",
    nome: "CAR + Decennale Postuma L.210",
    descrizione: "Questionario per Assicurazione Contractors All Risks con copertura decennale postuma",
    file: "/questionari/1.QuestionarioCAR+DecennalePostumaL210(1)(1)(3)(1).pdf",
    tipo: "PDF",
    icon: "🏗️",
    categoria: "Edilizia"
  },
  {
    id: "iar-fotovoltaico",
    nome: "IAR Fotovoltaico",
    descrizione: "Questionario Industrial All Risks per impianti fotovoltaici",
    file: "/questionari/QuestionarioIAR-Fotovoltaico(1)(4).docx",
    tipo: "Word",
    icon: "☀️",
    categoria: "Energia"
  },
  {
    id: "rc-edili",
    nome: "RC Edili e Industriali",
    descrizione: "Richiesta quotazione Responsabilità Civile per imprese edili e industriali",
    file: "/questionari/RichiestaquotazioneRCedilieindustriali.pdf",
    tipo: "PDF",
    icon: "⚙️",
    categoria: "Responsabilità Civile"
  },
  {
    id: "multirischio-commerciale",
    nome: "Multirischio Esercizi Commerciali",
    descrizione: "Scheda semplificata per polizza multirischio negozi e attività commerciali",
    file: "/questionari/SCHEDASEMPLIFICATA-MultirischiEserciziCommercialirev.1(002)(1).pdf",
    tipo: "PDF",
    icon: "🏪",
    categoria: "Multirischio"
  },
  {
    id: "polizza-pet",
    nome: "Polizza PET",
    descrizione: "Scheda per assicurazione completa animali domestici",
    file: "/questionari/SCHEDAPolizzaPET.pdf",
    tipo: "PDF",
    icon: "🐾",
    categoria: "Animali"
  },
  {
    id: "multirischio-casa",
    nome: "Multirischio Casa e Famiglia",
    descrizione: "Scheda completa per polizza abitazioni e nucleo familiare",
    file: "/questionari/SCHEDACOMPLETA-MultirischiCasaeFamigliarev.2-01.2025(003).pdf",
    tipo: "PDF",
    icon: "🏠",
    categoria: "Multirischio"
  },
  {
    id: "fidejussioni",
    nome: "Fidejussioni",
    descrizione: "Questionario completo per cauzioni e fidejussioni (appalti pubblici e privati)",
    file: "/questionari/Fideiussioni_Italia_Aggiornato(1)(1).docx",
    tipo: "Word",
    icon: "⚖️",
    categoria: "Cauzioni"
  },
  {
    id: "questionario-1015",
    nome: "Questionario 1015",
    descrizione: "Questionario aggiuntivo per prodotti specifici",
    file: "/questionari/Questionario_1015(2).pdf",
    tipo: "PDF",
    icon: "📋",
    categoria: "Assicurazione Fabbricati"
  }
];

export default function Questionari() {
  const [location] = useLocation();
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Prodotti", icon: "📦" },
    { path: "/policies", label: "Polizze", icon: "📋" },
    { path: "/claims", label: "Sinistri", icon: "⚠️" },
    { path: "/questionari", label: "Questionari", icon: "📄" },
  ];

  // Raggruppa per categoria
  const categorieUniche = Array.from(new Set(questionari.map(q => q.categoria)));

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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Libreria Questionari</h2>
              <p className="text-gray-600 mt-2">
                Scarica i questionari per compilarli offline e caricarli durante la richiesta di polizza
              </p>
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className="font-semibold mb-2">Come utilizzare i questionari</h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li><strong>1.</strong> Scarica il questionario del prodotto che ti interessa (PDF o Word)</li>
                    <li><strong>2.</strong> Compila tutti i campi richiesti con attenzione</li>
                    <li><strong>3.</strong> Durante la creazione della richiesta polizza, carica il questionario compilato nella sezione "Documenti"</li>
                    <li><strong>4.</strong> Il nostro team riceverà la tua richiesta completa e ti contatterà per il preventivo</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questionari raggruppati per categoria */}
          {categorieUniche.map((categoria) => (
            <div key={categoria} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                {categoria}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questionari
                  .filter((q) => q.categoria === categoria)
                  .map((questionario) => (
                    <Card
                      key={questionario.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                            <span className="text-2xl">{questionario.icon}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              questionario.tipo === "PDF"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {questionario.tipo}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{questionario.nome}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {questionario.descrizione}
                        </p>
                        <a href={questionario.file} download>
                          <Button className="w-full" variant="default">
                            <span className="mr-2">📥</span>
                            Scarica Questionario
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}

          {/* Info aggiuntiva */}
          <Card>
            <CardHeader>
              <CardTitle>Hai bisogno di aiuto?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                Se hai domande sulla compilazione dei questionari o necessiti di assistenza,
                il nostro team è a tua disposizione.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  📧 Contattaci via Email
                </Button>
                <Button variant="outline">
                  📞 Chiamaci
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

