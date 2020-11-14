---
layout: null
---

const staticCacheName = "mapan1984-github-io-v0";

console.log("installing service worker");

const filesToCache = [
  {% for page in site.html_pages %}
    '{{ page.url }}',
  {% endfor %}
  {% for post in site.posts %}
    '{{ post.url }}',
  {% endfor %}

  // css
  "/assets/styles/bootstrap.min.css",
  "/assets/styles/bootstrap.min.css.map",
  "/assets/styles/main.css",
  // js
  "/assets/scripts/jquery-1.12.4.min.js", 
  "/assets/scripts/bootstrap.min.js",
  "/assets/scripts/blog.js",
  "/assets/scripts/post.js",
  // img
  "/assets/images/favicon.ico",
  "/assets/images/mapan.jpg",
  "/assets/images/mapan96.jpg",
  "/assets/images/mapan144.jpg",
  "/assets/images/mapan192.jpg",
  // manifest
  "/assets/manifest.json",
  // fonts
  "/assets/fonts/glyphicons-halflings-regular.eot",
  "/assets/fonts/glyphicons-halflings-regular.svg",
  "/assets/fonts/glyphicons-halflings-regular.ttf",
  "/assets/fonts/glyphicons-halflings-regular.woff",
  "/assets/fonts/glyphicons-halflings-regular.woff2",
]

self.addEventListener("install", function(e){
  self.skipWaiting()
  e.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith("mapan1984-github-io-")
            && cacheName != staticCacheName;
        }).map(function(cacheName){
          return cache.delete(cacheName);
        })
      )
    })
  )
});

self.addEventListener('fetch', event => {
    let request = event.request;

    // Always fetch non-GET requests from the network.
    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    // For HTML requests, try the network first else fall back to the offline page.
    // if (request.headers.get('Accept').indexOf('text/html') !== -1) {
    //     event.respondWith(
    //         fetch(request).catch(() => caches.match('/offline/'))
    //     );
    //     return;
    // }

    // Look to the cache first, then fall back to the network.
    event.respondWith(
        caches.match(request).then(response => {
            return response || fetch(request);
        })
    );
});
