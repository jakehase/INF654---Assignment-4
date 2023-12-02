const cacheNameStatic = "static-v19";
const cacheNameDynamic = "dynamic-v14";

const appAssets = [
  "/",
  "/index.html",
  "/pages/fallback.html",
  "/css/materialize.min.css",
  "/css/app.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

const manageCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => manageCacheSize(cacheName, maxItems));
      }
    });
  });
};

self.addEventListener("install", (evt) => {
  console.log(`SW installed: ${evt.type}`);
  evt.waitUntil(
    caches.open(cacheNameStatic).then(cache => {
      console.log("SW: Caching shell assets");
      cache.addAll(appAssets);
    })
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList
          .filter(key => key !== cacheNameStatic && key !== cacheNameDynamic)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
    evt.respondWith(
      caches.match(evt.request).then(cachedRes => {
        return (
          cachedRes ||
          fetch(evt.request).then(fetchRes => {
            return caches.open(cacheNameDynamic).then(dynamicCache => {
              dynamicCache.put(evt.request.url, fetchRes.clone());
              manageCacheSize(cacheNameDynamic, 15);
              return fetchRes;
            });
          })
        );
      }).catch(() => {
        return caches.match("/pages/fallback.html");
      })
    );
  }
});
