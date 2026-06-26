(function () {
  'use strict';

  class CCRenderer {
    constructor(ccCanvas, ccTextures) {
      this.ccCanvas = ccCanvas;
      this.ccCtx = ccCanvas.getContext('2d', { alpha: false });
      this.ccTextures = ccTextures;
      this.ccStars = new window.CCStarfield(ccCanvas, ccTextures);
      this.ccPlanetCanvas = window.ccUtils.createCanvas(512, 512);
      this.ccPlanetCtx = this.ccPlanetCanvas.getContext('2d', { willReadFrequently: true });
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const ccDpr = Math.min(window.devicePixelRatio || 1, 2);
      this.ccCanvas.width = Math.floor(window.innerWidth * ccDpr);
      this.ccCanvas.height = Math.floor(window.innerHeight * ccDpr);
    }

    render(ccState) {
      const ccCtx = this.ccCtx;
      const ccW = this.ccCanvas.width;
      const ccH = this.ccCanvas.height;
      this.ccStars.draw(ccCtx, ccState.time, ccState.backgroundMode);

      if (ccState.transitioning) {
        const ccEase = window.ccUtils.easeOutCubic(ccState.transition);
        this.drawScenePlanet(ccState.currentPlanet, ccState, -ccEase * ccW * 0.22, 1 - ccEase * 0.16, 1 - ccState.transition);
        this.drawScenePlanet(ccState.targetPlanet, ccState, (1 - ccEase) * ccW * 0.24, 0.82 + ccEase * 0.18, ccState.transition);
      } else {
        this.drawScenePlanet(ccState.currentPlanet, ccState, 0, 1, 1);
      }

      window.ccEffects.vignette(ccCtx, ccW, ccH);
    }

    drawScenePlanet(ccPlanet, ccState, ccOffsetX, ccScale, ccAlpha) {
      const ccCtx = this.ccCtx;
      const ccW = this.ccCanvas.width;
      const ccH = this.ccCanvas.height;
      const ccX = ccW * 0.58 + ccOffsetX;
      const ccY = ccH * 0.51;
      const ccRadius = Math.min(ccW, ccH) * (ccPlanet.radius / 620) * ccScale;

      ccCtx.save();
      ccCtx.globalAlpha = window.ccUtils.clamp(ccAlpha, 0, 1);

      if (ccPlanet.emissive) window.ccEffects.bloom(ccCtx, ccX, ccY, ccRadius * 3.2, ccPlanet.atmosphereColor, 0.25);
      if (ccPlanet.rings) this.drawRings(ccPlanet, ccX, ccY, ccRadius, true);

      ccCtx.fillStyle = window.ccLighting.atmosphereGradient(ccCtx, ccX, ccY, ccRadius, ccPlanet);
      ccCtx.beginPath();
      ccCtx.arc(ccX, ccY, ccRadius * (ccPlanet.emissive ? 2.55 : 1.75), 0, Math.PI * 2);
      ccCtx.fill();

      this.drawMappedSphere(ccPlanet, ccState, ccX, ccY, ccRadius);

      if (ccPlanet.rings) this.drawRings(ccPlanet, ccX, ccY, ccRadius, false);
      this.drawEdgeGlow(ccPlanet, ccX, ccY, ccRadius);
      ccCtx.restore();
    }

    drawMappedSphere(ccPlanet, ccState, ccX, ccY, ccRadius) {
      const ccSize = Math.max(64, Math.ceil(ccRadius * 2));
      if (this.ccPlanetCanvas.width !== ccSize || this.ccPlanetCanvas.height !== ccSize) {
        this.ccPlanetCanvas.width = ccSize;
        this.ccPlanetCanvas.height = ccSize;
      }

      const ccImage = this.ccPlanetCtx.createImageData(ccSize, ccSize);
      const ccData = ccImage.data;
      const ccRotation = ccState.time * ccPlanet.rotationSpeed;

      for (let ccYp = 0; ccYp < ccSize; ccYp++) {
        const ccNy = (ccYp / ccSize) * 2 - 1;
        for (let ccXp = 0; ccXp < ccSize; ccXp++) {
          const ccNx = (ccXp / ccSize) * 2 - 1;
          const ccR2 = ccNx * ccNx + ccNy * ccNy;
          const ccIndex = (ccYp * ccSize + ccXp) * 4;
          if (ccR2 > 1) {
            ccData[ccIndex + 3] = 0;
            continue;
          }

          const ccNz = Math.sqrt(1 - ccR2);
          const ccTiltY = ccNy * Math.cos(ccPlanet.tilt) - ccNz * Math.sin(ccPlanet.tilt);
          const ccTiltZ = ccNy * Math.sin(ccPlanet.tilt) + ccNz * Math.cos(ccPlanet.tilt);
          const ccU = Math.atan2(ccNx, ccTiltZ) / (Math.PI * 2) + 0.5 + ccRotation;
          const ccV = Math.asin(window.ccUtils.clamp(ccTiltY, -1, 1)) / Math.PI + 0.5;

          let ccBase = this.ccTextures.getPixel(ccPlanet.name, ccU, ccV);
          const ccNormalPixel = ccPlanet.normalTexture ? this.ccTextures.getPixel(`${ccPlanet.name}:normal`, ccU, ccV) : null;
          const ccSpecularPixel = ccPlanet.specularTexture ? this.ccTextures.getPixel(`${ccPlanet.name}:specular`, ccU, ccV) : null;
          const ccNormal = { x: ccNx, y: ccNy, z: ccNz };

          if (ccPlanet.name === 'Earth' && ccState.earthMode === 'night') {
            const ccNight = this.ccTextures.getPixel('Earth:night', ccU, ccV);
            ccBase = window.ccUtils.mixRgb(ccBase, ccNight, 0.92);
          }

          if (ccState.weatherMode === 'cloudy') {
            if (ccPlanet.name === 'Earth') ccBase = this.applyCloudLayer('Earth:cloud', ccBase, ccU + ccState.time * 0.018, ccV, 0.78);
            if (ccPlanet.name === 'Venus') ccBase = this.applyCloudLayer('Venus:cloud', ccBase, ccU - ccState.time * 0.011, ccV, 0.92);
          }

          let ccLit = ccPlanet.emissive
            ? window.ccLighting.emissive(ccBase, ccNormal)
            : window.ccLighting.shade(ccBase, ccNormal, ccPlanet, ccSpecularPixel, ccNormalPixel);

          if (ccPlanet.name === 'Earth' && ccState.earthMode === 'day' && ccPlanet.nightTexture) {
            ccLit = this.addEarthNightLights(ccLit, ccU, ccV, ccLit.lightDot);
          }

          ccData[ccIndex] = ccLit.r;
          ccData[ccIndex + 1] = ccLit.g;
          ccData[ccIndex + 2] = ccLit.b;
          ccData[ccIndex + 3] = 255;
        }
      }

      this.ccPlanetCtx.putImageData(ccImage, 0, 0);
      this.ccCtx.drawImage(this.ccPlanetCanvas, ccX - ccRadius, ccY - ccRadius, ccRadius * 2, ccRadius * 2);
    }

    applyCloudLayer(ccKey, ccBase, ccU, ccV, ccStrength) {
      const ccCloud = this.ccTextures.getPixel(ccKey, ccU, ccV);
      const ccBrightness = (ccCloud.r + ccCloud.g + ccCloud.b) / 765;
      const ccAlphaFromImage = ccCloud.a / 255;
      const ccAmount = window.ccUtils.clamp((ccBrightness - 0.12) * ccStrength * ccAlphaFromImage, 0, 0.88);
      return window.ccUtils.mixRgb(ccBase, { r: 255, g: 255, b: 255 }, ccAmount);
    }

    addEarthNightLights(ccLit, ccU, ccV, ccLightDot) {
      const ccNightFactor = window.ccUtils.clamp((-ccLightDot + 0.15) / 0.95, 0, 1);
      if (ccNightFactor <= 0.01) return ccLit;
      const ccNight = this.ccTextures.getPixel('Earth:night', ccU, ccV);
      const ccGlow = Math.max(ccNight.r, ccNight.g, ccNight.b) / 255;
      return {
        r: window.ccUtils.clamp(ccLit.r + ccNight.r * ccGlow * ccNightFactor * 1.55, 0, 255),
        g: window.ccUtils.clamp(ccLit.g + ccNight.g * ccGlow * ccNightFactor * 1.25, 0, 255),
        b: window.ccUtils.clamp(ccLit.b + ccNight.b * ccGlow * ccNightFactor * 0.85, 0, 255),
        a: 255,
        lightDot: ccLightDot
      };
    }

    drawEdgeGlow(ccPlanet, ccX, ccY, ccRadius) {
      const ccRgb = window.ccUtils.hexToRgb(ccPlanet.atmosphereColor || ccPlanet.color);
      this.ccCtx.beginPath();
      this.ccCtx.arc(ccX, ccY, ccRadius + 1.2, 0, Math.PI * 2);
      this.ccCtx.strokeStyle = window.ccUtils.rgba(ccRgb, ccPlanet.emissive ? 0.72 : 0.42);
      this.ccCtx.lineWidth = Math.max(1.2, ccRadius * 0.018);
      this.ccCtx.stroke();
    }

    drawRings(ccPlanet, ccX, ccY, ccRadius, ccBehind) {
      const ccImage = this.ccTextures.getImage(`${ccPlanet.name}:ring`);
      const ccCtx = this.ccCtx;
      const ccRing = ccPlanet.rings;
      const ccOuter = ccRadius * ccRing.outer;
      const ccInner = ccRadius * ccRing.inner;
      const ccSamples = 96;

      ccCtx.save();
      ccCtx.translate(ccX, ccY);
      ccCtx.rotate(ccRing.tilt);
      ccCtx.globalAlpha = ccBehind ? 0.36 : 0.78;
      ccCtx.lineCap = 'round';

      if (ccImage) {
        const ccSampler = this.sampleRingTexture(ccImage);
        for (let ccI = 0; ccI < ccSamples; ccI++) {
          const ccT = ccI / (ccSamples - 1);
          const ccRx = window.ccUtils.lerp(ccInner, ccOuter, ccT);
          const ccRy = ccRx * 0.31;
          const ccPixel = ccSampler(ccT);
          const ccAlpha = (ccPixel.a / 255) * (0.18 + Math.sin(ccT * Math.PI) * 0.72);
          if (ccAlpha < 0.018) continue;

          ccCtx.beginPath();
          ccCtx.ellipse(
            0,
            0,
            ccRx,
            ccRy,
            0,
            ccBehind ? Math.PI : 0,
            ccBehind ? Math.PI * 2 : Math.PI
          );
          ccCtx.strokeStyle = `rgba(${ccPixel.r},${ccPixel.g},${ccPixel.b},${ccAlpha})`;
          ccCtx.lineWidth = Math.max(0.85, (ccOuter - ccInner) / ccSamples * 1.85);
          ccCtx.stroke();
        }
      } else {
        for (let ccI = 0; ccI < 24; ccI++) {
          const ccT = ccI / 23;
          const ccRx = window.ccUtils.lerp(ccInner, ccOuter, ccT);
          ccCtx.beginPath();
          ccCtx.ellipse(
            0,
            0,
            ccRx,
            ccRx * 0.31,
            0,
            ccBehind ? Math.PI : 0,
            ccBehind ? Math.PI * 2 : Math.PI
          );
          ccCtx.strokeStyle = `rgba(230,210,170,${0.05 + Math.sin(ccT * Math.PI) * 0.22})`;
          ccCtx.lineWidth = 2;
          ccCtx.stroke();
        }
      }

      ccCtx.restore();

      if (!ccBehind) {
        ccCtx.save();
        ccCtx.beginPath();
        ccCtx.arc(ccX, ccY, ccRadius, 0, Math.PI * 2);
        ccCtx.clip();
        ccCtx.translate(ccX, ccY);
        ccCtx.rotate(ccRing.tilt);
        ccCtx.fillStyle = 'rgba(0,0,0,0.24)';
        ccCtx.fillRect(-ccRadius * 1.08, -ccRadius * 0.17, ccRadius * 2.16, ccRadius * 0.18);
        ccCtx.restore();
      }
    }

    sampleRingTexture(ccImage) {
      if (!this.ccRingSampleCanvas) {
        this.ccRingSampleCanvas = window.ccUtils.createCanvas(512, 8);
        this.ccRingSampleCtx = this.ccRingSampleCanvas.getContext('2d', { willReadFrequently: true });
        this.ccRingSampleCache = new Map();
      }

      const ccCacheKey = `${ccImage.src || 'ring'}:${ccImage.width}x${ccImage.height}`;
      if (!this.ccRingSampleCache.has(ccCacheKey)) {
        const ccCanvas = this.ccRingSampleCanvas;
        const ccCtx = this.ccRingSampleCtx;
        ccCtx.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
        ccCtx.drawImage(ccImage, 0, 0, ccCanvas.width, ccCanvas.height);
        this.ccRingSampleCache.set(ccCacheKey, ccCtx.getImageData(0, Math.floor(ccCanvas.height / 2), ccCanvas.width, 1));
      }

      const ccData = this.ccRingSampleCache.get(ccCacheKey);
      return (ccT) => {
        const ccX = window.ccUtils.clamp(Math.floor(ccT * (ccData.width - 1)), 0, ccData.width - 1);
        const ccIndex = ccX * 4;
        return {
          r: ccData.data[ccIndex],
          g: ccData.data[ccIndex + 1],
          b: ccData.data[ccIndex + 2],
          a: ccData.data[ccIndex + 3]
        };
      };
    }
  }

  window.CCRenderer = CCRenderer;
})();
