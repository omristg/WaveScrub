// WaveScrub service worker: network-first, falling back to cache so the app opens offline.
const CACHE = 'wavescrub-v2';
// Holds files received via the Web Share Target until the page picks them up.
const SHARE_CACHE = 'wavescrub-share-inbox';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== SHARE_CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Android "Share to WaveScrub": the OS POSTs the shared file(s) to ./share-target (see manifest share_target).
// Stash them in a cache, then redirect to the app, which picks them up and adds them to the library.
async function handleShareTarget(request) {
    const appUrl = new URL('./?shared=1', self.registration.scope).href;
    try {
        const form = await request.formData();
        const files = form.getAll('audio').filter((f) => f && typeof f === 'object' && f.size > 0);
        const inbox = await caches.open(SHARE_CACHE);
        // Clear anything left over from a previous share that was never consumed.
        for (const key of await inbox.keys()) await inbox.delete(key);
        await Promise.all(files.map((file, i) => inbox.put(
            new Request(new URL(`./__shared__/${Date.now()}-${i}`, self.registration.scope).href),
            new Response(file, {
                headers: {
                    'Content-Type': file.type || 'application/octet-stream',
                    'X-File-Name': encodeURIComponent(file.name || `shared-audio-${i + 1}`),
                    'X-File-Order': String(i)
                }
            })
        )));
    } catch (err) {
        console.warn('Share target handling failed:', err);
    }
    return Response.redirect(appUrl, 303);
}

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method === 'POST' && new URL(req.url).pathname.endsWith('/share-target')) {
        e.respondWith(handleShareTarget(req));
        return;
    }
    // Only cache GETs over http(s); API calls (POST) and other schemes pass through untouched.
    if (req.method !== 'GET' || !req.url.startsWith('http')) return;
    e.respondWith(
        fetch(req)
            .then((res) => {
                if (res.ok || res.type === 'opaque') {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                }
                return res;
            })
            .catch(() => caches.match(req, { ignoreSearch: true }))
    );
});
