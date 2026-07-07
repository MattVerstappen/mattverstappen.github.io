#!/usr/bin/env node
/**
 * project-manager.js
 * Local desktop-style app for creating and editing portfolio projects
 * without touching the terminal or any JSON by hand.
 *
 * Start it by double-clicking "Project Manager.cmd" in the repo root
 * (or: npm run manager). It starts a local-only server, opens the UI in
 * your browser, and writes straight into the repo working copy. Every
 * save regenerates manifest.json + sitemap.xml and runs the validator.
 *
 * This server binds to 127.0.0.1 only and is a dev tool - it is never
 * part of the deployed site.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync, exec } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const PORT = 5177;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.pdf': 'application/pdf',
    '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
    '.jfif': 'image/jpeg', '.webmanifest': 'application/manifest+json',
};

/* ── helpers ── */

function send(res, status, body, type) {
    res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8' });
    res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
    return new Promise(function (resolve, reject) {
        const chunks = [];
        let size = 0;
        req.on('data', function (c) {
            size += c.length;
            if (size > 200 * 1024 * 1024) { reject(new Error('Body too large')); req.destroy(); return; }
            chunks.push(c);
        });
        req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
        req.on('error', reject);
    });
}

function safeSlug(raw) {
    return String(raw || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
}

function toBaseName(title) {
    return String(title).replace(/['’]/g, '').replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ').filter(Boolean)
        .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
        .join('');
}

function sanitizeFilename(name) {
    return String(name).replace(/[^a-zA-Z0-9\-_. ]/g, '');
}

function extOf(name) {
    const e = path.extname(String(name)).toLowerCase();
    return /^\.(png|jpe?g|webp|gif|jfif)$/.test(e) ? e : '.png';
}

function readManifest() {
    try { return JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, 'manifest.json'), 'utf8')); }
    catch (e) { return []; }
}

function readProject(slug) {
    return JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, slug, 'project.json'), 'utf8'));
}

/** Rebuild project.json in the canonical field order used across the repo. */
function orderedProject(p) {
    const out = {};
    ['title', 'degree', 'type', 'engine', 'status', 'event', 'awards', 'date',
     'genre', 'photos', 'coverImage', 'coverWebp', 'photoFiles', 'itchId',
     'summary', 'description', 'tags', 'stack', 'links', 'file', 'viewPage',
     'articles'].forEach(function (k) {
        const v = p[k];
        if (v === undefined || v === null || v === '') return;
        if (Array.isArray(v) && v.length === 0) return;
        if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return;
        out[k] = v;
    });
    // photos is a count and may legitimately be 0
    out.photos = (p.photoFiles || []).length;
    return out;
}

function runPipeline() {
    let output = '';
    let ok = true;
    try {
        output += execFileSync(process.execPath, [path.join(__dirname, 'generate.js')], { encoding: 'utf8' });
    } catch (e) {
        ok = false;
        output += (e.stdout || '') + (e.stderr || '') + e.message;
    }
    try {
        output += execFileSync(process.execPath, [path.join(__dirname, 'validate.js')], { encoding: 'utf8' });
    } catch (e) {
        ok = false;
        output += (e.stdout || '') + (e.stderr || '');
    }
    return { ok: ok, output: output.trim() };
}

/* ── API handlers ── */

function apiListProjects(res) {
    const manifest = readManifest();
    const list = manifest.map(function (slug) {
        try { return Object.assign({ slug: slug }, readProject(slug)); }
        catch (e) { return { slug: slug, title: slug, _error: e.message }; }
    });
    send(res, 200, list);
}

function apiSave(res, body) {
    const isNew = !!body.isNew;
    const slug = safeSlug(body.slug);
    if (!slug) return send(res, 400, { error: 'Invalid slug. Use lowercase letters, numbers and hyphens.' });
    const dir = path.join(PROJECTS_DIR, slug);

    if (isNew && fs.existsSync(dir)) {
        return send(res, 400, { error: 'projects/' + slug + '/ already exists. Pick a different slug or edit the existing project.' });
    }
    if (!isNew && !fs.existsSync(path.join(dir, 'project.json'))) {
        return send(res, 404, { error: 'Project "' + slug + '" not found.' });
    }

    const p = body.project || {};
    if (!p.title) return send(res, 400, { error: 'Title is required.' });
    if (!p.summary && !p.description) return send(res, 400, { error: 'A summary is required.' });

    const existing = isNew ? {} : readProject(slug);
    const base = toBaseName(p.title);
    if (isNew) fs.mkdirSync(dir, { recursive: true });

    const uploads = body.uploads || {};

    /* cover */
    let coverImage = existing.coverImage;
    let coverWebp = existing.coverWebp;
    if (body.removeCover) { coverImage = undefined; coverWebp = undefined; }
    if (uploads.cover && uploads.cover.data) {
        coverImage = base + 'Cover' + extOf(uploads.cover.name);
        fs.writeFileSync(path.join(dir, coverImage), Buffer.from(uploads.cover.data, 'base64'));
        coverWebp = undefined; // old webp variant no longer matches the new cover
    }

    /* screenshots: keep existing minus removed, append new with next numbers */
    const removed = body.removePhotos || [];
    let photoFiles = (existing.photoFiles || []).filter(function (f) { return removed.indexOf(f) === -1; });
    removed.forEach(function (f) {
        const fp = path.join(dir, sanitizeFilename(f));
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
    let maxN = 0;
    (existing.photoFiles || []).forEach(function (f) {
        const m = String(f).match(/(\d+)\.[a-z]+$/i);
        if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
    });
    (uploads.photos || []).forEach(function (up) {
        if (!up || !up.data) return;
        maxN++;
        const name = base + maxN + extOf(up.name);
        fs.writeFileSync(path.join(dir, name), Buffer.from(up.data, 'base64'));
        photoFiles.push(name);
    });

    /* document / pdf */
    let file = existing.file;
    if (body.removePdf) file = undefined;
    if (uploads.pdf && uploads.pdf.data) {
        file = sanitizeFilename(uploads.pdf.name) || (base + '.pdf');
        fs.writeFileSync(path.join(dir, file), Buffer.from(uploads.pdf.data, 'base64'));
    }

    const merged = orderedProject({
        title: p.title,
        degree: p.degree,
        type: p.type,
        engine: p.engine,
        status: p.status,
        event: p.event,
        awards: p.awards,
        date: p.date,
        genre: p.genre,
        coverImage: coverImage,
        coverWebp: coverWebp,
        photoFiles: photoFiles,
        itchId: p.itchId,
        summary: p.summary,
        description: p.description,
        tags: p.tags,
        stack: p.stack,
        links: p.links,
        file: file,
        viewPage: existing.viewPage,
        articles: p.articles,
    });

    fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify(merged, null, 2) + '\n');

    const pipeline = runPipeline();
    send(res, 200, { ok: pipeline.ok, slug: slug, pipeline: pipeline.output });
}

function apiDelete(res, slug) {
    slug = safeSlug(slug);
    const dir = path.join(PROJECTS_DIR, slug);
    if (!slug || !fs.existsSync(path.join(dir, 'project.json'))) {
        return send(res, 404, { error: 'Project not found.' });
    }
    fs.rmSync(dir, { recursive: true, force: true });
    const pipeline = runPipeline();
    send(res, 200, { ok: pipeline.ok, pipeline: pipeline.output });
}

/* ── static file serving (repo root, traversal-safe) ── */

function serveStatic(res, urlPath) {
    let rel = decodeURIComponent(urlPath.split('?')[0]);
    if (rel === '/') rel = '/index.html';
    const full = path.normalize(path.join(ROOT, rel));
    if (full.indexOf(ROOT) !== 0) return send(res, 403, { error: 'Forbidden' });
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
        return send(res, 404, 'Not found', 'text/plain');
    }
    const type = MIME[path.extname(full).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(full).pipe(res);
}

/* ── server ── */

const server = http.createServer(async function (req, res) {
    try {
        const url = req.url || '/';

        if (url === '/manager' || url === '/manager/') {
            const ui = fs.readFileSync(path.join(__dirname, 'project-manager-ui.html'));
            return send(res, 200, ui, 'text/html; charset=utf-8');
        }
        if (url === '/api/projects' && req.method === 'GET') {
            return apiListProjects(res);
        }
        if (url === '/api/save' && req.method === 'POST') {
            const body = JSON.parse(await readBody(req));
            return apiSave(res, body);
        }
        if (url.indexOf('/api/project/') === 0 && req.method === 'DELETE') {
            return apiDelete(res, url.slice('/api/project/'.length));
        }
        return serveStatic(res, url);
    } catch (e) {
        send(res, 500, { error: e.message });
    }
});

server.listen(PORT, '127.0.0.1', function () {
    const url = 'http://localhost:' + PORT + '/manager';
    console.log('');
    console.log('  Project Manager running: ' + url);
    console.log('  (the site itself is previewable at http://localhost:' + PORT + '/)');
    console.log('  Press Ctrl+C in this window to stop.');
    console.log('');
    // Open the browser automatically (Windows / macOS / Linux)
    const cmd = process.platform === 'win32' ? 'start "" "' + url + '"'
        : process.platform === 'darwin' ? 'open "' + url + '"'
        : 'xdg-open "' + url + '"';
    exec(cmd, function () { /* best-effort */ });
});
