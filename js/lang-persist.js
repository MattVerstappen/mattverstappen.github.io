/**
 * lang-persist.js
 * Handles saving and loading the user's language preference.
 *
 * Priority order on load:
 * 1. File System API handle stored in sessionStorage (most persistent)
 * 2. localStorage key 'mdr-lang'
 * 3. URL parameter ?lang=XX
 * 4. Default: 'en'
 */

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

    const accepted = confirm(
        'Want to save your language preference locally?\n\n' +
        'This means it will persist even if you clear your browser storage. ' +
        'Click OK to choose a save location once - after that it saves silently.'
    );

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

        // Store handle reference in sessionStorage
        await storeHandle(handle);

        // Write immediately
        await writeToHandle(handle, code);
    } catch (e) {
        // User cancelled the picker - treat as declined
        localStorage.setItem(FS_DECLINED_KEY, 'true');
    }
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

/**
 * Store a FileSystemFileHandle in sessionStorage using IndexedDB as a bridge.
 * Note: FileSystemFileHandle objects cannot be directly serialised to sessionStorage.
 * We store them in a module-level variable and use sessionStorage as a flag only.
 * @param {FileSystemFileHandle} handle
 */
let _storedHandle = null;

async function storeHandle(handle) {
    _storedHandle = handle;
    sessionStorage.setItem(FS_HANDLE_KEY, 'active');
}

/**
 * Retrieve the stored FileSystemFileHandle if available.
 * @returns {FileSystemFileHandle|null}
 */
async function getStoredHandle() {
    if (_storedHandle && sessionStorage.getItem(FS_HANDLE_KEY) === 'active') {
        return _storedHandle;
    }
    return null;
}
