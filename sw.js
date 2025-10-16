const CACHE_NAME = 'matir-kotha-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // Add all your local image assets here
    'images/hero-background.jpg',
    'images/t-shirt-1.jpeg',
    'images/t-shirt-2.jpeg',
    'images/t-shirt-3.jpeg',
    'images/velocity-edge-runner/1.jpg',
    'images/velocity-edge-runner/2.jpg',
    'images/velocity-edge-runner/3.jpg',
    'images/zenith-stride-lo/1.jpg',
    'images/zenith-stride-lo/2.jpg',
    'images/zenith-stride-lo/3.jpg',
    'images/apex-trail-xt/1.jpg',
    'images/apex-trail-xt/2.jpg',
    'images/apex-trail-xt/3.jpg',
    'images/react-charge-pro/1.jpg',
    'images/react-charge-pro/2.jpg',
    'images/react-charge-pro/3.jpg',
    'images/heritage-court-classic/1.jpg',
    'images/heritage-court-classic/2.jpg',
    'images/heritage-court-classic/3.jpg',
    // External assets
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install a service worker
self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Update a service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
              
