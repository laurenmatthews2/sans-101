/* ISIS SANS 101
   Copyright (c) 2026 Lauren Matthews. Developed with the assistance of Claude (Anthropic).
   Source code licensed under the MIT License (see LICENSE.txt at the site root). */
/* ISIS SANS 101 - sends phones and tablets to the mobile version of the site.
   Include as the first script in <head> of every desktop page:
     <script src="device-redirect.js"></script>       (index.html at the site root)
     <script src="../device-redirect.js"></script>    (pages in html_pages/)
   The mobile site mirrors this one under mobile/ (mobile/index.html, mobile/html_pages/...).
   Add ?desktop=1 to any desktop URL to stay on the desktop site for the rest of the visit. */
(function () {
    // Visitor asked for the full site
    try {
        if (new URLSearchParams(location.search).get('desktop') === '1') {
            try { sessionStorage.setItem('sans101-desktop', '1'); } catch (e) {}
            return;
        }
        if (sessionStorage.getItem('sans101-desktop')) return;
    } catch (e) {}

    // Phones and tablets (iPads report as "Macintosh", so check for touch as well)
    var ua = navigator.userAgent || '';
    var isTouchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    var isHandheld = /Android|iPhone|iPad|iPod|Mobi|Tablet|Silk|Kindle/i.test(ua) || isTouchMac;
    if (!isHandheld) return;

    // Work out the site root from this script's own location, so it also works
    // on GitHub Pages project sites (https://user.github.io/repo/)
    var s = document.currentScript;
    if (!s || !s.src) return;
    var root = new URL('.', s.src).pathname;
    var path = location.pathname;
    if (path.indexOf(root) !== 0) return;

    var rel = path.slice(root.length);
    if (!rel || rel.slice(-1) === '/') rel += 'index.html';
    location.replace(root + 'mobile/' + rel + location.hash);
})();
