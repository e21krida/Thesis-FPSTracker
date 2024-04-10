// ==UserScript==
// @name         FPS Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @include      http://localhost:5173/*
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
        const fpsData = [];
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

        function addFPSData(name) {
            fpsData.push({ name: name, value: getFPS() });
        }

        window.addEventListener('logFPS', function(e) {
            addFPSData(e.detail.name);
        });

        Loop();
        window.fpsTrackerActive = true;

        setTimeout(() => {
            window.fpsTrackerActive = false;
            const resultsJSON = JSON.stringify(fpsData, null, 2);
            const blob = new Blob([resultsJSON], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'results.json';
            downloadLink.textContent = 'Download Results';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }, 10000); // 30 seconds
    `);
})();