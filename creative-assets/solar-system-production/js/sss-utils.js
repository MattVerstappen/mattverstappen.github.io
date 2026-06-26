(function () {
  'use strict';

  window.ccUtils = {
    clamp(ccValue, ccMin, ccMax) {
      return Math.max(ccMin, Math.min(ccMax, ccValue));
    },
    lerp(ccA, ccB, ccT) {
      return ccA + (ccB - ccA) * ccT;
    },
    easeOutCubic(ccT) {
      return 1 - Math.pow(1 - ccT, 3);
    },
    hexToRgb(ccHex) {
      const ccClean = ccHex.replace('#', '');
      const ccValue = parseInt(ccClean.length === 3 ? ccClean.split('').map((ccChar) => ccChar + ccChar).join('') : ccClean, 16);
      return { r: (ccValue >> 16) & 255, g: (ccValue >> 8) & 255, b: ccValue & 255 };
    },
    rgba(ccRgb, ccAlpha) {
      return `rgba(${ccRgb.r}, ${ccRgb.g}, ${ccRgb.b}, ${ccAlpha})`;
    },
    mixRgb(ccA, ccB, ccT) {
      return {
        r: Math.round(window.ccUtils.lerp(ccA.r, ccB.r, ccT)),
        g: Math.round(window.ccUtils.lerp(ccA.g, ccB.g, ccT)),
        b: Math.round(window.ccUtils.lerp(ccA.b, ccB.b, ccT)),
        a: 255
      };
    },
    createCanvas(ccWidth, ccHeight) {
      const ccCanvas = document.createElement('canvas');
      ccCanvas.width = ccWidth;
      ccCanvas.height = ccHeight;
      return ccCanvas;
    }
  };
})();
