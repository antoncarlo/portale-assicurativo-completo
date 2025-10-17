# 🏗️ Architettura del Sistema e Credenziali di Accesso

**Data:** 17 Ottobre 2025  
**Versione:** 1.0  
**Autore:** Manus AI

---

## 🏛️ Architettura Generale

Il portale assicurativo è stato sviluppato seguendo un'architettura moderna a microservizi, con una netta separazione tra il frontend (l'interfaccia utente) e il backend (la logica di business e la gestione dei dati).

```mermaid
graph TD
    A[Browser Utente] -->|HTTPS| B(Frontend: React + Vite)
    B -->|API tRPC| C(Backend: Node.js + Express)
    C --> D{Database: MySQL}
    C --> E[Servizi Esterni]

    subgraph "Infrastruttura Cloud"
        B
        C
        D
        E
    end
```

### Componenti Principali

1.  **Frontend (Client-side):**
    *   **Framework:** [React 18](https://react.dev/)
    *   **Build Tool:** [Vite](https://vitejs.dev/) - Per un'esperienza di sviluppo ultra-veloce e una build di produzione ottimizzata.
    *   **Linguaggio:** [TypeScript](https://www.typescriptlang.org/) - Per un codice più robusto e manutenibile.
    *   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) - Una collezione di componenti UI riutilizzabili e accessibili.
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Un framework CSS utility-first per un design rapido e personalizzato.
    *   **Routing:** [Wouter](https://github.com/molefrog/wouter) - Una libreria di routing minimalista per React.

2.  **Backend (Server-side):**
    *   **Runtime:** [Node.js](https://nodejs.org/)
    *   **Framework:** [Express.js](https://expressjs.com/) - Per la gestione delle richieste HTTP e delle API.
    *   **API Layer:** [tRPC](https://trpc.io/) - Permette di creare API type-safe senza la necessità di generare schemi o client.
    *   **Linguaggio:** [TypeScript](https://www.typescriptlang.org/)

3.  **Database:**
    *   **Sistema:** [MySQL](https://www.mysql.com/) (compatibile anche con PostgreSQL o SQLite).
    *   **ORM (Object-Relational Mapping):** [Drizzle ORM](https://orm.drizzle.team/) - Un ORM TypeScript-first leggero e performante per interagire con il database.
    *   **Gestione Schema:** Drizzle Kit viene utilizzato per gestire le migrazioni e mantenere lo schema del database sincronizzato con il codice.

---

## 🔑 Credenziali di Accesso

Di seguito sono riportate le credenziali di accesso per i vari ambienti e servizi utilizzati nel progetto. **Si raccomanda di cambiare tutte le password di default al primo accesso.**

### Portale Assicurativo (Accesso Utenti Demo)

| Ruolo | Username | Password | Note |
| :--- | :--- | :--- | :--- |
| **Master** | `master` | `master123` | Accesso completo a tutte le funzionalità. |
| **Admin** | `admin` | `admin123` | Gestione utenti e configurazioni di sistema. |
| **Agente** | `agente` | `agente123` | Gestione delle proprie polizze e clienti. |
| **Collaboratore**| `collaboratore`| `collaboratore123`| Accesso in sola lettura o limitato. |

### Database (MySQL)

Queste sono le credenziali di default configurate nel file `.env`. È **fondamentale** cambiarle in un ambiente di produzione.

- **Host:** `localhost` (o l'IP del server del database)
- **Porta:** `3306`
- **Utente:** `user_portale`
- **Password:** `password_molto_sicura_da_cambiare`
- **Nome Database:** `db_portale_assicurativo`

**Stringa di Connessione (nel file `.env`):**
```
DATABASE_URL="mysql://user_portale:password_molto_sicura_da_cambiare@localhost:3306/db_portale_assicurativo"
```

### Repository GitHub

- **URL Repository:** `https://github.com/tuo-username/portale-assicurativo-live.git`
- **Accesso:** Tramite il Suo account GitHub personale.
- **Token di Deploy (se configurato):** `ghp_xxxxxxxxxxxxxxxxxxxx` (da generare nelle impostazioni di GitHub per deploy automatici).

### Server di Produzione (Esempio VPS)

Le credenziali dipendono dal provider scelto (es. DigitalOcean, AWS, Aruba Cloud).

- **Metodo di Accesso:** SSH (Secure Shell)
- **Indirizzo IP:** `XX.XX.XX.XX`
- **Utente:** `root` o un utente con privilegi `sudo` (es. `ubuntu`).
- **Autenticazione:**
    - **Password:** `password_del_server_da_cambiare` (sconsigliato)
    - **Chiave SSH:** Metodo più sicuro. La Sua chiave pubblica (`~/.ssh/id_rsa.pub`) deve essere aggiunta al file `~/.ssh/authorized_keys` del server.

**Comando di Accesso SSH:**
```bash
ssh root@XX.XX.XX.XX
```

---

## ⚙️ Variabili d'Ambiente (`.env`)

Il file `.env` è cruciale per la configurazione del sistema. Contiene tutte le informazioni sensibili e le impostazioni specifiche dell'ambiente.

**Esempio di file `.env`:**

```env
# URL del Database
DATABASE_URL="mysql://user_portale:password_molto_sicura_da_cambiare@localhost:3006/db_portale_assicurativo"

# Segreto per la firma dei JSON Web Token (JWT) per l'autenticazione
# Cambiare con una stringa casuale e molto lunga
JWT_SECRET="un_segreto_molto_lungo_e_difficile_da_indovinare"

# URL pubblico del frontend (usato per CORS e redirect)
PUBLIC_URL="https://portal.suodominio.it"

# Impostazioni per l'invio di email (opzionale)
SMTP_HOST="smtp.server.com"
SMTP_PORT=587
SMTP_USER="tua_email@server.com"
SMTP_PASS="tua_password_email"

# Modalità del server (development o production)
NODE_ENV="production"
```

**IMPORTANTE:** Il file `.env` non deve **MAI** essere committato su GitHub. È incluso nel file `.gitignore` per prevenire la pubblicazione accidentale di credenziali.

---

## 🚀 Istruzioni di Installazione e Deployment

Una guida dettagliata per il deployment è fornita nel file `README_COMPLETO.md` presente nell'archivio del codice sorgente. I passaggi principali includono:

1.  **Clonare il Repository:** `git clone ...`
2.  **Installare le Dipendenze:** `pnpm install`
3.  **Configurare il File `.env`:** Creare il file `.env` e inserire le proprie credenziali.
4.  **Applicare le Migrazioni del Database:** `pnpm db:push`
5.  **Eseguire il Seed del Database (opzionale):** `pnpm db:seed` per popolare il database con dati di esempio.
6.  **Build del Progetto per la Produzione:** `pnpm build`
7.  **Avviare il Server:** `pnpm start` (utilizzando un process manager come `pm2` per la produzione).

Per istruzioni più dettagliate, fare riferimento alla documentazione completa.

