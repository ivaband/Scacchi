# ♟ Scacchi Regali

App di scacchi online PWA costruita su Firebase (Hosting + Firestore + Auth + FCM).

---

## Prerequisiti

- [Node.js](https://nodejs.org/) v18+
- Firebase CLI: `npm install -g firebase-tools`
- Account Firebase con accesso al progetto `scacchi-b74ea`

---

## Avvio in locale

### 1. Login Firebase (solo la prima volta)

```bash
firebase login
```

### 2. Avviare il server locale (Hosting)

```bash
firebase serve --only hosting
```

Il sito sarà disponibile su `http://localhost:5000`.

> Il Service Worker e le notifiche push **non funzionano** su `localhost` non-HTTPS. Per testarle usa `firebase emulators:start`.

### 3. Emulatori completi (opzionale)

```bash
firebase emulators:start
```

Avvia Hosting, Firestore e Functions in locale. Console emulatori: `http://localhost:4000`.

---

## Deploy

### Deploy completo (Hosting + Functions)

```bash
firebase deploy
```

### Solo Hosting (frontend)

```bash
firebase deploy --only hosting
```

### Solo Cloud Functions

```bash
firebase deploy --only functions
```

oppure da dentro la cartella `functions/`:

```bash
npm run deploy
```

> Prima del primo deploy delle Functions installare le dipendenze:
> ```bash
> cd functions
> npm install
> ```

---

## Struttura del progetto

```
/
├── index.html              # App principale (file servito in produzione)
├── scacchi.html            # Copia di sviluppo locale (non deployata)
├── manifest.json           # PWA manifest
├── service-worker.js       # Service Worker per cache offline / PWA
├── firebase-messaging-sw.js # Service Worker per notifiche push FCM
├── icon-192.svg
├── icon-512.svg
├── firebase.json           # Configurazione Firebase Hosting
└── functions/
    ├── index.js            # Cloud Functions (notifiche mossa + invito)
    └── package.json
```

> `style.css` e `script.js` esistono nel repo ma non vengono deployati (l'app è self-contained in `index.html`).

---

## Firebase — Info progetto

| Campo | Valore |
|---|---|
| Project ID | `scacchi-b74ea` |
| Hosting URL | `https://scacchi-b74ea.web.app` |
| Auth | Email/Password |
| Database | Firestore |
| Push | FCM (Cloud Messaging) |
| Node runtime Functions | 18 |

---

## Cloud Functions

| Funzione | Trigger | Scopo |
|---|---|---|
| `onMoveMade` | `games/{gameId}` onUpdate | Notifica push al giocatore di turno |
| `onInviteCreated` | `invites/{inviteId}` onCreate | Notifica push all'invitato |

---

## Note PWA

- L'app è installabile su Android/Chrome tramite il banner automatico.
- Su iOS (Safari): **Condividi → Aggiungi a Home**.
- Le notifiche push richiedono che l'utente conceda il permesso dalla lobby.
