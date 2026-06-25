/* ── PROJECT DETAIL PAGE ── */

var DEGREE_SHORT = {
    'BA Honours in Design Leadership':          'BA Honours',
    'BCIS in Game Design and Development':      'BCIS',
    'BCIS in Game Design And Game Development': 'BCIS',
    'Personal': 'Personal',
};

var TYPE_LABEL = { game:'Game', research:'Research', app:'App', design:'Design' };

/* ── INIT ── */
var slug = new URLSearchParams(window.location.search).get('slug');
(async function () {
    if (!slug) {
        showNotFound();
        return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 8000);

    try {
        const res = await fetch('projects/' + slug + '/project.json', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error('HTTP ' + res.status + ': project not found');
        }

        const p = await res.json();
        p.slug = slug;
        renderPage(p);

    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name !== 'AbortError') {
            console.error('Failed to load project:', slug, err);
        }
        showNotFound();
    }
})();

/* ── HERO ── */
function renderHero(p) {
    var pageTitle = p.title + ' - Matthew Derek Rall';
    var pageDesc  = (p.summary || '').slice(0, 160);
    var pageUrl   = 'https://matthewderekrall.com/project.html?slug=' + slug;

    var pgTitle = document.getElementById('pg-title');
    var pgDesc  = document.getElementById('pg-desc');
    var pgCanon = document.getElementById('pg-canonical');
    var ogTitle = document.getElementById('og-title');
    var ogDesc  = document.getElementById('og-desc');
    var ogUrl   = document.getElementById('og-url');

    if (pgTitle) pgTitle.textContent = pageTitle;
    if (pgDesc)  pgDesc.content      = pageDesc;
    if (pgCanon) pgCanon.href        = pageUrl;
    if (ogTitle) ogTitle.content     = pageTitle;
    if (ogDesc)  ogDesc.content      = pageDesc;
    if (ogUrl)   ogUrl.content       = pageUrl;

    var coverSrc = p.coverImage
        ? 'projects/' + p.slug + '/' + p.coverImage
        : p.photos > 0 ? 'projects/' + p.slug + '/cover.jpg' : null;

    var heroBg      = document.getElementById('heroBg');
    var heroGlow    = document.getElementById('heroGlow');
    var heroGridBg  = document.getElementById('heroGridBg');

    if (coverSrc && heroBg) {
        heroBg.style.backgroundImage = "url('" + coverSrc + "')";
        if (heroGlow)   heroGlow.style.display   = 'none';
        if (heroGridBg) heroGridBg.style.display  = 'none';
    }

    var short = DEGREE_SHORT[p.degree] || '';
    var type  = TYPE_LABEL[p.type]   || (p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : '');

    var badges = [
        type    ? '<span class="badge b-type">' + type + '</span>'       : '',
        p.genre ? '<span class="badge b-genre">' + p.genre + '</span>'   : '',
        short   ? '<span class="badge b-degree">' + short + '</span>'    : '',
        p.event ? '<span class="badge b-event">🎮 ' + p.event + '</span>' : '',
    ].filter(Boolean).join('');

    var heroBadges = document.getElementById('heroBadges');
    var heroTitle  = document.getElementById('heroTitle');
    var heroDate   = document.getElementById('heroDate');

    if (heroBadges) heroBadges.innerHTML  = badges;
    if (heroTitle)  heroTitle.textContent  = p.title;
    if (heroDate)   heroDate.textContent   = p.date ? '🗓 ' + p.date : '';
}

/* ── JSON-LD SCHEMA ── */
function injectProjectSchema(p) {
    const schema = {
        "@context": "https://schema.org",
        "@type": p.type === 'research' ? "ScholarlyArticle" : "CreativeWork",
        "name": p.title,
        "description": p.summary || p.description || '',
        "author": {
            "@type": "Person",
            "name": "Matthew Derek Rall",
            "url": "https://matthewderekrall.com"
        },
        "url": `https://matthewderekrall.com/project.html?slug=${p.slug}`,
        "dateCreated": p.date || '',
        "keywords": (p.tags || []).join(', ')
    };

    if (p.type === 'game' && p.itchId) {
        schema["@type"] = "VideoGame";
        schema["gamePlatform"] = "PC";
        schema["applicationCategory"] = "Game";
    }

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(scriptTag);
}

/* ── CONTENT ── */
function renderPage(p) {
    renderHero(p);
    injectProjectSchema(p);

    var parts = [];

    /* Awards */
    if (p.awards && p.awards.length) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Awards &amp; Recognition</div>' +
            '<div class="awards-list">' +
            p.awards.map(function (a) {
                return '<div class="award-row"><span class="award-icon">🏆</span><span class="award-text">' + a + '</span></div>';
            }).join('') +
            '</div></div>'
        );
    }

    /* Summary */
    if (p.summary || p.description) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">About</div>' +
            '<p class="summary-text">' + (p.summary || p.description) + '</p>' +
            '</div>'
        );
    }

    /* Itch.io widget */
    if (p.itchId) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Play on Itch.io</div>' +
            '<div class="itch-wrap">' +
            '<iframe frameborder="0" src="https://itch.io/embed/' + p.itchId + '?border_width=3&bg_color=0D0A14&fg_color=F1E8FF&link_color=9333EA&border_color=C026D3" allowfullscreen title="' + p.title + ' on itch.io"></iframe>' +
            '</div></div>'
        );
    }

    /* Screenshot gallery */
    var photos = (p.photoFiles || []).map(function (f) { return 'projects/' + p.slug + '/' + f; });
    window._lbImages = photos;

    if (photos.length) {
        var items = photos.map(function (src, i) {
            return '<div class="gal-item" onclick="openLB(' + i + ')" role="button" tabindex="0" onkeydown="if(event.key===\'Enter\')openLB(' + i + ')">' +
                '<img src="' + src + '" alt="' + p.title + ' - screenshot ' + (i + 1) + '" loading="lazy">' +
                '<div class="gal-zoom">🔍</div>' +
                '</div>';
        }).join('');
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Screenshots</div>' +
            '<div class="gallery-grid">' + items + '</div>' +
            '</div>'
        );
    }

    /* Stack */
    if (p.stack && p.stack.length) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Tech Stack</div>' +
            '<div class="pill-row">' + p.stack.map(function (s) { return '<span class="pill">' + s + '</span>'; }).join('') + '</div>' +
            '</div>'
        );
    }

    /* Tags */
    if (p.tags && p.tags.length) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Tags</div>' +
            '<div class="pill-row">' + p.tags.map(function (t) { return '<span class="tag-pill">' + t + '</span>'; }).join('') + '</div>' +
            '</div>'
        );
    }

    /* External links */
    var LABELS = { github:'⌥ GitHub', itch:'🎮 Itch.io', video:'▶ Video', doi:'📄 DOI', live:'🌐 Live' };
    var extLinks = [];
    if (p.links) {
        for (var k in p.links) {
            extLinks.push('<a href="' + p.links[k] + '" target="_blank" rel="noopener noreferrer" class="pdf-btn">' + (LABELS[k] || k) + '</a>');
        }
    }
    if (extLinks.length) {
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Links</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:10px">' + extLinks.join('') + '</div>' +
            '</div>'
        );
    }

    /* PDF viewer */
    if (p.file) {
        var url = 'projects/' + p.slug + '/' + p.file;
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Document</div>' +
            '<div class="pdf-box">' +
            '<div class="pdf-toolbar">' +
            '<span class="pdf-name">' + p.file + '</span>' +
            '<div class="pdf-actions">' +
            '<a href="' + url + '" target="_blank" class="pdf-btn">↗ Open in New Tab</a>' +
            '<a href="' + url + '" download class="pdf-btn">⬇ Download</a>' +
            '</div></div>' +
            '<iframe class="pdf-frame" src="' + url + '" title="Document viewer" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"></iframe>' +
            '<div class="pdf-fallback"><p>Your browser could not display the PDF inline.</p><p style="margin-top:12px"><a href="' + url + '" target="_blank">Open in new tab</a> &nbsp;·&nbsp; <a href="' + url + '" download>Download</a></p></div>' +
            '</div></div>'
        );
    }

    /* Press / articles */
    if (p.articles && p.articles.length) {
        var rows = p.articles.map(function (a) {
            return '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer" class="article-row">' +
                '<span class="art-arrow">↗</span>' +
                '<span class="art-title">' + a.title + '</span>' +
                (a.source ? '<span class="art-source">' + a.source + '</span>' : '') +
                '</a>';
        }).join('');
        parts.push(
            '<div class="content-block fade-up">' +
            '<div class="block-label">Press &amp; Articles</div>' +
            '<div class="article-list">' + rows + '</div>' +
            '</div>'
        );
    }

    var projContent = document.getElementById('projContent');
    if (projContent) {
        projContent.innerHTML = parts.join('<hr class="divider">');
    }

    /* Trigger fade-in */
    requestAnimationFrame(function () {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
        }, { threshold: 0.08 });
        document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
    });
}

/* ── LIGHTBOX ── */
var _lbIdx = 0;
var _lbTrigger = null;   // element that opened the lightbox, for focus restore

function openLB(i) {
    _lbTrigger = document.activeElement;
    _lbIdx = i;
    syncLB();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Move focus to close button when lightbox opens
    setTimeout(function () {
        var close = document.getElementById('lb-close');
        if (close) close.focus();
    }, 50);
}
function closeLB() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
    // Return focus to the element that triggered the lightbox
    if (_lbTrigger && typeof _lbTrigger.focus === 'function') _lbTrigger.focus();
}
function moveLB(dir) {
    var len = (window._lbImages || []).length;
    _lbIdx = (_lbIdx + dir + len) % len;
    syncLB();
}
function syncLB() {
    var imgs = window._lbImages || [];
    document.getElementById('lb-img').src = imgs[_lbIdx] || '';
    var counter = (_lbIdx + 1) + ' / ' + imgs.length;
    document.getElementById('lb-count').textContent = counter;

    var announce = document.getElementById('lb-announce');
    if (announce) announce.textContent = 'Image ' + counter;

    var showNav = imgs.length > 1;
    document.getElementById('lb-prev').style.visibility = showNav ? 'visible' : 'hidden';
    document.getElementById('lb-next').style.visibility = showNav ? 'visible' : 'hidden';
}

var lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('click', function (e) {
        if (e.target === e.currentTarget) closeLB();
    });
}

document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;

    if (e.key === 'Escape')     { closeLB(); return; }
    if (e.key === 'ArrowLeft')  { moveLB(-1); return; }
    if (e.key === 'ArrowRight') { moveLB(1);  return; }

    // Focus trap: Tab cycles between the lightbox controls only
    if (e.key === 'Tab') {
        var focusable = lb.querySelectorAll('button');
        if (!focusable.length) return;
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* ── NOT FOUND ── */
function showNotFound() {
    // Add noindex so Google stops crawling this URL
    var noindex = document.createElement('meta');
    noindex.name = 'robots';
    noindex.content = 'noindex, nofollow';
    document.head.appendChild(noindex);

    // Update title
    document.title = 'Project Not Found - Matthew Derek Rall';

    var projHero    = document.getElementById('projHero');
    var projContent = document.getElementById('projContent');
    if (projHero)    projHero.style.display = 'none';
    if (projContent) projContent.innerHTML =
        '<div class="notfound-state">' +
        '<h1>Project Not Found</h1>' +
        '<p>The project you\'re looking for doesn\'t exist or has been moved.</p>' +
        '<a href="/" class="back-btn"><span class="back-arrow">-</span> Back to Portfolio</a>' +
        '</div>';
}
