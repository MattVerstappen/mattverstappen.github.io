/*
    HEADER NAV + SLIDE MENU + ADMIN LINK
    - Slide-out menu open/close (Template 2 behavior)
    - Header hide/show on scroll (kept from Template 2)
    - ARIA + focus management
    - Admin nav visibility based on localStorage flags (from Template 1)
    */

(function () {
    'use strict';

    let lastScrollY = 0;
    let ticking = false;

    document.addEventListener('DOMContentLoaded', function () {
        initScrollHeader();
        initSlideMenu();
        updateAdminNav();

        // Keep admin link in sync
        window.addEventListener('storage', updateAdminNav);
        setInterval(updateAdminNav, 1000);
    });

    // --- Admin nav visibility (from Template 1) ---
    function updateAdminNav() {
        const adminNav = document.getElementById('admin-nav');
        const adminLink = document.getElementById('admin-link');
        if (!adminNav || !adminLink) return;

        const isAuthenticated = localStorage.getItem('sms-admin-auth') === 'true';
        const adminEmail = localStorage.getItem('sms-admin-email');

        if (isAuthenticated && adminEmail) {
            adminNav.style.display = 'list-item';
            adminLink.textContent = 'Admin';
            adminLink.title = `Signed in as ${adminEmail}`;
            adminLink.classList.add('nav-admin-link--authenticated');
        } else {
            adminNav.style.display = 'none';
            adminLink.classList.remove('nav-admin-link--authenticated');
        }
    }

    // --- Scroll header (Template 2) ---
    function initScrollHeader() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        function updateHeader() {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                header.classList.remove('header-hidden');
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY) {
                header.classList.remove('header-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, {passive: true});
    }

    // --- Slide-out menu (Template 2) ---
    function initSlideMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const slideMenu = document.querySelector('.slide-menu');
        const menuClose = document.querySelector('.menu-close');
        const menuOverlay = document.querySelector('.slide-menu-overlay');
        const menuLinks = document.querySelectorAll('.menu-link');

        if (!menuToggle || !slideMenu) return;

        function openMenu() {
            slideMenu.classList.add('menu-open');
            slideMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            const firstMenuLink = slideMenu.querySelector('.menu-link');
            if (firstMenuLink) setTimeout(() => firstMenuLink.focus(), 300);
        }

        function closeMenu() {
            slideMenu.classList.remove('menu-open');
            slideMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', openMenu);
        menuClose?.addEventListener('click', closeMenu);
        menuOverlay?.addEventListener('click', closeMenu);

        document.addEventListener('keydown', function (e) {
            if (e.code === 'Escape' && slideMenu.classList.contains('menu-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close on link click (useful for mobile)
        menuLinks.forEach(link => link.addEventListener('click', closeMenu));

        // Focus trap inside slide menu
        slideMenu.addEventListener('keydown', function (e) {
            if (e.code !== 'Tab' || !slideMenu.classList.contains('menu-open')) return;
            const focusables = slideMenu.querySelectorAll('button, a');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }
})();
