(function () {
  'use strict';

  class CCStarfield {
    constructor(ccCanvas, ccTextures) {
      this.ccCanvas = ccCanvas;
      this.ccTextures = ccTextures;
      this.ccStars = [];
      this.generate();
    }

    generate() {
      this.ccStars.length = 0;
      for (let ccI = 0; ccI < 2600; ccI++) {
        this.ccStars.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.2 + Math.pow(Math.random(), 2) * 1.8,
          a: 0.18 + Math.random() * 0.72,
          speed: 0.3 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.88 ? '190,215,255' : Math.random() > 0.94 ? '255,224,180' : '255,255,255'
        });
      }
    }

    draw(ccCtx, ccTime, ccBackgroundMode) {
      const ccW = this.ccCanvas.width;
      const ccH = this.ccCanvas.height;
      const ccKey = ccBackgroundMode === 'milkyway' ? 'background:milkyway' : 'background:stars';
      const ccImage = this.ccTextures.getImage(ccKey);

      ccCtx.fillStyle = '#02030a';
      ccCtx.fillRect(0, 0, ccW, ccH);

      if (ccImage) {
        ccCtx.save();
        ccCtx.globalAlpha = ccBackgroundMode === 'milkyway' ? 0.82 : 0.58;
        ccCtx.drawImage(ccImage, 0, 0, ccW, ccH);
        ccCtx.restore();
      }

      for (const ccStar of this.ccStars) {
        const ccTwinkle = 0.55 + 0.45 * Math.sin(ccTime * ccStar.speed + ccStar.phase);
        ccCtx.beginPath();
        ccCtx.arc(ccStar.x * ccW, ccStar.y * ccH, ccStar.r, 0, Math.PI * 2);
        ccCtx.fillStyle = `rgba(${ccStar.color},${ccStar.a * ccTwinkle})`;
        ccCtx.fill();
      }
    }
  }

  window.CCStarfield = CCStarfield;
})();
