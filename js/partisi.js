// ============================================
// PARTITION UI & VALIDATION
// ============================================
import { state, partisiNav } from './state.js';
import { TOTAL_DISK_GB, SYSTEM_RESERVED_MB, TOLERANCE_GB } from './data.js';

const SYSTEM_RESERVED_GB = SYSTEM_RESERVED_MB / 1024;

// ============================================
// PARTITION TABLE DATA
// ============================================
function getPartitionRows() {
  const rows = [];
  let usedGB = 0;

  if (state.partisiDibuat.length > 0) {
    rows.push({
      name: 'Drive 0 Partition 1: System Reserved',
      totalSize: `${SYSTEM_RESERVED_MB} MB`,
      freeSpace: `${SYSTEM_RESERVED_MB} MB`,
      type: 'System',
      isSystemReserved: true,
      sizeGB: SYSTEM_RESERVED_GB,
    });
    usedGB += SYSTEM_RESERVED_GB;
  }

  state.partisiDibuat.forEach((p, i) => {
    const partNum = i + 2;
    rows.push({
      name: `Drive 0 Partition ${partNum}: ${p.label}`,
      totalSize: `${p.sizeGB.toFixed(1)} GB`,
      freeSpace: `${p.sizeGB.toFixed(1)} GB`,
      type: 'Primary',
      isUserPartition: true,
      index: i,
      sizeGB: p.sizeGB,
      formatted: p.formatted || false,
    });
    usedGB += p.sizeGB;
  });

  const remaining = TOTAL_DISK_GB - usedGB;
  if (remaining > 0.1) {
    rows.push({
      name: 'Drive 0 Unallocated Space',
      totalSize: `${remaining.toFixed(1)} GB`,
      freeSpace: `${remaining.toFixed(1)} GB`,
      type: '',
      isUnallocated: true,
      sizeGB: remaining,
    });
  }

  return rows;
}

function getUsedGB() {
  let used = 0;
  if (state.partisiDibuat.length > 0) used += SYSTEM_RESERVED_GB;
  state.partisiDibuat.forEach(p => { used += p.sizeGB; });
  return used;
}

function getRemainingGB() {
  return TOTAL_DISK_GB - getUsedGB();
}

// ============================================
// RENDERING
// ============================================
export function renderPartisi() {
  renderSoalBox();
  renderPartitionTable();
  renderPartitionButtons();
  renderSizeDialog();
  renderConfirmDialog();
}

function renderSoalBox() {
  const soal = state.soalPartisi;
  if (!soal) return;
  const box = document.getElementById('soal-box');
  box.innerHTML = `
    <div class="soal-title">📋 SOAL PARTISI</div>
    <div>Bagi HDD MidasForce SSD 256 (±${TOTAL_DISK_GB} GB tersedia) sebagai berikut:</div>
    <div style="margin: 8px 0; padding-left: 10px;">
      ${soal.partisi.map(p => {
        if (p.tipe === 'sisa') return `• Drive ${p.label} = Sisa (semua ruang yang tersisa)`;
        return `• Drive ${p.label} = ${p.target} GB`;
      }).join('<br>')}
      ${soal.hasUnallocated ? `<br>• Unallocated: ${soal.unallocatedTarget ? soal.unallocatedTarget + ' GB wajib ada' : 'Sisa'}` : ''}
    </div>
    <div class="soal-warning">⚠ Perhatikan urutan soal! Toleransi: ±${TOLERANCE_GB} GB per partisi</div>
  `;
}

function renderPartitionTable() {
  const rows = getPartitionRows();
  const tableEl = document.getElementById('partisi-table');
  if (partisiNav.selectedRow >= rows.length) partisiNav.selectedRow = Math.max(0, rows.length - 1);

  let html = `
    <div class="partisi-row header">
      <span class="col-name">Name</span>
      <span class="col-size">Total Size</span>
      <span class="col-free">Free Space</span>
      <span class="col-type">Type</span>
    </div>
  `;
  rows.forEach((row, i) => {
    const selected = (partisiNav.focusArea === 'table' && i === partisiNav.selectedRow) ? 'selected' : '';
    html += `
      <div class="partisi-row ${selected}" data-row="${i}">
        <span class="col-name">${row.name}</span>
        <span class="col-size">${row.totalSize}</span>
        <span class="col-free">${row.freeSpace}</span>
        <span class="col-type">${row.type}</span>
      </div>`;
  });
  tableEl.innerHTML = html;
}

function renderPartitionButtons() {
  const btnContainer = document.getElementById('partisi-buttons');
  const rows = getPartitionRows();
  const selectedRow = rows[partisiNav.selectedRow];

  // Can only create new partition from Unallocated Space
  const canNew = selectedRow?.isUnallocated && getRemainingGB() > 0.5;

  // Can only delete user partitions — must delete from bottom (last user partition first)
  const isLastUserPartition = selectedRow?.isUserPartition &&
    selectedRow.index === state.partisiDibuat.length - 1;
  const canDelete = isLastUserPartition;

  // Can format user partitions
  const canFormat = selectedRow?.isUserPartition && !selectedRow.formatted;

  // Can extend if there's unallocated space after a partition
  const canExtend = selectedRow?.isUserPartition && getRemainingGB() > 0.1;

  const buttons = [
    { id: 'btn-refresh', label: 'Refresh', enabled: state.partisiDibuat.length > 0 },
    { id: 'btn-delete', label: 'Delete', enabled: canDelete },
    { id: 'btn-format', label: 'Format', enabled: canFormat },
    { id: 'btn-new', label: 'New', enabled: canNew },
    { id: 'btn-loaddriver', label: 'Load Driver', enabled: false },
  ];

  btnContainer.innerHTML = buttons.map((btn, i) => {
    const focused = (partisiNav.focusArea === 'buttons' && i === partisiNav.focusedBtn) ? 'focused' : '';
    return `<button class="partisi-btn ${focused}" id="${btn.id}" ${!btn.enabled ? 'disabled' : ''}>${btn.label}</button>`;
  }).join('');

  const nextBtn = document.getElementById('btn-next');
  const nextFocused = (partisiNav.focusArea === 'next') ? 'focused' : '';
  nextBtn.className = `partisi-btn ${nextFocused}`;
}

function renderSizeDialog() {
  const dialog = document.getElementById('size-dialog');
  if (!partisiNav.sizeDialogOpen) {
    dialog.classList.add('hidden');
    return;
  }
  dialog.classList.remove('hidden');

  const remaining = getRemainingGB();
  const input = document.getElementById('input-size');
  input.max = Math.floor(remaining * 10) / 10;

  if (partisiNav.sizeDialogJustOpened) {
    input.value = Math.floor(remaining * 10) / 10;
    partisiNav.sizeDialogJustOpened = false;
  }
  input.focus();
  input.select();
}

function renderConfirmDialog() {
  const dialog = document.getElementById('confirm-dialog');
  if (!partisiNav.confirmDialogOpen) {
    dialog.classList.add('hidden');
    return;
  }
  dialog.classList.remove('hidden');
  const noBtn = document.getElementById('btn-confirm-no');
  const yesBtn = document.getElementById('btn-confirm-yes');
  noBtn.className = `partisi-btn confirm-no ${partisiNav.confirmDialogBtn === 0 ? 'focused' : ''}`;
  yesBtn.className = `partisi-btn confirm-yes ${partisiNav.confirmDialogBtn === 1 ? 'focused' : ''}`;
}

// ============================================
// KEYBOARD HANDLING
// ============================================
export function handlePartisiKey(e, onNext) {
  const key = e.key;

  // Confirm dialog open
  if (partisiNav.confirmDialogOpen) {
    handleConfirmDialogKey(e, onNext);
    renderPartisi();
    return;
  }

  // Size dialog open
  if (partisiNav.sizeDialogOpen) {
    handleSizeDialogKey(e);
    return;
  }

  switch (key) {
    case 'ArrowUp':
      if (partisiNav.focusArea === 'table') {
        partisiNav.selectedRow = Math.max(0, partisiNav.selectedRow - 1);
      }
      break;
    case 'ArrowDown':
      if (partisiNav.focusArea === 'table') {
        const rows = getPartitionRows();
        partisiNav.selectedRow = Math.min(rows.length - 1, partisiNav.selectedRow + 1);
      }
      break;
    case 'Tab':
      e.preventDefault();
      if (e.shiftKey) {
        if (partisiNav.focusArea === 'next') {
          partisiNav.focusArea = 'buttons'; partisiNav.focusedBtn = 4;
        } else if (partisiNav.focusArea === 'buttons') {
          if (partisiNav.focusedBtn > 0) partisiNav.focusedBtn--;
          else partisiNav.focusArea = 'table';
        } else {
          partisiNav.focusArea = 'next';
        }
      } else {
        if (partisiNav.focusArea === 'table') {
          partisiNav.focusArea = 'buttons'; partisiNav.focusedBtn = 0;
        } else if (partisiNav.focusArea === 'buttons') {
          if (partisiNav.focusedBtn < 4) partisiNav.focusedBtn++;
          else partisiNav.focusArea = 'next';
        } else {
          partisiNav.focusArea = 'table';
        }
      }
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      handlePartisiAction(onNext);
      break;
  }

  renderPartisi();
}

function handlePartisiAction(onNext) {
  if (partisiNav.focusArea === 'buttons') {
    const rows = getPartitionRows();
    const selectedRow = rows[partisiNav.selectedRow];

    switch (partisiNav.focusedBtn) {
      case 0: // Refresh — reset ALL partitions
        if (state.partisiDibuat.length > 0) {
          state.partisiDibuat = [];
          partisiNav.selectedRow = 0;
          partisiNav.focusArea = 'table';
        }
        break;

      case 1: // Delete — only last user partition can be deleted (bottom first)
        if (selectedRow?.isUserPartition && selectedRow.index === state.partisiDibuat.length - 1) {
          state.partisiDibuat.splice(selectedRow.index, 1);
          relabelPartitions();
          partisiNav.selectedRow = Math.max(0, partisiNav.selectedRow - 1);
          partisiNav.focusArea = 'table';
        }
        break;

      case 2: // Format — mark partition as formatted (NTFS)
        if (selectedRow?.isUserPartition && !selectedRow.formatted) {
          state.partisiDibuat[selectedRow.index].formatted = true;
        }
        break;

      case 3: // New — open size dialog with pre-filled remaining space
        if (selectedRow?.isUnallocated && getRemainingGB() > 0.5) {
          partisiNav.sizeDialogOpen = true;
          partisiNav.sizeDialogJustOpened = true;
          setTimeout(() => {
            renderSizeDialog();
          }, 50);
        }
        break;

      case 4: // Load Driver — disabled, no-op
        break;
    }
  } else if (partisiNav.focusArea === 'next') {
    // Show confirm dialog instead of immediately submitting
    partisiNav.confirmDialogOpen = true;
    partisiNav.confirmDialogBtn = 0; // Default to "Tidak, Kembali"
  }
}

function handleConfirmDialogKey(e, onNext) {
  const key = e.key;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Tab':
      e.preventDefault();
      partisiNav.confirmDialogBtn = partisiNav.confirmDialogBtn === 0 ? 1 : 0;
      break;
    case 'Enter':
      e.preventDefault();
      partisiNav.confirmDialogOpen = false;
      if (partisiNav.confirmDialogBtn === 1 && onNext) onNext();
      break;
    case 'Escape':
      e.preventDefault();
      partisiNav.confirmDialogOpen = false;
      break;
  }
}

function handleSizeDialogKey(e) {
  const key = e.key;
  if (key === 'Enter') {
    e.preventDefault();
    applySizeInput();
  } else if (key === 'Escape') {
    partisiNav.sizeDialogOpen = false;
    renderPartisi();
  }
}

function applySizeInput() {
  const input = document.getElementById('input-size');
  const sizeGB = parseFloat(input.value);
  const remaining = getRemainingGB();

  if (isNaN(sizeGB) || sizeGB < 1 || sizeGB > remaining + 0.01) {
    input.style.borderColor = '#ff4444';
    setTimeout(() => { input.style.borderColor = ''; }, 500);
    return;
  }

  const driveLetters = ['C', 'D', 'E', 'F', 'G', 'H'];
  const labelIndex = state.partisiDibuat.length;
  const label = labelIndex < driveLetters.length ? driveLetters[labelIndex] + ':' : `Part${labelIndex + 1}:`;

  state.partisiDibuat.push({ label, sizeGB, formatted: false });
  partisiNav.sizeDialogOpen = false;
  partisiNav.focusArea = 'table';

  const rows = getPartitionRows();
  partisiNav.selectedRow = Math.max(0, rows.length - 2);

  renderPartisi();
}

function relabelPartitions() {
  const driveLetters = ['C', 'D', 'E', 'F', 'G', 'H'];
  state.partisiDibuat.forEach((p, i) => {
    p.label = i < driveLetters.length ? driveLetters[i] + ':' : `Part${i + 1}:`;
  });
}

// ============================================
// VALIDATION
// ============================================
export function validatePartitions() {
  const soal = state.soalPartisi;
  if (!soal) return { valid: false, errors: ['Soal tidak ditemukan'] };

  const results = [];
  const expectedCount = soal.partisi.length;

  let fixedTotal = 0;
  soal.partisi.forEach(p => { if (p.tipe === 'angka') fixedTotal += p.target; });

  let expectedSisa = TOTAL_DISK_GB - SYSTEM_RESERVED_GB - fixedTotal;
  if (soal.hasUnallocated && soal.unallocatedTarget) expectedSisa -= soal.unallocatedTarget;

  soal.partisi.forEach((expected, i) => {
    const actual = state.partisiDibuat[i];
    if (!actual) {
      results.push({ label: expected.label, correct: false,
        message: `Partisi ${expected.label} tidak dibuat`,
        expected: expected.tipe === 'sisa' ? `Sisa (±${expectedSisa.toFixed(0)} GB)` : `${expected.target} GB`,
        actual: 'Tidak ada' });
      return;
    }

    if (expected.tipe === 'angka') {
      const diff = Math.abs(actual.sizeGB - expected.target);
      const correct = diff <= expected.toleransi;
      results.push({ label: expected.label, correct,
        message: correct
          ? `${expected.label} ${actual.sizeGB.toFixed(1)} GB ✓`
          : `${expected.label} kamu buat ${actual.sizeGB.toFixed(1)} GB, soal = ${expected.target} GB (selisih ${diff.toFixed(1)} GB > toleransi ±${expected.toleransi} GB)`,
        expected: `${expected.target} GB`, actual: `${actual.sizeGB.toFixed(1)} GB` });
    } else if (expected.tipe === 'sisa') {
      const diff = Math.abs(actual.sizeGB - expectedSisa);
      const correct = actual.sizeGB >= 1 && diff <= TOLERANCE_GB;
      results.push({ label: expected.label, correct,
        message: correct
          ? `${expected.label} ${actual.sizeGB.toFixed(1)} GB (Sisa) ✓`
          : `${expected.label} kamu buat ${actual.sizeGB.toFixed(1)} GB, seharusnya ±${expectedSisa.toFixed(0)} GB`,
        expected: `Sisa (±${expectedSisa.toFixed(0)} GB)`, actual: `${actual.sizeGB.toFixed(1)} GB` });
    }
  });

  if (state.partisiDibuat.length > expectedCount) {
    results.push({ label: 'Extra', correct: false,
      message: `Terlalu banyak partisi: dibuat ${state.partisiDibuat.length}, soal butuh ${expectedCount}`,
      expected: `${expectedCount} partisi`, actual: `${state.partisiDibuat.length} partisi` });
  }

  if (soal.hasUnallocated && soal.unallocatedTarget) {
    const remaining = getRemainingGB();
    const diff = Math.abs(remaining - soal.unallocatedTarget);
    const correct = diff <= TOLERANCE_GB;
    results.push({ label: 'Unallocated', correct,
      message: correct ? `Unallocated ${remaining.toFixed(1)} GB ✓` : `Unallocated: ${remaining.toFixed(1)} GB, soal = ${soal.unallocatedTarget} GB`,
      expected: `${soal.unallocatedTarget} GB`, actual: `${remaining.toFixed(1)} GB` });
  }

  const allCorrect = results.every(r => r.correct);
  const correctCount = results.filter(r => r.correct).length;
  return { results, allCorrect, correctCount, totalChecks: results.length };
}
