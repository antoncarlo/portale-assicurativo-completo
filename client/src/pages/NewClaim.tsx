import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewClaim() {
  const [, setLocation] = useLocation();
  const { data: policies } = trpc.policies.list.useQuery();
  
  const [policyId, setPolicyId] = useState("");
  const [description, setDescription] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [documenti, setDocumenti] = useState<Array<{ name: string; size: number; url: string }>>([]);

  const createClaim = trpc.claims.create.useMutation({
    onSuccess: () => {
      toast.success("Sinistro segnalato con successo!");
      setLocation("/claims");
    },
    onError: (error) => {
      toast.error("Errore durante la segnalazione: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!policyId) {
      toast.error("Seleziona una polizza");
      return;
    }
    if (!description) {
      toast.error("Inserisci la descrizione del sinistro");
      return;
    }
    if (!claimDate) {
      toast.error("Inserisci la data del sinistro");
      return;
    }

    createClaim.mutate({
      policyId,
      description,
      claimDate: new Date(claimDate),
      claimAmount: claimAmount ? parseFloat(claimAmount) : undefined,
      documents: documenti.map(d => d.url),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🛡️</span>
              <span className="text-xl font-semibold text-blue-600">Portale Broker</span>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apri Nuovo Sinistro</CardTitle>
            <p className="text-gray-600 mt-2">
              Compila il form per segnalare un nuovo sinistro
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selezione Polizza */}
            <div className="space-y-2">
              <Label htmlFor="policy">Polizza Collegata *</Label>
              <Select value={policyId} onValueChange={setPolicyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una polizza" />
                </SelectTrigger>
                <SelectContent>
                  {policies?.policies?.map((policy: any) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.policyNumber} - {policy.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data Sinistro */}
            <div className="space-y-2">
              <Label htmlFor="claimDate">Data Sinistro *</Label>
              <Input
                id="claimDate"
                type="date"
                required
                value={claimDate}
                onChange={(e) => setClaimDate(e.target.value)}
              />
            </div>

            {/* Importo Stimato */}
            <div className="space-y-2">
              <Label htmlFor="claimAmount">Importo Stimato Danno (€)</Label>
              <Input
                id="claimAmount"
                type="number"
                step="0.01"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="Es: 5000.00"
              />
              <p className="text-sm text-gray-500">
                Inserisci una stima approssimativa del danno
              </p>
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione Dettagliata Sinistro *</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrivi in dettaglio cosa è successo, quando, dove, eventuali testimoni, ecc."
                rows={6}
              />
            </div>

            {/* Upload Documenti */}
            <div className="space-y-2">
              <Label>Documenti (foto danni, perizie, verbali, ecc.)</Label>
              <FileUpload
                maxFiles={20}
                acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onUploadComplete={(uploadedFiles) => {
                  setDocumenti(uploadedFiles.map(f => ({ name: f.name, size: f.size, url: f.url || '' })));
                  toast.success(`${uploadedFiles.length} file caricati!`);
                }}
              />
            </div>

            {/* Pulsanti */}
            <div className="flex justify-between pt-6 border-t">
              <Link href="/claims">
                <Button variant="outline">Annulla</Button>
              </Link>
              <Button
                onClick={handleSubmit}
                disabled={createClaim.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createClaim.isPending ? "Invio in corso..." : "📤 Segnala Sinistro"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

