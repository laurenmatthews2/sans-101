/* ISIS SANS 101
   Copyright (c) 2026 Lauren Matthews. Developed with the assistance of Claude (Anthropic).
   Source code licensed under the MIT License (see LICENSE.txt at the site root). */
/* ISIS SANS 101 - phone and tablet behaviour.
   Loaded automatically by nav.js, so any page that includes nav.js gets it.
   Each block is independent and does nothing on pages that lack the elements it looks for. */
(function () {
    if (window.__sansApp) return;
    window.__sansApp = true;

    var root = document.documentElement;
    var small = window.matchMedia('(max-width: 900px)');
    var phone = window.matchMedia('(max-width: 640px)');
    var standalone = (window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    function each(sel, fn, ctx) { [].forEach.call((ctx || document).querySelectorAll(sel), fn); }

    /* ---- 1. Stay inside the app ----
       Links to other pages of the course open in the same window on phones and when installed,
       instead of in a new browser tab. Links to other websites still open outside. */
    function sameSite(a) { try { return new URL(a.href, location.href).origin === location.origin; } catch (e) { return false; } }
    function fixLinks(ctx) {
        if (!(small.matches || standalone)) return;
        each('a[target="_blank"]', function (a) { if (sameSite(a)) a.removeAttribute('target'); }, ctx);
    }
    fixLinks();
    /* the instrument quiz on the landing page builds its links later */
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[target="_blank"]');
        if (a && (small.matches || standalone) && sameSite(a)) a.removeAttribute('target');
    }, true);

    /* ---- 2. Colour of the phone's status bar follows the page theme ---- */
    function syncThemeColour() {
        var m = document.querySelector('meta[name="theme-color"]');
        if (!m) return;
        var bar = document.querySelector('body > nav:not(.sans-nav)') || document.body;
        var c = getComputedStyle(bar).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') m.setAttribute('content', c);
    }
    syncThemeColour();
    new MutationObserver(function () { setTimeout(syncThemeColour, 50); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColour);

    /* ---- 3. Instrument pages: keep the chosen component and its diagram in view ---- */
    var strip = document.querySelector('.sw');
    var title = document.getElementById('dTitle');
    var diag = document.getElementById('dDiag');
    if (strip && title) {
        var follow = function () {
            var on = strip.querySelector('.nd[aria-pressed="true"]');
            if (on && strip.scrollWidth > strip.clientWidth) {
                var x = on.offsetLeft + on.offsetWidth / 2 - strip.clientWidth / 2;
                try { strip.scrollTo({ left: x, behavior: 'smooth' }); } catch (e) { strip.scrollLeft = x; }
            }
            if (diag && diag.scrollWidth > diag.clientWidth) diag.scrollLeft = (diag.scrollWidth - diag.clientWidth) / 2;
        };
        new MutationObserver(follow).observe(title, { childList: true, characterData: true, subtree: true });
        follow();
    }

    /* ---- 4. Tooltips behind the "i" markers open with a tap ---- */
    document.addEventListener('click', function (e) {
        var i = e.target.closest && e.target.closest('.tipi');
        var ctl = i && i.closest('.ctl');
        each('.ctl.tip-open', function (c) { if (c !== ctl) c.classList.remove('tip-open'); });
        if (ctl) { e.preventDefault(); ctl.classList.toggle('tip-open'); }
    });
    each('.tipi', function (i) {
        i.setAttribute('role', 'button'); i.setAttribute('tabindex', '0'); i.setAttribute('aria-label', 'More information'); i.removeAttribute('aria-hidden');
        i.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); i.click(); } });
    });

    /* ---- 5. Canvas plots: redraw at phone size so the axis text is readable ----
       The plots on the data reduction page are drawn 560 units wide and then shrunk to fit,
       which makes the labels tiny on a phone. Drawing them on a narrower canvas keeps the
       labels at a readable size. The page redraws everything when it hears "themechange". */
    var plots = [].slice.call(document.querySelectorAll('canvas[width="560"]'));
    plots.forEach(function (c) { c.dataset.w = c.getAttribute('width'); c.dataset.h = c.getAttribute('height'); });
    function fitPlots() {
        var changed = false;
        plots.forEach(function (c) {
            var w0 = +c.dataset.w, h0 = +c.dataset.h, shown = c.clientWidth, w = w0, h = h0;
            if (phone.matches && shown && shown < w0 * 0.8) {
                w = Math.round(shown * 1.25);
                h = Math.round(w * Math.min(0.85, h0 / w0 * 1.3));
            }
            if (c.width !== w || c.height !== h) { c.width = w; c.height = h; changed = true; }
        });
        if (changed) window.dispatchEvent(new Event('themechange'));
    }
    if (plots.length) {
        fitPlots();
        var t = null;
        window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fitPlots, 200); });
    }

    /* ---- 5b. Resolution section: captions under the sliders ----
       On a phone the two resolution charts are pinned above the sliders (see app.css), so their
       headings and explanatory notes are moved to sit below the sliders instead, and go back
       to their place on wider screens. The page's own script still finds them by id. */
    var rplots = document.querySelector('.box > .rgrid + .rplots');
    if (rplots) {
        var wide = window.matchMedia('(max-width: 760px)');
        var moved = [];
        var shelf = document.createElement('div');
        shelf.className = 'rnotes';
        var tidy = function () {
            if (wide.matches && !moved.length) {
                each('.pnl', function (p) {
                    var head = document.createElement('h3');
                    head.textContent = (p.querySelector('h3') || {}).textContent || '';
                    shelf.appendChild(head);
                    each('.sub, .note', function (n) {
                        moved.push({ n: n, parent: n.parentNode, next: n.nextSibling });
                        shelf.appendChild(n);
                    }, p);
                }, rplots);
                rplots.parentNode.appendChild(shelf);
            } else if (!wide.matches && moved.length) {
                for (var i = moved.length - 1; i >= 0; i--) moved[i].parent.insertBefore(moved[i].n, moved[i].next);
                moved = [];
                shelf.innerHTML = '';
                if (shelf.parentNode) shelf.parentNode.removeChild(shelf);
            }
        };
        tidy();
        if (wide.addEventListener) wide.addEventListener('change', tidy);
    }

    /* ---- 6. "Add to home screen" in the menu ---- */
    var deferred = null;
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    function installRow() {
        var foot = document.querySelector('.sans-nav .sn-foot');
        if (!foot || standalone || document.getElementById('snInstall')) return;
        if (!deferred && !ios) return;
        var box = document.createElement('div');
        box.id = 'snInstall';
        box.style.cssText = 'margin:16px 18px 14px;font-size:13px;line-height:1.45;color:var(--sn-muted)';
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = '📲 Add to home screen';
        b.style.cssText = 'width:100%;min-height:44px;border:1px solid var(--sn-border);border-radius:8px;background:var(--sn-soft);color:var(--sn-text);font:600 14px/1.2 inherit;cursor:pointer';
        var note = document.createElement('p');
        note.style.cssText = 'margin:8px 0 0';
        note.hidden = true;
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            if (deferred) { deferred.prompt(); deferred = null; box.remove(); return; }
            note.textContent = 'In Safari, tap the Share button, then "Add to Home Screen".';
            note.hidden = !note.hidden;
        });
        box.appendChild(b); box.appendChild(note);
        foot.parentNode.insertBefore(box, foot);
        foot.style.marginTop = '0';
        box.style.marginTop = 'auto';
    }
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; installRow(); });
    window.addEventListener('appinstalled', function () { var b = document.getElementById('snInstall'); if (b) b.remove(); });
    installRow();
})();
