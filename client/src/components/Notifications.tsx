import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Nuova polizza emessa", message: "Polizza CAR-2025-00001 emessa con successo", time: "5 min fa", read: false, type: "success" },
    { id: "2", title: "Sinistro in revisione", message: "Il sinistro CLM-2025-00003 è in revisione", time: "1 ora fa", read: false, type: "warning" },
    { id: "3", title: "Provvigione pagata", message: "Provvigione di €2.250 accreditata", time: "2 ore fa", read: true, type: "success" },
    { id: "4", title: "Scadenza polizza", message: "La polizza RC-2025-00001 scade tra 30 giorni", time: "1 giorno fa", read: true, type: "info" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    const icons: any = {
      success: "✅",
      warning: "⚠️",
      info: "ℹ️",
      error: "❌",
    };
    return icons[type] || "📬";
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifiche</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600"
              >
                Segna tutte come lette
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">📭</p>
                <p>Nessuna notifica</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-semibold text-sm ${!notification.read ? "text-blue-900" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t text-center">
            <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
              Vedi tutte le notifiche
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

