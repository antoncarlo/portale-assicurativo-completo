import { useState } from "react";
import { getNavItemsForRole } from "@/components/Navigation";
import { Notifications } from "@/components/Notifications";
import { Button } from "@/components/ui/button";
import { exportCommissionsToExcel } from "@/utils/export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

// navItems will be defined after currentUser

export default function Commissions() {
  const [activeTab, setActiveTab] = useState("Provvigioni");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const navItems = getNavItemsForRole(currentUser.role || "collaborator");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // Mock commissions data
  const commissions = [
    { id: "1", policyNumber: "CAR-2025-00001", clientName: "Costruzioni Rossi S.r.l.", premium: 15000, rate: 15, amount: 2250, status: "paid", date: "2025-01-15" },
    { id: "2", policyNumber: "RC-2025-00001", clientName: "Edil Costruzioni S.r.l.", premium: 8500, rate: 15, amount: 1275, status: "paid", date: "2025-01-10" },
    { id: "3", policyNumber: "MULTI-COM-2025-00001", clientName: "Bar Centrale", premium: 3500, rate: 15, amount: 525, status: "pending", date: "2025-01-20" },
  ];

  const totalEarned = commissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const totalPending = commissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);
  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);

  const getStatusBadge = (status: string) => {
    return status === "paid" 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800";
  };

  const getStatusLabel = (status: string) => {
    return status === "paid" ? "✓ Pagata" : "⏳ In Attesa";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

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
                  if (item.path === "/commissions") {
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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Le Mie Provvigioni</h2>
          <p className="text-gray-600 mt-1">Monitora i tuoi guadagni e lo storico delle provvigioni</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <img src="/icone/totale_guadagnato.png" alt="Totale Guadagnato" className="w-20 h-20 object-contain mx-auto mb-2" />
                <p className="text-sm text-green-700 mb-1">Totale Guadagnato</p>
                <p className="text-3xl font-bold text-green-600">€{totalEarned.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">Provvigioni pagate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <img src="/icone/in_attesa.png" alt="In Attesa" className="w-20 h-20 object-contain mx-auto mb-2" />
                <p className="text-sm text-yellow-700 mb-1">In Attesa</p>
                <p className="text-3xl font-bold text-yellow-600">€{totalPending.toLocaleString()}</p>
                <p className="text-xs text-yellow-600 mt-1">Da ricevere</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <img src="/icone/provvigioni.png" alt="Totale Provvigioni" className="w-20 h-20 object-contain mx-auto mb-2" />
                <p className="text-sm text-blue-700 mb-1">Totale Provvigioni</p>
                <p className="text-3xl font-bold text-blue-600">€{totalCommissions.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">Tutte le provvigioni</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <img src="/icone/percentuale.png" alt="Tasso Provvigione" className="w-20 h-20 object-contain mx-auto mb-2" />
                <p className="text-sm text-purple-700 mb-1">Tasso Provvigione</p>
                <p className="text-3xl font-bold text-purple-600">{currentUser.commissionRate || 0}%</p>
                <p className="text-xs text-purple-600 mt-1">Percentuale attuale</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Storico Provvigioni</CardTitle>
              <Button 
                variant="outline" 
                className="bg-green-50 text-green-700 hover:bg-green-100"
                onClick={() => exportCommissionsToExcel(commissions)}
              >
                Esporta Excel
              </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N. Polizza</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">%Provvigioni</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provvigione</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(commission.date).toLocaleDateString('it-IT')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {commission.policyNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{commission.clientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        €{commission.premium.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {commission.rate}%
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">
                        €{commission.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(commission.status)}`}>
                          {getStatusLabel(commission.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right text-sm text-gray-900">
                      TOTALE:
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600">
                      €{totalCommissions.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Come funzionano le provvigioni?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Le provvigioni vengono calcolate automaticamente sul premio della polizza</li>
                  <li>• Il tuo tasso provvigionale attuale è del <strong>{currentUser.commissionRate || 0}%</strong></li>
                  <li>• Le provvigioni vengono pagate mensilmente entro il 15 del mese successivo</li>
                  <li>• Puoi esportare lo storico in Excel per la tua contabilità</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

