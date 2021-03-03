self.addEventListener('install', (e) => {
  e.waitUntil(
    // после установки service worker
    // открыть новый кэш
    caches.open('notetaker-v1').then((cache) => {
      // добавляем все URL ресурсов, которые хотим закэшировать
      return cache.addAll([
        '/app',
        'sw.js',
        'css/index.css',
        'js/index.js',
        'js/note.js',
        'js/signRegister.js',
        'img/logo.svg',
        'img/theme_changer.svg',
        'img/x_white.svg',
        'img/edit.svg',
        '/fonts/TRY_Clother-Bold.woff',
        '/fonts/TRY_Clother-Regular.woff',
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return (
        r ||
        fetch(e.request).then((response) => {
          return caches.open('notetaker').then((cache) => {
            console.log(
              '[Service Worker] Caching new resource: ' + e.request.url
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
