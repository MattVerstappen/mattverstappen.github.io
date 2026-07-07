#!/usr/bin/env node
/**
 * new-project.js
 * Interactive scaffolder for adding a project to the portfolio.
 *
 *   node scripts/new-project.js      (or: npm run new-project)
 *
 * Asks a series of questions, then:
 *  1. creates projects/<slug>/
 *  2. copies your cover image / screenshots / PDF into it with clean names
 *  3. writes a valid project.json
 *  4. regenerates manifest.json + sitemap.xml (scripts/generate.js)
 *  5. runs the integrity checks (scripts/validate.js)
 *
 * After it finishes, review with `git status`, preview locally, then
 * commit and push. Press Enter to accept the [default] shown for any
 * question; leave optional answers blank to skip them.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Queue lines as they arrive so answers are never lost between questions.
// (rl.question drops lines that arrive while no question is pending, which
// breaks piped/scripted input; a queue works for both interactive and piped.)
const pendingLines = [];
const waiters = [];
let finished = false;
let inputClosed = false;

rl.on('line', function (line) {
    const w = waiters.shift();
    if (w) w(line); else pendingLines.push(line);
});

// If input ends (Ctrl+C/Ctrl+D or a script piping too few answers) before the
// scaffolder finished, fail loudly instead of exiting 0 half-done.
rl.on('close', function () {
    inputClosed = true;
    if (!finished && waiters.length) {
        console.error('\nInput ended before all questions were answered - aborting.');
        console.error('Any partially created projects/<slug>/ folder should be deleted.');
        process.exit(1);
    }
});

function nextLine() {
    return new Promise(function (resolve) {
        const queued = pendingLines.shift();
        if (queued !== undefined) return resolve(queued);
        if (inputClosed) {
            console.error('\nInput ended before all questions were answered - aborting.');
            process.exit(1);
        }
        waiters.push(resolve);
    });
}

async function ask(question, def) {
    const suffix = def ? ' [' + def + ']' : '';
    process.stdout.write(question + suffix + ': ');
    const answer = await nextLine();
    return answer.trim() || def || '';
}

async function askChoice(question, choices, def) {
    for (;;) {
        const a = (await ask(question + ' (' + choices.join('/') + ')', def)).toLowerCase();
        if (choices.indexOf(a) !== -1) return a;
        console.log('  Please answer one of: ' + choices.join(', '));
    }
}

function toSlug(title) {
    return title.toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function toBaseName(title) {
    // "Kenny's Khaos" -> "KennysKhaos", matching the existing asset naming
    return title.replace(/['’]/g, '').replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ').filter(Boolean)
        .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
        .join('');
}

function splitList(answer) {
    return answer.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

/** Resolve a user-supplied path (handles quotes and ~) and check it exists. */
function resolveInputFile(raw) {
    let p = raw.trim().replace(/^["']|["']$/g, '');
    if (!p) return null;
    if (p.startsWith('~')) p = path.join(require('os').homedir(), p.slice(1));
    p = path.resolve(p);
    if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
        console.log('  !! File not found, skipping: ' + p);
        return null;
    }
    return p;
}

async function main() {
    console.log('\n=== New project scaffolder ===\n');

    /* ── Basics ── */
    let title = '';
    while (!title) title = await ask('Project title');

    let slug = await ask('Slug (folder name)', toSlug(title));
    slug = toSlug(slug);
    const dir = path.join(PROJECTS_DIR, slug);
    if (fs.existsSync(dir)) {
        console.error('\nprojects/' + slug + '/ already exists - pick another slug or edit that project directly.');
        process.exit(1);
    }

    const type = await askChoice('Type', ['game', 'research', 'app', 'web', 'design', 'tool', 'other'], 'game');
    const status = await askChoice('Status', ['completed', 'wip'], 'completed');
    const degree = await ask('Degree/context (e.g. "BCIS in Game Design and Development", "Personal", "Solo")', 'Personal');
    const engine = await ask('Engine/tech badge shown on the cover (e.g. UNITY, UNREAL, HTML Canvas) - optional');
    const genre = await ask('Genre (e.g. Shooter, Puzzle) - optional');
    const event = await ask('Event (e.g. "SA Game Jam 2024") - optional');
    const date = await ask('Date shown on the card (e.g. "October 30, 2023" or "2026")', String(new Date().getFullYear()));

    let summary = '';
    while (!summary) summary = await ask('Summary (1-3 sentences shown on the card)');

    const tags = splitList(await ask('Tags, comma-separated (e.g. 2D, Indie, Unity) - optional'));
    const stack = splitList(await ask('Tech stack, comma-separated (e.g. C#, Unity, Blender) - optional'));
    const awards = splitList(await ask('Awards, comma-separated - optional'));

    /* ── Links ── */
    const links = {};
    for (const key of ['github', 'itch', 'video', 'doi', 'live']) {
        const url = await ask('Link - ' + key + ' URL - optional');
        if (url) links[key] = url;
    }
    const itchId = await ask('itch.io embed ID (numbers from the itch embed code) - optional');

    /* ── Files: copied into the project folder with clean names ── */
    const base = toBaseName(title);
    fs.mkdirSync(dir, { recursive: true });
    console.log('\nCreated projects/' + slug + '/');
    console.log('For the next answers paste full paths to files anywhere on disk');
    console.log('(e.g. C:\\Users\\you\\Pictures\\cover.png) - they will be copied in and renamed.\n');

    let coverImage = null;
    const coverSrc = resolveInputFile(await ask('Cover image path - optional'));
    if (coverSrc) {
        coverImage = base + 'Cover' + path.extname(coverSrc).toLowerCase();
        fs.copyFileSync(coverSrc, path.join(dir, coverImage));
        console.log('  -> ' + coverImage);
    }

    const photoFiles = [];
    const shotsRaw = await ask('Screenshot paths, comma-separated - optional');
    let n = 1;
    for (const raw of splitList(shotsRaw)) {
        const src = resolveInputFile(raw);
        if (!src) continue;
        const name = base + n + path.extname(src).toLowerCase();
        fs.copyFileSync(src, path.join(dir, name));
        console.log('  -> ' + name);
        photoFiles.push(name);
        n++;
    }

    let file = null;
    const pdfSrc = resolveInputFile(await ask('Document/PDF path (research papers etc.) - optional'));
    if (pdfSrc) {
        file = path.basename(pdfSrc).replace(/[^a-zA-Z0-9\-_. ]/g, '');
        fs.copyFileSync(pdfSrc, path.join(dir, file));
        console.log('  -> ' + file);
    }

    /* ── Assemble project.json (same field order as the existing files) ── */
    const p = { title: title, degree: degree, type: type };
    if (engine) p.engine = engine;
    p.status = status;
    if (event) p.event = event;
    if (awards.length) p.awards = awards;
    p.date = date;
    if (genre) p.genre = genre;
    p.photos = photoFiles.length;
    if (coverImage) p.coverImage = coverImage;
    if (photoFiles.length) p.photoFiles = photoFiles;
    if (itchId) p.itchId = itchId;
    p.summary = summary;
    if (tags.length) p.tags = tags;
    if (stack.length) p.stack = stack;
    if (Object.keys(links).length) p.links = links;
    if (file) p.file = file;

    fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify(p, null, 2) + '\n');
    console.log('\nWrote projects/' + slug + '/project.json');

    finished = true;
    rl.close();

    /* ── Regenerate manifest + sitemap, then validate ── */
    console.log('');
    execFileSync(process.execPath, [path.join(__dirname, 'generate.js')], { stdio: 'inherit' });
    console.log('');
    execFileSync(process.execPath, [path.join(__dirname, 'validate.js')], { stdio: 'inherit' });

    console.log('\nDone! Next steps:');
    console.log('  1. Preview locally (e.g. python -m http.server 8123) and check work.html');
    console.log('  2. git add projects/ sitemap.xml && git commit');
    console.log('  3. git push');
    console.log('\nTip: WebP cover variants are optional - if you add one later, set');
    console.log('"coverWebp" in project.json and re-run: npm run validate');
}

main().catch(function (e) {
    console.error(e);
    process.exit(1);
});
