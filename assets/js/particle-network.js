/**
 * particle-network.js
 * Subtle floating particle network background for all portfolio pages.
 * Initialises automatically when the DOM is ready.
 * Respects prefers-reduced-motion.
 */

(function() {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let W = 0, H = 0;
    let animId = null;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
        initParticles();
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = rand(0, W);
            this.y  = rand(0, H);
            this.vx = rand(-0.4, 0.4);
            this.vy = rand(-0.4, 0.4);
            this.r  = rand(1.5, 3);
            this.opacity = rand(0.2, 0.45);
            this.hue = Math.random() > 0.5 ? rand(270, 295) : rand(185, 205);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const f = 0.004;
                    this.vx += dx * f;
                    this.vy += dy * f;
                    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (speed > 1.0) {
                        this.vx = (this.vx / speed) * 1.0;
                        this.vy = (this.vy / speed) * 1.0;
                    }
                }
            }
            this.vx *= 0.999;
            this.vy *= 0.999;
        }
        draw() {
            ctx.save();
            ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.25)`;
            ctx.shadowBlur  = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        const count = Math.min(100, Math.floor((W * H) / 10000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
        const maxDist = 160;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.18;
                    const hue     = (particles[i].hue + particles[j].hue) / 2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        if (animId) cancelAnimationFrame(animId);
        resize();
        animate();
    });

    document.addEventListener('DOMContentLoaded', () => {
        resize();
        animate();
    });
})();
