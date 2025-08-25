// ===== Admin JSON Page (token-aware, highlight-only for now) =====

// Keep this list in sync with your actual JSON files (web paths, not Windows paths):
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

// Use the SAME key that cms.js uses so auth is shared.
const TOKEN_KEY = "cms:githubToken";

// Remember last selection locally
const SELECTED_KEY = "admin:selected-json";

const $list     = document.getElementById("json-list");
const $selPath  = document.getElementById("selection-path");
const $openLink = document.getElementById("open-link");

const $tokenInput = document.getElementById("gh-token");
const $saveBtn    = document.getElementById("save-token");
const $clearBtn   = document.getElementById("clear-token");
const $authState  = document.getElementById("auth-state");

// ---------- Auth helpers ----------
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

// ---------- List rendering ----------
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

    // Hook for future editor:
    // if (getToken()) openJsonEditor(path);
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

// ---------- Event wiring ----------
document.addEventListener("DOMContentLoaded", () => {
    refreshAuthUI();

    $saveBtn?.addEventListener("click", () => {
        const v = ($tokenInput?.value || "").trim();
        if (!v) return;
        setToken(v);
    });
    $clearBtn?.addEventListener("click", clearToken);

    const last = localStorage.getItem(SELECTED_KEY) || "";
    renderButtons(last);
});

window.addEventListener("cms:token-change", (e) => {
    const has = e?.detail?.hasToken ?? !!getToken();
    document.body.classList.toggle("is-authed", has);
    const txt = $authState?.querySelector(".txt");
    if (txt) txt.textContent = has ? "Signed in" : "Signed out";
});

// function openJsonEditor(path) { /* integrate later */ }
