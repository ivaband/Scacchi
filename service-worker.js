const CACHE_APP = 'scacchi-pwa-v1';

const FILE_DA_METTERE_IN_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_APP).then(cache => cache.addAll(FILE_DA_METTERE_IN_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_APP)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(rispostaCache => {
            return rispostaCache || fetch(event.request).then(rispostaRete => {
                const copia = rispostaRete.clone();

                caches.open(CACHE_APP).then(cache => {
                    cache.put(event.request, copia);
                });

                return rispostaRete;
            }).catch(() => {
                return caches.match('./index.html');
            });
        })
    );
});