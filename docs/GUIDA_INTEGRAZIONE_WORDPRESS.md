# 🚀 Guida all'Integrazione del Portale Assicurativo con WordPress

**Data:** 17 Ottobre 2025  
**Versione:** 1.0  
**Autore:** Manus AI

---

## 🎯 Introduzione

Questa guida fornisce istruzioni dettagliate per integrare il portale assicurativo, sviluppato in React, all'interno del Suo sito web WordPress esistente. Vengono presentate tre diverse modalità di integrazione, ognuna con i propri vantaggi e svantaggi, per permetterLe di scegliere la soluzione più adatta alle Sue esigenze.

### Prerequisiti

- Un sito WordPress funzionante con privilegi di amministratore.
- Il portale assicurativo deployato e accessibile tramite un URL pubblico (es. `https://portal.suodominio.it`).

---

## 📊 Tabella Comparativa delle Modalità

| Modalità | Facilità di Implementazione | Esperienza Utente | SEO | Vantaggi Principali | Svantaggi Principali |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **1. Iframe** | ⭐⭐⭐⭐⭐ (Molto Facile) | ⭐⭐⭐ (Buona) | ⭐ (Scarso) | Veloce, non richiede modifiche al codice. | Problemi di reattività, SEO limitato, URL non cambia. |
| **2. Link Diretto** | ⭐⭐⭐⭐ (Facile) | ⭐⭐⭐⭐ (Molto Buona) | ⭐⭐⭐⭐ (Buono) | Esperienza utente fluida, SEO preservato. | L'utente lascia il sito principale per andare sul portale. |
| **3. Plugin Custom**| ⭐⭐ (Complesso) | ⭐⭐⭐⭐⭐ (Eccellente) | ⭐⭐⭐⭐⭐ (Ottimo) | Integrazione perfetta, URL personalizzato. | Richiede sviluppo PHP, manutenzione complessa. |

---

## 1️⃣ Modalità 1: Integrazione tramite Iframe

Questa è la modalità più semplice e veloce. Consiste nell'incorporare il portale all'interno di una pagina WordPress utilizzando un tag HTML `<iframe>`.

### Vantaggi
- **Implementazione rapida:** si tratta di copiare e incollare un codice.
- **Nessuna modifica al codice:** non è necessario toccare il backend o il frontend.

### Svantaggi
- **SEO:** i motori di ricerca potrebbero non indicizzare correttamente il contenuto dell'iframe.
- **Reattività:** possono sorgere problemi di visualizzazione su dispositivi mobili.
- **URL:** l'URL nella barra degli indirizzi del browser non cambierà durante la navigazione nel portale.

### Istruzioni

1.  **Accedere alla Bacheca di WordPress.**
2.  **Creare una nuova Pagina:** Navigare su `Pagine > Aggiungi nuova`.
3.  **Assegnare un Titolo:** Ad esempio, "Area Riservata" o "Portale Assicurativo".
4.  **Passare all'Editor di Codice:**
    *   **Editor a Blocchi (Gutenberg):** Cliccare sul pulsante `+` e cercare il blocco "HTML personalizzato".
    *   **Editor Classico:** Cliccare sulla scheda "Testo" (invece di "Visuale").

5.  **Incollare il Codice Iframe:**
    Sostituire `URL_DEL_TUO_PORTALE` con l'URL pubblico dove è ospitato il portale.

    ```html
    <style>
      .portal-iframe {
        border: none;
        width: 100%;
        height: 100vh; /* Occupa l'intera altezza della finestra */
      }
    </style>

    <iframe 
      src="URL_DEL_TUO_PORTALE"
      class="portal-iframe"
      title="Portale Assicurativo"
    ></iframe>
    ```

6.  **Pubblicare la Pagina:** Cliccare su "Pubblica".

Ora, visitando la pagina creata, vedrà il portale assicurativo caricato al suo interno.

---

## 2️⃣ Modalità 2: Link Diretto da WordPress

Questa modalità prevede di creare un link dal menu di navigazione o da un pulsante del sito WordPress che punti direttamente all'URL del portale. Il portale sarà ospitato su un sottodominio (es. `portal.suodominio.it`).

### Vantaggi
- **Esperienza Utente Ottimale:** Il portale funziona nel suo ambiente nativo, senza le limitazioni di un iframe.
- **SEO:** Il sottodominio verrà indicizzato correttamente dai motori di ricerca.
- **Semplice da mantenere:** Non ci sono dipendenze complesse tra WordPress e il portale.

### Svantaggi
- **Percezione dell'Utente:** L'utente noterà il cambio di URL, percependo di aver lasciato il sito principale.

### Istruzioni

1.  **Deploy del Portale:** Assicurarsi che il portale sia deployato su un sottodominio (es. `https://portal.miosito.it`).
2.  **Accedere alla Bacheca di WordPress.**
3.  **Modificare il Menu di Navigazione:**
    *   Navigare su `Aspetto > Menu`.
    *   Nel riquadro "Aggiungi elementi al menu", selezionare "Link personalizzati".
    *   **URL:** Inserire l'URL completo del portale.
    *   **Testo del link:** Inserire il testo da visualizzare nel menu (es. "Area Clienti").
    *   Cliccare su "Aggiungi al menu".
4.  **Salvare il Menu:** Cliccare su "Salva menu".

In alternativa, è possibile inserire il link in un pulsante o in qualsiasi altra parte del sito utilizzando l'editor di WordPress.

---

## 3️⃣ Modalità 3: Integrazione tramite Plugin Custom (Avanzata)

Questa è la soluzione più professionale e complessa. Prevede la creazione di un piccolo plugin WordPress che funge da "proxy", mostrando il portale React sotto un URL del sito principale (es. `www.suodominio.it/portale/`).

### Vantaggi
- **Integrazione Perfetta:** L'utente non lascia mai il sito principale, l'URL è coerente.
- **SEO Eccellente:** Il contenuto viene percepito come parte integrante del sito WordPress.
- **Flessibilità:** Permette di passare dati tra WordPress e il portale (es. utente loggato).

### Svantaggi
- **Complessità:** Richiede conoscenze di sviluppo PHP per WordPress.
- **Manutenzione:** Il plugin deve essere mantenuto e aggiornato.

### Istruzioni (per sviluppatori)

1.  **Creare la Struttura del Plugin:**
    Creare una nuova cartella in `wp-content/plugins/` chiamata `portale-integrato`.
    Al suo interno, creare un file PHP chiamato `portale-integrato.php`.

2.  **Codice del Plugin:**
    Incollare il seguente codice nel file `portale-integrato.php`.

    ```php
    <?php
    /**
     * Plugin Name: Portale Assicurativo Integrato
     * Description: Integra il portale React all'interno di una pagina WordPress.
     * Version: 1.0
     * Author: Manus AI
     */

    // 1. Aggiungere una regola di rewrite per l'URL /portale/
    function portale_rewrite_rule() {
        add_rewrite_rule(
            '^portale/(.*)$',
            'index.php?portale_path=$matches[1]',
            'top'
        );
    }
    add_action('init', 'portale_rewrite_rule');

    // 2. Aggiungere la variabile 'portale_path' alle query vars di WordPress
    function portale_query_vars($vars) {
        $vars[] = 'portale_path';
        return $vars;
    }
    add_filter('query_vars', 'portale_query_vars');

    // 3. Intercettare la richiesta e mostrare il portale
    function portale_template_include($template) {
        if (get_query_var('portale_path') !== false) {
            // URL del portale React deployato
            $portal_url = 'URL_DEL_TUO_PORTALE';

            // Recupera il contenuto del portale
            $response = wp_remote_get($portal_url . '/' . get_query_var('portale_path'));

            if (is_wp_error($response)) {
                wp_die('Errore nel caricamento del portale.');
            }

            // Mostra il contenuto e termina l'esecuzione
            echo wp_remote_retrieve_body($response);
            exit;
        }
        return $template;
    }
    add_filter('template_include', 'portale_template_include');
    ```

3.  **Attivare il Plugin:**
    *   Andare su `Plugin > Plugin installati` nella bacheca di WordPress.
    *   Trovare "Portale Assicurativo Integrato" e cliccare su "Attiva".

4.  **Salvare i Permalink:**
    *   Andare su `Impostazioni > Permalink`.
    *   Senza modificare nulla, cliccare su "Salva le modifiche". Questo rigenera le regole di rewrite e attiva quella nuova.

5.  **Testare:**
    Visitare `www.tuosito.it/portale/`. Dovrebbe ora visualizzare il contenuto del portale React, mantenendo l'URL del sito principale.

---

## 🚀 Conclusione

La scelta della modalità di integrazione dipende dal Suo livello di comfort tecnico e dagli obiettivi di business. Per la maggior parte dei casi, il **Link Diretto (Modalità 2)** offre il miglior equilibrio tra semplicità e performance. Se l'integrazione perfetta è un requisito fondamentale, la **Modalità 3 (Plugin Custom)** è la strada da percorrere, sebbene richieda uno sforzo di sviluppo maggiore.

Per qualsiasi domanda, non esiti a contattare il supporto.

