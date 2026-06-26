(function () {
  'use strict';

  const ccLighting = {
    sun: { x: -0.58, y: -0.42, z: 0.70 },

    shade(ccColor, ccNormal, ccPlanet, ccSpecularPixel, ccNormalPixel) {
      const ccN = this.applyNormalMap(ccNormal, ccNormalPixel, ccPlanet);
      const ccDot = Math.max(0, ccN.x * this.sun.x + ccN.y * this.sun.y + ccN.z * this.sun.z);
      const ccAmbient = 0.15;
      const ccDiffuse = Math.pow(ccDot, 0.82);
      const ccRim = Math.pow(Math.max(0, 1 - ccNormal.z), 2.7);
      const ccSpecStrength = ccSpecularPixel ? (ccSpecularPixel.r + ccSpecularPixel.g + ccSpecularPixel.b) / 765 : 0.5;
      const ccSpec = Math.pow(ccDot, 34) * (ccPlanet.specular || 0) * ccSpecStrength;
      const ccLight = ccAmbient + ccDiffuse * 1.12;

      return {
        r: window.ccUtils.clamp(ccColor.r * ccLight + 255 * ccSpec + ccRim * 18, 0, 255),
        g: window.ccUtils.clamp(ccColor.g * ccLight + 245 * ccSpec + ccRim * 32, 0, 255),
        b: window.ccUtils.clamp(ccColor.b * ccLight + 235 * ccSpec + ccRim * 70, 0, 255),
        a: 255,
        lightDot: ccDot
      };
    },

    emissive(ccColor, ccNormal) {
      const ccCenter = Math.pow(Math.max(0, ccNormal.z), 0.22);
      const ccPulse = 1.06 + Math.sin((ccNormal.x + ccNormal.y) * 18) * 0.04;
      return {
        r: window.ccUtils.clamp(ccColor.r * (1.32 * ccCenter + 0.52) * ccPulse, 0, 255),
        g: window.ccUtils.clamp(ccColor.g * (1.08 * ccCenter + 0.42) * ccPulse, 0, 255),
        b: window.ccUtils.clamp(ccColor.b * (0.75 * ccCenter + 0.24) * ccPulse, 0, 255),
        a: 255,
        lightDot: 1
      };
    },

    applyNormalMap(ccNormal, ccNormalPixel, ccPlanet) {
      if (!ccNormalPixel) return ccNormal;
      const ccStrength = ccPlanet.name === 'Earth' ? 0.11 : 0.16;
      const ccNx = (ccNormalPixel.r / 255 - 0.5) * ccStrength;
      const ccNy = (ccNormalPixel.g / 255 - 0.5) * ccStrength;
      const ccNz = ccNormal.z;
      const ccLen = Math.hypot(ccNormal.x + ccNx, ccNormal.y + ccNy, ccNz) || 1;
      return { x: (ccNormal.x + ccNx) / ccLen, y: (ccNormal.y + ccNy) / ccLen, z: ccNz / ccLen };
    },

    atmosphereGradient(ccCtx, ccX, ccY, ccRadius, ccPlanet) {
      const ccRgb = window.ccUtils.hexToRgb(ccPlanet.atmosphereColor || ccPlanet.color);
      const ccOuter = ccPlanet.emissive ? 2.55 : 1.75;
      const ccGrad = ccCtx.createRadialGradient(ccX, ccY, ccRadius * 0.68, ccX, ccY, ccRadius * ccOuter);
      ccGrad.addColorStop(0.00, window.ccUtils.rgba(ccRgb, ccPlanet.emissive ? 0.18 : 0.00));
      ccGrad.addColorStop(0.50, window.ccUtils.rgba(ccRgb, ccPlanet.emissive ? 0.16 : 0.10));
      ccGrad.addColorStop(0.72, window.ccUtils.rgba(ccRgb, ccPlanet.emissive ? 0.26 : 0.18));
      ccGrad.addColorStop(1.00, window.ccUtils.rgba(ccRgb, 0.00));
      return ccGrad;
    }
  };

  window.ccLighting = ccLighting;
})();
