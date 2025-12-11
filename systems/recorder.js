let recorder = null, chunks = [], stream = null;
let detachAudio = null;
let proxyCanvas = null;
let proxyCtx = null;
let sourceCanvasRef = null;
let dataProvider = null;

const RECORD_W = 720;
const RECORD_H = 1280;

// Assets
const qrImg = new Image();
qrImg.crossOrigin = 'Anonymous';
qrImg.src = 'qr_code.png';

let pfpImg = new Image();
pfpImg.crossOrigin = 'Anonymous';
pfpImg.src = 'https://images.websim.com/avatar/default';
let pfpLoaded = false;

export function initRecorder() {
    try {
        const u = window.websim?.getUser?.() || window.websim?.getCurrentUser?.();
        if (u?.avatar_url) pfpImg.src = u.avatar_url;
        else if (u?.username) pfpImg.src = `https://images.websim.com/avatar/${u.username}`;
    } catch {}
    pfpImg.onload = () => { pfpLoaded = true; };
}

export function startRecording(sourceCanvas, getDataFn) {
    stopRecordingSync();
    sourceCanvasRef = sourceCanvas;
    dataProvider = getDataFn;

    if (!proxyCanvas) {
        proxyCanvas = document.createElement('canvas');
        proxyCanvas.width = RECORD_W;
        proxyCanvas.height = RECORD_H;
        proxyCtx = proxyCanvas.getContext('2d', { alpha: false });
    }

    import('./audio.js').then(({ attachRecordingDestination }) => {
        const proxyStream = proxyCanvas.captureStream(30);
        const { stream: audioStream, detach } = attachRecordingDestination();
        detachAudio = detach || null;
        
        const tracks = [...proxyStream.getVideoTracks()];
        if (audioStream) tracks.push(...audioStream.getAudioTracks());
        
        const combined = new MediaStream(tracks);
        chunks = [];
        
        const mimeTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
            ''
        ];
        const mimeType = mimeTypes.find(t => t && MediaRecorder.isTypeSupported?.(t)) || undefined;
        
        try {
            recorder = new MediaRecorder(combined, mimeType ? { mimeType } : undefined);
        } catch (e) {
            console.warn('Recorder init failed, trying fallback', e);
            try { recorder = new MediaRecorder(combined); } catch(e2) { console.error('Recorder fatal', e2); return; }
        }
        
        recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onerror = (e) => console.warn('Recorder error:', e);
        recorder.start(100); // reduced chunk interval
        stream = combined;
    });
}

export function tickRecorder() {
    if (!recorder || recorder.state !== 'recording' || !sourceCanvasRef || !proxyCtx) return;

    // 1. Draw Game (Center Crop for 9:16)
    const sw = sourceCanvasRef.width;
    const sh = sourceCanvasRef.height;
    const dAspect = RECORD_W / RECORD_H;
    const sAspect = sw / sh;
    
    let sx, sy, sWidth, sHeight;
    
    if (sAspect > dAspect) {
        // Source is wider -> Crop sides
        sHeight = sh;
        sWidth = sHeight * dAspect;
        sx = (sw - sWidth) / 2;
        sy = 0;
    } else {
        // Source is taller -> Crop top/bottom
        sWidth = sw;
        sHeight = sWidth / dAspect;
        sx = 0;
        sy = (sh - sHeight) / 2;
    }
    
    // Fill black first
    proxyCtx.fillStyle = '#000';
    proxyCtx.fillRect(0, 0, RECORD_W, RECORD_H);
    
    // Draw cropped game view
    proxyCtx.drawImage(sourceCanvasRef, sx, sy, sWidth, sHeight, 0, 0, RECORD_W, RECORD_H);
    
    // 2. Burn-in Overlays
    const score = dataProvider ? (dataProvider().score || 0) : 0;
    
    // Top Gradient for Text
    const grad = proxyCtx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, 'rgba(0,0,0,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    proxyCtx.fillStyle = grad;
    proxyCtx.fillRect(0,0, RECORD_W, 220);

    // Score Text
    proxyCtx.save();
    proxyCtx.font = 'bold 90px "Fredoka One", sans-serif';
    proxyCtx.fillStyle = 'white';
    proxyCtx.textAlign = 'center';
    proxyCtx.textBaseline = 'top';
    proxyCtx.shadowColor = 'black';
    proxyCtx.shadowBlur = 10;
    proxyCtx.shadowOffsetX = 4;
    proxyCtx.shadowOffsetY = 4;
    proxyCtx.fillText(score, RECORD_W / 2, 40);
    proxyCtx.restore();
    
    // Bottom Gradient
    const gradBot = proxyCtx.createLinearGradient(0, RECORD_H - 300, 0, RECORD_H);
    gradBot.addColorStop(0, 'rgba(0,0,0,0)');
    gradBot.addColorStop(1, 'rgba(0,0,0,0.9)');
    proxyCtx.fillStyle = gradBot;
    proxyCtx.fillRect(0, RECORD_H - 300, RECORD_W, 300);

    // QR Code (Bottom Right)
    const qrSize = 160;
    const padding = 40;
    if (qrImg.complete && qrImg.naturalWidth > 0) {
        // White bg for QR
        proxyCtx.fillStyle = 'rgba(255,255,255,0.9)';
        proxyCtx.beginPath();
        proxyCtx.roundRect(RECORD_W - qrSize - padding - 10, RECORD_H - qrSize - padding - 10, qrSize + 20, qrSize + 20, 10);
        proxyCtx.fill();
        proxyCtx.drawImage(qrImg, RECORD_W - qrSize - padding, RECORD_H - qrSize - padding, qrSize, qrSize);
        
        // Scan label
        proxyCtx.font = 'bold 20px "Fredoka One", sans-serif';
        proxyCtx.fillStyle = 'black';
        proxyCtx.textAlign = 'center';
        proxyCtx.fillText('SCAN TO PLAY', RECORD_W - qrSize/2 - padding, RECORD_H - padding - 4);
    }
    
    // PFP (Bottom Left)
    const pfpSize = 120;
    if (pfpImg.complete && pfpImg.naturalWidth > 0) {
        const px = padding;
        const py = RECORD_H - padding - pfpSize;
        
        proxyCtx.save();
        proxyCtx.beginPath();
        proxyCtx.arc(px + pfpSize/2, py + pfpSize/2, pfpSize/2, 0, Math.PI*2);
        proxyCtx.closePath();
        proxyCtx.clip();
        proxyCtx.drawImage(pfpImg, px, py, pfpSize, pfpSize);
        proxyCtx.restore();
        
        // Border
        proxyCtx.beginPath();
        proxyCtx.arc(px + pfpSize/2, py + pfpSize/2, pfpSize/2, 0, Math.PI*2);
        proxyCtx.lineWidth = 6;
        proxyCtx.strokeStyle = 'white';
        proxyCtx.stroke();
    }
}

function stopRecordingSync() {
  try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch {}
  try { stream?.getTracks?.().forEach(t => t.stop()); } catch {}
  try { detachAudio?.(); } catch {}
  recorder = null; stream = null; detachAudio = null;
}

export function stopRecording() {
  return new Promise((resolve) => {
    const rec = recorder;
    if (!rec) return resolve(null);
    const finish = () => {
      const blob = chunks.length ? new Blob(chunks, { type: 'video/webm' }) : null;
      chunks = [];
      try { stream?.getTracks?.().forEach(t => t.stop()); } catch {}
      try { detachAudio?.(); } catch {}
      recorder = null; stream = null; detachAudio = null;
      resolve(blob);
    };
    const onStop = () => { rec.removeEventListener('stop', onStop); finish(); };
    rec.addEventListener('stop', onStop);
    let safety = setTimeout(()=>{ try{ rec.removeEventListener('stop', onStop);}catch{} finish(); }, 2000);
    try { rec.stop(); } catch { clearTimeout(safety); finish(); }
  });
}