/**
 * lang-persist.js
 * Handles saving and loading the user's language preference.
 *
 * Priority order on load (highest to lowest):
 * 1. URL parameter ?lang=XX  - allows direct per-link override
 * 2. File System API handle  - in-memory only; valid only within the current page session
 * 3. localStorage key 'mdr-lang' - persists across page navigations and browser restarts
 * 4. Default: 'en'
 */

// Block ?lang= parameter URLs from Google indexing
(function blockLangParamIndexing() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lang')) {
        // Add noindex tag dynamically for ?lang= URLs
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, follow';
        document.head.appendChild(meta);

        // Also add canonical pointing to the clean URL (no ?lang= param)
        const cleanUrl = window.location.origin + window.location.pathname;
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = cleanUrl;
        } else {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = cleanUrl;
            document.head.appendChild(canonical);
        }
    }
})();

const VALID_LANGS = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'af', 'ja'];
const LS_KEY = 'mdr-lang';
const FS_DECLINED_KEY = 'mdr-fs-declined';
const FS_HANDLE_KEY = 'mdr-fs-handle';
const FILENAME = 'mdr-language-pref.json';

/**
 * Save language to localStorage and to the file system handle if one exists.
 * @param {string} code - BCP 47 language code
 */
async function saveLang(code) {
    if (!VALID_LANGS.includes(code)) return;

    // Always save to localStorage
    localStorage.setItem(LS_KEY, code);

    // Save to file system if a handle is available in sessionStorage
    const handle = await getStoredHandle();
    if (handle) {
        await writeToHandle(handle, code);
    }
}

/**
 * Load the saved language preference.
 * Checks URL param first, then file system, then localStorage, then defaults to 'en'.
 * @returns {Promise<string>} language code
 */
async function loadLang() {
    // Priority 1 - URL parameter
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && VALID_LANGS.includes(urlParam)) {
        await saveLang(urlParam);
        return urlParam;
    }

    // Priority 2 - File System handle
    const handle = await getStoredHandle();
    if (handle) {
        try {
            const file = await handle.getFile();
            const text = await file.text();
            const data = JSON.parse(text);
            if (data.language && VALID_LANGS.includes(data.language)) {
                return data.language;
            }
        } catch (e) {
            // Handle is stale or file is unreadable - fall through
        }
    }

    // Priority 3 - localStorage
    const stored = localStorage.getItem(LS_KEY);
    if (stored && VALID_LANGS.includes(stored)) {
        return stored;
    }

    // Default
    return 'en';
}

/**
 * Show a one-time prompt asking the user if they want to save their language
 * preference to their local filesystem. Only shown once per browser.
 * @param {string} code - the language code just selected
 */
async function promptFileSystemSave(code) {
    if (!isFileSystemSupported()) return;
    if (hasDeclinedFileSystem()) return;

    const accepted = await showFsModal();

    if (!accepted) {
        localStorage.setItem(FS_DECLINED_KEY, 'true');
        return;
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: FILENAME,
            types: [{
                description: 'JSON file',
                accept: { 'application/json': ['.json'] }
            }]
        });

        await storeHandle(handle);
        await writeToHandle(handle, code);
    } catch (e) {
        // User cancelled the picker - treat as declined
        localStorage.setItem(FS_DECLINED_KEY, 'true');
    }
}

/**
 * Show a custom modal asking whether to save a language file.
 * Non-blocking - returns a Promise<boolean>.
 */
function showFsModal() {
    return new Promise(resolve => {
        let overlay = document.getElementById('fsSaveModal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'fsSaveModal';
            overlay.className = 'fs-modal-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-labelledby', 'fsModalTitle');
            overlay.innerHTML =
                '<div class="fs-modal">' +
                    '<p class="fs-modal-title" id="fsModalTitle">Save language preference?</p>' +
                    '<p class="fs-modal-body">Your preference is already saved to localStorage and will persist across visits. Optionally you can also write it to a JSON file on your device - useful if you clear browser data regularly. The file is written once in this page session only.</p>' +
                    '<div class="fs-modal-btns">' +
                        '<button class="fs-modal-no" id="fsBtnNo">No thanks</button>' +
                        '<button class="fs-modal-save" id="fsBtnSave">Save locally</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(overlay);
        }

        const ac = new AbortController();
        const done = result => {
            ac.abort();
            overlay.classList.remove('open');
            resolve(result);
        };

        document.getElementById('fsBtnNo').onclick = () => done(false);
        document.getElementById('fsBtnSave').onclick = () => done(true);
        overlay.addEventListener('click', e => { if (e.target === overlay) done(false); }, { signal: ac.signal });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') done(false); }, { signal: ac.signal });

        requestAnimationFrame(() => overlay.classList.add('open'));
    });
}

/**
 * Returns true if the user has previously declined the file system save prompt.
 * @returns {boolean}
 */
function hasDeclinedFileSystem() {
    return localStorage.getItem(FS_DECLINED_KEY) === 'true';
}

/**
 * Returns true if the File System Access API is available in this browser.
 * @returns {boolean}
 */
function isFileSystemSupported() {
    return typeof window.showSaveFilePicker === 'function';
}

/**
 * Write the language preference to a FileSystemFileHandle.
 * @param {FileSystemFileHandle} handle
 * @param {string} code
 */
async function writeToHandle(handle, code) {
    try {
        const writable = await handle.createWritable();
        const data = JSON.stringify({
            language: code,
            savedAt: new Date().toISOString(),
            site: 'matthewderekrall.com'
        }, null, 2);
        await writable.write(data);
        await writable.close();
    } catch (e) {
        // Write failed silently - localStorage is the fallback
    }
}

// IndexedDB constants for handle persistence across page navigations
const IDB_DB_NAME = 'mdr-prefs';
const IDB_STORE_NAME = 'handles';
const IDB_HANDLE_KEY = 'lang-file-handle';

function openHandleDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_DB_NAME, 1);
        req.onupgradeneeded = e => { e.target.result.createObjectStore(IDB_STORE_NAME); };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });
}

async function saveHandleToIDB(handle) {
    try {
        const db = await openHandleDB();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
            tx.objectStore(IDB_STORE_NAME).put(handle, IDB_HANDLE_KEY);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });
        db.close();
    } catch (e) { /* IDB unavailable - silent fallback to localStorage */ }
}

async function getHandleFromIDB() {
    try {
        const db = await openHandleDB();
        const handle = await new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE_NAME, 'readonly');
            const req = tx.objectStore(IDB_STORE_NAME).get(IDB_HANDLE_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
        db.close();
        return handle;
    } catch (e) { return null; }
}

/**
 * Store a FileSystemFileHandle in IndexedDB so it persists across page navigations.
 * FileSystemFileHandle objects are structured-cloneable and can be stored in IDB.
 * @param {FileSystemFileHandle} handle
 */
async function storeHandle(handle) {
    await saveHandleToIDB(handle);
}

/**
 * Retrieve the stored FileSystemFileHandle from IndexedDB if available and permitted.
 * @returns {Promise<FileSystemFileHandle|null>}
 */
async function getStoredHandle() {
    const handle = await getHandleFromIDB();
    if (!handle) return null;
    try {
        const perm = await handle.queryPermission({ mode: 'readwrite' });
        return perm === 'granted' ? handle : null;
    } catch (e) {
        return null;
    }
}
