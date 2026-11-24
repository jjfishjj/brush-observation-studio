# 齒間日常｜刷牙觀察室

A static Traditional Chinese prototype for looking at public AIRC-LABDEN annotation statistics and the dataset's 20-tooth FDI mapping. It runs on GitHub Pages without a server or database.

## What this prototype does

- Offers an optional local camera preview. The browser does not upload, freeze, or analyze camera images.
- Compares Part 1 and Part 2 raw class-ID distributions, original-image counts, and patient-level train/validation/test splits.
- Shows a real six-field TXT row, the field-by-field interpretation, normalized-coordinate formulas, and checks against paired images. It also reports the raw count difference between the two parts (Part 1: 9 more original images and 548 more region boxes).
- Shows all 20 teeth in the dataset mapping. Selecting a tooth compares the counts of its annotated peri-tooth region boxes in each part.
- Includes only label files whose names have the base patient-date-view form. Any suffix after the view is excluded as an augmentation or noise variant so transformed copies do not dominate the comparison.

`data/dataset-summary.js` contains derived aggregate counts and the mapping from the official `teeth_position_mapping.json`. No source photographs or individual clinical records are included. Dataset row fields were verified as `class_id center_x center_y width height tooth_internal_id`; the four coordinates lie in [0,1] and the center/width/height conversion visually aligns with the paired source image. The displayed class IDs are kept raw because the article and dataset landing-page descriptions differ on their clinical semantics.

## Important limitations

This is not an AI plaque detector and does not produce a brushing score, hotspot, clinical assessment, or diagnosis. Per-tooth numbers are counts of repeated annotation boxes across source images, not counts of unique teeth or a person's oral-health status. The dataset is specific to patients with fixed labial orthodontic appliances; its distribution is not an estimate for the general population. Label-format and coordinate checks reduce parsing/mapping errors, but they do not measure or improve model accuracy by themselves. No detector has been trained; future performance claims require a trained model evaluated on held-out patient-level test data.

## Data sources and attribution

- [AIRC-LABDEN Part 1](https://data.mendeley.com/datasets/g8yhdvgjy2/3)
- [AIRC-LABDEN Part 2](https://data.mendeley.com/datasets/xjs4bfgzj5/3)
- [Dataset descriptor article](https://www.sciencedirect.com/science/article/pii/S2352340926003859)

Dataset authors: Chi Nguyen Anh, Hai Pham Nhu, Lam Vu Ngoc, Hoang Bui Duy, Duc Nguyen Minh, and Quan Phung Hong. The Mendeley records state CC BY 4.0; this prototype redistributes only derived aggregate annotation counts, retains raw class IDs, and excludes transformed image copies. See the linked source records for the full citation and license terms.

## Run locally

From the project directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Camera access requires a secure origin (`https://` or `localhost`) and the browser's permission.

## Checks

```sh
node --check app.js
node tests/smoke.js
```

## Future simulation direction

OpenUSD with Omniverse Replicator could later generate synthetic mouth-camera scenes with varied lighting, glare, blur, view angle, occlusion, braces, and materials, plus ground-truth labels. Those images would be augmentation candidates only; evaluation still needs patient-level held-out real images. Nemotron could be an optional natural-language scenario-control or explanation layer, not the dental region detector. This environment has no NVIDIA GPU, Omniverse Kit, or OpenUSD Python runtime, so no such simulation has been run here.

## GitHub Pages

The repository is configured to publish from `main`, so pushing updates can change the public site. This local prototype has not been pushed or deployed. Review the exact changes first; do not publish them without explicit approval.
