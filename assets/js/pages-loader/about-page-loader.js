(function () {
    const JSON_PATH = '/assets/data/about-me.json';

    const $ = (id) => document.getElementById(id);

    function telHref(raw) {
        // strip spaces, parentheses, hyphens for tel: link
        return 'tel:' + (raw || '').replace(/[()\s-]/g, '');
    }

    function renderQuickInfo(items = []) {
        const root = $('info-grid');
        if (!root) return;

        root.innerHTML = '';
        items.forEach(({ label, value, href }) => {
            if (!label || !value) return;

            const item = document.createElement('div');
            item.className = 'info-item';

            const lab = document.createElement('span');
            lab.className = 'info-label';
            lab.textContent = label;

            let valEl;
            if (href) {
                valEl = document.createElement('a');
                valEl.href = href;
                valEl.className = 'info-value info-link';
                valEl.textContent = value;
            } else {
                valEl = document.createElement('span');
                valEl.className = 'info-value';
                valEl.textContent = value;
            }

            item.appendChild(lab);
            item.appendChild(valEl);
            root.appendChild(item);
        });
    }

    function renderSkills(skills = []) {
        const ul = $('skills-list');
        if (!ul) return;
        ul.innerHTML = '';
        skills.forEach((s) => {
            const li = document.createElement('li');
            li.className = 'skill-chip';
            li.textContent = s;
            ul.appendChild(li);
        });
    }

    function renderAbout(paragraphs = []) {
        const box = $('about-description');
        if (!box) return;
        box.innerHTML = '';
        paragraphs.forEach((text) => {
            const p = document.createElement('p');
            p.textContent = text;
            box.appendChild(p);
        });
    }

    async function init() {
        try {
            const res = await fetch(JSON_PATH, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load about-me.json');
            const data = await res.json();

            // Title / subtitle
            if (data.title) $('about-title').textContent = data.title;
            if (data.subtitle) $('about-subtitle').textContent = data.subtitle;

            // Profile photo + CV
            if (data.profilePhoto) {
                const img = $('about-photo');
                img.src = data.profilePhoto;
                img.alt = (data.fullName || 'Profile') + ' — profile photo';
            }
            if (data.cvFile) {
                const cv = $('cv-link');
                cv.href = data.cvFile;
            }

            // Quick info
            const quick = [];
            if (data.fullName) quick.push({ label: 'Full Name', value: data.fullName });
            if (data.email) quick.push({ label: 'Email', value: data.email, href: 'mailto:' + data.email });
            if (data.phone) quick.push({ label: 'Phone', value: data.phone, href: telHref(data.phone) });
            if (data.location) quick.push({ label: 'Location', value: data.location });
            if (data.role) quick.push({ label: 'Role', value: data.role });
            renderQuickInfo(quick);

            // Skills
            if (Array.isArray(data.skills)) renderSkills(data.skills);

            // About paragraphs
            if (Array.isArray(data.about)) renderAbout(data.about);

        } catch (e) {
            console.error('About page data load error:', e);
            // Minimal graceful fallback (page already has default placeholders)
        }
    }

    // Run after includes so header/footer are in place
    document.addEventListener('includesLoaded', init);
    if (document.readyState !== 'loading') {
        // In case includes are already done
        setTimeout(init, 0);
    }
})()