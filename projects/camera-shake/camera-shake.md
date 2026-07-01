# Trauma-Based Camera Shake
Type: tool | Degree: Solo | Date: 2026 | Status: completed
Stack: C#, Unity

A GDC-recommended camera shake implementation for Unity using the trauma model. The system maintains a trauma value from 0 to 1 and samples Perlin noise for each enabled axis using unique seed offsets to prevent correlated movement. Shake magnitude is trauma squared, producing a natural falloff that feels physically grounded. Multiple trauma events stack additively. Includes a ShakePreset ScriptableObject for saving and reusing shake configurations, four built-in presets covering light, medium, heavy, and explosion scenarios, and a live trauma bar in the Inspector that updates in real time during play mode.
