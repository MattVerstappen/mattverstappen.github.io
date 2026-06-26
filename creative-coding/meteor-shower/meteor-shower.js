/**
 * meteor-shower.js
 * Dynamic meteor shower for creative-coding.html demo frame.
 * Initialises inside #cc-demo-meteor container only.
 */
(function() {
    'use strict';

    const container = document.getElementById('cc-demo-meteor');
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = 18;

    const animationData = [
        { name: 'cc-fall-std',     dx: 450, dy: 450, angle: 45 },
        { name: 'cc-fall-steep',   dx: 300, dy: 550, angle: Math.atan2(550, 300) * (180 / Math.PI) },
        { name: 'cc-fall-shallow', dx: 580, dy: 320, angle: Math.atan2(320, 580) * (180 / Math.PI) }
    ];

    for (let i = 0; i < count; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'cc-meteor';

        const top      = Math.random() * 30;
        const left     = 10 + Math.random() * 80;
        meteor.style.top  = top + '%';
        meteor.style.left = left + '%';

        const duration = 3 + Math.random() * 5;
        const delay    = Math.random() * 10;
        const selected = animationData[Math.floor(Math.random() * animationData.length)];

        meteor.style.animation      = `${selected.name} ${duration}s linear infinite`;
        meteor.style.animationDelay = delay + 's';

        const trail = document.createElement('div');
        trail.className = 'cc-meteor-trail';
        trail.style.transform = `rotate(${selected.angle}deg)`;
        meteor.appendChild(trail);

        const head = document.createElement('div');
        head.className = 'cc-meteor-head';
        meteor.appendChild(head);

        container.appendChild(meteor);
    }
})();
