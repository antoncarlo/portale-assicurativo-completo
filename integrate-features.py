import re

# 1. Aggiungere Notifications nell'header di tutte le pagine
def add_notifications_to_header(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Verifica se Notifications è già importato
    if 'import { Notifications }' not in content:
        # Aggiungi import
        content = content.replace(
            'import { useAuth } from "@/_core/hooks/useAuth";',
            'import { useAuth } from "@/_core/hooks/useAuth";\nimport { Notifications } from "@/components/Notifications";'
        )
    
    # Aggiungi Notifications nell'header se non c'è già
    if '<Notifications />' not in content:
        # Trova il div con il logo e aggiungi Notifications
        content = re.sub(
            r'(<div className="flex items-center">\s*<span className="text-xl font-semibold text-blue-600">.*?</span>\s*</div>)',
            r'\1\n            <div className="flex items-center gap-4">\n              <Notifications />\n              <div className="flex items-center gap-2">\n                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">\n                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}\n                </div>\n                <span className="text-sm font-medium">{currentUser?.name || "Utente"}</span>\n              </div>\n            </div>',
            content
        )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Added notifications to {filepath}")

# 2. Aggiungere pulsante Export Excel
def add_export_button(filepath, page_type):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Import export function se non c'è
    if 'import { export' not in content and page_type in ['policies', 'claims', 'commissions']:
        content = content.replace(
            'import { Button } from "@/components/ui/button";',
            'import { Button } from "@/components/ui/button";\nimport { exportToExcel } from "@/utils/export";'
        )
    
    # Aggiungi pulsante export se non c'è
    if 'Export Excel' not in content and page_type in ['policies', 'claims', 'commissions']:
        # Trova il CardHeader e aggiungi il pulsante
        if page_type == 'policies':
            content = re.sub(
                r'(<CardTitle className="text-lg">Lista Polizze</CardTitle>)',
                r'\1\n              <Button onClick={() => exportToExcel(data?.policies || [], "polizze")} className="ml-auto">\n                📊 Export Excel\n              </Button>',
                content
            )
        elif page_type == 'claims':
            content = re.sub(
                r'(<CardTitle className="text-lg">Gestione Sinistri</CardTitle>)',
                r'\1\n              <Button onClick={() => exportToExcel(data?.claims || [], "sinistri")} className="ml-auto">\n                📊 Export Excel\n              </Button>',
                content
            )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Added export button to {filepath}")

# Applica modifiche
pages_with_headers = [
    ("client/src/pages/Home.tsx", "dashboard"),
    ("client/src/pages/Products.tsx", "products"),
    ("client/src/pages/Policies.tsx", "policies"),
    ("client/src/pages/Claims.tsx", "claims"),
    ("client/src/pages/Questionari.tsx", "questionari"),
    ("client/src/pages/Users.tsx", "users"),
    ("client/src/pages/Commissions.tsx", "commissions"),
]

for filepath, page_type in pages_with_headers:
    try:
        add_notifications_to_header(filepath)
        add_export_button(filepath, page_type)
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")

print("\n✅ Tutte le funzionalità integrate!")
