#!/usr/bin/env node

/**
 * BUILD WEBSITES MANIFEST (safe merge)
 * ====================================
 * - Keeps your existing /assets/data/websites.json as the source of truth
 * - Scans /assets/images/websites for new thumbnails and adds stubs for any not in JSON
 * - Never overwrites your hand-authored fields; only fills missing ones
 * - Writes back the same array schema you use today
 *
 * Usage: npm run build:websites
 *
 * Package.json:
 *   "scripts": {
 *     "build:websites": "node tools/build-websites-manifest.mjs"
 *   }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve paths relative to repo root (this file is in /tools)
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

const IMAGES_DIR  = path.join(PROJECT_ROOT, "assets", "images", "websites");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "assets", "data", "websites.json");

// ---------- helpers ----------
function isImage(file) {
    return /\.(png|jpe?g|webp|svg)$/i.test(file);
}

function slugFromFilename(filePathOrName) {
    const base = path.basename(filePathOrName).replace(/\.(png|jpe?g|webp|svg)$/i, "");
    return base.toLowerCase();
}

function slugToTitle(slug) {
    return slug
        .split(/[-_]+/)
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

// Try to infer a stable slug for an entry (prefer thumbnail filename; fallback to title)
function slugForEntry(entry) {
    if (entry?.thumbnail) {
        return slugFromFilename(entry.thumbnail);
    }
    if (entry?.title) {
        return entry.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
    return "";
}

function loadJSONArrayIfExists(p) {
    try {
        if (fs.existsSync(p)) {
            const raw = fs.readFileSync(p, "utf8");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn(`⚠️  Could not parse JSON at ${p}: ${e.message}`);
    }
    return [];
}

// Shallow-fill missing fields only (do not overwrite)
function fillMissingFields(target, defaults) {
    const out = { ...target };
    for (const [k, v] of Object.entries(defaults)) {
        if (out[k] === undefined || out[k] === null || out[k] === "") {
            out[k] = v;
        }
    }
    return out;
}

// ---------- main ----------
async function build() {
    console.log("🚀 Building websites manifest (safe merge)…");

    // Ensure images dir exists
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
        process.exit(1);
    }

    // Load existing data (source of truth)
    const existing = loadJSONArrayIfExists(OUTPUT_FILE);
    console.log(`📄 Existing entries: ${existing.length}`);

    // Index existing by inferred slug
    const existingBySlug = new Map();
    for (const item of existing) {
        const slug = slugForEntry(item);
        if (slug) existingBySlug.set(slug, item);
    }

    // Scan images folder for new thumbnails
    const files = fs.readdirSync(IMAGES_DIR).filter(isImage);
    console.log(`🖼️  Thumbnails found in ${IMAGES_DIR}: ${files.length}`);

    // For each image, ensure an entry exists
    for (const file of files) {
        const slug = slugFromFilename(file);
        const webPath = `/assets/images/websites/${file}`;

        if (!existingBySlug.has(slug)) {
            // Create a stub entry with sensible defaults
            const stub = {
                title: slugToTitle(slug),
                client: "",
                year: new Date().getFullYear(),
                url: "",
                thumbnail: webPath,
                stack: [],
                tags: [],
                shortDesc: ""
            };
            existingBySlug.set(slug, stub);
            console.log(`➕ Added stub for new image: ${file}`);
        } else {
            // Ensure the thumbnail path is set if missing (but do not overwrite if set)
            const current = existingBySlug.get(slug);
            const merged  = fillMissingFields(current, { thumbnail: webPath });
            existingBySlug.set(slug, merged);
        }
    }

    // Preserve any entries that have no thumbnail on disk (you may be using remote thumbnails)
    const mergedList = Array.from(existingBySlug.values());

    // Sort: year desc, then title asc
    mergedList.sort((a, b) => {
        const byYear = (b.year || 0) - (a.year || 0);
        return byYear !== 0 ? byYear : (a.title || "").localeCompare(b.title || "");
    });

    // Ensure output dir
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Write JSON (same shape as your current file)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mergedList, null, 2), "utf8");

    console.log(`✅ Wrote ${mergedList.length} website(s)`);
    console.log(`📦 ${OUTPUT_FILE}`);
    console.log("🎉 Done.");
}

build().catch(err => {
    console.error("❌ Build failed:", err);
    process.exit(1);
});