# Cinematic Solar System Viewer

## How to install

Put the folder here:

```text
Planets/
└── solar-system-production/
```

Open `solar-system.html` with VS Code Live Server.

Do not rely on `file:///` if your browser blocks local canvas image loading. Live Server is safer.

## Required folders

```text
solar-system-production/
├── solar-system.html
├── solar-system-style.css
├── TEXTURE-CREDITS.txt
├── assets/
│   ├── textures/
│   ├── normal-maps/
│   └── icons/
└── js/
```

## Texture files expected

Put these inside `assets/textures/`:

```text
sun.webp
mercury.webp
venus-surface.webp
venus-atmosphere.webp
earth-day.webp
earth-night.webp
earth-clouds.webp
earth-specular-map.webp
moon.webp
mars.webp
jupiter.webp
saturn.webp
saturn-ring.webp
uranus.webp
neptune.webp
stars.webp
stars-milky-way.webp
```

Put these inside `assets/normal-maps/`:

```text
earth-normal.webp
mars-normal.webp
moon-normal.webp
```

## Controls

- Left arrow: previous planet
- Right arrow or canvas click: next planet
- D: toggle Earth day/night mode
- W: toggle Earth/Venus cloudy weather mode
- B: toggle stars/Milky Way background

## Notes

The renderer uses spherical UV mapping on the canvas, so Earth should show continents correctly when `earth-day.webp` is a proper equirectangular planet texture.
