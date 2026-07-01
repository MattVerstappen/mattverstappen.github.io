(function () {
  'use strict';

  window.ccEffects = {
    bloom(ccCtx, ccX, ccY, ccRadius, ccColor, ccAlpha) {
      const ccRgb = window.ccUtils.hexToRgb(ccColor);
      const ccGrad = ccCtx.createRadialGradient(ccX, ccY, 0, ccX, ccY, ccRadius);
      ccGrad.addColorStop(0, window.ccUtils.rgba(ccRgb, ccAlpha));
      ccGrad.addColorStop(0.42, window.ccUtils.rgba(ccRgb, ccAlpha * 0.34));
      ccGrad.addColorStop(1, window.ccUtils.rgba(ccRgb, 0));
      ccCtx.fillStyle = ccGrad;
      ccCtx.beginPath();
      ccCtx.arc(ccX, ccY, ccRadius, 0, Math.PI * 2);
      ccCtx.fill();
    },

    vignette(ccCtx, ccW, ccH) {
      const ccGrad = ccCtx.createRadialGradient(ccW / 2, ccH / 2, ccW * 0.08, ccW / 2, ccH / 2, ccW * 0.72);
      ccGrad.addColorStop(0, 'rgba(0,0,0,0)');
      ccGrad.addColorStop(0.72, 'rgba(0,0,0,0.18)');
      ccGrad.addColorStop(1, 'rgba(0,0,0,0.72)');
      ccCtx.fillStyle = ccGrad;
      ccCtx.fillRect(0, 0, ccW, ccH);
    }
  };
})();
