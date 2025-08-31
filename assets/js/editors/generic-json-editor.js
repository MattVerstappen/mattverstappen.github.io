// /assets/js/editors/generic-json-editor.js
export default async function mountEditor({ container, path, token }) {
    container.innerHTML = `
    <div class="editor-panel">
      <div class="editor-header">
        <strong>Generic JSON Editor</strong>
        <div class="sub">Path: <code>${path}</code></div>
      </div>
      <textarea id="raw-json" rows="18" style="width:100%;"></textarea>
      <div class="editor-actions" style="margin-top:.75rem;">
        <button id="save" class="btn btn--primary" disabled>Save</button>
        <span class="muted">${token ? "Token detected (wire save later)" : "No token — read-only demo"}</span>
      </div>
    </div>
  `;

    const $txt = container.querySelector("#raw-json");
    const $save = container.querySelector("#save");

    try {
        const res = await fetch(path, { cache: "no-store" });
        const json = res.ok ? await res.json() : {};
        $txt.value = JSON.stringify(json, null, 2);
    } catch {
        $txt.value = "{}";
    }

    $txt.addEventListener("input", () => {
        try {
            JSON.parse($txt.value);
            $save.disabled = false;
            $txt.style.outline = "none";
        } catch {
            $save.disabled = true;
            $txt.style.outline = "2px solid #b91c1c";
        }
    });

    $save.addEventListener("click", () => {
        // hook up GitHub commit later
        alert("Saved (demo).");
        $save.disabled = true;
    });

    return { destroy(){} };
}
