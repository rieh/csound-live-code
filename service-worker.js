var cacheName = 'csound-live-code-2';
var filesToCache = [
  '/', 
  '/index.html',
	'/web/codemirror.css',
	'/web/theme/monokai.css',
	'/web/cslivecode.css',
  '/web/codemirror.js',
  '/web/mode/csound/csound.js',
  '/web/addon/comment/comment.js',
  '/web/addon/edit/matchbrackets.js',
  '/web/addon/edit/closebrackets.js',
  '/web/keymap/vim.js',
  '/web/keymap/emacs.js',
  '/web/cslivecode.js',
  '/web/wasm/libcsound.js',
  '/web/wasm/FileList.js',
  '/web/wasm/CsoundObj.js',
  '/web/wasm/libcsound.wasm',
  '/livecode.orc',
  '/start.orc',

];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
          caches.open(cacheName).then(function(cache) {
                  console.log('[ServiceWorker] Caching app shell');
                  return cache.addAll(filesToCache);
                })
        );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
