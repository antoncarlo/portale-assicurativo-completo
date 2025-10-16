import re

def clean_and_fix(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    # Trova l'inizio della funzione export default
    function_start = -1
    for i, line in enumerate(lines):
        if 'export default function' in line:
            function_start = i
            break
    
    if function_start == -1:
        print(f"❌ Cannot find function in {filepath}")
        return
    
    # Rimuovi tutte le linee tra function_start+1 e la prima linea che non è una dichiarazione const
    cleaned_lines = lines[:function_start+1]
    
    # Aggiungi solo useAuth e navItems
    cleaned_lines.append('  const { user: currentUser } = useAuth();\n')
    cleaned_lines.append('  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");\n')
    
    # Trova dove inizia il vero codice (dopo le dichiarazioni)
    i = function_start + 1
    while i < len(lines):
        line = lines[i].strip()
        if (line and 
            not line.startswith('const { user: currentUser }') and
            not line.startswith('const navItems =') and
            not line.startswith('const currentUser =') and
            not line.startswith('// navItems')):
            break
        i += 1
    
    # Aggiungi il resto del codice
    cleaned_lines.extend(lines[i:])
    
    content = ''.join(cleaned_lines)
    
    # Fix item.label → item.name
    content = content.replace('item.label', 'item.name')
    
    # Assicurati che ci siano gli import
    if 'from "@/components/Navigation"' not in content:
        content = content.replace(
            'import { Link, useLocation } from "wouter";',
            'import { Link, useLocation } from "wouter";\nimport { getNavItemsForRole } from "@/components/Navigation";\nimport { useAuth } from "@/_core/hooks/useAuth";'
        )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Cleaned {filepath}")

# Clean all pages
pages = [
    "client/src/pages/Products.tsx",
    "client/src/pages/Policies.tsx",
    "client/src/pages/Claims.tsx",
    "client/src/pages/Questionari.tsx",
]

for page in pages:
    try:
        clean_and_fix(page)
    except Exception as e:
        print(f"❌ Error cleaning {page}: {e}")

print("\n✅ Tutte le pagine pulite!")
