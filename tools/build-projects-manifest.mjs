#!/usr/bin/env node
/**
 * BUILD PROJECTS MANIFEST (recursive, category-aware)
 * ---------------------------------------------------
 * Scans /projects-collection and ALL subfolders for .html project pages.
 * Creates /assets/data/projects.json with:
 *   { title, description, href, thumbnail, slug, category }
 *
 * Optionally enriches items from per-category JSON files in /assets/data:
 *   - individual-assets-projects.json
 *   - individual-game-projects.json
 *   - individual-model-projects.json
 *   - individual-papers-projects.json
 *
 * USAGE: npm run build:projects
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");
const PROJECTS_DIR = path.join(PROJECT_ROOT, "projects-collection");

const THUMBNAILS_DIR = path.join(
    PROJECT_ROOT,
    "assets",
    "images",
    "project-images",
    "project-thumbnail-images"
);

const OUTPUT_FILE = path.join(PROJECT_ROOT, "assets", "data", "projects.json");
const DATA_DIR = path.join(PROJECT_ROOT, "assets", "data");

const FALLBACK_THUMBNAIL =
    "/assets/images/project-images/project-thumbnail-images/example-project1-thumbnail.png";

// Map subfolder -> optional JSON file to enrich metadata
const CATEGORY_JSON_MAP = {
    "individual-assets": "individual-assets-projects.json",
    "individual-game": "individual-game-projects.json",
    "individual-model": "individual-model-projects.json",
    "individual-papers": "individual-papers-projects.json",
};

// ----------------------------------------------------
// Helpers
function slugToTitle(slug) {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

function extractTitle(html, fallbackSlug) {
    const m = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return (m && m[1] && m[1].trim()) || slugToTitle(fallbackSlug);
}

function extractDescription(html) {
    const m = html.match(
        /<meta\s+name=["']description["']\s+content=["'](.*?)["'][^>]*>/i
    );
    return (m && m[1] && m[1].trim()) || "Project details and images.";
}

function findThumbnail(slug) {
    const exts = ["png", "jpg", "jpeg", "webp", "svg"];
    try {
        const files = fs.readdirSync(THUMBNAILS_DIR);
        for (const ext of exts) {
            const expected = `${slug}-thumbnail.${ext}`;
            if (files.includes(expected)) {
                return `/assets/images/project-images/project-thumbnail-images/${expected}`;
            }
        }
        console.log(`⚠️  No thumbnail for "${slug}", using fallback`);
        return FALLBACK_THUMBNAIL;
    } catch {
        console.log(`⚠️  Thumbnails dir not readable; using fallback for "${slug}"`);
        return FALLBACK_THUMBNAIL;
    }
}

/**
 * Recursively collect .html files under baseDir.
 * Returns an array of relative paths (from PROJECTS_DIR) using forward slashes.
 */
function collectHtmlFilesRecursively(baseDir) {
    const results = [];

    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const ent of entries) {
            if (ent.name.startsWith(".")) continue; // ignore hidden
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) {
                walk(full);
            } else if (ent.isFile() && ent.name.endsWith(".html")) {
                const rel = path.relative(PROJECTS_DIR, full).replace(/\\/g, "/");
                results.push(rel);
            }
        }
    }

    walk(baseDir);
    return results;
}

/**
 * Attempt to load a per-category JSON array and find an item by slug.
 * Returns null if not found or file missing.
 */
function lookupCategoryMeta(category, slug) {
    const jsonFile = CATEGORY_JSON_MAP[category];
    if (!jsonFile) return null;

    const filePath = path.join(DATA_DIR, jsonFile);
    try {
        const raw = fs.readFileSync(filePath, "utf8");
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return null;

        // Find by slug
        const item = arr.find((x) => x.slug === slug);
        return item || null;
    } catch {
        // File might not exist yet—totally fine
        return null;
    }
}

// ----------------------------------------------------
// Main
async function buildProjectsManifest() {
    console.log("🚀 Building projects manifest (recursive)…");

    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error(`❌ Projects directory not found: ${PROJECTS_DIR}`);
        process.exit(1);
    }

    // 1) Gather all .html entries recursively
    const htmlRelPaths = collectHtmlFilesRecursively(PROJECTS_DIR);
    console.log(`📁 Found ${htmlRelPaths.length} HTML files under projects-collection/`);

    const projects = [];

    for (const relPath of htmlRelPaths) {
        // relPath like: "individual-game/my-game.html" or "some-root.html"
        const category = relPath.includes("/") ? relPath.split("/")[0] : "root";
        const fileName = path.basename(relPath);       // my-game.html
        const slug = fileName.replace(/\.html$/i, ""); // my-game

        try {
            const fullPath = path.join(PROJECTS_DIR, relPath);
            const html = fs.readFileSync(fullPath, "utf8");

            // Base values from HTML
            let title = extractTitle(html, slug);
            let description = extractDescription(html);
            let thumbnail = findThumbnail(slug);

            // Optional enrichment from per-category JSON
            const meta = lookupCategoryMeta(category, slug);
            if (meta) {
                // Prefer JSON values if present
                if (meta.title) title = meta.title;
                if (meta.shortDesc || meta.description) {
                    description = meta.shortDesc || meta.description;
                }
                if (meta.thumbnail) thumbnail = meta.thumbnail;
            }

            const href = `/projects-collection/${relPath}`; // keep relative path intact

            projects.push({
                title,
                description,
                href,
                thumbnail,
                slug,
                category,
            });

            console.log(`✅ Added: "${title}" [${category}]`);
        } catch (err) {
            console.error(`❌ Error processing ${relPath}: ${err.message}`);
            // continue
        }
    }

    // 2) Sort by title for stable ordering
    projects.sort((a, b) => a.title.localeCompare(b.title));

    // 3) Ensure output dir exists
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
        console.log(`📁 Created directory: ${outDir}`);
    }

    // 4) Write manifest
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2), "utf8");

    console.log(`\n✅ Generated manifest with ${projects.length} projects`);
    console.log(`📄 Output: ${OUTPUT_FILE}`);
    console.log("🎉 Build complete!");
}

// Run
buildProjectsManifest();
