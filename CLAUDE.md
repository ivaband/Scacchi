# CLAUDE.md — Scacchi Regali

## Panoramica

App di scacchi online PWA. Tutta la logica (UI + motore scacchistico + Firebase) è contenuta in un **singolo file HTML** (`index.html`). Non ci sono framework, bundler o dipendenze npm lato frontend.

## File principali

- `index.html` — app completa in produzione (viene deployata su Firebase Hosting)
- `scacchi.html` — copia di sviluppo locale; serve per sperimentare senza toccare il file deployato. Le modifiche vanno poi riportate su `index.html`.
- `functions/index.js` — Cloud Functions Node.js (notifiche push FCM)
- `firebase.json` — config Hosting (public root = `.`, `scacchi.html` è in ignore)
- `service-worker.js` — cache PWA offline
- `firebase-messaging-sw.js` — Service Worker FCM per notifiche in background

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Frontend | HTML/CSS/JS vanilla (nessun framework) |
| Auth | Firebase Auth (email + password) |
| Database | Firestore (real-time listeners) |
| Hosting | Firebase Hosting |
| Push | FCM + Cloud Functions |
| PWA | Web App Manifest + Service Worker |

## Architettura JS (dentro index.html)

Il file è organizzato in sezioni commentate:

1. **CONFIG** — `firebaseConfig` con le chiavi del progetto
2. **CHESS ENGINE** — motore scacchistico completo (minimax + alpha-beta, PST, SAN)
3. **AUDIO** — Web Audio API per suoni di mossa/cattura/scacco
4. **SCREENS** — gestione navigazione tra schermate (Login, Lobby, Game, History, Replay)
5. **AUTH** — login/registrazione Firebase
6. **FCM** — richiesta permesso notifiche push
7. **LOBBY LISTENERS** — snapshot real-time Firestore per inviti e partite
8. **INVITE SEND/ACCEPT/DECLINE** — logica inviti
9. **GAME RESUME (online)** — ricarica partita online da Firestore
10. **LOCAL GAME SETUP** — partita locale (PvP / PvAI / AIvAI)
11. **BOARD RENDER & INTERACTION** — rendering scacchiera, click, mosse
12. **HISTORY** — storico partite completate
13. **REPLAY** — riproduzione mossa per mossa
14. **PWA** — registrazione SW, install prompt, iOS hint

## Variabili di stato partita (globali)

```js
board[]            // array 64 elementi, null o 'wP'/'bK' ecc.
turn               // 'w' | 'b'
selected           // indice casella selezionata o null
legalMoves[]       // mosse legali per il pezzo selezionato
gameOver           // boolean
flipped            // boolean, scacchiera capovolta
lastMoveSquares[]  // [from, to] dell'ultima mossa (per evidenziazione rossa)
moveHistory[]      // {san, color, num}
castlingRights     // {wK, wQ, bK, bQ}
enPassantTarget    // indice casella en passant o null
isOnlineMode       // boolean
myColor            // 'w' | 'b' (solo online)
currentGameId      // string Firestore (solo online)
```

## Evidenziazione ultima mossa

- `lastMoveSquares[0]` (partenza) → classe CSS `last-move-from` → sfondo rosso semitrasparente
- `lastMoveSquares[1]` (arrivo) → classe CSS `last-move-to` → bordo rosso inset via `box-shadow`

## Indici scacchiera

`sq(r, c) = r*8 + c` dove r=0 è la riga in alto (lato nero), r=7 è la riga in basso (lato bianco).  
Quando `flipped=true` la casella visuale `i` corrisponde all'indice logico `63-i`.

## Firebase — Progetto

- Project ID: `scacchi-b74ea`
- Hosting: `https://scacchi-b74ea.web.app`

## Comandi utili

```bash
firebase serve --only hosting   # server locale
firebase deploy --only hosting  # deploy solo frontend
firebase deploy --only functions # deploy solo functions
firebase deploy                 # deploy tutto
```

## Cosa NON è deployato

`scacchi.html`, `style.css`, `script.js` sono esplicitamente esclusi in `firebase.json`. Lavora sempre su `index.html` per le modifiche che vanno in produzione.
