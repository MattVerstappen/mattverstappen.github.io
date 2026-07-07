# mattverstappen.github.io

## Creative Coding Demos + Home Nav

### Part A - Home nav link
- [x] nav_home translation key added to all 8 languages
- [x] Home link added to nav on all 8 pages
- [x] translations.min.js rebuilt

### Part B - Creative coding folder structure
- [x] creative-coding/atmosphere/ created with CSS
- [x] creative-coding/blackhole/ created with CSS
- [x] creative-coding/meteor-shower/ created with CSS and JS
- [x] creative-coding/lightning/ created with CSS and JS
- [x] creative-coding/binary-rain/ created (moved from inline)

### Part C - creative-coding.html updated
- [x] Atmosphere demo added
- [x] Black Hole demo added
- [x] Meteor Shower demo added
- [x] Purple Lightning + Rain demo added
- [x] Demo CSS files linked in creative-coding.html head
- [x] Nav updated with Home link

## Creative Coding Demos + Home Nav - Status: COMPLETE

## Visual Improvements + Creative Coding Page

### Part A - CSS Improvements
- [x] css/style.css updated with animation and shadow improvements

### Part B - Particle Network (all pages)
- [x] js/particle-network.js created
- [x] Particle canvas added to index.html
- [x] Particle canvas added to about.html
- [x] Particle canvas added to work.html
- [x] Particle canvas added to research.html
- [x] Particle canvas added to achievements.html
- [x] Particle canvas added to contact.html
- [x] Particle canvas added to project.html

### Part C - Creative Coding Page
- [x] creative-coding.html created
- [x] Nav updated on all 8 pages to include Creative Coding link
- [x] translations.js updated with Creative Coding nav label
- [x] sitemap.xml updated with creative-coding.html

### Part D - Scroll Progress + Hero JS
- [x] js/nav.js updated with scroll progress and hero spotlight

## Visual Improvements + Creative Coding Page - Status: COMPLETE

All particle network, CSS improvements, and Creative Coding page
changes are live on the current branch.

## Remaining Fixes - Round 3 - Status: COMPLETE

- [x] Em dashes replaced with hyphens (none found - already clean)
- [x] Nav logo /index.html links changed to / (already done on all pages)
- [x] Featured project images updated to WebP on homepage (already using picture/WebP)
- [x] translations files confirmed - pages load translations.min.js (source comment added)
- [x] package.json confirmed correct (wrangler + terser setup)
- [x] robots.txt confirmed correct

## JS Quality and Security Improvements - Status: COMPLETE

### Bundle 03 - Web Frontend JS
- [x] js/projects.js - fetch error handling and AbortController added
- [x] js/projects.js - var replaced with const/let throughout
- [x] js/project-detail.js - fetch error handling improved
- [x] js/project-detail.js - lightbox keyboard trap fixed
- [x] js/nav.js - DOMContentLoaded consolidated (already done)
- [x] js/lang-persist.js - async error handling improved
- [x] js/translations.js - applyTranslations null safety added

### Bundle 05 - Security
- [x] js/projects.js - innerHTML XSS audit complete
- [x] js/project-detail.js - innerHTML XSS audit complete
- [x] js/translations.js - data-i18n-html restricted
- [x] contact form - CSP meta tag added
- [x] All pages - CSP meta tag added

## Multi-Language Implementation Progress

### Prompt 1 of 3 - Core JS Files
- [x] README.md progress tracker created
- [x] js/lang-persist.js created
- [x] js/translations.js created

### Prompt 2 of 3 - HTML Pages and CSS
- [x] Language switcher added to index.html
- [x] Language switcher added to about.html
- [x] Language switcher added to work.html
- [x] Language switcher added to research.html
- [x] Language switcher added to achievements.html
- [x] Language switcher added to contact.html
- [x] data-i18n attributes added to index.html
- [x] data-i18n attributes added to about.html
- [x] data-i18n attributes added to work.html
- [x] data-i18n attributes added to research.html
- [x] data-i18n attributes added to achievements.html
- [x] data-i18n attributes added to contact.html
- [x] Language notice banner added to index.html
- [x] hreflang tags added to all 6 pages
- [x] Language CSS added to css/style.css
- [x] js/nav.js updated to load language on startup

### Prompt 3 of 3 - Sitemap and MD Files
- [x] sitemap.xml updated with hreflang alternates
- [x] index.md updated
- [x] project.md updated
- [x] All projects/slug/index.md files updated
- [x] Final check - no em dashes or en dashes remain

### Status: COMPLETE
All three prompts finished. Branch: claude/brave-maxwell-Xp7Ma. Ready to review and merge into main.

---

## Copilot PR Review - Action Plan (PR #13)

### Comments Read: 23
### Files Reviewed by Copilot: 30

| # | File | Comment Summary | Action | Reason |
|---|------|----------------|--------|--------|
| 1 | js/nav.js:8 | setActiveLangOption runs before buildLangSwitcher populates elements, so active state never applies on first load | IMPLEMENT | Real bug - build switcher before setting active option |
| 2 | js/lang-persist.js:10 | Header comment priority order wrong - code checks URL param first, not FS handle first | IMPLEMENT | Comment contradicts code |
| 3 | js/lang-persist.js:86 | confirm() text misleads about persistence - handle is in-memory only, not cross-session | IMPLEMENT | Replaced confirm() with custom modal and corrected copy |
| 4 | js/lang-persist.js:153 | Comment says IndexedDB is used but code only uses module variable + sessionStorage flag | IMPLEMENT | Implemented actual IndexedDB storage for cross-page persistence |
| 5 | css/style.css:1107 | .lang-chips has no breakpoint gating - shows on desktop alongside the dropdown | IMPLEMENT | Added display:none on desktop, flex only inside mobile media query |
| 6 | index.html:66 | div inside ul is invalid HTML - lang-chips should be an li element | IMPLEMENT | Changed to li in all 6 HTML pages |
| 7 | about.html:46 | Same as above | IMPLEMENT | Same fix |
| 8 | work.html:46 | Same as above | IMPLEMENT | Same fix |
| 9 | research.html:46 | Same as above | IMPLEMENT | Same fix |
| 10 | achievements.html:46 | Same as above | IMPLEMENT | Same fix |
| 11 | contact.html:46 | Same as above | IMPLEMENT | Same fix |
| 12 | index.html:19 | All hreflang alternates point to same URL - use ?lang=XX for distinct URLs | IMPLEMENT | Added ?lang=XX params, en and x-default keep base URL |
| 13 | about.html:17 | Same as above | IMPLEMENT | Same fix |
| 14 | work.html:17 | Same as above | IMPLEMENT | Same fix |
| 15 | research.html:17 | Same as above | IMPLEMENT | Same fix |
| 16 | achievements.html:17 | Same as above | IMPLEMENT | Same fix |
| 17 | contact.html:17 | Same as above | IMPLEMENT | Same fix |
| 18 | sitemap.xml:16 | All xhtml:link alternates point to same URL - use ?lang=XX | IMPLEMENT | Updated sitemap with distinct ?lang=XX hrefs |
| 19 | sitemap.xml:111 | Sitemap only lists project.html without slug URLs - project pages should be indexed | IMPLEMENT | Added all 16 project slug URLs back to sitemap |
| 20 | README.md:8 | README is a progress checklist with branch names that will go stale | SKIP | README serves as implementation log for this dev branch, useful context for reviewers |
| 21 | js/nav.js:116 | Language dropdown does not update aria-expanded - screen readers cannot tell if menu is open | IMPLEMENT | Added aria-expanded toggle to toggleLangDropdown and closeLangDropdown |
| 22 | index.md:19 | Language note misleads markdown readers - switcher only exists on HTML pages | IMPLEMENT | Reworded to clarify HTML site has switcher, markdown mirror is English-only |
| 23 | project.md:65 | Available Languages section implies project.html has a switcher, but it does not | IMPLEMENT | Corrected to state UI is English-only on project detail pages |

## Copilot PR Review - Status: RESOLVED
All actionable comments from the Copilot review of PR #13 have been addressed.
Fixes implemented: 22
Comments skipped: 1 (comment 20 - README rewrite; README serves as implementation log for this branch)
---

## Google Search Console SEO Fix Progress

### Issue 1 - Discovered but not indexed (6 pages)
- [x] achievements.html - indexing fix applied
- [x] contact.html - indexing fix applied
- [x] work.html - indexing fix applied
- [x] project.html?slug=pixel-to-platform-atlas-games - indexing fix applied
- [x] project.html?slug=timmys-revenge - indexing fix applied
- [x] project.html?slug=tiny-cafe - indexing fix applied

### Issue 2 - Crawled but not indexed (5 URLs)
- [x] ?lang= parameter URLs blocked from indexing
- [x] project detail pages (from-the-shadows, system-saviour,
      homogenization-of-game-design) - thin content fix applied

### Issue 3 - Alternative page with proper canonical
- [x] /index.html canonical fixed
- [x] research.html?lang=ar blocked from indexing

### Issue 4 - Soft 404
- [x] project.html (no slug) returns proper 404 page

### Issue 5 - Content improvements
- [x] Meta descriptions reviewed and improved on all pages
- [x] Structured data (JSON-LD) added or improved
- [x] og:image confirmed present and correct on all pages
- [x] sitemap.xml updated with all project pages and soft 404 removed

## Wormhole + Solar System Creative Coding Demos - Status: COMPLETE

### Part A - Move files
- [x] creative-coding/wormhole/ created with scoped CSS and JS
- [x] creative-coding/solar-system/ created with all files
- [x] creative-assets/ folder deleted after move

### Part B - Wormhole demo
- [x] Wormhole embedded as demo frame on creative-coding.html
- [x] Wormhole translation keys added to all 8 languages

### Part C - Solar system
- [x] Solar system standalone page works correctly after move
- [x] Solar system preview card added to creative-coding.html
- [x] Solar system translation keys added to all 8 languages

### Part D - Final
- [x] translations.min.js rebuilt
- [x] All paths verified
- [x] creative-assets/ deleted

## Adding a new project

Run the interactive scaffolder from the repo root:

```
npm run new-project
```

It asks for the title, type, status, summary, tags, links, etc., copies your
cover image / screenshots / PDF into `projects/<slug>/` with clean names,
writes `project.json`, and then regenerates `projects/manifest.json` and
`sitemap.xml` automatically. Press Enter to accept a `[default]`; leave
optional answers blank to skip.

Afterwards: preview locally, then `git add projects/ sitemap.xml`, commit,
and push.

### Supporting scripts

- `npm run generate` - rebuilds `manifest.json` (from the folders in
  `projects/`, preserving display order; new projects append at the end -
  reorder slugs in `manifest.json` by hand if wanted, the order is kept) and
  `sitemap.xml` (static pages + every project with a `viewPage`). Never edit
  those two files for additions/removals - just re-run this.
- `npm run validate` - integrity check: every manifest slug has a folder,
  every referenced image/PDF/viewPage exists, every sitemap URL maps to a
  real file. Runs automatically on GitHub for every push/PR via
  `.github/workflows/validate.yml`, so a broken project can't reach `main`
  unnoticed.

Deleting a project = delete its folder, run `npm run generate`, commit.
