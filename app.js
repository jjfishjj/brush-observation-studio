(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const stage = $('#cameraStage');
  const video = $('#cameraVideo');
  const cameraButton = $('#cameraButton');
  const cameraLabel = cameraButton.querySelector('span');
  const scanButton = $('#scanButton');
  const cameraMessage = $('#cameraMessage');
  const cameraHint = $('#cameraHint');
  const scanSuccess = $('#scanSuccess');
  const toast = $('#toast');
  const videoContext = $('#captureCanvas').getContext('2d');
  let stream = null;
  let timer = null;
  let scanNumber = 1;
  let toastTimer = null;
  const toothLabels = [
    '左上後排臼齒','左上臼齒外側','左上犬齒旁','上排左門牙','上排右門牙','右上犬齒旁','右上臼齒外側','右上後排臼齒',
    '左下後排臼齒','左下臼齒內側','左下犬齒旁','下排左門牙','下排右門牙','右下犬齒旁','右下臼齒內側','右下後排臼齒'
  ];
  const hotspots = [
    { tooth: 15, title: '右下後排咬合面', sub: '可多停留幾秒', percent: 74, level: 'hot' },
    { tooth: 4, title: '上排門牙內側', sub: '記得由牙齦往外刷', percent: 61, level: 'attention' },
    { tooth: 0, title: '左上臼齒外側', sub: '可用小幅度輕刷', percent: 53, level: 'attention' }
  ];

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function showCameraMessage(message) {
    cameraMessage.textContent = message;
    cameraMessage.classList.add('show');
    window.setTimeout(() => cameraMessage.classList.remove('show'), 4200);
  }

  async function toggleCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      video.srcObject = null;
      stage.classList.remove('has-video', 'is-captured');
      $('#captureCanvas').hidden = true;
      cameraLabel.textContent = '開啟鏡頭';
      scanButton.querySelectorAll('span')[1].textContent = '開始示範掃描';
      cameraHint.textContent = '鏡頭已關閉；可以再次開啟，或直接體驗示範掃描';
      cameraButton.setAttribute('aria-pressed', 'false');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraMessage('此瀏覽器目前無法開啟鏡頭。你仍可直接體驗示範掃描。');
      return;
    }
    cameraButton.disabled = true;
    cameraLabel.textContent = '等待權限…';
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      video.srcObject = stream;
      await video.play();
      stage.classList.remove('is-captured');
      $('#captureCanvas').hidden = true;
      stage.classList.add('has-video');
      cameraLabel.textContent = '關閉鏡頭';
      scanButton.querySelectorAll('span')[1].textContent = '定格快照並查看示範報告';
      cameraHint.textContent = '鏡頭只在本機預覽；本示範的熱點不會分析畫面';
      cameraButton.setAttribute('aria-pressed', 'true');
      showToast('鏡頭已開啟，畫面只在你的裝置上預覽');
    } catch (error) {
      const messages = {
        NotAllowedError: '沒有取得鏡頭權限。請在瀏覽器允許使用鏡頭，或直接體驗示範掃描。',
        NotFoundError: '找不到可用鏡頭。你仍可直接體驗示範掃描。',
        NotReadableError: '鏡頭可能正被其他應用程式使用，請關閉後再試。'
      };
      showCameraMessage(messages[error.name] || '鏡頭目前無法使用。你仍可直接體驗示範掃描。');
      cameraHint.textContent = '鏡頭未開啟；可直接體驗示範掃描';
      cameraLabel.textContent = '開啟鏡頭';
      stream = null;
    } finally {
      cameraButton.disabled = false;
    }
  }

  function updateResult() {
    const score = [78, 83, 72, 87, 76][(scanNumber - 1) % 5];
    const scoreElement = $('#scoreValue');
    scoreElement.textContent = score;
    $('#scoreRing').setAttribute('aria-label', `示範清潔觀察分數 ${score} 分`);
    $('#scoreMeter').style.width = `${score}%`;
    $('#ringCircle').style.strokeDashoffset = `${195 - (195 * score / 100)}`;
    $('#scoreAdvice').textContent = score >= 82
      ? '整體狀況不錯！保持輕柔、分區清潔，也別忘了牙縫。'
      : '整體不錯！記得讓牙刷多停留在後排牙齒的內側。';
    $('#scanCount').textContent = String(scanNumber).padStart(2, '0');
    scanSuccess.classList.add('show');
    window.setTimeout(() => scanSuccess.classList.remove('show'), 1800);
    scanNumber += 1;
  }

  function runDemoScan() {
    if (scanButton.disabled) return;
    scanButton.disabled = true;
    scanSuccess.classList.remove('show');
    stage.classList.add('scanning');
    cameraHint.textContent = '示範流程進行中……目前的熱點由預設資料呈現';
    const label = scanButton.querySelectorAll('span')[1];
    label.textContent = '示範觀察中…';
    if (stream && video.videoWidth) {
      const canvas = $('#captureCanvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      videoContext.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.hidden = false;
      stage.classList.add('is-captured');
      // Freeze the frame locally; the demo does not upload or analyze it.
    }
    timer = window.setTimeout(() => {
      updateResult();
      stage.classList.remove('scanning');
      cameraHint.textContent = '示範報告已更新；結果為預設模擬資料，並非影像辨識';
      label.textContent = '再次示範掃描';
      scanButton.disabled = false;
      showToast('示範報告已更新，分數與熱點都是預設模擬資料');
    }, 1250);
  }

  function selectTooth(index) {
    const allTeeth = document.querySelectorAll('.tooth');
    allTeeth.forEach((tooth) => {
      const selected = Number(tooth.dataset.tooth) === index;
      tooth.classList.toggle('selected', selected);
      tooth.setAttribute('aria-pressed', String(selected));
    });
    const hit = hotspots.find((spot) => spot.tooth === index);
    const text = hit
      ? `已選取：${hit.title}・示範提醒：${hit.sub}。`
      : `已選取：${toothLabels[index] || '齒列區域'}・示範提醒：刷毛輕放，分區慢慢刷。`;
    $('#toothDetailText').textContent = text;
    document.querySelectorAll('.hotspot-item').forEach((item) => item.classList.toggle('selected', Number(item.dataset.tooth) === index));
  }

  function buildTeeth() {
    const upper = $('#upperArch');
    const lower = $('#lowerArch');
    // Eight teeth per arch; buttons stay keyboard-accessible and announce their region.
    for (let i = 0; i < 8; i += 1) {
      const upperIndex = i;
      const lowerIndex = i + 8;
      [upperIndex, lowerIndex].forEach((index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tooth';
        button.dataset.tooth = String(index);
        button.setAttribute('aria-label', `${toothLabels[index]}，查看示範提醒`);
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>`;
        const hotspot = hotspots.find((spot) => spot.tooth === index);
        if (hotspot) button.classList.add(hotspot.level);
        else if ([0, 3, 6, 8, 12, 15].includes(index)) button.classList.add('attention');
        button.addEventListener('click', () => selectTooth(index));
        (index < 8 ? upper : lower).appendChild(button);
      });
    }
  }

  function setupHotspots() {
    document.querySelectorAll('.hotspot-item').forEach((item) => {
      item.addEventListener('click', () => {
        selectTooth(Number(item.dataset.tooth));
        const tooth = document.querySelector(`.tooth[data-tooth="${item.dataset.tooth}"]`);
        tooth?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  cameraButton.addEventListener('click', toggleCamera);
  scanButton.addEventListener('click', runDemoScan);
  buildTeeth();
  setupHotspots();
  selectTooth(15);
  $('#year').textContent = new Date().getFullYear();
  window.addEventListener('pagehide', () => {
    window.clearTimeout(timer);
    if (stream) stream.getTracks().forEach((track) => track.stop());
  });
})();
