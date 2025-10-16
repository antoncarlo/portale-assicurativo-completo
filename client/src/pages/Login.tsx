import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.customAuth.login.useMutation({
    onSuccess: (data) => {
      // Salva utente in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setLocation("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛡️</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Portale Broker</CardTitle>
          <CardDescription className="text-center">
            Accedi al tuo account per gestire le polizze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Inserisci username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Inserisci password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-semibold text-blue-900 mb-2">Credenziali Demo:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>• <strong>Admin:</strong> admin / admin123</p>
              <p>• <strong>Agente:</strong> agente1 / agente123</p>
              <p>• <strong>Collaboratore:</strong> collab1 / collab123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

