/* ISIS SANS 101
   Copyright (c) 2026 Lauren Matthews. Developed with the assistance of Claude (Anthropic).
   Source code licensed under the MIT License (see LICENSE.txt at the site root). */
/* ISIS SANS 101 - shared sidebar.
   Include on every page with: <script src="nav.js"></script> (pages in html_pages/)
   or <script src="html_pages/nav.js"></script> (index.html at the site root).
   Links are resolved relative to this file, so it works from either location.
   On phones and tablets it also adds the bottom tab bar, loads app.js (touch behaviour)
   and registers sw.js (offline support). */
(function () {
    if (window.__sansNav) return;
    window.__sansNav = true;

    var script = document.currentScript;
    var base = script && script.src ? script.src.replace(/[^\/]*$/, '') : '';
    function url(p) { try { return new URL(p, base || location.href).href; } catch (e) { return p; } }

    var groups = [
        { title: null, items: [
            { label: 'Home', icon: '🏠', file: '../index.html', page: 'index.html' },
            { label: 'Which instrument?', icon: '🧭', file: '../index.html#picker' },
            { label: 'q-range guide', icon: '📏', file: '../index.html#qrange'}
        ]},
        { title: 'Instruments', items: [
            { label: 'Larmor', icon: '🌀', file: 'meet_larmor.html', page: 'meet_larmor.html' },
            { label: 'SANS2D', icon: '🎯', file: 'meet_sans2d.html', page: 'meet_sans2d.html' },
            { label: 'ZOOM', icon: '🔍', file: 'meet_zoom.html', page: 'meet_zoom.html' }
        ]},
        { title: 'Your experiment', items: [
            { label: '1. Before', icon: '🔬', file: 'before_you_apply.html', page: 'before_you_apply.html' },
            { label: '2. Choose', icon: '🧭', file: '../index.html#instruments', page: '../index.html#instruments' },
            { label: '3. Proposal', icon: '📝', file: 'writing_a_proposal.html', page: 'writing_a_proposal.html' },
            { label: '4. Beamtime', icon: '🕒', file: 'youve_got_beamtime.html', page: 'youve_got_beamtime.html' },
            { label: '5. Data reduction', icon: '⚙️', file: 'data-reduction.html', page: 'data-reduction.html' },
            { label: '6. Data analysis', icon: '📊', file: 'data-analysis.html', page: 'data-analysis.html' }
        ]}
    ];

    var here = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

    var css = '' +
    '.sans-nav,.sans-tabs{--sn-bg:#ffffff;--sn-text:#1f2937;--sn-muted:#5b6472;--sn-border:#dfe5ee;--sn-accent:#2b6cb0;--sn-soft:#e8f0fa}' +
    '.sans-nav{position:fixed;top:0;left:0;bottom:0;width:232px;z-index:60;background:var(--sn-bg);color:var(--sn-text);border-right:1px solid var(--sn-border);' +
    'display:flex;flex-direction:column;overflow-y:auto;font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;box-sizing:border-box}' +
    ':root[data-theme="dark"] .sans-nav,:root[data-theme="dark"] .sans-tabs{--sn-bg:#121b2e;--sn-text:#e5ebf5;--sn-muted:#9aa8c0;--sn-border:#25324d;--sn-accent:#63b3ed;--sn-soft:#19243b;}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .sans-nav,:root:not([data-theme="light"]) .sans-tabs{--sn-bg:#121b2e;--sn-text:#e5ebf5;--sn-muted:#9aa8c0;--sn-border:#25324d;--sn-accent:#63b3ed;--sn-soft:#19243b}}' +
    '.sans-nav *{box-sizing:border-box}' +
    '.sans-nav .sn-brand{display:block;padding:18px 18px 14px;font-weight:700;font-size:16px;color:var(--sn-accent);text-decoration:none;border-bottom:1px solid var(--sn-border);letter-spacing:.01em}' +
    '.sans-nav .sn-brand small{display:block;font-weight:500;font-size:11px;color:var(--sn-muted);letter-spacing:.08em;text-transform:uppercase;margin-top:2px}' +
    '.sans-nav .sn-title{margin:16px 18px 6px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--sn-muted)}' +
    '.sans-nav ul{list-style:none;margin:0;padding:0 10px}' +
    '.sans-nav a.sn-link{display:flex;align-items:center;gap:10px;padding:8px 10px;margin:1px 0;border-radius:8px;color:var(--sn-text);text-decoration:none}' +
    '.sans-nav a.sn-link:hover{background:var(--sn-soft)}' +
    '.sans-nav a.sn-link.sn-sub{padding-left:38px;font-size:13px;color:var(--sn-muted)}' +
    '.sans-nav a.sn-link.sn-sub .sn-ico{display:none}' +
    '.sans-nav a.sn-link.sn-on{background:var(--sn-soft);color:var(--sn-accent);font-weight:600;box-shadow:inset 3px 0 0 var(--sn-accent)}' +
    '.sans-nav a:focus-visible,.sans-nav-toggle:focus-visible{outline:3px solid var(--sn-accent);outline-offset:2px}' +
    '.sans-nav .sn-ico{width:20px;text-align:center;flex:none}' +
    '.sans-nav .sn-foot{margin-top:auto;padding:14px 18px;font-size:12px;font-weight:700;color:var(--sn-accent);border-top:1px solid var(--sn-border)}' +
    'body.sans-has-nav{padding-left:232px !important}' +
    '.sans-nav-toggle{display:none}' +
    '.sans-nav-scrim{display:none}' +
    '@media (max-width:900px){' +
    'body.sans-has-nav{padding-left:0 !important}' +
    '.sans-nav{transform:translateX(-100%);transition:transform .25s ease;box-shadow:0 0 30px rgba(0,0,0,.3);width:260px}' +
    '.sans-nav.sn-open{transform:none}' +
    '.sans-nav-toggle{display:flex;align-items:center;justify-content:center;position:fixed;left:14px;bottom:14px;z-index:70;width:48px;height:48px;border-radius:50%;border:1px solid #2b6cb0;background:#2b6cb0;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    '.sans-nav-scrim.sn-open{display:block;position:fixed;inset:0;z-index:55;background:rgba(0,0,0,.4)}}' +
    /* phones and tablets: a bar of tabs along the bottom replaces the round menu button */
    '.sans-tabs{display:none}' +
    '@media (max-width:900px){' +
    '.sans-nav-toggle{display:none !important}' +
    '.sans-nav:not(.sn-open){box-shadow:none}' +
    '.sans-nav{padding-top:env(safe-area-inset-top,0px);padding-bottom:calc(64px + env(safe-area-inset-bottom,0px));width:min(280px,82vw)}' +
    '.sans-tabs{display:flex;gap:2px;position:fixed;left:0;right:0;bottom:0;z-index:62;box-sizing:border-box;background:var(--sn-bg);border-top:1px solid var(--sn-border);' +
    'padding:5px max(6px,env(safe-area-inset-right,0px)) calc(5px + env(safe-area-inset-bottom,0px)) max(6px,env(safe-area-inset-left,0px));box-shadow:0 -2px 12px rgba(0,0,0,.08)}' +
    '.sans-tabs .st{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:52px;margin:0;padding:4px 2px;border:0;border-radius:10px;background:none;' +
    'color:var(--sn-muted);font:600 11px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.sans-tabs .st-ico{font-size:20px;line-height:1}' +
    '.sans-tabs .st.st-on{color:var(--sn-accent);background:var(--sn-soft)}' +
    '.sans-tabs .st:focus-visible{outline:3px solid var(--sn-accent);outline-offset:-3px}' +
    'body.sans-has-nav{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px)) !important}}' +
    '@media (prefers-reduced-motion:reduce){.sans-nav{transition:none}}' +
    '@media print{.sans-nav,.sans-nav-toggle,.sans-nav-scrim,.sans-tabs{display:none !important}body.sans-has-nav{padding-left:0 !important;padding-bottom:0 !important}}';

    function build() {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        var nav = document.createElement('nav');
        nav.className = 'sans-nav';
        nav.id = 'sansNav';
        nav.setAttribute('aria-label', 'Site navigation');

        var brand = document.createElement('a');
        brand.className = 'sn-brand';
        brand.href = url('../index.html');
        brand.innerHTML = 'ISIS SANS 101<small>ISIS SANS group</small>';
        nav.appendChild(brand);

        groups.forEach(function (g) {
            if (g.title) {
                var t = document.createElement('div');
                t.className = 'sn-title';
                t.textContent = g.title;
                nav.appendChild(t);
            }
            var ul = document.createElement('ul');
            g.items.forEach(function (it) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.className = 'sn-link' + (it.sub ? ' sn-sub' : '');
                a.href = url(it.file);
                a.innerHTML = '<span class="sn-ico" aria-hidden="true">' + it.icon + '</span><span></span>';
                a.lastChild.textContent = it.label;
                if (it.page && it.page === here) {
                    a.classList.add('sn-on');
                    a.setAttribute('aria-current', 'page');
                }
                li.appendChild(a);
                ul.appendChild(li);
            });
            nav.appendChild(ul);
        });

        /* Link back to the desktop version of the site (device-redirect.js on the desktop pages
           honours ?desktop=1 and stops redirecting for the rest of the visit) */
        var more = document.createElement('ul');
        var moreLi = document.createElement('li');
        var full = document.createElement('a');
        full.className = 'sn-link';
        full.href = url('../../index.html?desktop=1');
        full.innerHTML = '<span class="sn-ico" aria-hidden="true">🖥️</span><span></span>';
        full.lastChild.textContent = 'View full site';
        moreLi.appendChild(full);
        more.appendChild(moreLi);
        more.style.marginTop = '12px';
        nav.appendChild(more);

        var foot = document.createElement('div');
        foot.className = 'sn-foot';
        foot.textContent = 'Talk to the instrument scientists, we love it!';

        nav.appendChild(foot);

        var scrim = document.createElement('div');
        scrim.className = 'sans-nav-scrim';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sans-nav-toggle';
        btn.setAttribute('aria-label', 'Open navigation menu');
        btn.setAttribute('aria-controls', 'sansNav');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '☰';

        /* Bottom tab bar (phones and tablets only; hidden by CSS on wide screens) */
        var tabs = document.createElement('div');
        tabs.className = 'sans-tabs';
        tabs.setAttribute('role', 'navigation');
        tabs.setAttribute('aria-label', 'Quick navigation');
        var isHome = here === 'index.html', isInst = /^meet_/.test(here);
        function tab(tag, icon, label) {
            var t = document.createElement(tag);
            t.className = 'st';
            t.innerHTML = '<span class="st-ico" aria-hidden="true"></span><span></span>';
            t.firstChild.textContent = icon;
            t.lastChild.textContent = label;
            tabs.appendChild(t);
            return t;
        }
        [
            { label: 'Home', icon: '🏠', file: '../index.html', on: isHome },
            { label: 'Instruments', icon: '🎯', file: '../index.html#instruments', on: isInst },
            { label: 'Experiment', icon: '🧪', file: '../index.html#journey', on: !isHome && !isInst && here !== 'credits.html' }
        ].forEach(function (it) {
            var a = tab('a', it.icon, it.label);
            a.href = url(it.file);
            if (it.on) { a.classList.add('st-on'); a.setAttribute('aria-current', 'page'); }
        });
        var menuTab = tab('button', '☰', 'Menu');
        menuTab.type = 'button';
        menuTab.setAttribute('aria-controls', 'sansNav');
        menuTab.setAttribute('aria-expanded', 'false');
        menuTab.addEventListener('click', function () { setOpen(!nav.classList.contains('sn-open')); });
        tabs.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

        function setOpen(open) {
            nav.classList.toggle('sn-open', open);
            scrim.classList.toggle('sn-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.textContent = open ? '✕' : '☰';
            menuTab.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuTab.firstChild.textContent = open ? '✕' : '☰';
            menuTab.lastChild.textContent = open ? 'Close' : 'Menu';
        }
        btn.addEventListener('click', function () { setOpen(!nav.classList.contains('sn-open')); });
        scrim.addEventListener('click', function () { setOpen(false); });
        nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

        document.body.classList.add('sans-has-nav');
        document.body.insertBefore(nav, document.body.firstChild);
        document.body.appendChild(scrim);
        document.body.appendChild(btn);
        document.body.appendChild(tabs);

        /* Remember light or dark mode from one page to the next (same key as the landing page) */
        try {
            new MutationObserver(function () {
                var t = document.documentElement.getAttribute('data-theme');
                try { if (t) localStorage.setItem('sans101-theme', t); } catch (e) {}
            }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (e) {}

        /* Phone and tablet behaviour lives in app.js, next to this file */
        var app = document.createElement('script');
        app.src = url('app.js');
        document.body.appendChild(app);

        /* Offline support: sw.js sits at the site root. Needs https (or localhost). */
        if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register(url('../sw.js')).catch(function () {});
            });
        }
    }

    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build);
})();
