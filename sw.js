const CACHE = 'som2music-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // YouTube API와 유튜브 스트리밍은 항상 네트워크에서
  if (url.includes('googleapis.com') || url.includes('youtube.com') || url.includes('ytimg.com') || url.includes('googlevideo.com')) {
    return; // 기본 네트워크 처리
  }
  // 앱 자체 파일은 캐시 우선
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
