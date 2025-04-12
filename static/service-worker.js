import { build, files, version } from "$service-worker";

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline"))
    );
    return;
  }

  event.respondWith(
    caches.open(version).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const res = await fetch(request);
      if (res && res.status === 200) {
        cache.put(request, res.clone());
      }
      return res;
    })
  );
});
