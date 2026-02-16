const CACHE = 'doc-upload-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png'
];

// sw.js（キャッシュ全消去＆自己解除版）
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // すべてのCacheを削除
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));

    // SWを解除
    await self.registration.unregister();

    // 開いているページを再読み込みさせる
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(c => c.navigate(c.url));
  })());
});

// いちおう素通し
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
