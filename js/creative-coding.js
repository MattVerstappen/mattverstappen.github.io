/**
 * creative-coding.js
 * Binary rain and lightning demo for creative-coding.html.
 * Only initialises if #rainCanvas and #lightningCanvas exist.
 */

(function() {
    'use strict';

    const rainCanvas      = document.getElementById('rainCanvas');
    const lightningCanvas = document.getElementById('lightningCanvas');
    const flash           = document.getElementById('flash');
    const container       = document.getElementById('lightningContainer');

    if (!rainCanvas || !lightningCanvas || !container) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        rainCanvas.style.display      = 'none';
        lightningCanvas.style.display = 'none';
        return;
    }

    const rainCtx      = rainCanvas.getContext('2d');
    const lightningCtx = lightningCanvas.getContext('2d');

    // ---- Resize both canvases to container size ----
    function resize() {
        const rect = container.getBoundingClientRect();
        const dpr  = window.devicePixelRatio || 1;
        const w    = rect.width;
        const h    = rect.height;

        [rainCanvas, lightningCanvas].forEach(c => {
            c.width        = w * dpr;
            c.height       = h * dpr;
            c.style.width  = w + 'px';
            c.style.height = h + 'px';
        });

        rainCtx.scale(dpr, dpr);
        lightningCtx.scale(dpr, dpr);
        return { w, h };
    }

    let dims = resize();

    // ---- BINARY RAIN ----
    const rainDrops = [];

    class RainDrop {
        constructor() { this.reset(); }
        reset() {
            this.x     = Math.random() * dims.w;
            this.y     = Math.random() * dims.h - dims.h;
            this.speed = 60 + Math.random() * 100;
            this.char  = Math.random() > 0.5 ? '1' : '0';
            this.opacity = 0.2 + Math.random() * 0.4;
            this.size  = 13 + Math.random() * 6;
        }
        update(delta) {
            this.y += this.speed * delta;
            if (this.y > dims.h + 20) {
                this.y    = -20;
                this.x    = Math.random() * dims.w;
                this.char = Math.random() > 0.5 ? '1' : '0';
            }
        }
        draw() {
            const hue = this.char === '1' ? 280 : 180;
            rainCtx.save();
            rainCtx.font      = `${this.size}px "Courier New", monospace`;
            rainCtx.textAlign = 'center';
            rainCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${this.opacity})`;
            rainCtx.fillText(this.char, this.x, this.y);
            rainCtx.restore();
        }
    }

    function initRain() {
        rainDrops.length = 0;
        const count = Math.floor((dims.w * dims.h) / 3000);
        for (let i = 0; i < Math.min(count, 200); i++) {
            rainDrops.push(new RainDrop());
        }
    }

    let lastTime = 0;

    function animateRain(ts) {
        const delta = lastTime ? (ts - lastTime) / 1000 : 0.016;
        lastTime = ts;
        rainCtx.clearRect(0, 0, dims.w, dims.h);
        rainDrops.forEach(d => { d.update(delta); d.draw(); });
        requestAnimationFrame(animateRain);
    }

    // ---- LIGHTNING ----
    function rand(min, max) { return Math.random() * (max - min) + min; }

    function drawBolt(points, color, size, glow) {
        lightningCtx.save();
        for (let i = 0; i < points.length - 1; i++) {
            const p1  = points[i], p2 = points[i + 1];
            const seg = Math.floor(Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / 14) + 1;
            for (let j = 0; j <= seg; j++) {
                const t    = j / seg;
                const x    = p1.x + (p2.x - p1.x) * t + rand(-3, 3);
                const y    = p1.y + (p2.y - p1.y) * t + rand(-3, 3);
                const char = Math.random() > 0.5 ? '1' : '0';
                const hue  = char === '1' ? 280 : 180;
                lightningCtx.font         = `${size * (0.8 + Math.random() * 0.4)}px "Courier New", monospace`;
                lightningCtx.fillStyle    = `hsl(${hue}, 100%, 72%)`;
                lightningCtx.shadowColor  = color;
                lightningCtx.shadowBlur   = glow;
                lightningCtx.textAlign    = 'center';
                lightningCtx.fillText(char, x, y);
            }
        }
        lightningCtx.restore();
    }

    function boltPath(sx, sy, ex, ey) {
        const segs = 7 + Math.floor(Math.random() * 7);
        const pts  = [];
        const dx   = (ex - sx) / segs;
        const dy   = (ey - sy) / segs;
        for (let i = 0; i <= segs; i++) {
            if (i === 0 || i === segs) { pts.push({ x: sx + dx * i, y: sy + dy * i }); }
            else { pts.push({ x: sx + dx * i + rand(-30, 30), y: sy + dy * i + rand(-15, 15) }); }
        }
        return pts;
    }

    function branches(pts) {
        const out = [];
        const num = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < num; i++) {
            const idx   = 1 + Math.floor(Math.random() * (pts.length - 2));
            const p     = pts[idx];
            const angle = Math.atan2(pts[idx + 1].y - pts[idx - 1].y, pts[idx + 1].x - pts[idx - 1].x)
                        + (Math.random() > 0.5 ? 1 : -1) * rand(0.5, 1.2);
            const len   = rand(50, 130);
            const ex    = p.x + Math.cos(angle) * len;
            const ey    = p.y + Math.sin(angle) * len;
            const bpts  = [];
            const steps = 4 + Math.floor(Math.random() * 4);
            for (let j = 0; j <= steps; j++) {
                const t = j / steps;
                bpts.push({ x: p.x + (ex - p.x) * t + rand(-18, 18), y: p.y + (ey - p.y) * t + rand(-18, 18) });
            }
            out.push(bpts);
        }
        return out;
    }

    function strike(x, y) {
        lightningCtx.clearRect(0, 0, dims.w, dims.h);
        const startX = x !== undefined ? x : rand(dims.w * 0.1, dims.w * 0.9);
        const endX   = startX + rand(-100, 100);
        const endY   = dims.h * rand(0.5, 0.85);
        const hue    = Math.random() > 0.5 ? 280 : 190;
        const color  = `hsl(${hue}, 100%, 65%)`;
        const size   = 16 + rand(0, 8);

        const main = boltPath(startX, 0, endX, endY);
        drawBolt(main, color, size, 22);
        branches(main).forEach(b => drawBolt(b, color, size * 0.55, 14));

        if (flash) {
            flash.classList.add('active');
            setTimeout(() => flash.classList.remove('active'), 70);
        }
        setTimeout(() => lightningCtx.clearRect(0, 0, dims.w, dims.h), 480);
    }

    // Click to strike
    container.addEventListener('click', e => {
        const rect = container.getBoundingClientRect();
        strike(e.clientX - rect.left);
    });

    // Random strikes
    (function randomStrike() {
        setTimeout(() => {
            strike();
            randomStrike();
        }, 14000 + Math.random() * 14000);
    })();

    // Resize handler
    window.addEventListener('resize', () => {
        dims = resize();
        initRain();
    });

    // Start
    initRain();
    requestAnimationFrame(animateRain);

})();
