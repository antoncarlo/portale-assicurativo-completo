import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  reported: { label: "Segnalato", variant: "secondary" },
  under_review: { label: "In Revisione", variant: "outline" },
  approved: { label: "Approvato", variant: "default" },
  rejected: { label: "Rifiutato", variant: "destructive" },
  paid: { label: "Pagato", variant: "default" },
  closed: { label: "Chiuso", variant: "secondary" },
};

export default function ClaimDetail() {
  const [, params] = useRoute("/claims/:claimId");
  const [, setLocation] = useLocation();
  const { user: currentUser } = useAuth();
  const claimId = params?.claimId;

  const { data: claim, isLoading } = trpc.claims.getById.useQuery(claimId || "");
  const updateStatus = trpc.claims.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Stato aggiornato con successo!");
      window.location.reload();
    },
  });

  const [rejectionReason, setRejectionReason] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");

  const isAdmin = currentUser?.role === "master" || currentUser?.role === "admin";

  const handleStatusChange = (newStatus: string) => {
    if (!claimId) return;

    if (newStatus === "rejected" && !rejectionReason) {
      toast.error("Inserisci il motivo del rifiuto");
      return;
    }

    if (newStatus === "approved" && !approvedAmount) {
      toast.error("Inserisci l'importo approvato");
      return;
    }

    updateStatus.mutate({
      id: claimId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return <div className="p-8">Caricamento...</div>;
  }

  if (!claim) {
    return <div className="p-8">Sinistro non trovato</div>;
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
          <Link href="/claims">
            <Button variant="outline">← Torna ai Sinistri</Button>
          </Link>
        </div>

        {/* Dettaglio Sinistro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna Principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Sinistro #{claim.id.slice(0, 8)}</CardTitle>
                  <Badge variant={statusMap[claim.status]?.variant || "secondary"}>
                    {statusMap[claim.status]?.label || claim.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Descrizione</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{claim.description}</p>
                </div>

                {claim.claimAmount && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Importo Stimato</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      €{parseFloat(claim.claimAmount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {claim.paidAmount && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Importo Approvato</h3>
                    <p className="text-2xl font-bold text-green-600">
                      €{parseFloat(claim.paidAmount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Azioni Admin */}
            {isAdmin && claim.status !== "closed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Azioni Amministrative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {claim.status === "reported" && (
                    <Button
                      onClick={() => handleStatusChange("under_review")}
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      📋 Prendi in Carico
                    </Button>
                  )}

                  {claim.status === "under_review" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="approvedAmount">Importo Approvato (€)</Label>
                        <Input
                          id="approvedAmount"
                          type="number"
                          step="0.01"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(e.target.value)}
                          placeholder="Es: 4500.00"
                        />
                      </div>
                      <Button
                        onClick={() => handleStatusChange("approved")}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={!approvedAmount}
                      >
                        ✅ Approva Sinistro
                      </Button>

                      <div className="space-y-2">
                        <Label htmlFor="rejectionReason">Motivo Rifiuto</Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Specifica il motivo del rifiuto..."
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={() => handleStatusChange("rejected")}
                        variant="destructive"
                        className="w-full"
                        disabled={!rejectionReason}
                      >
                        ❌ Rifiuta Sinistro
                      </Button>
                    </>
                  )}

                  {claim.status === "approved" && (
                    <Button
                      onClick={() => handleStatusChange("paid")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      💰 Segna come Pagato
                    </Button>
                  )}

                  {claim.status === "paid" && (
                    <Button
                      onClick={() => handleStatusChange("closed")}
                      className="w-full bg-gray-600 hover:bg-gray-700"
                    >
                      🔒 Chiudi Pratica
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Data Sinistro</p>
                  <p className="font-semibold">
                    {claim.claimDate ? new Date(claim.claimDate).toLocaleDateString("it-IT") : "N/D"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Data Segnalazione</p>
                  <p className="font-semibold">
                    {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString("it-IT") : "N/D"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Polizza Collegata</p>
                  <p className="font-semibold">{claim.policyId}</p>
                </div>
              </CardContent>
            </Card>

            {claim.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{claim.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

