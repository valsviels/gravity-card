// Netzwerk zuerst, bei Offline aus dem Speicher.
// Eigene Dateien werden immer frisch geprüft (GitHub Pages cached sonst bis zu 10 Minuten).
const CACHE = "gc-v2";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  const url = e.request.url;
  const eigene = url.startsWith(self.location.origin);
  const holen = eigene ? fetch(url, { cache: "no-cache" }) : fetch(e.request);
  e.respondWith(
    holen.then(function (res) {
      if (eigene || url.indexOf("cdnjs.cloudflare.com") >= 0) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
