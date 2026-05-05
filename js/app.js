// ============================================
// MAIN APP — Entry Point & Phase Management
// ============================================
import { state, biosNav, partisiNav, resetState, formatTime, getRemainingSeconds } from './state.js';
import { bankSoal } from './data.js';
import { renderBios, handleBiosKey } from './bios.js';
import { renderPartisi, handlePartisiKey } from './partisi.js';
import { renderResults, renderLeaderboard } from './scoring.js';

// Avoid repeating the same soal consecutively
let lastSoalId = null;
function pickRandomSoal() {
  let available = bankSoal.filter(s => s.id !== lastSoalId);
  if (available.length === 0) available = bankSoal;
  const picked = available[Math.floor(Math.random() * available.length)];
  lastSoalId = picked.id;
  state.soalPartisi = picked;
}

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function setPhase(phase) {
  state.phase = phase;
  const timerEl = document.getElementById('timer-display');

  switch (phase) {
    case 'START':
      showScreen('screen-start'); timerEl.style.display = 'none'; break;
    case 'POST1':
      showScreen('screen-post'); timerEl.style.display = 'block'; renderPost1(); break;
    case 'BIOS1':
      showScreen('screen-bios'); state.session = 1;
      biosNav.currentTab = 0; biosNav.currentItem = 0; biosNav.currentSubMenu = null;
      renderBios(); break;
    case 'SAVING1':
      state.bios1.saved = true; showSavingAnimation(() => setPhase('POST2')); break;
    case 'POST2':
      showScreen('screen-post'); renderPost2(); break;
    case 'BIOS2':
      showScreen('screen-bios'); state.session = 2;
      biosNav.currentTab = 0; biosNav.currentItem = 0; biosNav.currentSubMenu = null;
      renderBios(); break;
    case 'SAVING2':
      state.bios2.saved = true; showSavingAnimation(() => setPhase('BOOT')); break;
    case 'BOOT':
      showScreen('screen-boot'); renderBootScreen(); break;
    case 'WIN_LANG':
      showScreen('screen-winsetup'); renderWinLang(); break;
    case 'WIN_INSTALL':
      showScreen('screen-winsetup'); renderWinInstallNow(); break;
    case 'WIN_LICENSE':
      showScreen('screen-winsetup'); renderWinLicense(); break;
    case 'WIN_TYPE':
      showScreen('screen-winsetup'); renderWinType(); break;
    case 'PARTISI':
      showScreen('screen-partisi');
      partisiNav.selectedRow = 0; partisiNav.focusArea = 'table'; partisiNav.focusedBtn = 0;
      renderPartisi(); break;
    case 'HASIL':
      stopTimer(); showScreen('screen-hasil');
      renderResults(() => { resetState(); setPhase('START'); }, () => setPhase('LEADERBOARD')); break;
    case 'LEADERBOARD':
      showScreen('screen-leaderboard');
      renderLeaderboard(() => state.nama ? setPhase('HASIL') : setPhase('START')); break;
    case 'PANDUAN':
      showScreen('screen-panduan'); renderPanduan(); break;
  }
}

// ============================================
// TIMER
// ============================================
function startTimer() {
  state.startTime = Date.now(); state.elapsedSeconds = 0; updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
    updateTimerDisplay();
    if (getRemainingSeconds() <= 0) { stopTimer(); setPhase('HASIL'); }
  }, 1000);
}
function stopTimer() { if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; } }
function updateTimerDisplay() {
  const r = getRemainingSeconds();
  const el = document.getElementById('timer-display');
  el.textContent = formatTime(r);
  el.className = r > 600 ? 'timer-green' : r > 300 ? 'timer-yellow' : 'timer-red';
}

// ============================================
// POST SCREENS
// ============================================
function renderPost1() {
  const content = document.getElementById('post-content');
  content.innerHTML = '';
  const lines = ['American Megatrends, Inc.','','AMIBIOS (C)2007 American Megatrends, Inc.','BIOS Version  : 02.58','Build Date    : 04/19/07','','Checking Memory...'];
  let i = 0;
  const type = () => {
    if (state.phase !== 'POST1') return;
    if (i < lines.length) { content.textContent += lines[i] + '\n'; i++; setTimeout(type, 120); }
    else {
      setTimeout(() => {
        if (state.phase !== 'POST1') return;
        content.textContent = lines.slice(0,6).join('\n') + '\nChecking Memory... 4096 MB OK\n\n';
        content.innerHTML += '<span class="post-highlight">Press DEL to run Setup</span>\n';
        content.innerHTML += 'Press F8 for BBS POPUP\n';
        state.postDelPressed = false;
        state.postTimeout = setTimeout(() => {
          if (state.phase === 'POST1' && !state.postDelPressed) {
            content.innerHTML += '\n<span class="os-not-found">Operating System Not Found</span>\nRestarting...\n';
            setTimeout(() => { if (state.phase === 'POST1') renderPost1(); }, 2000);
          }
        }, 5000);
      }, 400);
    }
  };
  type();
}

function renderPost2() {
  const content = document.getElementById('post-content');
  const sata1 = state.bios1.ataIdeConfig !== 'Disabled' ? 'MidasForce SSD 256' : 'Not Detected';
  const usb = state.bios1.usb2Controller === 'Enabled' ? '\nUSB Device Detected  : Sandisk' : '';
  const text = `American Megatrends, Inc.\n\nAMIBIOS (C)2007 American Megatrends, Inc.\nBIOS Version  : 02.58\nBuild Date    : 04/19/07\n\nChecking Memory... 4096 MB OK\nPrimary IDE Master   : Not Detected\nPrimary IDE Slave    : Not Detected\nSATA 1               : ${sata1}\nSATA 2               : Not Detected\nSATA 3               : Not Detected\nSATA 4               : Not Detected${usb}\n`;
  content.textContent = '';
  const lines = text.split('\n');
  let i = 0;
  const type = () => {
    if (state.phase !== 'POST2') return;
    if (i < lines.length) { content.textContent += lines[i] + '\n'; i++; setTimeout(type, 80); }
    else {
      content.innerHTML += '\n<span class="post-highlight">Press DEL to run Setup</span>\nPress F8 for BBS POPUP\n';
      state.postDelPressed = false;
      state.postTimeout = setTimeout(() => {
        if (state.phase === 'POST2' && !state.postDelPressed) {
          content.innerHTML += '\n<span class="os-not-found">Operating System Not Found</span>\nRestarting...\n';
          setTimeout(() => { if (state.phase === 'POST2') renderPost2(); }, 2000);
        }
      }, 5000);
    }
  };
  type();
}

// ============================================
// SAVING ANIMATION
// ============================================
function showSavingAnimation(cb) {
  showScreen('screen-post');
  const c = document.getElementById('post-content');
  c.innerHTML = '<div class="saving-screen">Saving configuration...</div>';
  setTimeout(() => {
    c.innerHTML = '<div class="saving-screen">Saving configuration...\nSystem will now reset.</div>';
    setTimeout(() => { c.innerHTML = '<div class="saving-screen">Restarting...</div>'; setTimeout(cb, 800); }, 1000);
  }, 1000);
}

// ============================================
// BOOT SCREEN
// ============================================
function renderBootScreen() {
  const c = document.getElementById('boot-content');
  c.textContent = '\n\n\n  Press any key to boot from CD or DVD...';
  const handler = (e) => {
    if (state.phase !== 'BOOT') { document.removeEventListener('keydown', handler); return; }
    document.removeEventListener('keydown', handler);
    c.innerHTML = '\n\n\n\n\n\n\n\n\n\n\n\n              Windows is loading files...\n';
    let p = 0;
    const iv = setInterval(() => {
      p += 5;
      const bar = '█'.repeat(Math.floor(p/5)) + '░'.repeat(20-Math.floor(p/5));
      c.innerHTML = `\n\n\n\n\n\n\n\n\n\n\n\n              Windows is loading files...\n              <span class="boot-progress">[${bar}] ${p}%</span>`;
      if (p >= 100) { clearInterval(iv); setTimeout(() => { pickRandomSoal(); state.partisiDibuat = []; setPhase('WIN_LANG'); }, 500); }
    }, 120);
  };
  setTimeout(() => { if (state.phase === 'BOOT') document.addEventListener('keydown', handler); }, 300);
}

// ============================================
// WINDOWS INSTALLER SCREENS
// ============================================
function getWinSetupContainer() {
  return document.getElementById('winsetup-content');
}

// Track which item is focused in Windows Setup screens
let winFocus = 0;

function renderWinLang() {
  getWinSetupContainer().innerHTML = `
    <div class="winsetup-container">
      <div class="winsetup-header">Windows Setup</div>
      <div class="winsetup-body">
        <div class="winsetup-content">
          <div class="winsetup-field"><label>Language to install:</label>
            <select><option>English (United States)</option></select></div>
          <div class="winsetup-field"><label>Time and currency format:</label>
            <select><option>English (United States)</option></select></div>
          <div class="winsetup-field"><label>Keyboard or input method:</label>
            <select><option>US</option></select></div>
        </div>
      </div>
      <div class="winsetup-footer">
        <button class="winsetup-btn focused" id="win-lang-next">Next</button>
      </div>
    </div>`;
  document.getElementById('win-lang-next').addEventListener('click', () => setPhase('WIN_INSTALL'));
  document.getElementById('win-lang-next').focus();
}

function renderWinInstallNow() {
  getWinSetupContainer().innerHTML = `
    <div class="winsetup-container">
      <div class="winsetup-header">Windows Setup</div>
      <div class="winsetup-body">
        <div class="winsetup-content" style="text-align:center">
          <span class="windows-logo">⊞</span>
          <div style="margin-bottom:30px">
            <button class="winsetup-install-btn focused" id="win-install-btn">Install now</button>
          </div>
          <a href="#" style="color:#0078d7;font-size:.9em" onclick="return false">Repair your computer</a>
        </div>
      </div>
    </div>`;
  document.getElementById('win-install-btn').addEventListener('click', () => setPhase('WIN_LICENSE'));
  document.getElementById('win-install-btn').focus();
}

function renderWinLicense() {
  winFocus = 0; // 0=checkbox, 1=next button
  getWinSetupContainer().innerHTML = `
    <div class="winsetup-container">
      <div class="winsetup-header">Windows Setup</div>
      <div class="winsetup-body">
        <div class="winsetup-content">
          <h2>Applicable notices and license terms</h2>
          <div style="background:#1e1e33;border:1px solid #555;padding:12px;height:180px;overflow-y:auto;font-size:.8em;color:#999;line-height:1.6;margin-bottom:15px">
            MICROSOFT SOFTWARE LICENSE TERMS<br><br>
            WINDOWS OPERATING SYSTEM<br><br>
            IF YOU LIVE IN (OR IF YOUR PRINCIPAL PLACE OF BUSINESS IS IN) THE UNITED STATES, PLEASE READ THE BINDING ARBITRATION CLAUSE AND CLASS ACTION WAIVER IN SECTION 11. IT AFFECTS HOW DISPUTES ARE RESOLVED.<br><br>
            Thank you for choosing Microsoft!<br><br>
            Depending on how you obtained the Windows software, this is a license agreement between (i) you and the device manufacturer or software installer that distributes the software with your device; or (ii) you and Microsoft Corporation...
          </div>
          <div class="winsetup-checkbox">
            <input type="checkbox" id="license-accept">
            <label for="license-accept">I accept the license terms</label>
          </div>
        </div>
      </div>
      <div class="winsetup-footer">
        <button class="winsetup-btn" id="win-license-next" disabled>Next</button>
      </div>
    </div>`;
  document.getElementById('license-accept').addEventListener('change', (e) => {
    document.getElementById('win-license-next').disabled = !e.target.checked;
  });
  document.getElementById('win-license-next').addEventListener('click', () => setPhase('WIN_TYPE'));
  document.getElementById('license-accept').focus();
}

function renderWinType() {
  winFocus = 1; // 0=upgrade, 1=custom (default to custom)
  getWinSetupContainer().innerHTML = `
    <div class="winsetup-container">
      <div class="winsetup-header">Windows Setup</div>
      <div class="winsetup-body">
        <div class="winsetup-content">
          <h2>Which type of installation do you want?</h2>
          <div class="winsetup-choice">
            <div class="winsetup-choice-item" id="win-upgrade" tabindex="0">
              <h3>Upgrade: Install Windows and keep files, settings, and applications</h3>
              <p>The files, settings, and applications are moved to Windows with this option. This option is only available when a supported version of Windows is already running.</p>
            </div>
            <div class="winsetup-choice-item selected" id="win-custom" tabindex="0">
              <h3>Custom: Install Windows only (advanced)</h3>
              <p>The files, settings, and applications aren't kept with this option. If you want to make changes to partitions and drives, start the computer using the installation disc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('win-custom').addEventListener('click', () => setPhase('PARTISI'));
  document.getElementById('win-upgrade').addEventListener('click', () => {
    document.getElementById('win-upgrade').style.opacity = '0.5';
    setTimeout(() => { document.getElementById('win-upgrade').style.opacity = '1'; }, 500);
  });
  updateWinTypeFocus();
}

function updateWinTypeFocus() {
  const up = document.getElementById('win-upgrade');
  const cu = document.getElementById('win-custom');
  if (!up || !cu) return;
  up.classList.toggle('selected', winFocus === 0);
  cu.classList.toggle('selected', winFocus === 1);
}

function handleWinSetupKey(e) {
  const key = e.key;
  switch (state.phase) {
    case 'WIN_LANG':
      if (key === 'Enter') { e.preventDefault(); setPhase('WIN_INSTALL'); }
      break;
    case 'WIN_INSTALL':
      if (key === 'Enter') { e.preventDefault(); setPhase('WIN_LICENSE'); }
      break;
    case 'WIN_LICENSE':
      if (key === 'Tab') {
        e.preventDefault();
        const cb = document.getElementById('license-accept');
        const btn = document.getElementById('win-license-next');
        winFocus = winFocus === 0 ? 1 : 0;
        if (winFocus === 0) cb.focus(); else btn.focus();
      } else if (key === ' ' && document.activeElement?.id === 'license-accept') {
        // Let default checkbox behavior work
      } else if (key === 'Enter') {
        e.preventDefault();
        const btn = document.getElementById('win-license-next');
        if (!btn.disabled) setPhase('WIN_TYPE');
      }
      break;
    case 'WIN_TYPE':
      if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Tab') {
        e.preventDefault();
        winFocus = winFocus === 0 ? 1 : 0;
        updateWinTypeFocus();
      } else if (key === 'Enter') {
        e.preventDefault();
        if (winFocus === 1) setPhase('PARTISI');
        else {
          const up = document.getElementById('win-upgrade');
          if (up) { up.style.opacity = '0.5'; setTimeout(() => { up.style.opacity = '1'; }, 500); }
        }
      }
      break;
  }
}

// ============================================
// PANDUAN
// ============================================
function renderPanduan() {
  document.getElementById('panduan-container').innerHTML = `
    <div class="panduan-title">📖 PANDUAN SIMULASI</div>
    <div class="panduan-section"><h3>🎯 Tujuan</h3><p>Simulasi ini meniru proses konfigurasi BIOS AMIBIOS dan partisi HDD untuk instalasi Windows 10 via USB Flashdisk. Waktu: <strong>20 menit</strong>.</p></div>
    <div class="panduan-section"><h3>📋 Alur</h3><ul>
      <li><strong>BIOS Sesi 1:</strong> Disable Floppy, ATA/IDE → Enhanced, USB → Enabled</li>
      <li><strong>Save & Restart (F10)</strong></li>
      <li><strong>BIOS Sesi 2:</strong> Boot priority — USB Sandisk jadi 1st</li>
      <li><strong>Save & Boot → Windows Setup → Partisi HDD</strong></li>
    </ul></div>
    <div class="panduan-section"><h3>⌨️ Navigasi BIOS</h3><ul>
      <li><span class="panduan-key">←</span> <span class="panduan-key">→</span> Pindah tab</li>
      <li><span class="panduan-key">↑</span> <span class="panduan-key">↓</span> Navigasi item</li>
      <li><span class="panduan-key">Enter</span> Masuk sub-menu / pilih</li>
      <li><span class="panduan-key">ESC</span> Kembali</li>
      <li><span class="panduan-key">F10</span> Save and Exit</li>
      <li><span class="panduan-key">+</span> <span class="panduan-key">-</span> Ganti nilai</li>
      <li><span class="panduan-key">DEL</span> Masuk BIOS (POST screen)</li>
    </ul></div>
    <div class="panduan-section"><h3>⌨️ Navigasi Partisi</h3><ul>
      <li><span class="panduan-key">↑</span> <span class="panduan-key">↓</span> Pilih partisi</li>
      <li><span class="panduan-key">Tab</span> / <span class="panduan-key">Shift+Tab</span> Pindah tombol</li>
      <li><span class="panduan-key">Enter</span> / <span class="panduan-key">Spasi</span> Klik tombol</li>
    </ul></div>
    <div class="panduan-section"><h3>📊 Penilaian (100 poin)</h3><ul>
      <li>Legacy Diskette → Disabled: <strong>10</strong></li>
      <li>ATA/IDE → Enhanced: <strong>10</strong></li>
      <li>USB 2.0 → Enabled: <strong>15</strong></li>
      <li>HDD Drives: Sandisk 1st: <strong>15</strong></li>
      <li>Boot Priority: Sandisk 1st: <strong>15</strong></li>
      <li>Partisi sesuai soal: <strong>35</strong></li>
    </ul></div>
    <button class="panduan-btn" id="btn-panduan-back">Kembali</button>`;
  document.getElementById('btn-panduan-back').addEventListener('click', () => setPhase('START'));
}

// ============================================
// KEYBOARD HANDLER
// ============================================
function handleKeyDown(e) {
  switch (state.phase) {
    case 'POST1':
      if (e.key === 'Delete') { state.postDelPressed = true; if (state.postTimeout) clearTimeout(state.postTimeout); setPhase('BIOS1'); }
      break;
    case 'BIOS1':
      e.preventDefault(); handleBiosKey(e, () => setPhase('SAVING1')); break;
    case 'POST2':
      if (e.key === 'Delete') { state.postDelPressed = true; if (state.postTimeout) clearTimeout(state.postTimeout); setPhase('BIOS2'); }
      break;
    case 'BIOS2':
      e.preventDefault(); handleBiosKey(e, () => setPhase('SAVING2')); break;
    case 'WIN_LANG':
    case 'WIN_INSTALL':
    case 'WIN_LICENSE':
    case 'WIN_TYPE':
      handleWinSetupKey(e); break;
    case 'PARTISI':
      handlePartisiKey(e, () => setPhase('HASIL')); break;
  }
}

// ============================================
// INIT
// ============================================
function init() {
  document.getElementById('btn-mulai').addEventListener('click', () => {
    const nama = document.getElementById('input-nama').value.trim();
    if (nama.length < 2) { document.getElementById('error-nama').textContent = 'Nama minimal 2 karakter!'; return; }
    document.getElementById('error-nama').textContent = '';
    state.nama = nama; startTimer(); setPhase('POST1');
  });
  document.getElementById('input-nama').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('btn-mulai').click(); });
  document.getElementById('btn-panduan').addEventListener('click', () => setPhase('PANDUAN'));
  document.getElementById('btn-leaderboard').addEventListener('click', () => { state.nama = ''; setPhase('LEADERBOARD'); });
  document.addEventListener('keydown', handleKeyDown);
  setPhase('START');
  document.getElementById('input-nama').focus();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
