document.addEventListener('DOMContentLoaded', function () {
    // ── NAV SCROLL ──
    var nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // ── HAMBURGER ──
    var ham = document.getElementById('hamburger') || document.getElementById('ham');
    var navLinks = document.getElementById('navLinks');
    if (ham && navLinks) {
        ham.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });
    }

    // ── FADE IN ──
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) {
        io.observe(el);
    });
});
