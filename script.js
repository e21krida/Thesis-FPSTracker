// ==UserScript==
// @name         FPS Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track FPS in web applications
// @include      http://localhost:5173/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function injectScript(content) {
        const script = document.createElement('script');
        script.textContent = content;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    injectScript(`
        const times = [];
        let fps;
        function Loop() {
            window.requestAnimationFrame(() => {
                const now = performance.now();
                while (times.length > 0 && times[0] <= now - 1000) {
                    times.shift();
                }
                times.push(now);
                fps = times.length;
                Loop();
            });
        }

        function getFPS() {
            return fps || 0;
        }

        Loop();
        window.fpsTrackerActive = true;
    `);

    window.addEventListener('logFPS', function(e) {
        console.log('FPS Log:', e.detail);
    });
})();