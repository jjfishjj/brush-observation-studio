# 齒間日常｜刷牙觀察室

A small, static Traditional Chinese prototype inspired by the user-provided Plaque Scout Smile Guide. It runs on GitHub Pages without a server or database.

## What works

- Optional local camera preview using the browser's `getUserMedia` permission.
- A local snapshot freeze and an interactive demo report that updates the score and scan count.
- Clickable tooth-map regions and linked hotspot cards.
- Responsive desktop and mobile layouts.
- Camera tracks are stopped when the camera is toggled off or the page is left.

## Important limitation

This is a product-flow prototype, not a plaque detector. The displayed scores, hotspot percentages, labels, and scan results are sample values; the camera frame is not sent to a server and is not analyzed. It must not be used to diagnose oral health or replace a dentist's advice.

## Run locally

Open `index.html` directly for the non-camera demo. Camera access requires a secure origin (`https://` or `localhost`) and the user's browser permission. One option is:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080` from the project directory.

## Checks

```sh
node --check app.js
node tests/smoke.js
```

## GitHub Pages

Publish from the `main` branch and the repository root (`/`). Once Pages is enabled with that source, every push to `main` updates the site automatically.
