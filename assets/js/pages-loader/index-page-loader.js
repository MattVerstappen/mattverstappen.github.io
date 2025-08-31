(function () {
    // Reuse project-card visuals from projects-style.css
    function createCard({ href, title, description, thumbnail }, external = false) {
        const a = document.createElement('a');
        a.className = 'project-card';
        a.href = href;
        if (external) { a.target = '_blank'; a.rel = 'noopener'; }
        a.setAttribute('aria-label', `Open ${title}`);

        const fig = document.createElement('figure');
        fig.className = 'project-thumb';
        const img = document.createElement('img');
        img.src = thumbnail;
        img.alt = `Thumbnail for ${title}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        fig.appendChild(img);

        const meta = document.createElement('div');
        meta.className = 'project-meta';
        const h3 = document.createElement('h3');
        h3.className = 'project-title';
        h3.textContent = title;
        const p = document.createElement('p');
        p.className = 'project-desc';
        p.textContent = description;
        meta.appendChild(h3);
        meta.appendChild(p);

        a.appendChild(fig);
        a.appendChild(meta);
        return a;
    }

    async function loadFeaturedProjects(limit = 6) {
        const root = document.getElementById('home-projects-grid');
        if (!root) return;
        try {
            root.innerHTML = '<p style="text-align:center; opacity:.7;">Loading…</p>';
            const res = await fetch('/assets/data/projects.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load projects.json');
            const items = await res.json();

            root.innerHTML = '';
            (items || []).slice(0, limit).forEach(prj => {
                root.appendChild(createCard({
                    href: prj.href,
                    title: prj.title,
                    description: prj.description || 'Project details and images.',
                    thumbnail: prj.thumbnail
                }));
            });

            if (!items || items.length === 0) {
                root.innerHTML = '<div class="projects-error" style="text-align:center; opacity:.8;">No projects yet.</div>';
            }
        } catch (e) {
            console.error(e);
            root.innerHTML = '<div class="projects-error" style="text-align:center; opacity:.8;">Could not load projects.</div>';
        }
    }

    async function loadFeaturedWebsites(limit = 4) {
        const root = document.getElementById('home-websites-grid');
        if (!root) return;
        try {
            root.innerHTML = '<p style="text-align:center; opacity:.7;">Loading…</p>';
            const res = await fetch('/assets/data/websites.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load websites.json');
            const items = await res.json();

            root.innerHTML = '';
            (items || []).slice(0, limit).forEach(site => {
                root.appendChild(createCard({
                    href: site.url,
                    title: site.title,
                    description: site.shortDesc || (site.tags ? site.tags.join(', ') : 'Website build'),
                    thumbnail: site.thumbnail
                }, /* external */ true));
            });

            if (!items || items.length === 0) {
                root.innerHTML = '<div class="projects-error" style="text-align:center; opacity:.8;">No websites yet.</div>';
            }
        } catch (e) {
            console.error(e);
            root.innerHTML = '<div class="projects-error" style="text-align:center; opacity:.8;">Could not load websites.</div>';
        }
    }

    // Run after includes so header/footer are in place
    document.addEventListener('includesLoaded', () => {
        loadFeaturedProjects(6);
        loadFeaturedWebsites(4);
    });
})()