(function () {
    'use strict';

    const TOKENS_URL = '/assets/data/global-tokens.json';

    // Helper: set CSS var
    const setVar = (name, value) => {
        if (value == null || value === '') return;
        document.documentElement.style.setProperty(name, String(value));
    };

    // Ensure px suffix for spacing numbers
    const px = (v) => (typeof v === 'number' ? `${v}px` : v);

    async function applyTokens() {
        try {
            const res = await fetch(TOKENS_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to load tokens: ${res.status}`);
            const json = await res.json();

            const { colors = {}, spacing = {}, type = {}, fonts = {} } = json;

            // Colors
            setVar('--bg', colors.bg);
            setVar('--fg', colors.fg);
            setVar('--muted', colors.muted);
            setVar('--primary', colors.primary);
            setVar('--accent-2', colors.accent2);
            setVar('--panel', colors.panel);
            setVar('--border', colors.border);

            // Spacing
            setVar('--space-xs', px(spacing.xs));
            setVar('--space-sm', px(spacing.sm));
            setVar('--space-md', px(spacing.md));
            setVar('--space-lg', px(spacing.lg));
            setVar('--space-xl', px(spacing.xl));
            setVar('--space-2xl', px(spacing.xxl));
            setVar('--space-3xl', px(spacing.xxxl));

            // Type
            setVar('--text-sm', type.sm);
            setVar('--text-base', type.base);
            setVar('--text-lg', type.lg);
            setVar('--text-xl', type.xl);
            setVar('--text-2xl', type.xxl);
            setVar('--text-3xl', type.xxxl);
            setVar('--text-4xl', type.xxxxl);

            // Fonts
            setVar('--font-heading', fonts.heading);
            setVar('--font-body', fonts.body);

            console.info('✅ Global tokens applied from JSON.');
        } catch (err) {
            console.warn('⚠️ Using fallback CSS token values (JSON failed):', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyTokens);
    } else {
        applyTokens();
    }
})();
