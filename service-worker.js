importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)

workbox.precaching.precacheAndRoute([
    { url: '/nav.html', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/detail.html', revision: '2' },
    { url: '/manifest.json', revision: '1' },
    { url: '/logo.jpg', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/api.js', revision: '2' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/actions.js', revision: '1' },
]);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com\/icon\?family=Material\+Icons/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-font'
    })
);

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'logo.jpg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
