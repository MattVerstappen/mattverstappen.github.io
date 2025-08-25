(function () {
    const DATA_URL = '/assets/data/individual-papers-projects.json';

    function getSlug() {
        const url = new URL(location.href);
        const q = url.searchParams.get('slug');
        if (q) return q.trim().toLowerCase();
        const file = location.pathname.split('/').pop() || '';
        return file.replace(/\.html?$/i, '').trim().toLowerCase();
    }

    function setText(id, text, hideIfEmpty = false) {
        const el = document.getElementById(id);
        if (!el) return;
        if (text && String(text).trim() !== '') {
            el.textContent = text;
        } else if (hideIfEmpty) {
            const card = el.closest('.paper-card');
            if (card) card.style.display = 'none';
            const label = card && card.previousElementSibling && card.previousElementSibling.classList.contains('label-card')
                ? card.previousElementSibling
                : null;
            if (label) label.style.display = 'none';
        }
    }

    function setImage(imgId, src, alt, cardId) {
        const img = document.getElementById(imgId);
        const card = document.getElementById(cardId);
        if (!img || !card) return;
        if (src && String(src).trim() !== '') {
            img.src = src;
            img.alt = alt || '';
        } else {
            card.style.display = 'none';
        }
    }

    function setChips(listId, arr, labelCardId, valueCardId) {
        const ul = document.getElementById(listId);
        const labelCard = document.getElementById(labelCardId);
        const valueCard = document.getElementById(valueCardId);
        if (!ul || !labelCard || !valueCard) return;
        ul.innerHTML = '';

        if (Array.isArray(arr) && arr.length) {
            arr.forEach(txt => {
                const li = document.createElement('li');
                li.className = 'meta-chip';
                li.textContent = txt;
                ul.appendChild(li);
            });
        } else {
            labelCard.style.display = 'none';
            valueCard.style.display = 'none';
        }
    }

    function setDownload(href, slug) {
        const card = document.getElementById('card-download');
        const a = document.getElementById('paper-download');
        if (!card || !a) return;

        // Prefer explicit downloadref; fallback to /assets/downloads/papers/<slug>.pdf
        const finalHref = (href && String(href).trim() !== '')
            ? href
            : (slug ? `/assets/downloads/papers/${slug}.pdf` : '');

        if (finalHref) {
            a.href = finalHref;
        } else {
            card.style.display = 'none';
        }
    }

    async function init() {
        const slug = getSlug();
        try {
            const res = await fetch(DATA_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load individual papers JSON');
            const list = await res.json();

            const item = Array.isArray(list) ? list.find(x => (x.slug || '').toLowerCase() === slug) : null;
            if (!item) throw new Error('Paper not found for slug: ' + slug);

            // Title
            setText('paper-title', item.title || 'Untitled Paper');

            // Thumbnail + Description
            setImage('paper-thumb', item.thumbnail, `Thumbnail: ${item.title || 'Paper'}`, 'card-thumb');
            setText('paper-desc', item.description || '', true);

            // Status
            setText('paper-status', item.status || '', true);

            // Authors / Genres / Tags (arrays)
            setChips('paper-authors', item.authors, 'label-authors', 'card-authors');
            setChips('paper-genres', item.genres, 'label-genres', 'card-genres');
            setChips('paper-tags', item.tags, 'label-tags', 'card-tags');

            // Download PDF
            setDownload(item.downloadref || item.downloadRef || '', item.slug || slug);

        } catch (err) {
            console.error(err);
            document.getElementById('paper-error').style.display = 'block';
            setText('paper-title', 'Paper Not Found');
            [
                'card-thumb','card-desc',
                'label-status','card-status',
                'label-authors','card-authors',
                'label-genres','card-genres',
                'label-tags','card-tags',
                'card-download'
            ].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        }
    }

    document.addEventListener('includesLoaded', init);
    if (document.readyState !== 'loading') {
        setTimeout(init, 0);
    }
})()