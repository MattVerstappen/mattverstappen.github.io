/**
 * toolkit.js
 * Manifest-driven filter gallery controller for toolkit.html.
 *
 * Mirrors creative-coding.js but targets the toolkit section: reads
 * /toolkit/manifest.json, fetches each script's [slug].json, builds the tag
 * filter UI, and renders cards that show a release-status badge and a
 * "View on GitHub" link. Vanilla JS only.
 */
(function () {
    'use strict';

    var MANIFEST_URL = '/toolkit/manifest.json';
    var BASE_PATH    = '/toolkit/';

    // Readable labels for known tag values. Unknown tags fall back to a
    // simple capitalisation of the first letter.
    var TAG_LABELS = {
        'all':               'All',
        'web':               'Web',
        'interactive-demo':  'Interactive Demo',
        'canvas':            'Canvas',
        'webgl':             'WebGL',
        '3d':                '3D',
        'unity':             'Unity',
        'tools-and-scripts': 'Tools & Scripts',
        'utility':           'Utility',
        'gameplay':          'Gameplay',
        'audio':             'Audio',
        'ui':                'UI',
        'data-persistence':  'Data Persistence'
    };

    function labelFor(tag) {
        if (TAG_LABELS[tag]) return TAG_LABELS[tag];
        return tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    function statusLabel(status) {
        return status === 'available' ? 'Available' : 'Planned';
    }

    function escHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var filterBar = document.getElementById('tk-filter-bar');
        var gallery   = document.getElementById('tk-gallery');

        // If either container is missing, this is not the toolkit page.
        if (!filterBar || !gallery) return;

        init(filterBar, gallery);
    });

    async function init(filterBar, gallery) {
        var items;
        try {
            items = await loadItems();
        } catch (err) {
            console.error('[toolkit] failed to load manifest:', err);
            return;
        }
        if (!items.length) return;

        // Featured items first, then the rest in manifest order (stable).
        var ordered = items.filter(function (i) { return i.featured; })
            .concat(items.filter(function (i) { return !i.featured; }));

        renderGallery(gallery, ordered);
        renderFilters(filterBar, gallery, items);
    }

    // Fetch the manifest, then each [slug].json in parallel. A failed item
    // is logged and skipped rather than crashing the whole page.
    async function loadItems() {
        var res = await fetch(MANIFEST_URL);
        if (!res.ok) throw new Error('manifest HTTP ' + res.status);

        var slugs = await res.json();

        var results = await Promise.all(slugs.map(function (slug) {
            return fetch(BASE_PATH + slug + '/' + slug + '.json')
                .then(function (r) {
                    if (!r.ok) throw new Error(slug + ' HTTP ' + r.status);
                    return r.json();
                })
                .catch(function (err) {
                    console.error('[toolkit] skipping "' + slug + '":', err);
                    return null;
                });
        }));

        return results.filter(Boolean);
    }

    function renderFilters(filterBar, gallery, items) {
        // Collect unique tags by first appearance in manifest order.
        var seen = {};
        var tags = [];
        items.forEach(function (item) {
            (item.tags || []).forEach(function (t) {
                if (!seen[t]) { seen[t] = true; tags.push(t); }
            });
        });

        var allTags = ['all'].concat(tags);

        filterBar.innerHTML = '';
        allTags.forEach(function (tag) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'filter-btn' + (tag === 'all' ? ' active' : '');
            btn.setAttribute('data-tag', tag);
            btn.textContent = labelFor(tag);
            btn.addEventListener('click', function () {
                var buttons = filterBar.querySelectorAll('.filter-btn');
                for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
                btn.classList.add('active');
                applyFilter(gallery, tag);
            });
            filterBar.appendChild(btn);
        });
    }

    function renderGallery(gallery, ordered) {
        gallery.innerHTML = '';
        ordered.forEach(function (item) {
            gallery.appendChild(buildCard(item));
        });
    }

    function buildCard(item) {
        var tags = item.tags || [];
        var planned = item.status === 'planned';

        var tagSpans = tags.map(function (t) {
            return '<span class="tag">' + escHtml(labelFor(t)) + '</span>';
        }).join('');

        var badgeClass = planned ? 'status-planned' : 'status-available';

        var article = document.createElement('article');
        article.className = 'project-card' + (planned ? ' is-planned' : '');
        article.setAttribute('data-tags', tags.join(' '));
        article.innerHTML =
            '<div class="card-body">' +
                '<div class="card-head">' +
                    '<h3 class="card-title">' + escHtml(item.title) + '</h3>' +
                    '<span class="status-badge ' + badgeClass + '">' + escHtml(statusLabel(item.status)) + '</span>' +
                '</div>' +
                '<p class="card-desc">' + escHtml(item.description) + '</p>' +
                '<div class="card-tags">' + tagSpans + '</div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<a href="' + escHtml(item.github) + '" class="btn btn-primary" target="_blank" rel="noopener">View on GitHub</a>' +
            '</div>';

        return article;
    }

    function applyFilter(gallery, tag) {
        var cards = gallery.querySelectorAll('.project-card');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cardTags = (card.getAttribute('data-tags') || '').split(/\s+/);
            var show = tag === 'all' || cardTags.indexOf(tag) !== -1;
            card.classList.toggle('hidden', !show);
        }
    }
})();
