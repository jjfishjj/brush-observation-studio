const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const referenceCss = fs.readFileSync('styles-reference.css', 'utf8');
const dataSource = fs.readFileSync('data/dataset-summary.js', 'utf8');

for (const id of [
  'cameraStage', 'cameraVideo', 'cameraButton', 'dataset-reference', 'datasetStatus',
  'part1Images', 'part2Images', 'part1Classes', 'part2Classes', 'upperArch',
  'lowerArch', 'toothDetailTitle', 'toothPartComparison', 'privacy-banner', 'year',
  'label-audit', 'annotationSample', 'annotationFields', 'labelValidation', 'comparisonDelta'
]) {
  assert.ok(html.includes(`id="${id}"`), `index.html should contain #${id}`);
}
assert.match(html, /styles-reference\.css/);
assert.match(html, /不會上傳影像/);
assert.match(html, /不是 AI 檢查/);
assert.match(html, /目前沒有此效能數據/);
assert.match(html, /x_min = center_x/);
assert.doesNotMatch(html, /scoreValue|hotspotList|開始示範掃描|示範熱點/);
assert.match(js, /getUserMedia/);
assert.match(js, /track\.stop\(\)/);
assert.match(js, /function buildTeeth/);
assert.match(js, /function selectTooth/);
assert.match(js, /upper: \[5, 4, 3, 2, 1, 6, 7, 8, 9, 10\]/);
assert.match(js, /lower: \[20, 19, 18, 17, 16, 11, 12, 13, 14, 15\]/);
assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|FormData/);
assert.match(css, /@media\(max-width:560px\)/);
assert.match(referenceCss, /\.tooth-part-comparison/);
assert.match(referenceCss, /\.parts-comparison/);
assert.match(referenceCss, /\.audit-grid/);

const browser = { window: {} };
vm.runInNewContext(dataSource, browser, { timeout: 1000 });
const data = browser.window.DATASET_REFERENCE;
assert.ok(data, 'static dataset summary should initialize');
assert.equal(data.field_order.length, 6, 'label format should contain six fields');
assert.equal(Array.from(data.field_order).join(','), 'class_id,center_x,center_y,width,height,tooth_internal_id');
assert.equal(data.annotation_sample.raw_line.trim().split(/\s+/).length, 6, 'sample row should have six values');
assert.equal(data.annotation_sample.overlay_verified, true, 'sample box should be visually checked against its paired image');
assert.equal(data.tooth_categories.filter((c) => /^\d{2}$/.test(c.fdi)).length, 20, 'must include 20 mapped teeth');
assert.equal(data.tooth_categories.find((c) => c.internal_id === 14).fdi, '34', 'internal tooth ID 14 must map to FDI 34');
assert.equal(data.tooth_categories.find((c) => c.internal_id === 21).fdi, 'brace', 'internal ID 21 must not appear as a tooth');
assert.deepEqual(Object.keys(data.parts).sort(), ['part1', 'part2']);
for (const [name, part] of Object.entries(data.parts)) {
  const classTotal = Object.values(part.class_counts).reduce((sum, value) => sum + value, 0);
  assert.equal(classTotal, part.original_annotations, `${name} class totals should add up`);
  const splitTotals = Object.values(part.by_split).reduce((totals, entry) => ({
    images: totals.images + entry.images,
    annotations: totals.annotations + entry.annotations
  }), { images: 0, annotations: 0 });
  assert.equal(splitTotals.images, part.original_image_label_files, `${name} split images should add up`);
  assert.equal(splitTotals.annotations, part.original_annotations, `${name} split annotations should add up`);
  assert.equal(part.patient_split_overlap.length, 0, `${name} should keep patients in a single split`);
  assert.equal(part.coordinate_bbox_outside_0_1, 0, `${name} boxes should stay inside normalized image bounds`);
  assert.equal(part.rows_with_unexpected_column_count && Object.keys(part.rows_with_unexpected_column_count).length, 0);
  assert.equal(part.unpaired_original_image_label_files.length, 0, `${name} original labels should pair with split rows`);
}
assert.match(data.class_semantics_note, /Raw class IDs|raw class|原始 class/i);
assert.equal(data.parts.part1.original_image_label_files - data.parts.part2.original_image_label_files, 9, 'Part 1 should have 9 more original images');
assert.equal(data.parts.part1.original_annotations - data.parts.part2.original_annotations, 548, 'Part 1 should have 548 more annotation boxes');
console.log('Smoke tests passed: camera remains local-only, no fake scores/hotspots, FDI map and AIRC-LABDEN data checks are consistent.');
