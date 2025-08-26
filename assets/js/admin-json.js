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

// ---------- Editor loader ----------
async function loadEditorFor(path){
    if (!$editorRoot) return;
    // Teardown previous editor
    if (currentEditor && typeof currentEditor.destroy === "function") {
        try { currentEditor.destroy(); } catch {}
    }
    currentEditor = null;
    $editorRoot.innerHTML = `<div class="muted">Loading editor…</div>`;

    const modulePath = EDITOR_MAP[path] || FALLBACK_EDITOR;
    try {
        const mod = await import(modulePath);
        const mountFn = mod.mountEditor || mod.default;
        if (typeof mountFn !== "function") {
            throw new Error(`Editor module ${modulePath} does not export mountEditor/default`);
        }
        currentEditor = await mountFn({
            container: $editorRoot,
            path,
            token: getToken(),
            // optional hooks to integrate global UI in future
            onDirtyChange: (isDirty) => {
                document.body.classList.toggle("editor-dirty", !!isDirty);
            }
        });
    } catch (err) {
        console.error(err);
        $editorRoot.innerHTML = `
      <div class="alert alert--error">
        Failed to load editor for <code>${path}</code>.
      </div>`;
    }
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
