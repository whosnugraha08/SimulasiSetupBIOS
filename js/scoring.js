// ============================================
// SCORING, RESULTS & LEADERBOARD
// ============================================
import { state, formatTime } from './state.js';
import { SCORING } from './data.js';
import { validatePartitions } from './partisi.js';

// ============================================
// SCORING
// ============================================
export function calculateScore() {
  const details = [];
  let totalScore = 0;

  // 1. Legacy Diskette A
  const ld = state.bios1.legacyDiskette === 'Disabled';
  details.push({
    id: 'legacyDiskette', label: SCORING.legacyDiskette.label,
    correct: ld, points: ld ? SCORING.legacyDiskette.points : 0,
    maxPoints: SCORING.legacyDiskette.points,
    error: ld ? null : `Legacy Diskette A masih [${state.bios1.legacyDiskette}], seharusnya [Disabled].\n→ BIOS mencari boot dari floppy drive yang tidak ada.`,
  });
  if (ld) totalScore += SCORING.legacyDiskette.points;

  // 2. ATA/IDE Configuration
  const ide = state.bios1.ataIdeConfig === 'Enhanced';
  details.push({
    id: 'ataIdeConfig', label: SCORING.ataIdeConfig.label,
    correct: ide, points: ide ? SCORING.ataIdeConfig.points : 0,
    maxPoints: SCORING.ataIdeConfig.points,
    error: ide ? null : `ATA/IDE Configuration masih [${state.bios1.ataIdeConfig}], seharusnya [Enhanced].\n→ HDD tidak terdeteksi optimal, instalasi Windows 10 bisa gagal.`,
  });
  if (ide) totalScore += SCORING.ataIdeConfig.points;

  // 3. USB 2.0 Controller
  const usb = state.bios1.usb2Controller === 'Enabled';
  details.push({
    id: 'usb2Controller', label: SCORING.usb2Controller.label,
    correct: usb, points: usb ? SCORING.usb2Controller.points : 0,
    maxPoints: SCORING.usb2Controller.points,
    error: usb ? null : `USB 2.0 Controller masih [Disabled], seharusnya [Enabled].\n→ USB Sandisk tidak terbaca, instalasi tidak bisa dimulai.`,
  });
  if (usb) totalScore += SCORING.usb2Controller.points;

  // 4. HDD Priority
  const hdd = state.bios2.hddDrive1st === 'Sandisk';
  details.push({
    id: 'hddPriority', label: SCORING.hddPriority.label,
    correct: hdd, points: hdd ? SCORING.hddPriority.points : 0,
    maxPoints: SCORING.hddPriority.points,
    error: hdd ? null : `Hard Disk Drives: 1st Drive masih [${state.bios2.hddDrive1st}], seharusnya [Sandisk].\n→ Komputer tidak bisa boot dari USB.`,
  });
  if (hdd) totalScore += SCORING.hddPriority.points;

  // 5. Boot Device Priority
  const boot = state.bios2.bootDevice1st === 'Sandisk';
  details.push({
    id: 'bootPriority', label: SCORING.bootPriority.label,
    correct: boot, points: boot ? SCORING.bootPriority.points : 0,
    maxPoints: SCORING.bootPriority.points,
    error: boot ? null : `Boot Device Priority: 1st Boot Device masih [${state.bios2.bootDevice1st}], seharusnya [Sandisk].\n→ Komputer boot dari HDD, instalasi Windows tidak bisa dimulai.`,
  });
  if (boot) totalScore += SCORING.bootPriority.points;

  // 6. Partisi
  const partResult = validatePartitions();
  const partisiMaxPoints = SCORING.partisi.points;
  let partisiPoints = 0;
  if (partResult.totalChecks > 0) {
    const perCheck = partisiMaxPoints / partResult.totalChecks;
    partisiPoints = Math.round(partResult.correctCount * perCheck);
  }
  totalScore += partisiPoints;

  details.push({
    id: 'partisi', label: SCORING.partisi.label,
    correct: partResult.allCorrect,
    partial: !partResult.allCorrect && partResult.correctCount > 0,
    points: partisiPoints,
    maxPoints: partisiMaxPoints,
    partisiResults: partResult.results,
    correctCount: partResult.correctCount,
    totalChecks: partResult.totalChecks,
  });

  const perfect = totalScore === 100;
  return { details, totalScore, perfect };
}

// ============================================
// RESULTS RENDERING
// ============================================
export function renderResults(onRestart, onLeaderboard) {
  const score = calculateScore();
  const container = document.getElementById('hasil-container');
  const remaining = state.timeLimit - state.elapsedSeconds;
  const timeUsed = state.elapsedSeconds;
  const titleClass = score.totalScore >= 70 ? '' : 'fail';
  const titleIcon = score.totalScore >= 70 ? '✅' : '❌';

  let html = `
    <div class="hasil-title ${titleClass}">${titleIcon} SIMULASI SELESAI</div>
    <div class="hasil-info">
      <div><span class="label">Nama       : </span><span class="value">${state.nama}</span></div>
      <div><span class="label">⏱ Waktu   : </span><span class="value">${Math.floor(timeUsed / 60)} menit ${timeUsed % 60} detik</span></div>
      <div><span class="label">📊 Skor    : </span><span class="value score" style="color:${score.totalScore >= 70 ? '#0f0' : '#ff4444'}">${score.totalScore} / 100</span></div>
    </div>
    <div class="hasil-detail">
      <h3>DETAIL PENGERJAAN:</h3>
  `;

  score.details.forEach(d => {
    let icon, cls;
    if (d.correct) { icon = '✅'; cls = 'correct'; }
    else if (d.partial) { icon = '🟡'; cls = 'partial'; }
    else { icon = '❌'; cls = 'wrong'; }

    let label = d.label;
    if (d.id === 'partisi' && !d.correct) {
      label += ` (${d.correctCount} dari ${d.totalChecks} benar)`;
    }

    html += `
      <div class="detail-item ${cls}">
        <span><span class="icon">${icon}</span> ${label}</span>
        <span class="points">(+${d.points} poin)</span>
      </div>
    `;
  });
  html += '</div>';

  // Error details
  const errors = score.details.filter(d => !d.correct);
  if (errors.length > 0) {
    html += '<div class="hasil-errors"><h3>⚠️ CATATAN KESALAHAN:</h3>';
    errors.forEach(d => {
      if (d.error) {
        const lines = d.error.split('\n');
        html += `<div class="error-detail">❌ ${lines[0]}`;
        if (lines[1]) html += `<br><span class="consequence">${lines[1]}</span>`;
        html += '</div>';
      }
      if (d.partisiResults) {
        d.partisiResults.filter(r => !r.correct).forEach(r => {
          html += `<div class="error-detail">❌ Partisi ${r.message}</div>`;
        });
      }
    });
    html += '</div>';
  }

  html += `
    <div class="hasil-buttons">
      <button class="hasil-btn" id="btn-restart">🔁 Ulangi Simulasi</button>
      <button class="hasil-btn" id="btn-show-lb">🏆 Lihat Leaderboard</button>
    </div>
  `;

  container.innerHTML = html;

  // Save to leaderboard
  saveToLeaderboard(score);

  // Bind buttons
  document.getElementById('btn-restart').addEventListener('click', onRestart);
  document.getElementById('btn-show-lb').addEventListener('click', onLeaderboard);
}

// ============================================
// LEADERBOARD
// ============================================
const LB_KEY_PERFECT = 'biosSimLeaderboardPerfect';
const LB_KEY_PRACTICE = 'biosSimLeaderboardPractice';

function loadLeaderboard(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch { return []; }
}

function saveLeaderboard(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function saveToLeaderboard(score) {
  const entry = {
    nama: state.nama,
    waktuDetik: state.elapsedSeconds,
    waktu: formatTime(state.elapsedSeconds),
    skor: score.totalScore,
    soalId: state.soalPartisi?.id || '?',
    soalTeks: state.soalPartisi?.teks || '?',
    tanggal: new Date().toLocaleDateString('id-ID'),
  };

  if (score.perfect) {
    const lb = loadLeaderboard(LB_KEY_PERFECT);
    lb.push(entry);
    lb.sort((a, b) => a.waktuDetik - b.waktuDetik);
    saveLeaderboard(LB_KEY_PERFECT, lb.slice(0, 10));
  }

  // Always save to practice
  const lbP = loadLeaderboard(LB_KEY_PRACTICE);
  lbP.push(entry);
  lbP.sort((a, b) => b.skor - a.skor || a.waktuDetik - b.waktuDetik);
  saveLeaderboard(LB_KEY_PRACTICE, lbP.slice(0, 10));
}

export function renderLeaderboard(onBack) {
  const container = document.getElementById('leaderboard-container');
  const perfectLB = loadLeaderboard(LB_KEY_PERFECT);
  const practiceLB = loadLeaderboard(LB_KEY_PRACTICE);

  let html = `
    <div class="lb-title">🏆 LEADERBOARD</div>
    <div class="lb-tabs">
      <button class="lb-tab-btn active" data-tab="perfect">Tercepat Sempurna (Skor 100)</button>
      <button class="lb-tab-btn" data-tab="practice">Skor Latihan</button>
    </div>
    <div id="lb-content-perfect">
      ${renderLBTable(perfectLB, true)}
    </div>
    <div id="lb-content-practice" style="display:none">
      ${renderLBTable(practiceLB, false)}
    </div>
    <div class="lb-buttons">
      <button class="lb-btn" id="btn-lb-back">Kembali</button>
      <button class="lb-btn" id="btn-lb-reset">Reset Leaderboard</button>
    </div>
  `;

  container.innerHTML = html;

  // Tab switching
  container.querySelectorAll('.lb-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.lb-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('lb-content-perfect').style.display = tab === 'perfect' ? 'block' : 'none';
      document.getElementById('lb-content-practice').style.display = tab === 'practice' ? 'block' : 'none';
    });
  });

  document.getElementById('btn-lb-back').addEventListener('click', onBack);
  document.getElementById('btn-lb-reset').addEventListener('click', () => {
    if (confirm('Reset semua data leaderboard?')) {
      localStorage.removeItem(LB_KEY_PERFECT);
      localStorage.removeItem(LB_KEY_PRACTICE);
      renderLeaderboard(onBack);
    }
  });
}

function renderLBTable(entries, showWaktu) {
  if (entries.length === 0) {
    return '<div class="lb-empty">Belum ada entri leaderboard.</div>';
  }

  let html = `
    <table class="lb-table">
      <thead><tr>
        <th>#</th><th>Nama</th>${showWaktu ? '<th>Waktu</th>' : '<th>Skor</th><th>Waktu</th>'}<th>Soal</th><th>Tanggal</th>
      </tr></thead><tbody>
  `;

  entries.forEach((e, i) => {
    const rankClass = i < 3 ? `rank-${i + 1}` : '';
    html += `<tr class="${rankClass}">
      <td>${i + 1}</td>
      <td>${e.nama}</td>
      ${showWaktu ? `<td>${e.waktu}</td>` : `<td>${e.skor}/100</td><td>${e.waktu}</td>`}
      <td>${e.soalTeks || e.soalId}</td>
      <td>${e.tanggal}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  return html;
}
