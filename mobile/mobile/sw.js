/* ISIS SANS 101
   Copyright (c) 2026 Lauren Matthews. Developed with the assistance of Claude (Anthropic).
   Source code licensed under the MIT License (see LICENSE.txt at the site root). */
/* ISIS SANS 101 - offline support (service worker).
   Keeps a copy of the course on the device so it opens without a signal.

   WHEN YOU CHANGE THE SITE: pages are always fetched fresh when the phone is online, so
   edits show up straight away. If you ADD or RENAME a page, add it to CORE below and
   raise VERSION by one so phones pick up the new list. */
var VERSION = 'sans101-v2';

var CORE = [
    './',
    'index.html',
    'manifest.webmanifest',
    'LICENSE.txt',
    'html_pages/nav.js',
    'html_pages/app.js',
    'html_pages/app.css',
    'html_pages/before_you_apply.html',
    'html_pages/meet_larmor.html',
    'html_pages/meet_sans2d.html',
    'html_pages/meet_zoom.html',
    'html_pages/writing_a_proposal.html',
    'html_pages/youve_got_beamtime.html',
    'html_pages/data-reduction.html',
    'html_pages/data-analysis.html',
    'html_pages/credits.html',
    'images/larmor_sample_area.png',
    'images/sans2d_sample_area.jpg',
    'images/zoom_sample_area.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/apple-touch-icon.png'
];

/* Libraries and fonts the pages load from elsewhere. Anything from these hosts is kept after first use. */
var LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

/* The ones the pages need, saved up front so plots work offline from the first visit.
   Keep these addresses identical to the <script> and <link> addresses in the pages. */
var LIBS = [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.27.0/plotly.min.js',
    'https://cdn.jsdelivr.net/npm/h5wasm@latest/dist/iife/h5wasm.js',
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(VERSION).then(function (c) {
            /* one missing file must not stop the rest from being saved */
            return Promise.all(CORE.map(function (u) {
                return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
            }).concat(LIBS.map(function (u) {
                return fetch(u, { mode: 'cors', credentials: 'omit' }).then(function (res) { if (res.ok) return c.put(u, res); }).catch(function () {});
            })));
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
        }).then(function () { return self.clients.claim(); })
    );
});

function save(req, res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
    return res;
}

self.addEventListener('fetch', function (e) {
    var req = e.request;
    if (req.method !== 'GET') return;
    var url = new URL(req.url);

    /* video is streamed in pieces; leave it to the network */
    if (req.headers.has('range') || req.destination === 'video' || req.destination === 'audio' || /\.(mp4|webm|mov)$/i.test(url.pathname)) return;

    if (url.origin === location.origin) {
        var isPage = req.mode === 'navigate' || req.destination === 'document';
        if (isPage) {
            /* pages: newest version when online, saved copy when not */
            e.respondWith(
                fetch(req).then(function (res) { return save(req, res); }).catch(function () {
                    return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('index.html'); });
                })
            );
        } else {
            /* scripts, styles, images: saved copy at once, refreshed in the background */
            e.respondWith(
                caches.match(req).then(function (hit) {
                    var net = fetch(req).then(function (res) { return save(req, res); }).catch(function () { return hit; });
                    return hit || net;
                })
            );
        }
        return;
    }

    if (LIB_HOSTS.indexOf(url.hostname) !== -1) {
        e.respondWith(
            caches.match(req.url).then(function (hit) {
                var net = fetch(req.url, { mode: 'cors', credentials: 'omit' }).then(function (res) { return save(req.url, res); }).catch(function () { return hit; });
                return hit || net;
            })
        );
    }
    /* anything else (for example pictures hosted on other websites) goes straight to the network */
});
