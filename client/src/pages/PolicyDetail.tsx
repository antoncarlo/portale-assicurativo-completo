import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Separator } from "@/components/ui/separator";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Bozza", variant: "secondary" },
  quote_requested: { label: "Richiesta Quotazione", variant: "outline" },
  in_quotation: { label: "In Quotazione", variant: "outline" },
  quoted: { label: "Quotata", variant: "default" },
  active: { label: "Attiva", variant: "default" },
  expired: { label: "Scaduta", variant: "destructive" },
  cancelled: { label: "Annullata", variant: "destructive" },
};

export default function PolicyDetail() {
  const [, params] = useRoute("/policies/:policyId");
  const { user: currentUser } = useAuth();
  const policyId = params?.policyId;

  const { data: policy, isLoading, refetch } = trpc.policies.getById.useQuery(policyId || "");
  const { data: communications } = trpc.policies.getCommunications.useQuery(policyId || "");
  
  const addCommunication = trpc.policies.addCommunication.useMutation({
    onSuccess: () => {
      toast.success("Comunicazione aggiunta!");
      setNewNote("");
      setNewDocuments([]);
      refetch();
    },
  });

  const [newNote, setNewNote] = useState("");
  const [newDocuments, setNewDocuments] = useState<Array<{ name: string; size: number; url: string }>>([]);

  const handleAddCommunication = () => {
    if (!policyId) return;
    if (!newNote && newDocuments.length === 0) {
      toast.error("Inserisci una nota o carica un documento");
      return;
    }

    addCommunication.mutate({
      policyId,
      userId: currentUser?.id || "",
      userName: currentUser?.name || "Utente",
      userRole: currentUser?.role || "user",
      type: newDocuments.length > 0 ? "document" : "note",
      content: newNote || undefined,
      documentUrl: newDocuments[0]?.url,
      documentName: newDocuments[0]?.name,
    });
  };

  const isAdmin = currentUser?.role === "master" || currentUser?.role === "admin";

  if (isLoading) {
    return <div className="p-8">Caricamento...</div>;
  }

  if (!policy) {
    return <div className="p-8">Polizza non trovata</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🛡️</span>
              <span className="text-xl font-semibold">Portale Broker</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/policies">
            <Button variant="outline">← Torna alle Polizze</Button>
          </Link>
        </div>

        {/* Dettaglio Polizza */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna Principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Polizza */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Polizza {policy.policyNumber}</CardTitle>
                  <Badge variant={statusMap[policy.status]?.variant || "secondary"}>
                    {statusMap[policy.status]?.label || policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Prodotto</p>
                    <p className="font-semibold">{policy.productTypeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-semibold">{policy.clientName}</p>
                  </div>
                  {policy.premiumAmount && (
                    <div>
                      <p className="text-sm text-gray-600">Premio</p>
                      <p className="text-xl font-bold text-blue-600">
                        €{parseFloat(policy.premiumAmount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                  {policy.startDate && (
                    <div>
                      <p className="text-sm text-gray-600">Data Inizio</p>
                      <p className="font-semibold">
                        {new Date(policy.startDate).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dati Contraente */}
            {policy.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Note Polizza</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{policy.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Timeline Comunicazioni */}
            <Card>
              <CardHeader>
                <CardTitle>Comunicazioni e Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Timeline */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {communications?.communications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nessuna comunicazione</p>
                  ) : (
                    communications?.communications.map((comm: any) => (
                      <div key={comm.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {comm.userName?.charAt(0) || "U"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comm.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {comm.userRole}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(comm.createdAt).toLocaleString("it-IT")}
                            </span>
                          </div>
                          {comm.content && <p className="text-gray-900 whitespace-pre-wrap">{comm.content}</p>}
                          {comm.documentUrl && (
                            <a
                              href={comm.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
                            >
                              📎 {comm.documentName}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                {/* Form Nuova Comunicazione */}
                <div className="space-y-3">
                  <Label>Aggiungi Nota o Documento</Label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Scrivi una nota, richiesta, aggiornamento..."
                    rows={3}
                  />
                  <FileUpload
                    maxFiles={1}
                    acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onUploadComplete={(files) => {
                      setNewDocuments(files.map(f => ({ name: f.name, size: f.size, url: f.url || '' })));
                      toast.success("Documento caricato!");
                    }}
                  />
                  <Button
                    onClick={handleAddCommunication}
                    disabled={addCommunication.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {addCommunication.isPending ? "Invio..." : "💬 Aggiungi Comunicazione"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Data Creazione</p>
                  <p className="font-semibold">
                    {policy.createdAt ? new Date(policy.createdAt).toLocaleDateString("it-IT") : "N/D"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Ultimo Aggiornamento</p>
                  <p className="font-semibold">
                    {policy.updatedAt ? new Date(policy.updatedAt).toLocaleDateString("it-IT") : "N/D"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Azioni Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    ✏️ Modifica Polizza
                  </Button>
                  <Button variant="outline" className="w-full">
                    📧 Invia Email Cliente
                  </Button>
                  <Button variant="destructive" className="w-full">
                    🗑️ Elimina Polizza
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

