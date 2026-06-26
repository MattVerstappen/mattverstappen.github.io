/**
 * meteor-shower.js
 * Dynamic meteor shower for creative-coding.html demo frame.
 * Initialises inside #cc-demo-meteor container only.
 */
(function() {
    const container = document.getElementById('cc-demo-meteor');
    const count = 25;

    // Animation data: name + exact translation vectors (MUST match CSS @keyframes)
    const animationData = [
      { name: 'cc-fall-std', dx: 450, dy: 450 ,angle: 45},
      { name: 'cc-fall-steep', dx: 300, dy: 550 , angle: Math.atan2(580, 320) * (180 / Math.PI)},
      { name: 'cc-fall-shallow', dx: 580, dy: 320, angle: Math.atan2(300, 550) * (180 / Math.PI)}
    ];

    for (let i = 0; i < count; i++) {
      // Create meteor container
      const meteor = document.createElement('div');
      meteor.className = 'cc-meteor';

      // Random position (this is where the HEAD will be)
      const top = Math.random() * 30;
      const left = 10 + Math.random() * 80;
      meteor.style.top = top + '%';
      meteor.style.left = left + '%';

      // Random duration and delay
      const duration = 3 + Math.random() * 5;
      const delay = Math.random() * 10;

      // Pick a random animation
      //const selected = animationData[Math.floor(Math.random() * animationData.length)];
      const selected = animationData[Math.floor(Math.random() * animationData.length)];

      // Apply animation to the container (this moves the HEAD in a straight line)
      meteor.style.animation = `${selected.name} ${duration}s linear infinite`;
      meteor.style.animationDelay = delay + 's';

      // ============================================
      // CREATE TRAIL (rotates around the head)
      // ============================================
      const trail = document.createElement('div');
      trail.className = 'cc-meteor-trail';
      // ✅ Apply the calculated angle to the trail ONLY
      trail.style.transform = `rotate(${selected.angle}deg)`;
      meteor.appendChild(trail);

      // ============================================
      // CREATE HEAD (sits at container origin)
      // ============================================
      const head = document.createElement('div');
      head.className = 'cc-meteor-head';
      // Head does NOT need rotation—it stays centered on the origin
      meteor.appendChild(head);

      container.appendChild(meteor);
    }
  })();
