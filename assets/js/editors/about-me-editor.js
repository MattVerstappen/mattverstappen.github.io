export async function mountEditor({ container, path, token, onDirtyChange }){
    container.innerHTML = `
    <div class="editor-panel">
      <div class="editor-header">
        <strong>About Me</strong>
        <div class="sub">Path: <code>${path}</code></div>
      </div>

      <form id="about-form" class="form-grid">
        <label>
          <span>Full Name</span>
          <input type="text" id="fullName" />
        </label>

        <label>
          <span>Email</span>
          <input type="email" id="email" />
        </label>

        <label>
          <span>Phone</span>
          <input type="text" id="phone" />
        </label>

        <label>
          <span>Location</span>
          <input type="text" id="location" />
        </label>

        <label>
          <span>Role</span>
          <input type="text" id="role" />
        </label>

        <label>
          <span>Profile Photo URL</span>
          <input type="url" id="profilePhoto" />
        </label>

        <label>
          <span>CV File URL</span>
          <input type="url" id="cvFile" />
        </label>

        <label class="col-span">
          <span>Skills (comma-separated)</span>
          <input type="text" id="skills" placeholder="Concept Art, Blender, Photoshop"/>
        </label>

        <label class="col-span">
          <span>About (one paragraph per line)</span>
          <textarea id="about" rows="6"></textarea>
        </label>
      </form>

      <div class="editor-actions">
        <button id="save" class="btn btn--primary" disabled>Save</button>
        <span class="muted">${token ? "Token detected (wire to GitHub later)" : "No token — read-only demo"}</span>
      </div>
    </div>
  `;

    const $ = (id) => container.querySelector("#" + id);
    const $save = $("#save");

    // Load
    let model = {};
    try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error();
        model = await res.json();
    } catch {
        model = {};
    }

    $("#fullName").value    = model.fullName || "";
    $("#email").value       = model.email || "";
    $("#phone").value       = model.phone || "";
    $("#location").value    = model.location || "";
    $("#role").value        = model.role || "";
    $("#profilePhoto").value= model.profilePhoto || "";
    $("#cvFile").value      = model.cvFile || "";
    $("#skills").value      = Array.isArray(model.skills) ? model.skills.join(", ") : "";
    $("#about").value       = Array.isArray(model.about) ? model.about.join("\n\n") : "";

    let dirty = false;
    const markDirty = () => {
        if (!dirty) {
            dirty = true;
            $save.disabled = false;
            onDirtyChange?.(true);
        }
    };

    container.querySelectorAll("input,textarea").forEach(el => {
        el.addEventListener("input", markDirty);
    });

    $save.addEventListener("click", async () => {
        const updated = {
            fullName: $("#fullName").value.trim(),
            email: $("#email").value.trim(),
            phone: $("#phone").value.trim(),
            location: $("#location").value.trim(),
            role: $("#role").value.trim(),
            profilePhoto: $("#profilePhoto").value.trim(),
            cvFile: $("#cvFile").value.trim(),
            skills: $("#skills").value.split(",").map(s => s.trim()).filter(Boolean),
            about: $("#about").value.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
        };

        const jsonText = JSON.stringify(updated, null, 2);
        console.log("Would save to", path, "len", jsonText.length, "token:", token ? "[present]" : "[absent]");
        // await commitToGithub(path, jsonText, token)  // integrate later

        dirty = false;
        $save.disabled = true;
        onDirtyChange?.(false);
        alert("Saved (demo).");
    });

    return {
        destroy(){
            // if you attached global listeners, remove them here
        }
    };
}
