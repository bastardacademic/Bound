self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
self.addEventListener('push', event => {
  if (!event.data) return;
  const { title, body } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, { body })
  );
});
