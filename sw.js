---
layout: null
---

const staticCacheName = "mapan1984-github-io-v6";

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
  "/assets/images/72.png",
  "/assets/images/144.png",
  "/assets/images/192.png",
  "/assets/images/512.png",
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
          console.log(`current cache version: ${staticCacheName}, delete old cache ${cacheName}`);
          return caches.delete(cacheName);
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
            if (response) {
                console.log(`found response in cache: `, request.url)
                return response
            }

            console.log(`not found response in cache: `, request.url)

            return fetch(request).then(response => {
                // console.log('response from network: ', request.url, response)
                return response
            }).catch(error => {
                console.error('response fetch failed: ', request.url, error)
                return caches.match('/404').then(res => res || fetch('/404'))
            })
        })
    );
});
