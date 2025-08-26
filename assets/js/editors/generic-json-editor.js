export default async function mountEditor({ container, path, token, onDirtyChange }){
    container.innerHTML = `
    <div class="editor-panel">
      <div class="editor-header">
        <strong>Generic JSON editor</strong>
        <div class="sub">Path: <code>${path}</code></div>
      </div>
      <div class="editor-body">
        <textarea id="gen-editor" class="editor-textarea" rows="18" spellcheck="false"></textarea>
      </div>
      <div class="editor-actions">
        <button id="gen-save" class="btn btn--primary" disabled>Save</button>
        <span class="muted">${token ? "Token detected (save can be wired later)" : "No token — read-only demo"}</span>
      </div>
    </div>
  `;

    const $ta   = container.querySelector("#gen-editor");
    const $save = container.querySelector("#gen-save");

    // Load JSON
    try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        const data = await res.json();
        $ta.value = JSON.stringify(data, null, 2);
    } catch (e) {
        $ta.value = `/* Load error for ${path}\n${e.message} */`;
    }

    let dirty = false;
    const setDirty = (v) => {
        dirty = !!v;
        $save.disabled = !dirty;
        onDirtyChange?.(dirty);
    };

    $ta.addEventListener("input", () => setDirty(true));

    $save.addEventListener("click", async () => {
        // Wire this to your GitHub commit flow later (re-use cms.js functions)
        try {
            JSON.parse($ta.value); // validate basic JSON
        } catch (e) {
            alert("Invalid JSON: " + e.message);
            return;
        }
        console.log("Would save to", path, "with token:", token ? "[present]" : "[absent]");
        // await commitToGithub(path, $ta.value, token)  <-- integrate later
        setDirty(false);
        alert("Saved (demo).");
    });

    return {
        destroy(){
            // nothing special here; textarea listeners will be GC'd when container clears
        }
    };
}
