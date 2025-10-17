import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import Header from "@/components/Header";

export default function NewPolicyWizard() {
  const [, params] = useRoute("/products/:productId/new");
  const [, setLocation] = useLocation();
  const productId = params?.productId;

  const { data: products } = trpc.products.list.useQuery();
  const product = products?.find((p) => p.id === productId);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = product?.id === "fidejussioni" ? 5 : 4;

  const createPolicy = trpc.policies.create.useMutation({
    onSuccess: () => {
      toast.success("Richiesta inviata con successo!");
      setLocation("/policies");
    },
    onError: (error) => {
      toast.error("Errore durante l'invio: " + error.message);
    },
  });

  // Form data
  const [contraenteData, setContraenteData] = useState({
    ragioneSociale: "",
    partitaIva: "",
    codiceFiscale: "",
    indirizzo: "",
    cap: "",
    citta: "",
    provincia: "",
    pec: "",
    telefono: "",
    email: "",
  });

  const [beneficiarioData, setBeneficiarioData] = useState({
    ragioneSociale: "",
    partitaIva: "",
    indirizzo: "",
    cap: "",
    citta: "",
    provincia: "",
  });

  const [oggettoGaranziaData, setOggettoGaranziaData] = useState({
    tipoGaranzia: "",
    importoGarantito: "",
    dataInizio: "",
    dataFine: "",
    descrizione: "",
  });

  const [documenti, setDocumenti] = useState<Array<{ name: string; size: number; url: string }>>([]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!productId) {
      toast.error("Prodotto non selezionato");
      return;
    }

    // Preparare i dati da inviare
    const policyData = {
      productTypeId: productId,
      clientName: contraenteData.ragioneSociale,
      clientEmail: contraenteData.email,
      clientPhone: contraenteData.telefono,
      notes: JSON.stringify({
        contraente: contraenteData,
        beneficiario: product?.id === "fidejussioni" ? beneficiarioData : null,
        oggettoGaranzia: product?.id === "fidejussioni" ? oggettoGaranziaData : null,
        documenti: documenti.map(f => f.name),
        note: notes,
      }),
    };

    createPolicy.mutate(policyData);
  };

  const [location] = useLocation();
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Prodotti", icon: "📦" },
    { path: "/policies", label: "Polizze", icon: "📋" },
    { path: "/claims", label: "Sinistri", icon: "⚠️" },
    { path: "/questionari", label: "Questionari", icon: "📄" },
  ];

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="Nuova Polizza" />
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
      <Header activeTab="Nuova Polizza" />
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
        <div className="mb-6 flex justify-between items-center">
          <Link href="/products">
            <Button variant="outline" size="sm">
              ← Torna ai Prodotti
            </Button>
          </Link>
          {product.questionnaireFile && (
            <a
              href={product.questionnaireFile}
              download
              className="text-sm text-blue-600 hover:underline flex items-center gap-2"
            >
              Scarica Questionario PDF/Word
            </a>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Nuova Richiesta: {product.name}
            </CardTitle>
            <p className="text-gray-600 mt-2">{product.description}</p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const stepNum = i + 1;
                const stepLabels = product.id === "fidejussioni" 
                  ? ["Contraente", "Beneficiario", "Oggetto Garanzia", "Documenti", "Riepilogo"]
                  : ["Contraente", "Questionario", "Documenti", "Riepilogo"];
                
                return (
                  <div key={stepNum} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          stepNum === currentStep
                            ? "bg-blue-600 text-white"
                            : stepNum < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {stepNum < currentStep ? "✓" : stepNum}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">
                        {stepLabels[i]}
                      </span>
                    </div>
                    {stepNum < totalSteps && (
                      <div
                        className={`h-1 flex-1 ${
                          stepNum < currentStep ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            {/* Step 1: Dati Contraente */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Dati Contraente</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ragioneSociale">Ragione Sociale / Nome Completo *</Label>
                    <Input
                      id="ragioneSociale"
                      required
                      value={contraenteData.ragioneSociale}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, ragioneSociale: e.target.value })
                      }
                      placeholder="Es: Azienda S.r.l. o Mario Rossi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partitaIva">Partita IVA *</Label>
                    <Input
                      id="partitaIva"
                      required
                      value={contraenteData.partitaIva}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, partitaIva: e.target.value })
                      }
                      placeholder="IT12345678901"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                    <Input
                      id="codiceFiscale"
                      required
                      value={contraenteData.codiceFiscale}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, codiceFiscale: e.target.value })
                      }
                      placeholder="RSSMRA80A01H501X"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="indirizzo">Indirizzo Completo *</Label>
                    <Input
                      id="indirizzo"
                      required
                      value={contraenteData.indirizzo}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, indirizzo: e.target.value })
                      }
                      placeholder="Via Roma, 123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cap">CAP *</Label>
                    <Input
                      id="cap"
                      required
                      value={contraenteData.cap}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, cap: e.target.value })
                      }
                      placeholder="00100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citta">Città *</Label>
                    <Input
                      id="citta"
                      required
                      value={contraenteData.citta}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, citta: e.target.value })
                      }
                      placeholder="Roma"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provincia">Provincia *</Label>
                    <Input
                      id="provincia"
                      required
                      maxLength={2}
                      value={contraenteData.provincia}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, provincia: e.target.value.toUpperCase() })
                      }
                      placeholder="RM"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pec">PEC *</Label>
                    <Input
                      id="pec"
                      type="email"
                      required
                      value={contraenteData.pec}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, pec: e.target.value })
                      }
                      placeholder="azienda@pec.it"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Telefono / Cellulare *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      value={contraenteData.telefono}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, telefono: e.target.value })
                      }
                      placeholder="+39 123 456 7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={contraenteData.email}
                      onChange={(e) =>
                        setContraenteData({ ...contraenteData, email: e.target.value })
                      }
                      placeholder="email@esempio.it"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>
                    Avanti →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Beneficiario (solo per Fidejussioni) */}
            {currentStep === 2 && product.id === "fidejussioni" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Dati Beneficiario</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="benRagioneSociale">Ragione Sociale Beneficiario *</Label>
                    <Input
                      id="benRagioneSociale"
                      required
                      value={beneficiarioData.ragioneSociale}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, ragioneSociale: e.target.value })
                      }
                      placeholder="Es: Ente Pubblico o Azienda Committente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benPartitaIva">Partita IVA *</Label>
                    <Input
                      id="benPartitaIva"
                      required
                      value={beneficiarioData.partitaIva}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, partitaIva: e.target.value })
                      }
                      placeholder="IT98765432109"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="benIndirizzo">Indirizzo Completo *</Label>
                    <Input
                      id="benIndirizzo"
                      required
                      value={beneficiarioData.indirizzo}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, indirizzo: e.target.value })
                      }
                      placeholder="Piazza del Comune, 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benCap">CAP *</Label>
                    <Input
                      id="benCap"
                      required
                      value={beneficiarioData.cap}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, cap: e.target.value })
                      }
                      placeholder="00100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benCitta">Città *</Label>
                    <Input
                      id="benCitta"
                      required
                      value={beneficiarioData.citta}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, citta: e.target.value })
                      }
                      placeholder="Milano"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benProvincia">Provincia *</Label>
                    <Input
                      id="benProvincia"
                      required
                      maxLength={2}
                      value={beneficiarioData.provincia}
                      onChange={(e) =>
                        setBeneficiarioData({ ...beneficiarioData, provincia: e.target.value.toUpperCase() })
                      }
                      placeholder="MI"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    ← Indietro
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Avanti →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Oggetto Garanzia (solo per Fidejussioni) */}
            {currentStep === 3 && product.id === "fidejussioni" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Oggetto della Garanzia</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tipoGaranzia">Tipo di Garanzia *</Label>
                    <Input
                      id="tipoGaranzia"
                      required
                      value={oggettoGaranziaData.tipoGaranzia}
                      onChange={(e) =>
                        setOggettoGaranziaData({ ...oggettoGaranziaData, tipoGaranzia: e.target.value })
                      }
                      placeholder="Es: Fidejussione per Appalto Pubblico"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="importoGarantito">Importo Garantito (€) *</Label>
                    <Input
                      id="importoGarantito"
                      type="number"
                      required
                      value={oggettoGaranziaData.importoGarantito}
                      onChange={(e) =>
                        setOggettoGaranziaData({ ...oggettoGaranziaData, importoGarantito: e.target.value })
                      }
                      placeholder="50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataInizio">Data Inizio Validità *</Label>
                    <Input
                      id="dataInizio"
                      type="date"
                      required
                      value={oggettoGaranziaData.dataInizio}
                      onChange={(e) =>
                        setOggettoGaranziaData({ ...oggettoGaranziaData, dataInizio: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFine">Data Fine Validità *</Label>
                    <Input
                      id="dataFine"
                      type="date"
                      required
                      value={oggettoGaranziaData.dataFine}
                      onChange={(e) =>
                        setOggettoGaranziaData({ ...oggettoGaranziaData, dataFine: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descrizione">Descrizione Dettagliata *</Label>
                    <Textarea
                      id="descrizione"
                      required
                      value={oggettoGaranziaData.descrizione}
                      onChange={(e) =>
                        setOggettoGaranziaData({ ...oggettoGaranziaData, descrizione: e.target.value })
                      }
                      placeholder="Descrivi l'oggetto della garanzia, il progetto, l'appalto, ecc."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    ← Indietro
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Avanti →
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Questionario Prodotto (per prodotti non-fidejussioni) */}
            {currentStep === 2 && product.id !== "fidejussioni" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Questionario Prodotto</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-sm text-blue-900 mb-4">
                    <strong>Questionario Dettagliato</strong>
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    Per questo prodotto è necessario compilare un questionario dettagliato.
                    Puoi scegliere una delle seguenti opzioni:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">1️⃣</span>
                      <div>
                        <p className="font-medium">Scarica e compila offline</p>
                        <p className="text-sm text-gray-600">
                          Scarica il questionario PDF/Word, compilalo e caricalo nella sezione Documenti
                        </p>
                        {product.questionnaireFile && (
                          <a
                            href={product.questionnaireFile}
                            download
                            className="inline-block mt-2"
                          >
                            <Button variant="outline" size="sm">
                              Scarica Questionario
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">2️⃣</span>
                      <div>
                        <p className="font-medium">Compila online (prossimamente)</p>
                        <p className="text-sm text-gray-600">
                          La compilazione guidata online sarà disponibile nel prossimo aggiornamento
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    ← Indietro
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Avanti →
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Upload Documenti */}
            {((currentStep === 4 && product.id === "fidejussioni") || 
              (currentStep === 3 && product.id !== "fidejussioni")) && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Carica Documenti</h3>
                <p className="text-sm text-gray-600">Carica tutti i documenti necessari per la richiesta (questionario compilato, documenti identificativi, ecc.)</p>
                
                <FileUpload
                  maxFiles={10}
                  acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                  onUploadComplete={(uploadedFiles) => {
                    setDocumenti(uploadedFiles.map(f => ({ name: f.name, size: f.size, url: f.url || '' })));
                    toast.success(`${uploadedFiles.length} file caricati con successo!`);
                  }}
                />

                <div className="space-y-2">
                  <Label htmlFor="notes">Note Aggiuntive</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Inserisci eventuali note o richieste specifiche..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentStep(product.id === "fidejussioni" ? 3 : 2)
                    }
                  >
                    ← Indietro
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentStep(product.id === "fidejussioni" ? 5 : 4)
                    }
                  >
                    Avanti →
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Riepilogo */}
            {((currentStep === 5 && product.id === "fidejussioni") || 
              (currentStep === 4 && product.id !== "fidejussioni")) && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Riepilogo Richiesta</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dati Contraente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Ragione Sociale:</strong> {contraenteData.ragioneSociale}</p>
                      <p><strong>P.IVA:</strong> {contraenteData.partitaIva}</p>
                      <p><strong>CF:</strong> {contraenteData.codiceFiscale}</p>
                      <p><strong>Indirizzo:</strong> {contraenteData.indirizzo}, {contraenteData.cap} {contraenteData.citta} ({contraenteData.provincia})</p>
                      <p><strong>PEC:</strong> {contraenteData.pec}</p>
                      <p><strong>Tel:</strong> {contraenteData.telefono}</p>
                      <p><strong>Email:</strong> {contraenteData.email}</p>
                    </CardContent>
                  </Card>

                  {product.id === "fidejussioni" && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Dati Beneficiario</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p><strong>Ragione Sociale:</strong> {beneficiarioData.ragioneSociale}</p>
                          <p><strong>P.IVA:</strong> {beneficiarioData.partitaIva}</p>
                          <p><strong>Indirizzo:</strong> {beneficiarioData.indirizzo}, {beneficiarioData.cap} {beneficiarioData.citta} ({beneficiarioData.provincia})</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Oggetto Garanzia</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p><strong>Tipo:</strong> {oggettoGaranziaData.tipoGaranzia}</p>
                          <p><strong>Importo:</strong> €{parseFloat(oggettoGaranziaData.importoGarantito || "0").toLocaleString("it-IT")}</p>
                          <p><strong>Validità:</strong> {oggettoGaranziaData.dataInizio} - {oggettoGaranziaData.dataFine}</p>
                          <p><strong>Descrizione:</strong> {oggettoGaranziaData.descrizione}</p>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Documenti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {documenti.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {documenti.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">Nessun documento caricato</p>
                      )}
                    </CardContent>
                  </Card>

                  {notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Note</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Attenzione:</strong> Verifica attentamente tutti i dati prima di inviare la richiesta.
                    Dopo l'invio, il nostro team ti contatterà per eventuali chiarimenti.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentStep(product.id === "fidejussioni" ? 4 : 3)
                    }
                  >
                    ← Indietro
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createPolicy.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createPolicy.isPending ? "Invio in corso..." : "✓ Invia Richiesta"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

