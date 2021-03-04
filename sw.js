self.addEventListener('install', (e) => {
  e.waitUntil(
    // после установки service worker
    // открыть новый кэш
    caches.open('notetaker-v1').then((cache) => {
      // добавляем все URL ресурсов, которые хотим закэшировать
      return cache.addAll([...images, ...jsFiles, ...fonts, ...otherFiles]);
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
          return caches.open('notetaker-v1').then((cache) => {
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

const images = [
  './img/404.png',
  './img/auth_icon.svg',
  './img/change_color.svg',
  './img/close_icon.svg',
  './img/computer_icon.svg',
  './img/day_night_icon.svg',
  './img/dollar_icon.svg',
  './img/edit.svg',
  './img/favicon.svg',
  './img/ipad.png',
  './img/logo.svg',
  './img/menu_icon.svg',
  './img/notetaker1.png',
  './img/notetaker2.png',
  './img/pixel.png',
  './img/theme_changer.svg',
  './img/top_icon.svg',
  './img/x_blue.svg',
  './img/x_white.svg',
];

const jsFiles = [
  './js/accordeon.js',
  './js/index.js',
  './js/note.js',
  './js/signRegister.js',
];
const fonts = [
  './fonts/TRY_Clother-Black.woff',
  './fonts/TRY_Clother-Bold.woff',
  './fonts/TRY_Clother-Regular.woff',
];

const otherFiles = ['/', '/app', './404.html', './sw.js', './css/index.css'];
