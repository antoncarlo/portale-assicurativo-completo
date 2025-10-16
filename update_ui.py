import os
import re

# Nuovo header HTML per tutte le pagine
new_header = '''      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Portale Broker</h1>
                <p className="text-blue-200 text-xs">Gestione Polizze Assicurative</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">Admin Broker</p>
                <p className="text-blue-200 text-xs">admin@broker.it</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                AB
              </div>
            </div>
          </div>
        </div>
      </nav>'''

new_tabs = '''      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                    location === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>'''

pages = [
    'client/src/pages/Products.tsx',
    'client/src/pages/Policies.tsx',
    'client/src/pages/Claims.tsx',
    'client/src/pages/Questionari.tsx',
    'client/src/pages/NewPolicyWizard.tsx'
]

for page in pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            content = f.read()
        
        # Replace old header pattern
        content = re.sub(
            r'<nav className="bg-white shadow-sm border-b">.*?</nav>',
            new_header,
            content,
            flags=re.DOTALL
        )
        
        # Replace old tabs pattern  
        content = re.sub(
            r'<div className="bg-white border-b">.*?</div>\s*</div>\s*</div>',
            new_tabs,
            content,
            flags=re.DOTALL,
            count=1
        )
        
        with open(page, 'w') as f:
            f.write(content)
        
        print(f"✅ Updated {page}")

print("\n🎉 All pages updated with new UI!")
