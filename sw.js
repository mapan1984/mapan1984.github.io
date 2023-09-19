---
---

const staticCacheName = "mapan1984-github-io-v11";

console.log("installing service worker");

const filesToCache = [
  {% for page in site.html_pages %}
    '{{ page.url }}',
  {% endfor %}
  {% for post in site.posts %}
    '{{ post.url }}',
  {% endfor %}

  // css
  "/blog/assets/styles/utils.css",
  "/blog/assets/styles/navbar.css",
  "/blog/assets/styles/footer.css",
  "/blog/assets/styles/index.css",
  "/blog/assets/styles/tabs.css",
  "/blog/assets/styles/all-posts.css",
  "/blog/assets/styles/post.css",
  "/blog/assets/styles/syntax-highlight.css",

  // js
  "/blog/assets/scripts/index.js",
  "/blog/assets/scripts/utils/toc.js",
  "/blog/assets/scripts/post.js",

  // img
  "/blog/assets/images/favicon.ico",
  "/blog/assets/images/72.png",
  "/blog/assets/images/144.png",
  "/blog/assets/images/192.png",
  "/blog/assets/images/512.png",

  // manifest
  "/blog/assets/manifest.json",
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
