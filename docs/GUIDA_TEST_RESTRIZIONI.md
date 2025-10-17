# 🧪 Guida Test Restrizioni Ruoli - Portale Assicurativo

**Data:** 17 Ottobre 2025, 08:01 AM  
**Versione Build:** 20251017080129

---

## 🔄 Importante: Cancellare la Cache del Browser

**Prima di testare, è FONDAMENTALE cancellare la cache del browser:**

### Chrome/Edge
1. Premere `Ctrl + Shift + Delete` (Windows/Linux) o `Cmd + Shift + Delete` (Mac)
2. Selezionare "Immagini e file memorizzati nella cache"
3. Cliccare "Cancella dati"

### Firefox
1. Premere `Ctrl + Shift + Delete` (Windows/Linux) o `Cmd + Shift + Delete` (Mac)
2. Selezionare "Cache"
3. Cliccare "Cancella adesso"

### Alternativa: Hard Refresh
- **Windows/Linux:** `Ctrl + Shift + R` o `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

### Alternativa: Modalità Incognito
Aprire il portale in una nuova finestra in incognito/privata

---

## 🔗 URL Portale

**https://3000-izlk8lc81sr7h13jzg7ki-5338d551.manusvm.computer/**

---

## 🧪 Test 1: Ruolo COLLABORATORE

### Credenziali
- **Username:** `collab1`
- **Password:** `collab123`

### ✅ Cosa DEVE Vedere/Fare
1. **Header in alto a destra:**
   - ✅ Nome: Laura Bianchi
   - ✅ Email: laura.bianchi@portalebroker.it
   - ✅ Ruolo: Collaboratore
   - ✅ Pulsante "Esci"

2. **Pagina Utenti:**
   - ✅ Vede SOLO se stesso nella lista (1 utente)
   - ✅ NON vede il pulsante "Crea Nuovo Utente"
   - ✅ NON vede i pulsanti "Modifica" e "Disattiva"

3. **Pagina Provvigioni:**
   - ✅ Colonna "%Provvigioni" (NON "Tasso")
   - ✅ Export Excel con colonna "%Provvigioni"

4. **Dettaglio Sinistro:**
   - ✅ Può VEDERE i sinistri
   - ✅ NON vede la sezione "Azioni Amministrative"
   - ✅ NON può approvare/rifiutare sinistri

5. **Dettaglio Polizza:**
   - ✅ Può VEDERE le polizze
   - ✅ NON vede pulsanti di modifica stato

### ❌ Cosa NON DEVE Vedere/Fare
- ❌ NON deve vedere altri utenti
- ❌ NON deve vedere il pulsante "Crea Nuovo Utente"
- ❌ NON deve vedere pulsanti "Approva Sinistro" o "Rifiuta Sinistro"
- ❌ NON deve poter cambiare lo stato delle polizze

---

## 🧪 Test 2: Ruolo AGENTE

### Credenziali
- **Username:** `agente1`
- **Password:** `agente123`

### ✅ Cosa DEVE Vedere/Fare
1. **Header in alto a destra:**
   - ✅ Nome: Mario Rossi
   - ✅ Email: mario.rossi@portalebroker.it
   - ✅ Ruolo: Agente
   - ✅ Pulsante "Esci"

2. **Pagina Utenti:**
   - ✅ Vede TUTTI gli utenti
   - ✅ Vede il pulsante "Crea Nuovo Utente"
   - ✅ Nel form di creazione, il campo "Ruolo" mostra SOLO "Collaboratore"

3. **Creazione Utente:**
   - ✅ Può creare SOLO utenti con ruolo "Collaboratore"
   - ✅ NON può selezionare "Agente" o "Admin" o "Master"

4. **Dettaglio Sinistro:**
   - ✅ Può VEDERE i sinistri
   - ✅ NON vede la sezione "Azioni Amministrative"
   - ✅ NON può approvare/rifiutare sinistri

5. **Inserimento Sinistro:**
   - ✅ Dopo aver inserito un sinistro, viene reindirizzato alla lista sinistri

### ❌ Cosa NON DEVE Vedere/Fare
- ❌ NON deve poter creare utenti Master o Admin
- ❌ NON deve vedere pulsanti "Approva Sinistro" o "Rifiuta Sinistro"

---

## 🧪 Test 3: Ruolo ADMIN

### Credenziali
- **Username:** `admin`
- **Password:** `admin123`

### ✅ Cosa DEVE Vedere/Fare
1. **Header in alto a destra:**
   - ✅ Nome: Amministratore
   - ✅ Email: admin@portalebroker.it
   - ✅ Ruolo: Amministratore
   - ✅ Pulsante "Esci"

2. **Pagina Utenti:**
   - ✅ Vede TUTTI gli utenti
   - ✅ Vede il pulsante "Crea Nuovo Utente"
   - ✅ Può creare utenti con ruolo "Agente", "Collaboratore", "Admin"

3. **Dettaglio Sinistro:**
   - ✅ Vede la sezione "Azioni Amministrative"
   - ✅ Può "Prendere in Carico" un sinistro
   - ✅ Può "Approvare" un sinistro (con importo)
   - ✅ Può "Rifiutare" un sinistro (con motivo)
   - ✅ Può segnare come "Pagato"

4. **Dettaglio Polizza:**
   - ✅ Può modificare lo stato delle polizze
   - ✅ Vede tutti i pulsanti di azione

### ✅ Accesso Completo
- ✅ Tutte le funzionalità disponibili
- ✅ Può gestire utenti, polizze, sinistri, documenti

---

## 📋 Checklist Rapida

### Per COLLABORATORE (collab1)
- [ ] Header con profilo e logout visibile
- [ ] Vede solo se stesso in Utenti
- [ ] NO pulsante "Crea Nuovo Utente"
- [ ] NO pulsanti "Modifica/Disattiva" utenti
- [ ] Colonna "%Provvigioni" (non "Tasso")
- [ ] NO pulsanti approvazione sinistri

### Per AGENTE (agente1)
- [ ] Header con profilo e logout visibile
- [ ] Vede tutti gli utenti
- [ ] Può creare SOLO Collaboratori
- [ ] NO pulsanti approvazione sinistri
- [ ] Redirect dopo inserimento sinistro

### Per ADMIN (admin)
- [ ] Header con profilo e logout visibile
- [ ] Vede tutti gli utenti
- [ ] Può creare Agenti, Collaboratori, Admin
- [ ] Può approvare/rifiutare sinistri
- [ ] Accesso completo a tutte le funzioni

---

## 🐛 Risoluzione Problemi

### Se le modifiche non sono visibili:

1. **Cancellare la cache del browser** (vedi sopra)
2. **Fare un hard refresh** (Ctrl+Shift+R)
3. **Aprire in modalità incognito**
4. **Verificare che il server sia aggiornato:**
   ```bash
   curl -s https://3000-izlk8lc81sr7h13jzg7ki-5338d551.manusvm.computer/ | grep -o "20251017"
   ```
   Dovrebbe mostrare la versione `20251017080129`

5. **Riavviare il browser completamente**

---

## 📞 Supporto

Se dopo aver cancellato la cache le restrizioni non funzionano ancora:
1. Fare uno screenshot della pagina problematica
2. Indicare quale utente sta usando (Collaboratore/Agente/Admin)
3. Descrivere cosa vede che non dovrebbe vedere

---

**Ultimo Aggiornamento:** 17 Ottobre 2025, 08:01 AM  
**Versione Build:** 20251017080129

