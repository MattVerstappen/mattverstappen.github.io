#!/usr/bin/env node
/**
 * validate.js
 * Integrity check for the site's project data. Fails (exit 1) if anything
 * a page depends on is missing or malformed, so broken projects can't
 * silently reach production.
 *
 *   node scripts/validate.js      (or: npm run validate)
 *
 * Checks:
 *  - projects/manifest.json parses and every slug has a folder + project.json
 *  - every projects/<slug>/project.json folder is listed in the manifest
 *  - each project.json parses and has the fields the cards need
 *  - every referenced asset exists (coverImage, coverWebp, photoFiles, file, viewPage)
 *  - every URL in sitemap.xml maps to a real file
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const SITE = 'https://matthewderekrall.com';

const errors = [];
const warnings = [];

function err(msg)  { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const VALID_TYPES = ['game', 'research', 'app', 'web', 'design', 'tool', 'other'];
const VALID_STATUS = ['completed', 'wip'];

/* ── Manifest ── */
let manifest = [];
try {
    manifest = JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, 'manifest.json'), 'utf8'));
    if (!Array.isArray(manifest)) { err('manifest.json is not an array'); manifest = []; }
} catch (e) {
    err('projects/manifest.json missing or invalid JSON: ' + e.message);
}

const dirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(function (d) { return d.isDirectory(); })
    .map(function (d) { return d.name; });

manifest.forEach(function (slug) {
    if (dirs.indexOf(slug) === -1) {
        err('manifest lists "' + slug + '" but projects/' + slug + '/ does not exist');
    }
});
dirs.forEach(function (slug) {
    const hasJson = fs.existsSync(path.join(PROJECTS_DIR, slug, 'project.json'));
    if (hasJson && manifest.indexOf(slug) === -1) {
        err('projects/' + slug + '/ has a project.json but is missing from manifest.json (run: npm run generate)');
    }
});

/* ── Each project.json ── */
manifest.forEach(function (slug) {
    const dir = path.join(PROJECTS_DIR, slug);
    const jsonPath = path.join(dir, 'project.json');
    if (!fs.existsSync(jsonPath)) {
        err(slug + ': project.json missing');
        return;
    }

    let p;
    try {
        p = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
        err(slug + ': project.json invalid JSON - ' + e.message);
        return;
    }

    if (!p.title) err(slug + ': missing "title"');
    if (!p.summary && !p.description) err(slug + ': needs a "summary" or "description"');
    if (!p.type) err(slug + ': missing "type"');
    else if (VALID_TYPES.indexOf(p.type) === -1) warn(slug + ': unknown type "' + p.type + '" (known: ' + VALID_TYPES.join(', ') + ')');
    if (!p.status) err(slug + ': missing "status"');
    else if (VALID_STATUS.indexOf(p.status) === -1) warn(slug + ': unknown status "' + p.status + '" (known: ' + VALID_STATUS.join(', ') + ')');

    ['coverImage', 'coverWebp', 'file'].forEach(function (key) {
        if (p[key] && !fs.existsSync(path.join(dir, p[key]))) {
            err(slug + ': ' + key + ' "' + p[key] + '" does not exist in projects/' + slug + '/');
        }
    });
    (p.photoFiles || []).forEach(function (f) {
        if (!fs.existsSync(path.join(dir, f))) {
            err(slug + ': photoFiles entry "' + f + '" does not exist in projects/' + slug + '/');
        }
    });
    if (p.viewPage && !fs.existsSync(path.join(ROOT, String(p.viewPage).replace(/^\//, '')))) {
        err(slug + ': viewPage "' + p.viewPage + '" does not exist');
    }
    (p.articles || []).forEach(function (a, i) {
        if (!a.title || !a.url) err(slug + ': articles[' + i + '] needs "title" and "url"');
    });
    if (p.links) {
        Object.keys(p.links).forEach(function (k) {
            const v = String(p.links[k]);
            if (/^https?:\/\//.test(v)) return;
            // Relative links are allowed if they point at a real file in the repo
            if (!fs.existsSync(path.join(ROOT, v.replace(/^\//, '')))) {
                err(slug + ': links.' + k + ' "' + v + '" is neither an http(s) URL nor an existing file');
            }
        });
    }
});

/* ── Sitemap ── */
try {
    const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    const locs = (xml.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (m) {
        return m.replace(/<\/?loc>/g, '');
    });
    locs.forEach(function (loc) {
        const rel = loc.replace(SITE, '').replace(/^\//, '');
        if (rel === '') return; // homepage
        if (!fs.existsSync(path.join(ROOT, rel))) {
            err('sitemap.xml lists ' + loc + ' but ' + rel + ' does not exist (run: npm run generate)');
        }
    });
} catch (e) {
    err('sitemap.xml missing or unreadable: ' + e.message);
}

/* ── Report ── */
warnings.forEach(function (w) { console.warn('WARN  ' + w); });
if (errors.length) {
    errors.forEach(function (e) { console.error('ERROR ' + e); });
    console.error('\nValidation failed: ' + errors.length + ' error(s), ' + warnings.length + ' warning(s).');
    process.exit(1);
}
console.log('Validation passed: ' + manifest.length + ' projects OK' +
    (warnings.length ? ' (' + warnings.length + ' warning(s))' : '') + '.');
