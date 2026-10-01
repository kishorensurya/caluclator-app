# Calculator

A responsive, dependency-free calculator built with HTML, CSS, and JavaScript.

## Run

Open `index.html` in a browser for local use. No install or build step is required.

## Install on Android

The installable version must be hosted over HTTPS. Publish this folder to a static host such as GitHub Pages, then open its HTTPS URL in Chrome on Android and choose **Install app** or **Add to Home screen** from the menu. After the first online visit, the service worker caches the calculator for offline use.

Service workers do not run from `file://`, so Android installation and offline caching are unavailable when opening the HTML file directly.

## Controls

Use the on-screen keypad or your keyboard. Number keys enter digits; `+`, `-`, `*`, and `/` select operations; `Enter` or `=` calculates; `Backspace` deletes a digit; `Escape` clears; `%` applies percent.
