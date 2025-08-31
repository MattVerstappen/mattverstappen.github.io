// ===== Admin JSON Page — multi-editor host =====

// Web paths for your JSON files (not Windows paths)
const JSON_FILES = [
    { label: "About Me",              path: "/assets/data/about-me.json" },
    { label: "Brand",                 path: "/assets/data/brand.json" },
    { label: "Footer",                path: "/assets/data/footer.json" },
    { label: "Global Tokens",         path: "/assets/data/global-tokens.json" },
    { label: "Assets (Individual)",   path: "/assets/data/individual-assets-projects.json" },
    { label: "Games (Individual)",    path: "/assets/data/individual-game-projects.json" },
    { label: "Models (Individual)",   path: "/assets/data/individual-model-projects.json" },
    { label: "Papers (Individual)",   path: "/assets/data/individual-papers-projects.json" },
    { label: "Projects",              path: "/assets/data/projects.json" },
    { label: "Websites",              path: "/assets/data/websites.json" }
];

// Map each JSON file to its editor module (ES module paths)
const EDITOR_MAP = {
    "/assets/data/about-me.json":                "/assets/js/editors/about-me-editor.js",
    "/assets/data/global-tokens.json":           "/assets/js/editors/global-tokens-editor.js",
    "/assets/data/brand.json":                   "/assets/js/editors/brand-editor.js",
    "/assets/data/footer.json":                  "/assets/js/editors/footer-editor.js",
    "/assets/data/projects.json":                "/assets/js/editors/projects-editor.js",
    "/assets/data/individual-assets-projects.json": "/assets/js/editors/individual-assets-editor.js",
    "/assets/data/individual-game-projects.json":   "/assets/js/editors/individual-game-editor.js",
    "/assets/data/individual-model-projects.json":  "/assets/js/editors/individual-model-editor.js",
    "/assets/data/individual-papers-projects.json": "/assets/js/editors/individual-papers-editor.js",
    "/assets/data/websites.json":                "/assets/js/editors/websites-editor.js"
};

// Fallback editor if there isn't a specific one:
const FALLBACK_EDITOR = "/assets/js/editors/generic-json-editor.js";

// Same token key as cms.js
const TOKEN_KEY   = "cms:githubToken";
const SELECTED_KEY = "admin:selected-json";

const $list       = document.getElementById("json-list");
const $selPath    = document.getElementById("selection-path");
const $openLink   = document.getElementById("open-link");
const $editorRoot = document.getElementById("editor-root");

// Optional token UI
const $tokenInput = document.getElementById("gh-token");
const $saveBtn    = document.getElementById("save-token");
const $clearBtn   = document.getElementById("clear-token");
const $authState  = document.getElementById("auth-state");

let currentEditor = null; // { destroy?: Function } implemented by editor module

// ---------- Auth ----------
function getToken(){ return localStorage.getItem(TOKEN_KEY) || ""; }
function setToken(token){
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        window.dispatchEvent(new CustomEvent("cms:token-change", { detail: { hasToken: true } }));
    }
    refreshAuthUI();
}
function clearToken(){
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new CustomEvent("cms:token-change", { detail: { hasToken: false } }));
    refreshAuthUI();
}
function refreshAuthUI(){
    const has = !!getToken();
    document.body.classList.toggle("is-authed", has);
    const txt = $authState?.querySelector(".txt");
    if (txt) txt.textContent = has ? "Signed in" : "Signed out";
    if ($tokenInput) $tokenInput.value = "";
}

// ---------- List ----------
function renderButtons(activePath){
    if (!$list) return;
    $list.innerHTML = "";

    JSON_FILES.forEach(({ label, path }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "json-btn";
        btn.setAttribute("data-path", path);
        btn.setAttribute("aria-pressed", activePath === path ? "true" : "false");
        if (activePath === path) btn.classList.add("is-active");

        btn.innerHTML = `
      <span class="dot" aria-hidden="true"></span>
      <span class="meta">
        <span class="label">${label}</span>
        <span class="path">${path}</span>
      </span>
    `;
        btn.addEventListener("click", () => setActive(path));
        $list.appendChild(btn);
    });

    updateFooter(activePath);
}

function setActive(path){
    document.querySelectorAll(".json-btn").forEach(b => {
        const isThis = b.getAttribute("data-path") === path;
        b.classList.toggle("is-active", isThis);
        b.setAttribute("aria-pressed", isThis ? "true" : "false");
    });
    localStorage.setItem(SELECTED_KEY, path);
    updateFooter(path);
    loadEditorFor(path); // <— load editor into #editor-root
}

function updateFooter(path){
    if (!$selPath || !$openLink) return;
    if (path) {
        $selPath.textContent = path;
        $openLink.href = path;
        $openLink.style.display = "";
    } else {
        $selPath.textContent = "No file selected.";
        $openLink.style.display = "none";
    }
}

// ---------- Editor loader (robust) ----------
async function loadEditorFor(path){
    if (!$editorRoot) return;

    // Teardown previous editor
    if (currentEditor && typeof currentEditor.destroy === "function") {
        try { currentEditor.destroy(); } catch {}
    }
    currentEditor = null;
    $editorRoot.innerHTML = `<div class="muted">Loading editor…</div>`;

    const baseModulePath = EDITOR_MAP[path] || FALLBACK_EDITOR;
    // cache-bust so you don’t fight stale modules in dev
    const modulePath = `${baseModulePath}?v=${Date.now()}`;

    // Optional preflight check to catch 404/HTML errors early
    try {
        const headRes = await fetch(modulePath, { method: "GET", cache: "no-store" });
        if (!headRes.ok) {
            throw new Error(`HTTP ${headRes.status} for ${baseModulePath}`);
        }
        const ctype = headRes.headers.get("Content-Type") || "";
        if (!ctype.includes("javascript") && !ctype.includes("text/")) {
            // Many static hosts still serve "text/javascript"; allow that.
            // If we got HTML (404 page), warn explicitly:
            if (ctype.includes("html")) {
                throw new Error(`Got HTML instead of JS (likely 404): ${baseModulePath}`);
            }
        }
    } catch (preErr) {
        console.error("Preflight failed:", preErr);
        return showEditorError(path, baseModulePath, preErr);
    }

    try {
        const mod = await import(modulePath);
        const mountFn = mod.mountEditor || mod.default;
        if (typeof mountFn !== "function") {
            throw new Error(`Module does not export mountEditor/default: ${baseModulePath}`);
        }
        currentEditor = await mountFn({
            container: $editorRoot,
            path,
            token: getToken(),
            onDirtyChange: (isDirty) => {
                document.body.classList.toggle("editor-dirty", !!isDirty);
            }
        });
    } catch (err) {
        console.error("Editor import failed:", err);
        // Try generic fallback once if this wasn't already the fallback
        if (baseModulePath !== FALLBACK_EDITOR) {
            try {
                const fallbackPath = `${FALLBACK_EDITOR}?v=${Date.now()}`;
                const fmod = await import(fallbackPath);
                const fmount = fmod.mountEditor || fmod.default;
                if (typeof fmount !== "function") {
                    throw new Error("Fallback generic editor missing mount function.");
                }
                currentEditor = await fmount({
                    container: $editorRoot,
                    path,
                    token: getToken(),
                    onDirtyChange: (isDirty) => {
                        document.body.classList.toggle("editor-dirty", !!isDirty);
                    }
                });
                // Also surface a non-blocking notice about the original failure:
                const warn = document.createElement("div");
                warn.className = "alert alert--warning";
                warn.style.marginTop = "12px";
                warn.innerHTML = `Loaded <strong>generic</strong> editor. Couldn’t load <code>${baseModulePath}</code>.<br><small>${err.message}</small>`;
                $editorRoot.appendChild(warn);
                return;
            } catch (ferr) {
                console.error("Fallback editor failed:", ferr);
                return showEditorError(path, baseModulePath, err);
            }
        }
        return showEditorError(path, baseModulePath, err);
    }
}

function showEditorError(path, modulePathTried, err){
    $editorRoot.innerHTML = `
    <div class="alert alert--error">
      <div><strong>Failed to load editor for</strong> <code>${path}</code></div>
      <div style="margin-top:.4rem"><code>${modulePathTried}</code></div>
      <pre style="white-space:pre-wrap;margin-top:.5rem">${(err && err.message) ? err.message : err}</pre>
      <ul style="margin-top:.5rem;padding-left:1.2rem">
        <li>Verify the file exists at that path (case-sensitive).</li>
        <li>Open DevTools → Network and confirm it returns <code>200</code> and JS content-type.</li>
        <li>Serve over <code>http://</code> or <code>https://</code> (not <code>file://</code>).</li>
      </ul>
    </div>
  `;
}


// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
    refreshAuthUI();

    // Token actions
    $saveBtn?.addEventListener("click", () => {
        const v = ($tokenInput?.value || "").trim();
        if (!v) return;
        setToken(v);
    });
    $clearBtn?.addEventListener("click", clearToken);

    const last = localStorage.getItem(SELECTED_KEY) || "";
    renderButtons(last);
    if (last) loadEditorFor(last);
});

window.addEventListener("cms:token-change", (e) => {
    const has = e?.detail?.hasToken ?? !!getToken();
    document.body.classList.toggle("is-authed", has);
    const txt = $authState?.querySelector(".txt");
    if (txt) txt.textContent = has ? "Signed in" : "Signed out";
});
