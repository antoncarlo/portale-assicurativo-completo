import os

# Fix Users.tsx - spostare currentUser dopo la definizione
with open("client/src/pages/Users.tsx", 'r') as f:
    content = f.read()

content = content.replace(
    "const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");",
    "// navItems will be defined after currentUser"
)

content = content.replace(
    "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");",
    "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");\n  const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");"
)

with open("client/src/pages/Users.tsx", 'w') as f:
    f.write(content)

# Fix Commissions.tsx
with open("client/src/pages/Commissions.tsx", 'r') as f:
    content = f.read()

content = content.replace(
    "const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");",
    "// navItems will be defined after currentUser"
)

content = content.replace(
    "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");",
    "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");\n  const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");"
)

with open("client/src/pages/Commissions.tsx", 'w') as f:
    f.write(content)

# Fix Questionari.tsx
with open("client/src/pages/Questionari.tsx", 'r') as f:
    content = f.read()

content = content.replace(
    "const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");",
    "// navItems will be defined after currentUser"
)

if "const currentUser" not in content:
    content = content.replace(
        "export default function Questionari() {",
        "export default function Questionari() {\n  const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");\n  const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");"
    )
else:
    content = content.replace(
        "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");",
        "const currentUser = JSON.parse(localStorage.getItem(\"currentUser\") || \"{}\");\n  const navItems = getNavItemsForRole(currentUser.role || \"collaborator\");"
    )

with open("client/src/pages/Questionari.tsx", 'w') as f:
    f.write(content)

print("✅ Errori TypeScript sistemati!")
