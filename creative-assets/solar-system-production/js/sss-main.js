(function () {
  'use strict';

  class CCSolarSystemApp {
    constructor() {
      this.ccCanvas = document.getElementById('cc-canvas');
      this.ccPlanets = window.ccPlanets;
      this.ccCurrentIndex = this.ccPlanets.findIndex((ccPlanet) => ccPlanet.name === 'Earth');
      if (this.ccCurrentIndex < 0) this.ccCurrentIndex = 0;
      this.ccTargetIndex = this.ccCurrentIndex;
      this.ccTransition = 0;
      this.ccTransitioning = false;
      this.ccTime = 0;
      this.ccLastFrame = performance.now();

      this.ccState = {
        earthMode: 'day',
        weatherMode: 'clear',
        backgroundMode: 'stars'
      };

      this.ccTextures = new window.CCTextureManager(this.ccPlanets);
      this.ccRenderer = new window.CCRenderer(this.ccCanvas, this.ccTextures);
      this.ccUI = new window.CCUIController(this);
      this.ccUI.updatePlanet(this.ccPlanets[this.ccCurrentIndex], this.ccCurrentIndex, this.ccPlanets.length);
      this.ccUI.updateModes(this.ccState);
    }

    async start() {
      await this.loadBackgroundTextures();
      await this.ccTextures.loadAll();
      this.ccUI.hideLoader();
      requestAnimationFrame((ccNow) => this.loop(ccNow));
    }

    async loadBackgroundTextures() {
      await Promise.all([
        this.ccTextures.loadTexture('background:stars', 'assets/textures/stars.webp', '#02030a'),
        this.ccTextures.loadTexture('background:milkyway', 'assets/textures/stars-milky-way.webp', '#02030a')
      ]);
    }

    cycle(ccDirection) {
      if (this.ccTransitioning && this.ccTransition < 0.45) return;
      this.ccTargetIndex = (this.ccTargetIndex + ccDirection + this.ccPlanets.length) % this.ccPlanets.length;
      this.ccTransition = 0;
      this.ccTransitioning = true;
      this.ccUI.updatePlanet(this.ccPlanets[this.ccTargetIndex], this.ccTargetIndex, this.ccPlanets.length);
    }

    toggleEarthMode() {
      this.ccState.earthMode = this.ccState.earthMode === 'day' ? 'night' : 'day';
      this.ccUI.updateModes(this.ccState);
    }

    toggleWeatherMode() {
      this.ccState.weatherMode = this.ccState.weatherMode === 'clear' ? 'cloudy' : 'clear';
      this.ccUI.updateModes(this.ccState);
    }

    toggleBackgroundMode() {
      this.ccState.backgroundMode = this.ccState.backgroundMode === 'stars' ? 'milkyway' : 'stars';
      this.ccUI.updateModes(this.ccState);
    }

    loop(ccNow) {
      const ccDelta = Math.min(0.05, (ccNow - this.ccLastFrame) / 1000);
      this.ccLastFrame = ccNow;
      this.ccTime += ccDelta;

      if (this.ccTransitioning) {
        this.ccTransition += ccDelta * 1.35;
        if (this.ccTransition >= 1) {
          this.ccTransition = 1;
          this.ccTransitioning = false;
          this.ccCurrentIndex = this.ccTargetIndex;
        }
      }

      this.ccRenderer.render({
        time: this.ccTime,
        currentPlanet: this.ccPlanets[this.ccCurrentIndex],
        targetPlanet: this.ccPlanets[this.ccTargetIndex],
        transition: this.ccTransition,
        transitioning: this.ccTransitioning,
        earthMode: this.ccState.earthMode,
        weatherMode: this.ccState.weatherMode,
        backgroundMode: this.ccState.backgroundMode
      });

      requestAnimationFrame((ccNext) => this.loop(ccNext));
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const ccApp = new CCSolarSystemApp();
    ccApp.start();
    window.ccSolarSystemApp = ccApp;
  });
})();
