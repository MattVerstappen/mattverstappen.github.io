(function () {
    const SOCIAL_ICON_MAP = {
        instagram: '/assets/images/socials-images/instagram.svg',
        youtube:   '/assets/images/socials-images/youtube.svg',
        steam:     '/assets/images/socials-images/steam.svg',
        itchio:    '/assets/images/socials-images/itchio.svg',
        linkedin:  '/assets/images/socials-images/linkedin.svg',
        twitter:   '/assets/images/socials-images/twitter.svg',
        github:   '/assets/images/socials-images/github.svg'
    };

    const CONTACT_ICON_MAP = {
        phone: '/assets/images/socials-images/phone.svg',
        email: '/assets/images/socials-images/mail.svg'
    };

    async function loadFooterData() {
        const res = await fetch('/assets/data/footer.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load footer.json');
        return await res.json();
    }

    function toTitle(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
    }

    function createIconLink(href, iconSrc, label) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'footer-social-link';
        a.setAttribute('aria-label', label);

        const img = document.createElement('img');
        img.src = iconSrc;
        img.width = 24;
        img.height = 24;
        img.alt = label;
        img.loading = 'lazy';

        a.appendChild(img);
        return a;
    }

    function createContactItem(iconSrc, text, href) {
        const li = document.createElement('li');
        li.className = 'footer-contact-item';

        const icon = document.createElement('img');
        icon.src = iconSrc;
        icon.width = 20;
        icon.height = 20;
        icon.alt = '';
        icon.setAttribute('aria-hidden', 'true');

        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;

        li.appendChild(icon);
        li.appendChild(link);
        return li;
    }

    async function initFooter() {
        const footer = document.querySelector('.site-footer');
        if (!footer) return;

        // Targets
        const socialRoot  = document.getElementById('footer-social');
        const contactRoot = document.getElementById('footer-contact-list');
        const yearEl      = document.getElementById('footer-year');
        if (!socialRoot || !contactRoot) return;

        // Reset containers in case of re-run
        socialRoot.innerHTML = '';
        contactRoot.innerHTML = '';

        // Year
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // Data
        let data;
        try {
            data = await loadFooterData();
        } catch (err) {
            console.error('Footer JSON load error:', err);
            return;
        }
        if (!data?.contact) return;

        const { phone, email, social = {} } = data.contact;

        // Contact
        if (phone) {
            const telHref = 'tel:' + phone.replace(/\s+/g, '');
            contactRoot.appendChild(createContactItem(CONTACT_ICON_MAP.phone, phone, telHref));
        }
        if (email) {
            contactRoot.appendChild(createContactItem(CONTACT_ICON_MAP.email, email, 'mailto:' + email));
        }

        // Socials
        Object.entries(social).forEach(([key, url]) => {
            const iconSrc = SOCIAL_ICON_MAP[key];
            if (!iconSrc || !url) return;
            socialRoot.appendChild(createIconLink(url, iconSrc, toTitle(key)));
        });
    }

    // Run after includes are injected
    document.addEventListener('includesLoaded', initFooter);

    // Extra safety: if this script loads after includes, or footer already exists
    if (document.readyState !== 'loading') {
        // Defer a tick to allow the include to render if it just happened
        setTimeout(initFooter, 0);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initFooter, 0));
    }
})();
