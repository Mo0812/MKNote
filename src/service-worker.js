/* eslint-disable no-console */

workbox.setConfig({
    debug: true
});

//self.__preachingManifest = [].concat(self.__preachingManifest || []);
//workbox.precaching.supressWarnings();
workbox.precaching.precacheAndRoute([
    "/index.html",
    "/js/*",
    "/css/*",
    "/*.js"
]);

workbox.routing.registerRoute(
    /\.js$/,
    workbox.strategies.networkFirst({
        cacheName: "js"
    })
);

workbox.routing.registerRoute(
    /\.css$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "css"
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
            })
        ]
    })
);

workbox.routing.registerRoute(
    new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
    workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30
            })
        ]
    })
);
