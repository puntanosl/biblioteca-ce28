// service-worker.js
const CACHE_NAME = 'biblioteca-v9';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/firebase.js',
    './js/router.js',
    './js/state.js',
    './js/ui.js',
    './js/views.js',
    './manifest.json',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@500;700&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Estrategia: Network First con fallback a Cache
    // Idónea para datos dinámicos, pero para assets estáticos Stale-While-Revalidate es mejor.
    // Aquí usaremos una mezcla simple: Cache First para assets conocidos, Network para otros.

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Si está en caché, devuélvelo
            if (cachedResponse) return cachedResponse;

            // Si no, búscalo en red
            return fetch(e.request).catch(() => {
                // Si falla red (offline) y no está en caché:
                // Podríamos retornar un offline.html si existiera
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
