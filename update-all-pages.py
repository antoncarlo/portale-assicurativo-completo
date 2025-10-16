import os
import re

pages = [
    "client/src/pages/Home.tsx",
    "client/src/pages/Products.tsx",
    "client/src/pages/Policies.tsx",
    "client/src/pages/Claims.tsx",
    "client/src/pages/Questionari.tsx",
    "client/src/pages/Users.tsx",
    "client/src/pages/Commissions.tsx",
]

for page in pages:
    if not os.path.exists(page):
        continue
    
    with open(page, 'r') as f:
        content = f.read()
    
    # Aggiungere import Navigation e Notifications
    if "getNavItemsForRole" not in content:
        content = content.replace(
            'import { Button }',
            'import { getNavItemsForRole } from "@/components/Navigation";\nimport { Notifications } from "@/components/Notifications";\nimport { Button }'
        )
    
    # Sostituire navItems hardcoded con getNavItemsForRole
    if "const navItems = [" in content:
        content = re.sub(
            r'const navItems = \[[\s\S]*?\];',
            'const navItems = getNavItemsForRole(currentUser.role || "collaborator");',
            content,
            count=1
        )
    
    # Aggiungere componente Notifications nell'header
    if "<Button" in content and "Esci" in content and "Notifications" not in content:
        content = content.replace(
            '<Button\n                variant="outline"',
            '<Notifications />\n              <Button\n                variant="outline"'
        )
    
    with open(page, 'w') as f:
        f.write(content)
    
    print(f"✅ Aggiornato {page}")

print("\n✅ Tutte le pagine aggiornate con menu differenziato e notifiche!")
