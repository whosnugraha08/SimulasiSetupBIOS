// ============================================
// SCORING, RESULTS & LEADERBOARD (Online Only)
// ============================================
import { state, formatTime } from './state.js';
import { SCORING } from './data.js';
import { validatePartitions } from './partisi.js';
import { saveScore, loadLeaderboard as loadLBFromSupabase } from './supabase.js';

// ============================================
// SCORING
// ============================================
export function calculateScore() {
  const details = [];
  let totalScore = 0;

  const ld = state.bios1.legacyDiskette === 'Disabled';
  details.push({ id: 'legacyDiskette', label: SCORING.legacyDiskette.label,
    correct: ld, points: ld ? SCORING.legacyDiskette.points : 0, maxPoints: SCORING.legacyDiskette.points,
    error: ld ? null : `Legacy Diskette A masih [${state.bios1.legacyDiskette}], seharusnya [Disabled].\n→ BIOS mencari boot dari floppy drive yang tidak ada.` });
  if (ld) totalScore += SCORING.legacyDiskette.points;

  const ide = state.bios1.ataIdeConfig === 'Enhanced';
  details.push({ id: 'ataIdeConfig', label: SCORING.ataIdeConfig.label,
    correct: ide, points: ide ? SCORING.ataIdeConfig.points : 0, maxPoints: SCORING.ataIdeConfig.points,
    error: ide ? null : `ATA/IDE Configuration masih [${state.bios1.ataIdeConfig}], seharusnya [Enhanced].\n→ HDD tidak terdeteksi optimal, instalasi Windows 10 bisa gagal.` });
  if (ide) totalScore += SCORING.ataIdeConfig.points;

  const usb = state.bios1.usb2Controller === 'Enabled';
  details.push({ id: 'usb2Controller', label: SCORING.usb2Controller.label,
    correct: usb, points: usb ? SCORING.usb2Controller.points : 0, maxPoints: SCORING.usb2Controller.points,
    error: usb ? null : `USB 2.0 Controller masih [Disabled], seharusnya [Enabled].\n→ USB Sandisk tidak terbaca, instalasi tidak bisa dimulai.` });
  if (usb) totalScore += SCORING.usb2Controller.points;

  const hdd = state.bios2.hddDrive1st === 'Sandisk';
  details.push({ id: 'hddPriority', label: SCORING.hddPriority.label,
    correct: hdd, points: hdd ? SCORING.hddPriority.points : 0, maxPoints: SCORING.hddPriority.points,
    error: hdd ? null : `Hard Disk Drives: 1st Drive masih [${state.bios2.hddDrive1st}], seharusnya [Sandisk].\n→ Komputer tidak bisa boot dari USB.` });
  if (hdd) totalScore += SCORING.hddPriority.points;

  const boot = state.bios2.bootDevice1st === 'Sandisk';
  details.push({ id: 'bootPriority', label: SCORING.bootPriority.label,
    correct: boot, points: boot ? SCORING.bootPriority.points : 0, maxPoints: SCORING.bootPriority.points,
    error: boot ? null : `Boot Device Priority: 1st Boot Device masih [${state.bios2.bootDevice1st}], seharusnya [Sandisk].\n→ Komputer boot dari HDD, instalasi Windows tidak bisa dimulai.` });
  if (boot) totalScore += SCORING.bootPriority.points;

  const partResult = validatePartitions();
  const partisiMaxPoints = SCORING.partisi.points;
  let partisiPoints = 0;
  if (partResult.totalChecks > 0) {
    partisiPoints = Math.round(partResult.correctCount * (partisiMaxPoints / partResult.totalChecks));
  }
  totalScore += partisiPoints;

  details.push({ id: 'partisi', label: SCORING.partisi.label,
    correct: partResult.allCorrect,
    partial: !partResult.allCorrect && partResult.correctCount > 0,
    points: partisiPoints, maxPoints: partisiMaxPoints,
    partisiResults: partResult.results,
    correctCount: partResult.correctCount, totalChecks: partResult.totalChecks });

  return { details, totalScore, perfect: totalScore === 100 };
}

// ============================================
// RESULTS
// ============================================
export function renderResults(onRestart, onLeaderboard) {
  const score = calculateScore();
  const container = document.getElementById('hasil-container');
  const timeUsed = state.elapsedSeconds;
  const titleClass = score.totalScore >= 70 ? '' : 'fail';
  const titleIcon = score.totalScore >= 70 ? '✅' : '❌';

  let html = `
    <div class="hasil-title ${titleClass}">${titleIcon} SIMULASI SELESAI</div>
    <div class="hasil-info">
      <div><span class="label">Nama       : </span><span class="value">${state.nama}</span></div>
      <div><span class="label">⏱ Waktu   : </span><span class="value">${Math.floor(timeUsed / 60)} menit ${timeUsed % 60} detik</span></div>
      <div><span class="label">📊 Skor    : </span><span class="value score" style="color:${score.totalScore >= 70 ? '#0f0' : '#ff4444'}">${score.totalScore} / 100</span></div>
      <div id="save-status" style="color:#888;font-size:.85em;margin-top:4px"></div>
    </div>
    <div class="hasil-detail"><h3>DETAIL PENGERJAAN:</h3>`;

  score.details.forEach(d => {
    let icon, cls;
    if (d.correct) { icon = '✅'; cls = 'correct'; }
    else if (d.partial) { icon = '🟡'; cls = 'partial'; }
    else { icon = '❌'; cls = 'wrong'; }
    let label = d.label;
    if (d.id === 'partisi' && !d.correct) label += ` (${d.correctCount} dari ${d.totalChecks} benar)`;
    html += `<div class="detail-item ${cls}"><span><span class="icon">${icon}</span> ${label}</span><span class="points">(+${d.points} poin)</span></div>`;
  });
  html += '</div>';

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

  html += `<div class="hasil-buttons">
    <button class="hasil-btn" id="btn-restart">🔁 Ulangi Simulasi</button>
    <button class="hasil-btn" id="btn-show-lb">🏆 Lihat Leaderboard</button>
  </div>`;

  container.innerHTML = html;

  // Save to Supabase (async)
  const statusEl = document.getElementById('save-status');
  statusEl.textContent = '☁️ Menyimpan ke server...';
  saveScore({
    nama: state.nama,
    skor: score.totalScore,
    mode: score.perfect ? 'perfect' : 'practice',
    waktuSelesai: state.elapsedSeconds,
    detail: {
      soalId: state.soalPartisi?.id,
      soalTeks: state.soalPartisi?.teks,
      items: score.details.map(d => ({ id: d.id, correct: d.correct, points: d.points })),
    },
  }).then(result => {
    if (!result) statusEl.textContent = '⚠️ Gagal simpan ke server';
    else if (result.skipped) statusEl.textContent = `☁️ Tidak diupdate — ${result.reason}`;
    else if (result.updated) statusEl.textContent = '☁️ Rekor diperbarui! ✓';
    else statusEl.textContent = '☁️ Tersimpan di server ✓';
  });

  document.getElementById('btn-restart').addEventListener('click', onRestart);
  document.getElementById('btn-show-lb').addEventListener('click', onLeaderboard);
}

// ============================================
// LEADERBOARD (Online Only)
// ============================================
export async function renderLeaderboard(onBack) {
  const container = document.getElementById('leaderboard-container');
  container.innerHTML = '<div class="lb-title">🏆 LEADERBOARD</div><div class="lb-empty">Memuat data dari server...</div>';

  let data = null;
  try { data = await loadLBFromSupabase(); } catch { /* ignore */ }

  if (!data) {
    container.innerHTML = `
      <div class="lb-title">🏆 LEADERBOARD</div>
      <div class="lb-empty">⚠️ Gagal memuat data. Periksa koneksi internet.</div>
      <div class="lb-buttons"><button class="lb-btn" id="btn-lb-back">Kembali</button></div>`;
    document.getElementById('btn-lb-back').addEventListener('click', onBack);
    return;
  }

  const perfectEntries = data.filter(e => e.skor === 100).map(mapEntry);
  const allEntries = data.map(mapEntry);

  let html = `
    <div class="lb-title">🏆 LEADERBOARD <span style="color:#0f0;font-size:.7em">☁️ Online</span></div>
    <div class="lb-tabs">
      <button class="lb-tab-btn active" data-tab="perfect">🥇 Tercepat Sempurna (100)</button>
      <button class="lb-tab-btn" data-tab="all">📊 Semua Skor</button>
    </div>
    <div id="lb-content-perfect">${renderLBTable(perfectEntries, true)}</div>
    <div id="lb-content-all" style="display:none">${renderLBTable(allEntries, false)}</div>
    <div class="lb-buttons"><button class="lb-btn" id="btn-lb-back">Kembali</button></div>`;

  container.innerHTML = html;

  container.querySelectorAll('.lb-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.lb-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('lb-content-perfect').style.display = tab === 'perfect' ? 'block' : 'none';
      document.getElementById('lb-content-all').style.display = tab === 'all' ? 'block' : 'none';
    });
  });

  document.getElementById('btn-lb-back').addEventListener('click', onBack);
}

function mapEntry(e) {
  return {
    nama: e.nama, skor: e.skor,
    waktu: formatTime(e.waktu_selesai || 0),
    soalTeks: e.detail?.soalTeks || '?',
    tanggal: e.created_at ? new Date(e.created_at).toLocaleDateString('id-ID') : '?',
  };
}

function renderLBTable(entries, showWaktu) {
  if (!entries || entries.length === 0) return '<div class="lb-empty">Belum ada entri.</div>';
  let html = `<table class="lb-table"><thead><tr>
    <th>#</th><th>Nama</th>${showWaktu ? '<th>Waktu</th>' : '<th>Skor</th><th>Waktu</th>'}<th>Soal</th><th>Tanggal</th>
  </tr></thead><tbody>`;
  entries.forEach((e, i) => {
    const rc = i < 3 ? `rank-${i + 1}` : '';
    html += `<tr class="${rc}"><td>${i + 1}</td><td>${e.nama}</td>
      ${showWaktu ? `<td>${e.waktu}</td>` : `<td>${e.skor}/100</td><td>${e.waktu}</td>`}
      <td>${e.soalTeks}</td><td>${e.tanggal}</td></tr>`;
  });
  return html + '</tbody></table>';
}
