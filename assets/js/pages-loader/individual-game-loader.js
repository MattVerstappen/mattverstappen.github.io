(function () {
    const DATA_URL = '/assets/data/individual-game-projects.json';

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
            const card = el.closest('.asset-card');
            if (card) card.style.display = 'none';
            const maybeLabel = card && card.previousElementSibling && card.previousElementSibling.classList.contains('label-card')
                ? card.previousElementSibling
                : null;
            if (maybeLabel) maybeLabel.style.display = 'none';
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

    function setDownloadOrItch(href) {
        const card = document.getElementById('card-download');
        const a = document.getElementById('asset-download');
        if (!card || !a) return;
        if (href && String(href).trim() !== '') {
            a.href = href;
            const isItch = /itch\.io/i.test(href);
            a.textContent = isItch ? '🎮 View on itch.io' : '⬇️ Download / Open';
        } else {
            card.style.display = 'none';
        }
    }

    async function init() {
        const slug = getSlug();
        try {
            const res = await fetch(DATA_URL, {cache: 'no-store'});
            if (!res.ok) throw new Error('Failed to load individual game JSON');
            const list = await res.json();

            const item = Array.isArray(list) ? list.find(x => (x.slug || '').toLowerCase() === slug) : null;
            if (!item) throw new Error('Game not found for slug: ' + slug);

            // Title
            setText('asset-title', item.title || 'Untitled Game');

            // Thumb + Description
            setImage('asset-thumb', item.thumbnail, `Thumbnail: ${item.title || 'Game'}`, 'card-thumb');
            setText('asset-desc', item.description || '', true);

            // Screenshots
            setImage('asset-shot1', item.screenShot1, 'Screenshot 1', 'card-shot1');
            setImage('asset-shot2', item.screenShot2, 'Screenshot 2', 'card-shot2');
            setImage('asset-shot3', item.screenShot3, 'Screenshot 3', 'card-shot3');
            setImage('asset-shot4', item.screenShot4, 'Screenshot 4', 'card-shot4');
            setImage('asset-shot5', item.screenShot5, 'Screenshot 5', 'card-shot5');
            setImage('asset-shot6', item.screenShot6, 'Screenshot 6', 'card-shot6');

            // Status
            setText('asset-status', item.status || '', true);

            // Platforms / Authors / Genres / Tags
            setChips('asset-platforms', item.platforms, 'label-platforms', 'card-platforms');
            setChips('asset-authors', item.authors, 'label-authors', 'card-authors');
            setChips('asset-genres', item.genres, 'label-genres', 'card-genres');
            setChips('asset-tags', item.tags, 'label-tags', 'card-tags');

            // Download / Itch link
            setDownloadOrItch(item.itchiolink || '');

        } catch (err) {
            console.error(err);
            document.getElementById('asset-error').style.display = 'block';
            setText('asset-title', 'Game Not Found');
            [
                'card-thumb', 'card-desc', 'card-shot1', 'card-shot2', 'card-shot3', 'card-shot4', 'card-shot5', 'card-shot6',
                'label-status', 'card-status', 'label-platforms', 'card-platforms',
                'label-genres', 'card-genres', 'label-tags', 'card-tags', 'card-download'
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        }
    }

    document.addEventListener('includesLoaded', init);
    if (document.readyState !== 'loading') {
        setTimeout(init, 0);
    }
})()