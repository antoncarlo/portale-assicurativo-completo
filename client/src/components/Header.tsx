import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab?: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
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
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-2xl font-bold">Portale Broker</h1>
              {activeTab && <p className="text-sm text-blue-200">{activeTab}</p>}
            </div>
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
  );
}

