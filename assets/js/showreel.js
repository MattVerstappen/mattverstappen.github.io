/**
 * SHOWREEL INTERACTIONS (Matthew Derek Rall)
 * ------------------------------------------
 * - Custom overlay play button
 * - Keyboard controls: Space/K (play/pause), M (mute), F (fullscreen)
 * - Resume from last position (localStorage)
 * - Pause on tab hidden, respects prefers-reduced-motion
 * - Safe to include on any page (no-op if elements missing)
 */

(function () {
    'use strict';

    const video = document.getElementById('showreel');
    const playBtn = document.querySelector('.video-play');
    if (!video) return; // Nothing to do

    // Constants
    const STORAGE_KEY = 'showreel-last-time';
    const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ensure good defaults for mobile
    video.setAttribute('playsinline', ''); // iOS inline playback
    video.setAttribute('preload', 'metadata'); // quicker poster/length

    // ---- Overlay Play Button ----
    function showOverlay() {
        if (!playBtn) return;
        playBtn.style.opacity = '1';
        playBtn.style.pointerEvents = 'auto';
        playBtn.setAttribute('aria-hidden', 'false');
    }
    function hideOverlay() {
        if (!playBtn) return;
        playBtn.style.opacity = '0';
        playBtn.style.pointerEvents = 'none';
        playBtn.setAttribute('aria-hidden', 'true');
    }

    // ---- Play/Pause Toggle ----
    async function togglePlayPause() {
        if (video.paused) {
            // Respect reduced motion: don't auto-jump from 0 unless user pressed
            try {
                await video.play();
            } catch (err) {
                // Autoplay policy might block — keep overlay visible
                console.debug('Video play failed:', err);
                showOverlay();
            }
        } else {
            video.pause();
        }
    }

    // ---- Resume from last position ----
    function restoreTime() {
        try {
            const last = parseFloat(localStorage.getItem(STORAGE_KEY));
            if (Number.isFinite(last) && last > 0 && last < video.duration - 1) {
                video.currentTime = last;
            }
        } catch (e) {
            // ignore storage errors
        }
    }
    function persistTime() {
        try {
            // Save every few seconds to reduce write churn
            if (!video.paused && !video.seeking) {
                localStorage.setItem(STORAGE_KEY, String(video.currentTime));
            }
        } catch (e) { /* ignore */ }
    }

    // ---- Fullscreen helpers ----
    async function toggleFullscreen() {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await (video.requestFullscreen ? video.requestFullscreen() : video.parentElement.requestFullscreen());
            }
        } catch (e) {
            console.debug('Fullscreen toggle failed:', e);
        }
    }

    // ---- Event Wiring ----
    function init() {
        // Initial overlay state
        showOverlay();

        // Restore time when metadata is ready (duration known)
        video.addEventListener('loadedmetadata', restoreTime, { once: true });

        // Overlay button click
        if (playBtn) {
            playBtn.addEventListener('click', togglePlayPause);
        }

        // Keep overlay in sync
        video.addEventListener('play', hideOverlay);
        video.addEventListener('pause', showOverlay);
        video.addEventListener('ended', showOverlay);

        // Persist time periodically and when pausing
        let tick = 0;
        video.addEventListener('timeupdate', () => {
            // Save every ~3 seconds
            if (++tick % 3 === 0) persistTime();
        });
        video.addEventListener('pause', persistTime);
        window.addEventListener('beforeunload', persistTime);

        // Pause when tab not visible (avoid surprise audio)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !video.paused) video.pause();
        });

        // Keyboard controls (when video is focused)
        video.setAttribute('tabindex', '0'); // ensure focusable
        video.addEventListener('keydown', (e) => {
            const code = e.code || '';
            if (code === 'Space' || code === 'KeyK') {
                e.preventDefault();
                togglePlayPause();
            } else if (code === 'KeyM') {
                video.muted = !video.muted;
            } else if (code === 'KeyF') {
                toggleFullscreen();
            } else if (code === 'ArrowRight') {
                video.currentTime = Math.min(video.currentTime + 5, video.duration || Infinity);
            } else if (code === 'ArrowLeft') {
                video.currentTime = Math.max(video.currentTime - 5, 0);
            }
        });

        // If user prefers reduced motion, do nothing extra—only explicit user actions play.
        if (PREFERS_REDUCED_MOTION) {
            // No autoplay; overlay stays until user plays.
        }
    }

    // Init now that DOM is ready (script can be defer or at end of body)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
