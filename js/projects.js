/* ── PROJECT GRID SYSTEM ── */

var allProjects = [];
var currentStatus = 'completed';
var currentDegree = 'all';

var DEGREE_SHORT = {
    'BA Honours in Design Leadership':             'BA Honours',
    'BCIS in Game Design and Development':         'BCIS',
    'BCIS in Game Design And Game Development':    'BCIS',
    'Personal':                                    'Personal',
};

var TYPE_ICON = {
    research: '📄',
    game:     '🎮',
    app:      '📱',
    web:      '🌐',
    design:   '🎨',
    other:    '📦',
};

// Custom mdr-icons.js icon name per project type (used for cover placeholder / fallback)
var TYPE_ICON_NAME = {
    research: 'paper',
    game:     'gamepad',
    app:      'code',
    web:      'globe',
    design:   'spark',
    other:    'card',
};

var LINK_LABEL = {
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
    var short     = shortenDegree(proj.degree);
    var icon      = TYPE_ICON[proj.type] || '📦';
    var typeLabel = proj.type ? proj.type.charAt(0).toUpperCase() + proj.type.slice(1) : 'Project';

    var catBadge   = proj.engine ? '<span class="project-category-badge">' + proj.engine + '</span>' : '';
    var fallbackIcon = (typeof mdrIcon === 'function')
        ? mdrIcon(TYPE_ICON_NAME[proj.type] || 'gamepad', 40) : '';
    var fallbackDiv = function (visible) {
        return '<div class="cover-icon-fallback" style="display:' + (visible ? 'flex' : 'none') +
               '; align-items:center; justify-content:center; height:100%; color:var(--accent);">' + fallbackIcon + '</div>';
    };

    var coverSrc = proj.coverImage
        ? 'projects/' + proj.slug + '/' + proj.coverImage
        : proj.photos > 0 ? 'projects/' + proj.slug + '/cover.jpg' : null;

    var coverInner;
    if (coverSrc) {
        var onerr = "this.closest('.proj-cover-wrap').querySelector('.cover-icon-fallback').style.display='flex';";
        var imgTag;
        if (proj.coverWebp) {
            imgTag = '<picture><source type="image/webp" srcset="projects/' + proj.slug + '/' + proj.coverWebp + '">' +
                     '<img src="' + coverSrc + '" class="proj-cover" loading="lazy" decoding="async" alt="' + proj.title + '" ' +
                     'onerror="this.closest(\'picture\').style.display=\'none\'; ' + onerr + '"></picture>';
        } else {
            imgTag = '<img src="' + coverSrc + '" class="proj-cover" loading="lazy" decoding="async" alt="' + proj.title + '" ' +
                     'onerror="this.style.display=\'none\'; ' + onerr + '">';
        }
        coverInner = imgTag + fallbackDiv(false);
    } else {
        // No cover image - use the category icon as the cover area.
        coverInner = fallbackDiv(true);
    }
    var cover = '<a href="project.html?slug=' + proj.slug + '" class="proj-cover-link">' +
                '<div class="proj-cover-wrap">' + catBadge + coverInner + '</div></a>';

    var gallery = proj.photoFiles && proj.photoFiles.length
        ? '<div class="proj-gallery">' + proj.photoFiles.map(function (f) {
            return '<a href="project.html?slug=' + proj.slug + '"><img src="projects/' + proj.slug + '/' + f + '" class="proj-thumb" onerror="this.style.display=\'none\'" alt="' + proj.title + ' screenshot"></a>';
          }).join('') + '</div>'
        : '';

    var degreeBadge = short ? '<span class="proj-degree-badge">' + short + '</span>' : '';
    var eventBadge  = proj.event ? '<span class="proj-event-badge">🎮 ' + proj.event + '</span>' : '';
    var genreBadge  = proj.genre ? '<span class="proj-genre">' + proj.genre + '</span>' : '';

    var dateHTML = proj.date ? '<div class="proj-date">🗓 ' + proj.date + '</div>' : '';

    var awardsHTML = proj.awards && proj.awards.length
        ? '<div class="proj-awards">' + proj.awards.map(function (a) {
            return '<div class="proj-award"><span class="proj-award-icon">🏆</span>' + a + '</div>';
          }).join('') + '</div>'
        : '';

    var tagsHTML = proj.tags && proj.tags.length
        ? '<div class="proj-tags">' + proj.tags.map(function (t) {
            return '<span class="proj-tag-chip">' + t + '</span>';
          }).join('') + '</div>'
        : '';

    var stack = proj.stack && proj.stack.length
        ? '<div class="proj-stack" style="margin-top:12px">' + proj.stack.map(function (s) {
            return '<span class="st">' + s + '</span>';
          }).join('') + '</div>'
        : '';

    var linkBtns = [];
    if (proj.links) {
        for (var key in proj.links) {
            var label = LINK_LABEL[key] || key;
            linkBtns.push('<a href="' + proj.links[key] + '" target="_blank" rel="noopener noreferrer" class="proj-link-btn">' + label + '</a>');
        }
    }
    if (proj.file) {
        linkBtns.push('<a href="projects/' + proj.slug + '/' + proj.file + '" download class="proj-link-btn proj-link-dl">⬇ Download</a>');
    }
    var links = linkBtns.length ? '<div class="proj-links">' + linkBtns.join('') + '</div>' : '';

    var itchWidget = proj.itchId
        ? '<div class="proj-itch-wrap"><iframe frameborder="0" src="https://itch.io/embed/' + proj.itchId + '?border_width=3&bg_color=0D0A14&fg_color=F1E8FF&link_color=9333EA&border_color=C026D3" height="171"></iframe></div>'
        : '';

    var articlesHTML = proj.articles && proj.articles.length
        ? '<div class="proj-articles"><div class="proj-articles-label">Press &amp; Articles</div>' +
          proj.articles.map(function (a) {
            return '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer" class="proj-article-link">↗ ' + a.title + (a.source ? '<span class="proj-article-source">' + a.source + '</span>' : '') + '</a>';
          }).join('') + '</div>'
        : '';

    return '<div class="proj-card">' +
        cover + gallery +
        '<div class="proj-card-body">' +
        '<div class="proj-meta-row"><span class="proj-engine">' + icon + ' ' + typeLabel + '</span>' + genreBadge + degreeBadge + eventBadge + '</div>' +
        dateHTML +
        '<h3 class="proj-title">' + proj.title + '</h3>' +
        '<p class="proj-desc">' + (proj.summary || proj.description || '') + '</p>' +
        awardsHTML + tagsHTML + stack + links + itchWidget + articlesHTML +
        '<a href="project.html?slug=' + proj.slug + '" class="proj-view-btn">View Project →</a>' +
        '</div></div>';
}

function renderFilters(projects) {
    var degrees = ['all'];
    projects.forEach(function (p) {
        if (p.degree && degrees.indexOf(p.degree) === -1) degrees.push(p.degree);
    });
    var container = document.getElementById('degreeFilters');
    if (!container) return;
    container.innerHTML = degrees.map(function (d) {
        var label = d === 'all' ? 'All' : shortenDegree(d);
        var on    = d === currentDegree ? ' on' : '';
        return '<button class="filter-chip' + on + '" onclick="filterDegree(\'' + d + '\')">' + label + '</button>';
    }).join('');
}

function renderGrid() {
    var grid = document.getElementById('projGrid');
    if (!grid) return;

    // Check for data-types attribute to pre-filter by type
    var dataTypes = grid.getAttribute('data-types');
    var allowedTypes = dataTypes ? dataTypes.split(',').map(function (t) { return t.trim(); }) : null;

    var filtered = allProjects.filter(function (p) {
        var statusMatch = currentStatus === 'completed'
            ? p.status === 'completed'
            : p.status !== 'completed';
        var degreeMatch = currentDegree === 'all' || p.degree === currentDegree;
        var typeMatch   = !allowedTypes || allowedTypes.indexOf(p.type) !== -1;
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
    var tDone = document.getElementById('t-done');
    var tWip  = document.getElementById('t-wip');
    if (tDone) tDone.classList.toggle('on', status === 'completed');
    if (tWip)  tWip.classList.toggle('on',  status === 'wip');
    renderGrid();
}

function filterDegree(degree) {
    currentDegree = degree;
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
        var m = chip.getAttribute('onclick').match(/'(.+)'/);
        if (m) chip.classList.toggle('on', m[1] === degree);
    });
    renderGrid();
}

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
            console.error('loadProjects failed:', err);
        }
    }
}

loadProjects();
