// Netzwerk zuerst, bei Offline aus dem Speicher. Nur eigene Dateien und Leaflet werden gespeichert.
const CACHE = "gc-v1";
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  e.respondWith(
    fetch(e.request).then(function (res) {
      const u = e.request.url;
      if (u.startsWith(self.location.origin) || u.indexOf("cdnjs.cloudflare.com") >= 0) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
