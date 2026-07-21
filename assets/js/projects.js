/* ── PROJECT GRID SYSTEM ── */

/**
 * Escape HTML special characters to prevent XSS.
 * Use this on any string from project.json before inserting into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Build a same-origin asset path with each segment URL-encoded.
 * Safe for use in src/href attributes.
 * @param {string} slug
 * @param {string} file
 * @returns {string}
 */
function assetPath(slug, file) {
    return 'projects/' + encodeURIComponent(slug) + '/' + encodeURIComponent(file);
}

let allProjects = [];
let currentStatus = 'completed';
let currentDegree = 'all';

const DEGREE_SHORT = {
    'BA Honours in Design Leadership':             'BA Honours',
    'BCIS in Game Design and Development':         'BCIS',
    'BCIS in Game Design And Game Development':    'BCIS',
    'Personal':                                    'Personal',
    'Solo':                                        'Solo',
};

const TYPE_ICON = {
    research: '📄',
    game:     '🎮',
    app:      '📱',
    web:      '🌐',
    design:   '🎨',
    other:    '📦',
    tool:     '🔧',
};

// Custom mdr-icons.js icon name per project type (used for cover placeholder / fallback)
const TYPE_ICON_NAME = {
    research: 'paper',
    game:     'gamepad',
    app:      'code',
    web:      'globe',
    design:   'spark',
    other:    'card',
    tool:     'code',
};

const LINK_LABEL = {
    github: '⌥ GitHub',
    itch:   '🎮 itch.io',
    video:  '▶ Video',
    doi:    '📄 DOI',
    live:   '🌐 Live',
};

function shortenDegree(degree) {
    return DEGREE_SHORT[degree] || (degree ? degree.split(' ').slice(0, 2).join(' ') : '');
}

function buildCard(proj) {
    const short     = shortenDegree(proj.degree);
    const icon      = TYPE_ICON[proj.type] || '📦';
    const typeLabel = proj.type ? proj.type.charAt(0).toUpperCase() + proj.type.slice(1) : 'Project';
    const titleSafe = escHtml(proj.title);

    const catBadge   = proj.engine ? '<span class="project-category-badge">' + escHtml(proj.engine) + '</span>' : '';
    const fallbackIcon = (typeof mdrIcon === 'function')
        ? mdrIcon(TYPE_ICON_NAME[proj.type] || 'gamepad', 40) : '';
    const fallbackDiv = function (visible) {
        return '<div class="cover-icon-fallback" style="display:' + (visible ? 'flex' : 'none') +
               '; align-items:center; justify-content:center; height:100%; color:var(--accent);">' + fallbackIcon + '</div>';
    };

    const coverSrc = proj.coverImage
        ? assetPath(proj.slug, proj.coverImage)
        : proj.photos > 0 ? assetPath(proj.slug, 'cover.jpg') : null;

    let coverInner;
    if (coverSrc) {
        const onerr = "this.closest('.proj-cover-wrap').querySelector('.cover-icon-fallback').style.display='flex';";
        let imgTag;
        if (proj.coverWebp) {
            imgTag = '<picture><source type="image/webp" srcset="' + assetPath(proj.slug, proj.coverWebp) + '">' +
                     '<img src="' + coverSrc + '" class="proj-cover" loading="lazy" decoding="async" alt="' + titleSafe + '" ' +
                     'onerror="this.closest(\'picture\').style.display=\'none\'; ' + onerr + '"></picture>';
        } else {
            imgTag = '<img src="' + coverSrc + '" class="proj-cover" loading="lazy" decoding="async" alt="' + titleSafe + '" ' +
                     'onerror="this.style.display=\'none\'; ' + onerr + '">';
        }
        coverInner = imgTag + fallbackDiv(false);
    } else {
        // No cover image - use the category icon as the cover area.
        coverInner = fallbackDiv(true);
    }
    const slugUrl = encodeURIComponent(proj.slug);
    const cover = '<a href="project.html?slug=' + slugUrl + '" class="proj-cover-link">' +
                '<div class="proj-cover-wrap">' + catBadge + coverInner + '</div></a>';

    const gallery = proj.photoFiles && proj.photoFiles.length
        ? '<div class="proj-gallery">' + proj.photoFiles.map(function (f) {
            return '<a href="project.html?slug=' + slugUrl + '"><img src="' + assetPath(proj.slug, f) + '" class="proj-thumb" onerror="this.style.display=\'none\'" alt="' + titleSafe + ' screenshot"></a>';
          }).join('') + '</div>'
        : '';

    const degreeBadge = short ? '<span class="proj-degree-badge">' + escHtml(short) + '</span>' : '';
    const eventBadge  = proj.event ? '<span class="proj-event-badge">🎮 ' + escHtml(proj.event) + '</span>' : '';
    const genreBadge  = proj.genre ? '<span class="proj-genre">' + escHtml(proj.genre) + '</span>' : '';

    const dateHTML = proj.date ? '<div class="proj-date">🗓 ' + escHtml(proj.date) + '</div>' : '';

    const awardsHTML = proj.awards && proj.awards.length
        ? '<div class="proj-awards">' + proj.awards.map(function (a) {
            return '<div class="proj-award"><span class="proj-award-icon">🏆</span>' + escHtml(a) + '</div>';
          }).join('') + '</div>'
        : '';

    const tagsHTML = proj.tags && proj.tags.length
        ? '<div class="proj-tags">' + proj.tags.map(function (t) {
            return '<span class="proj-tag-chip">' + escHtml(t) + '</span>';
          }).join('') + '</div>'
        : '';

    const stack = proj.stack && proj.stack.length
        ? '<div class="proj-stack" style="margin-top:12px">' + proj.stack.map(function (s) {
            return '<span class="st">' + escHtml(s) + '</span>';
          }).join('') + '</div>'
        : '';

    const linkBtns = [];
    if (proj.links) {
        for (const key in proj.links) {
            const label = LINK_LABEL[key] || key;
            linkBtns.push('<a href="' + encodeURI(proj.links[key]) + '" target="_blank" rel="noopener noreferrer" class="proj-link-btn">' + escHtml(label) + '</a>');
        }
    }
    if (proj.file) {
        linkBtns.push('<a href="' + assetPath(proj.slug, proj.file) + '" download class="proj-link-btn proj-link-dl">⬇ Download</a>');
    }
    const links = linkBtns.length ? '<div class="proj-links">' + linkBtns.join('') + '</div>' : '';

    const itchWidget = proj.itchId
        ? '<div class="proj-itch-wrap"><iframe frameborder="0" src="https://itch.io/embed/' + encodeURIComponent(proj.itchId) + '?border_width=3&bg_color=0D0A14&fg_color=F1E8FF&link_color=9333EA&border_color=C026D3" height="171"></iframe></div>'
        : '';

    const articlesHTML = proj.articles && proj.articles.length
        ? '<div class="proj-articles"><div class="proj-articles-label">Press &amp; Articles</div>' +
          proj.articles.map(function (a) {
            return '<a href="' + encodeURI(a.url) + '" target="_blank" rel="noopener noreferrer" class="proj-article-link">↗ ' + escHtml(a.title) + (a.source ? '<span class="proj-article-source">' + escHtml(a.source) + '</span>' : '') + '</a>';
          }).join('') + '</div>'
        : '';

    return '<div class="proj-card">' +
        cover + gallery +
        '<div class="proj-card-body">' +
        '<div class="proj-meta-row"><span class="proj-engine">' + icon + ' ' + escHtml(typeLabel) + '</span>' + genreBadge + degreeBadge + eventBadge + '</div>' +
        dateHTML +
        '<h3 class="proj-title">' + titleSafe + '</h3>' +
        '<p class="proj-desc">' + escHtml(proj.summary || proj.description || '') + '</p>' +
        awardsHTML + tagsHTML + stack + links + itchWidget + articlesHTML +
        '<a href="' + (proj.viewPage ? escHtml(proj.viewPage) : 'project.html?slug=' + slugUrl) + '" class="proj-view-btn">View Project →</a>' +
        '</div></div>';
}

function renderFilters(projects) {
    const degrees = ['all'];
    projects.forEach(function (p) {
        if (p.degree && degrees.indexOf(p.degree) === -1) degrees.push(p.degree);
    });
    const container = document.getElementById('degreeFilters');
    if (!container) return;
    container.innerHTML = degrees.map(function (d) {
        const label = d === 'all' ? 'All' : shortenDegree(d);
        const on    = d === currentDegree ? ' on' : '';
        return '<button class="filter-chip' + on + '" onclick="filterDegree(\'' + escHtml(d) + '\')">' + escHtml(label) + '</button>';
    }).join('');
}

function renderGrid() {
    const grid = document.getElementById('projGrid');
    if (!grid) return;

    // Check for data-types attribute to pre-filter by type
    const dataTypes = grid.getAttribute('data-types');
    const allowedTypes = dataTypes ? dataTypes.split(',').map(function (t) { return t.trim(); }) : null;

    const filtered = allProjects.filter(function (p) {
        const statusMatch = currentStatus === 'completed'
            ? p.status === 'completed'
            : p.status !== 'completed';
        const degreeMatch = currentDegree === 'all' || p.degree === currentDegree;
        const typeMatch   = !allowedTypes || allowedTypes.indexOf(p.type) !== -1;
        return statusMatch && degreeMatch && typeMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="proj-empty"><span class="proj-empty-icon">🔭</span>No projects here yet - check back soon.</div>';
    } else {
        grid.innerHTML = filtered.map(buildCard).join('');
    }
}

function showStatus(status) {
    currentStatus = status;
    const tDone = document.getElementById('t-done');
    const tWip  = document.getElementById('t-wip');
    if (tDone) tDone.classList.toggle('on', status === 'completed');
    if (tWip)  tWip.classList.toggle('on',  status === 'wip');
    renderGrid();
}

function filterDegree(degree) {
    currentDegree = degree;
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
        const m = chip.getAttribute('onclick').match(/'(.+)'/);
        if (m) chip.classList.toggle('on', m[1] === degree);
    });
    renderGrid();
}

// When the user navigates away, any in-flight fetch rejects with a generic
// "Failed to fetch" that is not a real fault - track unload to suppress the noise.
let _navigatingAway = false;
window.addEventListener('pagehide', function () { _navigatingAway = true; }, { once: true });

async function loadProjects() {
    const grid = document.getElementById('projGrid');
    if (!grid) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 8000);

    try {
        const manifestRes = await fetch('projects/manifest.json', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!manifestRes.ok) {
            throw new Error('Manifest fetch failed: HTTP ' + manifestRes.status);
        }

        const manifest = await manifestRes.json();

        const results = await Promise.allSettled(
            manifest.map(async function (slug) {
                const res = await fetch('projects/' + slug + '/project.json');
                if (!res.ok) throw new Error('Project ' + slug + ': HTTP ' + res.status);
                const data = await res.json();
                return Object.assign({}, data, { slug: slug });
            })
        );

        allProjects = results
            .filter(function (r) { return r.status === 'fulfilled'; })
            .map(function (r) { return r.value; });

        const failed = results.filter(function (r) { return r.status === 'rejected'; });
        if (failed.length > 0) {
            console.warn(failed.length + ' project(s) failed to load:',
                failed.map(function (r) { return r.reason && r.reason.message; }));
        }

        renderFilters(allProjects);
        renderGrid();

        // Dispatch event so pages can react
        document.dispatchEvent(new CustomEvent('projectsLoaded'));

    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            grid.innerHTML = '<div class="proj-empty">' +
                '<span class="proj-empty-icon">-</span>' +
                'Projects took too long to load. Please refresh.</div>';
        } else {
            grid.innerHTML = '<div class="proj-empty">' +
                '<span class="proj-empty-icon">-</span>' +
                'Could not load projects. Please try again.</div>';
            if (!_navigatingAway) console.error('loadProjects failed:', err);
        }
    }
}

loadProjects();
