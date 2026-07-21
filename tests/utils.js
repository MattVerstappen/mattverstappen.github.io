// @ts-check
// Shared helpers for the Playwright suite.

// Third-party hosts whose console noise / network failures are not the site's
// responsibility (analytics, CDNs, embeds). Errors mentioning these are ignored
// when asserting the page itself is clean.
const THIRD_PARTY = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'clarity.ms',
  'doubleclick.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'formspree.io',
  'itch.io',
  'gtag',
  'clarity',
];

/**
 * Attach console + pageerror listeners and return an accessor for
 * first-party errors only (third-party analytics/CDN noise filtered out).
 * @param {import('@playwright/test').Page} page
 */
function collectPageErrors(page) {
  const errors = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    const url = (msg.location() && msg.location().url) || '';
    const haystack = (text + ' ' + url).toLowerCase();
    if (THIRD_PARTY.some((h) => haystack.includes(h))) return;
    // Resource-load failures for third parties surface as generic text; skip those too.
    if (/failed to load resource/i.test(text) && !url.includes('127.0.0.1')) return;
    errors.push(text);
  });

  page.on('pageerror', (err) => {
    const msg = String(err && err.message ? err.message : err);
    if (THIRD_PARTY.some((h) => msg.toLowerCase().includes(h))) return;
    errors.push(msg);
  });

  return {
    get list() { return errors; },
  };
}

// Every public, indexable page and its expected <title>.
const PAGES = [
  { path: '/', title: /Matthew Derek Rall/ },
  { path: '/about.html', title: /About/ },
  { path: '/work.html', title: /Work/ },
  { path: '/research.html', title: /Research/ },
  { path: '/achievements.html', title: /Achievements/ },
  { path: '/contact.html', title: /Contact/ },
];

module.exports = { THIRD_PARTY, collectPageErrors, PAGES };
