(function () {
  'use strict';

  class CCTextureManager {
    constructor(ccPlanets) {
      this.ccPlanets = ccPlanets;
      this.ccImages = new Map();
      this.ccSamples = new Map();
      this.ccSampleSize = 768;
    }

    async loadAll() {
      const ccTasks = [];
      for (const ccPlanet of this.ccPlanets) {
        ccTasks.push(this.loadTexture(ccPlanet.name, ccPlanet.texture, ccPlanet.color));
        if (ccPlanet.nightTexture) ccTasks.push(this.loadTexture(`${ccPlanet.name}:night`, ccPlanet.nightTexture, '#111522'));
        if (ccPlanet.cloudTexture) ccTasks.push(this.loadTexture(`${ccPlanet.name}:cloud`, ccPlanet.cloudTexture, '#ffffff'));
        if (ccPlanet.normalTexture) ccTasks.push(this.loadTexture(`${ccPlanet.name}:normal`, ccPlanet.normalTexture, '#8080ff'));
        if (ccPlanet.specularTexture) ccTasks.push(this.loadTexture(`${ccPlanet.name}:specular`, ccPlanet.specularTexture, '#111111'));
        if (ccPlanet.ringTexture) ccTasks.push(this.loadTexture(`${ccPlanet.name}:ring`, ccPlanet.ringTexture, '#d8c69d', true));
      }
      await Promise.all(ccTasks);
    }

    loadTexture(ccKey, ccUrl, ccFallbackColor, ccKeepAlpha = false) {
      return new Promise((resolve) => {
        let ccDone = false;
        const ccFinish = (ccSource) => {
          if (ccDone) return;
          ccDone = true;
          clearTimeout(ccTimeout);
          this.ccImages.set(ccKey, ccSource);
          this.prepareSample(ccKey, ccSource, ccKeepAlpha);
          resolve();
        };

        const ccFallback = () => {
          console.warn(`Texture failed or timed out: ${ccKey} (${ccUrl}) - using procedural fallback.`);
          ccFinish(this.createFallbackTexture(ccFallbackColor, ccKeepAlpha, ccKey));
        };
        const ccTimeout = setTimeout(ccFallback, 4000);
        const ccImage = new Image();
        ccImage.onload = () => ccFinish(ccImage);
        ccImage.onerror = ccFallback;
        ccImage.src = ccUrl;
      });
    }

    prepareSample(ccKey, ccSource, ccKeepAlpha) {
      const ccCanvas = window.ccUtils.createCanvas(this.ccSampleSize, this.ccSampleSize);
      const ccCtx = ccCanvas.getContext('2d', { willReadFrequently: true });
      ccCtx.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
      ccCtx.drawImage(ccSource, 0, 0, ccCanvas.width, ccCanvas.height);
      try {
        this.ccSamples.set(ccKey, ccCtx.getImageData(0, 0, ccCanvas.width, ccCanvas.height));
      } catch (ccError) {
        const ccFallback = this.createFallbackTexture('#888888', ccKeepAlpha, ccKey);
        const ccFallbackCtx = ccFallback.getContext('2d', { willReadFrequently: true });
        this.ccSamples.set(ccKey, ccFallbackCtx.getImageData(0, 0, ccFallback.width, ccFallback.height));
      }
    }

    getPixel(ccKey, ccU, ccV) {
      const ccData = this.ccSamples.get(ccKey);
      if (!ccData) return { r: 255, g: 255, b: 255, a: 255 };
      const ccX = ((Math.floor(ccU * ccData.width) % ccData.width) + ccData.width) % ccData.width;
      const ccY = window.ccUtils.clamp(Math.floor(ccV * ccData.height), 0, ccData.height - 1);
      const ccIndex = (ccY * ccData.width + ccX) * 4;
      return {
        r: ccData.data[ccIndex],
        g: ccData.data[ccIndex + 1],
        b: ccData.data[ccIndex + 2],
        a: ccData.data[ccIndex + 3]
      };
    }

    getImage(ccKey) {
      return this.ccImages.get(ccKey);
    }

    createFallbackTexture(ccColor, ccKeepAlpha, ccKey = '') {
      const ccCanvas = window.ccUtils.createCanvas(this.ccSampleSize, this.ccSampleSize);
      const ccCtx = ccCanvas.getContext('2d');
      const ccRgb = window.ccUtils.hexToRgb(ccColor || '#777777');
      ccCtx.fillStyle = ccKeepAlpha ? 'rgba(0,0,0,0)' : `rgb(${ccRgb.r},${ccRgb.g},${ccRgb.b})`;
      ccCtx.fillRect(0, 0, ccCanvas.width, ccCanvas.height);
      const ccLowerKey = String(ccKey).toLowerCase();
      const ccIsCratery = ccLowerKey.includes('moon') || ccLowerKey.includes('mercury');
      if (ccIsCratery) {
        for (let ccI = 0; ccI < 950; ccI++) {
          const ccX = Math.random() * ccCanvas.width;
          const ccY = Math.random() * ccCanvas.height;
          const ccR = 2 + Math.random() * 26;
          ccCtx.beginPath();
          ccCtx.arc(ccX, ccY, ccR, 0, Math.PI * 2);
          ccCtx.strokeStyle = 'rgba(255,255,255,0.16)';
          ccCtx.lineWidth = 1;
          ccCtx.stroke();
          ccCtx.beginPath();
          ccCtx.arc(ccX + ccR * 0.16, ccY + ccR * 0.16, ccR * 0.68, 0, Math.PI * 2);
          ccCtx.fillStyle = 'rgba(0,0,0,0.18)';
          ccCtx.fill();
        }
      }
      for (let ccI = 0; ccI < 2200; ccI++) {
        const ccX = Math.random() * ccCanvas.width;
        const ccY = Math.random() * ccCanvas.height;
        const ccA = ccKeepAlpha ? Math.random() * 0.25 : Math.random() * 0.18;
        ccCtx.fillStyle = `rgba(255,255,255,${ccA})`;
        ccCtx.fillRect(ccX, ccY, 1.5, 1.5);
      }
      return ccCanvas;
    }
  }

  window.CCTextureManager = CCTextureManager;
})();
