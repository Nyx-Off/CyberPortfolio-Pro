/**
 * Service Worker for PWA functionality
 * Handles caching and offline functionality
 */

const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
    '/',
    '/styles/main.css',
    '/styles/animations.css',
    '/styles/print.css',
    '/scripts/main.js',
    '/scripts/github-projects.js',
    '/images/profile.jpg',
    '/images/podcast.webp',
    '/images/red-hat.png',
    '/404.html',
    'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Cache installation failed:', err);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) && 
        !event.request.url.includes('fonts.googleapis.com') &&
        !event.request.url.includes('fonts.gstatic.com') &&
        !event.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'opaque') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Don't cache API calls or PHP files
                    if (!event.request.url.includes('.php') && 
                        !event.request.url.includes('api.github.com')) {
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    
                    return response;
                }).catch(() => {
                    // Offline fallback
                    if (event.request.destination === 'document') {
                        return caches.match('/404.html');
                    }
                });
            })
    );
});

// Activate Service Worker and clean old caches
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

// Background sync for GitHub projects
self.addEventListener('sync', event => {
    if (event.tag === 'sync-github-projects') {
        event.waitUntil(syncGitHubProjects());
    }
});

async function syncGitHubProjects() {
    try {
        const response = await fetch('/get_github_projects.php');
        const data = await response.json();
        
        // Store in cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put('/api/projects', cachedResponse);
        
        // Send message to all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'PROJECTS_UPDATED',
                data: data
            });
        });
    } catch (error) {
        console.error('Failed to sync GitHub projects:', error);
    }
}

// Handle messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-projects') {
        event.waitUntil(syncGitHubProjects());
    }
});