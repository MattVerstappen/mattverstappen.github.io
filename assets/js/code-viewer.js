/**
 * code-viewer.js
 * Shared tabbed code-block component for the Phase 5B project view pages.
 * Renders file tabs + a header (filename, language badge, copy button) +
 * a Prism-highlighted code body. Supports fetching from same-origin
 * relative paths or raw.githubusercontent.com, or rendering inline text
 * with no fetch. On fetch failure, shows a "View on GitHub" fallback link.
 */

(function () {
    'use strict';

    const LANG_BADGE = {
        javascript: { label: 'JS',   cls: 'cv-badge-js' },
        css:        { label: 'CSS',  cls: 'cv-badge-css' },
        csharp:     { label: 'C#',   cls: 'cv-badge-cs' },
        json:       { label: 'JSON', cls: 'cv-badge-json' },
        markup:     { label: 'HTML', cls: 'cv-badge-html' },
        markdown:   { label: 'MD',   cls: 'cv-badge-md' },
    };

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function toGithubBlobUrl(path) {
        const rawPrefix = 'https://raw.githubusercontent.com/';
        if (path.indexOf(rawPrefix) === 0) {
            const rest   = path.slice(rawPrefix.length).split('/');
            const owner  = rest[0], repo = rest[1], branch = rest[2];
            const filePath = rest.slice(3).join('/');
            return 'https://github.com/' + owner + '/' + repo + '/blob/' + branch + '/' + filePath;
        }
        return 'https://github.com/MattVerstappen/mattverstappen.github.io/blob/main/' + path;
    }

    // files: [{ label, lang, path }] to fetch, or [{ label, lang, inline }] for static text
    window.initCodeViewer = function (root, files) {
        if (!root || !files || !files.length) return;

        if (files.length === 1) root.classList.add('cv-single');

        const tabsEl  = root.querySelector('.cv-tabs');
        const nameEl  = root.querySelector('.cv-filename');
        const badgeEl = root.querySelector('.cv-lang-badge');
        const copyBtn = root.querySelector('.cv-copy-btn');
        const codeEl  = root.querySelector('.cv-code');

        const cache = {};
        let active = 0;
        let currentRaw = '';

        function show(text) {
            currentRaw = text;
            codeEl.textContent = text;
            if (window.Prism) window.Prism.highlightElement(codeEl);
        }

        function render() {
            const f = files[active];
            nameEl.textContent = f.label;

            const badge = LANG_BADGE[f.lang] || { label: (f.lang || '').toUpperCase() || 'TXT', cls: 'cv-badge-default' };
            badgeEl.textContent = badge.label;
            badgeEl.className = 'cv-lang-badge ' + badge.cls;

            Array.prototype.forEach.call(tabsEl.children, function (btn, i) {
                btn.classList.toggle('on', i === active);
            });

            codeEl.className = 'cv-code language-' + f.lang;

            if (f.inline !== undefined) {
                show(f.inline);
                return;
            }

            if (cache[f.path] !== undefined) {
                show(cache[f.path]);
                return;
            }

            codeEl.textContent = 'Loading...';
            fetch(f.path)
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.text();
                })
                .then(function (text) {
                    cache[f.path] = text;
                    if (files[active] === f) show(text);
                })
                .catch(function () {
                    if (files[active] !== f) return;
                    currentRaw = '';
                    const url = toGithubBlobUrl(f.path);
                    codeEl.textContent = '';
                    codeEl.className = 'cv-code';
                    const wrap = document.createElement('div');
                    wrap.className = 'cv-error';
                    wrap.innerHTML = 'Could not load file. <a href="' + url + '" target="_blank" rel="noopener noreferrer">View it on GitHub &rarr;</a>';
                    codeEl.appendChild(wrap);
                });
        }

        tabsEl.innerHTML = files.map(function (f, i) {
            return '<button type="button" class="cv-tab' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' +
                escHtml(f.label) + '</button>';
        }).join('');

        tabsEl.addEventListener('click', function (e) {
            const btn = e.target.closest('.cv-tab');
            if (!btn) return;
            active = parseInt(btn.getAttribute('data-i'), 10);
            render();
        });

        copyBtn.addEventListener('click', function () {
            if (!currentRaw) return;
            navigator.clipboard.writeText(currentRaw).then(function () {
                const orig = copyBtn.textContent;
                copyBtn.textContent = 'Copied ✓';
                copyBtn.classList.add('copied');
                setTimeout(function () {
                    copyBtn.textContent = orig;
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        render();
    };
})();
