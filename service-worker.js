importScripts('assets/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'cache-v1';

self.version = 1;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/assets/jquery-1.11.2.min.js',
                    '/assets/app.js',
                    '/assets/app.css',
                    '/data/feeds.json'
                ]);
            })
    );
});


self.addEventListener('fetch', function(event) {
    var requestURL = new URL(event.request.url);
    if(requestURL.pathname.indexOf("/data/feeds.json") > -1) {
        event.respondWith(feedsResponse(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response;
            })
        );
    }
});

var feedsResponse = function(request) {
    if(request.headers.has('x-use-cache')) {
        return caches.match(request).then(function(response) {
            console.log(response);
            return response;
        });
    } else {
        return fetch(request.clone()).then(function(response) {
            console.log(response);
            if(response.status == 200) {
                return caches.delete(request).then(function () {
                    return caches.open(CACHE_NAME)
                }).then(function (feedsCache) {
                    feedsCache.add("/data/feeds.json");
                    return response;
                });
            } else {
                return Promise.reject(Error('400'));
            }
        });
    }
};

