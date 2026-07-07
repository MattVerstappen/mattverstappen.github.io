// Single DOMContentLoaded: language load runs first, then nav setup
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load and apply saved language first
    if (typeof loadLang === 'function' && typeof applyTranslations === 'function') {
        const lang = await loadLang();
        applyTranslations(lang);
        buildLangSwitcher();        // populate elements before marking active
        setActiveLangOption(lang);
    } else {
        buildLangSwitcher();
    }

    // 2. Nav scroll behaviour - rAF-throttled, passive, write-on-change only.
    //    Batches the layout read (scrollY) into a single animation frame and only
    //    touches the DOM when the state actually flips, avoiding forced reflow and
    //    long main-thread tasks during scroll.
    var nav = document.querySelector('nav');
    if (nav) {
        var scrolled = false;
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var isScrolled = window.scrollY > 20;   // single batched read
                if (isScrolled !== scrolled) {
                    scrolled = isScrolled;
                    nav.classList.toggle('scrolled', scrolled);   // write only when it changes
                }
                ticking = false;
            });
        }, { passive: true });
    }

    // 3. Hamburger toggle
    var ham = document.getElementById('hamburger') || document.getElementById('ham');
    var navLinks = document.getElementById('navLinks');
    if (ham && navLinks) {
        ham.setAttribute('aria-controls', navLinks.id);
        ham.setAttribute('aria-expanded', 'false');
        ham.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            ham.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navLinks.classList.remove('open');
                ham.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Scroll progress bar ----
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop  = window.scrollY;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // ---- Hero spotlight (mouse follow) ----
    const heroSection  = document.getElementById('hero');
    const heroSpotlight = document.getElementById('heroSpotlight');
    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            const x    = ((e.clientX - rect.left) / rect.width)  * 100;
            const y    = ((e.clientY - rect.top)  / rect.height) * 100;
            heroSpotlight.style.setProperty('--mouse-x', x + '%');
            heroSpotlight.style.setProperty('--mouse-y', y + '%');
        });
    }

    // 4. Fade-in observer
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) {
        io.observe(el);
    });

    // 5. Init notice banner
    initLangNotice();
});

// ---- LANGUAGE SWITCHER ----

function buildLangSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const langs = [
        { code: 'en', native: 'English',   english: '' },
        { code: 'zh', native: '中文',       english: 'Mandarin' },
        { code: 'hi', native: 'हिन्दी',     english: 'Hindi' },
        { code: 'es', native: 'Español',   english: 'Spanish' },
        { code: 'fr', native: 'Français',  english: 'French' },
        { code: 'ar', native: 'العربية',   english: 'Arabic' },
        { code: 'af', native: 'Afrikaans', english: '' },
        { code: 'ja', native: '日本語',     english: 'Japanese' },
    ];

    const dropdown = switcher.querySelector('.lang-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = langs.map(l => `
        <button class="lang-option" data-lang="${l.code}" onclick="selectLang('${l.code}')">
            <span class="lang-native">${l.native}</span>
            ${l.english ? `<span class="lang-english">${l.english}</span>` : ''}
        </button>
    `).join('');

    // Build mobile chips if they exist
    const chips = document.getElementById('langChips');
    if (chips) {
        chips.innerHTML = langs.map(l => `
            <button class="lang-chip" data-lang="${l.code}" onclick="selectLang('${l.code}')">${l.native}</button>
        `).join('');
    }
}

function setActiveLangOption(lang) {
    document.querySelectorAll('.lang-option, .lang-chip').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
    const btn = document.getElementById('langBtn');
    if (btn) {
        const names = {
            en: 'English', zh: '中文', hi: 'हिन्दी', es: 'Español',
            fr: 'Français', ar: 'العربية', af: 'Afrikaans', ja: '日本語'
        };
        btn.textContent = '🌐 ' + (names[lang] || 'English');
    }
}

async function selectLang(lang) {
    if (typeof applyTranslations === 'function') applyTranslations(lang);
    if (typeof saveLang === 'function') await saveLang(lang);
    setActiveLangOption(lang);
    closeLangDropdown();

    // First non-English selection - prompt file system save
    const isFirst = !localStorage.getItem('mdr-lang-prompted');
    if (lang !== 'en' && isFirst && typeof promptFileSystemSave === 'function') {
        localStorage.setItem('mdr-lang-prompted', 'true');
        await promptFileSystemSave(lang);
    }
}

function toggleLangDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    const btn = document.getElementById('langBtn');
    if (dropdown) {
        const isOpen = dropdown.classList.toggle('open');
        if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
}

function closeLangDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    const btn = document.getElementById('langBtn');
    if (dropdown) dropdown.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
    if (!e.target.closest('.lang-switcher')) closeLangDropdown();
});

// Close dropdown on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLangDropdown();
});

// ---- LANGUAGE NOTICE BANNER ----

function initLangNotice() {
    const notice = document.getElementById('langNotice');
    if (!notice) return;

    if (localStorage.getItem('mdr-notice-dismissed') === 'true') {
        notice.classList.add('hidden');
        return;
    }

    const dismissBtn = notice.querySelector('.lang-notice-dismiss');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            notice.classList.add('hidden');
            localStorage.setItem('mdr-notice-dismissed', 'true');
        });
    }
}
