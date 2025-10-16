// Componente per navigazione differenziata per ruolo
export const getNavItemsForRole = (role: string) => {
  const allItems = [
    { name: "Dashboard", path: "/", icon: "📊", roles: ["master", "admin", "agent", "collaborator"] },
    { name: "Prodotti", path: "/products", icon: "📦", roles: ["master", "admin", "agent", "collaborator"] },
    { name: "Polizze", path: "/policies", icon: "📄", roles: ["master", "admin", "agent", "collaborator"] },
    { name: "Sinistri", path: "/claims", icon: "⚠️", roles: ["master", "admin", "agent", "collaborator"] },
    { name: "Questionari", path: "/questionari", icon: "📋", roles: ["master", "admin", "agent", "collaborator"] },
    { name: "Utenti", path: "/users", icon: "👥", roles: ["master", "admin"] },
    { name: "Provvigioni", path: "/commissions", icon: "💰", roles: ["master", "admin", "agent", "collaborator"] },
  ];

  return allItems.filter(item => item.roles.includes(role));
};
