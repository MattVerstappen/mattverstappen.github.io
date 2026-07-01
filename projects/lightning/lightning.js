/**
 * lightning.js
 * Purple rain and lightning for the creative-coding.html demo frame.
 * Initialises inside #cc-demo-lightning container only.
 */
(function() {
    'use strict';

    const container     = document.getElementById('cc-demo-lightning');
    const rainCanvas    = document.getElementById('cc-rain-canvas');
    const lightCanvas   = document.getElementById('cc-lightning-canvas');
    const flash         = document.getElementById('cc-lightning-flash');

    if (!container || !rainCanvas || !lightCanvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rainCtx  = rainCanvas.getContext('2d');
    const lightCtx = lightCanvas.getContext('2d');
    let rainDrops  = [];
    let dims       = { w: 0, h: 0 };

    function resize() {
        const rect = container.getBoundingClientRect();
        const dpr  = window.devicePixelRatio || 1;
        dims.w = rect.width;
        dims.h = rect.height;
        [rainCanvas, lightCanvas].forEach(c => {
            c.width        = dims.w * dpr;
            c.height       = dims.h * dpr;
            c.style.width  = dims.w + 'px';
            c.style.height = dims.h + 'px';
        });
        rainCtx.scale(dpr, dpr);
        lightCtx.scale(dpr, dpr);
    }

    // ---- Rain ----
    class RainDrop {
        constructor() { this.reset(); this.y = Math.random() * dims.h; }
        reset() {
            this.x      = Math.random() * dims.w;
            this.y      = -10;
            this.length = 8  + Math.random() * 15;
            this.speed  = 8  + Math.random() * 14;
            this.opacity = 0.15 + Math.random() * 0.35;
        }
        update() {
            this.y += this.speed;
            if (this.y > dims.h) { this.reset(); }
        }
        draw() {
            rainCtx.beginPath();
            rainCtx.moveTo(this.x, this.y);
            rainCtx.lineTo(this.x - 2, this.y - this.length);
            rainCtx.strokeStyle = `rgba(160, 80, 255, ${this.opacity})`;
            rainCtx.lineWidth   = 1.2;
            rainCtx.stroke();
        }
    }

    function initRain() {
        rainDrops = [];
        const count = Math.floor((dims.w * dims.h) / 4000);
        for (let i = 0; i < Math.min(count, 150); i++) {
            rainDrops.push(new RainDrop());
        }
    }

    function animateRain() {
        rainCtx.clearRect(0, 0, dims.w, dims.h);
        rainDrops.forEach(d => { d.update(); d.draw(); });
        requestAnimationFrame(animateRain);
    }

    // ---- Lightning ----
    function rand(min, max) { return Math.random() * (max - min) + min; }

    function drawBolt(startX, startY, endX, endY, color, lineWidth, branchCount) {
        const segments = 8 + Math.floor(Math.random() * 8);
        const pts = [];
        let x = startX, y = startY;
        const dx = (endX - startX) / segments;
        const dy = (endY - startY) / segments;
        for (let i = 0; i <= segments; i++) {
            pts.push(i === 0 || i === segments
                ? { x, y }
                : { x: x + rand(-35, 35), y: y + rand(-18, 18) });
            x += dx; y += dy;
        }

        lightCtx.save();
        lightCtx.shadowColor = color;
        lightCtx.shadowBlur  = 20;
        lightCtx.beginPath();
        lightCtx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => lightCtx.lineTo(p.x, p.y));
        lightCtx.strokeStyle = color;
        lightCtx.lineWidth   = lineWidth;
        lightCtx.lineCap     = 'round';
        lightCtx.lineJoin    = 'round';
        lightCtx.stroke();

        lightCtx.shadowBlur  = 40;
        lightCtx.shadowColor = '#ffffff';
        lightCtx.beginPath();
        lightCtx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => lightCtx.lineTo(p.x, p.y));
        lightCtx.strokeStyle = 'rgba(255,255,255,0.5)';
        lightCtx.lineWidth   = lineWidth * 0.25;
        lightCtx.stroke();
        lightCtx.restore();

        for (let b = 0; b < branchCount; b++) {
            const idx   = 1 + Math.floor(Math.random() * (pts.length - 2));
            const p     = pts[idx];
            const angle = Math.atan2(pts[idx+1].y - pts[idx-1].y, pts[idx+1].x - pts[idx-1].x)
                        + (Math.random() > 0.5 ? 1 : -1) * rand(0.5, 1.2);
            const len   = rand(50, 150);
            lightCtx.save();
            lightCtx.shadowColor = color;
            lightCtx.shadowBlur  = 12;
            lightCtx.beginPath();
            lightCtx.moveTo(p.x, p.y);
            const steps = 4 + Math.floor(Math.random() * 4);
            for (let s = 0; s <= steps; s++) {
                const t = s / steps;
                lightCtx.lineTo(
                    p.x + (p.x + Math.cos(angle)*len - p.x)*t + rand(-15,15),
                    p.y + (p.y + Math.sin(angle)*len - p.y)*t + rand(-15,15)
                );
            }
            lightCtx.strokeStyle = color;
            lightCtx.lineWidth   = lineWidth * 0.45;
            lightCtx.lineCap     = 'round';
            lightCtx.stroke();
            lightCtx.restore();
        }
    }

    function strike() {
        lightCtx.clearRect(0, 0, dims.w, dims.h);
        const sx = rand(dims.w * 0.15, dims.w * 0.85);
        const ex = sx + rand(-120, 120);
        const ey = dims.h * (0.55 + rand(0.2, 0.35));
        const color = `hsl(${280 + rand(-15,15)}, 100%, 65%)`;
        drawBolt(sx, 0, ex, ey, color, 2.5 + rand(0,2.5), 2 + Math.floor(Math.random()*3));
        if (flash) {
            flash.classList.add('active');
            setTimeout(() => flash.classList.remove('active'), 80);
        }
        setTimeout(() => lightCtx.clearRect(0, 0, dims.w, dims.h), 400);
    }

    // Click anywhere on the demo frame to strike
    container.addEventListener('click', strike);

    // Random strikes
    (function randomStrike() {
        setTimeout(() => { strike(); randomStrike(); }, 10000 + Math.random() * 10000);
    })();

    // Init
    resize();
    initRain();
    animateRain();

    window.addEventListener('resize', () => {
        resize();
        initRain();
    });
})();
