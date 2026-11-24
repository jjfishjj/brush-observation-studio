(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const summary = window.DATASET_REFERENCE;
  const cameraStage = $('#cameraStage');
  const video = $('#cameraVideo');
  const cameraButton = $('#cameraButton');
  const cameraLabel = cameraButton.querySelector('span');
  const cameraHint = $('#cameraHint');
  const cameraMessage = $('#cameraMessage');
  const toast = $('#toast');
  let stream = null;
  let toastTimer = null;
  let messageTimer = null;

  const toothNames = {
    '11': '右上中門牙', '12': '右上側門牙', '13': '右上犬齒', '14': '右上第一小臼齒', '15': '右上第二小臼齒',
    '21': '左上中門牙', '22': '左上側門牙', '23': '左上犬齒', '24': '左上第一小臼齒', '25': '左上第二小臼齒',
    '31': '左下中門牙', '32': '左下側門牙', '33': '左下犬齒', '34': '左下第一小臼齒', '35': '左下第二小臼齒',
    '41': '右下中門牙', '42': '右下側門牙', '43': '右下犬齒', '44': '右下第一小臼齒', '45': '右下第二小臼齒'
  };
  // Front-facing mouth map: the patient's right side appears on the viewer's left.
  const archOrder = {
    upper: [5, 4, 3, 2, 1, 6, 7, 8, 9, 10],
    lower: [20, 19, 18, 17, 16, 11, 12, 13, 14, 15]
  };
  const splitNames = { train: '訓練', validation: '驗證', test: '測試' };
  const partNames = { part1: 'Part 1', part2: 'Part 2' };

  function formatNumber(value) {
    return new Intl.NumberFormat('zh-TW').format(Number(value) || 0);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function showCameraMessage(message) {
    cameraMessage.textContent = message;
    cameraMessage.classList.add('show');
    window.clearTimeout(messageTimer);
    messageTimer = window.setTimeout(() => cameraMessage.classList.remove('show'), 4200);
  }

  async function toggleCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      video.srcObject = null;
      cameraStage.classList.remove('has-video');
      cameraLabel.textContent = '開啟鏡頭';
      cameraHint.textContent = '鏡頭已關閉；若有需要可再次開啟本機預覽';
      cameraButton.setAttribute('aria-pressed', 'false');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraMessage('此瀏覽器目前無法開啟鏡頭。資料集對比仍可直接查看。');
      return;
    }
    cameraButton.disabled = true;
    cameraLabel.textContent = '等待權限…';
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
      cameraStage.classList.add('has-video');
      cameraLabel.textContent = '關閉鏡頭';
      cameraHint.textContent = '僅本機預覽；本原型不會分析或傳送影像';
      cameraButton.setAttribute('aria-pressed', 'true');
      showToast('鏡頭已開啟，畫面只在你的裝置上預覽');
    } catch (error) {
      const messages = {
        NotAllowedError: '沒有取得鏡頭權限；你仍可直接查看公開資料集對比。',
        NotFoundError: '找不到可用鏡頭；你仍可直接查看公開資料集對比。',
        NotReadableError: '鏡頭可能正被其他應用程式使用，請關閉後再試。'
      };
      showCameraMessage(messages[error.name] || '鏡頭目前無法使用；資料集對比仍可查看。');
      cameraHint.textContent = '鏡頭未開啟；公開資料集對比不需要鏡頭';
      cameraLabel.textContent = '開啟鏡頭';
      stream = null;
    } finally {
      cameraButton.disabled = false;
    }
  }

  function classEntries(counts) {
    return Object.entries(counts || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  }

  function appendClassBreakdown(container, part) {
    container.replaceChildren();
    if (!part || !part.original_annotations) {
      const empty = document.createElement('p');
      empty.className = 'empty-data';
      empty.textContent = '此 Part 的摘要尚未提供';
      container.append(empty);
      return;
    }
    const total = part.original_annotations;
    classEntries(part.class_counts).forEach(([classId, count]) => {
      const row = document.createElement('div');
      row.className = 'class-row';
      const label = document.createElement('span');
      label.className = 'class-row-label';
      label.textContent = `class ${classId}`;
      const bar = document.createElement('span');
      bar.className = 'class-bar';
      const fill = document.createElement('i');
      fill.style.width = `${Math.max(0, Math.min(100, (Number(count) / total) * 100))}%`;
      fill.setAttribute('aria-hidden', 'true');
      bar.append(fill);
      const value = document.createElement('strong');
      value.className = 'class-row-value';
      value.textContent = `${formatNumber(count)} · ${(Number(count) / total * 100).toFixed(1)}%`;
      row.append(label, bar, value);
      container.append(row);
    });
  }

  function appendSplitSummary(container, part) {
    container.replaceChildren();
    const title = document.createElement('div');
    title.className = 'split-summary-title';
    title.textContent = '原圖患者切分';
    container.append(title);
    if (!part || !part.by_split) {
      const empty = document.createElement('p');
      empty.className = 'empty-data';
      empty.textContent = '尚無切分統計';
      container.append(empty);
      return;
    }
    ['train', 'validation', 'test'].forEach((split) => {
      const entry = part.by_split[split];
      if (!entry) return;
      const row = document.createElement('div');
      row.className = 'split-row';
      const label = document.createElement('span');
      label.textContent = splitNames[split] || split;
      const value = document.createElement('strong');
      value.textContent = `${formatNumber(entry.patients)} 人 · ${formatNumber(entry.images)} 張 · ${formatNumber(entry.annotations)} 框`;
      row.append(label, value);
      container.append(row);
    });
    if (Array.isArray(part.patient_split_overlap) && part.patient_split_overlap.length) {
      const warning = document.createElement('p');
      warning.className = 'split-warning';
      warning.textContent = '注意：來源切分中有患者跨集合。';
      container.append(warning);
    }
  }

  function renderPart(key) {
    const part = summary?.parts?.[key];
    const prefix = key === 'part1' ? 'part1' : 'part2';
    $(`#${prefix}Images`).textContent = part ? formatNumber(part.original_image_label_files) : '—';
    $(`#${prefix}Labels`).textContent = part ? formatNumber(part.original_annotations) : '—';
    appendClassBreakdown($(`#${prefix}Classes`), part);
    appendSplitSummary($(`#${prefix}Splits`), part);
  }

  function renderDatasetSummary() {
    const status = $('#datasetStatus');
    if (!summary || !summary.parts) {
      status.textContent = '資料摘要未載入。請以本機伺服器開啟此頁並確認 data/dataset-summary.js 存在。';
      status.classList.add('is-warning');
      renderPart('part1');
      renderPart('part2');
      return;
    }
    renderPart('part1');
    renderPart('part2');
    const available = Object.keys(summary.parts).filter((key) => summary.parts[key]).length;
    status.textContent = available === 2
      ? '兩部分皆已完成原圖標註統計；增強與雜訊影像不納入此對比。'
      : '目前僅有一部分的統計資料；另一部分尚未加入。';
    if (summary.class_semantics_note) $('#dataMethodNote').textContent = `標註欄位：${summary.field_order.join(' · ')}。${summary.coordinate_format} ${summary.class_semantics_note}`;
    renderComparisonDelta();
    renderLabelAudit();
  }

  function renderComparisonDelta() {
    const container = $('#comparisonDelta');
    if (!container) return;
    container.replaceChildren();
    const part1 = summary?.parts?.part1;
    const part2 = summary?.parts?.part2;
    const heading = document.createElement('span');
    heading.className = 'delta-heading';
    heading.textContent = 'Part 1 與 Part 2 的資料量差異';
    container.append(heading);
    if (!part1 || !part2) {
      const missing = document.createElement('span');
      missing.className = 'delta-values';
      missing.textContent = '尚無完整對照資料';
      container.append(missing);
      return;
    }
    const imageDelta = Number(part1.original_image_label_files) - Number(part2.original_image_label_files);
    const boxDelta = Number(part1.original_annotations) - Number(part2.original_annotations);
    const values = document.createElement('div');
    values.className = 'delta-values';
    [
      ['原圖', imageDelta],
      ['標註框', boxDelta]
    ].forEach(([label, delta]) => {
      const item = document.createElement('span');
      item.className = 'delta-stat';
      const name = document.createElement('small');
      name.textContent = label;
      const count = document.createElement('strong');
      count.textContent = delta === 0
        ? '相同'
        : `Part ${delta > 0 ? '1' : '2'} +${formatNumber(Math.abs(delta))}`;
      item.append(name, count);
      values.append(item);
    });
    const note = document.createElement('small');
    note.textContent = '以未加增強／雜訊後綴的原圖標註統計；數量差異不是偵測準確率。';
    container.append(values, note);
  }

  function renderLabelAudit() {
    const sample = summary?.annotation_sample;
    const sampleLine = $('#annotationSample');
    const samplePart = $('#samplePart');
    const fields = $('#annotationFields');
    const checks = $('#labelValidation');
    if (!sampleLine || !samplePart || !fields || !checks) return;
    fields.replaceChildren();
    checks.replaceChildren();
    if (!sample || !summary?.field_order) {
      samplePart.textContent = 'TXT 抽樣列';
      sampleLine.textContent = '摘要資料未載入';
      return;
    }
    samplePart.textContent = `${sample.part || '資料集'} 抽樣 TXT 列`;
    sampleLine.textContent = sample.raw_line || '';
    const values = String(sample.raw_line || '').trim().split(/\s+/);
    const labels = {
      class_id: 'class ID', center_x: 'center_x', center_y: 'center_y',
      width: 'width', height: 'height', tooth_internal_id: '牙位內部 ID'
    };
    summary.field_order.forEach((key, index) => {
      const item = document.createElement('div');
      item.className = 'field-item';
      const label = document.createElement('span');
      label.textContent = labels[key] || key;
      const value = document.createElement('strong');
      value.textContent = values[index] ?? '—';
      item.append(label, value);
      if (key === 'tooth_internal_id') {
        const category = summary.tooth_categories?.find((entry) => Number(entry.internal_id) === Number(values[index]));
        const mapped = document.createElement('small');
        mapped.textContent = category?.fdi ? `對應 FDI ${category.fdi}` : '非牙位或未對照';
        item.append(mapped);
      } else if (key === 'class_id') {
        const raw = document.createElement('small');
        raw.textContent = '原始值；語義未定';
        item.append(raw);
      } else if (['center_x', 'center_y', 'width', 'height'].includes(key)) {
        const unit = document.createElement('small');
        unit.textContent = '0–1 正規化';
        item.append(unit);
      }
      fields.append(item);
    });

    const parts = Object.values(summary.parts || {});
    const noUnexpectedColumns = parts.length === 2 && parts.every((part) => Object.keys(part.rows_with_unexpected_column_count || {}).length === 0);
    const allBoxesInBounds = parts.length === 2 && parts.every((part) => Number(part.coordinate_bbox_outside_0_1) === 0);
    const noPatientOverlap = parts.length === 2 && parts.every((part) => Array.isArray(part.patient_split_overlap) && part.patient_split_overlap.length === 0);
    const toothMapping = summary.tooth_categories || [];
    const id21IsBrace = toothMapping.some((entry) => Number(entry.internal_id) === 21 && entry.fdi === 'brace');
    const messages = [
      `${summary.field_order.length} 欄順序：${summary.field_order.join(' → ')}${noUnexpectedColumns ? '；全量列數檢查一致' : '；檢查資料不完整'}`,
      `${summary.coordinate_format || '座標格式未提供'} 兩部分框超出影像邊界數：${parts.map((part) => Number(part.coordinate_bbox_outside_0_1)).join('／') || '—'}${allBoxesInBounds ? '（皆為 0）' : ''}`,
      `配對原圖尺寸 ${sample.paired_image_size || '已核對'}：${sample.overlay_verified ? '抽樣疊框位置目視相符' : '尚未記錄疊框核對'}`,
      `患者切分：${noPatientOverlap ? '兩部分均未發現患者跨 train／validation／test 集合' : '切分檢查資料不完整'}`,
      `牙位 mapping：${summary.label_validation?.mapping_identical_across_parts ? '兩部分相同，ID 1–20 對應 FDI 11–15、21–25、31–35、41–45' : '請檢查 mapping'}；ID 21 ${id21IsBrace ? '是 brace，非牙位' : '尚未核實'}`
    ];
    messages.forEach((message) => {
      const item = document.createElement('li');
      item.textContent = message;
      checks.append(item);
    });
  }

  function buildToothButton(internalId, category) {
    const fdi = String(category.fdi || category.name || '');
    if (!toothNames[fdi]) return null;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tooth';
    button.dataset.toothId = String(internalId);
    button.dataset.fdi = fdi;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `FDI ${fdi} ${toothNames[fdi]}，資料集內部 ID ${internalId}。查看原始標註框數。`);
    const fdiLabel = document.createElement('span');
    fdiLabel.className = 'tooth-fdi';
    fdiLabel.textContent = fdi;
    const idLabel = document.createElement('small');
    idLabel.className = 'tooth-internal';
    idLabel.textContent = `ID ${internalId}`;
    button.append(fdiLabel, idLabel);
    button.addEventListener('click', () => selectTooth(internalId));
    return button;
  }

  function buildTeeth() {
    const upper = $('#upperArch');
    const lower = $('#lowerArch');
    upper.replaceChildren();
    lower.replaceChildren();
    const categories = summary?.tooth_categories || [];
    const byId = new Map(categories.map((category) => [Number(category.internal_id || category.id), category]));
    archOrder.upper.forEach((id) => {
      const button = buildToothButton(id, byId.get(id) || {});
      if (button) upper.append(button);
    });
    archOrder.lower.forEach((id) => {
      const button = buildToothButton(id, byId.get(id) || {});
      if (button) lower.append(button);
    });
  }

  function appendToothPart(container, key, toothId) {
    const part = summary?.parts?.[key];
    const counts = part?.by_tooth_id?.[String(toothId)] || {};
    const total = Object.values(counts).reduce((sum, count) => sum + Number(count), 0);
    const block = document.createElement('div');
    block.className = 'tooth-part-row';
    const name = document.createElement('strong');
    name.textContent = partNames[key];
    const details = document.createElement('span');
    if (!part) {
      details.textContent = '尚無摘要';
    } else if (!total) {
      details.textContent = '原圖中沒有此 ID 的標註框';
    } else {
      const classText = classEntries(counts).map(([classId, count]) => `class ${classId}: ${formatNumber(count)}`).join(' · ');
      details.textContent = `${formatNumber(total)} 框（${classText}）`;
    }
    block.append(name, details);
    container.append(block);
  }

  function selectTooth(internalId) {
    const id = Number(internalId);
    const button = document.querySelector(`.tooth[data-tooth-id="${id}"]`);
    if (!button) return;
    document.querySelectorAll('.tooth').forEach((tooth) => {
      const selected = Number(tooth.dataset.toothId) === id;
      tooth.classList.toggle('selected', selected);
      tooth.setAttribute('aria-pressed', String(selected));
    });
    const fdi = button.dataset.fdi;
    $('#toothDetailTitle').textContent = `FDI ${fdi} · ${toothNames[fdi]}`;
    $('#toothDetailNote').textContent = `資料集內部 ID ${id}`;
    const comparison = $('#toothPartComparison');
    comparison.replaceChildren();
    appendToothPart(comparison, 'part1', id);
    appendToothPart(comparison, 'part2', id);
  }

  cameraButton.addEventListener('click', toggleCamera);
  renderDatasetSummary();
  buildTeeth();
  const initialTooth = document.querySelector('.tooth[data-tooth-id="14"]') || document.querySelector('.tooth');
  if (initialTooth) selectTooth(initialTooth.dataset.toothId);
  $('#year').textContent = String(new Date().getFullYear());
  window.addEventListener('pagehide', () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    window.clearTimeout(toastTimer);
    window.clearTimeout(messageTimer);
  });
})();
