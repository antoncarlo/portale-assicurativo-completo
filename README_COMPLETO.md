# 🛡️ Portale Assicurativo Completo

**Sistema professionale di gestione polizze assicurative per broker wholesale**

Repository: https://github.com/antoncarlo/portale-assicurativo-completo

---

## 📋 Panoramica

Portale web completo per la gestione di polizze assicurative, sinistri, provvigioni e comunicazioni tra broker master e agenti/collaboratori.

### ✨ Funzionalità Principali

- ✅ **Sistema Autenticazione** - Login/logout con password hash bcrypt
- ✅ **Gestione Utenti** - CRUD completo con ruoli (Master, Admin, Agente, Collaboratore)
- ✅ **7 Prodotti Assicurativi Specializzati**
  - CAR + Decennale Postuma
  - IAR Fotovoltaico
  - RC Edili e Industriali
  - Multirischio Esercizi Commerciali
  - Polizza PET
  - Multirischio Casa e Famiglia
  - Fidejussioni
- ✅ **Gestione Polizze** - Workflow completo con wizard multi-step
- ✅ **Gestione Sinistri** - 6 stati workflow (Segnalato → Chiuso)
- ✅ **Sistema Comunicazioni** - Note e documenti integrati per polizza
- ✅ **Gestione Provvigioni** - Dashboard personale e storico
- ✅ **Libreria Questionari** - 8 PDF/Word scaricabili
- ✅ **Upload Documenti** - Integrazione S3 con drag & drop
- ✅ **Notifiche In-App** - Sistema notifiche real-time
- ✅ **Export Excel** - Report esportabili

---

## 🏗️ Architettura

### Stack Tecnologico

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- tRPC per API type-safe
- Wouter per routing

**Backend:**
- Node.js + Express
- tRPC 11
- Drizzle ORM
- MySQL/TiDB database
- bcrypt per password hashing

**Storage:**
- S3 per documenti

---

## 📊 Database Schema

### Tabelle Principali

1. **users** - Utenti con ruoli e provvigioni
2. **product_types** - 7 prodotti assicurativi
3. **policies** - Polizze assicurative
4. **policy_data** - Dati questionari compilati
5. **policy_communications** - Note e documenti per polizza
6. **claims** - Sinistri
7. **documents** - Documenti caricati
8. **commissions** - Provvigioni
9. **notifications** - Notifiche utenti

---

## 🚀 Installazione

### Prerequisiti

- Node.js 22+
- pnpm
- Database MySQL/TiDB

### Setup

```bash
# 1. Clona il repository
git clone https://github.com/antoncarlo/portale-assicurativo-completo.git
cd portale-assicurativo-completo

# 2. Installa dipendenze
pnpm install

# 3. Configura variabili ambiente
cp .env.example .env
# Modifica .env con le tue configurazioni

# 4. Applica schema database
pnpm db:push

# 5. Popola dati demo (opzionale)
pnpm tsx scripts/seed-data.ts

# 6. Avvia il server
pnpm dev
```

Il portale sarà accessibile su `http://localhost:3000`

---

## 👥 Utenti Demo

Dopo aver eseguito lo script di seed:

| Username | Password | Ruolo | Descrizione |
|----------|----------|-------|-------------|
| admin | admin123 | Master | Accesso completo |
| agente1 | agente123 | Agente | Gestione polizze |
| collab1 | collab123 | Collaboratore | Accesso limitato |

---

## 📁 Struttura Progetto

```
portale-assicurativo-completo/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Pagine principali
│   │   ├── components/       # Componenti riutilizzabili
│   │   ├── lib/              # Utility e configurazioni
│   │   └── utils/            # Helper functions
│   └── public/               # Asset statici
├── server/                    # Backend Express + tRPC
│   ├── _core/                # Core framework
│   ├── db.ts                 # Query database
│   └── routers.ts            # API routes
├── drizzle/                   # Schema database
│   └── schema.ts
├── shared/                    # Codice condiviso
└── storage/                   # Helper S3
```

---

## 🔐 Variabili Ambiente

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT
JWT_SECRET=your-secret-key

# OAuth (Manus)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App
VITE_APP_TITLE=Portale Assicurativo
VITE_APP_LOGO=https://your-logo-url.com/logo.png

# S3 Storage
BUILT_IN_FORGE_API_URL=your-s3-api-url
BUILT_IN_FORGE_API_KEY=your-s3-api-key

# Owner
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
```

---

## 🎯 Workflow Utenti

### Master/Admin
1. Riceve notifiche nuove pratiche
2. Visualizza tutte le polizze/sinistri
3. Approva/rifiuta richieste
4. Gestisce utenti e provvigioni
5. Accede a statistiche complete

### Agente
1. Crea richieste polizze (wizard)
2. Carica documenti
3. Apre sinistri
4. Visualizza sue provvigioni
5. Riceve notifiche da master

### Collaboratore
1. Accesso limitato
2. Visualizza solo sue pratiche
3. Carica documenti

---

## 📱 Sezioni Portale

1. **Dashboard** - KPI e statistiche
2. **Prodotti** - 7 prodotti con questionari
3. **Polizze** - Gestione completa con comunicazioni
4. **Sinistri** - Workflow 6 stati
5. **Questionari** - Libreria scaricabile
6. **Utenti** - CRUD utenti (solo Master/Admin)
7. **Provvigioni** - Dashboard personale

---

## 🔄 Workflow Polizze

1. **Agente crea richiesta** → Stato: "Richiesta Quotazione"
2. **Master riceve notifica** → Apre pratica
3. **Master lavora pratica** → Stato: "In Quotazione"
4. **Master approva/rifiuta** → Notifica agente
5. **Polizza emessa** → Stato: "Emessa"
6. **Comunicazioni continue** → Note e documenti integrati

---

## 🔄 Workflow Sinistri

1. **Agente segnala sinistro** → Stato: "Segnalato"
2. **Master prende in carico** → Stato: "In Revisione"
3. **Master approva** → Stato: "Approvato" + importo
4. **Pagamento effettuato** → Stato: "Pagato"
5. **Chiusura pratica** → Stato: "Chiuso"

---

## 📊 API Endpoints (tRPC)

### Auth
- `auth.login` - Login utente
- `auth.register` - Registrazione
- `auth.me` - Utente corrente
- `auth.logout` - Logout

### Policies
- `policies.getAll` - Lista polizze
- `policies.getById` - Dettaglio polizza
- `policies.create` - Crea polizza
- `policies.updateStatus` - Aggiorna stato
- `policies.getCommunications` - Timeline comunicazioni
- `policies.addCommunication` - Aggiungi nota/documento

### Claims
- `claims.getAll` - Lista sinistri
- `claims.getById` - Dettaglio sinistro
- `claims.create` - Crea sinistro
- `claims.updateStatus` - Aggiorna stato

### Users
- `users.getAll` - Lista utenti
- `users.create` - Crea utente
- `users.update` - Aggiorna utente
- `users.delete` - Elimina utente

### Commissions
- `commissions.getMy` - Provvigioni personali
- `commissions.getAll` - Tutte provvigioni (admin)

---

## 🎨 Design System

- **Colori Primari:** Blu (#1E40AF) per fiducia
- **Tipografia:** Inter font family
- **Componenti:** shadcn/ui + Tailwind
- **Responsive:** Mobile-first design
- **Accessibilità:** WCAG 2.1 AA compliant

---

## 🚀 Deployment

### Opzione 1: Docker

```bash
docker-compose up -d
```

### Opzione 2: Manuale

```bash
# Build frontend
pnpm build

# Avvia server produzione
NODE_ENV=production pnpm start
```

### Opzione 3: Vercel/Netlify

Segui la guida nella documentazione

---

## 📝 TODO / Roadmap

- [ ] Integrazione WordPress plugin
- [ ] Email automatiche (nodemailer)
- [ ] Report PDF avanzati
- [ ] Dashboard analytics avanzata
- [ ] App mobile (React Native)
- [ ] Integrazione blockchain per fidejussioni
- [ ] Multi-lingua (i18n)
- [ ] Dark mode
- [ ] Test automatizzati (Vitest)

---

## 🤝 Contributi

Contributi benvenuti! Per favore:
1. Fork il repository
2. Crea un branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit (`git commit -am 'Aggiunge nuova funzionalità'`)
4. Push (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

---

## 📄 Licenza

Proprietario: Anton Carlo  
Tutti i diritti riservati.

---

## 📞 Supporto

Per domande o supporto:
- Email: antoncarlo1995@gmail.com
- GitHub Issues: https://github.com/antoncarlo/portale-assicurativo-completo/issues

---

## 🎉 Crediti

Sviluppato con ❤️ per broker wholesale professionisti

**Tecnologie utilizzate:**
- React, TypeScript, Tailwind CSS
- tRPC, Drizzle ORM
- shadcn/ui components
- Manus Platform

---

**Versione:** 1.0.0  
**Data:** Ottobre 2025  
**Autore:** Anton Carlo

