const CACHE = 'doc-upload-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Apps Script へのPOSTはキャッシュしない
  if (e.request.method === 'POST') return;

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      // 同一オリジンだけ軽くキャッシュ
      if (url.origin === location.origin) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      }
      return resp;
    }))
  );
});
