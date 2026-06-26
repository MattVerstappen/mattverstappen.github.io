(function () {
  "use strict";

  class CCUIController {
    constructor(ccApp) {
      this.ccApp = ccApp;

      this.ccTouchStartX = 0;
      this.ccTouchStartY = 0;
      this.ccTouchEndX = 0;
      this.ccLastSwipe = 0;

      this.ccEls = {
        prev: document.getElementById("cc-prev"),
        next: document.getElementById("cc-next"),
        dayNight: document.getElementById("cc-day-night"),
        weather: document.getElementById("cc-weather"),
        background: document.getElementById("cc-background"),
        loader: document.getElementById("cc-loader"),
        name: document.getElementById("cc-planet-name"),
        description: document.getElementById("cc-planet-description"),
        type: document.getElementById("cc-planet-type"),
        atmosphere: document.getElementById("cc-planet-atmosphere"),
        visual: document.getElementById("cc-planet-visual"),
        label: document.getElementById("cc-current-label"),
        counter: document.getElementById("cc-counter"),
        canvas: document.getElementById("cc-canvas")
      };

      this.bind();
    }

    bind() {
      this.ccEls.prev?.addEventListener("click", () => {
        this.ccApp.cycle(-1);
      });

      this.ccEls.next?.addEventListener("click", () => {
        this.ccApp.cycle(1);
      });

      this.ccEls.canvas?.addEventListener("click", () => {
        this.ccApp.cycle(1);
      });

      this.ccEls.dayNight?.addEventListener("click", () => {
        this.ccApp.toggleEarthMode();
      });

      this.ccEls.weather?.addEventListener("click", () => {
        this.ccApp.toggleWeatherMode();
      });

      this.ccEls.background?.addEventListener("click", () => {
        this.ccApp.toggleBackgroundMode();
      });

      document.addEventListener("keydown", (ccEvent) => {
        switch (ccEvent.key.toLowerCase()) {
          case "arrowleft":
            ccEvent.preventDefault();
            this.ccApp.cycle(-1);
            break;

          case "arrowright":
            ccEvent.preventDefault();
            this.ccApp.cycle(1);
            break;

          case "d":
            this.ccApp.toggleEarthMode();
            break;

          case "w":
            this.ccApp.toggleWeatherMode();
            break;

          case "b":
            this.ccApp.toggleBackgroundMode();
            break;
        }
      });

      this.bindTouchEvents();
    }

    bindTouchEvents() {
      if (!this.ccEls.canvas) {
        return;
      }

      this.ccEls.canvas.addEventListener(
        "touchstart",
        (ccEvent) => {
          const ccTouch = ccEvent.changedTouches[0];

          this.ccTouchStartX = ccTouch.clientX;
          this.ccTouchStartY = ccTouch.clientY;
        },
        { passive: true }
      );

      this.ccEls.canvas.addEventListener(
        "touchend",
        (ccEvent) => {
          const ccNow = performance.now();

          if (ccNow - this.ccLastSwipe < 300) {
            return;
          }

          this.ccLastSwipe = ccNow;

          const ccTouch = ccEvent.changedTouches[0];

          this.ccTouchEndX = ccTouch.clientX;

          const ccDeltaX = this.ccTouchStartX - this.ccTouchEndX;
          const ccDeltaY = Math.abs(
            this.ccTouchStartY - ccTouch.clientY
          );

          // Ignore mostly vertical gestures.
          if (ccDeltaY > 80) {
            return;
          }

          // Swipe left.
          if (ccDeltaX > 50) {
            this.ccApp.cycle(1);
          }

          // Swipe right.
          if (ccDeltaX < -50) {
            this.ccApp.cycle(-1);
          }
        },
        { passive: true }
      );
    }

    updatePlanet(ccPlanet, ccIndex, ccTotal) {
      this.ccEls.name.textContent = ccPlanet.name;
      this.ccEls.description.textContent =
        ccPlanet.description;
      this.ccEls.type.textContent = ccPlanet.type;
      this.ccEls.atmosphere.textContent =
        ccPlanet.atmosphere;
      this.ccEls.visual.textContent = ccPlanet.visual;

      this.ccEls.label.textContent = ccPlanet.name;

      this.ccEls.counter.textContent =
        `${ccIndex + 1} / ${ccTotal}`;
    }

    updateModes(ccState) {
      this.ccEls.dayNight.textContent =
        `Earth: ${ccState.earthMode === "day" ? "Day" : "Night"}`;

      this.ccEls.weather.textContent =
        `Weather: ${
          ccState.weatherMode === "clear"
            ? "Clear"
            : "Cloudy"
        }`;

      this.ccEls.background.textContent =
        `Background: ${
          ccState.backgroundMode === "stars"
            ? "Stars"
            : "Milky Way"
        }`;
    }

    hideLoader() {
      this.ccEls.loader?.classList.add("cc-hidden");
    }
  }

  window.CCUIController = CCUIController;
})();