import { useState } from "react";
import { getNavItemsForRole } from "@/components/Navigation";
import { Notifications } from "@/components/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";

// navItems will be defined after currentUser

export default function Users() {
  const [activeTab, setActiveTab] = useState("Utenti");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    role: "agent",
    commissionRate: 10,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const navItems = getNavItemsForRole(currentUser.role || "collaborator");

  const registerMutation = trpc.customAuth.register.useMutation({
    onSuccess: () => {
      alert("✅ Utente creato con successo!");
      setIsCreateDialogOpen(false);
      setNewUser({
        username: "",
        password: "",
        email: "",
        name: "",
        phone: "",
        role: "agent",
        commissionRate: 10,
      });
      window.location.reload();
    },
    onError: (error) => {
      alert("❌ Errore: " + error.message);
    },
  });

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name || !newUser.email) {
      alert("⚠️ Compila tutti i campi obbligatori");
      return;
    }
    registerMutation.mutate(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // Mock users data - in produzione verrebbe dal database
  const users = [
    { id: "1", username: "admin", name: "Amministratore", email: "admin@portalebroker.it", phone: "+39 333 1234567", role: "admin", isActive: true, commissionRate: 0, createdAt: "2025-01-15" },
    { id: "2", username: "agente1", name: "Mario Rossi", email: "mario.rossi@portalebroker.it", phone: "+39 333 7654321", role: "agent", isActive: true, commissionRate: 15, createdAt: "2025-01-16" },
    { id: "3", username: "collab1", name: "Laura Bianchi", email: "laura.bianchi@portalebroker.it", phone: "+39 333 9876543", role: "collaborator", isActive: true, commissionRate: 10, createdAt: "2025-01-17" },
  ];

  const getRoleBadge = (role: string) => {
    const colors: any = {
      master: "bg-purple-100 text-purple-800",
      admin: "bg-blue-100 text-blue-800",
      agent: "bg-green-100 text-green-800",
      collaborator: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleLabel = (role: string) => {
    const labels: any = {
      master: "Master",
      admin: "Amministratore",
      agent: "Agente",
      collaborator: "Collaboratore",
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🛡️</span>
              <h1 className="text-2xl font-bold">Portale Broker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{currentUser.name || "Utente"}</p>
                <p className="text-xs text-blue-200">{currentUser.email}</p>
                <p className="text-xs text-blue-300">{getRoleLabel(currentUser.role)}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                {currentUser.name?.charAt(0) || "U"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === item.name
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={(e) => {
                  if (item.path === "/users") {
                    e.preventDefault();
                    setActiveTab(item.name);
                  }
                }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Gestione Utenti</h2>
            <p className="text-gray-600 mt-1">Crea e gestisci gli account di agenti e collaboratori</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <span className="mr-2">➕</span>
                Crea Nuovo Utente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crea Nuovo Utente</DialogTitle>
                <DialogDescription>
                  Inserisci i dati del nuovo utente. Tutti i campi contrassegnati con * sono obbligatori.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="es. mario.rossi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Minimo 8 caratteri"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="es. Mario Rossi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="es. mario.rossi@email.it"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="es. +39 333 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Ruolo *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agente</SelectItem>
                      <SelectItem value="collaborator">Collaboratore</SelectItem>
                      {(currentUser.role === "master" || currentUser.role === "admin") && (
                        <SelectItem value="admin">Amministratore</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Percentuale Provvigione (%) *</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={newUser.commissionRate}
                    onChange={(e) => setNewUser({ ...newUser, commissionRate: parseInt(e.target.value) || 0 })}
                    placeholder="es. 15"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500">La percentuale di provvigione sulle polizze vendute</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={registerMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {registerMutation.isPending ? "Creazione..." : "Crea Utente"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                <p className="text-sm text-gray-600 mt-1">Totale Utenti</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
                <p className="text-sm text-gray-600 mt-1">Utenti Attivi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{users.filter(u => u.role === "agent").length}</p>
                <p className="text-sm text-gray-600 mt-1">Agenti</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{users.filter(u => u.role === "collaborator").length}</p>
                <p className="text-sm text-gray-600 mt-1">Collaboratori</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Elenco Utenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefono</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruolo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provvigione</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.commissionRate}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.isActive ? "✓ Attivo" : "✗ Disattivato"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-blue-600">
                            ✏️ Modifica
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            {user.isActive ? "🚫 Disattiva" : "✓ Attiva"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

