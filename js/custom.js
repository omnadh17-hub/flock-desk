document.addEventListener('DOMContentLoaded', function () {

    var hamburgerBtn = document.querySelector('.hamburger-menu');
    var closeBtn     = document.querySelector('.side-nav-close');
    var navOverlay   = document.querySelector('.nav-overlay');
    var html         = document.documentElement;

    function openNav() {
        html.classList.add('menu-open');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        html.classList.remove('menu-open');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.querySelectorAll('.drp-arrow.expanded').forEach(function (arrow) {
            collapseDropdown(arrow);
        });
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openNav);
    if (closeBtn)     closeBtn.addEventListener('click', closeNav);
    if (navOverlay)   navOverlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && html.classList.contains('menu-open')) closeNav();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992 && html.classList.contains('menu-open')) closeNav();
    });

    var header = document.getElementById('siteHeader');

    function updateHeaderState() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();

    if (typeof gsap === 'undefined' || window.innerWidth < 992) return;

    var floatEls = document.querySelectorAll('.float-el');
    if (!floatEls.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        floatEls.forEach(function (el) { gsap.set(el, { opacity: 1, x: 0, y: 0 }); });
        return;
    }

    var initMap = {
        'float-el--add-reply':     { x: -72, y: 0  },
        'float-el--date':          { x: 0,   y: -48 },
        'float-el--ticket-create': { x: 72,  y: 0  },
        'float-el--change-status': { x: -72, y: 0  },
        'float-el--adjust':        { x: 72,  y: 0  },
        'float-el--edit-badge':    { x: -36, y: 40 },
        'float-el--email':         { x: -72, y: 0  },
        'float-el--edit-team':     { x: 72,  y: 0  },
        'float-el--assign-ticket': { x: 0,   y: 56 },
    };

    floatEls.forEach(function (el) {
        var key = Array.from(el.classList).find(function (c) { return c.startsWith('float-el--'); });
        var cfg = initMap[key] || { x: 0, y: 0 };
        gsap.set(el, { opacity: 0, x: cfg.x, y: cfg.y });
    });

    var animated = false;

    function playBannerAnimation() {
        if (animated) return;
        animated = true;

        var ease     = 'power3.out';
        var duration = 0.72;
        var tl       = gsap.timeline();

        tl.to(
            ['.float-el--add-reply', '.float-el--change-status', '.float-el--email']
                .map(function (s) { return document.querySelector(s); })
                .filter(Boolean),
            { opacity: 1, x: 0, duration: duration, ease: ease, stagger: 0.13 }
        );

        tl.to(
            ['.float-el--ticket-create', '.float-el--adjust', '.float-el--edit-team']
                .map(function (s) { return document.querySelector(s); })
                .filter(Boolean),
            { opacity: 1, x: 0, duration: duration, ease: ease, stagger: 0.13 },
            '-=0.55'
        );

        tl.to(
            document.querySelector('.float-el--date'),
            { opacity: 1, y: 0, duration: duration, ease: ease },
            '-=0.62'
        );

        tl.to(
            ['.float-el--edit-badge', '.float-el--assign-ticket']
                .map(function (s) { return document.querySelector(s); })
                .filter(Boolean),
            { opacity: 1, x: 0, y: 0, duration: duration, ease: ease, stagger: 0.14 },
            '-=0.38'
        );
    }

    function onScrollTrigger() {
        if (window.scrollY > 50) {
            playBannerAnimation();
            window.removeEventListener('scroll', onScrollTrigger);
        }
    }
    window.addEventListener('scroll', onScrollTrigger, { passive: true });

    var heroBanner = document.getElementById('heroBanner');
    if (heroBanner) {
        heroBanner.addEventListener('mouseenter', function () {
            playBannerAnimation();
        }, { once: true });
    }

});

(function () {
    var tabs   = document.querySelectorAll('.features-tab');
    var panels = document.querySelectorAll('.features-panel');
    var total  = tabs.length;

    if (!total) return;

    function activateTab(index) {
        tabs.forEach(function (tab, i) {
            var active = i === index;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        panels.forEach(function (panel, i) {
            var active = i === index;
            panel.classList.toggle('active', active);
            if (active) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }

            var prevBtn = panel.querySelector('.panel-nav-btn--prev');
            var nextBtn = panel.querySelector('.panel-nav-btn--next');
            if (prevBtn) prevBtn.disabled = (i === 0);
            if (nextBtn) nextBtn.disabled = (i === total - 1);
        });
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { activateTab(i); });
    });

    panels.forEach(function (panel) {
        panel.querySelector('.panel-nav-btn--prev') &&
            panel.querySelector('.panel-nav-btn--prev').addEventListener('click', function () {
                var idx = Array.from(panels).indexOf(panel);
                activateTab(Math.max(idx - 1, 0));
            });
        panel.querySelector('.panel-nav-btn--next') &&
            panel.querySelector('.panel-nav-btn--next').addEventListener('click', function () {
                var idx = Array.from(panels).indexOf(panel);
                activateTab(Math.min(idx + 1, total - 1));
            });
    });

    activateTab(0);
}());

(function () {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
        var trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            items.forEach(function (el) {
                el.classList.remove('active');
                var btn = el.querySelector('.faq-trigger');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}());

(function () {
    if (window.innerWidth < 992) return;

    var cards = document.querySelectorAll('.feat-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    cards.forEach(function (card) {
        observer.observe(card);
    });
}());

(function () {
    var navItems = document.querySelectorAll('.blog-nav__item');
    if (!navItems.length) return;

    function activateBlog(btn) {
        var panelId = btn.getAttribute('data-panel');
        if (!panelId) return;

        navItems.forEach(function (item) {
            item.classList.remove('active');
            item.setAttribute('aria-pressed', 'false');
        });

        document.querySelectorAll('.blog-panel').forEach(function (panel) {
            panel.setAttribute('hidden', '');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var panel = document.getElementById(panelId);
        if (panel) panel.removeAttribute('hidden');
    }

    navItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activateBlog(btn);
        });
    });
}());

(function () {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var groups = [
        { sel: '.trusted-logo-item', dir: 'up',    stagger: 80  },
        { sel: '.about-card',        dir: 'up'                   },
        { sel: '.about-feature',     dir: 'up',    stagger: 90  },
        { sel: '.faq-item',          dir: 'up',    stagger: 55  },
        { sel: '.blog-display',      dir: 'left'                 },
        { sel: '.blog-nav',          dir: 'right', delay: 80    },
        { sel: '.ctc-left',          dir: 'up'                   },
        { sel: '.ctc-right',         dir: 'up',    delay: 110   },
        { sel: '.footer-brand',      dir: 'up'                   },
    ];

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    groups.forEach(function (cfg) {
        document.querySelectorAll(cfg.sel).forEach(function (el, i) {
            el.setAttribute('data-reveal', cfg.dir);
            var delay = (cfg.delay || 0) + (cfg.stagger ? i * cfg.stagger : 0);
            if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
            observer.observe(el);
        });
    });
}());
