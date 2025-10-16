import os

# Fix Products.tsx
with open("client/src/pages/Products.tsx", 'r') as f:
    content = f.read()

if "getNavItemsForRole" not in content[:500]:
    content = content.replace(
        'import { Button }',
        'import { getNavItemsForRole } from "@/components/Navigation";\nimport { useAuth } from "@/_core/hooks/useAuth";\nimport { Button }'
    )

content = content.replace(
    'export default function Products() {',
    'export default function Products() {\n  const { user: currentUser } = useAuth();'
)

content = content.replace(
    'const navItems = getNavItemsForRole(currentUser.role || "collaborator");',
    ''
)

content = content.replace(
    'const { user: currentUser } = useAuth();',
    'const { user: currentUser } = useAuth();\n  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");'
)

with open("client/src/pages/Products.tsx", 'w') as f:
    f.write(content)

# Fix Policies.tsx
with open("client/src/pages/Policies.tsx", 'r') as f:
    content = f.read()

if "getNavItemsForRole" not in content[:500]:
    content = content.replace(
        'import { Button }',
        'import { getNavItemsForRole } from "@/components/Navigation";\nimport { useAuth } from "@/_core/hooks/useAuth";\nimport { Button }'
    )

if "const { user: currentUser }" not in content:
    content = content.replace(
        'export default function Policies() {',
        'export default function Policies() {\n  const { user: currentUser } = useAuth();\n  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");'
    )

with open("client/src/pages/Policies.tsx", 'w') as f:
    f.write(content)

# Fix Claims.tsx
with open("client/src/pages/Claims.tsx", 'r') as f:
    content = f.read()

if "getNavItemsForRole" not in content[:500]:
    content = content.replace(
        'import { Button }',
        'import { getNavItemsForRole } from "@/components/Navigation";\nimport { useAuth } from "@/_core/hooks/useAuth";\nimport { Button }'
    )

if "const { user: currentUser }" not in content:
    content = content.replace(
        'export default function Claims() {',
        'export default function Claims() {\n  const { user: currentUser } = useAuth();\n  const navItems = getNavItemsForRole(currentUser?.role || "collaborator");'
    )

with open("client/src/pages/Claims.tsx", 'w') as f:
    f.write(content)

print("✅ Tutti gli import sistemati!")
