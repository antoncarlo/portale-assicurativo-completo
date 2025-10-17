// Componente per navigazione differenziata per ruolo
export const getNavItemsForRole = (role: string) => {
  const allItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: "📊", 
      iconImage: "/icone/dashboard.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
    { 
      name: "Prodotti", 
      path: "/products", 
      icon: "📦", 
      iconImage: "/icone/prodotti.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
    { 
      name: "Polizze", 
      path: "/policies", 
      icon: "📄", 
      iconImage: "/icone/polizze.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
    { 
      name: "Sinistri", 
      path: "/claims", 
      icon: "⚠️", 
      iconImage: "/icone/sinistri.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
    { 
      name: "Questionari", 
      path: "/questionari", 
      icon: "📋", 
      iconImage: "/icone/questionari.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
    { 
      name: "Utenti", 
      path: "/users", 
      icon: "👥", 
      iconImage: "/icone/utenti.png",
      roles: ["master", "admin"] 
    },
    { 
      name: "Provvigioni", 
      path: "/commissions", 
      icon: "💰", 
      iconImage: "/icone/provvigioni.png",
      roles: ["master", "admin", "agent", "collaborator"] 
    },
  ];

  return allItems.filter(item => item.roles.includes(role));
};

