# Off-Screen Indicator
Type: tool | Degree: Solo | Date: 2026 | Status: completed
Stack: C#, Unity

A plug-and-play off-screen target indicator system for Unity's uGUI canvas. When registered targets move outside the camera frustum, an arrow indicator appears at the screen edge pointing toward the target's world position. Edge clamping uses viewport-to-screen projection with configurable padding, and indicators rotate correctly using Atan2 against the screen centre with a 90-degree offset to match upward-pointing arrow art. Behind-camera targets are handled by flipping viewport coordinates. Indicators are pooled rather than instantiated and destroyed, supporting any number of tracked targets with minimal allocation. Each target can specify a custom icon sprite and colour.
