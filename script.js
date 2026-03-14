// ========== CONFIGURAZIONE ==========
let scacchiera = [];
let turnoBianco = true;
let casellaSelezionata = null;
let mossePossibili = [];
let storicoMosse = [];
let pezziCatturati = { bianchi: [], neri: [] };
let controComputer = false;
let computerStaPensando = false;
let difficolta = 2;
let statoArrocco = {
    reBiancoMosso: false,
    torreBiancaSinistraMossa: false,
    torreBiancaDestraMossa: false,
    reNeroMosso: false,
    torreNeraSinistraMossa: false,
    torreNeraDestraMossa: false
};
// Valori pezzi per l'IA
const VALORI_PEZZI = {
    'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
};

// Tabelle posizionali per l'IA (valori posizionali)
const TABELLE_POSIZIONALI = {
    'p': [ // Pedone - incentiva avanzare e centro
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    'n': [ // Cavallo - centro è meglio
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    'b': [ // Alfiere - diagonali lunghe
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    'r': [ // Torre - file aperte, 7a riga
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    'q': [ // Regina - flessibile
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    'k': [ // Re - sicurezza iniziale, attività finale
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ]
};

const PEZZI = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// ========== INIZIALIZZAZIONE ==========
function inizializzaScacchiera() {
    const posizioneIniziale = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
    ];
    
    scacchiera = posizioneIniziale.map(riga => [...riga]);
    turnoBianco = true;
    casellaSelezionata = null;
    mossePossibili = [];
    storicoMosse = [];
    pezziCatturati = { bianchi: [], neri: [] };
    computerStaPensando = false;

    statoArrocco = {
        reBiancoMosso: false,
        torreBiancaSinistraMossa: false,
        torreBiancaDestraMossa: false,
        reNeroMosso: false,
        torreNeraSinistraMossa: false,
        torreNeraDestraMossa: false
    };
    
    aggiornaDisplayCatturati();
    disegnaScacchiera();
    aggiornaTurno();
    mostraMessaggio('');
}

function cambiaModalita() {
    controComputer = document.getElementById('modalita').value === 'cpu';
    difficolta = parseInt(document.getElementById('difficolta').value);
    nuovaPartita();
}

// ========== DISEGNO ==========
function disegnaScacchiera() {
    const container = document.getElementById('scacchiera');
    container.innerHTML = '';
    
    // Controlla scacco per evidenziare
    const reSottoScacco = trovaReSottoScacco();
    
    for (let riga = 0; riga < 8; riga++) {
        for (let col = 0; col < 8; col++) {
            const casella = document.createElement('div');
            casella.className = 'casella';
            casella.classList.add((riga + col) % 2 === 0 ? 'bianca' : 'nera');
            casella.dataset.riga = riga;
            casella.dataset.col = col;
            
            const pezzo = scacchiera[riga][col];
            
            // Evidenzia re sotto scacco
            if (reSottoScacco && pezzo && pezzo.toLowerCase() === 'k' && 
                eBianco(pezzo) === turnoBianco) {
                casella.classList.add('scacco');
            }
            
            if (pezzo) {
                const span = document.createElement('span');
                span.className = 'pezzo';
                span.textContent = PEZZI[pezzo];
                span.style.color = eBianco(pezzo) ? '#2c3e50' : '#000';
                casella.appendChild(span);
            }
            
            if (casellaSelezionata && casellaSelezionata.riga === riga && 
                casellaSelezionata.col === col) {
                casella.classList.add('selezionata');
            }
            
            if (mossePossibili.some(m => m.riga === riga && m.col === col)) {
                casella.classList.add(scacchiera[riga][col] ? 'mangiare' : 'mossa-valida');
            }
            
            casella.onclick = () => clickCasella(riga, col);
            container.appendChild(casella);
        }
    }
}

// ========== LOGICA DI GIOCO ==========
function clickCasella(riga, col) {
    if (computerStaPensando || (controComputer && !turnoBianco)) return;
    
    const pezzo = scacchiera[riga][col];
    
    // Se ho selezionato e clicco su mossa valida
    if (casellaSelezionata && mossePossibili.some(m => m.riga === riga && m.col === col)) {
        eseguiMossa(casellaSelezionata, {riga, col});
        return;
    }
    
    // Deseleziona se clicco stesso pezzo
    if (casellaSelezionata && casellaSelezionata.riga === riga && 
        casellaSelezionata.col === col) {
        casellaSelezionata = null;
        mossePossibili = [];
        disegnaScacchiera();
        return;
    }
    
    // Seleziona nuovo pezzo
    if (pezzo && eBianco(pezzo) === turnoBianco) {
        casellaSelezionata = {riga, col};
        mossePossibili = calcolaMosseValide(riga, col, pezzo);
        disegnaScacchiera();
    }
}
function calcolaMosseValide(riga, col, pezzo, simula = false) {
    const mosse = [];
    const tipo = pezzo.toLowerCase();
    const isBianco = eBianco(pezzo);
    
    switch(tipo) {
        case 'p':
            const dir = isBianco ? -1 : 1;
            const partenza = isBianco ? 6 : 1;
            
            if (valido(riga + dir, col) && !scacchiera[riga + dir][col]) {
                mosse.push({riga: riga + dir, col: col});
                if (riga === partenza && !scacchiera[riga + 2*dir][col]) {
                    mosse.push({riga: riga + 2*dir, col: col});
                }
            }
            
            for (let dc of [-1, 1]) {
                const nr = riga + dir, nc = col + dc;
                if (valido(nr, nc)) {
                    const target = scacchiera[nr][nc];
                    if (target && eBianco(target) !== isBianco) {
                        mosse.push({riga: nr, col: nc});
                    }
                }
            }
            break;
            
        case 'r':
            aggiungiLineari(mosse, riga, col, [[0,1],[0,-1],[1,0],[-1,0]], isBianco);
            break;
            
        case 'n':
            for (let [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
                const nr = riga + dr, nc = col + dc;
                if (valido(nr, nc) && (!scacchiera[nr][nc] || eBianco(scacchiera[nr][nc]) !== isBianco)) {
                    mosse.push({riga: nr, col: nc});
                }
            }
            break;
            
        case 'b':
            aggiungiLineari(mosse, riga, col, [[1,1],[1,-1],[-1,1],[-1,-1]], isBianco);
            break;
            
        case 'q':
            aggiungiLineari(mosse, riga, col, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]], isBianco);
            break;
            
        case 'k':
            for (let dr of [-1,0,1]) {
                for (let dc of [-1,0,1]) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = riga + dr, nc = col + dc;
                    if (valido(nr, nc) && (!scacchiera[nr][nc] || eBianco(scacchiera[nr][nc]) !== isBianco)) {
                        mosse.push({riga: nr, col: nc});
                    }
                }
            }

            // Arrocco
            if (!simula) {
                const mosseArrocco = calcolaMosseArrocco(riga, col, isBianco);
                mosse.push(...mosseArrocco);
            }
            break;
    }
    
    // Filtra mosse che lasciano il re sotto scacco
    if (!simula) {
        return mosse.filter(m => !lasciaReSottoScacco(riga, col, m.riga, m.col, isBianco));
    }
    return mosse;
}

function aggiungiLineari(mosse, riga, col, dirs, isBianco) {
    for (let [dr, dc] of dirs) {
        let nr = riga + dr, nc = col + dc;
        while (valido(nr, nc)) {
            if (!scacchiera[nr][nc]) {
                mosse.push({riga: nr, col: nc});
            } else {
                if (eBianco(scacchiera[nr][nc]) !== isBianco) {
                    mosse.push({riga: nr, col: nc});
                }
                break;
            }
            nr += dr;
            nc += dc;
        }
    }
}

function valido(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function eBianco(p) { return p === p.toUpperCase(); }

function lasciaReSottoScacco(daR, daC, aR, aC, isBianco) {
    const pezzo = scacchiera[daR][daC];
    const target = scacchiera[aR][aC];

    let torreDa = null;
    let torreA = null;
    let torrePezzo = null;

    // Simula anche lo spostamento della torre se è arrocco
    if (pezzo && pezzo.toLowerCase() === 'k' && Math.abs(aC - daC) === 2) {
        if (aC === 6) { // arrocco corto
            torreDa = { riga: daR, col: 7 };
            torreA = { riga: daR, col: 5 };
        } else if (aC === 2) { // arrocco lungo
            torreDa = { riga: daR, col: 0 };
            torreA = { riga: daR, col: 3 };
        }

        if (torreDa && torreA) {
            torrePezzo = scacchiera[torreDa.riga][torreDa.col];
            scacchiera[torreA.riga][torreA.col] = torrePezzo;
            scacchiera[torreDa.riga][torreDa.col] = null;
        }
    }
    
    // Simula mossa re/pezzo
    scacchiera[aR][aC] = pezzo;
    scacchiera[daR][daC] = null;
    
    const sottoScacco = eSottoScacco(isBianco);
    
    // Ripristina
    scacchiera[daR][daC] = pezzo;
    scacchiera[aR][aC] = target;

    if (torreDa && torreA) {
        scacchiera[torreDa.riga][torreDa.col] = torrePezzo;
        scacchiera[torreA.riga][torreA.col] = null;
    }
    
    return sottoScacco;
}

function calcolaMosseArrocco(riga, col, isBianco) {
    const mosse = [];
    const pezzo = scacchiera[riga][col];

    if (!pezzo || pezzo.toLowerCase() !== 'k') return mosse;

    // Il re deve essere nella casella iniziale
    if (isBianco && (riga !== 7 || col !== 4)) return mosse;
    if (!isBianco && (riga !== 0 || col !== 4)) return mosse;

    // Il re non deve essere sotto scacco
    if (eSottoScacco(isBianco)) return mosse;

    if (isBianco) {
        // Arrocco corto bianco
        if (
            !statoArrocco.reBiancoMosso &&
            !statoArrocco.torreBiancaDestraMossa &&
            scacchiera[7][7] === 'R' &&
            !scacchiera[7][5] &&
            !scacchiera[7][6] &&
            !casellaSottoAttacco(7, 5, false) &&
            !casellaSottoAttacco(7, 6, false)
        ) {
            mosse.push({ riga: 7, col: 6, arrocco: 'corto' });
        }

        // Arrocco lungo bianco
        if (
            !statoArrocco.reBiancoMosso &&
            !statoArrocco.torreBiancaSinistraMossa &&
            scacchiera[7][0] === 'R' &&
            !scacchiera[7][1] &&
            !scacchiera[7][2] &&
            !scacchiera[7][3] &&
            !casellaSottoAttacco(7, 3, false) &&
            !casellaSottoAttacco(7, 2, false)
        ) {
            mosse.push({ riga: 7, col: 2, arrocco: 'lungo' });
        }
    } else {
        // Arrocco corto nero
        if (
            !statoArrocco.reNeroMosso &&
            !statoArrocco.torreNeraDestraMossa &&
            scacchiera[0][7] === 'r' &&
            !scacchiera[0][5] &&
            !scacchiera[0][6] &&
            !casellaSottoAttacco(0, 5, true) &&
            !casellaSottoAttacco(0, 6, true)
        ) {
            mosse.push({ riga: 0, col: 6, arrocco: 'corto' });
        }

        // Arrocco lungo nero
        if (
            !statoArrocco.reNeroMosso &&
            !statoArrocco.torreNeraSinistraMossa &&
            scacchiera[0][0] === 'r' &&
            !scacchiera[0][1] &&
            !scacchiera[0][2] &&
            !scacchiera[0][3] &&
            !casellaSottoAttacco(0, 3, true) &&
            !casellaSottoAttacco(0, 2, true)
        ) {
            mosse.push({ riga: 0, col: 2, arrocco: 'lungo' });
        }
    }

    return mosse;
}

function casellaSottoAttacco(riga, col, daParteDeiBianchi) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (!p) continue;
            if (eBianco(p) !== daParteDeiBianchi) continue;

            const tipo = p.toLowerCase();

            if (tipo === 'p') {
                const dir = eBianco(p) ? -1 : 1;
                if (r + dir === riga && (c - 1 === col || c + 1 === col)) {
                    return true;
                }
                continue;
            }

            if (tipo === 'k') {
                for (let dr of [-1, 0, 1]) {
                    for (let dc of [-1, 0, 1]) {
                        if (dr === 0 && dc === 0) continue;
                        if (r + dr === riga && c + dc === col) {
                            return true;
                        }
                    }
                }
                continue;
            }

            const mosse = calcolaMosseValide(r, c, p, true);
            if (mosse.some(m => m.riga === riga && m.col === col)) {
                return true;
            }
        }
    }
    return false;
}

function aggiornaStatoArroccoDopoMossa(pezzo, da, a, catturato) {
    if (pezzo === 'K') statoArrocco.reBiancoMosso = true;
    if (pezzo === 'k') statoArrocco.reNeroMosso = true;

    if (pezzo === 'R' && da.riga === 7 && da.col === 0) statoArrocco.torreBiancaSinistraMossa = true;
    if (pezzo === 'R' && da.riga === 7 && da.col === 7) statoArrocco.torreBiancaDestraMossa = true;
    if (pezzo === 'r' && da.riga === 0 && da.col === 0) statoArrocco.torreNeraSinistraMossa = true;
    if (pezzo === 'r' && da.riga === 0 && da.col === 7) statoArrocco.torreNeraDestraMossa = true;

    // Se una torre viene catturata nella sua casella iniziale
    if (catturato === 'R' && a.riga === 7 && a.col === 0) statoArrocco.torreBiancaSinistraMossa = true;
    if (catturato === 'R' && a.riga === 7 && a.col === 7) statoArrocco.torreBiancaDestraMossa = true;
    if (catturato === 'r' && a.riga === 0 && a.col === 0) statoArrocco.torreNeraSinistraMossa = true;
    if (catturato === 'r' && a.riga === 0 && a.col === 7) statoArrocco.torreNeraDestraMossa = true;
}
function eSottoScacco(isBianco) {
    // Trova re
    let reR, reC;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (p && p.toLowerCase() === 'k' && eBianco(p) === isBianco) {
                reR = r; reC = c;
                break;
            }
        }
    }
    
    // Controlla se qualche pezzo nemico può catturare il re
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (p && eBianco(p) !== isBianco) {
                const mosse = calcolaMosseValide(r, c, p, true);
                if (mosse.some(m => m.riga === reR && m.col === reC)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function trovaReSottoScacco() {
    return eSottoScacco(turnoBianco);
}

// ========== ESECUZIONE MOSSA ==========
function eseguiMossa(da, a, simulazione = false) {
    const pezzo = scacchiera[da.riga][da.col];
    const catturato = scacchiera[a.riga][a.col];

    const statoArroccoPrima = JSON.parse(JSON.stringify(statoArrocco));

    let arrocco = false;
    let torreDa = null;
    let torreA = null;
    let torrePezzo = null;

    if (pezzo && pezzo.toLowerCase() === 'k' && Math.abs(a.col - da.col) === 2) {
        arrocco = true;

        if (a.col === 6) {
            torreDa = { riga: da.riga, col: 7 };
            torreA = { riga: da.riga, col: 5 };
        } else if (a.col === 2) {
            torreDa = { riga: da.riga, col: 0 };
            torreA = { riga: da.riga, col: 3 };
        }

        torrePezzo = scacchiera[torreDa.riga][torreDa.col];
    }
    
    if (!simulazione) {
        storicoMosse.push({
            da: {...da},
            a: {...a},
            pezzo: pezzo,
            catturato: catturato,
            arrocco: arrocco,
            torreDa: torreDa ? {...torreDa} : null,
            torreA: torreA ? {...torreA} : null,
            torrePezzo: torrePezzo,
            statoArroccoPrima: statoArroccoPrima
        });
        
        if (catturato) {
            if (eBianco(catturato)) pezziCatturati.neri.push(catturato);
            else pezziCatturati.bianchi.push(catturato);
            aggiornaDisplayCatturati();
        }
    }
    
    scacchiera[a.riga][a.col] = pezzo;
    scacchiera[da.riga][da.col] = null;

    if (arrocco && torreDa && torreA) {
        scacchiera[torreA.riga][torreA.col] = scacchiera[torreDa.riga][torreDa.col];
        scacchiera[torreDa.riga][torreDa.col] = null;
    }
    
    // Promozione
    if (pezzo.toLowerCase() === 'p' && (a.riga === 0 || a.riga === 7)) {
        scacchiera[a.riga][a.col] = eBianco(pezzo) ? 'Q' : 'q';
    }

    aggiornaStatoArroccoDopoMossa(pezzo, da, a, catturato);
    
    if (!simulazione) {
        turnoBianco = !turnoBianco;
        casellaSelezionata = null;
        mossePossibili = [];
        
        disegnaScacchiera();
        aggiornaTurno();
        
        // Controlla fine partita
        if (controllaScaccoMatto()) {
            mostraMessaggio('SCACCO MATTO! ' + (turnoBianco ? 'Nero' : 'Bianco') + ' vince! 🎉');
            return;
        } else if (eSottoScacco(turnoBianco)) {
            mostraMessaggio('SCACCO! ⚠️');
        } else if (controllaPatta()) {
            mostraMessaggio('PATTA! 🤝');
            return;
        } else {
            mostraMessaggio('');
        }
        
        // Turno computer
        if (controComputer && !turnoBianco) {
            setTimeout(() => mossaComputer(), 500);
        }
    }
}

function controllaScaccoMatto() {
    // Se non è sotto scacco, non è matto
    if (!eSottoScacco(turnoBianco)) return false;
    
    // Controlla se c'è qualche mossa legale
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (p && eBianco(p) === turnoBianco) {
                const mosse = calcolaMosseValide(r, c, p);
                if (mosse.length > 0) return false;
            }
        }
    }
    return true;
}

function controllaPatta() {
    // Stallo (nessuna mossa ma non sotto scacco)
    if (!eSottoScacco(turnoBianco)) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = scacchiera[r][c];
                if (p && eBianco(p) === turnoBianco) {
                    const mosse = calcolaMosseValide(r, c, p);
                    if (mosse.length > 0) return false;
                }
            }
        }
        return true;
    }
    return false;
}

// ========== INTELLIGENZA ARTIFICIALE ==========
function mossaComputer() {
    computerStaPensando = true;
    document.getElementById('pensiero').style.display = 'block';
    
    setTimeout(() => {
        const profondita = difficolta === 1 ? 2 : (difficolta === 2 ? 3 : 4);
        const mossa = trovaMossaMigliore(false, profondita);
        
        if (mossa) {
            eseguiMossa(mossa.da, mossa.a);
        }
        
        computerStaPensando = false;
        document.getElementById('pensiero').style.display = 'none';
    }, 100);
}

function trovaMossaMigliore(isBianco, profondita) {
    let migliore = null;
    let migliorValore = isBianco ? -Infinity : Infinity;
    
    const tutteMosse = getTutteMosse(isBianco);
    
    // Ordina mosse per catture prima (ottimizzazione)
    tutteMosse.sort((a, b) => {
        const valA = scacchiera[a.a.riga][a.a.col] ? 1 : 0;
        const valB = scacchiera[b.a.riga][b.a.col] ? 1 : 0;
        return valB - valA;
    });
    
    for (let mossa of tutteMosse) {
        // Simula
        const pezzo = scacchiera[mossa.da.riga][mossa.da.col];
        const target = scacchiera[mossa.a.riga][mossa.a.col];
        
        scacchiera[mossa.a.riga][mossa.a.col] = pezzo;
        scacchiera[mossa.da.riga][mossa.da.col] = null;
        
        // Promozione
        let promosso = false;
        if (pezzo.toLowerCase() === 'p' && (mossa.a.riga === 0 || mossa.a.riga === 7)) {
            scacchiera[mossa.a.riga][mossa.a.col] = isBianco ? 'Q' : 'q';
            promosso = true;
        }
        
        const valore = minimax(!isBianco, profondita - 1, -Infinity, Infinity);
        
        // Ripristina
        scacchiera[mossa.da.riga][mossa.da.col] = pezzo;
        scacchiera[mossa.a.riga][mossa.a.col] = target;
        
        if (isBianco && valore > migliorValore) {
            migliorValore = valore;
            migliore = mossa;
        } else if (!isBianco && valore < migliorValore) {
            migliorValore = valore;
            migliore = mossa;
        }
    }
    
    return migliore;
}

function minimax(isBianco, profondita, alpha, beta) {
    if (profondita === 0) return valutaPosizione();
    
    const tutteMosse = getTutteMosse(isBianco);
    if (tutteMosse.length === 0) {
        if (eSottoScacco(isBianco)) return isBianco ? -100000 : 100000;
        return 0; // Patta
    }
    
    if (isBianco) {
        let maxVal = -Infinity;
        for (let mossa of tutteMosse) {
            const val = simulaValutaMossa(mossa, isBianco, profondita, alpha, beta);
            maxVal = Math.max(maxVal, val);
            alpha = Math.max(alpha, val);
            if (beta <= alpha) break;
        }
        return maxVal;
    } else {
        let minVal = Infinity;
        for (let mossa of tutteMosse) {
            const val = simulaValutaMossa(mossa, isBianco, profondita, alpha, beta);
            minVal = Math.min(minVal, val);
            beta = Math.min(beta, val);
            if (beta <= alpha) break;
        }
        return minVal;
    }
}

function simulaValutaMossa(mossa, isBianco, profondita, alpha, beta) {
    const pezzo = scacchiera[mossa.da.riga][mossa.da.col];
    const target = scacchiera[mossa.a.riga][mossa.a.col];
    
    scacchiera[mossa.a.riga][mossa.a.col] = pezzo;
    scacchiera[mossa.da.riga][mossa.da.col] = null;
    
    let promosso = false;
    if (pezzo.toLowerCase() === 'p' && (mossa.a.riga === 0 || mossa.a.riga === 7)) {
        scacchiera[mossa.a.riga][mossa.a.col] = isBianco ? 'Q' : 'q';
        promosso = true;
    }
    
    const valore = minimax(!isBianco, profondita - 1, alpha, beta);
    
    scacchiera[mossa.da.riga][mossa.da.col] = pezzo;
    scacchiera[mossa.a.riga][mossa.a.col] = target;
    
    return valore;
}

function getTutteMosse(isBianco) {
    const mosse = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (p && eBianco(p) === isBianco) {
                const valide = calcolaMosseValide(r, c, p);
                for (let m of valide) {
                    mosse.push({da: {riga: r, col: c}, a: m});
                }
            }
        }
    }
    return mosse;
}

function valutaPosizione() {
    let valore = 0;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = scacchiera[r][c];
            if (p) {
                const tipo = p.toLowerCase();
                const valPezzo = VALORI_PEZZI[tipo];
                const posVal = TABELLE_POSIZIONALI[tipo][eBianco(p) ? r : (7-r)][c];
                
                if (eBianco(p)) {
                    valore += valPezzo + posVal;
                } else {
                    valore -= valPezzo + posVal;
                }
            }
        }
    }
    
    // Bonus per mobilità
    const mobilitaBianco = getTutteMosse(true).length;
    const mobilitaNero = getTutteMosse(false).length;
    valore += (mobilitaBianco - mobilitaNero) * 10;
    
    return valore;
}

// ========== UTILITÀ ==========
function suggerimentoMossa() {
    if (computerStaPensando || !turnoBianco) return;
    
    const mossa = trovaMossaMigliore(true, 3);
    if (mossa) {
        // Evidenzia suggerimento
        const caselle = document.querySelectorAll('.casella');
        caselle.forEach(c => c.classList.remove('suggerimento'));
        
        const daIndex = mossa.da.riga * 8 + mossa.da.col;
        const aIndex = mossa.a.riga * 8 + mossa.a.col;
        
        caselle[daIndex].classList.add('suggerimento');
        caselle[aIndex].classList.add('suggerimento');
        
        mostraMessaggio('Suggerimento: muovi il pezzo evidenziato in arancione');
        
        setTimeout(() => {
            caselle.forEach(c => c.classList.remove('suggerimento'));
        }, 3000);
    }
}
function annullaMossa() {
    if (computerStaPensando || storicoMosse.length === 0) return;
    
    const daAnnullare = controComputer && storicoMosse.length >= 2 ? 2 : 1;
    
    for (let i = 0; i < daAnnullare; i++) {
        if (storicoMosse.length === 0) break;
        
        const mossa = storicoMosse.pop();

        scacchiera[mossa.da.riga][mossa.da.col] = mossa.pezzo;
        scacchiera[mossa.a.riga][mossa.a.col] = mossa.catturato;

        if (mossa.arrocco && mossa.torreDa && mossa.torreA) {
            scacchiera[mossa.torreDa.riga][mossa.torreDa.col] = mossa.torrePezzo;
            scacchiera[mossa.torreA.riga][mossa.torreA.col] = null;
        }
        
        if (mossa.catturato) {
            if (eBianco(mossa.catturato)) pezziCatturati.neri.pop();
            else pezziCatturati.bianchi.pop();
        }

        if (mossa.statoArroccoPrima) {
            statoArrocco = JSON.parse(JSON.stringify(mossa.statoArroccoPrima));
        }
        
        turnoBianco = !turnoBianco;
    }
    
    aggiornaDisplayCatturati();
    casellaSelezionata = null;
    mossePossibili = [];
    mostraMessaggio(daAnnullare > 1 ? 'Mosse annullate (tua e del computer)' : 'Mossa annullata');
    disegnaScacchiera();
    aggiornaTurno();
}

function nuovaPartita() {
    inizializzaScacchiera();
    mostraMessaggio('Nuova partita! Buona fortuna 🍀');
}

function aggiornaTurno() {
    const testo = controComputer 
        ? (turnoBianco ? 'Turno: Bianco (Tu)' : 'Turno: Nero (Computer)')
        : ('Turno: ' + (turnoBianco ? 'Bianco' : 'Nero'));
    document.getElementById('turno').textContent = testo;
}

function mostraMessaggio(msg) {
    document.getElementById('messaggio').textContent = msg;
}

function aggiornaDisplayCatturati() {
    document.getElementById('catturati-bianchi').textContent = 
        pezziCatturati.bianchi.map(p => PEZZI[p.toUpperCase()]).join(' ') || '-';
    document.getElementById('catturati-neri').textContent = 
        pezziCatturati.neri.map(p => PEZZI[p]).join(' ') || '-';
}

// Avvia
inizializzaScacchiera();

let eventoInstallazioneDifferita = null;

function registraServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                await navigator.serviceWorker.register('./service-worker.js');
                console.log('Service Worker registrato correttamente');
            } catch (errore) {
                console.error('Errore registrazione Service Worker:', errore);
            }
        });
    }
}

function inizializzaInstallazionePwa() {
    const bottoneInstalla = document.getElementById('btn-installa');
    if (!bottoneInstalla) return;

    window.addEventListener('beforeinstallprompt', (evento) => {
        evento.preventDefault();
        eventoInstallazioneDifferita = evento;
        bottoneInstalla.style.display = 'inline-block';
    });

    bottoneInstalla.addEventListener('click', async () => {
        if (!eventoInstallazioneDifferita) return;

        eventoInstallazioneDifferita.prompt();
        const sceltaUtente = await eventoInstallazioneDifferita.userChoice;

        if (sceltaUtente.outcome === 'accepted') {
            console.log('App installata');
        } else {
            console.log('Installazione annullata');
        }

        eventoInstallazioneDifferita = null;
        bottoneInstalla.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA installata con successo');
        eventoInstallazioneDifferita = null;
        bottoneInstalla.style.display = 'none';
        mostraMessaggio('App installata sul dispositivo ✅');
    });
}

registraServiceWorker();
inizializzaInstallazionePwa();