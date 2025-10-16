import re

def fix_page(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Rimuovere tutte le dichiarazioni duplicate di navItems
    content = re.sub(r'\n\s*const navItems = getNavItemsForRole\([^)]+\);', '', content)
    
    # Rimuovere dichiarazioni di currentUser standalone
    content = re.sub(r'\n\s*const currentUser = JSON\.parse\(localStorage\.getItem\([^)]+\)\);', '', content)
    
    # Assicurarsi che ci siano gli import corretti
    if 'getNavItemsForRole' not in content[:1000]:
        content = content.replace(
            'import { Link, useLocation } from "wouter";',
            'import { Link, useLocation } from "wouter";\nimport { getNavItemsForRole } from "@/components/Navigation";\nimport { useAuth } from "@/_core/hooks/useAuth";'
        )
    
    # Aggiungere useAuth e navItems all'inizio della funzione
    function_pattern = r'(export default function \w+\(\) \{)'
    if 'const { user: currentUser } = useAuth();' not in content:
        content = re.sub(
            function_pattern,
            r'\1\n  const { user: currentUser } = useAuth();\n  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");',
            content,
            count=1
        )
    
    # Fix item.label → item.name
    content = content.replace('item.label', 'item.name')
    
    # Fix stats.by_status
    content = re.sub(r'stats\.by_status\?\.(\w+)', r'stats.\1', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Fixed {filepath}")

# Fix all pages
pages = [
    "client/src/pages/Home.tsx",
    "client/src/pages/Products.tsx",
    "client/src/pages/Policies.tsx",
    "client/src/pages/Claims.tsx",
    "client/src/pages/Questionari.tsx",
]

for page in pages:
    try:
        fix_page(page)
    except Exception as e:
        print(f"❌ Error fixing {page}: {e}")

print("\n✅ Tutti gli errori sistemati!")
