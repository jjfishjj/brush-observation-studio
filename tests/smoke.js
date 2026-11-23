const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

for (const id of [
  'cameraStage', 'cameraVideo', 'captureCanvas', 'cameraButton', 'scanButton',
  'scoreValue', 'scanCount', 'hotspotList', 'upperArch', 'lowerArch', 'toothDetail',
  'privacy-banner', 'year'
]) {
  assert.ok(html.includes(`id="${id}"`), `index.html should contain #${id}`);
}
assert.match(html, /不是醫療檢查|不能判斷牙菌斑/);
assert.match(html, /不會上傳/);
assert.match(js, /getUserMedia/);
assert.match(js, /track\.stop\(\)/);
assert.match(js, /function runDemoScan/);
assert.match(js, /function buildTeeth/);
assert.match(js, /function selectTooth/);
assert.match(js, /模擬資料/);
assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
assert.match(css, /@media\(max-width:560px\)/);
console.log('Smoke tests passed: camera flow, tooth map, demo disclosure, responsive layout, no image upload calls.');
